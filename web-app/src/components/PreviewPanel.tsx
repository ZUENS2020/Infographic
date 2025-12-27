import React, { useEffect, useRef, useState } from 'react';
import { Infographic } from '@antv/infographic';
import { Loader2, Download, ChevronDown } from 'lucide-react';
import { downloadImage, downloadText, type ExportFormat } from '../utils/download';

interface PreviewPanelProps {
    code: string;
    isGenerating: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, isGenerating }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const infographicRef = useRef<Infographic | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        try {
            containerRef.current.innerHTML = '';
            infographicRef.current = new Infographic({
                container: containerRef.current,
                width: '100%',
                height: '100%',
                editable: false,
            });
        } catch (e) {
            console.error("Failed to initialize Infographic", e);
            setError("渲染器初始化失败");
        }

        return () => {
            infographicRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!infographicRef.current || !code) return;

        try {
            let cleanCode = code;
            const match = code.match(/```plain\s*([\s\S]*?)\s*```/);
            if (match) {
                cleanCode = match[1];
            }
            if (cleanCode.startsWith('```plain')) {
                cleanCode = cleanCode.replace('```plain', '');
            }
            if (cleanCode.endsWith('```')) {
                cleanCode = cleanCode.substring(0, cleanCode.length - 3);
            }

            infographicRef.current.render(cleanCode);
            setError(null);
        } catch (e: any) {
            console.warn("Render error:", e);
            if (!isGenerating) {
                setError(e.message || "渲染失败");
            }
        }
    }, [code, isGenerating]);

    const handleDownload = async (format: ExportFormat | 'code') => {
        setIsMenuOpen(false);
        if (!containerRef.current) return;

        if (format === 'code') {
            downloadText(code, 'infographic-code', 'json');
            return;
        }

        setIsExporting(true);
        try {
            let dataUrl: string | undefined;

            // Use native export if available for better layout stability
            if (infographicRef.current && (format === 'png' || format === 'svg')) {
                try {
                    dataUrl = await infographicRef.current.toDataURL({
                        type: format,
                        dpr: 2
                    } as any);
                } catch (err) {
                    console.warn("Native export failed, falling back to html-to-image", err);
                }
            }

            await downloadImage(containerRef.current, format as ExportFormat, 'infographic', dataUrl);
        } catch (e) {
            console.error("Export failed", e);
            setError("导出失败");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 border-l border-gray-200">
            <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
                <h2 className="font-semibold text-gray-700">预览</h2>

                <div className="flex items-center gap-2">
                    {isGenerating && (
                        <div className="flex items-center text-xs text-blue-600 gap-1 mr-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            正在生成...
                        </div>
                    )}

                    {/* Download Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            disabled={!code || isGenerating || isExporting}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? '保存中...' : '下载'}
                            <ChevronDown className="w-3 h-3 ml-1" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-20 py-1 w-32 text-center">
                                <button onClick={() => handleDownload('png')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">PNG 图片</button>
                                <button onClick={() => handleDownload('svg')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">SVG 矢量图</button>
                                <div className="border-t my-1"></div>
                                <button onClick={() => handleDownload('code')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">保存代码</button>
                            </div>
                        )}
                        {isMenuOpen && (
                            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full relative overflow-hidden p-4">
                {error && (
                    <div className="absolute top-4 left-4 right-4 z-10 bg-red-50 text-red-600 px-4 py-2 rounded-md border border-red-200 text-sm">
                        {error}
                    </div>
                )}
                <div
                    ref={containerRef}
                    id="container"
                    className="w-full h-full bg-white shadow-sm rounded-lg border border-gray-100 flex items-center justify-center"
                />
            </div>
        </div>
    );
};
