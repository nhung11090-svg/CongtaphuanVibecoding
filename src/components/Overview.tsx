import React, { useState } from 'react';
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
  MousePointerClick,
  FileText,
  Download,
  Loader2
} from 'lucide-react';
import { generateWorkshopDoc } from '../utils/generateWorkshopDoc';

interface OverviewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [isExportingDoc, setIsExportingDoc] = useState(false);

  const handleDownloadDoc = async () => {
    try {
      setIsExportingDoc(true);
      const blob = await generateWorkshopDoc();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Khung_Chuong_Trinh_Hoi_Thao_Google_AI_Studio_FPT.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export docx:', err);
    } finally {
      setIsExportingDoc(false);
    }
  };
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0052CC] via-[#0A66C2] to-blue-900 text-white p-6 sm:p-10 shadow-xl border border-blue-400/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>FPT Schools • Nâng tầm bài giảng cùng AI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Tổng quan cổng tập huấn <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-100">
              Google AI Studio cho giáo viên
            </span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
            Hệ thống tập huấn trực quan giúp Quý Thầy Cô Trường TH, THCS & THPT FPT Bắc Giang nhanh chóng làm chủ công nghệ Google AI Studio — biến mọi ý tưởng sư phạm thành ứng dụng web học tập tương tác sinh động chỉ trong 3 phút.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('sandbox')}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-sm shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlayCircle className="w-5 h-5 text-blue-950" />
              <span>Xem Demo (Bước 1)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('course')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-blue-200" />
              <span>Khóa học tập huấn (Bước 2)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Feature Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Không cần lập trình</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              AI tự đóng gói HTML/JS hoàn chỉnh, giáo viên chỉ cần tập trung vào nội dung chuyên môn.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">9+ dạng Webapp</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Trò chơi Trắc nghiệm, Ô chữ, Dòng thời gian, Ai là triệu phú, Lật thẻ, Ghép đôi,...
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Chuẩn hóa Prompt</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Cấu trúc Master Prompt tối ưu hóa cho Google AI Studio, chạy ổn định không lỗi giao diện.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Step Guided Roadmap */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-extrabold text-[#0052CC] uppercase tracking-wider">Lộ trình sáng tạo 3 bước</span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">Quy trình thực hành trực quan</h2>
          </div>
          <span className="text-xs font-medium text-gray-500">Thiết kế đơn giản, dễ tiếp cận cho mọi thầy cô</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="relative group bg-gradient-to-b from-emerald-50/50 to-white p-6 rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                1
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full uppercase">
                Khám phá kết quả
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-emerald-600" />
              <span>Xem Demo</span>
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Trải nghiệm thực tế trò chơi học tập tương tác "Sử Việt Hào Hùng" chạy ngay trên trình duyệt để hiểu sản phẩm AI có thể tạo ra.
            </p>
            <button
              onClick={() => onNavigate('sandbox')}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Vào Bước 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="relative group bg-gradient-to-b from-blue-50/50 to-white p-6 rounded-2xl border border-blue-100 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-xl bg-[#0052CC] text-white font-black text-base flex items-center justify-center shadow-xs">
                2
              </span>
              <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-full uppercase">
                Học phương pháp
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0052CC]" />
              <span>Khóa học tập huấn</span>
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Theo dõi 3 bài học cô đọng: Giới thiệu Google AI Studio, Kỹ thuật viết Master Prompt và Cách xuất bản & chia sẻ cho học sinh.
            </p>
            <button
              onClick={() => onNavigate('course')}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Vào Bước 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="relative group bg-gradient-to-b from-amber-50/50 to-white p-6 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-xl bg-amber-500 text-white font-black text-base flex items-center justify-center shadow-xs">
                3
              </span>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full uppercase">
                Sáng tạo ngay
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Trình tạo Prompt</span>
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Tự do thiết kế Webapp theo ý tưởng riêng hoặc chọn mẫu trò chơi học tập. Hệ thống tự đóng gói Master Prompt chuẩn 100% cho Google AI Studio.
            </p>
            <button
              onClick={() => onNavigate('builder')}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Vào Bước 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Lesson Word Document Card (Hidden) */}

      {/* Why Use AI Studio Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Tại sao chọn Google AI Studio cho giảng dạy?</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-gray-200">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Mô hình Gemini mạnh mẽ:</strong> Khả năng sinh mã HTML/CSS/JS chính xác cao, tạo giao diện đẹp tức thì.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Miễn phí & Dễ tiếp cận:</strong> Chỉ cần tài khoản Google là có thể thực hành ngay không giới hạn.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Tùy biến không giới hạn:</strong> Tạo bài giảng điện tử cho mọi môn học từ Tiểu học đến THPT.</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border border-amber-200/80 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold">
            <Rocket className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Cam kết đầu ra tập huấn</h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Sau khi hoàn thành 3 bước tập huấn, mỗi Giáo viên FPT Bắc Giang có thể tự xây dựng ít nhất 01 Webapp ôn tập tương tác hoàn chỉnh cho môn học của mình, sẵn sàng chiếu trên lớp hoặc gửi cho học sinh tự học tại nhà.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('sandbox')}
              className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <MousePointerClick className="w-4 h-4 text-amber-300" />
              <span>Bắt đầu từ Bước 1: Xem Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
