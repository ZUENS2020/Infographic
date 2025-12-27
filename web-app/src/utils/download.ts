import { toPng, toJpeg, toSvg } from 'html-to-image';

export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'json';

export const downloadImage = async (node: HTMLElement, format: ExportFormat, fileName: string) => {
    try {
        let dataUrl = '';

        // Safety check for empty node
        if (node.childNodes.length === 0) {
            throw new Error("Preview is empty");
        }

        switch (format) {
            case 'png':
                dataUrl = await toPng(node, { backgroundColor: '#ffffff' });
                break;
            case 'jpeg':
                dataUrl = await toJpeg(node, { backgroundColor: '#ffffff', quality: 0.95 });
                break;
            case 'svg':
                dataUrl = await toSvg(node, { backgroundColor: '#ffffff' });
                break;
            default:
                return;
        }

        const link = document.createElement('a');
        link.download = `${fileName}.${format}`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Failed to download image', err);
        throw err;
    }
};

export const downloadText = (content: string, fileName: string, extension: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${fileName}.${extension}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
};
