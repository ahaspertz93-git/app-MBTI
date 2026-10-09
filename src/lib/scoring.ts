import { QUESTIONS, type Answer } from '../data/questions';
import { TYPES, type TypeKey } from '../data/types';

/** 답 4개를 4글자 유형 키로 바꾼다. A는 축의 앞 글자, B는 뒤 글자. */
export function computeType(answers: readonly Answer[]): TypeKey {
  if (answers.length !== QUESTIONS.length) {
    throw new Error(`답변은 ${QUESTIONS.length}개여야 합니다 (받은 개수: ${answers.length})`);
  }
  const key = answers.map((a, i) => QUESTIONS[i].axis[a === 'A' ? 0 : 1]).join('');
  if (!isTypeKey(key)) throw new Error(`알 수 없는 유형: ${key}`);
  return key;
}

/** 대소문자를 구분하지 않고 16개 유형 중 하나인지 확인한다. */
export function isTypeKey(value: string): value is TypeKey {
  return Object.prototype.hasOwnProperty.call(TYPES, value);
}

/** URL 등에서 온 문자열을 유형 키로 정규화한다. 없으면 null. */
export function parseTypeKey(value: string | undefined | null): TypeKey | null {
  const upper = (value ?? '').toUpperCase();
  return isTypeKey(upper) ? upper : null;
}
