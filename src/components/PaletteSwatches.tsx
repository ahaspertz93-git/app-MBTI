import { COLOR_ROLES, type Palette } from '../data/types';
import { readableOn } from '../lib/color';

interface Props {
  palette: Palette;
  /** 지정하면 각 색을 눌러 HEX를 복사할 수 있다. */
  onCopy?: (hex: string) => void;
}

export default function PaletteSwatches({ palette, onCopy }: Props) {
  return (
    <ul className="swatches">
      {palette.map((hex, i) => {
        const inner = (
          <>
            <span className="swatch-role">{COLOR_ROLES[i]}</span>
            <span className="swatch-hex">{hex.toUpperCase()}</span>
          </>
        );
        const style = { background: hex, color: readableOn(hex) };
        return (
          <li key={hex}>
            {onCopy ? (
              <button type="button" className="swatch" style={style} onClick={() => onCopy(hex)} aria-label={`${COLOR_ROLES[i]} ${hex} 복사`}>
                {inner}
              </button>
            ) : (
              <div className="swatch" style={style}>
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
