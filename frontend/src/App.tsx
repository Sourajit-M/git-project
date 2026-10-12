import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { DashboardView } from './components/views/DashboardView';
import { CommitGeneratorView } from './components/views/CommitGeneratorView';
import { PrGeneratorView } from './components/views/PrGeneratorView';
import { ReleaseNotesView } from './components/views/ReleaseNotesView';
import { HistoryView } from './components/views/HistoryView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { LayoutDashboard, GitCommit, GitPullRequest, Tag, History, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'commits':
        return <CommitGeneratorView />;
      case 'prs':
        return <PrGeneratorView />;
      case 'releases':
        return <ReleaseNotesView />;
      case 'history':
        return <HistoryView />;
      case 'architecture':
        return <ArchitectureView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#161b22] border-t border-[#30363d] flex items-center justify-around z-30 px-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeTab === 'dashboard' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Hub</span>
        </button>
        <button
          onClick={() => setActiveTab('commits')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeTab === 'commits' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Commit</span>
        </button>
        <button
          onClick={() => setActiveTab('prs')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeTab === 'prs' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>PR</span>
        </button>
        <button
          onClick={() => setActiveTab('releases')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeTab === 'releases' ? 'text-purple-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Release</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeTab === 'history' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex flex-col items-center gap-1 text-[10px] ${
            activeTab === 'architecture' ? 'text-sky-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Arch</span>
        </button>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export default App;
