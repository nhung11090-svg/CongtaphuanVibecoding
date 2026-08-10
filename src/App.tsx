import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { PromptBuilder } from './components/PromptBuilder';
import { CoursePlayer } from './components/CoursePlayer';
import { SandboxPreview } from './components/SandboxPreview';
import { SavedPrompts } from './components/SavedPrompts';
import { RightSidebarNav } from './components/RightSidebarNav';
import { Footer } from './components/Footer';
import { ActiveTab, SavedPrompt, PromptVariables, UsageStats, SavedPromptStatus } from './types';
import { PRESET_TEMPLATES } from './data/presets';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // LocalStorage state persistence
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => {
    try {
      const stored = localStorage.getItem('fpt_saved_prompts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fpt_completed_lessons');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [usageStats, setUsageStats] = useState<UsageStats>(() => {
    try {
      const stored = localStorage.getItem('fpt_usage_stats');
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return {
      promptsGenerated: 6,
      promptsCopied: 4,
      lessonsCompleted: ['1.1'],
      popularSubjects: {
        'Lịch sử': 5,
        'Khoa học tự nhiên': 3,
        'Tiếng Anh': 2,
        'Toán học': 2,
        'Ngữ văn': 1,
      },
      lastActive: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fpt_saved_prompts', JSON.stringify(savedPrompts));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [savedPrompts]);

  useEffect(() => {
    try {
      localStorage.setItem('fpt_completed_lessons', JSON.stringify(completedLessons));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [completedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem('fpt_usage_stats', JSON.stringify(usageStats));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [usageStats]);

  // Handlers
  const handleCopyPrompt = (promptText: string, vars: PromptVariables) => {
    setUsageStats(prev => {
      const currentSubject = vars.subject || 'Khác';
      const subjectCounts = { ...prev.popularSubjects };
      subjectCounts[currentSubject] = (subjectCounts[currentSubject] || 0) + 1;

      return {
        ...prev,
        promptsCopied: prev.promptsCopied + 1,
        promptsGenerated: prev.promptsGenerated + 1,
        popularSubjects: subjectCounts,
        lastActive: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
    });
  };

  const handleSavePrompt = (newPrompt: SavedPrompt) => {
    setSavedPrompts(prev => [newPrompt, ...prev]);
    setUsageStats(prev => ({
      ...prev,
      promptsGenerated: prev.promptsGenerated + 1,
    }));
  };

  const handleDeletePrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdatePromptStatus = (id: string, status: SavedPromptStatus) => {
    setSavedPrompts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleMarkLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      setUsageStats(prev => ({
        ...prev,
        lessonsCompleted: updated,
      }));
    }
  };

  const handleResetCourse = () => {
    setCompletedLessons([]);
    setUsageStats(prev => ({
      ...prev,
      lessonsCompleted: [],
    }));
    try {
      localStorage.setItem('fpt_completed_lessons', JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadPromptToBuilder = (variables: PromptVariables) => {
    setActiveTab('builder');
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#1A202C] flex flex-col font-sans antialiased selection:bg-amber-300 selection:text-blue-950">
      {/* Header */}
      <Header
        promptsGenerated={usageStats.promptsGenerated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Main Content Pane */}
          <div className="flex-1 min-w-0 w-full">
            {activeTab === 'overview' && (
              <Overview onNavigate={setActiveTab} />
            )}

            {activeTab === 'sandbox' && (
              <SandboxPreview onNextStep={() => setActiveTab('course')} />
            )}

            {activeTab === 'course' && (
              <CoursePlayer
                completedLessons={completedLessons}
                onMarkLessonComplete={handleMarkLessonComplete}
                onResetCourse={handleResetCourse}
                onNextStep={() => setActiveTab('builder')}
              />
            )}

            {activeTab === 'builder' && (
              <PromptBuilder
                onCopyPrompt={handleCopyPrompt}
                onSavePrompt={handleSavePrompt}
                onLaunchSandbox={() => setActiveTab('sandbox')}
              />
            )}

            {activeTab === 'saved' && (
              <SavedPrompts
                savedPrompts={savedPrompts}
                onDeletePrompt={handleDeletePrompt}
                onUpdateStatus={handleUpdatePromptStatus}
                onLoadPrompt={handleLoadPromptToBuilder}
                onCopyPromptText={() => {
                  setUsageStats(prev => ({
                    ...prev,
                    promptsCopied: prev.promptsCopied + 1,
                  }));
                }}
              />
            )}
          </div>

          {/* Floating Right Sidebar Navigation */}
          <RightSidebarNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            savedCount={savedPrompts.length}
            completedLessonsCount={completedLessons.length}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
