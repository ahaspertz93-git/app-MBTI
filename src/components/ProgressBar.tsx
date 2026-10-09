export default function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current} aria-label="진행 상황">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <span className="progress-label">
        {current}/{total}
      </span>
    </div>
  );
}
