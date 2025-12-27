import { useState } from 'react';
import { LayoutTemplate } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { PreviewPanel } from './components/PreviewPanel';
import { HistorySidebar } from './components/HistorySidebar';
import { useOpenAI } from './hooks/useOpenAI';

function App() {
  const { config } = useOpenAI();
  const [infographicCode, setInfographicCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);

  const handleCodeChange = (code: string, generating: boolean) => {
    setInfographicCode(code);
    setIsGenerating(generating);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-6 bg-white shrink-0 z-10 relative shadow-sm transition-all">
        <div className={isHistoryOpen ? "flex items-center gap-2 font-bold text-xl text-gray-800 ml-[300px] transition-all duration-300" : "flex items-center gap-2 font-bold text-xl text-gray-800 transition-all duration-300"}>
          <div className="bg-blue-600 text-white p-1 rounded">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          信息图生成器
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        <HistorySidebar
          isOpen={isHistoryOpen}
          onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
          onSelect={(code) => setInfographicCode(code)}
          refreshTrigger={historyVersion}
        />

        {/* Left: Chat */}
        <div className={`flex-shrink-0 border-r border-gray-200 transition-all duration-300 ${isHistoryOpen ? 'ml-[300px]' : ''}`} style={{ width: '400px' }}>
          <ChatInterface
            config={config}
            onCodeChange={handleCodeChange}
            onSaveSuccess={() => setHistoryVersion(v => v + 1)}
          />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 bg-gray-50 transition-all duration-300">
          <PreviewPanel
            code={infographicCode}
            isGenerating={isGenerating}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
