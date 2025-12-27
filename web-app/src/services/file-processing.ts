import * as pdfjsLib from 'pdfjs-dist';

// Define the worker source. 
// In a Vite environment, we can use the URL import query to get the worker URL.
// Ensure pdfjs-dist is installed.
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ProcessedFile {
    name: string;
    type: string;
    content: string;
}

export const processFile = async (file: File): Promise<ProcessedFile> => {
    let content = '';

    if (file.type === 'application/pdf') {
        content = await extractTextFromPDF(file);
    } else if (file.type === 'image/svg+xml') {
        content = await readTextFile(file);
    } else if (file.type.startsWith('image/')) {
        content = await readDataURL(file);
    } else {
        // Treat as text (CSV, MD, TXT, JSON, etc.)
        content = await readTextFile(file);
    }

    return {
        name: file.name,
        type: file.type,
        content,
    };
};

const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};

const readDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
};

const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
        fullText += `\n--- Page ${i} ---\n${pageText}`;
    }

    return fullText;
};
