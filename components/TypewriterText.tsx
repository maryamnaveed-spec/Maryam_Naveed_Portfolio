'use client';

import { useEffect, useState } from 'react';

export default function TypewriterText({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseTime = 1600,
  loop = true,
  className = ''
}: {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  loop?: boolean;
  className?: string;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (phase === 'typing') {
      if (text.length < currentWord.length) {
        const t = setTimeout(() => setText(currentWord.slice(0, text.length + 1)), typingSpeed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('pausing'), pauseTime);
      return () => clearTimeout(t);
    }

    if (phase === 'pausing') {
      // If there's only one word and no loop, stop here.
      if (words.length === 1 && !loop) return;
      const t = setTimeout(() => setPhase('deleting'), pauseTime);
      return () => clearTimeout(t);
    }

    if (phase === 'deleting') {
      if (text.length > 0) {
        const t = setTimeout(() => setText(currentWord.slice(0, text.length - 1)), deletingSpeed);
        return () => clearTimeout(t);
      }
      const nextIndex = (wordIndex + 1) % words.length;
      setWordIndex(nextIndex);
      setPhase('typing');
    }
  }, [text, phase, wordIndex, words, typingSpeed, deletingSpeed, pauseTime, loop]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle animate-pulse" />
    </span>
  );
}
