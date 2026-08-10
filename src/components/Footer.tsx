import React from 'react';
import { GraduationCap, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0052CC] text-white mt-12 border-t border-blue-600/40 shadow-lg">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-blue-400/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0052CC] flex items-center justify-center font-bold shadow-sm">
              <GraduationCap className="w-6 h-6 text-[#0052CC]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                CỔNG TẬP HUẤN GOOGLE AI STUDIO - TRƯỜNG TIỂU HỌC, THCS & THPT FPT BẮC GIANG
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Trường Tiểu học, THCS & THPT FPT Bắc Giang • Trải nghiệm để trưởng thành!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/20"
            >
              Google AI Studio Build Mode
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-blue-100 font-medium gap-2">
          <p>© 2026 Trường Tiểu học, THCS & THPT FPT Bắc Giang. Tất cả quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Hệ thống hoạt động Client-side an toàn 100%</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
