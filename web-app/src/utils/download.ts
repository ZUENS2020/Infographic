import { toPng, toSvg } from 'html-to-image';

export type ExportFormat = 'png' | 'svg' | 'json';

export const downloadImage = async (node: HTMLElement, format: ExportFormat, fileName: string, dataUrl?: string) => {
    try {
        let finalDataUrl = dataUrl;

        if (!finalDataUrl) {
            // Safety check for empty node
            if (node.childNodes.length === 0) {
                throw new Error("Preview is empty");
            }

            // Wait for all fonts to be loaded to prevent layout shifts/missing characters
            if (document.fonts) {
                await document.fonts.ready;
            }

            // Get actual dimensions to prevent relative sizing collapse during cloning
            const rect = node.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            const options = {
                backgroundColor: '#ffffff',
                width: width,
                height: height,
                style: {
                    transform: 'none', // Remove any transforms during capture
                    margin: '0',
                    padding: '0',
                },
                pixelRatio: 2, // Higher quality
            };

            switch (format) {
                case 'png':
                    finalDataUrl = await toPng(node, options);
                    break;
                case 'svg':
                    finalDataUrl = await toSvg(node, options);
                    break;
                default:
                    return;
            }
        }

        if (finalDataUrl) {
            const link = document.createElement('a');
            link.download = `${fileName}.${format}`;
            link.href = finalDataUrl;
            link.click();
        }
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
