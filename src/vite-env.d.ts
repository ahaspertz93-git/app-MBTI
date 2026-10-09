/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 카카오 디벨로퍼스 > 내 애플리케이션 > 앱 키 > JavaScript 키 */
  readonly VITE_KAKAO_JS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 카카오 JavaScript SDK 중 이 앱이 쓰는 부분만 선언한다.
interface KakaoLink {
  mobileWebUrl?: string;
  webUrl?: string;
}

interface KakaoButton {
  title: string;
  link: KakaoLink;
}

type KakaoShareSettings =
  | {
      objectType: 'feed';
      content: {
        title: string;
        description?: string;
        imageUrl: string;
        imageWidth?: number;
        imageHeight?: number;
        link: KakaoLink;
      };
      buttons?: KakaoButton[];
    }
  | { objectType: 'text'; text: string; link: KakaoLink; buttons?: KakaoButton[] };

interface KakaoSDK {
  init(appKey: string): void;
  isInitialized(): boolean;
  Share: {
    sendDefault(settings: KakaoShareSettings): void;
    uploadImage(settings: { file: File[] | FileList }): Promise<{ infos: { original: { url: string } } }>;
  };
}

interface Window {
  Kakao?: KakaoSDK;
}
