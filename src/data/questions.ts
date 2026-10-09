export type Answer = 'A' | 'B';

export interface Question {
  /** 이 질문이 담당하는 MBTI 축. A는 앞 글자, B는 뒤 글자로 매핑된다. */
  axis: readonly [string, string];
  axisLabel: string;
  text: string;
  options: readonly [string, string];
}

// PRD 4장 질문 초안. 문구는 자유롭게 바꿔도 되지만 axis 순서(A=앞, B=뒤)는 유지할 것.
export const QUESTIONS: readonly Question[] = [
  {
    axis: ['E', 'I'],
    axisLabel: '에너지',
    text: '주말 약속이 갑자기 취소됐다. 가장 먼저 드는 마음은?',
    options: ['다른 친구를 불러서 뭐라도 하자', '잘됐다, 집에서 쉬자'],
  },
  {
    axis: ['S', 'N'],
    axisLabel: '인식',
    text: '새 프로젝트를 시작할 때 나는?',
    options: ['구체적인 사례와 방법부터 확인한다', '큰 그림과 가능성부터 그려 본다'],
  },
  {
    axis: ['T', 'F'],
    axisLabel: '판단',
    text: '친구가 고민을 털어놓을 때 먼저 하는 말은?',
    options: ['원인을 짚고 해결책을 말해 준다', '먼저 공감하며 마음을 읽어 준다'],
  },
  {
    axis: ['J', 'P'],
    axisLabel: '생활',
    text: '여행 전날 짐을 싸는 방식은?',
    options: ['목록을 만들어 미리 챙긴다', '당일에 생각나는 대로 챙긴다'],
  },
];
