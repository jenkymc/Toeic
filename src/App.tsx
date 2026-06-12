/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  Award, 
  History, 
  BookOpen, 
  Plus, 
  Check, 
  X, 
  ChevronRight, 
  Upload, 
  Info, 
  Clock, 
  Brain, 
  BarChart2, 
  Compass, 
  Layers, 
  RefreshCw, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Lock,
  User,
  UserCheck,
  Trash2,
  Shield,
  LogOut,
  Users
} from 'lucide-react';
import { Quiz, Question, QuizAttempt, LearningPath, PathStep } from './types';

// Standard Initial Quizzes (English, Maths, and General Knowledging)
const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz_english_parts_of_speech',
    title: 'Tiếng Anh - Phân Biệt Từ Loại & Ngữ Pháp',
    description: 'Đề luyện thi phân loại các dạng Từ loại (Parts of speech) cơ bản và nâng cao thường gặp trong đề thi THPT Quốc Gia.',
    category: 'Tiếng Anh',
    difficulty: 'medium',
    durationMinutes: 5,
    questions: [
      {
        id: 'pos_1',
        text: 'Which word belongs to a different part of speech?',
        options: ['happy', 'sadness', 'happiness', 'kindness'],
        correctAnswer: 0,
        explanation: 'happiness (danh từ): niềm hạnh phúc.\nkindness (danh từ): sự tốt bụng.\nsadness (danh từ): nỗi buồn.\nhappy (tính từ): hạnh phúc. Đây là từ khác loại vì nó là tính từ, còn các từ khác là danh từ.\nTạm dịch: Từ nào thuộc loại từ khác với các từ còn lại? - Hạnh phúc (tính từ).'
      },
      {
        id: 'pos_2',
        text: 'Fill in the blank: "She is looking forward to _______ her family next week."',
        options: ['see', 'saw', 'seeing', 'have seen'],
        correctAnswer: 2,
        explanation: 'Cấu trúc "look forward to + V-ing": rất trông chờ, mong đợi làm việc gì đó.\nDo đó, động từ "see" chuyển thành dạng V-ing là "seeing".\nTạm dịch: Cô ấy đang rất mong chờ được gặp gia đình của mình vào tuần tới.'
      },
      {
        id: 'pos_3',
        text: 'What is the opposite of the word "generous"?',
        options: ['kind', 'selfish', 'considerate', 'giving'],
        correctAnswer: 1,
        explanation: 'generous: rộng lượng, hào phóng.\n- selfish: ích kỷ (đối nghĩa hoàn toàn).\n- kind: tốt bụng.\n- considerate: chu đáo.\nTuyên ngôn đáp án: Từ trái nghĩa của "rộng lượng" là "ích kỷ".'
      },
      {
        id: 'pos_4',
        text: 'Identify the adverb in the following sentence: "The teacher explained the formula very clearly today."',
        options: ['explained', 'formula', 'clearly', 'today'],
        correctAnswer: 2,
        explanation: 'Trạng từ "clearly" bổ nghĩa cho động từ "explained" bổ trợ làm rõ hoạt động diễn giải của người thầy.\nTuyên ngôn đáp án: "clearly" chính là trạng từ chỉ trạng thái.'
      }
    ],
    createdAt: '2026-06-12T00:00:00.000Z'
  },
  {
    id: 'quiz_math_basic_algebra',
    title: 'Toán Học Đại Số - Giải Phương Trình Cơ Bản',
    description: 'Chuyên đề ôn tập nhanh phương trình đại số, cách tìm ẩn x và tư duy biểu thức logic toán cấp hai.',
    category: 'Toán học',
    difficulty: 'easy',
    durationMinutes: 10,
    questions: [
      {
        id: 'math_1',
        text: 'Giải phương trình: x + 15 = 40. Giá trị của x là bao nhiêu?',
        options: ['20', '25', '30', '35'],
        correctAnswer: 1,
        explanation: 'Ta chuyển vế đổi dấu số hạng: x = 40 - 15 = 25.\nGIẢI ĐÁP: 25 là kết quả tính toán chính xác.'
      },
      {
        id: 'math_2',
        text: 'Một cửa hàng bán được 5 chiếc áo thun thu về 500k. Hỏi nếu bán 12 chiếc áo thun tương tự thì thu về bao nhiêu tiền?',
        options: ['1.000k (1 triệu)', '1.200k (1.2 triệu)', '800k', '1.500k (1.5 triệu)'],
        correctAnswer: 1,
        explanation: 'Giá tiền một chiếc áo thun: 500k / 5 = 100k.\nBán 12 chiếc áo thun tương tự thu về: 12 * 100k = 1.200k.\nGIẢI ĐÁP: 1.200k là sự lựa chọn chuẩn xác.'
      },
      {
        id: 'math_3',
        text: 'Giá trị của biểu thức 3^2 + 4^2 bằng bao nhiêu?',
        options: ['7', '14', '25', '49'],
        correctAnswer: 2,
        explanation: 'Ta tính lũy thừa trước: 3^2 = 9; 4^2 = 16.\nCộng tổng: 9 + 16 = 25.\nGIẢI ĐÁP: 25 là đáp án đúng.'
      }
    ],
    createdAt: '2026-06-12T00:00:00.000Z'
  }
];

const INITIAL_PATH: LearningPath = {
  id: 'path_setup',
  title: 'Lộ Trình Bứt Phá Điểm Số Trắc Nghiệm',
  description: 'Hãy thực hiện tối thiểu 1 đề kiểm tra trắc nghiệm để AI có thể phân tích xu thế học tập của bạn chính xác nhất!',
  steps: [
    {
      id: 'step_1',
      title: 'Khởi động với Đề Tiếng Anh Từ Loại',
      description: 'Làm đề ôn ngữ pháp Tiếng Anh Từ Loại đầu tiên để nhận điểm chuẩn đoán sơ khai.',
      resourceType: 'quiz',
      targetCategory: 'Tiếng Anh',
      isCompleted: false
    },
    {
      id: 'step_2',
      title: 'Tự biên soạn một đề mới',
      description: 'Dùng bảng quản lý soạn đề để tự tạo 1 đề Tiếng Anh hoặc Toán về chủ đề bạn thích.',
      resourceType: 'practice',
      targetCategory: 'Công nghệ AI',
      isCompleted: false
    },
    {
      id: 'step_3',
      title: 'Cải thiện kỹ năng Đọc hiểu',
      description: 'Luyện tập làm quen với cơ chế giải đáp chi tiết nằm ở cuối buổi nộp bài để nhớ sâu kiến thức tốt nhất.',
      resourceType: 'reading',
      targetCategory: 'Thực nghiệm',
      isCompleted: false
    }
  ],
  aiAnalysis: 'Hệ thống đang chạy ngoại tuyến với dữ liệu mô phỏng. Trải nghiệm làm bài hoàn thành 1 kỳ thi bất kỳ, sau đó nhấn nút "Yêu cầu AI phân tích lại lộ trình" để AI kiểm nghiệm kết quả thực và đưa ra các đề xuất bám sát điểm số của bạn.',
  updatedAt: '2026-06-12T00:00:00.000Z'
};

// Real-time retro audio synthesis using the Web Audio API
const playCorrectSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Play a delightful double-chime ascending sequence (C5 then G5/C6)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.1); // A5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Second note chime offset
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2); // C6
    gain2.gain.setValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.33);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.38);
  } catch (e) {
    console.warn('Lỗi phát âm thanh:', e);
  }
};

const playIncorrectSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle'; // triangle is softer and sounds like a retro game buzzer
    osc.frequency.setValueAtTime(261.63, now); // C4
    osc.frequency.linearRampToValueAtTime(130.81, now + 0.22); // downwards frequency slide
    
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.warn('Lỗi phát âm thanh:', e);
  }
};

