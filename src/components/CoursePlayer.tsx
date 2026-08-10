import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { COURSE_MODULES } from '../data/courseData';
import { CourseModule, Lesson, QuizQuestion } from '../types';
import { FptLogo } from './FptLogo';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Copy, 
  Check, 
  HelpCircle,
  Clock,
  Printer,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

interface CoursePlayerProps {
  completedLessons: string[];
  onMarkLessonComplete: (lessonId: string) => void;
  onResetCourse?: () => void;
  onNextStep?: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  completedLessons,
  onMarkLessonComplete,
  onResetCourse,
  onNextStep,
}) => {
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [activeLessonId, setActiveLessonId] = useState<string>('1.1');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [teacherName, setTeacherName] = useState<string>('Thầy / Cô - Trường Tiểu học, THCS & THPT FPT Bắc Giang');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const activeModule = COURSE_MODULES.find(m => m.id === activeModuleId) || COURSE_MODULES[0];
  const activeLesson = activeModule.lessons.find(l => l.id === activeLessonId) || activeModule.lessons[0];

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
  };

  const handleResetProgress = () => {
    if (onResetCourse) {
      onResetCourse();
    }
    setActiveModuleId(1);
    setActiveLessonId('1.1');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setShowCertificate(false);
  };

  const handleMarkComplete = () => {
    onMarkLessonComplete(activeLessonId);
    
    // Find next lesson if available in active module
    const currentIndex = activeModule.lessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex < activeModule.lessons.length - 1) {
      setActiveLessonId(activeModule.lessons[currentIndex + 1].id);
    } else {
      // Reached the last lesson of current module: Always go to the Module Quiz first!
      setActiveLessonId('quiz');
      setQuizSubmitted(false);
      setQuizAnswers({});
    }
  };

  const handleQuizAnswerSelect = (questionId: string, optionIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // Calculate score
    let correctCount = 0;
    activeModule.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    if (correctCount === activeModule.quiz.length) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    // If completing quiz in Module 3 (the final module)
    if (activeModule.id === 3) {
      // Ensure all lessons are marked as complete
      COURSE_MODULES.forEach(m => {
        m.lessons.forEach(l => {
          if (!completedLessons.includes(l.id)) {
            onMarkLessonComplete(l.id);
          }
        });
      });

      // Show certificate modal after brief delay for quiz feedback
      setTimeout(() => {
        setShowCertificate(true);
        triggerCertificateConfetti();
      }, 500);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const totalLessons = COURSE_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalCompleted = completedLessons.length;
  const progressPercent = Math.round((totalCompleted / totalLessons) * 100);

  const triggerCertificateConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Course Header Banner */}
      <div className="bg-gradient-to-r from-[#0052CC] to-[#0A66C2] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-blue-950 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Chương Trình Tập Huấn
              </span>
              <span className="text-xs text-blue-200">Trường Tiểu học, THCS & THPT FPT Bắc Giang</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Khóa Học Tạo Mini Webapp Tương Tác Cùng AI Studio
            </h2>
            <p className="text-sm text-blue-100 max-w-2xl">
              Gồm 3 mô-đun thực hành thiết kế bài giảng, tối ưu hóa Master Prompt và xuất bản sản phẩm học tập cho giáo viên & học sinh. Trải nghiệm để trưởng thành!
            </p>
          </div>

          {/* Progress Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[220px] text-center space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-blue-100">Tiến độ khóa học</span>
              <span className="text-amber-300 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-blue-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-blue-200">
              Đã hoàn thành <strong>{totalCompleted}</strong> / {totalLessons} bài học
            </div>

            {totalCompleted > 0 && (
              <button
                onClick={handleResetProgress}
                className="text-[11px] text-amber-200 hover:text-white underline pt-0.5 block mx-auto transition-colors font-medium"
                title="Xóa danh sách bài học đã học để bắt đầu lại từ đầu"
              >
                Học lại từ đầu (Reset bài)
              </button>
            )}

            {(progressPercent >= 100 || (activeModuleId === 3 && quizSubmitted)) && (
              <button
                onClick={() => {
                  setShowCertificate(true);
                  triggerCertificateConfetti();
                }}
                className="w-full mt-1 py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Award className="w-4 h-4 text-blue-950" />
                <span>Xem Chứng Nhận</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {COURSE_MODULES.map(module => {
          const isSelected = activeModuleId === module.id;
          const completedInModule = module.lessons.filter(l => completedLessons.includes(l.id)).length;
          return (
            <button
              key={module.id}
              onClick={() => {
                setActiveModuleId(module.id);
                setActiveLessonId(module.lessons[0].id);
              }}
              className={`p-4 rounded-2xl text-left transition-all border shadow-sm relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-[#0052CC] ring-2 ring-blue-200 shadow-md'
                  : 'bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isSelected ? 'bg-blue-100 text-[#0052CC]' : 'bg-gray-100 text-gray-600'
                }`}>
                  Mô-đun {module.id}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {completedInModule}/{module.lessons.length} bài
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{module.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{module.description}</p>
            </button>
          );
        })}
      </div>

      {/* Lesson Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Lesson Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0052CC]" />
              Danh Sách Bài Học ({activeModule.title})
            </h3>
          </div>

          <div className="space-y-2">
            {activeModule.lessons.map(lesson => {
              const isActive = activeLessonId === lesson.id;
              const isCompleted = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-start gap-3 border ${
                    isActive
                      ? 'bg-blue-50/80 border-[#0052CC] text-[#0052CC] font-medium shadow-xs'
                      : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Bài {lesson.id}</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration}
                      </span>
                    </div>
                    <p className={`text-xs ${isActive ? 'font-bold text-[#0052CC]' : 'font-medium text-gray-800'}`}>
                      {lesson.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Module Quiz Button */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => setActiveLessonId('quiz')}
              className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 border ${
                activeLessonId === 'quiz'
                  ? 'bg-amber-100/80 border-amber-400 text-amber-950 font-bold shadow-sm'
                  : 'bg-amber-50/50 hover:bg-amber-100/50 border-amber-200 text-amber-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">Kiểm Tra Trắc Nghiệm Mô-đun</span>
                <span className="text-[11px] text-amber-800">{activeModule.quiz.length} câu trắc nghiệm nhanh</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Lesson Detail Area */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          {activeLessonId === 'quiz' ? (
            /* Quiz View */
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Kiểm Tra Mô-đun {activeModule.id}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    Trắc Nghiệm Đánh Giá Kiến Thức
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                {activeModule.quiz.map((q, qIndex) => {
                  const selectedOpt = quizAnswers[q.id];
                  const isCorrect = selectedOpt === q.correctAnswer;

                  return (
                    <div key={q.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                      <h4 className="text-sm font-bold text-gray-900">
                        Câu {qIndex + 1}: {q.question}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selectedOpt === optIndex;
                          let btnClass = "bg-white hover:bg-blue-50/50 border-gray-200 text-gray-800";
                          
                          if (quizSubmitted) {
                            if (optIndex === q.correctAnswer) {
                              btnClass = "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold";
                            } else if (isOptionSelected && !isCorrect) {
                              btnClass = "bg-red-100 border-red-300 text-red-900";
                            }
                          } else if (isOptionSelected) {
                            btnClass = "bg-blue-50 border-[#0052CC] text-[#0052CC] font-bold ring-2 ring-blue-200";
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => handleQuizAnswerSelect(q.id, optIndex)}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnClass}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIndex === q.correctAnswer && (
                                <Check className="w-4 h-4 text-emerald-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`p-3 rounded-xl text-xs font-medium ${
                          isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          <strong className="block mb-0.5">{isCorrect ? '✓ Chính xác!' : '✕ Chưa đúng'}</strong>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Trả lời đủ các câu để hoàn thành mô-đun
                </span>
                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{quizSubmitted ? 'Nộp Lại Bài Kiểm Tra' : 'Nộp Bài Kiểm Tra'}</span>
                </button>
              </div>

              {activeModule.id < 3 && quizSubmitted && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-center space-y-3 animate-fade-in shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-[#0052CC]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
                      Đã Hoàn Thành Bài Kiểm Tra Mô-Đun {activeModule.id}!
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    Thầy/cô đã sẵn sàng sang nội dung tiếp theo? Nhấp bên dưới để chuyển sang Mô-đun {activeModule.id + 1}.
                  </p>
                  <button
                    onClick={() => {
                      const nextModule = COURSE_MODULES.find(m => m.id === activeModule.id + 1);
                      if (nextModule) {
                        setActiveModuleId(nextModule.id);
                        setActiveLessonId(nextModule.lessons[0].id);
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <span>Chuyển Sang Mô-đun {activeModule.id + 1}: {COURSE_MODULES.find(m => m.id === activeModule.id + 1)?.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeModule.id === 3 && quizSubmitted && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg space-y-3 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
                      Chúc Mừng Thầy / Cô Đã Hoàn Thành Toàn Bộ 3 Học Phần!
                    </h4>
                  </div>
                  <p className="text-xs text-amber-100 max-w-lg mx-auto leading-relaxed">
                    Thầy/cô đã hoàn tất các bài học và bài trắc nghiệm kiểm tra của chương trình tập huấn. Nhấp bên dưới để xem và nhận Giấy Chứng Nhận Điện Tử.
                  </p>
                  <button
                    onClick={() => {
                      setShowCertificate(true);
                      triggerCertificateConfetti();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white text-[#0052CC] hover:bg-amber-50 font-extrabold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <GraduationCap className="w-5 h-5 text-[#0052CC]" />
                    <span>Xem Giấy Chứng Nhận HOÀN THÀNH</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Lesson Detail View */
            <div className="space-y-6">
              {/* Title & Badge Header */}
              <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-[#0052CC] text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Bài {activeLesson.id}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {activeLesson.duration}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {activeLesson.title}
                  </h3>
                </div>

                <button
                  onClick={handleMarkComplete}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#0052CC] hover:bg-[#0A66C2] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedLessons.includes(activeLesson.id) ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}</span>
                </button>
              </div>

              {/* Lesson Summary Callout */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 font-medium">
                <strong>Tóm tắt bài học:</strong> {activeLesson.summary}
              </div>

              {/* Lesson Body Content */}
              <div className="text-gray-800 space-y-3 leading-relaxed text-xs sm:text-sm">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h3: ({ children }) => (
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 mt-5 mb-2.5 pb-1 border-b border-gray-200/80 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0052CC] shrink-0" />
                        <span>{children}</span>
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2.5">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-2 my-2.5 pl-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-2 my-2.5 pl-1 list-decimal list-inside text-gray-700 text-xs sm:text-sm">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-xs sm:text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-[#0052CC] font-bold mt-0.5 shrink-0">•</span>
                        <div className="flex-1">{children}</div>
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-extrabold text-gray-900 bg-amber-100/70 text-amber-950 px-1.5 py-0.5 rounded text-xs sm:text-sm">
                        {children}
                      </strong>
                    ),
                    code: ({ children }) => (
                      <code className="bg-blue-50 text-[#0052CC] font-mono px-1.5 py-0.5 rounded border border-blue-200/80 text-xs font-semibold">
                        {children}
                      </code>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                        {children}
                      </em>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0052CC] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-sm">
                        <table className="w-full text-xs text-left text-gray-800 border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-[#0052CC]/10 text-[#0052CC] font-extrabold text-xs border-b border-gray-200">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-blue-50/30 transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-3.5 py-2.5 font-bold border-r border-gray-200 last:border-r-0">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3.5 py-2.5 border-r border-gray-200 last:border-r-0 leading-relaxed">
                        {children}
                      </td>
                    )
                  }}
                >
                  {activeLesson.contentMarkdown}
                </Markdown>
              </div>

              {/* Optional Code Snippet */}
              {activeLesson.codeSnippet && (
                <div className="rounded-xl bg-gray-900 text-gray-100 p-4 space-y-2 border border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-800">
                    <span className="font-mono text-[11px]">Cấu trúc Master Prompt mẫu</span>
                    <button
                      onClick={() => handleCopyCode(activeLesson.codeSnippet!)}
                      className="hover:text-amber-300 transition-colors flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-amber-200 overflow-x-auto whitespace-pre-wrap">
                    {activeLesson.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Key Takeaways */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Ghi Nhớ Trọng Tâm (Key Takeaways):
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                  {activeLesson.keyTakeaways.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Lesson Action Footer */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-500">
                  Bài học thuộc chương trình Tập huấn AI FPT Bắc Giang
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkComplete}
                    className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <span>Bài tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {onNextStep && (
                    <button
                      onClick={onNextStep}
                      className="px-4 py-2 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span>Sang Bước 3: Tạo Prompt</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
          {/* Viewport Fixed Close Button - Always visible regardless of scrolling or zoom */}
          <button
            onClick={() => setShowCertificate(false)}
            className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[70] text-gray-800 hover:text-black font-extrabold text-base w-10 h-10 rounded-full bg-white hover:bg-amber-50 shadow-2xl border-2 border-amber-400 flex items-center justify-center transition-all print:hidden"
            title="Đóng Cửa Sổ (Close)"
          >
            ✕
          </button>

          {/* Scrollable Container with Top Padding */}
          <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 py-10 sm:py-12">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 border-4 border-[#0052CC] shadow-2xl relative space-y-5 text-center print:border-2 print:shadow-none print:rounded-none">
              
              {/* Inner Card Close Button */}
              <button
                onClick={() => setShowCertificate(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700 font-bold w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all print:hidden"
                title="Đóng"
              >
                ✕
              </button>

              {/* Inner Decorative Golden Frame */}
              <div className="border-2 border-amber-400/80 rounded-2xl p-4 sm:p-7 relative bg-gradient-to-b from-amber-50/30 via-white to-blue-50/20 shadow-inner space-y-5">
                
                {/* Corner Ornaments */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

                {/* Certificate Header */}
                <div className="space-y-2">
                  <div className="flex justify-center pb-1">
                    <FptLogo className="h-10 sm:h-12 w-auto" />
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white border-2 border-amber-300 shadow-md mx-auto">
                    <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#0052CC]">
                    TRƯỜNG TIỂU HỌC, THCS & THPT FPT BẮC GIANG
                  </h2>
                  
                  <div className="py-1">
                    <h1 className="text-2xl sm:text-4xl font-black tracking-wider font-serif uppercase text-[#0052CC]">
                      CERTIFICATE
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-amber-600 uppercase tracking-widest mt-0.5">
                      CHỨNG NHẬN HOÀN THÀNH TẬP HUẤN
                    </p>
                  </div>

                  <p className="text-[11px] font-extrabold text-amber-700 uppercase tracking-widest italic">
                    "Trải nghiệm để trưởng thành!"
                  </p>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    CHƯƠNG TRÌNH TẬP HUẤN TẠO MINI WEBAPP CÙNG GOOGLE AI STUDIO
                  </p>
                </div>

                {/* Certificate Recipient Section */}
                <div className="py-3 sm:py-4 border-y-2 border-amber-200/80 space-y-2.5">
                  <p className="text-xs text-gray-600 font-medium">Trân trọng trao tặng thầy / cô:</p>
                  <div className="max-w-lg mx-auto">
                    <input
                      type="text"
                      value={teacherName}
                      onChange={e => setTeacherName(e.target.value)}
                      className="text-center font-extrabold text-lg sm:text-2xl text-[#0052CC] border-b-2 border-amber-500 focus:border-[#0052CC] outline-none px-4 py-1.5 sm:py-2 w-full bg-amber-50/60 rounded-xl transition-all shadow-inner focus:ring-2 focus:ring-[#0052CC]/20"
                      placeholder="Nhập Họ và tên đầy đủ của Thầy / Cô..."
                    />
                  </div>
                  <p className="text-xs text-gray-700 max-w-lg mx-auto leading-relaxed font-medium pt-1">
                    Đã hoàn thành xuất sắc các mô-đun tập huấn, làm quen môi trường Build mode, cấu trúc Master Prompt và quy trình chuyển đổi bài giảng thành Mini Webapp tương tác.
                  </p>
                </div>

                {/* Signatures & Verification */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 px-2 sm:px-6 pt-1">
                  <div className="text-center sm:text-left space-y-1">
                    <p className="font-bold text-gray-900">
                      <span className="text-gray-500 font-normal">Ngày cấp:</span> {new Date().toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded inline-block">
                      Mã xác minh: FPT-BG-AI-855457
                    </p>
                    <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold justify-center sm:justify-start pt-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Chứng nhận Điện tử Chính thức</span>
                    </div>
                  </div>

                  <div className="text-center sm:text-right space-y-1">
                    <p className="font-extrabold text-gray-900 sm:text-[#0052CC] text-xs sm:text-sm uppercase tracking-wider">
                      GIÁM ĐỐC ĐIỀU HÀNH
                    </p>
                    <p className="text-[10px] text-gray-500 italic">Trường TH, THCS & THPT FPT Bắc Giang</p>

                    <div className="py-2.5 flex flex-col items-center sm:items-end justify-center space-y-1">
                      <span className="text-xs font-bold text-[#0052CC] italic tracking-widest uppercase">
                        (Đã ký)
                      </span>
                      <p className="font-sans font-extrabold text-gray-900 text-base sm:text-lg tracking-wide pt-1">
                        Đinh Đức Hiền
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Print & Action buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 print:hidden">
                <button
                  onClick={() => {
                    window.print();
                    if (onResetCourse) onResetCourse();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Printer className="w-4.5 h-4.5" />
                  <span>In / Tải Chứng Nhận & Reset Lượt Học</span>
                </button>

                <button
                  onClick={() => {
                    handleResetProgress();
                    alert("Đã xác nhận nhận chứng nhận thành công! Các bài học đã được tự động reset về chưa học để phục vụ người tiếp theo.");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
                  title="Xác nhận nhận chứng nhận và tự động reset các bài học về chưa học cho người tiếp theo"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Xác Nhận Nhận Chứng Chỉ & Reset Lượt Học</span>
                </button>

                <button
                  onClick={() => {
                    setShowCertificate(false);
                    if (onResetCourse) onResetCourse();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-all"
                >
                  ✕ Đóng & Reset Lượt Học
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
