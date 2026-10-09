import { useEffect } from 'react';
import { QUESTIONS, type Answer } from '../data/questions';
import ProgressBar from '../components/ProgressBar';

interface Props {
  answers: Answer[];
  setAnswers: (a: Answer[]) => void;
  onDone: () => void;
  onExit: () => void;
}

export default function Quiz({ answers, setAnswers, onDone, onExit }: Props) {
  const last = QUESTIONS.length - 1;

  // 브라우저 뒤로 가기로 로딩에서 돌아왔을 때 마지막 질문부터 다시 답하게 한다.
  useEffect(() => {
    if (answers.length > last) setAnswers(answers.slice(0, last));
  }, [answers, last, setAnswers]);

  const index = Math.min(answers.length, last);
  const q = QUESTIONS[index];

  const choose = (a: Answer) => {
    const next = [...answers.slice(0, index), a];
    setAnswers(next);
    if (next.length === QUESTIONS.length) onDone();
  };

  return (
    <main className="screen quiz">
      <header className="quiz-head">
        <button type="button" className="ghost" onClick={index > 0 ? () => setAnswers(answers.slice(0, index - 1)) : onExit}>
          {index > 0 ? '← 이전' : '← 처음으로'}
        </button>
        <ProgressBar current={index + 1} total={QUESTIONS.length} />
      </header>

      <p className="eyebrow">Q{index + 1}</p>
      <h2 className="question">{q.text}</h2>

      <div className="options">
        <button type="button" className="option" onClick={() => choose('A')}>
          <span className="option-mark">A</span>
          {q.options[0]}
        </button>
        <button type="button" className="option" onClick={() => choose('B')}>
          <span className="option-mark">B</span>
          {q.options[1]}
        </button>
      </div>
    </main>
  );
}