export default function App() {
  // Navigation & Screen Control
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quizzes' | 'admin'>('dashboard');

  // Authentication & Access Control States
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    fullName: string;
    isAdmin: boolean;
    isApproved: boolean;
  } | null>(() => {
    const saved = localStorage.getItem('school_ai_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authUsername, setAuthUsername] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authFullName, setAuthFullName] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authSuccess, setAuthSuccess] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  // Admin user approvals states
  const [systemUsers, setSystemUsers] = useState<Array<{
    username: string;
    fullName: string;
    isAdmin: boolean;
    isApproved: boolean;
    createdAt: string;
  }>>([]);
  const [isAdminUsersLoading, setIsAdminUsersLoading] = useState<boolean>(false);
  const [adminSubTab, setAdminSubTab] = useState<'quizzes' | 'users'>('quizzes');
  
  // Applet Data Persistence (Personalized / Segregated per user)
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const savedUser = localStorage.getItem('school_ai_current_user');
    const userObj = savedUser ? JSON.parse(savedUser) : null;
    const prefix = userObj ? `_${userObj.username}` : '';
    const saved = localStorage.getItem(`school_ai_quizzes${prefix}`);
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });
  
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => {
    const savedUser = localStorage.getItem('school_ai_current_user');
    const userObj = savedUser ? JSON.parse(savedUser) : null;
    const prefix = userObj ? `_${userObj.username}` : '';
    const saved = localStorage.getItem(`school_ai_attempts${prefix}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [learningPath, setLearningPath] = useState<LearningPath>(() => {
    const savedUser = localStorage.getItem('school_ai_current_user');
    const userObj = savedUser ? JSON.parse(savedUser) : null;
    const prefix = userObj ? `_${userObj.username}` : '';
    const saved = localStorage.getItem(`school_ai_path${prefix}`);
    return saved ? JSON.parse(saved) : INITIAL_PATH;
  });

  // Dynamic state reload on user login/logout/profile update
  useEffect(() => {
    const prefix = currentUser ? `_${currentUser.username}` : '';
    
    const savedQuizzes = localStorage.getItem(`school_ai_quizzes${prefix}`);
    setQuizzes(savedQuizzes ? JSON.parse(savedQuizzes) : INITIAL_QUIZZES);
    
    const savedAttempts = localStorage.getItem(`school_ai_attempts${prefix}`);
    setAttempts(savedAttempts ? JSON.parse(savedAttempts) : []);
    
    const savedPath = localStorage.getItem(`school_ai_path${prefix}`);
    setLearningPath(savedPath ? JSON.parse(savedPath) : INITIAL_PATH);
  }, [currentUser]);

  // Periodically check my status to see if Admin approved me
  useEffect(() => {
    if (!currentUser) return;
    
    // Check status function
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/auth/status/${currentUser.username}`);
        if (res.ok) {
          const data = await res.json();
          // If status (approved or admin role) changed, update state
          if (data.isApproved !== currentUser.isApproved || data.isAdmin !== currentUser.isAdmin) {
            const updatedUser = { ...currentUser, isApproved: data.isApproved, isAdmin: data.isAdmin };
            setCurrentUser(updatedUser);
            localStorage.setItem('school_ai_current_user', JSON.stringify(updatedUser));
          }
        }
      } catch (err) {
        console.warn('Cannot check status polling:', err);
      }
    };

    // Immediate check
    checkStatus();

    // Check status periodically if pending approval
    if (!currentUser.isApproved) {
      const interval = setInterval(checkStatus, 4000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Admin user approvals poll
  const fetchSystemUsers = async () => {
    if (!currentUser || !currentUser.isAdmin) return;
    setIsAdminUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setSystemUsers(data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách người dùng:', err);
    } finally {
      setIsAdminUsersLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchSystemUsers();
    }
  }, [currentUser]);

  // Gemini API Access State Indicators
  const [aiStatus, setAiStatus] = useState({ geminiActive: false, message: 'Đang kết nối server...' });
  
  // Selected Quiz Taking Flow States
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<{ [key: string]: number }>({});
  const [quizTimer, setQuizTimer] = useState<number>(0);
  const [quizState, setQuizState] = useState<'idle' | 'taking' | 'completed'>('idle');
  const [detailedAttemptOutput, setDetailedAttemptOutput] = useState<QuizAttempt | null>(null);

  // Search & Filter Status
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [searchDifficulty, setSearchDifficulty] = useState<string>('all');

  // AI Generation Loading Markers
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [isAnalyzingPath, setIsAnalyzingPath] = useState<boolean>(false);
  const [isParsingQuiz, setIsParsingQuiz] = useState<boolean>(false);
  
  // Custom Topic Generator fields
  const [topicInput, setTopicInput] = useState<string>('');
  const [topicCategory, setTopicCategory] = useState<string>('Tiếng Anh');
  const [topicDifficulty, setTopicDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [topicQuantity, setTopicQuantity] = useState<number>(5);

  // Manual pasted text parser fields
  const [rawPastedText, setRawPastedText] = useState<string>(
    'Which word belongs to a different part of speech?\n' +
    'A) happy\n' +
    'B) sadness\n' +
    'C) happiness\n' +
    'D) kindness\n' +
    'Đáp án: A\n' +
    'Giải thích: happy là tính từ, còn lại là danh từ.'
  );

  // State to track if user uploaded a file like PDF or TXT to be processed by Gemini
  const [uploadedFile, setUploadedFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null);

  // Drag and drop indicator states
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');

  // Active hover point for SVG charts stats
  const [hoveredChartPoint, setHoveredChartPoint] = useState<number | null>(null);

  // Timers pointer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize dynamic local storage whenever state updates (using user-specific key isolation)
  useEffect(() => {
    const prefix = currentUser ? `_${currentUser.username}` : '';
    localStorage.setItem(`school_ai_quizzes${prefix}`, JSON.stringify(quizzes));
  }, [quizzes, currentUser]);

  useEffect(() => {
    const prefix = currentUser ? `_${currentUser.username}` : '';
    localStorage.setItem(`school_ai_attempts${prefix}`, JSON.stringify(attempts));
  }, [attempts, currentUser]);

  useEffect(() => {
    const prefix = currentUser ? `_${currentUser.username}` : '';
    localStorage.setItem(`school_ai_path${prefix}`, JSON.stringify(learningPath));
  }, [learningPath, currentUser]);

  // Ping back-end status to verify Gemini availability
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        setAiStatus({ geminiActive: data.geminiActive, message: data.message });
      } catch (err) {
        setAiStatus({ 
          geminiActive: false, 
          message: 'Không kết nối được server Express. Hoạt động offline bằng AI ảo được bật.' 
        });
      }
    };
    fetchStatus();
  }, []);

  // Countdown timer scheduler for ongoing quiz
  useEffect(() => {
    if (quizState === 'taking' && quizTimer > 0) {
      timerRef.current = setInterval(() => {
        setQuizTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            autoSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState, quizTimer]);

  // Start selected quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentAnswers({});
    setQuizTimer(quiz.durationMinutes * 60);
    setQuizState('taking');
    setDetailedAttemptOutput(null);
  };

  // Handle option selection during quiz with immediate feedback and sound/motion effects
  const handleSelectOption = (questionId: string, optIdx: number, correctAnswer: number) => {
    // If already answered, do not allow changing answer
    if (currentAnswers[questionId] !== undefined) return;

    setCurrentAnswers(prev => ({
      ...prev,
      [questionId]: optIdx
    }));

    if (optIdx === correctAnswer) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  // Submit test and trigger auto grading
  const autoSubmitQuiz = () => {
    if (!selectedQuiz) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let score = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      const userAns = currentAnswers[q.id];
      if (userAns !== undefined && userAns === q.correctAnswer) {
        score += 1;
      }
    });

    const newAttempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      category: selectedQuiz.category,
      answers: currentAnswers,
      score: score,
      totalQuestions: selectedQuiz.questions.length,
      completedAt: new Date().toISOString()
    };

    const updatedAttempts = [newAttempt, ...attempts];
    setAttempts(updatedAttempts);
    setDetailedAttemptOutput(newAttempt);
    setQuizState('completed');

    // Automatically check path steps for completion triggers
    const updatedPathSteps = learningPath.steps.map(step => {
      if (step.resourceType === 'quiz' && step.targetCategory === selectedQuiz.category) {
        return { ...step, isCompleted: true };
      }
      return step;
    });
    setLearningPath(prev => ({
      ...prev,
      steps: updatedPathSteps,
      updatedAt: new Date().toISOString()
    }));
  };

  // Terminate test halfway
  const handleQuitQuiz = () => {
    if (confirm('Bạn có thực sự chắc chắn muồn từ bỏ bài thi đang làm? Kết quả chưa lưu sẽ bị mất.')) {
      setSelectedQuiz(null);
      setQuizState('idle');
      setDetailedAttemptOutput(null);
    }
  };

  // Call Gemini API to recommend a study path based on recent performance
  const handleRequestAiPathAnalysis = async () => {
    setIsAnalyzingPath(true);
    try {
      const res = await fetch('/api/recommend-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attempts })
      });
      if (!res.ok) throw new Error('Biên soạn lộ trình thất bại.');
      
      const pathData = await res.json();
      
      // Map response fields to structured LearningPath object
      const stepsWithIds: PathStep[] = pathData.steps.map((st: any, idx: number) => ({
        id: `step_ai_${idx}_${Date.now()}`,
        title: st.title,
        description: st.description,
        resourceType: st.resourceType as 'reading' | 'quiz' | 'practice',
        targetCategory: st.targetCategory,
        isCompleted: false
      }));

      setLearningPath({
        id: `path_${Date.now()}`,
        title: pathData.title || 'Lộ Trình Tấn Công Lỗ Hổng Kiến Thức',
        description: pathData.description || 'Thống kê đề án được điều chỉnh độc quyền theo lịch sử tích hợp của bạn.',
        steps: stepsWithIds,
        aiAnalysis: pathData.aiAnalysis,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      alert('Gặp lỗi khi tạo đề xuất lộ trình. Đang bảo toàn dữ liệu mặc định.');
    } finally {
      setIsAnalyzingPath(false);
    }
  };

  // Toggle path steps status
  const handleTogglePathStep = (stepId: string) => {
    const updatedSteps = learningPath.steps.map(step => {
      if (step.id === stepId) {
        return { ...step, isCompleted: !step.isCompleted };
      }
      return step;
    });
    setLearningPath(prev => ({
      ...prev,
      steps: updatedSteps,
      updatedAt: new Date().toISOString()
    }));
  };

  // Admin: Generate quiz dynamically using Gemini AI
  const handleGenerateQuizByAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) {
      alert('Vui lòng điền nội dung chủ đề trắc nghiệm.');
      return;
    }

    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput,
          category: topicCategory,
          difficulty: topicDifficulty,
          quantity: topicQuantity
        })
      });

      if (!res.ok) throw new Error('Yêu cầu soạn bài thất bại.');
      const data = await res.json();

      const newQuiz: Quiz = {
        id: `quiz_gen_${Date.now()}`,
        title: data.title || `Trắc nghiệm ôn tập về ${topicInput}`,
        description: data.description || `Đề luyện thi thông minh được tổ chức tự động về chủ đề ${topicInput}.`,
        category: data.category || topicCategory,
        difficulty: (data.difficulty as 'easy' | 'medium' | 'hard') || topicDifficulty,
        durationMinutes: topicQuantity * 2, // Allocate 2 mins per question
        questions: (data.questions || []).map((q: any, i: number) => ({
          id: `q_g_${i}_${Date.now()}`,
          text: q.text,
          options: q.options || ['A', 'B', 'C', 'D'],
          correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
          explanation: q.explanation || 'Chưa cung cấp giải thích chi tiết.'
        })),
        createdAt: new Date().toISOString()
      };

      setQuizzes(prev => [newQuiz, ...prev]);
      setTopicInput('');
      alert(`🎉 Soạn đề thành công! Tìm đề "${newQuiz.title}" trong thẻ Luyện Đề.`);
      setActiveTab('quizzes');
    } catch (error) {
      alert('Không thể liên hệ trợ lý AI ảo để tạo chuyên đề. Vui lòng thử lại sau.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Admin: Parse manual quiz text through backend Gemini parser
  const handleParseManualText = async () => {
    if (!rawPastedText.trim() && !uploadedFile) {
      alert('Vui lòng cung cấp văn bản thô hoặc tải lên tài liệu PDF để phân tích.');
      return;
    }

    setIsParsingQuiz(true);
    try {
      const payload: any = {};
      if (uploadedFile) {
        payload.fileData = uploadedFile.base64;
        payload.mimeType = uploadedFile.mimeType;
        payload.fileName = uploadedFile.name;
      } else {
        payload.quizText = rawPastedText;
      }

      const res = await fetch('/api/parse-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Phân tích văn bản/tài liệu thất bại.');
      const data = await res.json();

      const newQuiz: Quiz = {
        id: `quiz_parsed_${Date.now()}`,
        title: data.title || 'Đề trắc nghiệm phân tích tự động',
        description: data.description || 'Đề khảo thí được phân mảnh và chuẩn hóa từ văn bản người dùng cung cấp.',
        category: data.category || 'Tự chọn',
        difficulty: (data.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
        durationMinutes: Math.max(5, (data.questions || []).length * 2),
        questions: (data.questions || []).map((q: any, i: number) => ({
          id: `q_p_${i}_${Date.now()}`,
          text: q.text,
          options: q.options || ['A', 'B', 'C', 'D'],
          correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
          explanation: q.explanation || 'Giải pháp chính xác dựa trên luật phân tích tự động.'
        })),
        createdAt: new Date().toISOString()
      };

      setQuizzes(prev => [newQuiz, ...prev]);
      alert(`🎉 Biên dịch tài liệu thành công! Đã tạo đề: "${newQuiz.title}"`);
      // Clear file upload state upon success
      setUploadedFile(null);
      setUploadSuccessMsg('');
      setActiveTab('quizzes');
    } catch (err) {
      alert('Gặp lỗi khi xử lý định dạng tài liệu. Định dạng đầu vào không đồng bộ hoặc kích thước tệp quá lớn.');
    } finally {
      setIsParsingQuiz(false);
    }
  };

  // Simulate file drops & files parsing
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    
    if (isPdf) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const base64Str = dataUrl.split(',')[1];
          setUploadedFile({
            name: file.name,
            base64: base64Str,
            mimeType: 'application/pdf'
          });
          setRawPastedText(`[Tệp PDF đã tải lên: ${file.name}]`);
          setUploadSuccessMsg(`Tải lên tệp PDF "${file.name}" thành công! Vui lòng nhấn nút "Phân tích bằng AI" ngay phía dưới.`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setUploadedFile(null); // Clear previous PDF selection if we upload text
          setRawPastedText(text);
          setUploadSuccessMsg(`Tải lên tệp văn bản "${file.name}" thành công! Vui lòng nhấn nút "Phân tích bằng AI" ngay phía dưới.`);
        }
      };
      reader.readAsText(file);
    }
  };

  // Delete quiz (Admin helper)
  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('Bạn có muốn xóa đề thi trắc nghiệm này khỏi hệ thống?')) {
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
    }
  };

  // Clear all localized data (Hard reset)
  const handleResetStatistics = () => {
    if (confirm('Lưu ý: Mọi lịch sử thi cử, đề trắc nghiệm tạo riêng, lộ trình học tập hiện tại sẽ bị xóa sạch hoàn toàn để bắt đầu lại. Bạn chắc chứ?')) {
      const prefix = currentUser ? `_${currentUser.username}` : '';
      localStorage.removeItem(`school_ai_quizzes${prefix}`);
      localStorage.removeItem(`school_ai_attempts${prefix}`);
      localStorage.removeItem(`school_ai_path${prefix}`);
      setQuizzes(INITIAL_QUIZZES);
      setAttempts([]);
      setLearningPath(INITIAL_PATH);
      alert('Đã khôi phục dữ liệu mặc định của hệ thống.');
    }
  };

  // --- USER AUTHENTICATION & SESSION MANAGEMENT ---
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authUsername.trim() || !authPassword) {
      setAuthError('Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu.');
      return;
    }

    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authUsername,
          password: authPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập không thành công.');
      }

      // Save user session
      setCurrentUser(data.user);
      localStorage.setItem('school_ai_current_user', JSON.stringify(data.user));
      
      // Clear forms
      setAuthUsername('');
      setAuthPassword('');
      setAuthFullName('');
      setActiveTab('dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Lỗi hệ thống khi đăng nhập.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authUsername.trim() || !authPassword || !authFullName.trim()) {
      setAuthError('Vui lòng điền đầy đủ thông tin yêu cầu.');
      return;
    }

    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authUsername,
          password: authPassword,
          fullName: authFullName
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng ký không thành công.');
      }

      setAuthSuccess(data.message);
      
      // Auto-login if approved immediately (first admin account case)
      if (data.user && data.user.isApproved) {
        setCurrentUser(data.user);
        localStorage.setItem('school_ai_current_user', JSON.stringify(data.user));
        setAuthUsername('');
        setAuthPassword('');
        setAuthFullName('');
        setActiveTab('dashboard');
      } else {
        // Registered non-admin, switch back to login mode
        setAuthPassword('');
        setTimeout(() => {
          setAuthMode('login');
          setAuthSuccess('');
        }, 6000);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Lỗi hệ thống khi đăng ký.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('school_ai_current_user');
    setSelectedQuiz(null);
    setQuizState('idle');
    setActiveTab('dashboard');
    setAuthMode('login');
    setAuthUsername('');
    setAuthPassword('');
    setAuthFullName('');
    setAuthError('');
    setAuthSuccess('');
  };

  // --- ADMIN: MANAGE USER APPROVALS AND ROLES ---
  const handleApproveUser = async (targetUsername: string, isApproved: boolean) => {
    try {
      const res = await fetch('/api/admin/users/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetUsername, isApproved })
      });
      if (res.ok) {
        fetchSystemUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Không thể thực hiện phê duyệt.');
      }
    } catch (err) {
      console.error('Core approval error:', err);
    }
  };

  const handleToggleAdmin = async (targetUsername: string, isAdmin: boolean) => {
    try {
      const res = await fetch('/api/admin/users/toggle-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetUsername, isAdmin })
      });
      if (res.ok) {
        fetchSystemUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Không thể cập nhật quyền quản trị.');
      }
    } catch (err) {
      console.error('Core toggle-admin error:', err);
    }
  };

  const handleDeleteUser = async (targetUsername: string) => {
    if (!confirm(`Bạn có chắc muốn xóa tài khoản "${targetUsername}" khỏi hệ thống? Dữ liệu người dùng này sẽ không thể khôi phục.`)) {
      return;
    }
    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetUsername })
      });
      if (res.ok) {
        fetchSystemUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Không thể xóa người dùng.');
      }
    } catch (err) {
      console.error('Core delete-user error:', err);
    }
  };

  // Statistical calculations
  const totalCompletedCount = attempts.length;
  const averageAccuracy = totalCompletedCount > 0
    ? Math.round((attempts.reduce((sum, att) => sum + (att.score / att.totalQuestions), 0) / totalCompletedCount) * 100)
    : 0;
  
  // Calculate Streak of Study (active days checking)
  const currentStreak = attempts.length > 0 ? (() => {
    const dates = attempts.map(a => a.completedAt.split('T')[0]);
    const uniqueDates = Array.from(new Set<string>(dates)).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    let todayStr = new Date().toISOString().split('T')[0];
    let expectedDate = new Date(todayStr);

    for (const uDate of uniqueDates) {
      const actualD = new Date(uDate);
      const diffTime = Math.abs(expectedDate.getTime() - actualD.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak += 1;
        expectedDate = actualD;
      } else {
        break;
      }
    }
    return streak;
  })() : 0;

  // Filter quizzes according to search queries
  const filteredQuizzes = quizzes.filter(q => {
    const matchCat = searchCategory === 'all' || q.category.toLowerCase().includes(searchCategory.toLowerCase());
    const matchDiff = searchDifficulty === 'all' || q.difficulty === searchDifficulty;
    return matchCat && matchDiff;
  });

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#434338] antialiased selection:bg-[#CCD5AE] selection:text-[#2D2D26] pb-16">
      {/* Top Banner indicating API Status */}
      <div className="bg-[#2D2D26] text-[#A09E91] text-xs px-4 py-2 flex items-center justify-between border-b border-[#EAE7DE] font-mono">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full inline-block animate-pulse ${aiStatus.geminiActive ? 'bg-[#7C9070]' : 'bg-[#D4A373]'}`}></span>
          <span>Trạng thái kết nối: {aiStatus.message}</span>
        </div>
        <div className="hidden sm:block">
          Giờ hệ thống: <span className="text-[#FDFCF9]">UTC 2026-06-12</span>
        </div>
      </div>

      {/* Main Header navigation element */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EAE7DE]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FEFAE0] rounded-xl text-[#7C9070] border border-[#E9EDC9]">
              <GraduationCap id="header_icon" className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-serif font-semibold text-lg leading-tight tracking-tight text-[#2D2D26]">
                Trắc Nghiệm Thông Minh <span className="text-[#7C9070] font-light">AI</span>
              </h1>
              <p className="text-[10px] text-[#A09E91] font-mono tracking-wider">ONLINE EXAM & PERSONALIZED LEARNING</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex bg-[#F2EFE9] p-1.5 rounded-lg border border-[#EAE7DE]">
              <button
                id="tab_dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-[#7C9070] shadow-sm font-bold'
                    : 'text-[#706F64] hover:text-[#7C9070]'
                }`}
              >
                <Compass id="tab_dash_icon" className="h-3.5 w-3.5" />
                Tổng quan & Lộ trình
              </button>
              <button
                id="tab_quizzes"
                onClick={() => setActiveTab('quizzes')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeTab === 'quizzes'
                    ? 'bg-white text-[#7C9070] shadow-sm font-bold'
                    : 'text-[#706F64] hover:text-[#7C9070]'
                }`}
              >
                <BookOpen id="tab_quizzes_icon" className="h-3.5 w-3.5" />
                Luyện Đề
              </button>
              
              {currentUser?.isAdmin && (
                <button
                  id="tab_admin"
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-white text-[#7C9070] shadow-sm font-bold'
                      : 'text-[#706F64] hover:text-[#7C9070]'
                  }`}
                >
                  <Sparkles id="tab_admin_icon" className="h-3.5 w-3.5" />
                  Hệ Thống (Admin)
                </button>
              )}
            </nav>

            {currentUser && (
              <div className="flex items-center gap-3 pl-3 border-l border-[#EAE7DE]">
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-serif font-bold text-[#2D2D26]">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[9px] font-mono uppercase font-black text-[#7C9070]">
                    {currentUser.isAdmin ? 'Quản trị viên' : 'Thành viên'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1 px-2.5 sm:p-2 bg-[#FAEDCD]/40 text-[#D4A373] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-[#EAE7DE] cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Rời</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-8">

        {/* VIEW 0: AUTHENTICATION BARRIER */}
        {!currentUser ? (
          <div className="max-w-md mx-auto mt-12 px-4 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'tween' }}
              className="bg-white rounded-3xl border border-[#EAE7DE] shadow-xl overflow-hidden p-6 md:p-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex p-3.5 bg-[#FEFAE0] rounded-2xl text-[#7C9070] border border-[#E9EDC9] mb-4">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h2 className="font-serif font-black text-2xl text-[#2D2D26] tracking-tight">
                  Học Viện Trắc Nghiệm AI
                </h2>
                <p className="text-xs text-[#706F64] mt-1.5 font-sans">
                  Hệ thống luyện đề cá nhân hóa và soạn thảo thông minh
                </p>
              </div>

              {authError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-5 p-3 flex gap-2 items-start bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </motion.div>
              )}

              {authSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-5 p-3 flex gap-2 items-start bg-green-50 text-green-700 rounded-xl border border-green-200 text-xs"
                >
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{authSuccess}</span>
                </motion.div>
              )}

              <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-mono uppercase font-bold text-[#706F64] mb-1.5">
                      Họ và tên học sinh / giáo viên
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-10 pr-4 py-3 bg-[#FDFCF9] border border-[#EAE7DE] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] transition-colors font-sans text-gray-800 animate-none"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#706F64] mb-1.5">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <UserCheck className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      placeholder="Tránh viết hoa hay dấu cách"
                      className="w-full pl-10 pr-4 py-3 bg-[#FDFCF9] border border-[#EAE7DE] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] transition-colors font-sans text-gray-800 animate-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#706F64] mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full pl-10 pr-4 py-3 bg-[#FDFCF9] border border-[#EAE7DE] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] transition-colors font-sans text-gray-800 animate-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-3.5 bg-[#7C9070] text-white rounded-xl text-sm font-semibold hover:bg-[#6B7D60] transition-colors focus:outline-none shadow-md shadow-[#7C9070]/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                >
                  {isAuthLoading ? (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : authMode === 'login' ? (
                    'Đăng Nhập Ngay'
                  ) : (
                    'Đăng Ký Tài Khoản Mới'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center border-t border-[#EAE7DE] pt-5">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-xs font-serif font-black text-[#7C9070] hover:underline cursor-pointer"
                >
                  {authMode === 'login'
                    ? 'Bạn chưa có tài khoản học sinh? Đăng ký ngay'
                    : 'Đã có tài khoản thành viên? Nhấn để đăng nhập'}
                </button>
              </div>

              <div className="mt-6 bg-[#FEFAE0]/75 border border-[#E9EDC9] rounded-xl p-3.5 text-[11px] text-[#706F64] leading-relaxed">
                <p className="font-bold flex items-center gap-1 text-[#2D2D26]">
                  <Info className="h-3.5 w-3.5 inline text-[#7C9070]" /> Tài khoản Học viện Giáo viên:
                </p>
                <p className="mt-1">
                  - Tên đăng nhập: <strong className="text-[#2D2D26] font-mono select-all font-bold">admin</strong><br/>
                  - Mật khẩu: <strong className="text-[#2D2D26] font-mono select-all font-bold">admin123</strong>
                </p>
              </div>
            </motion.div>
          </div>
        ) : !currentUser.isApproved ? (
          /* AWAITING APPROVAL BARRIER SCREEN */
          <div className="max-w-lg mx-auto mt-12 px-4 pb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'tween' }}
              className="bg-white rounded-3xl border border-[#FAEDCD] shadow-lg p-8 text-center overflow-hidden relative"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-[#D4A373]"></div>
              
              <div className="inline-flex p-4 bg-[#FEFAE0] rounded-2xl text-[#D4A373] border border-[#FAEDCD] mb-5">
                <Shield className="h-8 w-8 animate-pulse text-[#D4A373]" />
              </div>
              
              <h2 className="font-serif font-black text-2xl text-[#2D2D26]">
                Tài Khoản Chờ Phê Duyệt!
              </h2>
              
              <p className="text-sm text-[#706F64] mt-3 leading-relaxed">
                Xin chào <strong className="text-[#2D2D26]">{currentUser.fullName}</strong>. Tài khoản của bạn (<span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{currentUser.username}</span>) đã được khởi tạo thành công trên hệ thống.
              </p>
              
              <div className="my-6 bg-[#FEFAE0]/80 rounded-2xl p-4 border border-[#FAEDCD] text-left text-xs space-y-2 leading-relaxed">
                <h4 className="font-serif font-bold text-[#D4A373] uppercase tracking-wider text-[10px] mb-1">Cơ chế phê duyệt</h4>
                <p className="text-[#434338]">
                  Để bảo mật thông tin và cá nhân hóa, Giáo viên (Admin) của trang cần phê duyệt quyền truy cập của bạn thủ công.
                </p>
                <p className="text-[#434338]" style={{fontWeight: 'bold'}}>
                  💡 Gợi ý: Hãy báo Giáo viên/Admin phê duyệt tài khoản này. Ngay khi được phê duyệt, màn hình này sẽ tự động tải vào học viện tức khắc mà không cần bấm F5!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/auth/status/${currentUser.username}`);
                      if (res.ok) {
                        const data = await res.json();
                        if (data.isApproved) {
                          const updated = { ...currentUser, isApproved: true };
                          setCurrentUser(updated);
                          localStorage.setItem('school_ai_current_user', JSON.stringify(updated));
                          alert('🎉 Tài khoản đã được phê duyệt! Chúc bạn học tốt.');
                        } else {
                          alert('⏳ Tài khoản vẫn đang chờ duyệt. Vui lòng báo với Admin của bạn.');
                        }
                      }
                    } catch (_) {
                      alert('Không thể kết nối với máy chủ.');
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#7C9070] text-white rounded-xl text-xs font-black shadow-md hover:bg-[#6B7D60] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Kiểm tra trạng thái ngay
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Đăng xuất tài khoản khác
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          /* APPS MAIN WORKSPACE GATEWAY */
          <>
        
        {/* VIEW 1: TESTING ACTIVE SCREEN (CRITICAL HIGHEST PRIORITY OVERLAY PORTAL) */}
        {quizState === 'taking' && selectedQuiz && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#EAE7DE] shadow-sm overflow-hidden"
          >
            <div className="bg-[#2D2D26] text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE7DE]">
              <div>
                <span className="bg-[#FEFAE0]/10 uppercase tracking-widest text-[10px] font-mono px-2.5 py-1 rounded border border-[#CCD5AE]/20 text-[#CCD5AE]">
                  {selectedQuiz.category} — {selectedQuiz.difficulty.toUpperCase()}
                </span>
                <h2 className="font-serif font-bold text-xl md:text-2xl mt-2 tracking-tight">
                  {selectedQuiz.title}
                </h2>
                <p className="text-[#A09E91] text-xs mt-1 font-sans">
                  {selectedQuiz.description}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <Clock className="h-5 w-5 text-[#CCD5AE] animate-pulse" />
                <div>
                  <div className="text-[10px] font-mono text-[#A09E91] tracking-wider">THỜI GIAN CÒN LẠI</div>
                  <div className="text-xl font-mono text-[#FDFCF9] font-bold">
                    {Math.floor(quizTimer / 60)}:{(quizTimer % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
              {selectedQuiz.questions.map((question, qIdx) => {
                const isAnswered = currentAnswers[question.id] !== undefined;

                return (
                  <div 
                    id={`taking_q_${question.id}`}
                    key={question.id} 
                    className={`p-6 rounded-2xl border transition-all ${
                      isAnswered 
                        ? 'border-[#CCD5AE] bg-[#FEFAE0]/20' 
                        : 'border-[#EAE7DE] bg-[#FDFCF9]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 bg-[#E9EDC9] text-[#7C9070] font-mono font-bold rounded-lg h-7 w-7 text-xs flex items-center justify-center border border-[#CCD5AE]">
                          {qIdx + 1}
                        </span>
                        <h3 className="font-serif font-bold text-base text-[#2D2D26] pt-0.5 leading-relaxed">
                          {question.text}
                        </h3>
                      </div>

                      {/* Immediate correctness header badge */}
                      {isAnswered && (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`text-[10px] sm:text-[10.5px] font-mono font-bold uppercase py-1 px-3 rounded-full border flex-shrink-0 ${
                            currentAnswers[question.id] === question.correctAnswer
                              ? 'bg-[#E9EDC9] text-[#7C9070] border-[#CCD5AE]'
                              : 'bg-[#FAEDCD] text-[#D4A373] border-[#EAE7DE]'
                          }`}
                        >
                          {currentAnswers[question.id] === question.correctAnswer ? 'Chính xác! 🎉' : 'Chưa đúng! 💡'}
                        </motion.span>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 pl-10">
                      {question.options.map((option, optIdx) => {
                        const isSelected = currentAnswers[question.id] === optIdx;
                        const isCorrectOption = optIdx === question.correctAnswer;
                        const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                        return (
                          <motion.button
                            id={`opt_${question.id}_${optIdx}`}
                            key={optIdx}
                            onClick={() => handleSelectOption(question.id, optIdx, question.correctAnswer)}
                            disabled={isAnswered}
                            whileHover={!isAnswered ? { scale: 1.01, x: 2 } : {}}
                            whileTap={!isAnswered ? { scale: 0.98 } : {}}
                            animate={
                              isSelected
                                ? isCorrectOption
                                  ? { scale: [1, 1.04, 1], y: [0, -3, 0] }
                                  : { x: [0, -6, 6, -6, 6, -3, 3, 0] }
                                : {}
                            }
                            transition={{
                              duration: isSelected ? (isCorrectOption ? 0.35 : 0.45) : 0.2,
                              type: isSelected ? "tween" : "spring",
                              stiffness: 300
                            }}
                            className={`flex items-center gap-3.5 p-4 rounded-xl text-left border text-sm transition-all focus:outline-none w-full ${
                              isAnswered
                                ? isCorrectOption
                                  ? 'bg-[#E9EDC9]/60 border-[#CCD5AE] text-[#7C9070] font-serif font-bold shadow-sm'
                                  : isSelected
                                    ? 'bg-[#FAEDCD]/60 border-[#EAE7DE] text-[#D4A373] font-semibold'
                                    : 'bg-[#FDFCF9]/30 border-[#EAE7DE] text-[#706F64]/40 opacity-60 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-[#7C9070] border-[#7C9070] text-white font-semibold shadow-md shadow-[#7C9070]/10 cursor-pointer'
                                  : 'bg-white border-[#EAE7DE] text-[#434338] hover:bg-[#F2EFE9] hover:border-[#CCD5AE] cursor-pointer'
                            }`}
                          >
                            <span className={`h-6 w-6 rounded-full text-xs font-mono font-semibold flex items-center justify-center transition-all flex-shrink-0 ${
                              isAnswered
                                ? isCorrectOption
                                  ? 'bg-[#7C9070] text-white'
                                  : isSelected
                                    ? 'bg-[#D4A373] text-white'
                                    : 'bg-[#F2EFE9]/40 border border-[#EAE7DE] text-[#706F64]/30'
                                : isSelected 
                                  ? 'bg-[#6B7D60] border-white text-white' 
                                  : 'bg-[#F2EFE9] border border-[#EAE7DE] text-[#706F64]'
                            }`}>
                              {isAnswered && isCorrectOption ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : isAnswered && isSelected ? (
                                <X className="h-3.5 w-3.5" />
                              ) : (
                                optionLetter
                              )}
                            </span>
                            <span className="leading-tight">{option}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Instant Inline Explanation Box */}
                    {isAnswered && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        id={`explanation_box_taking_${question.id}`} 
                        className="mt-5 bg-[#FEFAE0] border-l-4 border-[#7C9070] rounded-r-xl p-5 overflow-hidden"
                      >
                        <div className="text-[#7C9070] font-serif font-bold uppercase tracking-wider text-xs mb-2">
                          GIẢI ĐÁP CHI TIẾT
                        </div>
                        <p className="text-xs text-[#434338] whitespace-pre-wrap leading-relaxed font-sans">
                          {question.explanation}
                        </p>
                      </motion.div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-6 border-t border-[#F2EFE9]">
                <button
                  id="quit_test"
                  onClick={handleQuitQuiz}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#706F64] hover:text-[#2D2D26] border border-[#EAE7DE] hover:bg-[#F2EFE9] transition-all cursor-pointer"
                >
                  Từ bỏ bài thi
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-[#A09E91] font-mono hidden sm:block">
                    Cần điền: {Object.keys(currentAnswers).length} / {selectedQuiz.questions.length} câu hỏi
                  </div>
                  <button
                    id="submit_test"
                    onClick={autoSubmitQuiz}
                    className="px-8 py-3 bg-[#7C9070] text-white text-xs font-semibold rounded-xl hover:bg-[#6B7D60] transition-all shadow-md shadow-[#7C9070]/10 cursor-pointer"
                  >
                    Nộp Bài Khảo Thí
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: DETAILED GRADED SCORESHEET WITH 'GIẢI ĐÁP' PANEL INSPIRED BY REFERENCE PICTURE */}
        {quizState === 'completed' && detailedAttemptOutput && selectedQuiz && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Graded Summary Header */}
            <div className="bg-white rounded-3xl border border-[#e2e8e4] shadow-sm overflow-hidden p-6 md:p-8 text-center relative">
              <div className="absolute top-4 right-4 text-[10px] font-mono text-gray-400">
                Lịch sử: {new Date(detailedAttemptOutput.completedAt).toLocaleString('vi-VN')}
              </div>
              <div className="inline-flex p-4 bg-[#E9EDC9] text-[#7C9070] rounded-full mb-4 border border-[#CCD5AE]">
                <Award id="award_completed" className="h-10 w-10 animate-bounce" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#2D2D26] tracking-tight">KẾT QUẢ KHẢO THÍ CHI TIẾT</h2>
              <p className="text-xs text-[#706F64] mt-1 max-w-lg mx-auto leading-relaxed">
                Hệ thống chấm chữa tự động đang hoạt động. Bạn đã trả lời đúng <strong className="text-[#7C9070]">{detailedAttemptOutput.score}</strong> trên tổng số <strong className="text-[#2D2D26]">{detailedAttemptOutput.totalQuestions}</strong> câu hỏi.
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
                <div className="p-4 bg-[#FDFCF9] border border-[#EAE7DE] rounded-2xl">
                  <div className="text-[10px] font-mono text-[#A09E91] tracking-wider">TỈ LỆ CHÍNH XÁC</div>
                  <div className="text-2xl font-mono font-bold text-[#7C9070] mt-1">
                    {Math.round((detailedAttemptOutput.score / detailedAttemptOutput.totalQuestions) * 100)}%
                  </div>
                </div>
                <div className="p-4 bg-[#FDFCF9] border border-[#EAE7DE] rounded-2xl">
                  <div className="text-[10px] font-mono text-[#A09E91] tracking-wider">ĐIỂM SỐ</div>
                  <div className="text-2xl font-mono font-bold text-[#2D2D26] mt-1">
                    {((detailedAttemptOutput.score / detailedAttemptOutput.totalQuestions) * 10).toFixed(1)} / 10
                  </div>
                </div>
                <div className="p-4 bg-[#FAEDCD]/55 border border-[#EAE7DE] rounded-2xl col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-mono text-[#D4A373] tracking-wider">XẾP HẠNG</div>
                  <div className="text-sm font-semibold text-[#7C9070] mt-2 font-mono uppercase bg-[#FEFAE0]/70 py-0.5 px-2 rounded inline-block">
                    {detailedAttemptOutput.score === detailedAttemptOutput.totalQuestions ? 'Xuất sắc ⭐' : detailedAttemptOutput.score >= (detailedAttemptOutput.totalQuestions * 0.75) ? 'Đạt loại Khá' : 'Cần cố gắng'}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="re_attempt"
                  onClick={() => handleStartQuiz(selectedQuiz)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#F2EFE9] border border-[#EAE7DE] text-[#2D2D26] text-xs font-semibold rounded-xl hover:bg-[#7C9070] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Làm lại đề thi này
                </button>
                <button
                  id="go_dashboard"
                  onClick={() => {
                    setSelectedQuiz(null);
                    setQuizState('idle');
                    setActiveTab('dashboard');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#7C9070] text-white text-xs font-semibold rounded-xl hover:bg-[#6B7D60] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#7C9070]/10 cursor-pointer"
                >
                  Trở lại Trang chủ
                </button>
              </div>
            </div>

            {/* Render questions overview with standard explanation (GIẢI ĐÁP) panel below */}
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-lg text-[#2D2D26] flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#7C9070]" />
                Giải Thảo Chi Tiết Từng Câu Hỏi
              </h3>

              {selectedQuiz.questions.map((question, idx) => {
                const userChoice = detailedAttemptOutput.answers[question.id];
                const isCorrect = userChoice === question.correctAnswer;

                return (
                  <div 
                    id={`result_q_${question.id}`}
                    key={question.id} 
                    className="bg-white rounded-2xl border border-[#EAE7DE] shadow-sm p-6 space-y-4 overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 font-mono text-xs rounded-lg h-6 w-6 flex items-center justify-center border font-bold ${
                        isCorrect 
                          ? 'bg-[#E9EDC9] text-[#7C9070] border-[#CCD5AE]' 
                          : 'bg-[#FAEDCD] text-[#D4A373] border-[#EAE7DE]'
                      }`}>
                        {idx + 1}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#2D2D26] leading-relaxed">
                        {question.text}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-9">
                      {question.options.map((option, optIdx) => {
                        const isCorrectOption = optIdx === question.correctAnswer;
                        const isUserSelected = userChoice === optIdx;
                        const optionLetter = String.fromCharCode(65 + optIdx);

                        return (
                          <div
                            id={`res_opt_${question.id}_${optIdx}`}
                            key={optIdx}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs transition-all ${
                              isCorrectOption
                                ? 'bg-[#E9EDC9]/60 border-[#CCD5AE] text-[#7C9070]'
                                : isUserSelected
                                  ? 'bg-[#FAEDCD]/60 border-[#EAE7DE] text-[#D4A373]'
                                  : 'bg-[#FDFCF9] border-[#EAE7DE] text-[#706F64]'
                            }`}
                          >
                            <span className={`h-5 w-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                              isCorrectOption
                                ? 'bg-[#7C9070] text-white'
                                : isUserSelected
                                  ? 'bg-[#D4A373] text-white'
                                  : 'bg-[#F2EFE9] text-[#706F64] border border-[#EAE7DE]'
                            }`}>
                              {optionLetter}
                            </span>
                            <span className={isCorrectOption ? 'font-serif font-bold' : ''}>{option}</span>
                            
                            {isCorrectOption && (
                              <Check className="h-3.5 w-3.5 text-[#7C9070] ml-auto flex-shrink-0" />
                            )}
                            {isUserSelected && !isCorrectOption && (
                              <X className="h-3.5 w-3.5 text-[#D4A373] ml-auto flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Highly polished 'GIẢI ĐÁP' box - exactly matches user's screenshot layout */}
                    <div id={`explanation_box_${question.id}`} className="mt-4 bg-[#FEFAE0] border-l-4 border-[#7C9070] rounded-r-xl p-5">
                      <div className="text-[#7C9070] font-serif font-bold uppercase tracking-wider text-xs mb-2">
                        GIẢI ĐÁP
                      </div>
                      <p className="text-xs text-[#434338] whitespace-pre-wrap leading-relaxed font-sans">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Tab-driven layout for normal operation views */}
        {quizState === 'idle' && (
          <div>
            
            {/* VIEW A: TỔNG QUAN & LỘ TRÌNH HỌC TẬP AI */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* Stats row & Interactive SVG graph */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Performance Indicators */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-[#EAE7DE] p-6 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#A09E91] tracking-wider">ĐÃ HOÀN THÀNH</span>
                        <h3 className="font-serif font-semibold text-3xl text-[#2D2D26] mt-1">{totalCompletedCount} <span className="text-xs text-[#706F64] font-sans">bài thi</span></h3>
                      </div>
                      <div className="p-3 bg-[#E9EDC9] text-[#7C9070] rounded-2xl border border-[#CCD5AE]">
                        <History className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#EAE7DE] p-6 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#A09E91] tracking-wider">ĐIỂM TRUNG BÌNH CHUẨN</span>
                        <h3 className="font-serif font-semibold text-3xl text-[#7C9070] mt-1">{averageAccuracy}%</h3>
                      </div>
                      <div className="p-3 bg-[#FAEDCD] text-[#D4A373] rounded-2xl border border-[#EAE7DE]">
                        <Award className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#EAE7DE] p-6 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#A09E91] tracking-wider">CHUỖI LIÊN TỤC (STREAK)</span>
                        <h3 className="font-serif font-semibold text-3xl text-[#D4A373] mt-1">{currentStreak} <span className="text-xs text-[#706F64] font-sans">ngày liên tiếp</span></h3>
                      </div>
                      <div className="p-3 bg-[#FEFAE0] text-[#7C9070] rounded-2xl border border-[#E9EDC9]">
                        <Sparkles className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {/* PREMIUM INTERACTIVE CUSTOM SVG ANALYTICS CHART */}
                  <div className="bg-white rounded-3xl border border-[#EAE7DE] p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-semibold text-base text-[#2D2D26]">Biểu Đồ Theo Dõi Tiến Độ Học Tập</h4>
                        <p className="text-[11px] text-[#706F64] font-sans mt-0.5">Xu hướng điểm số trắc nghiệm qua các lần kiểm tra trực tuyến</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#7C9070] inline-block"></span>
                        <span className="text-[10px] font-mono text-[#A09E91] font-bold uppercase tracking-wider">Điểm số (0 - 10)</span>
                      </div>
                    </div>

                    <div className="mt-6 flex-grow flex items-center justify-center bg-[#F2EFE9] rounded-2xl border border-[#EAE7DE] p-4 relative min-h-[180px]">
                      {attempts.length === 0 ? (
                        <div className="text-center p-4">
                          <BarChart2 className="h-8 w-8 text-[#A09E91] mx-auto mb-1.5" />
                          <p className="text-xs text-[#706F64] font-sans max-w-xs">Chưa có đủ dữ liệu biểu đồ. Hãy hoàn thành tối thiểu 1 đề thi trắc nghiệm để mở khóa báo cáo.</p>
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <svg className="w-full h-36 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* SVG grids drawing */}
                            <line x1="0" y1="20" x2="100" y2="20" stroke="#EAE7DE" strokeWidth="0.5" strokeDasharray="1,1" />
                            <line x1="0" y1="50" x2="100" y2="50" stroke="#EAE7DE" strokeWidth="0.5" strokeDasharray="1,1" />
                            <line x1="0" y1="80" x2="100" y2="80" stroke="#EAE7DE" strokeWidth="0.5" strokeDasharray="1,1" />

                            {/* Chart path rendering */}
                            {attempts.length > 1 ? (() => {
                              // Plot x and y values on canvas
                              const dataLength = attempts.length;
                              const stepX = 100 / (dataLength - 1);
                              let pathCoords = '';
                              attempts.slice().reverse().forEach((att, idx) => {
                                const currentX = idx * stepX;
                                const accuracyRatio = att.score / att.totalQuestions;  // 0 to 1
                                const currentY = 100 - (accuracyRatio * 80 + 10); // plot in 10-90 range
                                pathCoords += `${idx === 0 ? 'M' : 'L'} ${currentX} ${currentY} `;
                              });
                              return (
                                <>
                                  <path d={pathCoords} fill="none" stroke="#7C9070" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                  
                                  {/* Render hover points */}
                                  {attempts.slice().reverse().map((att, idx) => {
                                    const currentX = idx * stepX;
                                    const accuracyRatio = att.score / att.totalQuestions;
                                    const currentY = 100 - (accuracyRatio * 80 + 10);
                                    return (
                                      <g key={att.id} className="cursor-pointer">
                                        <circle 
                                          cx={currentX} 
                                          cy={currentY} 
                                          r={hoveredChartPoint === idx ? '3.5' : '2'} 
                                          fill="#ffffff" 
                                          stroke="#7C9070" 
                                          strokeWidth={hoveredChartPoint === idx ? '3' : '2'} 
                                          onMouseEnter={() => setHoveredChartPoint(idx)}
                                          onMouseLeave={() => setHoveredChartPoint(null)}
                                        />
                                      </g>
                                    );
                                  })}
                                </>
                              );
                            })() : (
                              // Single attempt handling
                              <circle cx="50" cy="50" r="4" fill="#7C9070" stroke="#ffffff" strokeWidth="2.5" />
                            )}
                          </svg>

                          {/* Chart Labels */}
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-[8px] font-mono text-[#A09E91] mt-2">
                            <span>Lần đầu</span>
                            {attempts.length > 2 && <span>Trung gian</span>}
                            <span>Lần gần nhất</span>
                          </div>

                          {/* Dynamic Hover Tooltip inside SVG */}
                          {hoveredChartPoint !== null && (
                            <div className="absolute top-1 left-1.5 bg-[#2D2D26] text-[#FDFCF9] text-[10px] py-1.5 px-2.5 rounded-lg border border-[#EAE7DE] shadow-xl pointer-events-none z-10 max-w-[200px] font-sans">
                              {(() => {
                                const orderedAttempts = attempts.slice().reverse();
                                const point = orderedAttempts[hoveredChartPoint];
                                if (!point) return null;
                                return (
                                  <>
                                    <div className="font-semibold truncate">{point.quizTitle}</div>
                                    <div className="text-[9px] text-[#CCD5AE] mt-0.5">
                                      Làm Đúng: {point.score}/{point.totalQuestions} ({Math.round((point.score / point.totalQuestions) * 100)}%)
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Study Pathway Component */}
                <div className="bg-white rounded-3xl border border-[#EAE7DE] p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2EFE9] pb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles id="ai_sparkle_label" className="h-5 w-5 text-[#7C9070] animate-pulse" />
                        <h3 className="font-serif font-semibold text-lg text-[#2D2D26]">Lộ Trình Học Tập Tối Ưu Tự Động Hóa Từ AI</h3>
                      </div>
                      <p className="text-xs text-[#706F64] font-sans mt-0.5">AI tự động phân tích lỗ hổng từ bài làm sai để liên tục tái thiết kế các bước khắc phục hiệu quả</p>
                    </div>

                    <button
                      id="update_path_btn"
                      onClick={handleRequestAiPathAnalysis}
                      disabled={isAnalyzingPath}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C9070] text-white text-xs font-semibold rounded-xl hover:bg-[#6B7D60] transition-all disabled:opacity-50 shadow-md shadow-[#7C9070]/10 cursor-pointer"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isAnalyzingPath ? 'animate-spin' : ''}`} />
                      {isAnalyzingPath ? 'AI Đang Tính Toán...' : 'Yêu cầu AI Phân Tích Lại Lộ Trình'}
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recommendations Analysis Summary */}
                    <div className="lg:col-span-1 bg-[#F2EFE9] border border-[#EAE7DE] rounded-2xl p-5 space-y-4">
                      <div className="inline-flex gap-2 items-center text-xs font-bold text-[#7C9070] font-sans tracking-wide">
                        <Brain className="h-4 w-4" />
                        PHÂN TÍCH TỪ TRỢ LÝ AI
                      </div>
                      <p className="text-xs text-[#434338] font-sans leading-relaxed whitespace-pre-line bg-white/80 p-4 rounded-xl border border-[#EAE7DE]">
                        {learningPath.aiAnalysis || 'Chưa nhận định được dữ liệu học sinh.'}
                      </p>
                      <div className="text-[10px] text-[#A09E91] font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Lần cuối cập nhật: {new Date(learningPath.updatedAt).toLocaleString('vi-VN')}
                      </div>
                    </div>

                    {/* Timeline representation of pathways steps */}
                    <div className="lg:col-span-2 space-y-4">
                      {learningPath.steps.map((step, idx) => {
                        const resourceIcons = {
                          reading: <BookOpen className="h-3.5 w-3.5 text-[#7C9070]" />,
                          quiz: <FileText className="h-3.5 w-3.5 text-[#D4A373]" />,
                          practice: <Sparkles className="h-3.5 w-3.5 text-[#7C9070]" />
                        };

                        return (
                          <div 
                            id={`path_step_${step.id}`}
                            key={step.id}
                            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                              step.isCompleted 
                                ? 'bg-[#F2EFE9]/40 border-[#EAE7DE] opacity-75' 
                                : 'bg-white border-[#EAE7DE] shadow-sm hover:border-[#CCD5AE]'
                            }`}
                          >
                            <button
                              id={`step_checkbox_${step.id}`}
                              onClick={() => handleTogglePathStep(step.id)}
                              className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center transition-all focus:outline-none cursor-pointer ${
                                step.isCompleted
                                  ? 'bg-[#7C9070] border-[#7C9070] text-white'
                                  : 'bg-white border-[#CCD5AE] text-transparent hover:border-[#7C9070]'
                              }`}
                            >
                              <Check className="h-4 w-4" />
                            </button>

                            <div className="flex-grow">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-[#2D2D26] leading-tight font-serif">
                                  Bước {idx + 1}: {step.title}
                                </span>
                                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                                  step.resourceType === 'reading' 
                                    ? 'bg-[#FEFAE0] border-[#E9EDC9] text-[#7C9070]' 
                                    : step.resourceType === 'quiz' 
                                      ? 'bg-[#E9EDC9] border-[#CCD5AE] text-[#7C9070]' 
                                      : 'bg-[#FAEDCD] border-[#EAE7DE] text-[#D4A373]'
                                }`}>
                                  {resourceIcons[step.resourceType as 'reading' | 'quiz' | 'practice']}
                                  {step.resourceType}
                                </span>
                                <span className="text-[10px] text-[#706F64] font-mono bg-[#F2EFE9] px-1.5 py-0.5 rounded border border-[#EAE7DE]">
                                  {step.targetCategory}
                                </span>
                              </div>
                              <p className="text-xs text-[#706F64] mt-1 font-sans leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {learningPath.steps.length === 0 && (
                        <div className="text-center p-8 bg-[#FDFCF9] border border-[#EAE7DE] rounded-2xl">
                          <Compass className="h-8 w-8 text-[#A09E91] mx-auto mb-2" />
                          <p className="text-xs text-[#706F64] font-sans">Lộ trình rỗng. Nhấn nút "Yêu cầu AI Phân Tích Lại Lộ Trình" để khởi tạo.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Shortcut to Exams */}
                <div className="flex justify-between items-center bg-[#2D2D26] text-white p-6 rounded-3xl border border-[#EAE7DE]">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#FDFCF9]">Học Tập Chủ Động Với Các Đề Ôn Luyện</h4>
                    <p className="text-xs text-[#A09E91] mt-1 max-w-lg font-sans">
                      Chúng tôi có rất nhiều đề thi trắc nghiệm đầy đủ các môn học như Tiếng Anh, Toán học... hỗ trợ phản hồi và giải đáp chi tiết nhất.
                    </p>
                  </div>
                  <button
                    id="dashboard_go_play"
                    onClick={() => setActiveTab('quizzes')}
                    className="px-5 py-2.5 bg-[#7C9070] text-white text-xs font-semibold rounded-xl hover:bg-[#6B7D60] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Xem tất cả đề thi
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* VIEW B: LUYỆN ĐỀ (EXAMS BROWSER BOARD) */}
            {activeTab === 'quizzes' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAE7DE] shadow-sm">
                  <div>
                    <h3 className="font-serif font-bold text-[#2D2D26] text-base">Danh Mục Đề Ôn Luyện Trắc Nghiệm</h3>
                    <p className="text-xs text-[#706F64] mt-0.5">Lựa chọn bài kiểm tra phù hợp với năng lực và mục tiêu ôn tập của bạn</p>
                  </div>

                  {/* Filter and query elements */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <select
                        id="filter_category"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="bg-white border border-[#EAE7DE] text-xs font-medium rounded-lg px-2.5 py-1.5 text-[#2D2D26] focus:outline-none focus:border-[#7C9070]"
                      >
                        <option value="all">Tất cả môn học</option>
                        <option value="Tiếng Anh">Tiếng Anh</option>
                        <option value="Toán học">Toán Học</option>
                        <option value="Lịch sử">Lịch Sử</option>
                        <option value="Tự chọn">Chủ đề Tự Soạn</option>
                      </select>
                    </div>

                    <div>
                      <select
                        id="filter_difficulty"
                        value={searchDifficulty}
                        onChange={(e) => setSearchDifficulty(e.target.value)}
                        className="bg-white border border-[#EAE7DE] text-xs font-medium rounded-lg px-2.5 py-1.5 text-[#2D2D26] focus:outline-none focus:border-[#7C9070]"
                      >
                        <option value="all">Mọi độ khó</option>
                        <option value="easy">Dễ (Easy)</option>
                        <option value="medium">Vừa (Medium)</option>
                        <option value="hard">Khó (Hard)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quizzes Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuizzes.map(quiz => {
                    // Check if this test has historical records
                    const relatedAttempts = attempts.filter(a => a.quizId === quiz.id);
                    const bestAttempt = relatedAttempts.length > 0 
                      ? Math.max(...relatedAttempts.map(a => (a.score / a.totalQuestions) * 100))
                      : null;

                    return (
                      <div 
                        id={`quiz_card_${quiz.id}`}
                        key={quiz.id} 
                        className="bg-white rounded-2xl border border-[#EAE7DE] hover:border-[#7C9070] p-5 shadow-sm transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="bg-[#E9EDC9] text-[#7C9070] text-[9px] font-bold uppercase py-0.5 px-2 rounded-full border border-[#CCD5AE]">
                              {quiz.category}
                            </span>
                            <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                              quiz.difficulty === 'easy' 
                                ? 'text-[#7C9070] bg-[#E9EDC9]' 
                                : quiz.difficulty === 'medium' 
                                  ? 'text-[#D4A373] bg-[#FAEDCD]' 
                                  : 'text-[#2D2D26] bg-[#F2EFE9]'
                            }`}>
                              {quiz.difficulty}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-base text-[#2D2D26] mt-3 leading-tight tracking-tight line-clamp-2">
                             {quiz.title}
                          </h4>
                          <p className="text-xs text-[#706F64] mt-2 font-sans line-clamp-3 leading-relaxed">
                            {quiz.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-[#F2EFE9] space-y-4">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#706F64]">
                            <span className="flex items-center gap-1">
                              <HelpCircle className="h-3.5 w-3.5 text-[#A09E91]" />
                              {quiz.questions.length} câu hỏi
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-[#A09E91]" />
                              {quiz.durationMinutes} phút
                            </span>
                          </div>

                          {/* Render best historical performance if solved */}
                          {bestAttempt !== null && (
                            <div className="bg-[#FEFAE0]/70 border border-[#E9EDC9] p-2 rounded-lg flex items-center justify-between text-[10px] text-[#7C9070]">
                              <span className="font-mono flex items-center gap-1.5 font-medium">
                                <CheckCircle2 className="h-3 w-3 text-[#7C9070]" /> Đã hoàn thành
                              </span>
                              <span className="font-mono font-bold">Kỷ lục: {Math.round(bestAttempt)}%</span>
                            </div>
                          )}

                          <button
                            id={`start_quiz_${quiz.id}`}
                            onClick={() => handleStartQuiz(quiz)}
                            className="w-full py-2 bg-[#F2EFE9] text-[#2D2D26] hover:bg-[#7C9070] hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            Thi thử ngay
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {filteredQuizzes.length === 0 && (
                    <div className="col-span-full text-center p-12 bg-white rounded-3xl border border-[#EAE7DE]">
                      <FileText className="h-10 w-10 text-[#A09E91] mx-auto mb-3" />
                      <p className="text-sm font-semibold text-[#2D2D26] leading-tight">Không tìm thấy bài trắc nghiệm phù hợp</p>
                      <p className="text-xs text-[#706F64] mt-1">Vui lòng thay đổi cấu hình lọc hoặc tự tạo đề mới trong mục Soạn Đề AI.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW C: QUẢN TRỊ (PREMIUM AI COMPILER & GENERATOR MODULE) */}
            {activeTab === 'admin' && currentUser?.isAdmin && (
              <div className="space-y-8">
                
                {/* Admin Subtabs */}
                <div className="flex border-b border-[#EAE7DE] pb-px">
                  <button
                    onClick={() => setAdminSubTab('quizzes')}
                    className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-6 transition-all cursor-pointer ${
                      adminSubTab === 'quizzes'
                        ? 'border-[#7C9070] text-[#7C9070] font-black'
                        : 'border-transparent text-gray-400 hover:text-gray-800'
                    }`}
                  >
                    Soạn đề & Chế tác AI
                  </button>
                  <button
                    id="subtab_users"
                    onClick={() => {
                      setAdminSubTab('users');
                      fetchSystemUsers();
                    }}
                    className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-6 transition-all cursor-pointer flex items-center gap-2 ${
                      adminSubTab === 'users'
                        ? 'border-[#7C9070] text-[#7C9070] font-black'
                        : 'border-transparent text-gray-400 hover:text-gray-800'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Quản lý Thành viên & Phê duyệt
                    {systemUsers.filter(u => !u.isApproved).length > 0 && (
                      <span className="bg-[#D4A373] text-white text-[9px] font-mono px-2 py-0.5 rounded-full animate-bounce">
                        {systemUsers.filter(u => !u.isApproved).length} mới
                      </span>
                    )}
                  </button>
                </div>

                {adminSubTab === 'quizzes' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-none">
                    
                    {/* Panel 1: Manual Paste or Drag Drop files parsing */}
                    <div className="bg-white rounded-3xl border border-[#e2e8e4] p-6 md:p-8 shadow-sm space-y-6">
                      <div>
                        <h3 className="font-display font-medium text-base text-gray-900 flex items-center gap-2">
                          <Upload className="h-5 w-5 text-emerald-600" />
                          Tải Tài Liệu Lên & Chuyển Đổi Bằng AI
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Tải tệp dạng văn bản (Docx/Pdf thô) hoặc dán trực tiếp. AI sẽ tự động phân loại đáp án và chế tác "Explanation" (Giải thích).</p>
                      </div>

                      {/* Drag drop module area */}
                      <div
                        id="drag_drop_zone"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDropFile}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] relative ${
                            dragOver 
                              ? 'border-emerald-500 bg-emerald-50/30' 
                              : 'border-[#ccd4cf] bg-[#fafcfa] hover:border-emerald-300'
                        }`}
                      >
                        <input 
                          type="file" 
                          id="file_upload_input"
                          onChange={handleManualFileSelect}
                          className="absolute inset-0 opacity-0 w-full cursor-pointer"
                          accept=".txt,.md,.json,.pdf"
                        />
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 mb-2">
                          <Upload className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-gray-800 leading-tight">Kéo và thả file đề, hoặc click để chọn từ thiết bị</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase">Hỗ trợ các tệp dạng văn bản thô hoặc tài liệu PDF (.TXT, .MD, .PDF)</p>
                      </div>

                      {uploadSuccessMsg && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 rounded-lg flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span>{uploadSuccessMsg}</span>
                        </div>
                      )}

                      {/* Content review area */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-gray-500 block font-mono uppercase tracking-wider">
                          VĂN BẢN TRẮC NGHIỆM THÔ (RAW TRANSLATED TEXT)
                        </label>
                        <textarea
                          id="raw_pasted_text"
                          className="w-full h-44 bg-[#f8faf8] border border-[#ccd4cf] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl p-4 text-xs font-mono text-[#2c3830] placeholder-gray-400 focus:outline-none"
                          placeholder="Dán nội dung đề thi của bạn vào đây..."
                          value={rawPastedText}
                          onChange={(e) => setRawPastedText(e.target.value)}
                        />
                      </div>

                      <button
                        id="parse_quiz_submit"
                        onClick={handleParseManualText}
                        disabled={isParsingQuiz}
                        className="w-full py-3 bg-[#122b1c] text-white text-xs font-semibold rounded-xl hover:bg-emerald-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10"
                      >
                        <Sparkles className={`h-4 w-4 ${isParsingQuiz ? 'animate-spin' : ''}`} />
                        {isParsingQuiz ? 'AI Đang Giải Mã Tài Liệu...' : 'Đăng tải & Phân tích bằng AI'}
                      </button>
                    </div>

                    {/* Panel 2: Ask Gemini AI to generate custom questions of any topic */}
                    <div className="bg-white rounded-3xl border border-[#e2e8e4] p-6 md:p-8 shadow-sm space-y-6">
                      <div>
                        <h3 className="font-display font-medium text-base text-gray-900 flex items-center gap-2">
                          <Brain id="brain_gen_header" className="h-5 w-5 text-[#b87514]" />
                          Trình Soạn Đề Tự Động Theo Chủ Đề (AI Generated)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Sáng tác ngay một bài thi hoàn toàn mới bằng cách yêu cầu AI biên soạn đề trắc nghiệm tức thời theo từ khóa của bạn.</p>
                      </div>

                      <form onSubmit={handleGenerateQuizByAi} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-gray-500 block font-mono uppercase tracking-wider">
                            CHỦ ĐỀ ÔN TẬP CẦN BIÊN SOẠN
                          </label>
                          <input
                            id="topic_quiz"
                            type="text"
                            className="w-full bg-[#f8faf8] border border-[#ccd4cf] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl h-11 px-4 text-xs focus:outline-none"
                            placeholder="Ví dụ: Passive Voice, Câu điều kiện loại 3, Tích phân lượng giác..."
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-500 block font-mono uppercase tracking-wider">
                              MÔN HỌC/PHÂN LOẠI
                            </label>
                            <select
                              id="topic_category_select"
                              value={topicCategory}
                              onChange={(e) => setTopicCategory(e.target.value)}
                              className="w-full bg-white border border-[#ccd4cf] text-xs px-2.5 h-11 rounded-xl focus:outline-none"
                            >
                              <option value="Tiếng Anh">Tiếng Anh</option>
                              <option value="Toán học">Toán Học</option>
                              <option value="Lịch sử">Lịch Sử</option>
                              <option value="Môn tự học">Khác</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-500 block font-mono uppercase tracking-wider">
                              ĐỘ KHÓ
                            </label>
                            <select
                              id="topic_difficulty_select"
                              value={topicDifficulty}
                              onChange={(e) => setTopicDifficulty(e.target.value as any)}
                              className="w-full bg-white border border-[#ccd4cf] text-xs px-2.5 h-11 rounded-xl focus:outline-none"
                            >
                              <option value="easy">Dễ (Easy)</option>
                              <option value="medium">Bình thường (Medium)</option>
                              <option value="hard">Nâng cao (Hard)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-gray-500 block font-mono uppercase tracking-wider">
                            SỐ LƯỢNG CÂU HỎI ({topicQuantity} CÂU)
                          </label>
                          <input
                            id="topic_quantity_range"
                            type="range"
                            min="3"
                            max="10"
                            className="w-full accent-emerald-600"
                            value={topicQuantity}
                            onChange={(e) => setTopicQuantity(parseInt(e.target.value))}
                          />
                        </div>

                        <button
                          id="generate_quiz_submit"
                          type="submit"
                          disabled={isGeneratingQuiz}
                          className="w-full py-3 bg-[#122b1c] text-white text-xs font-semibold rounded-xl hover:bg-emerald-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10"
                        >
                          <Sparkles className={`h-4 w-4 ${isGeneratingQuiz ? 'animate-spin' : ''}`} />
                          {isGeneratingQuiz ? 'AI Đang Soạn Đề Mới...' : 'Sáng Tạo Toàn Diện Bằng AI'}
                        </button>
                      </form>
                    </div>

                    {/* Database Settings Tool and Management List */}
                    <div className="col-span-full bg-white rounded-3xl border border-[#e2e8e4] p-6 md:p-8 shadow-sm space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#f1f5f2] pb-5">
                        <div>
                          <h3 className="font-display font-medium text-base text-gray-900 flex items-center gap-1.5">
                            <Layers className="h-5 w-5 text-gray-400" />
                            Quản Lý Các Đề Thi Đang Lưu Trữ
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">Xóa bớt đề tự soạn hoặc khôi phục hệ thống về trạng thái xuất xưởng nguyên bản.</p>
                        </div>

                        <button
                          id="reset_database_btn"
                          onClick={handleResetStatistics}
                          className="px-4 py-2 border border-rose-200 text-rose-700 bg-rose-50 text-xs font-bold rounded-xl hover:bg-rose-100 hover:text-rose-800 transition-all cursor-pointer"
                        >
                          Xóa Sạch Dữ Liệu Học Tập
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table id="admin_quizzes_table" className="w-full text-left text-xs text-gray-500">
                          <thead className="text-[10px] uppercase font-mono tracking-wider text-gray-400 border-b border-[#eaedea] bg-[#fafcfa]">
                            <tr>
                              <th className="py-3 px-4 font-semibold">Tên đề bài</th>
                              <th className="py-3 px-4 font-semibold">Môn học</th>
                              <th className="py-3 px-4 font-semibold">Số câu</th>
                              <th className="py-3 px-4 font-semibold">Độ khó</th>
                              <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#eaedea]">
                            {quizzes.map(q => (
                              <tr id={`row_${q.id}`} key={q.id} className="hover:bg-[#fafbfa]">
                                <td className="py-3 px-4 font-medium text-gray-900">{q.title}</td>
                                <td className="py-3 px-4 font-mono">{q.category}</td>
                                <td className="py-3 px-4 font-mono">{q.questions.length}</td>
                                <td className="py-3 px-4">
                                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                                    q.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-800' : q.difficulty === 'medium' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'
                                  }`}>{q.difficulty}</span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    id={`delete_quiz_btn_${q.id}`}
                                    onClick={() => handleDeleteQuiz(q.id)}
                                    className="text-rose-600 hover:text-rose-900 font-semibold cursor-pointer"
                                  >
                                    Xóa đề
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* MEMBER LIST & APPROVAL PANEL */
                  <div className="bg-white rounded-3xl border border-[#EAE7DE] p-6 md:p-8 shadow-sm space-y-6">
                    <div>
                      <h3 className="font-serif font-black text-lg text-gray-950 flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#7C9070]" />
                        Phê Duyệt Tư Cách Thành Viên
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Tất cả tài khoản học viên và quản trị viên trong hệ thống. Tài khoản mới đăng ký phải được phê duyệt trước khi truy cập ứng dụng.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      {isAdminUsersLoading ? (
                        <div className="py-12 text-center text-xs font-mono text-gray-400 flex flex-col items-center gap-2">
                          <RefreshCw className="h-6 w-6 animate-spin text-gray-300" />
                          Đang tải thông tin thành viên...
                        </div>
                      ) : systemUsers.length === 0 ? (
                        <div className="py-12 text-center text-xs font-mono text-gray-400">
                          Chưa có tài khoản nào được đăng ký trong hệ thống.
                        </div>
                      ) : (
                        <table id="admin_users_table" className="w-full text-left text-xs text-gray-555">
                          <thead className="text-[10px] uppercase font-mono tracking-wider text-[#706F64] border-b border-[#EAE7DE] bg-gray-50">
                            <tr>
                              <th className="py-3 px-4 font-bold">Tên tài khoản</th>
                              <th className="py-3 px-4 font-bold">Họ và tên</th>
                              <th className="py-3 px-4 font-bold">Ngày đăng ký</th>
                              <th className="py-3 px-4 font-bold">Vai trò</th>
                              <th className="py-3 px-4 font-bold">Trạng thái</th>
                              <th className="py-3 px-4 font-bold text-right">Lựa chọn hành động</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#EAE7DE]">
                            {systemUsers.map(user => {
                              const isMe = user.username.toLowerCase() === currentUser.username.toLowerCase();
                              return (
                                <tr id={`user_row_${user.username}`} key={user.username} className="hover:bg-[#FDFCF9]/30 transition-colors">
                                  <td className="py-3 px-4 font-mono font-bold text-gray-900 select-all">{user.username}</td>
                                  <td className="py-3 px-4 font-medium text-gray-800">{user.fullName}</td>
                                  <td className="py-3 px-4 font-mono text-gray-400">
                                    {new Date(user.createdAt).toLocaleString('vi-VN', { 
                                      year: 'numeric', 
                                      month: '2-digit', 
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                                      user.isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                                    }`}>
                                      {user.isAdmin ? 'Admin' : 'Thành viên'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                                      user.isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-250' : 'bg-rose-100 text-rose-800 border border-rose-200'
                                    }`}>
                                      {user.isApproved ? 'Đã duyệt' : 'Đang chờ duyệt'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right space-x-1.5 flex items-center justify-end">
                                    {/* Approval Toggle */}
                                    {!isMe && (
                                      <button
                                        onClick={() => handleApproveUser(user.username, !user.isApproved)}
                                        className={`px-2 py-1 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                                          user.isApproved 
                                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' 
                                            : 'bg-[#7C9070] hover:bg-[#6B7D60] text-white font-black'
                                        }`}
                                      >
                                        {user.isApproved ? 'Đình chỉ' : 'Duyệt học'}
                                      </button>
                                    )}

                                    {/* Admin Role Toggle */}
                                    {!isMe && (
                                      <button
                                        onClick={() => handleToggleAdmin(user.username, !user.isAdmin)}
                                        className={`px-2 py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer ${
                                          user.isAdmin 
                                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-250' 
                                            : 'bg-indigo-50 hover:bg-indigo-150 text-indigo-750 border-indigo-200'
                                        }`}
                                      >
                                        {user.isAdmin ? 'Gỡ Admin' : 'Nhượng Admin'}
                                      </button>
                                    )}

                                    {/* Delete block */}
                                    {!isMe ? (
                                      <button
                                        onClick={() => handleDeleteUser(user.username)}
                                        className="p-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-850 rounded border border-rose-100 hover:text-rose-900 transition-colors inline-flex items-center gap-1 text-[10px] font-semibold cursor-pointer"
                                        title="Xóa tài khoản hoàn toàn"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                        Xóa
                                      </button>
                                    ) : (
                                      <span className="text-[10px] font-mono text-gray-400 italic">Tôiđăngnhập</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

          </>
        )}

      </main>
    </div>
  );
}
