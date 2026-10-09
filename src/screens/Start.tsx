import { TYPES } from '../data/types';
import PaletteSwatches from '../components/PaletteSwatches';

export default function Start({ notice, onStart }: { notice: string | null; onStart: () => void }) {
  return (
    <main className="screen start">
      <p className="eyebrow">질문 4개, 약 1분</p>
      <h1>
        내 성격을
        <br />
        색으로 보면?
      </h1>
      <p className="lead">네 가지 질문에 답하면 나에게 어울리는 4색 팔레트가 나와요.</p>

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      <div className="preview" aria-hidden="true">
        <PaletteSwatches palette={TYPES.INFJ.palette} />
      </div>

      <button type="button" className="primary" onClick={onStart}>
        테스트 시작하기
      </button>
      <p className="fine">공식 성격 검사가 아닌 재미용 테스트예요. 답은 저장되지 않아요.</p>
    </main>
  );
}
