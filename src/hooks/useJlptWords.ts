import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface JlptWord {
  id: string;
  level: string;
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  part_of_speech: string;
  example_jp: string | null;
  example_reading: string | null;
  example_meaning: string | null;
}

export interface WordProgress {
  status: 'new' | 'learning' | 'mastered';
  correct_count: number;
  wrong_count: number;
  last_reviewed: string | null;
}

export type WordWithProgress = JlptWord & { progress?: WordProgress };

export function useJlptWords(level: string) {
  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWords = useCallback(async () => {
    setLoading(true);
    const { data: wordData, error } = await supabase
      .from('jlpt_words')
      .select('*')
      .eq('level', level)
      .order('word');

    if (error || !wordData) {
      setWords([]);
      setLoading(false);
      return;
    }

    let progressMap: Record<string, WordProgress> = {};
    if (user) {
      const { data: progressData } = await supabase
        .from('user_word_progress')
        .select('word_id, status, correct_count, wrong_count, last_reviewed')
        .in('word_id', wordData.map((w) => w.id));

      if (progressData) {
        progressMap = Object.fromEntries(
          progressData.map((p) => [p.word_id, {
            status: p.status,
            correct_count: p.correct_count,
            wrong_count: p.wrong_count,
            last_reviewed: p.last_reviewed,
          }])
        );
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
    const existing = words.find((w) => w.id === wordId)?.progress;
    const newCorrect = (existing?.correct_count ?? 0) + (correct ? 1 : 0);
    const newWrong = (existing?.wrong_count ?? 0) + (correct ? 0 : 1);
    const newStatus = newCorrect >= 3 ? 'mastered' : newCorrect >= 1 ? 'learning' : 'new';

    await supabase
      .from('user_word_progress')
      .upsert({
        user_id: user.id,
        word_id: wordId,
        status: newStatus,
        correct_count: newCorrect,
        wrong_count: newWrong,
        last_reviewed: new Date().toISOString(),
      }, { onConflict: 'user_id,word_id' });

    setWords((prev) =>
      prev.map((w) =>
        w.id === wordId
          ? { ...w, progress: { status: newStatus, correct_count: newCorrect, wrong_count: newWrong, last_reviewed: new Date().toISOString() } }
          : w
      )
    );
  };

  const saveSession = async (level: string, reviewed: number, correct: number) => {
    if (!user) return;
    await supabase.from('study_sessions').insert({
      user_id: user.id,
      level,
      words_reviewed: reviewed,
      correct_count: correct,
    });
  };

  return { words, loading, recordAnswer, saveSession, refetch: fetchWords };
}
