import React, { useState } from 'react';
import { SavedPrompt, PromptVariables, SavedPromptStatus } from '../types';
import { 
  Bookmark, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  Search, 
  Clock, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  Tag,
  Sliders,
  CheckCircle2,
  Hourglass,
  FlaskConical,
  Sparkle
} from 'lucide-react';

interface SavedPromptsProps {
  savedPrompts: SavedPrompt[];
  onDeletePrompt: (id: string) => void;
  onUpdateStatus?: (id: string, status: SavedPromptStatus) => void;
  onLoadPrompt: (variables: PromptVariables) => void;
  onCopyPromptText: (text: string) => void;
}

export const SavedPrompts: React.FC<SavedPromptsProps> = ({
  savedPrompts,
  onDeletePrompt,
  onUpdateStatus,
  onLoadPrompt,
  onCopyPromptText,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPrompts = savedPrompts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.variables?.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.variables?.lesson_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.customIdea?.problem || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.customIdea?.targetAudience || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (prompt: SavedPrompt) => {
    navigator.clipboard.writeText(prompt.fullPrompt);
    onCopyPromptText(prompt.fullPrompt);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTxt = (prompt: SavedPrompt) => {
    const element = document.createElement("a");
    const file = new Blob([prompt.fullPrompt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Prompt-${prompt.title.replace(/[^a-zA-Z0-9-]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getStatusBadgeStyle = (status: SavedPromptStatus = 'Đã tạo Prompt') => {
    switch (status) {
      case 'Đã tạo Prompt':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Đang xây dựng':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Đang kiểm thử':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Đã hoàn thiện':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 border border-purple-800/40 rounded-3xl p-5 sm:p-6 shadow-md text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Kho lưu trữ
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Danh sách Master Prompt & Ý tưởng ({savedPrompts.length})
              </h2>
            </div>
            <p className="text-sm text-purple-100 max-w-3xl">
              Quản lý các Master Prompt bài giảng và các bản thiết kế webapp theo ý tưởng riêng. Dễ dàng theo dõi trạng thái xây dựng và kiểm thử.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, vấn đề, môn học..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/10 text-white placeholder:text-purple-300 border border-white/20 focus:ring-2 focus:ring-orange-400 outline-none text-xs transition-all"
            />
          </div>
        </div>
      </div>

      {/* Prompts List */}
      {filteredPrompts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0052CC] flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Chưa có mẫu Prompt nào trong kho</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Hãy sang tab <strong>Trình tạo Prompt</strong>, thiết kế webapp hoặc bài giảng mẫu và bấm nút <strong>Lưu vào Kho Prompt</strong> để lưu lại tại đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrompts.map(prompt => {
            const isCopied = copiedId === prompt.id;
            const isCustomIdea = prompt.promptType === 'custom_idea' || !!prompt.customIdea;
            const currentStatus: SavedPromptStatus = prompt.status || 'Đã tạo Prompt';

            return (
              <div
                key={prompt.id}
                className="bg-white border border-gray-200 hover:border-blue-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Date, Tag Type, Status Dropdown */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {prompt.createdAt}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Prompt Type Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border ${
                        isCustomIdea
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-blue-100 text-[#0052CC] border-blue-200'
                      }`}>
                        {isCustomIdea ? <Sparkles className="w-3 h-3 text-amber-600" /> : <BookOpen className="w-3 h-3 text-blue-600" />}
                        <span>{isCustomIdea ? 'Webapp theo ý tưởng riêng' : 'Mẫu trò chơi học tập'}</span>
                      </span>

                      {/* Editable Status Select */}
                      <select
                        value={currentStatus}
                        onChange={(e) => onUpdateStatus && onUpdateStatus(prompt.id, e.target.value as SavedPromptStatus)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border outline-none cursor-pointer ${getStatusBadgeStyle(currentStatus)}`}
                      >
                        <option value="Đã tạo Prompt">Đã tạo Prompt</option>
                        <option value="Đang xây dựng">Đang xây dựng</option>
                        <option value="Đang kiểm thử">Đang kiểm thử</option>
                        <option value="Đã hoàn thiện">Đã hoàn thiện</option>
                      </select>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 flex items-start gap-2 leading-snug">
                    <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isCustomIdea ? 'text-amber-500' : 'text-[#0052CC]'}`} />
                    <span>{prompt.title}</span>
                  </h3>

                  {/* Details Card */}
                  {isCustomIdea && prompt.customIdea ? (
                    <div className="text-xs text-gray-600 space-y-1.5 bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
                      <p className="line-clamp-2">
                        <strong className="text-amber-900">Vấn đề:</strong> {prompt.customIdea.problem}
                      </p>
                      <p className="line-clamp-1">
                        <strong className="text-amber-900">Đối tượng:</strong> {prompt.customIdea.targetAudience}
                      </p>
                      {prompt.customIdea.functions && prompt.customIdea.functions.length > 0 && (
                        <p className="line-clamp-1 text-[11px] text-gray-500">
                          <strong>Chức năng:</strong> {prompt.customIdea.functions.filter(Boolean).join(' • ')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-600 space-y-1 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                      <p className="line-clamp-2">
                        <strong>Mục tiêu:</strong> {prompt.variables?.objective || 'Mục tiêu bài học'}
                      </p>
                      <p className="line-clamp-1">
                        <strong>Nội dung:</strong> {prompt.variables?.core_content || 'Nội dung kiến thức'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(prompt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0052CC] hover:bg-[#0A66C2] text-white'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
                      <span>{isCopied ? 'Đã chép' : 'Sao chép Prompt'}</span>
                    </button>

                    <button
                      onClick={() => handleExportTxt(prompt)}
                      className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold"
                      title="Tải file .txt"
                    >
                      <Download className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isCustomIdea && prompt.variables && (
                      <button
                        onClick={() => onLoadPrompt(prompt.variables)}
                        className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#0052CC] text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <span>Sửa lại</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeletePrompt(prompt.id)}
                      className="p-1.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa prompt này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

