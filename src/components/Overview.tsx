import React from 'react';
import { ActiveTab } from '../types';
import { 
  Sparkles, 
  PlayCircle, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Lightbulb, 
  Rocket,
  ShieldCheck,
  MousePointerClick
} from 'lucide-react';

interface OverviewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-purple-800/60">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-300 font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span>FPT Schools • Nâng tầm bài giảng cùng AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            CỔNG TẬP HUẤN TẠO MINI WEBAPP BÀI GIẢNG <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
              CÙNG GOOGLE AI STUDIO
            </span>
          </h1>

          <p className="text-base sm:text-lg text-purple-100 font-medium leading-relaxed max-w-3xl">
            Hệ thống tập huấn trực quan giúp Quý Thầy Cô Trường TH, THCS & THPT FPT Bắc Giang nhanh chóng làm chủ công nghệ Google AI Studio — biến mọi ý tưởng sư phạm thành ứng dụng web học tập tương tác sinh động chỉ trong 3 phút.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('sandbox')}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-xl hover:shadow-orange-500/30 transition-all flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlayCircle className="w-6 h-6 text-white" />
              <span>BẮT ĐẦU VỚI BƯỚC 1: XEM DEMO</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('course')}
              className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-base backdrop-blur-md border border-white/25 transition-all flex items-center gap-2.5"
            >
              <BookOpen className="w-6 h-6 text-purple-200" />
              <span>Khóa học tập huấn (Bước 2)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Feature Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-purple-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-all">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 font-black shadow-xs">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-snug">Không cần lập trình</h3>
            <p className="text-sm text-slate-600 font-medium mt-1.5 leading-relaxed">
              AI tự đóng gói HTML/JS hoàn chỉnh, giáo viên chỉ cần tập trung vào nội dung chuyên môn bài học.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-purple-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-all">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0 font-black shadow-xs">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-snug">10+ Dạng Webapp Trò Chơi</h3>
            <p className="text-sm text-slate-600 font-medium mt-1.5 leading-relaxed">
              Trắc nghiệm, Ô chữ, Dòng thời gian, Ai là triệu phú, Lật thẻ ghi nhớ, Ghép cặp, Vòng quay may mắn...
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-purple-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-all">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center shrink-0 font-black shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-snug">Chuẩn Hóa Master Prompt</h3>
            <p className="text-sm text-slate-600 font-medium mt-1.5 leading-relaxed">
              Cấu trúc Master Prompt được thiết kế chuyên biệt cho Google AI Studio, đảm bảo chạy ổn định không lỗi giao diện.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Step Guided Roadmap */}
      <div className="bg-white rounded-3xl p-7 sm:p-10 border border-purple-100 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-5">
          <div>
            <span className="text-xs sm:text-sm font-black text-orange-600 uppercase tracking-widest">LỘ TRÌNH SÁNG TẠO 3 BƯỚC</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Quy trình thực hành trực quan</h2>
          </div>
          <span className="text-sm font-extrabold text-purple-900 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-100">Thiết kế đơn giản, dễ tiếp cận cho mọi thầy cô</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="relative group bg-gradient-to-b from-orange-50/80 to-white p-7 rounded-3xl border-2 border-orange-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                  1
                </span>
                <span className="text-xs font-black text-orange-950 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Khám phá kết quả
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-xl flex items-center gap-2.5">
                <PlayCircle className="w-6 h-6 text-orange-600" />
                <span>BƯỚC 1: Xem Demo</span>
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-3 leading-relaxed">
                Trải nghiệm thực tế trò chơi học tập tương tác "Sử Việt Hào Hùng" chạy trực tiếp trên trình duyệt để hiểu rõ sản phẩm Webapp mà Google AI Studio sẽ tự động tạo cho thầy cô.
              </p>
            </div>
            <button
              onClick={() => onNavigate('sandbox')}
              className="mt-6 w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Vào Bước 1: Xem Demo</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="relative group bg-gradient-to-b from-purple-50/80 to-white p-7 rounded-3xl border-2 border-purple-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-11 h-11 rounded-2xl bg-purple-800 text-white font-black text-lg flex items-center justify-center shadow-md">
                  2
                </span>
                <span className="text-xs font-black text-purple-950 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Học phương pháp
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-xl flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-purple-700" />
                <span>BƯỚC 2: Khóa Học Tập Huấn</span>
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-3 leading-relaxed">
                Theo dõi 3 bài học cô đọng: Giới thiệu Google AI Studio, Kỹ thuật viết Master Prompt và Cách xuất bản & chia sẻ ứng dụng cho học sinh kèm bộ câu hỏi củng cố kiến thức.
              </p>
            </div>
            <button
              onClick={() => onNavigate('course')}
              className="mt-6 w-full py-3.5 rounded-2xl bg-purple-800 hover:bg-purple-900 text-white text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Vào Bước 2: Khóa học</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="relative group bg-gradient-to-b from-indigo-50/80 to-white p-7 rounded-3xl border-2 border-indigo-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-11 h-11 rounded-2xl bg-indigo-900 text-white font-black text-lg flex items-center justify-center shadow-md">
                  3
                </span>
                <span className="text-xs font-black text-indigo-950 bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Sáng tạo ngay
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-xl flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-indigo-700" />
                <span>BƯỚC 3: Trình Tạo Prompt</span>
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-3 leading-relaxed">
                Tự do thiết kế Webapp theo ý tưởng riêng hoặc chọn 10+ mẫu trò chơi có sẵn. Hệ thống tự động đóng gói Master Prompt chuẩn 100% cho Google AI Studio.
              </p>
            </div>
            <button
              onClick={() => onNavigate('builder')}
              className="mt-6 w-full py-3.5 rounded-2xl bg-indigo-900 hover:bg-slate-900 text-white text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Vào Bước 3: Tạo Prompt</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Why Use AI Studio Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl space-y-6 border border-purple-800/60 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center font-black">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">Tại sao chọn Google AI Studio cho giảng dạy?</h3>
          <ul className="space-y-4 text-sm sm:text-base text-purple-100 font-medium">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <span><strong className="text-white font-extrabold">Mô hình Gemini 2.5/3.0 mạnh mẽ:</strong> Sinh mã HTML/CSS/JS chính xác cao, tạo giao diện đẹp mắt tức thì.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <span><strong className="text-white font-extrabold">Miễn phí & Dễ sử dụng:</strong> Chỉ cần tài khoản Google cá nhân là có thể thực hành ngay không giới hạn chi phí.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <span><strong className="text-white font-extrabold">Tùy biến không giới hạn:</strong> Tạo bài giảng điện tử tương tác cho mọi môn học từ Tiểu học đến THPT.</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-orange-50/90 via-amber-50/90 to-purple-50/90 p-8 sm:p-10 rounded-3xl border-2 border-orange-200/80 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-md">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Cam kết đầu ra tập huấn</h3>
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              Sau khi hoàn thành 3 bước tập huấn, mỗi Giáo viên FPT Bắc Giang có thể tự tay xây dựng ít nhất 01 Webapp ôn tập tương tác hoàn chỉnh cho môn học của mình, sẵn sàng chiếu trên lớp hoặc gửi link cho học sinh tự học tại nhà.
            </p>
          </div>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('sandbox')}
              className="px-7 py-4 rounded-2xl bg-indigo-950 hover:bg-slate-900 text-white text-sm sm:text-base font-black transition-all flex items-center gap-3 shadow-lg hover:shadow-xl"
            >
              <MousePointerClick className="w-5 h-5 text-orange-400" />
              <span>Bắt đầu ngay: Xem Demo Trò Chơi (Bước 1)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
