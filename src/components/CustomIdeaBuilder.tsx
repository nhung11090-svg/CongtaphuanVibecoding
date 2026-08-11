import React, { useState, useEffect } from 'react';
import { CustomWebappIdea, SavedPrompt } from '../types';
import { generateCustomWebappMasterPrompt } from '../data/masterPrompt';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Lightbulb, 
  ShieldCheck, 
  Target, 
  FileText, 
  Layers,
  HelpCircle,
  Edit3,
  BookOpen,
  ArrowRight,
  Paperclip,
  Upload,
  X
} from 'lucide-react';

interface CustomIdeaBuilderProps {
  onSavePrompt: (prompt: SavedPrompt) => void;
  onCopyPromptText: (text: string) => void;
  onSwitchToGameMode: () => void;
}

const DEFAULT_CONSTRAINTS = [
  'Sử dụng tiếng Việt',
  'Responsive trên máy tính và điện thoại',
  'Không yêu cầu đăng nhập',
  'Không sử dụng database',
  'Không thu thập thông tin cá nhân',
  'Không tự ý bổ sung chức năng ngoài yêu cầu',
  'Nội dung phù hợp đối tượng học sinh'
];

const EXAMPLE_DATA: CustomWebappIdea = {
  productName: 'Ôn tập Tin học 8',
  targetAudience: 'Học sinh lớp 8',
  problem: 'Học sinh cần ôn lại kiến thức trước kỳ kiểm tra nhưng việc ôn tập bằng tài liệu tĩnh ít tương tác và chưa có phản hồi ngay.',
  supportTask: 'Giúp học sinh luyện các câu hỏi ôn tập và nhận phản hồi sau mỗi câu.',
  desiredOutcome: 'Học sinh biết câu nào đúng, câu nào sai và nội dung nào cần ôn lại.',
  demandSentence: 'Tôi cần một webapp giúp học sinh lớp 8 ôn tập kiến thức học kỳ thông qua các câu hỏi tương tác để các em biết ngay kết quả và xác định nội dung cần ôn lại.',
  objective: 'Giúp học sinh chủ động ôn tập học kỳ.',
  contentData: 'Câu hỏi ôn tập do giáo viên cung cấp',
  contentOptions: ['Chỉ sử dụng nội dung do giáo viên cung cấp'],
  functions: [
    'Chọn chủ đề ôn tập',
    'Làm câu hỏi trắc nghiệm',
    'Phản hồi đúng/sai',
    'Hiển thị giải thích',
    'Tổng kết và ôn lại câu sai'
  ],
  userFlowSteps: ['Mở app', 'Chọn chủ đề', 'Làm câu hỏi', 'Nhận phản hồi', 'Xem kết quả', 'Ôn lại'],
  userFlow: 'Mở app → Chọn chủ đề → Làm câu hỏi → Nhận phản hồi → Xem kết quả → Ôn lại',
  expectedOutput: 'Kết quả từng câu, giải thích, số câu đúng, số câu sai, nội dung cần ôn lại',
  constraints: [
    'Sử dụng tiếng Việt',
    'Responsive trên máy tính và điện thoại',
    'Không yêu cầu đăng nhập',
    'Không sử dụng database',
    'Không thu thập thông tin cá nhân',
    'Chỉ sử dụng nội dung do giáo viên cung cấp'
  ],
  otherConstraints: ''
};

