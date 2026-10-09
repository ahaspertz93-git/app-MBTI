import { useEffect, useState } from 'react';
import type { Answer } from './data/questions';
import { navigate, usePath } from './lib/router';
import { parseTypeKey } from './lib/scoring';
import Start from './screens/Start';
import Quiz from './screens/Quiz';
import Loading from './screens/Loading';
import Result from './screens/Result';

export default function App() {
  const path = usePath();
  const [answers, setAnswers] = useState<Answer[]>([]);
  // 이번 접속에서 직접 테스트를 끝내고 결과에 도착했는지 (false면 공유 링크로 들어온 것)
  const [finished, setFinished] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const restart = () => {
    setAnswers([]);
    setFinished(false);
    setNotice(null);
    navigate('/quiz');
  };

  const resultMatch = path.match(/^\/result\/([^/]+)$/);
  const resultKey = resultMatch ? parseTypeKey(decodeURIComponent(resultMatch[1])) : null;
  const badResult = Boolean(resultMatch) && !resultKey;

  // 16개 유형에 없는 결과 URL은 시작 화면으로 보낸다.
  useEffect(() => {
    if (badResult) {
      setNotice('찾을 수 없는 결과 주소예요. 처음부터 테스트해 볼까요?');
      navigate('/', { replace: true });
    }
  }, [badResult]);

  if (resultKey) {
    return (
      <Result
        typeKey={resultKey}
        fromQuiz={finished}
        onStart={restart}
        onGoStart={() => {
          setNotice(null);
          navigate('/');
        }}
      />
    );
  }
  if (path === '/quiz') {
    return (
      <Quiz
        answers={answers}
        setAnswers={setAnswers}
        onDone={() => navigate('/loading', { replace: true })}
        onExit={() => navigate('/')}
      />
    );
  }
  if (path === '/loading') {
    return (
      <Loading
        answers={answers}
        onReady={(key) => {
          setFinished(true);
          navigate(`/result/${key.toLowerCase()}`, { replace: true });
        }}
        onInvalid={() => navigate('/', { replace: true })}
      />
    );
  }
  return <Start notice={notice} onStart={restart} />;
}
