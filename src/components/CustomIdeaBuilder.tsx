import React, { useState } from 'react';
import { CustomWebappIdea, SavedPrompt } from '../types';
import { generateCustomWebappMasterPrompt } from '../data/masterPrompt';
import { 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  BookmarkPlus, 
  ExternalLink, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Code, 
  Eye, 
  ArrowRight,
  Lightbulb,
  ShieldCheck,
  Layers,
  Target,
  FileText,
  SlidersHorizontal,
  LayoutGrid,
  ListOrdered
} from 'lucide-react';

interface CustomIdeaBuilderProps {
  onSavePrompt: (prompt: SavedPrompt) => void;
  onCopyPromptText: (text: string) => void;
  onSwitchToGameMode: () => void;
}

export const CustomIdeaBuilder: React.FC<CustomIdeaBuilderProps> = ({
  onSavePrompt,
  onCopyPromptText,
  onSwitchToGameMode,
}) => {
  // 7-question form state
  const [idea, setIdea] = useState<CustomWebappIdea>({
    problem: '',
    targetAudience: '',
    functions: ['', '', ''],
    userFlow: '',
    mandatoryContent: '',
    uiStyle: ['Đơn giản', 'Hiện đại'],
    otherUiReqs: '',
    constraints: [
      'Hoạt động trong khoảng 5 phút',
      'Không yêu cầu đăng nhập',
      'Không thu thập dữ liệu cá nhân',
      'Sử dụng được trên điện thoại',
      'Không cần cơ sở dữ liệu',
      'Nội dung hoàn toàn bằng tiếng Việt'
    ]
  });

  // Active step in custom wizard:
  // 1: Nhập 7 câu hỏi
  // 2: Xem lại bản thiết kế (Review)
  // 3: Master Prompt kết quả & Hướng dẫn AI Studio
  const [activeStep, setActiveStep] = useState<number>(1);

  // Layout mode for Question form:
  // 'full' = Hiển thị toàn cảnh 3 Mô-đun khoa học (khuyên dùng)
  // 'stepper' = Hiển thị lần lượt từng câu hỏi
  const [formLayoutMode, setFormLayoutMode] = useState<'full' | 'stepper'>('full');

  // Active question index if in stepper mode (1 to 7)
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);

  // AI Suggestion states
  const [loadingAiQuestion, setLoadingAiQuestion] = useState<number | null>(null);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Result view state
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'summary' | 'raw'>('summary');

  // Master Prompt text
  const masterPromptText = generateCustomWebappMasterPrompt(idea);

  // Form field handlers
  const handleFunctionChange = (index: number, val: string) => {
    const updated = [...idea.functions];
    updated[index] = val;
    setIdea(prev => ({ ...prev, functions: updated }));
  };

  const handleAddFunction = () => {
    if (idea.functions.length < 7) {
      setIdea(prev => ({ ...prev, functions: [...prev.functions, ''] }));
    }
  };

  const handleRemoveFunction = (index: number) => {
    if (idea.functions.length > 1) {
      const updated = idea.functions.filter((_, i) => i !== index);
      setIdea(prev => ({ ...prev, functions: updated }));
    }
  };

  const handleToggleUiStyle = (style: string) => {
    setIdea(prev => {
      const exists = prev.uiStyle.includes(style);
      if (exists) {
        return { ...prev, uiStyle: prev.uiStyle.filter(s => s !== style) };
      } else {
        return { ...prev, uiStyle: [...prev.uiStyle, style] };
      }
    });
  };

  const handleToggleConstraint = (item: string) => {
    setIdea(prev => {
      const exists = prev.constraints.includes(item);
      if (exists) {
        return { ...prev, constraints: prev.constraints.filter(c => c !== item) };
      } else {
        return { ...prev, constraints: [...prev.constraints, item] };
      }
    });
  };

  const handleResetForm = () => {
    setIdea({
      problem: '',
      targetAudience: '',
      functions: ['', '', ''],
      userFlow: '',
      mandatoryContent: '',
      uiStyle: ['Đơn giản', 'Hiện đại'],
      otherUiReqs: '',
      constraints: [
        'Hoạt động trong khoảng 5 phút',
        'Không yêu cầu đăng nhập',
        'Không thu thập dữ liệu cá nhân',
        'Sử dụng được trên điện thoại',
        'Không cần cơ sở dữ liệu',
        'Nội dung hoàn toàn bằng tiếng Việt'
      ]
    });
    setValidationError(null);
    setActiveStep(1);
    setCurrentQuestion(1);
  };

  // AI Suggestion Handler
  const handleAiSuggest = async (questionIdx: number) => {
    setLoadingAiQuestion(questionIdx);
    setAiNote(null);

    try {
      const res = await fetch('/api/suggest-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIndex: questionIdx,
          problem: idea.problem,
          targetAudience: idea.targetAudience,
          functions: idea.functions,
          userFlow: idea.userFlow,
          mandatoryContent: idea.mandatoryContent
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (questionIdx === 1 && d.suggestion) {
          setIdea(prev => ({ ...prev, problem: d.suggestion }));
        } else if (questionIdx === 2 && d.suggestion) {
          setIdea(prev => ({ ...prev, targetAudience: d.suggestion }));
        } else if (questionIdx === 3 && Array.isArray(d.functions)) {
          setIdea(prev => ({ ...prev, functions: d.functions }));
        } else if (questionIdx === 4 && d.suggestion) {
          setIdea(prev => ({ ...prev, userFlow: d.suggestion }));
        } else if (questionIdx === 5 && d.suggestion) {
          setIdea(prev => ({ ...prev, mandatoryContent: d.suggestion }));
          setAiNote("⚠️ AI chỉ gợi ý nội dung mẫu. Vui lòng đối chiếu với tài liệu chuyên môn chính thức.");
        } else if (questionIdx === 6) {
          if (Array.isArray(d.uiStyle)) {
            setIdea(prev => ({ ...prev, uiStyle: Array.from(new Set([...prev.uiStyle, ...d.uiStyle])) }));
          }
          if (d.otherUiReqs) {
            setIdea(prev => ({ ...prev, otherUiReqs: d.otherUiReqs }));
          }
        } else if (questionIdx === 7 && Array.isArray(d.constraints)) {
          setIdea(prev => ({ ...prev, constraints: Array.from(new Set([...prev.constraints, ...d.constraints])) }));
        }
      }
    } catch (err) {
      console.warn("AI suggestion fallback:", err);
      if (questionIdx === 1) {
        setIdea(prev => ({ ...prev, problem: "Học sinh thường gặp khó khăn khi phân biệt các nhóm kiến thức lý thuyết và bài tập vận dụng thực tế." }));
      } else if (questionIdx === 2) {
        setIdea(prev => ({ ...prev, targetAudience: "Học sinh THCS (Lớp 6 - Lớp 9)" }));
      } else if (questionIdx === 3) {
        setIdea(prev => ({
          ...prev,
          functions: [
            "Hiển thị danh sách thẻ thông tin/bài tập tương tác.",
            "Cho phép học sinh thực hiện phân loại hoặc ghép cặp.",
            "Kiểm tra đáp án tức thì và hiển thị phản hồi giải thích.",
            "Ghi nhận điểm số và thanh tiến độ hoàn thành.",
            "Màn hình tổng kết và gợi ý nội dung ôn tập."
          ]
        }));
      } else if (questionIdx === 4) {
        setIdea(prev => ({ ...prev, userFlow: "Mở webapp → Đọc hướng dẫn nhiệm vụ → Thao tác làm bài → Nhận ngay kết quả đúng/sai → Xem đáp án & Lời giải → Thực hành lại." }));
      } else if (questionIdx === 5) {
        setIdea(prev => ({ ...prev, mandatoryContent: "10 câu hỏi/khái niệm cốt lõi theo chương trình học, kèm đáp án chuẩn và lời giải thích ngắn 2-3 câu." }));
        setAiNote("⚠️ AI chỉ gợi ý nội dung mẫu. Vui lòng kiểm tra lại theo chương trình giảng dạy của thầy cô.");
      }
    } finally {
      setLoadingAiQuestion(null);
    }
  };

  // Calculate filled questions count out of 7
  const filledCount = [
    Boolean(idea.problem.trim()),
    Boolean(idea.targetAudience.trim()),
    idea.functions.some(f => f.trim() !== ''),
    Boolean(idea.userFlow.trim()),
    Boolean(idea.mandatoryContent.trim()),
    idea.uiStyle.length > 0,
    idea.constraints.length > 0
  ].filter(Boolean).length;

  // Validation before going to Review (Step 2)
  const handleGoToReview = () => {
    if (!idea.problem.trim()) {
      setValidationError("Vui lòng nhập Vấn đề cần giải quyết (Câu 1).");
      setFormLayoutMode('stepper');
      setCurrentQuestion(1);
      return;
    }
    if (!idea.targetAudience.trim()) {
      setValidationError("Vui lòng nhập Đối tượng sử dụng (Câu 2).");
      setFormLayoutMode('stepper');
      setCurrentQuestion(2);
      return;
    }
    const validFunctions = idea.functions.filter(f => f.trim() !== '');
    if (validFunctions.length === 0) {
      setValidationError("Vui lòng điền ít nhất 1 Chức năng chính (Câu 3).");
      setFormLayoutMode('stepper');
      setCurrentQuestion(3);
      return;
    }
    if (!idea.mandatoryContent.trim()) {
      setValidationError("Vui lòng nhập Nội dung bắt buộc (Câu 5).");
      setFormLayoutMode('stepper');
      setCurrentQuestion(5);
      return;
    }

    setValidationError(null);
    setActiveStep(2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(masterPromptText);
    setCopied(true);
    onCopyPromptText(masterPromptText);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    const title = idea.problem.length > 50 
      ? `Webapp: ${idea.problem.substring(0, 48)}...`
      : `Webapp: ${idea.problem || 'Ý tưởng riêng'}`;

    const newSaved: SavedPrompt = {
      id: `custom-prompt-${Date.now()}`,
      title: title,
      createdAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      promptType: 'custom_idea',
      status: 'Đã tạo Prompt',
      variables: {
        subject: 'Thiết kế riêng',
        grade: idea.targetAudience || 'Mọi khối',
        lesson_name: title,
        game_type: 'custom_webapp',
        objective: idea.problem,
        core_content: idea.mandatoryContent,
        keywords: idea.functions.filter(Boolean).join(', '),
        question_count: 'Thực tế',
        duration: 'Không giới hạn'
      },
      customIdea: idea,
      fullPrompt: masterPromptText
    };

    onSavePrompt(newSaved);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-blue-50 border border-amber-300 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3.5 bg-amber-500 text-white rounded-2xl shadow-md shrink-0 mt-0.5">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-600 text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Mới • Tư duy Vibe Coding
                </span>
                <span className="text-xs text-amber-900 font-bold">
                  Bắt đầu từ nhu cầu giảng dạy thực tế
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-1">
                THIẾT KẾ WEBAPP THEO Ý TƯỞNG RIÊNG
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-3xl leading-relaxed">
                Biến bất kỳ ý tưởng hoặc bài toán giảng dạy nào thành Webapp tương tác độc đáo cho học sinh. Hệ thống sẽ tự đóng gói thành <strong>Master Prompt chuẩn 100%</strong> cho Google AI Studio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onSwitchToGameMode}
              className="px-4 py-2.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-[#0052CC] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Chuyển sang Mẫu trò chơi sẵn có</span>
            </button>
            <button
              onClick={handleResetForm}
              className="p-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 transition-all shadow-sm"
              title="Làm mới toàn bộ form"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Educational Mindset Note */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3.5">
        <Lightbulb className="w-6 h-6 text-amber-400 shrink-0" />
        <p className="text-xs sm:text-sm font-semibold text-gray-200 leading-relaxed">
          <strong className="text-amber-300 uppercase">Triết lý Vibe Coding:</strong> “Đừng bắt đầu bằng giao diện hay công nghệ. Hãy bắt đầu từ bài toán thực tế thầy cô muốn học sinh giải quyết.”
        </p>
      </div>

      {/* 3 Main Process Tabs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
        <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveStep(1)}
            className={`p-3 rounded-xl transition-all border flex items-center justify-center gap-2 ${
              activeStep === 1
                ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-200'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-extrabold shrink-0">1</span>
            <span>7 Câu hỏi thiết kế</span>
          </button>
          <button
            onClick={handleGoToReview}
            className={`p-3 rounded-xl transition-all border flex items-center justify-center gap-2 ${
              activeStep === 2
                ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-200'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs flex items-center justify-center font-extrabold shrink-0">2</span>
            <span>Xem lại bản thiết kế</span>
          </button>
          <button
            disabled={activeStep < 3}
            onClick={() => activeStep >= 3 && setActiveStep(3)}
            className={`p-3 rounded-xl transition-all border flex items-center justify-center gap-2 ${
              activeStep === 3
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm ring-2 ring-emerald-200'
                : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-extrabold shrink-0">3</span>
            <span>Master Prompt & AI Studio</span>
          </button>
        </div>
      </div>

      {/* STEP 1: 7 QUESTIONS FORM WITH SCIENTIFIC MODULES LAYOUT */}
      {activeStep === 1 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-7">
          {/* Header Controls & Layout Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">
                  BẢN VẼ TƯ DUY
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Hoàn thành: {filledCount}/7 câu hỏi
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">
                Biểu mẫu 7 câu hỏi định hình Webapp
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Các câu hỏi được phân loại theo 3 Mô-đun khoa học giúp giáo viên dễ dàng hình dung tổng thể ứng dụng.
              </p>
            </div>

            {/* Layout Mode Switcher Buttons */}
            <div className="flex items-center bg-gray-100 p-1.5 rounded-xl text-xs shrink-0 self-start md:self-auto">
              <button
                onClick={() => setFormLayoutMode('full')}
                className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  formLayoutMode === 'full'
                    ? 'bg-white text-amber-900 shadow-sm font-extrabold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-amber-600" />
                <span>Bố cục 3 Mô-đun (Toàn cảnh)</span>
              </button>

              <button
                onClick={() => setFormLayoutMode('stepper')}
                className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  formLayoutMode === 'stepper'
                    ? 'bg-white text-amber-900 shadow-sm font-extrabold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListOrdered className="w-4 h-4 text-blue-600" />
                <span>Từng câu hỏi (Wizard)</span>
              </button>
            </div>
          </div>

          {validationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <span className="font-semibold">{validationError}</span>
            </div>
          )}

          {aiNote && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs sm:text-sm text-amber-900 flex items-center gap-2.5">
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="font-semibold">{aiNote}</span>
            </div>
          )}

          {/* MODE A: FULL 3-MODULE SCIENTIFIC LAYOUT */}
          {formLayoutMode === 'full' && (
            <div className="space-y-8 animate-fadeIn">
              {/* ==================== MÔ-ĐUN 1 ==================== */}
              <div className="bg-gradient-to-br from-amber-50/60 via-amber-50/20 to-white border border-amber-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-amber-200/80 pb-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider block">MÔ-ĐUN I</span>
                    <h4 className="text-base sm:text-lg font-extrabold text-gray-900">ĐỊNH HÌNH BÀI TOÁN & ĐỐI TƯỢNG HỌC SINH</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* CÂU 1: VẤN ĐỀ CẦN GIẢI QUYẾT */}
                  <div className="bg-white border border-amber-200/90 rounded-2xl p-4.5 space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center shrink-0">1</span>
                        <h5 className="text-sm font-extrabold text-gray-900">Vấn đề cần giải quyết <span className="text-red-500">*</span></h5>
                      </div>
                      <button
                        onClick={() => handleAiSuggest(1)}
                        disabled={loadingAiQuestion === 1}
                        className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 transition-all shrink-0 disabled:opacity-50"
                      >
                        <Wand2 className={`w-3.5 h-3.5 text-amber-600 ${loadingAiQuestion === 1 ? 'animate-spin' : ''}`} />
                        <span>{loadingAiQuestion === 1 ? 'Đang gợi ý...' : '✨ AI gợi ý'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">Mô tả khó khăn hoặc nhu cầu cụ thể bạn muốn giải quyết cho học sinh.</p>

                    <textarea
                      rows={3}
                      placeholder="Ví dụ: Học sinh thường nhầm lẫn giữa thiết bị vào và thiết bị ra trong môn Tin học 7..."
                      value={idea.problem}
                      onChange={e => setIdea(prev => ({ ...prev, problem: e.target.value }))}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-xs sm:text-sm text-gray-800 font-medium leading-relaxed"
                    />

                    {/* Quick sample chips */}
                    <div>
                      <span className="text-[11px] font-bold text-gray-500 block mb-1.5">Bấm nhanh mẫu gợi ý:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Nhầm lẫn thiết bị vào - thiết bị ra",
                          "Khó ghi nhớ các mốc lịch sử",
                          "Quên công thức quy đổi đơn vị",
                          "Ôn tập từ vựng Tiếng Anh theo chủ đề"
                        ].map((sample, idx) => (
                          <button
                            key={idx}
                            onClick={() => setIdea(prev => ({ ...prev, problem: sample }))}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-medium transition-all"
                          >
                            + {sample}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CÂU 2: ĐỐI TƯỢNG SỬ DỤNG */}
                  <div className="bg-white border border-amber-200/90 rounded-2xl p-4.5 space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center shrink-0">2</span>
                        <h5 className="text-sm font-extrabold text-gray-900">Đối tượng sử dụng chính <span className="text-red-500">*</span></h5>
                      </div>
                      <button
                        onClick={() => handleAiSuggest(2)}
                        disabled={loadingAiQuestion === 2}
                        className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 transition-all shrink-0 disabled:opacity-50"
                      >
                        <Wand2 className={`w-3.5 h-3.5 text-amber-600 ${loadingAiQuestion === 2 ? 'animate-spin' : ''}`} />
                        <span>{loadingAiQuestion === 2 ? 'Đang gợi ý...' : '✨ AI gợi ý'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">Đối tượng học sinh hoặc nhóm người dùng sẽ thao tác trực tiếp.</p>

                    <input
                      type="text"
                      placeholder="Ví dụ: Học sinh THCS Lớp 7 (12-13 tuổi)"
                      value={idea.targetAudience}
                      onChange={e => setIdea(prev => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-xs sm:text-sm text-gray-800 font-medium"
                    />

                    {/* Quick target choice buttons */}
                    <div>
                      <span className="text-[11px] font-bold text-gray-500 block mb-1.5">Chọn nhanh cấp học:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Học sinh Tiểu học (Lớp 3 - Lớp 5)",
                          "Học sinh THCS (Lớp 6 - Lớp 9)",
                          "Học sinh THPT (Lớp 10 - Lớp 12)",
                          "Giáo viên môn chuyên ngành"
                        ].map((target, idx) => (
                          <button
                            key={idx}
                            onClick={() => setIdea(prev => ({ ...prev, targetAudience: target }))}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-amber-100 text-gray-800 hover:text-amber-900 border border-gray-200 rounded-lg text-[11px] font-medium transition-all"
                          >
                            {target}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================== MÔ-ĐUN 2 ==================== */}
              <div className="bg-gradient-to-br from-blue-50/60 via-blue-50/20 to-white border border-blue-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-blue-200/80 pb-3">
                  <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider block">MÔ-ĐUN II</span>
                    <h4 className="text-base sm:text-lg font-extrabold text-gray-900">CHỨC NĂNG & LUỒNG TRẢI NGHIỆM HỌC SINH</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* CÂU 3: CHỨC NĂNG CHÍNH */}
                  <div className="bg-white border border-blue-200/90 rounded-2xl p-4.5 space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">3</span>
                        <h5 className="text-sm font-extrabold text-gray-900">Các chức năng chính (3–5 tính năng) <span className="text-red-500">*</span></h5>
                      </div>
                      <button
                        onClick={() => handleAiSuggest(3)}
                        disabled={loadingAiQuestion === 3}
                        className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold flex items-center gap-1 transition-all shrink-0 disabled:opacity-50"
                      >
                        <Wand2 className={`w-3.5 h-3.5 text-blue-600 ${loadingAiQuestion === 3 ? 'animate-spin' : ''}`} />
                        <span>{loadingAiQuestion === 3 ? 'Đang gợi ý...' : '✨ AI gợi ý 5 chức năng'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">Liệt kê các thao tác hoặc tính năng quan trọng nhất của Webapp.</p>

                    <div className="space-y-2">
                      {idea.functions.map((fn, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-blue-100 text-blue-900 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            placeholder={`Chức năng ${idx + 1}: ${
                              idx === 0 ? 'Hiển thị thẻ bài tập' : idx === 1 ? 'Kéo thả phân loại' : 'Phản hồi đúng/sai tức thì'
                            }`}
                            value={fn}
                            onChange={e => handleFunctionChange(idx, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm text-gray-800 font-medium"
                          />
                          {idea.functions.length > 1 && (
                            <button
                              onClick={() => handleRemoveFunction(idx)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Xóa chức năng"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      {idea.functions.length < 7 && (
                        <button
                          onClick={handleAddFunction}
                          className="mt-1 px-3 py-1.5 rounded-xl border border-dashed border-blue-400 text-blue-800 hover:bg-blue-50 text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5 text-blue-600" />
                          <span>Thêm chức năng tiếp theo</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CÂU 4: LUỒNG SỬ DỤNG */}
                  <div className="bg-white border border-blue-200/90 rounded-2xl p-4.5 space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">4</span>
                        <h5 className="text-sm font-extrabold text-gray-900">Luồng sử dụng từ khi mở Webapp</h5>
                      </div>
                      <button
                        onClick={() => handleAiSuggest(4)}
                        disabled={loadingAiQuestion === 4}
                        className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold flex items-center gap-1 transition-all shrink-0 disabled:opacity-50"
                      >
                        <Wand2 className={`w-3.5 h-3.5 text-blue-600 ${loadingAiQuestion === 4 ? 'animate-spin' : ''}`} />
                        <span>{loadingAiQuestion === 4 ? 'Đang gợi ý...' : '✨ AI gợi ý luồng'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">Mô tả trình tự học sinh tương tác từ lúc bắt đầu tới khi hoàn thành.</p>

                    <textarea
                      rows={4}
                      placeholder="Mở trang → Đọc hướng dẫn → Thao tác giải bài → Nhận kết quả đúng/sai ngay → Xem giải thích → Làm lại bài khác."
                      value={idea.userFlow}
                      onChange={e => setIdea(prev => ({ ...prev, userFlow: e.target.value }))}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm text-gray-800 font-medium leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* ==================== MÔ-ĐUN 3 ==================== */}
              <div className="bg-gradient-to-br from-emerald-50/60 via-emerald-50/20 to-white border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-emerald-200/80 pb-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">MÔ-ĐUN III</span>
                    <h4 className="text-base sm:text-lg font-extrabold text-gray-900">NỘI DUNG CHUYÊN MÔN & RÀNG BUỘC KỸ THUẬT</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* CÂU 5: NỘI DUNG BẮT BUỘC */}
                  <div className="bg-white border border-emerald-200/90 rounded-2xl p-4.5 space-y-3 shadow-sm md:col-span-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">5</span>
                        <h5 className="text-sm font-extrabold text-gray-900">Nội dung bắt buộc <span className="text-red-500">*</span></h5>
                      </div>
                      <button
                        onClick={() => handleAiSuggest(5)}
                        disabled={loadingAiQuestion === 5}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 disabled:opacity-50"
                      >
                        <Wand2 className={`w-3 h-3 text-emerald-600 ${loadingAiQuestion === 5 ? 'animate-spin' : ''}`} />
                        <span>✨ AI gợi ý</span>
                      </button>
                    </div>

                    <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-[11px] text-emerald-950 font-medium flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Giáo viên làm chủ:</strong> Nội dung kiến thức do giáo viên quyết định.</span>
                    </div>

                    <textarea
                      rows={5}
                      placeholder="Các câu hỏi/khái niệm/dữ liệu bắt buộc xuất hiện trong Webapp..."
                      value={idea.mandatoryContent}
                      onChange={e => setIdea(prev => ({ ...prev, mandatoryContent: e.target.value }))}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs sm:text-sm text-gray-800 font-medium leading-relaxed"
                    />
                  </div>

                  {/* CÂU 6: GIAO DIỆN MONG MUỐN */}
                  <div className="bg-white border border-emerald-200/90 rounded-2xl p-4.5 space-y-3 shadow-sm md:col-span-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">6</span>
                        <h5 className="text-sm font-extrabold text-gray-900">Phong cách Giao diện</h5>
                      </div>
                      <button
                        onClick={() => handleAiSuggest(6)}
                        disabled={loadingAiQuestion === 6}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 disabled:opacity-50"
                      >
                        <Wand2 className={`w-3 h-3 text-emerald-600 ${loadingAiQuestion === 6 ? 'animate-spin' : ''}`} />
                        <span>✨ AI gợi ý</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">Chọn thuộc tính giao diện phù hợp với lứa tuổi học sinh.</p>

                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Đơn giản",
                        "Hiện đại",
                        "Sinh động",
                        "Phù hợp học sinh nhỏ tuổi",
                        "Tối giản",
                        "Công nghệ"
                      ].map((style, idx) => {
                        const isSelected = idea.uiStyle.includes(style);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleToggleUiStyle(style)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{style}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Yêu cầu màu sắc/giao diện khác:</label>
                      <input
                        type="text"
                        placeholder="Màu sắc tươi sáng, chữ to rõ..."
                        value={idea.otherUiReqs}
                        onChange={e => setIdea(prev => ({ ...prev, otherUiReqs: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs text-gray-800 font-medium"
                      />
                    </div>
                  </div>

                  {/* CÂU 7: ĐIỀU KIỆN / RÀNG BUỘC KỸ THUẬT */}
                  <div className="bg-white border border-emerald-200/90 rounded-2xl p-4.5 space-y-3 shadow-sm md:col-span-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">7</span>
                        <h5 className="text-sm font-extrabold text-gray-900">Ràng buộc kỹ thuật</h5>
                      </div>
                      <button
                        onClick={() => handleAiSuggest(7)}
                        disabled={loadingAiQuestion === 7}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 disabled:opacity-50"
                      >
                        <Wand2 className={`w-3 h-3 text-emerald-600 ${loadingAiQuestion === 7 ? 'animate-spin' : ''}`} />
                        <span>✨ AI gợi ý</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">Giúp Webapp chạy mượt mà, không giật lag trên điện thoại & máy tính.</p>

                    <div className="space-y-1.5">
                      {[
                        "Hoạt động trong khoảng 5 phút",
                        "Không yêu cầu đăng nhập",
                        "Không thu thập dữ liệu cá nhân",
                        "Sử dụng được trên điện thoại",
                        "Không cần cơ sở dữ liệu",
                        "Nội dung hoàn toàn bằng tiếng Việt"
                      ].map((item, idx) => {
                        const isChecked = idea.constraints.includes(item);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleToggleConstraint(item)}
                            className={`p-2 rounded-xl text-xs font-medium text-left transition-all border w-full flex items-center justify-between ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
                            }`}
                          >
                            <span>{item}</span>
                            {isChecked ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE B: STEPPER / WIZARD (1 to 7) */}
          {formLayoutMode === 'stepper' && (
            <div className="space-y-6 animate-fadeIn bg-gray-50/70 border border-gray-200 p-5 rounded-2xl">
              {/* Question selector chips 1 to 7 */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
                  CÂU HỎI {currentQuestion} / 7
                </span>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <button
                      key={num}
                      onClick={() => setCurrentQuestion(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all border flex items-center justify-center ${
                        currentQuestion === num
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm ring-2 ring-amber-200'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Single question view based on currentQuestion */}
              {currentQuestion === 1 && (
                <div className="space-y-3">
                  <h4 className="text-base font-extrabold text-gray-900">Câu 1: Vấn đề cần giải quyết</h4>
                  <textarea
                    rows={4}
                    placeholder="Mô tả khó khăn hoặc nhu cầu..."
                    value={idea.problem}
                    onChange={e => setIdea(prev => ({ ...prev, problem: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-800"
                  />
                </div>
              )}

              {currentQuestion === 2 && (
                <div className="space-y-3">
                  <h4 className="text-base font-extrabold text-gray-900">Câu 2: Đối tượng sử dụng</h4>
                  <input
                    type="text"
                    placeholder="Ví dụ: Học sinh THCS Lớp 7"
                    value={idea.targetAudience}
                    onChange={e => setIdea(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-800"
                  />
                </div>
              )}

              {currentQuestion === 3 && (
                <div className="space-y-3">
                  <h4 className="text-base font-extrabold text-gray-900">Câu 3: Chức năng chính</h4>
                  {idea.functions.map((fn, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Chức năng ${idx + 1}`}
                      value={fn}
                      onChange={e => handleFunctionChange(idx, e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm mb-2"
                    />
                  ))}
                </div>
              )}

              {currentQuestion === 4 && (
                <div className="space-y-3">
                  <h4 className="text-base font-extrabold text-gray-900">Câu 4: Luồng sử dụng</h4>
                  <textarea
                    rows={4}
                    value={idea.userFlow}
                    onChange={e => setIdea(prev => ({ ...prev, userFlow: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>
              )}

              {currentQuestion === 5 && (
                <div className="space-y-3">
                  <h4 className="text-base font-extrabold text-gray-900">Câu 5: Nội dung bắt buộc</h4>
                  <textarea
                    rows={4}
                    value={idea.mandatoryContent}
                    onChange={e => setIdea(prev => ({ ...prev, mandatoryContent: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>
              )}

              {currentQuestion === 6 && (
                <div className="space-y-3">
                  <h4 className="text-base font-extrabold text-gray-900">Câu 6: Giao diện mong muốn</h4>
                  <input
                    type="text"
                    value={idea.otherUiReqs}
                    onChange={e => setIdea(prev => ({ ...prev, otherUiReqs: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
                  />
                </div>
              )}

              {currentQuestion === 7 && (
                <div className="space-y-3">
                  <h4 className="text-base font-extrabold text-gray-900">Câu 7: Điều kiện / Ràng buộc</h4>
                  <p className="text-xs text-gray-600">Đã chọn {idea.constraints.length} điều kiện mặc định.</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <button
                  disabled={currentQuestion === 1}
                  onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>
                {currentQuestion < 7 ? (
                  <button
                    onClick={() => setCurrentQuestion(prev => Math.min(7, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <span>Câu sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleGoToReview}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    <span>Xem lại bản thiết kế</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bottom Primary Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã hoàn thành <strong>{filledCount}/7</strong> phần yêu cầu.</span>
            </div>

            <button
              onClick={handleGoToReview}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all w-full sm:w-auto"
            >
              <span>Xem lại bản thiết kế & Đóng gói Master Prompt</span>
              <ArrowRight className="w-5 h-5 text-amber-200" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW DESIGN SUMMARY */}
      {activeStep === 2 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
            <div>
              <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">
                XEM LẠI BẢN THIẾT KẾ WEBAPP
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5">
                Tổng quan ý tưởng trước khi tạo Master Prompt
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">Hãy kiểm tra các thông tin dưới đây để bảo đảm đúng mục đích bài học.</p>
            </div>

            <button
              onClick={() => setActiveStep(1)}
              className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Chỉnh sửa các câu hỏi</span>
            </button>
          </div>

          {/* 8 Review Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4.5 space-y-1">
              <span className="font-extrabold text-amber-900 uppercase text-[11px] tracking-wider block">1. VẤN ĐỀ CẦN GIẢI QUYẾT</span>
              <p className="font-semibold text-gray-900 leading-relaxed">{idea.problem || 'Chưa nhập'}</p>
            </div>

            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4.5 space-y-1">
              <span className="font-extrabold text-blue-900 uppercase text-[11px] tracking-wider block">2. ĐỐI TƯỢNG SỬ DỤNG</span>
              <p className="font-semibold text-gray-900 leading-relaxed">{idea.targetAudience || 'Chưa nhập'}</p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4.5 space-y-1 md:col-span-2">
              <span className="font-extrabold text-emerald-900 uppercase text-[11px] tracking-wider block">3. MỤC TIÊU WEBAPP</span>
              <p className="font-semibold text-gray-800 leading-relaxed">
                Giúp đối tượng <strong className="text-emerald-950">{idea.targetAudience}</strong> giải quyết triệt để vấn đề <strong className="text-emerald-950">"{idea.problem}"</strong> bằng trải nghiệm Web tương tác trực quan.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4.5 space-y-1 md:col-span-2">
              <span className="font-extrabold text-gray-700 uppercase text-[11px] tracking-wider block">4. CHỨC NĂNG CHÍNH ({idea.functions.filter(Boolean).length})</span>
              <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium pt-1">
                {idea.functions.filter(Boolean).map((fn, i) => (
                  <li key={i}>{fn}</li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4.5 space-y-1">
              <span className="font-extrabold text-indigo-900 uppercase text-[11px] tracking-wider block">5. LUỒNG SỬ DỤNG</span>
              <p className="font-medium text-gray-800 leading-relaxed">{idea.userFlow || 'Mở trang → Nhận nhiệm vụ → Thao tác → Xem kết quả'}</p>
            </div>

            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4.5 space-y-1">
              <span className="font-extrabold text-rose-900 uppercase text-[11px] tracking-wider block">6. NỘI DUNG BẮT BUỘC (GIÁO VIÊN LÀM CHỦ)</span>
              <p className="font-medium text-gray-800 leading-relaxed line-clamp-4">{idea.mandatoryContent || 'Chưa nhập'}</p>
            </div>

            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4.5 space-y-1">
              <span className="font-extrabold text-purple-900 uppercase text-[11px] tracking-wider block">7. YÊU CẦU GIAO DIỆN</span>
              <p className="font-semibold text-purple-950">{idea.uiStyle.join(', ') || 'Đơn giản'}</p>
              {idea.otherUiReqs && <p className="text-gray-600 text-xs mt-1">{idea.otherUiReqs}</p>}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-1">
              <span className="font-extrabold text-slate-700 uppercase text-[11px] tracking-wider block">8. RÀNG BUỘC KỸ THUẬT</span>
              <p className="font-medium text-gray-700 leading-relaxed">{idea.constraints.join(' • ') || 'Mặc định'}</p>
            </div>
          </div>

          {/* Action to Generate Master Prompt */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setActiveStep(1)}
              className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Chỉnh sửa các câu hỏi</span>
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all w-full sm:w-auto"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>ĐÓNG GÓI MASTER PROMPT CỦA BẠN</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MASTER PROMPT DISPLAY & GOOGLE AI STUDIO INSTRUCTIONS */}
      {activeStep === 3 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
          {/* Header + Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Đã đóng gói thành công
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-1">
                MASTER PROMPT WEBAPP SẴN SÀNG!
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">Sao chép Master Prompt này và dán vào Google AI Studio Build mode.</p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                onClick={handleSave}
                className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-extrabold">Đã lưu Kho Prompt!</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4 text-amber-600" />
                    <span>Lưu vào Kho Prompt</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-lg ring-2 ring-amber-300 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>ĐÃ SAO CHÉP MASTER PROMPT!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-100" />
                    <span>SAO CHÉP MASTER PROMPT</span>
                  </>
                )}
              </button>

              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-md"
              >
                <span>MỞ GOOGLE AI STUDIO</span>
                <ExternalLink className="w-4 h-4 text-amber-300" />
              </a>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded-xl text-xs sm:text-sm">
            <span className="text-gray-600 font-semibold px-2 hidden sm:inline">Chế độ hiển thị:</span>
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => setViewMode('summary')}
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs sm:text-sm ${
                  viewMode === 'summary'
                    ? 'bg-white text-amber-900 shadow-sm font-extrabold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4 text-amber-600" />
                <span>Tóm tắt cấu trúc Prompt</span>
              </button>

              <button
                onClick={() => setViewMode('raw')}
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs sm:text-sm ${
                  viewMode === 'raw'
                    ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4 text-blue-600" />
                <span>Xem văn bản Master Prompt đầy đủ</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: STRUCTURED SUMMARY CARDS */}
          {viewMode === 'summary' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <h4 className="text-sm sm:text-base font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  CẤU TRÚC MASTER PROMPT ĐÃ ĐƯỢC ĐÓNG GÓI CHUẨN KĨ THUẬT
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="bg-white/95 p-4 rounded-xl border border-amber-100 font-medium">
                    <strong className="text-amber-900 block mb-1">VAI TRÒ & BỐI CẢNH:</strong>
                    Chuyên gia thiết kế ứng dụng Web giáo dục giúp giải quyết khó khăn: "{idea.problem}"
                  </div>
                  <div className="bg-white/95 p-4 rounded-xl border border-amber-100 font-medium">
                    <strong className="text-amber-900 block mb-1">ĐỐI TƯỢNG SỬ DỤNG:</strong>
                    {idea.targetAudience}
                  </div>
                  <div className="bg-white/95 p-4 rounded-xl border border-amber-100 font-medium">
                    <strong className="text-amber-900 block mb-1">CHỨC NĂNG CHÍNH:</strong>
                    {idea.functions.filter(Boolean).join(' • ')}
                  </div>
                  <div className="bg-white/95 p-4 rounded-xl border border-amber-100 font-medium">
                    <strong className="text-amber-900 block mb-1">RÀNG BUỘC KĨ THUẬT:</strong>
                    Không tự thêm backend/db, chạy mượt mà trên điện thoại & máy tính.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: RAW TEXT CODE PREVIEW */}
          {viewMode === 'raw' && (
            <div className="space-y-3">
              <div className="relative rounded-2xl bg-gray-900 text-gray-100 p-5 font-mono text-xs sm:text-sm overflow-auto max-h-[500px] border border-gray-800 shadow-inner leading-relaxed select-all">
                <div className="absolute top-3 right-4 text-[10px] text-gray-400 bg-gray-800 px-2.5 py-1 rounded font-sans">
                  Master Prompt cho Custom Webapp
                </div>
                <pre className="whitespace-pre-wrap break-words font-mono text-xs sm:text-sm text-gray-200">
                  {masterPromptText}
                </pre>
              </div>
            </div>
          )}

          {/* NEXT STEPS GUIDE: 8 STEPS OF VIBE CODING */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h4 className="text-sm sm:text-base font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              BƯỚC TIẾP THEO: 8 BƯỚC THỰC HIỆN TRÊN GOOGLE AI STUDIO
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs sm:text-sm">
              <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-extrabold block mb-1">1. SAO CHÉP</span>
                Bấm nút <strong className="text-amber-300">"Sao chép Master Prompt"</strong> phía trên.
              </div>
              <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-extrabold block mb-1">2. MỞ AI STUDIO</span>
                Bấm nút <strong className="text-blue-300">"Mở Google AI Studio"</strong> để làm việc.
              </div>
              <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-extrabold block mb-1">3. CHỌN BUILD MODE</span>
                Chọn chế độ <strong className="text-emerald-300">Build mode</strong> trong Google AI Studio.
              </div>
              <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-extrabold block mb-1">4. DÁN PROMPT</span>
                Dán Master Prompt vào khung chat chỉ dẫn của AI.
              </div>
              <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-extrabold block mb-1">5. TẠO ỨNG DỤNG</span>
                Bấm <strong className="text-amber-300">Run / Generate</strong> để AI khởi tạo webapp.
              </div>
              <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-extrabold block mb-1">6. DÙNG THỬ</span>
                Thao tác trực tiếp trên màn hình xem trước (Preview).
              </div>
              <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-extrabold block mb-1">7. QUAN SÁT</span>
                Kiểm tra giao diện và phản hồi khi học sinh làm bài.
              </div>
              <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                <span className="text-amber-400 font-extrabold block mb-1">8. TINH CHỈNH</span>
                Chat thêm với AI: "Chỉnh chữ to hơn", "Thêm nút chơi lại"...
              </div>
            </div>

            <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-amber-200 font-medium flex items-center gap-2.5">
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Lưu ý:</strong> Phiên bản đầu tiên do AI tạo ra là mẫu dùng thử. Thầy cô hoàn toàn có thể yêu cầu AI chỉnh sửa lại cho ưng ý!
              </span>
            </div>
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => setActiveStep(2)}
              className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại bản thiết kế</span>
            </button>

            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <span>Mở Google AI Studio ngay</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
