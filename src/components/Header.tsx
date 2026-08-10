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
    <header className="sticky top-0 z-50 bg-[#0052CC] text-white shadow-lg border-b border-blue-700">
      {/* Top Announcement Bar */}
      <div className="bg-[#0A66C2] py-1.5 px-4 text-xs font-medium text-blue-100 border-b border-blue-600/40">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span>Giáo viên: Trần Thị Nhung - Tổ STEM, Tin học và Công nghệ, FPT School Bắc Giang</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Đã tạo <strong>{promptsGenerated}</strong> Prompts chuẩn
            </span>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 font-semibold underline underline-offset-2"
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
          <div className="flex items-center gap-4 sm:gap-5"> 
            <FptLogo className="h-12 sm:h-14 px-3.5 py-1.5" />
            <div className="flex flex-col justify-center space-y-0.5">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-normal text-white leading-normal">
                CỔNG TẬP HUẤN GOOGLE AI STUDIO
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 font-medium opacity-90 leading-relaxed">
                Trường Tiểu học, THCS & THPT FPT Bắc Giang <span className="hidden sm:inline mx-1">•</span> <span className="text-amber-300 font-semibold">Trải nghiệm để trưởng thành!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

