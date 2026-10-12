import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/auth';
import { Repository } from '../types/repo';
import { GenerationHistoryItem } from '../types/generator';
import { githubService } from '../services/githubService';
import { aiService } from '../services/aiService';
import { MOCK_USER, MOCK_REPOSITORIES } from '../services/mockData';

export type ActiveTab = 'dashboard' | 'commits' | 'prs' | 'releases' | 'history' | 'architecture';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  repositories: Repository[];
  selectedRepo: Repository | null;
  setSelectedRepo: (repo: Repository | null) => void;
  history: GenerationHistoryItem[];
  addToHistory: (item: Omit<GenerationHistoryItem, 'id' | 'timestamp'>) => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  toasts: Toast[];
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  loginWithGitHub: () => void;
  logout: () => void;
  refreshRepos: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gitai_demo_mode');
    return saved !== null ? saved === 'true' : true; // Default to demo mode for instant testing!
  });

  const [user, setUser] = useState<UserProfile | null>(MOCK_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [repositories, setRepositories] = useState<Repository[]>(MOCK_REPOSITORIES);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(MOCK_REPOSITORIES[0]);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDemoMode = () => {
    const next = !isDemoMode;
    setIsDemoMode(next);
    localStorage.setItem('gitai_demo_mode', String(next));
    showToast(
      next ? 'Switched to Demo Mode (Mock data)' : 'Switched to Live API Mode (Spring Boot at localhost:8080)',
      'info'
    );
  };

  const refreshRepos = async () => {
    try {
      const repos = await githubService.getRepositories(isDemoMode);
      setRepositories(repos);
      if (repos.length > 0 && !selectedRepo) {
        setSelectedRepo(repos[0]);
      }
    } catch {
      setRepositories(MOCK_REPOSITORIES);
    }
  };

  const loadHistory = async () => {
    const data = await aiService.getHistory(isDemoMode);
    setHistory(data);
  };

  useEffect(() => {
    refreshRepos();
    loadHistory();
  }, [isDemoMode]);

  const addToHistory = async (item: Omit<GenerationHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: GenerationHistoryItem = {
      ...item,
      id: `gen-${Date.now()}`,
      timestamp: 'Just now',
    };
    await aiService.saveHistory(newItem, isDemoMode);
    setHistory((prev) => [newItem, ...prev]);
  };

  const deleteHistoryItem = async (id: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== id);
      localStorage.setItem('gitai_history', JSON.stringify(filtered));
      return filtered;
    });
    showToast('Removed item from history', 'info');
  };

  const clearAllHistory = async () => {
    await aiService.clearHistory();
    setHistory([]);
    showToast('Cleared all generation history', 'info');
  };

  const loginWithGitHub = () => {
    if (isDemoMode) {
      setUser(MOCK_USER);
      setIsAuthenticated(true);
      showToast('Authenticated as ' + MOCK_USER.username, 'success');
      return;
    }
    // Redirect to Spring Boot OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };

  const logout = () => {
    localStorage.removeItem('gitai_auth_token');
    setUser(null);
    setIsAuthenticated(false);
    showToast('Signed out of GitHub', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        isAuthenticated,
        isDemoMode,
        toggleDemoMode,
        repositories,
        selectedRepo,
        setSelectedRepo,
        history,
        addToHistory,
        deleteHistoryItem,
        clearAllHistory,
        toasts,
        showToast,
        removeToast,
        loginWithGitHub,
        logout,
        refreshRepos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
