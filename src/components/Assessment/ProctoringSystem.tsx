import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, Monitor, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProctoringSystemProps {
  isActive: boolean;
  settings: {
    webcam: boolean;
    screenShare: boolean;
    lockdown: boolean;
    faceDetection: boolean;
  };
  onViolation: (type: string, severity: 'low' | 'medium' | 'high') => void;
}

const ProctoringSystem: React.FC<ProctoringSystemProps> = ({
  isActive,
  settings,
  onViolation
}) => {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [violations, setViolations] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isActive) {
      initializeProctoring();
      setupEventListeners();
    }

    return () => {
      cleanup();
    };
  }, [isActive, settings]);

  const initializeProctoring = async () => {
    try {
      // Initialize webcam
      if (settings.webcam) {
        setWebcamEnabled(true);
      }

      // Initialize screen sharing
      if (settings.screenShare) {
        await startScreenShare();
      }

      // Enable lockdown mode
      if (settings.lockdown) {
        enableLockdownMode();
      }

      toast.success('Proctoring system activated');
    } catch (error) {
      console.error('Failed to initialize proctoring:', error);
      toast.error('Failed to initialize proctoring system');
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      
      screenStreamRef.current = stream;
      setScreenShareEnabled(true);

      // Monitor for screen share end
      stream.getVideoTracks()[0].onended = () => {
        handleViolation('screen_share_stopped', 'high');
        setScreenShareEnabled(false);
      };
    } catch (error) {
      console.error('Screen share failed:', error);
      handleViolation('screen_share_denied', 'high');
    }
  };

  const enableLockdownMode = () => {
    // Prevent right-click
    document.addEventListener('contextmenu', preventDefaultAction);
    
    // Prevent key combinations
    document.addEventListener('keydown', handleKeyDown);
    
    // Monitor focus changes
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const setupEventListeners = () => {
    // Monitor fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Monitor visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Monitor mouse movements (for suspicious behavior)
    document.addEventListener('mousemove', handleMouseMove);
  };

  const preventDefaultAction = (e: Event) => {
    e.preventDefault();
    handleViolation('right_click_attempt', 'low');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent common shortcuts
    const forbiddenKeys = [
      'F12', // Developer tools
      'F11', // Fullscreen toggle
    ];

    const forbiddenCombinations = [
      { ctrl: true, shift: true, key: 'I' }, // Developer tools
      { ctrl: true, shift: true, key: 'J' }, // Console
      { ctrl: true, shift: true, key: 'C' }, // Inspector
      { ctrl: true, key: 'U' }, // View source
      { alt: true, key: 'Tab' }, // Alt+Tab
      { ctrl: true, key: 'Tab' }, // Ctrl+Tab
    ];

    if (forbiddenKeys.includes(e.key)) {
      e.preventDefault();
      handleViolation('forbidden_key', 'medium');
      return;
    }

    for (const combo of forbiddenCombinations) {
      if (
        (!combo.ctrl || e.ctrlKey) &&
        (!combo.shift || e.shiftKey) &&
        (!combo.alt || e.altKey) &&
        e.key === combo.key
      ) {
        e.preventDefault();
        handleViolation('forbidden_combination', 'medium');
        return;
      }
    }
  };

  const handleWindowBlur = () => {
    handleViolation('window_focus_lost', 'high');
  };

  const handleWindowFocus = () => {
    // Log when focus is regained
    console.log('Window focus regained');
  };

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = !!document.fullscreenElement;
    setIsFullscreen(isCurrentlyFullscreen);
    
    if (!isCurrentlyFullscreen && settings.lockdown) {
      handleViolation('fullscreen_exit', 'high');
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      handleViolation('tab_switch', 'high');
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Detect if mouse leaves the window area
    if (e.clientX < 0 || e.clientY < 0 || 
        e.clientX > window.innerWidth || e.clientY > window.innerHeight) {
      handleViolation('mouse_left_window', 'medium');
    }
  };

  const handleViolation = (type: string, severity: 'low' | 'medium' | 'high') => {
    const violation = {
      id: Date.now().toString(),
      type,
      severity,
      timestamp: new Date().toISOString(),
      screenshot: webcamEnabled ? captureScreenshot() : null
    };

    setViolations(prev => [...prev, violation]);
    onViolation(type, severity);

    // Show warning based on severity
    const messages = {
      low: 'Minor violation detected',
      medium: 'Suspicious activity detected',
      high: 'Serious violation detected - this will be reported'
    };

    const toastTypes = {
      low: toast,
      medium: toast.error,
      high: toast.error
    };

    toastTypes[severity](messages[severity]);
  };

  const captureScreenshot = () => {
    if (webcamRef.current) {
      return webcamRef.current.getScreenshot();
    }
    return null;
  };

  const cleanup = () => {
    // Remove event listeners
    document.removeEventListener('contextmenu', preventDefaultAction);
    document.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('blur', handleWindowBlur);
    window.removeEventListener('focus', handleWindowFocus);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.removeEventListener('mousemove', handleMouseMove);

    // Stop screen sharing
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {/* Proctoring Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-64"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="font-semibold text-gray-900 dark:text-white">Proctoring Active</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Webcam</span>
            <div className="flex items-center space-x-1">
              {webcamEnabled ? (
                <Eye className="h-4 w-4 text-green-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <span className={webcamEnabled ? 'text-green-500' : 'text-gray-400'}>
                {webcamEnabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Screen Share</span>
            <div className="flex items-center space-x-1">
              <Monitor className="h-4 w-4 text-green-500" />
              <span className={screenShareEnabled ? 'text-green-500' : 'text-gray-400'}>
                {screenShareEnabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Lockdown</span>
            <span className={isFullscreen ? 'text-green-500' : 'text-red-500'}>
              {isFullscreen ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {violations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {violations.length} Violation{violations.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {violations.slice(-3).map((violation) => (
                <div
                  key={violation.id}
                  className={`text-xs px-2 py-1 rounded ${getSeverityColor(violation.severity)}`}
                >
                  {violation.type.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Webcam Preview */}
      {webcamEnabled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2"
        >
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              width={160}
              height={120}
              screenshotFormat="image/jpeg"
              className="rounded"
            />
            <div className="absolute top-1 right-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
            Webcam Monitor
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProctoringSystem;