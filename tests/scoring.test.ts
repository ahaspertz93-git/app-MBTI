import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeType, isTypeKey, parseTypeKey } from '../src/lib/scoring.ts';
import { TYPES, TYPE_KEYS } from '../src/data/types.ts';
import type { Answer } from '../src/data/questions.ts';
import { contrast } from '../src/lib/color.ts';

test('16가지 답 조합이 모두 서로 다른 유형으로 매핑된다', () => {
  const seen = new Set<string>();
  for (let n = 0; n < 16; n++) {
    const answers = [3, 2, 1, 0].map((bit) => ((n >> bit) & 1 ? 'B' : 'A')) as Answer[];
    const key = computeType(answers);
    assert.ok(isTypeKey(key));
    seen.add(key);
  }
  assert.equal(seen.size, 16);
});

test('A는 앞 글자, B는 뒤 글자', () => {
  assert.equal(computeType(['A', 'A', 'A', 'A']), 'ESTJ');
  assert.equal(computeType(['B', 'B', 'B', 'B']), 'INFP');
  assert.equal(computeType(['A', 'B', 'B', 'B']), 'ENFP');
  assert.equal(computeType(['B', 'B', 'A', 'A']), 'INTJ');
});

test('답 개수가 4개가 아니면 오류', () => {
  assert.throws(() => computeType(['A', 'B', 'A']));
  assert.throws(() => computeType(['A', 'B', 'A', 'B', 'A']));
});

test('URL 값 정규화: 대소문자 무시, 잘못된 값은 null', () => {
  assert.equal(parseTypeKey('infp'), 'INFP');
  assert.equal(parseTypeKey('INFP'), 'INFP');
  assert.equal(parseTypeKey('xxxx'), null);
  assert.equal(parseTypeKey(''), null);
  assert.equal(parseTypeKey(undefined), null);
  assert.equal(parseTypeKey('constructor'), null);
});

test('16개 유형 모두 4색 HEX를 가진다', () => {
  assert.equal(TYPE_KEYS.length, 16);
  for (const key of TYPE_KEYS) {
    const t = TYPES[key];
    assert.equal(t.key, key);
    assert.equal(t.palette.length, 4);
    for (const hex of t.palette) assert.match(hex, /^#[0-9A-F]{6}$/i, `${key}: ${hex}`);
    assert.equal(new Set(t.palette).size, 4, `${key}: 중복 색`);
  }
});

test('접근성 검수 리포트: 주색과 배경색 대비 4.5:1 미만 유형 ', () => {
  const low = TYPE_KEYS.map((k) => ({ k, c: contrast(TYPES[k].palette[0], TYPES[k].palette[3]) })).filter((x) => x.c < 4.5);
  console.log('대비 4.5:1 미만:', low.map((x) => `${x.k}(${x.c.toFixed(2)})`).join(', ') || '없음');
  assert.equal(low.length, 0, '대비 미달 유형: ' + low.map((x) => x.k).join(', '));
});
