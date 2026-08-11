import React from 'react';
import { FptLogo } from './FptLogo';
import { 
  Sparkles, 
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  promptsGenerated: number;
}

export const Header: React.FC<HeaderProps> = ({
  promptsGenerated
}) => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 text-white shadow-xl border-b border-purple-700/50">
      {/* Top Announcement Bar */}
      <div className="bg-indigo-950/80 py-1.5 px-4 text-xs font-medium text-purple-200 border-b border-purple-800/40 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-purple-100">Giáo viên: Trần Thị Nhung - Tổ STEM, Tin học và Công nghệ, FPT School Bắc Giang</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 bg-orange-500/20 px-2.5 py-0.5 rounded-full border border-orange-400/30 text-orange-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              Đã tạo <strong>{promptsGenerated}</strong> Prompts chuẩn
            </span>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-300 hover:text-orange-200 transition-colors inline-flex items-center gap-1 font-bold underline underline-offset-2"
            >
              Mở Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Brand */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3 sm:gap-4"> 
            <FptLogo className="h-9 sm:h-11" variant="light" />
            <div className="flex flex-col justify-center space-y-0.5">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-normal text-white leading-snug drop-shadow-sm">
                CỔNG TẬP HUẤN GOOGLE AI STUDIO
              </h1>
              <p className="text-xs sm:text-sm text-purple-100 font-medium opacity-90 leading-relaxed">
                Trường Tiểu học, THCS & THPT FPT Bắc Giang <span className="hidden sm:inline mx-1.5">•</span> <span className="text-orange-400 font-bold">Trải nghiệm để trưởng thành!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

