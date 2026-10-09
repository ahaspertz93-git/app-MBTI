export type TypeKey =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

/** 주색 → 보조색 → 포인트색 → 배경색 순서 고정 (PRD 5장). */
export type Palette = readonly [string, string, string, string];

export const COLOR_ROLES = ['주색', '보조색', '포인트색', '배경색'] as const;

export interface PersonalityType {
  key: TypeKey;
  name: string;
  group: string;
  palette: Palette;
  desc: string;
}

// PRD 5장 팔레트 초안. 디자이너 검수 전 값이다.
export const TYPES: Record<TypeKey, PersonalityType> = {
  INTJ: { key: 'INTJ', name: '전략가', group: '보라', palette: ['#2E1A47', '#5B3E96', '#9D7BD8', '#E8DFF5'], desc: '조용히 큰 그림을 설계하는 깊은 밤의 전략가' },
  INTP: { key: 'INTP', name: '논리술사', group: '보라', palette: ['#1F2A44', '#4A5FA5', '#8FA8E8', '#DCE6F7'], desc: '끝없는 질문으로 원리를 파고드는 사색가' },
  ENTJ: { key: 'ENTJ', name: '통솔자', group: '보라', palette: ['#240B36', '#6A1B9A', '#C2185B', '#F3E5F5'], desc: '목표를 향해 판을 짜고 밀어붙이는 리더' },
  ENTP: { key: 'ENTP', name: '변론가', group: '보라', palette: ['#4A148C', '#7E57C2', '#FFB300', '#EDE7F6'], desc: '아이디어로 판을 흔드는 재기발랄한 토론가' },
  INFJ: { key: 'INFJ', name: '옹호자', group: '초록', palette: ['#1B4332', '#2D6A4F', '#74C69D', '#D8F3DC'], desc: '고요한 숲처럼 사람의 마음을 깊이 헤아리는 사람' },
  INFP: { key: 'INFP', name: '중재자', group: '초록', palette: ['#55705A', '#A7C4A0', '#F2CC8F', '#FDF6E3'], desc: '자기만의 부드러운 세계를 지키는 이상주의자' },
  ENFJ: { key: 'ENFJ', name: '선도자', group: '초록', palette: ['#1B5E20', '#43A047', '#FFD54F', '#F1F8E9'], desc: '함께 성장하는 길을 밝혀 주는 따뜻한 리더' },
  ENFP: { key: 'ENFP', name: '활동가', group: '초록', palette: ['#2E7D32', '#9CCC65', '#FF8A65', '#FFF8E1'], desc: '가능성에 불을 붙이는 에너지 넘치는 탐험가' },
  ISTJ: { key: 'ISTJ', name: '현실주의자', group: '파랑', palette: ['#14213D', '#274C77', '#6096BA', '#E7ECEF'], desc: '약속과 원칙으로 단단히 쌓아 가는 신뢰의 사람' },
  ISFJ: { key: 'ISFJ', name: '수호자', group: '파랑', palette: ['#3D5A80', '#98C1D9', '#C9ADA7', '#E0FBFC'], desc: '곁에서 조용히 챙겨 주는 다정한 수호자' },
  ESTJ: { key: 'ESTJ', name: '경영자', group: '파랑', palette: ['#0B2545', '#134074', '#8DA9C4', '#EEF4ED'], desc: '체계를 세우고 결과로 보여 주는 실행가' },
  ESFJ: { key: 'ESFJ', name: '집정관', group: '파랑', palette: ['#1D4E89', '#00B2CA', '#7DCFB6', '#FDEBD3'], desc: '모두가 편안하도록 분위기를 살피는 조율가' },
  ISTP: { key: 'ISTP', name: '장인', group: '주황·빨강', palette: ['#33261D', '#A0522D', '#D9A441', '#F2E8CF'], desc: '손과 머리로 문제를 뚝딱 해결하는 장인' },
  ISFP: { key: 'ISFP', name: '모험가', group: '주황·빨강', palette: ['#606C38', '#BC6C25', '#DDA15E', '#FEFAE0'], desc: '감각으로 순간의 아름다움을 담아내는 예술가' },
  ESTP: { key: 'ESTP', name: '사업가', group: '주황·빨강', palette: ['#7F1D1D', '#D62828', '#F77F00', '#FFF1D0'], desc: '망설임 없이 현장에 뛰어드는 행동파' },
  ESFP: { key: 'ESFP', name: '연예인', group: '주황·빨강', palette: ['#D0176A', '#FF9F1C', '#FFD60A', '#FFE9F1'], desc: '어디서나 분위기를 밝히는 무대의 주인공' },
};

export const TYPE_KEYS = Object.keys(TYPES) as TypeKey[];