export const CustomIdeaBuilder: React.FC<CustomIdeaBuilderProps> = ({
  onSavePrompt,
  onCopyPromptText,
  onSwitchToGameMode,
}) => {
  // 4-step wizard state
  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [idea, setIdea] = useState<CustomWebappIdea>({
    targetAudience: '',
    problem: '',
    supportTask: '',
    desiredOutcome: '',
    demandSentence: '',
    productName: '',
    objective: '',
    contentData: '',
    contentOptions: ['Chỉ sử dụng nội dung do giáo viên cung cấp'],
    functions: ['Chọn chủ đề ôn tập', 'Làm câu hỏi trắc nghiệm', 'Hiển thị kết quả và phản hồi'],
    userFlowSteps: ['Mở webapp', 'Chọn chủ đề', 'Làm câu hỏi', 'Nhận phản hồi', 'Xem kết quả'],
    userFlow: '',
    expectedOutput: '',
    constraints: [...DEFAULT_CONSTRAINTS],
    otherConstraints: ''
  });

  // Edit demand sentence toggle
  const [isEditingDemand, setIsEditingDemand] = useState<boolean>(false);

  // File attachments state
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: number; content?: string }[]>([]);

  // UI status states
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCopyNotice, setShowCopyNotice] = useState<boolean>(false);

  // Auto-generate demand sentence if not manually edited
  useEffect(() => {
    if (!isEditingDemand) {
      const user = idea.targetAudience.trim() || '[NGƯỜI DÙNG]';
      const task = idea.supportTask.trim() || '[VIỆC CẦN HỖ TRỢ]';
      const outcome = idea.desiredOutcome.trim() || '[KẾT QUẢ MONG MUỐN]';

      if (idea.targetAudience.trim() || idea.supportTask.trim() || idea.desiredOutcome.trim()) {
        const sentence = `Tôi cần một webapp giúp ${user} ${task} để ${outcome}.`;
        setIdea(prev => ({ 
          ...prev, 
          demandSentence: sentence,
          // default objective to demandSentence if objective not filled
          objective: prev.objective ? prev.objective : sentence
        }));
      }
    }
  }, [idea.targetAudience, idea.supportTask, idea.desiredOutcome, isEditingDemand]);

  // Load Example Data
  const handleLoadExample = () => {
    setIdea({ ...EXAMPLE_DATA });
    setAttachedFiles([]);
    setIsEditingDemand(true);
    setValidationError(null);
  };

  // Auto-saved banner state
  const [autoSavedNotice, setAutoSavedNotice] = useState<boolean>(false);

  // Generate and Auto-Save Master Prompt
  const handleGenerateAndSave = () => {
    const promptText = generateCustomWebappMasterPrompt(idea);
    const title = idea.productName?.trim() || (idea.targetAudience ? `Webapp cho ${idea.targetAudience}` : 'Webapp Tùy chỉnh');
    
    const savedItem: SavedPrompt = {
      id: `custom-${Date.now()}`,
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
        subject: idea.productName || 'Webapp Tùy chỉnh',
        grade: idea.targetAudience || '',
        lesson_name: idea.objective || idea.problem || '',
        game_type: 'custom',
        objective: idea.objective || '',
        core_content: idea.contentData || '',
        keywords: (Array.isArray(idea.functions) ? idea.functions : [idea.functions]).join(', '),
        question_count: 'N/A',
        duration: 'N/A'
      },
      customIdea: idea,
      fullPrompt: promptText
    };

    onSavePrompt(savedItem);
    setAutoSavedNotice(true);
    setActiveStep(4);
    setValidationError(null);
  };

  // Reset Form
  const handleResetForm = () => {
    setIdea({
      targetAudience: '',
      problem: '',
      supportTask: '',
      desiredOutcome: '',
      demandSentence: '',
      productName: '',
      objective: '',
      contentData: '',
      contentOptions: ['Chỉ sử dụng nội dung do giáo viên cung cấp'],
      functions: [''],
      userFlowSteps: ['Mở webapp', 'Chọn chủ đề', 'Làm câu hỏi', 'Nhận phản hồi', 'Xem kết quả'],
      userFlow: '',
      expectedOutput: '',
      constraints: [...DEFAULT_CONSTRAINTS],
      otherConstraints: ''
    });
    setAttachedFiles([]);
    setIsEditingDemand(false);
    setActiveStep(1);
    setValidationError(null);
  };

  // Step 1 Validation -> Step 2
  const handleGoToStep2 = () => {
    if (!idea.targetAudience.trim()) {
      setValidationError('Vui lòng điền thông tin "Ai sẽ sử dụng webapp?" (Người dùng).');
      return;
    }
    if (!idea.problem.trim()) {
      setValidationError('Vui lòng điền thông tin "Người dùng đang gặp khó khăn gì?" (Vấn đề).');
      return;
    }
    if (!idea.supportTask.trim()) {
      setValidationError('Vui lòng điền thông tin "Webapp cần hỗ trợ việc gì?".');
      return;
    }
    if (!idea.desiredOutcome.trim()) {
      setValidationError('Vui lòng điền thông tin "Kết quả mong muốn".');
      return;
    }

    setValidationError(null);
    setActiveStep(2);
  };

  // Step 2 Validation -> Step 3
  const handleGoToStep3 = () => {
    const validFns = (Array.isArray(idea.functions) ? idea.functions : [idea.functions])
      .filter(f => f && f.trim() !== '');
    if (validFns.length === 0) {
      setValidationError('Vui lòng gõ hoặc dán ít nhất 1 chức năng chính cho webapp.');
      return;
    }

    const validSteps = idea.userFlowSteps ? idea.userFlowSteps.filter(s => s.trim() !== '') : [];
    if (validSteps.length === 0) {
      setValidationError('Vui lòng điền ít nhất 1 bước trong luồng sử dụng.');
      return;
    }

    setValidationError(null);
    setActiveStep(3);
  };

  // File Upload Handler for Section C
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        const newFileObj = { name: file.name, size: file.size, content: text };
        
        setAttachedFiles(prev => [...prev, newFileObj]);

        setIdea(prev => {
          const fileSnippet = text.trim() 
            ? `\n[Tệp đính kèm: ${file.name}]\n${text.slice(0, 3000)}${text.length > 3000 ? '\n...(đã rút gọn nội dung tệp)' : ''}`
            : `\n[Tệp đính kèm: ${file.name}]`;
          return {
            ...prev,
            contentData: prev.contentData ? `${prev.contentData}\n${fileSnippet}` : fileSnippet.trim()
          };
        });
      };

      if (file.type.startsWith('text/') || file.name.match(/\.(txt|md|csv|json|js|ts|html|css|xml)$/i)) {
        reader.readAsText(file);
      } else {
        const newFileObj = { name: file.name, size: file.size };
        setAttachedFiles(prev => [...prev, newFileObj]);
        setIdea(prev => ({
          ...prev,
          contentData: prev.contentData ? `${prev.contentData}\n[Tệp đính kèm: ${file.name}]` : `[Tệp đính kèm: ${file.name}]`
        }));
      }
    });

    e.target.value = '';
  };

  const handleRemoveAttachedFile = (index: number) => {
    const fileToRemove = attachedFiles[index];
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    
    if (fileToRemove) {
      setIdea(prev => {
        let updatedData = prev.contentData || '';
        updatedData = updatedData.replace(new RegExp(`\n?\\[Tệp đính kèm: ${fileToRemove.name}\\][\\s\\S]*?(\\n\\n|$)`, 'g'), '');
        updatedData = updatedData.replace(new RegExp(`\n?\\[Tệp đính kèm: ${fileToRemove.name}\\]`, 'g'), '');
        return { ...prev, contentData: updatedData.trim() };
      });
    }
  };

  // Master Prompt text
  const masterPromptText = generateCustomWebappMasterPrompt(idea);

  // Copy Master Prompt Handler
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPromptText);
    setCopied(true);
    setShowCopyNotice(true);
    onCopyPromptText(masterPromptText);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  // Checkpoint validation items for Step 3
  const checkpointItems = [
    { label: 'Đã xác định một vấn đề cụ thể', pass: Boolean(idea.problem.trim()), step: 1 },
    { label: 'Đã xác định người dùng', pass: Boolean(idea.targetAudience.trim()), step: 1 },
    { label: 'Đã xác định mục tiêu', pass: Boolean(idea.objective.trim() || idea.demandSentence.trim()), step: 2 },
    { label: 'Có các chức năng chính', pass: (Array.isArray(idea.functions) ? idea.functions : [idea.functions]).filter(f => f && f.trim() !== '').length >= 1, step: 2 },
    { label: 'Có luồng sử dụng', pass: Boolean((idea.userFlowSteps && idea.userFlowSteps.filter(s => s.trim() !== '').length > 0) || idea.userFlow.trim()), step: 2 },
    { label: 'Biết app cần trả về kết quả gì', pass: Boolean(idea.expectedOutput.trim() || idea.desiredOutcome.trim()), step: 2 },
    { label: 'Đã xác định các ràng buộc', pass: idea.constraints.length > 0, step: 2 }
  ];

  const isAllCheckpointsPassed = checkpointItems.every(item => item.pass);

  const handleUserStepChange = (index: number, value: string) => {
    const steps = idea.userFlowSteps ? [...idea.userFlowSteps] : ['Mở webapp'];
    steps[index] = value;
    setIdea(prev => ({ 
      ...prev, 
      userFlowSteps: steps,
      userFlow: steps.filter(Boolean).join(' → ')
    }));
  };

  const handleAddUserStep = () => {
    const steps = idea.userFlowSteps ? [...idea.userFlowSteps] : [];
    if (steps.length < 8) {
      steps.push('');
      setIdea(prev => ({ ...prev, userFlowSteps: steps }));
    }
  };

  const handleRemoveUserStep = (index: number) => {
    const steps = idea.userFlowSteps ? [...idea.userFlowSteps] : [];
    if (steps.length > 1) {
      steps.splice(index, 1);
      setIdea(prev => ({ 
        ...prev, 
        userFlowSteps: steps,
        userFlow: steps.filter(Boolean).join(' → ')
      }));
    }
  };

  const handleToggleContentOption = (opt: string) => {
    setIdea(prev => {
      const current = prev.contentOptions || [];
      if (current.includes(opt)) {
        return { ...prev, contentOptions: current.filter(o => o !== opt) };
      } else {
        return { ...prev, contentOptions: [...current, opt] };
      }
    });
  };

  const handleToggleConstraint = (c: string) => {
    setIdea(prev => {
      if (prev.constraints.includes(c)) {
        return { ...prev, constraints: prev.constraints.filter(item => item !== c) };
      } else {
        return { ...prev, constraints: [...prev.constraints, c] };
      }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER & PIPELINE PRINCIPLE BANNER */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl shadow-lg shrink-0 mt-0.5">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-orange-500/30 text-orange-300 border border-orange-500/40 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Quy trình Vibe Coding
                </span>
                <span className="text-xs text-purple-200 font-extrabold">
                  4 Bước chuẩn hóa ý tưởng webapp
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
                TẠO WEBAPP THEO Ý TƯỞNG RIÊNG
              </h2>
              <p className="text-sm text-purple-100 mt-2 max-w-3xl leading-relaxed font-medium">
                Cổng tập huấn hướng dẫn thầy cô suy nghĩ từ nhu cầu thực tế, chuẩn hóa Requirements và tự động đóng gói thành <strong className="text-orange-400 font-extrabold">Master Prompt</strong> dành cho Google AI Studio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onSwitchToGameMode}
              className="px-4 py-2.5 rounded-2xl border border-purple-400/40 bg-purple-900/60 hover:bg-purple-800/80 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-md"
            >
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Chuyển sang Mẫu trò chơi có sẵn</span>
            </button>
            <button
              onClick={handleResetForm}
              className="p-2.5 rounded-2xl border border-purple-400/40 bg-purple-900/60 hover:bg-purple-800/80 text-white transition-all shadow-md"
              title="Làm mới form"
            >
              <RotateCcw className="w-4 h-4 text-orange-400" />
            </button>
          </div>
        </div>
      </div>

      {/* CORE GUIDING PRINCIPLE CARD */}
      <div className="bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-800/50 text-white rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-xl shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-orange-400 uppercase tracking-wider">THÔNG ĐIỆP TẬP HUẤN</h4>
            <p className="text-sm font-bold text-purple-100 mt-0.5">
              “Bắt đầu từ vấn đề – không bắt đầu từ công cụ.”
            </p>
          </div>
        </div>
        
        {activeStep === 1 && (
          <button
            onClick={handleLoadExample}
            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Xem ví dụ</span>
          </button>
        )}
      </div>

      {/* PROGRESS STEPPER (4 STEPS) */}
      <div className="bg-white border border-purple-100 rounded-2xl p-3 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs font-extrabold">
          {[
            { step: 1, title: '1. Nhu cầu', subtitle: 'Xác định bài toán' },
            { step: 2, title: '2. Requirements', subtitle: 'Thiết kế yêu cầu' },
            { step: 3, title: '3. Kiểm tra', subtitle: 'Soát lỗi & Checkpoint' },
            { step: 4, title: '4. Master Prompt', subtitle: 'Tạo prompt AI Studio' }
          ].map(item => {
            const isActive = activeStep === item.step;
            const isCompleted = activeStep > item.step;

            return (
              <button
                key={item.step}
                onClick={() => {
                  if (item.step < activeStep) {
                    setActiveStep(item.step);
                    setValidationError(null);
                  } else if (item.step === 2 && activeStep === 1) {
                    handleGoToStep2();
                  } else if (item.step === 3 && activeStep === 2) {
                    handleGoToStep3();
                  } else if (item.step === 4 && activeStep === 3) {
                    handleGenerateAndSave();
                  }
                }}
                className={`p-3 rounded-xl transition-all border flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-purple-50 border-purple-600 text-purple-950 shadow-sm ring-2 ring-purple-200'
                    : isCompleted
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black ${
                    isActive ? 'bg-orange-500 text-white' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isCompleted ? '✓' : item.step}
                  </span>
                  <span className="text-xs font-extrabold">{item.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">{item.subtitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VALIDATION ERROR BANNER */}
      {validationError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
          <button onClick={() => setValidationError(null)} className="text-red-500 font-bold hover:underline text-xs">Đóng</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 1 — XÁC ĐỊNH NHU CẦU */}
      {/* ========================================================================= */}
      {activeStep === 1 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-7 animate-fadeIn">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
                BƯỚC 1 — BẮT ĐẦU TỪ BÀI TOÁN
              </span>
              <button
                onClick={handleLoadExample}
                className="text-xs text-purple-700 hover:text-purple-900 font-bold underline flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Nạp ví dụ mẫu: Ôn tập Tin học 8</span>
              </button>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">
              BƯỚC 1 — Bạn đang muốn giải quyết vấn đề gì?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
              Đừng bắt đầu bằng việc chọn công nghệ hoặc nghĩ ngay đến một app. Hãy bắt đầu từ một vấn đề thật trong công việc hoặc dạy học của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* A. NGƯỜI DÙNG */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                A. NGƯỜI DÙNG <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500">Ai sẽ sử dụng webapp?</p>
              <input
                type="text"
                placeholder="Ví dụ: Học sinh lớp 8"
                value={idea.targetAudience}
                onChange={e => setIdea(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm text-gray-900 font-medium"
              />
            </div>

            {/* B. VẤN ĐỀ */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                B. VẤN ĐỀ <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500">Người dùng đang gặp khó khăn gì?</p>
              <textarea
                rows={3}
                placeholder="Ví dụ: Học sinh cần ôn lại kiến thức trước kỳ kiểm tra nhưng tài liệu còn phân tán và việc tự ôn chưa có phản hồi ngay."
                value={idea.problem}
                onChange={e => setIdea(prev => ({ ...prev, problem: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm text-gray-900 font-medium leading-relaxed"
              />
            </div>

            {/* C. VIỆC CẦN HỖ TRỢ */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                C. VIỆC CẦN HỖ TRỢ <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500">Webapp cần hỗ trợ việc gì?</p>
              <textarea
                rows={3}
                placeholder="Ví dụ: Giúp học sinh luyện câu hỏi ôn tập và nhận phản hồi sau mỗi câu."
                value={idea.supportTask}
                onChange={e => setIdea(prev => ({ ...prev, supportTask: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm text-gray-900 font-medium leading-relaxed"
              />
            </div>

            {/* D. KẾT QUẢ MONG MUỐN */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                D. KẾT QUẢ MONG MUỐN <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500">Sau khi sử dụng webapp, bạn muốn người dùng đạt được điều gì?</p>
              <textarea
                rows={3}
                placeholder="Ví dụ: Học sinh biết câu nào đúng, câu nào sai và nội dung nào cần ôn lại."
                value={idea.desiredOutcome}
                onChange={e => setIdea(prev => ({ ...prev, desiredOutcome: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm text-gray-900 font-medium leading-relaxed"
              />
            </div>
          </div>

          {/* CÂU MÔ TẢ NHU CẦU CARD */}
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50/50 to-amber-50/30 border border-purple-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-700" />
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wider">
                  CÂU MÔ TẢ NHU CẦU (TỰ ĐỘNG CHUẨN HÓA)
                </h4>
              </div>
              <button
                onClick={() => setIsEditingDemand(!isEditingDemand)}
                className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingDemand ? 'Tự động tổng hợp' : 'Chỉnh sửa trực tiếp'}</span>
              </button>
            </div>

            {isEditingDemand ? (
              <textarea
                rows={3}
                value={idea.demandSentence}
                onChange={e => setIdea(prev => ({ ...prev, demandSentence: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm font-semibold text-purple-950 leading-relaxed"
              />
            ) : (
              <p className="text-xs sm:text-sm font-bold text-purple-950 bg-white/80 border border-purple-200/80 p-3.5 rounded-xl leading-relaxed">
                “{idea.demandSentence || 'Tôi cần một webapp giúp [NGƯỜI DÙNG] [VIỆC CẦN HỖ TRỢ] để [KẾT QUẢ MONG MUỐN].'}”
              </p>
            )}

            <p className="text-[11px] text-purple-700/80 font-medium">
              Cấu trúc: “Tôi cần một webapp giúp [NGƯỜI DÙNG] [VIỆC CẦN HỖ TRỢ] để [KẾT QUẢ MONG MUỐN].”
            </p>
          </div>

          {/* NEXT BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleGoToStep2}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <span>Tiếp tục xây dựng Requirements</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 2 — THIẾT KẾ REQUIREMENTS */}
      {/* ========================================================================= */}
      {activeStep === 2 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-7 animate-fadeIn">
          {/* TOP CARD: NHU CẦU ĐÃ XÁC ĐỊNH */}
          <div className="bg-purple-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
            <span className="text-[11px] font-extrabold text-orange-400 uppercase tracking-wider block">
              NHU CẦU ĐÃ XÁC ĐỊNH (TỪ BƯỚC 1)
            </span>
            <p className="text-sm font-bold text-purple-100 leading-relaxed">
              “{idea.demandSentence || `Tôi cần một webapp giúp ${idea.targetAudience} ${idea.supportTask} để ${idea.desiredOutcome}.`}”
            </p>
          </div>

          {/* CARD: PHẠM VI PHIÊN BẢN ĐẦU TIÊN */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-950 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>PHIÊN BẢN ĐẦU TIÊN NÊN ĐỦ NHỎ</span>
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-900">
              <span className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg">01 vấn đề</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg">01 nhóm người dùng</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg">3–5 chức năng</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg">01 luồng chính</span>
            </div>
            <p className="text-[11px] font-semibold text-amber-800 italic mt-1">
              “Nhỏ nhưng chạy được &gt; Lớn nhưng chưa hoàn thiện”
            </p>
          </div>

          <div>
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider">
              BƯỚC 2 — CHUẨN HÓA YÊU CẦU
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">
              BƯỚC 2 — Webapp cần làm được gì?
            </h3>
          </div>

          <div className="space-y-6">
            {/* A. TÊN SẢN PHẨM */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                A. TÊN SẢN PHẨM <span className="text-gray-400 font-normal">(Không bắt buộc)</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Ôn tập Tin học 8"
                value={idea.productName}
                onChange={e => setIdea(prev => ({ ...prev, productName: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm text-gray-900 font-medium"
              />
            </div>

            {/* B. MỤC TIÊU */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                B. MỤC TIÊU CHÍNH CỦA WEBAPP
              </label>
              <textarea
                rows={2}
                value={idea.objective}
                onChange={e => setIdea(prev => ({ ...prev, objective: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm text-gray-900 font-medium leading-relaxed"
              />
            </div>

            {/* C. NỘI DUNG / DỮ LIỆU */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                    C. NỘI DUNG / DỮ LIỆU
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">Webapp sẽ sử dụng nội dung hoặc dữ liệu gì?</p>
                </div>

                {/* FILE ATTACHMENT BUTTON */}
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-extrabold transition-all border border-purple-200 shrink-0 shadow-sm">
                  <Paperclip className="w-3.5 h-3.5 text-purple-700" />
                  <span>Đính kèm tệp văn bản</span>
                  <input
                    type="file"
                    multiple
                    accept=".txt,.md,.csv,.json,.doc,.docx,.pdf,text/plain,application/json,text/csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* ATTACHED FILES CHIPS */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-purple-300 text-xs font-semibold text-purple-950 shadow-sm">
                      <Paperclip className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="max-w-[180px] truncate">{file.name}</span>
                      <span className="text-[10px] text-gray-400">({Math.round(file.size / 1024)} KB)</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachedFile(idx)}
                        className="text-gray-400 hover:text-red-500 font-black ml-1 transition-colors"
                        title="Xóa tệp đính kèm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                rows={4}
                placeholder={`Ví dụ:
- Câu hỏi ôn tập do giáo viên cung cấp
- Nội dung từ tài liệu môn học
- Văn bản người dùng nhập
- Danh sách nhiệm vụ...`}
                value={idea.contentData}
                onChange={e => setIdea(prev => ({ ...prev, contentData: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm text-gray-900 font-medium leading-relaxed"
              />

              <div className="space-y-2 pt-1">
                {[
                  'Chỉ sử dụng nội dung do giáo viên cung cấp',
                  'Cho phép AI xử lý nội dung người dùng nhập',
                  'Cho phép AI tạo nội dung mới'
                ].map(opt => {
                  const isChecked = (idea.contentOptions || []).includes(opt);
                  return (
                    <label key={opt} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleContentOption(opt)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* D. CHỨC NĂNG CHÍNH */}
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                  D. CHỨC NĂNG CHÍNH <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nhập hoặc dán danh sách các chức năng chính của webapp (gõ tự do hoặc mỗi dòng một chức năng).
                </p>
              </div>

              <textarea
                rows={5}
                placeholder={`Gõ hoặc dán danh sách các chức năng chính ở đây...
Ví dụ:
- Chọn chủ đề ôn tập
- Làm câu hỏi trắc nghiệm
- Phản hồi đúng/sai tức thì và hiển thị giải thích
- Tổng kết kết quả và gợi ý nội dung cần ôn lại`}
                value={Array.isArray(idea.functions) ? idea.functions.join('\n') : (idea.functions || '')}
                onChange={e => {
                  const lines = e.target.value.split('\n');
                  setIdea(prev => ({ ...prev, functions: lines }));
                }}
                className="w-full px-3.5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm text-gray-900 font-medium leading-relaxed shadow-sm"
              />
            </div>

            {/* E. LUỒNG SỬ DỤNG */}
            <div className="space-y-3 bg-purple-50/50 border border-purple-100 rounded-2xl p-4.5">
              <div>
                <label className="block text-xs font-extrabold text-purple-950 uppercase tracking-wide">
                  E. LUỒNG SỬ DỤNG
                </label>
                <p className="text-xs text-purple-800/80 mt-0.5">
                  Người dùng sẽ sử dụng webapp như thế nào? (Step flow)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {(idea.userFlowSteps || ['Mở webapp', 'Chọn chủ đề', 'Làm câu hỏi']).map((stepText, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className="bg-white border border-purple-200 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                      <span className="text-[10px] font-black text-purple-600">Bước {idx + 1}</span>
                      <input
                        type="text"
                        value={stepText}
                        onChange={e => handleUserStepChange(idx, e.target.value)}
                        placeholder="Nhiệm vụ..."
                        className="w-24 sm:w-28 bg-transparent outline-none text-xs font-bold text-gray-900"
                      />
                      {(idea.userFlowSteps || []).length > 1 && (
                        <button
                          onClick={() => handleRemoveUserStep(idx)}
                          className="text-gray-400 hover:text-red-500 text-xs font-black"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {idx < (idea.userFlowSteps || []).length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    )}
                  </div>
                ))}

                {(idea.userFlowSteps || []).length < 8 && (
                  <button
                    onClick={handleAddUserStep}
                    className="px-3 py-1.5 rounded-xl border border-dashed border-purple-400 text-purple-700 hover:bg-purple-100 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm bước</span>
                  </button>
                )}
              </div>
            </div>

            {/* F. ĐẦU RA */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                F. ĐẦU RA
              </label>
              <p className="text-xs text-gray-500">Webapp cần trả về kết quả gì cho người dùng?</p>
              <textarea
                rows={3}
                placeholder={`Ví dụ:
- Kết quả đúng/sai
- Giải thích
- Tổng số câu đúng
- Nội dung cần ôn lại`}
                value={idea.expectedOutput}
                onChange={e => setIdea(prev => ({ ...prev, expectedOutput: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs sm:text-sm text-gray-900 font-medium leading-relaxed"
              />
            </div>

            {/* G. RÀNG BUỘC */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4.5">
              <label className="block text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                G. RÀNG BUỘC
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEFAULT_CONSTRAINTS.map(c => {
                  const isChecked = idea.constraints.includes(c);
                  return (
                    <label key={c} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800 bg-white p-2.5 border rounded-xl">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleConstraint(c)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span>{c}</span>
                    </label>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Ràng buộc khác:</label>
                <input
                  type="text"
                  placeholder="Nhập thêm các ràng buộc riêng nếu có..."
                  value={idea.otherConstraints}
                  onChange={e => setIdea(prev => ({ ...prev, otherConstraints: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-xs text-gray-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* BACK AND NEXT BUTTONS */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setActiveStep(1);
                setValidationError(null);
              }}
              className="px-5 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-sm flex items-center gap-2 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>← Quay lại Bước 1</span>
            </button>

            <button
              onClick={handleGoToStep3}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <span>Tiếp tục Kiểm tra Requirements</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 3 — KIỂM TRA REQUIREMENTS */}
      {/* ========================================================================= */}
      {activeStep === 3 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-7 animate-fadeIn">
          <div>
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider">
              BƯỚC 3 — SOÁT LỖI YÊU CẦU
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">
              BƯỚC 3 — Kiểm tra trước khi tạo Master Prompt
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Xác nhận lại toàn bộ bản thiết kế kỹ lưỡng trước khi đóng gói thành Master Prompt cho Google AI Studio.
            </p>
          </div>

          {/* CHECKPOINT CHECKLIST */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>CHECKPOINT BẢN THIẾT KẾ</span>
              </h4>
              <span className={`text-xs font-extrabold px-3 py-0.5 rounded-full ${
                isAllCheckpointsPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {checkpointItems.filter(i => i.pass).length} / {checkpointItems.length} đạt yêu cầu
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {checkpointItems.map((item, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                  item.pass ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-amber-950/40 border-amber-800 text-amber-200'
                }`}>
                  <span className="flex items-center gap-2">
                    {item.pass ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                    <span>{item.label}</span>
                  </span>
                  {!item.pass && (
                    <button
                      onClick={() => setActiveStep(item.step)}
                      className="text-[10px] font-bold text-amber-300 underline hover:text-white shrink-0 ml-2"
                    >
                      Bổ sung
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* REQUIREMENTS SUMMARY REPORT */}
          <div className="border border-purple-200 rounded-2xl bg-purple-50/30 p-5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 border-b border-purple-200 pb-2">
              BẢN TỔNG HỢP REQUIREMENTS
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-extrabold text-gray-500 block">TÊN SẢN PHẨM</span>
                <span className="font-bold text-gray-900">{idea.productName || 'Chưa đặt tên'}</span>
              </div>

              <div>
                <span className="font-extrabold text-gray-500 block">NGƯỜI DÙNG</span>
                <span className="font-bold text-gray-900">{idea.targetAudience || 'Chưa nhập'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="font-extrabold text-gray-500 block">VẤN ĐỀ CẦN GIẢI QUYẾT</span>
                <span className="font-medium text-gray-900">{idea.problem || 'Chưa nhập'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="font-extrabold text-gray-500 block">MÔ TẢ NHU CẦU</span>
                <span className="font-bold text-purple-900">{idea.demandSentence || 'Chưa nhập'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="font-extrabold text-gray-500 block">MỤC TIÊU</span>
                <span className="font-medium text-gray-900">{idea.objective || 'Chưa nhập'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="font-extrabold text-gray-500 block">NỘI DUNG / DỮ LIỆU</span>
                <p className="font-medium text-gray-900 whitespace-pre-line">
                  {idea.contentData || 'Nội dung do giáo viên/người dùng cung cấp'}
                </p>
                {idea.contentOptions && idea.contentOptions.length > 0 && (
                  <ul className="list-disc list-inside text-[11px] text-gray-600 mt-1">
                    {idea.contentOptions.map(o => <li key={o}>{o}</li>)}
                  </ul>
                )}
              </div>

              <div className="sm:col-span-2">
                <span className="font-extrabold text-gray-500 block">CHỨC NĂNG CHÍNH</span>
                <ol className="list-decimal list-inside font-bold text-gray-900 space-y-0.5 mt-1">
                  {idea.functions.filter(f => f.trim() !== '').map((fn, i) => (
                    <li key={i}>{fn}</li>
                  ))}
                </ol>
              </div>

              <div className="sm:col-span-2">
                <span className="font-extrabold text-gray-500 block">LUỒNG SỬ DỤNG</span>
                <span className="font-bold text-gray-900">
                  {idea.userFlowSteps && idea.userFlowSteps.filter(s => s.trim() !== '').length > 0
                    ? idea.userFlowSteps.filter(s => s.trim() !== '').join(' → ')
                    : idea.userFlow || 'Chưa thiết lập'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="font-extrabold text-gray-500 block">ĐẦU RA</span>
                <span className="font-medium text-gray-900">{idea.expectedOutput || idea.desiredOutcome || 'Chưa nhập'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="font-extrabold text-gray-500 block">RÀNG BUỘC</span>
                <ul className="list-disc list-inside text-gray-800 space-y-0.5 mt-1">
                  {idea.constraints.map(c => <li key={c}>{c}</li>)}
                  {idea.otherConstraints && <li>{idea.otherConstraints}</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => setActiveStep(2)}
              className="px-5 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-sm flex items-center gap-2 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>← Chỉnh sửa Requirements</span>
            </button>

            <button
              onClick={handleGenerateAndSave}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Tạo Master Prompt →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BƯỚC 4 — TẠO MASTER PROMPT */}
      {/* ========================================================================= */}
      {activeStep === 4 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
              BƯỚC 4 — KHỞI TẠO HOÀN TẤT
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">
              BƯỚC 4 — Master Prompt đã sẵn sàng cho Google AI Studio
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Sao chép đoạn Master Prompt đã chuẩn hóa này và dán vào thanh chat của <strong className="text-purple-700">Google AI Studio Build</strong>.
            </p>
          </div>

          {autoSavedNotice && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs sm:text-sm text-purple-900 font-bold flex items-center gap-2.5 animate-fadeIn shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Đã tự động lưu Master Prompt này vào <strong>Kho Prompt đã tạo</strong> của bạn!</span>
            </div>
          )}

          {showCopyNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-900 font-bold flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Đã sao chép Master Prompt. Bạn có thể sử dụng prompt này trong Google AI Studio Build.</span>
            </div>
          )}

          {/* MASTER PROMPT TEXTAREA */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">
                MASTER PROMPT ĐẦU RA
              </label>
              <span className="text-[11px] text-gray-500 font-medium">Chuẩn định dạng Vibe Coding</span>
            </div>

            <textarea
              readOnly
              rows={16}
              value={masterPromptText}
              className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none leading-relaxed select-all"
            />
          </div>

          {/* 3 ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setActiveStep(2)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>← CHỈNH SỬA REQUIREMENTS</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setShowCopyNotice(false);
                  setActiveStep(3);
                }}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs sm:text-sm transition-all"
              >
                TẠO LẠI MASTER PROMPT
              </button>

              <button
                onClick={handleCopyPrompt}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP MASTER PROMPT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
