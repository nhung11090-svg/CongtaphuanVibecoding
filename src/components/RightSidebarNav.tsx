import React from 'react';
import { ActiveTab } from '../types';
import { 
  Compass, 
  PlayCircle, 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  ExternalLink,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface RightSidebarNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  completedLessonsCount: number;
}

export const RightSidebarNav: React.FC<RightSidebarNavProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  completedLessonsCount
}) => {
  const steps = [
    {
      id: 'overview' as ActiveTab,
      number: '',
      title: 'Tổng quan Portal',
      subtitle: 'Khám phá quy trình',
      badge: '',
      badgeColor: 'bg-purple-100 text-purple-900',
      activeBorder: 'border-purple-600 ring-2 ring-purple-200',
      activeBg: 'bg-purple-50/90 text-purple-950',
      icon: Compass,
      iconColor: 'text-purple-600',
    },
    {
      id: 'sandbox' as ActiveTab,
      number: '1',
      title: 'Demo Webapp',
      subtitle: 'Trải nghiệm thử',
      badge: 'Bước 1',
      badgeColor: 'bg-orange-100 text-orange-900 font-extrabold',
      activeBorder: 'border-orange-500 ring-2 ring-orange-200',
      activeBg: 'bg-orange-50/90 text-orange-950',
      icon: PlayCircle,
      iconColor: 'text-orange-600',
    },
    {
      id: 'course' as ActiveTab,
      number: '2',
      title: 'Khóa học tập huấn',
      subtitle: 'Phương pháp & Quiz',
      badge: 'Bước 2',
      badgeColor: 'bg-indigo-100 text-indigo-900 font-extrabold',
      activeBorder: 'border-indigo-600 ring-2 ring-indigo-200',
      activeBg: 'bg-indigo-50/90 text-indigo-950',
      icon: BookOpen,
      iconColor: 'text-indigo-600',
    },
    {
      id: 'builder' as ActiveTab,
      number: '3',
      title: 'Trình tạo Prompt',
      subtitle: 'Khởi tạo Master Prompt',
      badge: 'Bước 3',
      badgeColor: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black',
      activeBorder: 'border-orange-500 ring-2 ring-orange-200',
      activeBg: 'bg-gradient-to-r from-orange-50/90 to-amber-50/90 text-orange-950',
      icon: Sparkles,
      iconColor: 'text-orange-500',
    }
  ];

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4 lg:sticky lg:top-24 h-fit">
      {/* Navigation Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-purple-100 shadow-md">
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-purple-100/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
              FPT
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm leading-snug">Lộ trình tập huấn</h3>
              <p className="text-[11px] text-slate-500 font-medium">Chọn bước để trải nghiệm</p>
            </div>
          </div>
          <GraduationCap className="w-5 h-5 text-orange-500" />
        </div>

        {/* Step List */}
        <div className="space-y-2.5">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 border ${
                  isActive
                    ? `${step.activeBg} ${step.activeBorder} shadow-sm scale-[1.01]`
                    : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
                }`}
              >
                {/* Step Number Circle */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xs'
                    : 'bg-slate-200/90 text-slate-700'
                }`}>
                  {step.number ? step.number : <Icon className="w-4 h-4" />}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-extrabold text-xs sm:text-sm truncate ${
                      isActive ? 'text-slate-900' : 'text-slate-800'
                    }`}>
                      {step.title}
                    </span>
                    {step.badge && (
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    )}
                  </div>
                  {step.subtitle && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                      {step.subtitle}
                    </p>
                  )}
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-purple-600 translate-x-0.5' : 'text-slate-400'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Saved Prompts Quick Link */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('saved')}
            className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all border ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-950 border-orange-300 ring-2 ring-orange-200'
                : 'bg-orange-50/60 hover:bg-orange-100/80 text-orange-900 border-orange-200/80'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-orange-600" />
              <span>Kho prompt đã lưu</span>
            </div>
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-xs">
              {savedCount}
            </span>
          </button>
        </div>
      </div>

      {/* External Helper Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white p-5 rounded-3xl shadow-md space-y-3 border border-purple-800/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-orange-400 uppercase tracking-wider">Môi trường thực hành</span>
          <Sparkles className="w-4 h-4 text-orange-400" />
        </div>
        <p className="text-xs text-purple-100 leading-relaxed font-normal">
          Sau khi tạo Prompt ở Bước 3, dán trực tiếp vào Google AI Studio để sinh ứng dụng web.
        </p>
        <a
          href="https://aistudio.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
        >
          <span>Mở Google AI Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
