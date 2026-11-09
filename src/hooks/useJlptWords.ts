import { useEffect, useState, useCallback } from 'react';
import { getWordsByLevel, type JlptWord } from '@/data/jlptWords';
import { useAuth } from '@/context/AuthContext';

export interface WordProgress {
  status: 'new' | 'learning' | 'mastered';
  correct_count: number;
  wrong_count: number;
  last_reviewed: string | null;
}

export type WordWithProgress = JlptWord & { progress?: WordProgress };

const PROGRESS_KEY = 'ai-nihongo-word-progress';

function getAllProgress(): Record<string, WordProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllProgress(data: Record<string, WordProgress>) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function progressKey(userId: string, wordId: string) {
  return `${userId}:${wordId}`;
}

export function useJlptWords(level: string) {
  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWords = useCallback(() => {
    setLoading(true);
    const wordData = getWordsByLevel(level);
    const allProgress = getAllProgress();
    const progressMap: Record<string, WordProgress> = {};
    if (user) {
      for (const w of wordData) {
        const p = allProgress[progressKey(user.id, w.id)];
        if (p) progressMap[w.id] = p;
      }
    }
    setWords(wordData.map((w) => ({ ...w, progress: progressMap[w.id] })));
    setLoading(false);
  }, [level, user]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const recordAnswer = async (wordId: string, correct: boolean) => {
    if (!user) return;
    const allProgress = getAllProgress();
    const key = progressKey(user.id, wordId);
    const existing = allProgress[key];
    const newCorrect = (existing?.correct_count ?? 0) + (correct ? 1 : 0);
    const newWrong = (existing?.wrong_count ?? 0) + (correct ? 0 : 1);
    const newStatus: WordProgress['status'] =
      newCorrect >= 3 ? 'mastered' : newCorrect >= 1 ? 'learning' : 'new';
    const updated: WordProgress = {
      status: newStatus,
      correct_count: newCorrect,
      wrong_count: newWrong,
      last_reviewed: new Date().toISOString(),
    };
    allProgress[key] = updated;
    saveAllProgress(allProgress);

    setWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, progress: updated } : w)),
    );
  };

  const saveSession = async (_level: string, _reviewed: number, _correct: number) => {
    // Sessions are not persisted in static mode; progress is saved per-word above.
  };

  return { words, loading, recordAnswer, saveSession, refetch: fetchWords };
}
