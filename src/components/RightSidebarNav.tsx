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
      badgeColor: 'bg-blue-100 text-[#0052CC]',
      activeBorder: 'border-blue-500 ring-2 ring-blue-200',
      activeBg: 'bg-blue-50/90 text-[#0052CC]',
      icon: Compass,
      iconColor: 'text-blue-600',
    },
    {
      id: 'sandbox' as ActiveTab,
      number: '1',
      title: 'Demo Webapp',
      subtitle: 'Trải nghiệm thử',
      badge: 'Bước 1',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-200',
      activeBg: 'bg-emerald-50/90 text-emerald-900',
      icon: PlayCircle,
      iconColor: 'text-emerald-600',
    },
    {
      id: 'course' as ActiveTab,
      number: '2',
      title: 'Khóa học tập huấn',
      subtitle: 'Phương pháp & Quiz',
      badge: 'Bước 2',
      badgeColor: 'bg-blue-100 text-blue-900',
      activeBorder: 'border-[#0052CC] ring-2 ring-blue-200',
      activeBg: 'bg-blue-50/90 text-[#0052CC]',
      icon: BookOpen,
      iconColor: 'text-[#0052CC]',
    },
    {
      id: 'builder' as ActiveTab,
      number: '3',
      title: 'Trình tạo Prompt',
      subtitle: 'Khởi tạo Master Prompt',
      badge: 'Bước 3',
      badgeColor: 'bg-amber-100 text-amber-900 font-extrabold',
      activeBorder: 'border-amber-500 ring-2 ring-amber-200',
      activeBg: 'bg-amber-50/90 text-amber-950',
      icon: Sparkles,
      iconColor: 'text-amber-500',
    }
  ];

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4 lg:sticky lg:top-24 h-fit">
      {/* Navigation Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-md">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0052CC] text-white flex items-center justify-center font-black text-xs">
              FPT
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm leading-tight">Lộ trình tập huấn</h3>
              <p className="text-[11px] text-gray-500 font-medium">Chọn bước để trải nghiệm</p>
            </div>
          </div>
          <GraduationCap className="w-5 h-5 text-amber-500" />
        </div>

        {/* Step List */}
        <div className="space-y-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 border ${
                  isActive
                    ? `${step.activeBg} ${step.activeBorder} shadow-sm scale-[1.01]`
                    : 'bg-gray-50/80 hover:bg-gray-100/80 border-gray-200/70 text-gray-700'
                }`}
              >
                {/* Step Number Circle */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                  isActive
                    ? 'bg-[#0052CC] text-white shadow-xs'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {step.number ? step.number : <Icon className="w-4 h-4" />}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-extrabold text-xs sm:text-sm truncate ${
                      isActive ? 'text-gray-900' : 'text-gray-800'
                    }`}>
                      {step.title}
                    </span>
                    {step.badge && (
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    )}
                  </div>
                  {step.subtitle && (
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {step.subtitle}
                    </p>
                  )}
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-[#0052CC] translate-x-0.5' : 'text-gray-400'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Saved Prompts Quick Link */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => setActiveTab('saved')}
            className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all border ${
              activeTab === 'saved'
                ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-200'
                : 'bg-amber-50/60 hover:bg-amber-100/60 text-amber-900 border-amber-200/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span>Kho prompt đã lưu</span>
            </div>
            <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              {savedCount}
            </span>
          </button>
        </div>
      </div>

      {/* External Helper Banner */}
      <div className="bg-gradient-to-br from-blue-900 to-[#0052CC] text-white p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">Môi trường thực hành</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
        <p className="text-xs text-blue-100 leading-relaxed font-medium">
          Sau khi tạo Prompt ở Bước 3, dán trực tiếp vào Google AI Studio để sinh ứng dụng web.
        </p>
        <a
          href="https://aistudio.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Mở Google AI Studio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
