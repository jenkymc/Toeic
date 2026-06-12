/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string; // "GIẢI ĐÁP"
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  durationMinutes: number;
  questions: Question[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  category: string;
  answers: { [key: string]: number }; // questionId -> selectedOptionIdx
  score: number; // number of correct answers
  totalQuestions: number;
  completedAt: string;
}

export interface PathStep {
  id: string;
  title: string;
  description: string;
  resourceType: 'reading' | 'quiz' | 'practice';
  targetCategory: string;
  isCompleted: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: PathStep[];
  aiAnalysis?: string;
  updatedAt: string;
}
