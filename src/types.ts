export interface PromptVariables {
  subject: string;
  grade: string;
  lesson_name: string;
  objective: string;
  core_content: string;
  keywords: string;
  question_count: string;
  duration: string;
  game_type?: string;
}

export interface GameTypeOption {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badge?: string;
}

export const GAME_TYPES: GameTypeOption[] = [
  { id: 'quiz', title: 'Quiz', subtitle: 'Kiểm tra nhanh', iconName: 'HelpCircle' },
  { id: 'crossword', title: 'Ô chữ', subtitle: 'Ôn từ khóa', iconName: 'Hash' },
  { id: 'matching', title: 'Ghép đôi', subtitle: 'Nối khái niệm', iconName: 'ArrowLeftRight' },
  { id: 'flipcard', title: 'Lật thẻ', subtitle: 'Ghi nhớ hình ảnh', iconName: 'Layers' },
  { id: 'millionaire', title: 'Ai là triệu phú', subtitle: 'Thi đua cả lớp', iconName: 'Star' },
  { id: 'dragdrop', title: 'Kéo & thả', subtitle: 'Phân loại kiến thức', iconName: 'ArrowUpDown' },
  { id: 'escaperoom', title: 'Escape Room', subtitle: 'Giải đố theo nhóm', iconName: 'Home' },
  { id: 'timeline', title: 'Dòng thời gian', subtitle: 'Sắp xếp sự kiện', iconName: 'ArrowUpRight', badge: 'Khuyên dùng' },
  { id: 'flashcard', title: 'Flashcard', subtitle: 'Học từ vựng', iconName: 'Menu' },
  { id: 'wheel', title: 'Vòng quay', subtitle: 'Chọn ngẫu nhiên', iconName: 'Disc' },
];

export interface PresetTemplate {
  id: string;
  title: string;
  iconName: string;
  category: string;
  variables: PromptVariables;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  contentMarkdown: string;
  codeSnippet?: string;
  keyTakeaways: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CourseModule {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

export type SavedPromptType = 'preset' | 'custom_idea';
export type SavedPromptStatus = 'Đã tạo Prompt' | 'Đang xây dựng' | 'Đang kiểm thử' | 'Đã hoàn thiện';

export interface CustomWebappIdea {
  title?: string;
  problem: string;
  targetAudience: string;
  functions: string[];
  userFlow: string;
  mandatoryContent: string;
  uiStyle: string[];
  otherUiReqs: string;
  constraints: string[];
}

export interface SavedPrompt {
  id: string;
  title: string;
  createdAt: string;
  promptType?: SavedPromptType;
  status?: SavedPromptStatus;
  variables: PromptVariables;
  customIdea?: CustomWebappIdea;
  fullPrompt: string;
}

export interface UsageStats {
  promptsGenerated: number;
  promptsCopied: number;
  lessonsCompleted: string[];
  popularSubjects: Record<string, number>;
  lastActive: string;
}

export interface MiniAppQuestion {
  id: number;
  yearOrEvent: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type ActiveTab = 'overview' | 'builder' | 'course' | 'sandbox' | 'saved';
