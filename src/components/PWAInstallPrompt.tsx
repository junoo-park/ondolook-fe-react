import { useEffect, useState } from 'react';
import './PWAInstallPrompt.css';
import { useSystem } from '../store/useSystem';
import { useLocation } from 'react-router-dom';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface Navigator {
    standalone?: boolean; // Safari-specific property
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { isPC } = useSystem();
  const location = useLocation();

  useEffect(() => {
    // PC 브라우저에서는 프롬프트 표시하지 않음
    if (isPC) {
      setShowPrompt(false);
      return;
    }

    // 홈페이지가 아니면 프롬프트 표시하지 않음
    if (location.pathname !== '/home') {
      setShowPrompt(false);
      return;
    }

    // PWA로 실행 중인지 확인
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://');

    if (isPWA) {
      setShowPrompt(false);
      return; // PWA로 실행 중이면 프롬프트 표시하지 않음
    }

    // 모바일 기기 체크
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    // 인앱 브라우저 체크
    const isInApp = /KAKAOTALK|NAVER|Line|FBAN|FBAV/i.test(navigator.userAgent);

    // 모바일이 아니거나 인앱 브라우저면 프롬프트 표시하지 않음
    if (!isMobile || isInApp) {
      setShowPrompt(false);
      return;
    }

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS에서는 Safari를 사용하고 PWA가 아닐 때만 프롬프트 표시
    if (isIOSDevice && !isPWA) {
      setShowPrompt(true);
    }

    // display-mode 변경 감지
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setShowPrompt(false); // PWA로 전환되면 프롬프트 숨김
      }
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [isPC, location.pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // 5분 후에 다시 표시하기 위해 localStorage에 시간 저장
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());

    // 5분 후에 다시 표시
    setTimeout(
      () => {
        if (location.pathname === '/home') {
          setShowPrompt(true);
        }
      },
      5 * 60 * 1000
    ); // 5분
  };

  // 마지막으로 거절한 시간 확인
  useEffect(() => {
    const lastDismissed = localStorage.getItem('pwaPromptDismissed');
    if (lastDismissed) {
      const timeSinceDismissed = Date.now() - parseInt(lastDismissed);
      if (timeSinceDismissed < 5 * 60 * 1000) {
        // 5분 이내면 표시하지 않음
        setShowPrompt(false);
      }
    }
  }, [location.pathname]);

  if (!showPrompt) return null;

  return (
    <div className="pwa-prompt-container">
      {isIOS ? (
        <div>
          <h3 className="pwa-prompt-title">Ondolook 앱 설치하기</h3>
          <p className="pwa-prompt-description">
            Safari 브라우저에서 아래 순서대로 진행해주세요:
            <br />
            1. 하단 중앙의{' '}
            <span className="icon-description">
              공유 아이콘 <span style={{ fontSize: '1.2em' }}>⎋</span>
            </span>{' '}
            을 탭하세요
            <br />
            2. 스크롤을 내려 <span className="icon-description">&quot;홈 화면에 추가&quot;</span> 를
            탭하세요
            <br />
            3. 상단의 &quot;추가&quot;를 탭하면 설치가 완료됩니다
          </p>
          <div className="pwa-prompt-note">
            * 설치 후에는 홈 화면에서 Ondolook 앱 아이콘을 탭하여 실행할 수 있습니다
          </div>
          <button className="pwa-prompt-close-button" onClick={handleDismiss}>
            나중에 하기
          </button>
        </div>
      ) : (
        <div>
          <h3 className="pwa-prompt-title">Ondolook 앱 설치하기</h3>
          <p className="pwa-prompt-description">
            더 나은 사용자 경험을 위해 Ondolook 앱을 설치해보세요!
          </p>
          <div className="pwa-prompt-buttons">
            <button className="pwa-prompt-install-button" onClick={handleInstallClick}>
              설치하기
            </button>
            <button className="pwa-prompt-close-button" onClick={handleDismiss}>
              나중에 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAInstallPrompt;
