import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle, Paperclip, X, FileText } from 'lucide-react';
import { useOpenAI } from '../hooks/useOpenAI';
import { createOpenAIClient } from '../services/openai';
import { SYSTEM_PROMPT } from '../constants';
import { cn } from '../utils/cn';
import { processFile, type ProcessedFile } from '../services/file-processing';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ChatInterfaceProps {
    config: ReturnType<typeof useOpenAI>['config'];
    onCodeChange: (code: string, isGenerating: boolean) => void;
    onSaveSuccess?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ config, onCodeChange, onSaveSuccess }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attachedFiles, setAttachedFiles] = useState<ProcessedFile[]>([]);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsProcessingFile(true);
        setError(null);
        try {
            const files = Array.from(e.target.files);
            const processed: ProcessedFile[] = [];

            for (const file of files) {
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`文件 ${file.name} 过大 (最大 5MB)`);
                }
                const result = await processFile(file);
                processed.push(result);
            }

            setAttachedFiles(prev => [...prev, ...processed]);
        } catch (err: any) {
            setError(err.message || "处理文件失败");
        } finally {
            setIsProcessingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && attachedFiles.length === 0) || isLoading || isProcessingFile) return;

        if (!config.apiKey) {
            setError("请先在设置中配置 API Key。");
            return;
        }

        const contentBlocks: any[] = [];

        // Add text input if present
        if (input.trim()) {
            contentBlocks.push({ type: 'text', text: input });
        }

        // Process attachments
        const textAttachments: ProcessedFile[] = [];
        const imageAttachments: ProcessedFile[] = [];

        attachedFiles.forEach(f => {
            if (f.type.startsWith('image/')) {
                imageAttachments.push(f);
            } else {
                textAttachments.push(f);
            }
        });

        // Add text attachments as context
        if (textAttachments.length > 0) {
            const fileContext = textAttachments.map(f =>
                `\n\n--- 文件开始: ${f.name} ---\n${f.content}\n--- 文件结束: ${f.name} ---`
            ).join('');
            contentBlocks.push({ type: 'text', text: `\n\n以下是附件文本内容：\n${fileContext}` });
        }

        // Add image attachments
        imageAttachments.forEach(img => {
            contentBlocks.push({
                type: 'image_url',
                image_url: { url: img.content }
            });
        });

        const displayFiles = attachedFiles.map(f => `[附件: ${f.name}]`).join(' ');
        const displayContent = input + (displayFiles ? `\n${displayFiles}` : '');

        setMessages(prev => [...prev, { role: 'user', content: displayContent }]);
        setInput('');
        setAttachedFiles([]);
        setIsLoading(true);
        setError(null);
        onCodeChange('', true);

        try {
            const client = createOpenAIClient(config.apiKey, config.baseURL);

            const stream = await client.chat.completions.create({
                model: config.model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages.map(m => ({ role: m.role, content: m.content })),
                    { role: 'user', content: contentBlocks }
                ] as any,
                stream: true,
            });

            let fullResponse = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    fullResponse += content;
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        newMsgs[newMsgs.length - 1].content = fullResponse;
                        return newMsgs;
                    });
                    onCodeChange(fullResponse, true);
                }
            }

            onCodeChange(fullResponse, false);

            // Save to History
            try {
                await fetch('/api/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: displayContent,
                        code: fullResponse,
                        files: attachedFiles.map(f => f.name)
                    })
                });
                if (onSaveSuccess) onSaveSuccess();
            } catch (e) {
                console.error("Failed to save history", e);
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "生成失败");
            setMessages(prev => [...prev, { role: 'assistant', content: "错误: " + (err.message || "未知错误") }]);
            onCodeChange('', false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>输入描述以生成信息图。</p>
                        <p className="text-sm mt-2">例如：“画一个公司组织架构图”</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={cn(
                        "flex gap-3 max-w-[90%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            msg.role === 'user' ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                        )}>
                            {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>

                        <div className={cn(
                            "p-3 rounded-lg text-sm whitespace-pre-wrap leading-relaxed",
                            msg.role === 'user'
                                ? "bg-blue-50 text-blue-900 rounded-tr-none"
                                : "bg-gray-100 text-gray-800 rounded-tl-none font-mono text-xs"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm mx-auto">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-gray-50 flex flex-col gap-2">
                {attachedFiles.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {attachedFiles.map((f, i) => (
                            <div key={i} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
                                <FileText className="w-3 h-3 text-gray-500" />
                                <span className="truncate max-w-[150px]" title={f.name}>{f.name}</span>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="hover:text-red-500 ml-1"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".csv,.txt,.md,.json,.pdf,.png,.jpg,.jpeg,.svg"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || isProcessingFile}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                        title="上传附件 (PDF, 文本, 图片, SVG)"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading || isProcessingFile}
                        placeholder={
                            isProcessingFile
                                ? "正在处理文件..."
                                : (config.apiKey ? "描述您想要的信息图..." : "请先在设置中配置 API Key")
                        }
                        className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-200 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || isProcessingFile || (!input.trim() && attachedFiles.length === 0) || !config.apiKey}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
