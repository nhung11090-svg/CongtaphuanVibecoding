import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { FptLogo } from './FptLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white mt-12 border-t border-purple-800/40 shadow-xl">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-800/50">
          <div className="flex items-center gap-4">
            <FptLogo className="h-9 sm:h-10" variant="light" />
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                CỔNG TẬP HUẤN GOOGLE AI STUDIO - TRƯỜNG TIỂU HỌC, THCS & THPT FPT BẮC GIANG
              </h3>
              <p className="text-xs text-purple-200 font-medium">
                Trường TH, THCS & THPT FPT Bắc Giang • Trải nghiệm để trưởng thành!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-all inline-flex items-center gap-1.5 font-bold text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl border border-white/20 shadow-sm"
            >
              Google AI Studio Build Mode
              <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-purple-200 font-medium gap-2">
          <p>© 2026 Trường TH, THCS & THPT FPT Bắc Giang. Tất cả quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hệ thống hoạt động Client-side an toàn 100%</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
