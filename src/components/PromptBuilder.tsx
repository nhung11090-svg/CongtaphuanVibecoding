import React, { useState } from 'react';
import { PromptVariables, PresetTemplate, SavedPrompt, GAME_TYPES, GameTypeOption } from '../types';
import { PRESET_TEMPLATES } from '../data/presets';
import { generateMasterPrompt, getGameTypeLabel } from '../data/masterPrompt';
import { CustomIdeaBuilder } from './CustomIdeaBuilder';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Wand2, 
  BookmarkPlus, 
  Play, 
  RotateCcw,
  BookOpen,
  Sparkles,
  Info,
  Layers,
  HelpCircle,
  Hash,
  ArrowLeftRight,
  Star,
  ArrowUpDown,
  Home,
  ArrowUpRight,
  Menu,
  Disc,
  ChevronRight,
  ChevronLeft,
  Eye,
  Code,
  Gamepad2,
  GraduationCap
} from 'lucide-react';

interface PromptBuilderProps {
  onCopyPrompt: (promptText: string, vars: PromptVariables) => void;
  onSavePrompt: (prompt: SavedPrompt) => void;
  onLaunchSandbox: () => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  onCopyPrompt,
  onSavePrompt,
  onLaunchSandbox,
}) => {
  // Main mode switcher: 'custom_idea' (default) vs 'game_template'
  const [builderMode, setBuilderMode] = useState<'custom_idea' | 'game_template'>('custom_idea');

  // Initial default variables with empty strings so placeholders are active
  const [variables, setVariables] = useState<PromptVariables>({
    subject: '',
    grade: '',
    lesson_name: '',
    game_type: 'timeline',
    objective: '',
    core_content: '',
    keywords: '',
    question_count: '5',
    duration: '15 phút',
  });
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Dynamic AI game recommendation based on Step 1 inputs
  const getAiRecommendedGame = () => {
    const sub = (variables.subject || '').toLowerCase();
    const les = (variables.lesson_name || '').toLowerCase();
    const text = `${sub} ${les}`;

    if (text.includes('sử') || text.includes('lịch sử') || text.includes('thời gian') || text.includes('mốc') || text.includes('history') || text.includes('địa')) {
      return {
        id: 'timeline',
        title: 'Dòng thời gian (Timeline)',
        reason: 'Rất phù hợp với môn Lịch sử / Địa lý giúp học sinh xâu chuỗi các sự kiện và mốc phát triển theo thứ tự thời gian.'
      };
    }
    if (text.includes('toán') || text.includes('lý') || text.includes('hóa') || text.includes('sinh') || text.includes('math') || text.includes('physics') || text.includes('tính')) {
      return {
        id: 'quiz_master',
        title: 'Trắc nghiệm tính điểm & Âm thanh (Quiz Master)',
        reason: 'Rất phù hợp với các môn Tự nhiên giúp học sinh rèn luyện tư duy tính toán và phản hồi kết quả tức thì.'
      };
    }
    if (text.includes('anh') || text.includes('english') || text.includes('từ vựng') || text.includes('vocab') || text.includes('ngoại ngữ')) {
      return {
        id: 'flashcard',
        title: 'Lật thẻ ghi nhớ (Flashcard Memory)',
        reason: 'Phương pháp ghi nhớ từ vựng, thuật ngữ và khái niệm ngoại ngữ đạt hiệu quả cao nhất.'
      };
    }
    if (text.includes('văn') || text.includes('ngữ văn') || text.includes('chữ') || text.includes('tiếng việt')) {
      return {
        id: 'crossword',
        title: 'Ô chữ kiến thức (Crossword Puzzle)',
        reason: 'Kích thích tư duy từ vựng và nội dung tác phẩm văn học thông qua các hàng ngang, hàng dọc.'
      };
    }
    return {
      id: variables.game_type || 'timeline',
      title: 'Trò chơi tương tác đa năng (Timeline / Quiz)',
      reason: 'Gợi ý phù hợp để học sinh vừa chơi vừa ghi nhớ các mốc kiến thức cốt lõi của bài học.'
    };
  };

  const aiRecommendation = getAiRecommendedGame();

  // Wizard Step State (1: Bài học, 2: Trò chơi, 3: Cấu hình, 4: Xem Prompt)
  const [activeStep, setActiveStep] = useState<number>(1);
  // View mode for Step 4 (summary vs raw code)
  const [viewMode, setViewMode] = useState<'summary' | 'raw'>('summary');

  // Live interpolated Master Prompt string
  const masterPromptText = generateMasterPrompt(variables);

  const handleInputChange = (field: keyof PromptVariables, value: string) => {
    setVariables(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectGameType = (gameTypeId: string) => {
    setVariables(prev => ({ ...prev, game_type: gameTypeId }));
  };

  const handleSelectPreset = (preset: PresetTemplate) => {
    setSelectedPresetId(preset.id);
    setVariables({
      ...preset.variables,
      game_type: preset.variables.game_type || 'timeline'
    });
    setAiError(null);
  };

  const handleResetForm = () => {
    setVariables({
      subject: '',
      grade: '',
      lesson_name: '',
      game_type: 'timeline',
      objective: '',
      core_content: '',
      keywords: '',
      question_count: '5',
      duration: '15 phút',
    });
    setSelectedPresetId('');
    setAiError(null);
    setActiveStep(1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(masterPromptText);
    setCopied(true);
    onCopyPrompt(masterPromptText, variables);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    const gameLabel = getGameTypeLabel(variables.game_type);
    const newSaved: SavedPrompt = {
      id: `prompt-${Date.now()}`,
      title: `${variables.subject || 'Môn học'} - ${variables.lesson_name || 'Bài học'} [${gameLabel}]`,
      createdAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      variables,
      fullPrompt: masterPromptText
    };
    onSavePrompt(newSaved);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAiSuggest = async () => {
    if (!variables.subject || !variables.lesson_name) {
      setAiError('Vui lòng điền Môn học và Tên bài trước khi nhờ AI gợi ý.');
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/suggest-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: variables.subject,
          grade: variables.grade,
          lesson_name: variables.lesson_name,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setVariables(prev => ({
          ...prev,
          objective: json.data.objective || prev.objective,
          core_content: json.data.core_content || prev.core_content,
          keywords: json.data.keywords || prev.keywords,
          question_count: json.data.question_count || prev.question_count,
          duration: json.data.duration || prev.duration,
        }));
      } else {
        // Fallback local AI-assisted simulation
        setVariables(prev => ({
          ...prev,
          objective: `Học sinh ghi nhớ và vận dụng thành thạo các mốc kiến thức trọng tâm trong bài ${variables.lesson_name} (${variables.subject} ${variables.grade}).`,
          core_content: `1. Khái niệm cơ bản & Mốc phát triển đầu tiên. 2. Các nguyên lý chính & Diễn biến quan trọng. 3. Ứng dụng thực tiễn & Ý nghĩa bài học. 4. Tổng kết & Câu hỏi mở rộng.`,
          keywords: `${variables.subject}, ${variables.lesson_name}, Mốc sự kiện, Trắc nghiệm, Trải nghiệm`,
          question_count: '5',
          duration: '15 phút',
        }));
      }
    } catch (err) {
      console.warn('AI suggestion fallback:', err);
      setVariables(prev => ({
        ...prev,
        objective: `Học sinh hiểu rõ mục tiêu cốt lõi, diễn biến chính và ý nghĩa của bài học ${variables.lesson_name} (${variables.subject}).`,
        core_content: `1. Mốc mở đầu: Bối cảnh & Khái niệm. 2. Mốc phát triển: Các sự kiện/nguyên lý quan trọng. 3. Mốc kết thúc: Ý nghĩa & Bài học kinh nghiệm.`,
        keywords: `${variables.subject}, ${variables.grade}, ${variables.lesson_name}, FPT School`,
        question_count: '5',
        duration: '15 phút',
      }));
    } finally {
      setIsAiLoading(false);
    }
  };

  // Helper to render game type icon
  const renderGameIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'HelpCircle': return <HelpCircle className={className} />;
      case 'Hash': return <Hash className={className} />;
      case 'ArrowLeftRight': return <ArrowLeftRight className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Star': return <Star className={className} />;
      case 'ArrowUpDown': return <ArrowUpDown className={className} />;
      case 'Home': return <Home className={className} />;
      case 'ArrowUpRight': return <ArrowUpRight className={className} />;
      case 'Menu': return <Menu className={className} />;
      case 'Disc': return <Disc className={className} />;
      default: return <Gamepad2 className={className} />;
    }
  };

  const selectedGameOption = GAME_TYPES.find(g => g.id === (variables.game_type || 'timeline')) || GAME_TYPES[7];

  return (
    <div className="space-y-6">
      {/* Top Mode Selector Bar: Custom Webapp Idea vs Game Templates */}
      <div className="bg-white border border-gray-200 rounded-2xl p-2.5 sm:p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setBuilderMode('custom_idea')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all border ${
              builderMode === 'custom_idea'
                ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-200'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>✨ Tạo webapp theo ý tưởng riêng</span>
            <span className="bg-amber-700/60 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-extrabold">Nên dùng</span>
          </button>

          <button
            onClick={() => setBuilderMode('game_template')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all border ${
              builderMode === 'game_template'
                ? 'bg-[#0052CC] text-white border-[#0052CC] shadow-md ring-2 ring-blue-200'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-blue-200" />
            <span>🎮 Mẫu trò chơi & Bài giảng mẫu (Quiz, Flashcard...)</span>
          </button>
        </div>
      </div>

      {/* MODE 1: CUSTOM WEBAPP IDEA BUILDER */}
      {builderMode === 'custom_idea' ? (
        <CustomIdeaBuilder
          onSavePrompt={onSavePrompt}
          onCopyPromptText={(text) => onCopyPrompt(text, variables)}
          onSwitchToGameMode={() => setBuilderMode('game_template')}
        />
      ) : (
        /* MODE 2: PRESET GAME TEMPLATES BUILDER */
        <div className="space-y-6">
          {/* Intro Banner & Presets Bar */}
          <div className="bg-gradient-to-r from-[#0052CC]/10 via-[#0A66C2]/10 to-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Trình tạo Prompt chuẩn mực Google AI Studio
              </h2>
            </div>
            <p className="text-sm text-gray-600 max-w-3xl">
              Hệ thống hướng dẫn giáo viên Trường FPT Bắc Giang tạo Master Prompt bài giảng nhanh chóng qua 4 bước trực quan. Dễ hiểu, không bị quá tải kiến thức!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetForm}
              className="px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              Làm mới form
            </button>
            <button
              onClick={onLaunchSandbox}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Xem Demo
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-4 pt-4 border-t border-blue-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0052CC] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Nạp mẫu bài giảng nhanh (Click chọn):
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {PRESET_TEMPLATES.map(preset => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0052CC] text-white border-[#0052CC] shadow-md ring-2 ring-blue-300'
                      : 'bg-white hover:bg-blue-50/80 text-gray-700 border-gray-200 shadow-sm'
                  }`}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-blue-600'}`} />
                  <span>{preset.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4-Step Progress Wizard Navigation */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { step: 1, title: '1. Thông tin bài học', desc: 'Môn, Lớp, Tên bài' },
            { step: 2, title: '2. Chọn loại trò chơi', desc: selectedGameOption.title },
            { step: 3, title: '3. Nội dung & AI Gợi ý', desc: 'Mục tiêu, Từ khóa' },
            { step: 4, title: '4. Xem & Sao chép Prompt', desc: 'Sẵn sàng dán AI Studio' },
          ].map((item) => {
            const isActive = activeStep === item.step;
            const isCompleted = activeStep > item.step;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-50/80 border-[#0052CC] ring-2 ring-blue-200 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#0052CC] text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    Bước {item.step} / 4
                  </span>
                  {isCompleted && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className={`text-xs font-bold truncate ${isActive ? 'text-[#0052CC]' : 'text-gray-800'}`}>
                  {item.title}
                </p>
                <p className="text-[11px] text-gray-500 truncate">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT PANELS */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        
        {/* BƯỚC 1: THÔNG TIN BÀI HỌC */}
        {activeStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-[#0052CC] uppercase tracking-wider">BƯỚC 1 / 4</span>
                <h3 className="text-lg font-extrabold text-gray-900">Thông tin bài học</h3>
                <p className="text-xs text-gray-500">Nhập thông tin cơ bản của tiết học hoặc chọn bài giảng mẫu ở phía trên.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên môn học (Ví dụ: Lịch sử, Toán, Tiếng Anh...)"
                  value={variables.subject}
                  onChange={e => handleInputChange('subject', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] focus:border-transparent outline-none transition-all font-medium text-gray-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Khối lớp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập khối lớp / đối tượng (Ví dụ: Lớp 10, Lớp 6, Khối THCS...)"
                  value={variables.grade}
                  onChange={e => handleInputChange('grade', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] focus:border-transparent outline-none transition-all font-medium text-gray-800 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Tên bài học / Chủ đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên bài học / Chủ đề (Ví dụ: Cách mạng công nghiệp thời hiện đại...)"
                  value={variables.lesson_name}
                  onChange={e => handleInputChange('lesson_name', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] focus:border-transparent outline-none transition-all font-medium text-gray-800 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setActiveStep(2)}
                className="px-5 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Sang bước 2: Chọn loại trò chơi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 2: CHỌN HÌNH THỨC TRÒ CHƠI (GAME TYPE SELECTION GRID) */}
        {activeStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="pb-3 border-b border-gray-100">
              <span className="text-xs font-bold text-[#0052CC] uppercase tracking-wider">BƯỚC 2 / 4</span>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Chọn cách học sinh sẽ chơi</h3>
              <p className="text-xs text-gray-500">Hãy chọn hình thức trò chơi theo mục tiêu của bài học để AI thiết kế trải nghiệm tương ứng.</p>
            </div>

            {/* AI Recommendation Banner based on Step 1 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-blue-50 border border-amber-300 shadow-sm flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-100" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                    💡 AI Gợi ý loại trò chơi cho bài học
                  </h4>
                  {variables.subject && (
                    <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {variables.subject} {variables.grade && `• ${variables.grade}`}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-800 font-medium mt-1 leading-relaxed">
                  Dựa vào nội dung đã nhập ở Bước 1: <strong className="text-[#0052CC]">{aiRecommendation.title}</strong> — {aiRecommendation.reason}
                </p>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectGameType(aiRecommendation.id)}
                    className="px-3 py-1 rounded-lg bg-[#0052CC] hover:bg-[#0A66C2] text-white text-[11px] font-extrabold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Áp dụng loại game AI gợi ý này</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 10 Game Type Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5">
              {GAME_TYPES.map(game => {
                const isSelected = (variables.game_type || 'timeline') === game.id;
                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => handleSelectGameType(game.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-blue-50/60 border-[#0052CC] ring-2 ring-[#0052CC]/30 shadow-md'
                        : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isSelected ? 'bg-[#0052CC] text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {renderGameIcon(game.iconName, 'w-5 h-5')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{game.title}</h4>
                        {game.badge && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0">
                            {game.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{game.subtitle}</p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0052CC] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                onClick={() => setActiveStep(1)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại bước 1</span>
              </button>

              <button
                onClick={() => setActiveStep(3)}
                className="px-5 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Sang bước 3: Cấu hình nội dung</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 3: CẤU HÌNH BÀI HỌC & AI GỢI Ý */}
        {activeStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-[#0052CC] uppercase tracking-wider">BƯỚC 3 / 4</span>
                <h3 className="text-lg font-extrabold text-gray-900">Cấu hình nội dung bài học</h3>
                <p className="text-xs text-gray-500">Mục tiêu, nội dung chính và số lượng thử thách.</p>
              </div>

              <button
                onClick={handleAiSuggest}
                disabled={isAiLoading}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 self-start sm:self-auto"
              >
                <Wand2 className={`w-4 h-4 text-amber-600 ${isAiLoading ? 'animate-spin' : ''}`} />
                <span>{isAiLoading ? 'AI đang viết...' : 'Trợ lý AI điền tự động'}</span>
              </button>
            </div>

            {aiError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{aiError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Mục tiêu bài học <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Hãy nhập mục tiêu bài học (Ví dụ: Học sinh nắm vững các khái niệm và mốc sự kiện trọng tâm...)"
                  value={variables.objective}
                  onChange={e => handleInputChange('objective', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] outline-none transition-all font-medium text-gray-800 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-gray-700">
                    Nội dung cốt lõi <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-[#0052CC] font-bold">Nên liệt kê dạng mốc 1, 2, 3...</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Hãy nhập nội dung kiến thức cốt lõi hoặc danh sách mốc kiến thức (Ví dụ: 1. Khái niệm... 2. Diễn biến...)"
                  value={variables.core_content}
                  onChange={e => handleInputChange('core_content', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] outline-none transition-all font-medium text-gray-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Từ khóa chính</label>
                <input
                  type="text"
                  placeholder="Hãy nhập các từ khóa chính (Ví dụ: Lịch sử, FPT School, Trắc nghiệm...)"
                  value={variables.keywords}
                  onChange={e => handleInputChange('keywords', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] outline-none transition-all font-medium text-gray-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Số câu hỏi / thử thách (Tùy chọn nhập)
                  </label>
                  <input
                    type="text"
                    placeholder="Hãy nhập số câu hỏi (Ví dụ: 5, 8, 10, 15...)"
                    value={variables.question_count}
                    onChange={e => handleInputChange('question_count', e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] outline-none transition-all font-medium text-gray-800 text-sm"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto">
                    <span className="text-[10px] text-gray-500 font-bold shrink-0">Gợi ý:</span>
                    {['5', '8', '10', '12', '15'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleInputChange('question_count', num)}
                        className={`px-2 py-0.5 text-[11px] font-bold rounded-md border transition-all ${
                          variables.question_count === num
                            ? 'bg-[#0052CC] text-white border-[#0052CC]'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {num} câu
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Thời lượng tiết học</label>
                  <input
                    type="text"
                    placeholder="Hãy nhập thời lượng tiết học (Ví dụ: 15 phút, 1 tiết...)"
                    value={variables.duration}
                    onChange={e => handleInputChange('duration', e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] outline-none transition-all font-medium text-gray-800 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại bước 2</span>
              </button>

              <button
                onClick={() => setActiveStep(4)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>Xem kết quả Master Prompt</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BƯỚC 4: XEM & SAO CHÉP MASTER PROMPT (SIMPLIFIED & NON-OVERWHELMING VIEW) */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header + Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <span className="text-xs font-bold text-[#0052CC] uppercase tracking-wider">BƯỚC 4 / 4</span>
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Master Prompt đã sẵn sàng!</h3>
                <p className="text-xs text-gray-500">Đã tích hợp đầy đủ thông số bài giảng & định dạng trò chơi cho Google AI Studio.</p>
              </div>

              {/* Main Copy Button */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={handleSave}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Đã lưu!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4 text-[#0052CC]" />
                      <span>Lưu mẫu bài giảng</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg ring-2 ring-blue-300 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0052CC] hover:bg-[#0A66C2] text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>ĐÃ SAO CHÉP MASTER PROMPT!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>SAO CHÉP MASTER PROMPT</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* View Mode Switcher (Summary Card View vs Raw Prompt Code View) */}
            <div className="flex items-center justify-between bg-gray-100 p-1.5 rounded-xl text-xs">
              <span className="text-gray-600 font-semibold px-2 hidden sm:inline">Chế độ hiển thị:</span>
              <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setViewMode('summary')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
                    viewMode === 'summary'
                      ? 'bg-white text-[#0052CC] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tóm tắt dễ hiểu (khuyên dùng)</span>
                </button>

                <button
                  onClick={() => setViewMode('raw')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
                    viewMode === 'raw'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-blue-600" />
                  <span>Xem mã Master Prompt chi tiết</span>
                </button>
              </div>
            </div>

            {/* TAB 1: EASY SUMMARY BREAKDOWN CARDS */}
            {viewMode === 'summary' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Selected Game */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider">
                      {renderGameIcon(selectedGameOption.iconName, 'w-4 h-4')}
                      <span>Hình thức trò chơi</span>
                    </div>
                    <h4 className="text-base font-extrabold text-gray-900">{selectedGameOption.title}</h4>
                    <p className="text-xs text-gray-600 font-medium">{selectedGameOption.subtitle}</p>
                    <div className="pt-2 text-[11px] text-blue-900 bg-white/80 p-2.5 rounded-xl border border-blue-100 font-medium">
                      Hệ thống tự động tạo giao diện, thanh tiến độ, hiệu ứng và giải thích cho hình thức trò chơi này.
                    </div>
                  </div>

                  {/* Card 2: Lesson Context */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      <span>Bài học & Mục tiêu</span>
                    </div>
                    <h4 className="text-base font-extrabold text-gray-900 truncate">{variables.lesson_name || 'Chưa nhập tên bài'}</h4>
                    <p className="text-xs text-gray-700 font-medium">
                      {variables.subject || 'Môn học'} • {variables.grade || 'Khối lớp'}
                    </p>
                    <div className="pt-2 text-[11px] text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-100 line-clamp-2">
                      <strong>Mục tiêu:</strong> {variables.objective || 'Nắm kiến thức trọng tâm'}
                    </div>
                  </div>

                  {/* Card 3: Specs */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Thông số & Thương hiệu</span>
                    </div>
                    <h4 className="text-base font-extrabold text-gray-900">{variables.question_count} câu hỏi • {variables.duration}</h4>
                    <p className="text-xs text-gray-600 font-medium">FPT School Bắc Giang • Trải nghiệm để trưởng thành!</p>
                    <div className="pt-2 text-[11px] text-emerald-900 bg-white/80 p-2.5 rounded-xl border border-emerald-100 font-medium">
                      Giao diện màu xanh - cam chuẩn FPT Education, hỗ trợ đầy đủ thiết bị di động & máy tính.
                    </div>
                  </div>
                </div>

                {/* Quick 3-Step Instruction Panel */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    3 bước dán vào Google AI Studio
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-amber-400 font-bold block mb-1">Bước 1:</span>
                      Bấm nút <strong className="text-blue-300">"Sao chép Master Prompt"</strong> ở góc trên.
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-amber-400 font-bold block mb-1">Bước 2:</span>
                      Mở Google AI Studio, chọn chế độ <strong className="text-emerald-300">Build mode</strong>.
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-amber-400 font-bold block mb-1">Bước 3:</span>
                      Dán Prompt vào ô chỉ dẫn và bấm <strong className="text-amber-300">Run / Generate</strong> để nhận webapp!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RAW FULL PROMPT CODE VIEW */}
            {viewMode === 'raw' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="relative rounded-2xl bg-gray-900 text-gray-100 p-4 font-mono text-xs overflow-auto max-h-[500px] border border-gray-800 shadow-inner leading-relaxed select-all">
                  <div className="absolute top-3 right-4 text-[10px] text-gray-400 bg-gray-800 px-2 py-1 rounded font-sans">
                    Master Prompt (Google AI Studio System Instructions)
                  </div>
                  <pre className="whitespace-pre-wrap break-words font-mono text-[12px] text-gray-200">
                    {masterPromptText}
                  </pre>
                </div>
              </div>
            )}

            {/* Footer External Link & Nav */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => setActiveStep(3)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center gap-1.5 transition-all w-full sm:w-auto"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại chỉnh sửa</span>
              </button>

              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md w-full sm:w-auto"
              >
                <span>Mở Google AI Studio</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
      </div>
      )}
    </div>
  );
};
