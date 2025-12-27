import React, { useState, useEffect } from 'react';
import { History, X, Trash2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface HistoryItem {
    id: string;
    timestamp: string;
    prompt: string;
    code: string;
    files: string[];
}

interface HistorySidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (code: string) => void;
    refreshTrigger?: number;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
    isOpen,
    onToggle,
    onSelect,
    refreshTrigger = 0
}) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/history');
            const data = await res.json();
            setHistory(data);
        } catch (e) {
            console.error("Failed to fetch history", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen, refreshTrigger]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("确定要删除这条记录吗？")) return;

        try {
            await fetch(`/api/history/${id}`, { method: 'DELETE' });
            setHistory(prev => prev.filter(item => item.id !== id));
        } catch (e) {
            console.error("Failed to delete history item", e);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className={cn(
                    "fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white border border-l-0 rounded-r-xl p-2 shadow-md hover:bg-gray-50 transition-all duration-300",
                    isOpen ? "left-[300px]" : "left-0"
                )}
                title={isOpen ? "收起历史" : "查看历史"}
            >
                {isOpen ? <ChevronLeft className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
            </button>

            {/* Sidebar Overlay */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-30 w-[300px] bg-white border-r shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                        <History className="w-5 h-5 text-blue-600" />
                        生成历史
                    </div>
                    <button onClick={onToggle} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading && history.length === 0 ? (
                        <div className="flex justify-center py-10 text-gray-400">加载中...</div>
                    ) : history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-center space-y-2">
                            <Clock className="w-10 h-10 opacity-20" />
                            <p>暂无历史记录</p>
                        </div>
                    ) : (
                        history.map(item => (
                            <div
                                key={item.id}
                                onClick={() => onSelect(item.code)}
                                className="group relative p-3 border rounded-xl hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition-all bg-white shadow-sm"
                            >
                                <div className="text-xs text-gray-400 mb-1 flex justify-between">
                                    {new Date(item.timestamp).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-700 line-clamp-2 pr-6">
                                    {item.prompt}
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, item.id)}
                                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="删除"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};
