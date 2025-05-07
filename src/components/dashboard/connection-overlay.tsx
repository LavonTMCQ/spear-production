"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ConnectionOverlayProps {
  deviceName: string;
  onConnectionSuccess?: () => void;
  onRetry?: () => void;
}

export function ConnectionOverlay({ deviceName, onConnectionSuccess, onRetry }: ConnectionOverlayProps) {
  const [stage, setStage] = useState<'initializing' | 'connecting' | 'finalizing' | 'waiting' | 'error'>('initializing');
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [showHomeScreenMessage, setShowHomeScreenMessage] = useState(false);

  // Simulate connection progress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        // Gradually increase progress
        const increment = Math.floor(Math.random() * 5) + 1; // Random increment between 1-5
        const newProgress = Math.min(progress + increment, 100);
        setProgress(newProgress);

        // Update stages based on progress
        if (newProgress > 30 && stage === 'initializing') {
          setStage('connecting');
        } else if (newProgress > 75 && stage === 'connecting') {
          setStage('finalizing');
        } else if (newProgress === 100) {
          // When we reach 100%, move to waiting stage
          setStage('waiting');
          setConnectionAttempts(prev => prev + 1);

          // After a delay, show the home screen message
          setTimeout(() => {
            setShowHomeScreenMessage(true);
          }, 5000);

          // In a real implementation, we would check if the device is actually connected
          // For now, we'll simulate a connection failure after 3 attempts
          if (connectionAttempts >= 2) {
            setTimeout(() => {
              setStage('error');
            }, 8000);
          }
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [progress, stage, connectionAttempts]);

  // Animate loading dots
  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsTimer);
  }, []);

  // Handle retry
  const handleRetry = () => {
    setProgress(0);
    setStage('initializing');
    setShowHomeScreenMessage(false);
    onRetry?.();
  };

  // Get status message based on current stage
  const getStatusMessage = () => {
    switch (stage) {
      case 'initializing':
        return `Initializing secure connection${dots}`;
      case 'connecting':
        return `Connecting to ${deviceName}${dots}`;
      case 'finalizing':
        return `Establishing remote session${dots}`;
      case 'waiting':
        return showHomeScreenMessage
          ? `Waiting for device home screen${dots}`
          : `Verifying connection${dots}`;
      case 'error':
        return 'Connection issue detected';
      default:
        return 'Connecting...';
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md px-8 py-10 flex flex-col items-center">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SPEAR
          </div>
        </motion.div>

        {/* Device name */}
        <h3 className="text-xl font-medium mb-6">{deviceName}</h3>

        {/* Progress bar - only show when not in error state */}
        {stage !== 'error' ? (
          <div className="w-full h-2 bg-slate-700 rounded-full mb-4 overflow-hidden">
            <motion.div
              className={`h-full ${stage === 'waiting' && showHomeScreenMessage ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ) : (
          <div className="w-full h-2 bg-slate-700 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-red-500 w-full" />
          </div>
        )}

        {/* Status message */}
        <p className={`text-sm font-medium h-6 ${stage === 'error' ? 'text-red-400' : 'text-slate-300'}`}>
          {getStatusMessage()}
        </p>

        {/* Error message and retry button */}
        {stage === 'error' && (
          <div className="mt-6 space-y-4 w-full">
            <p className="text-slate-300 text-sm text-center">
              We couldn't establish a connection to the device home screen. This could be because:
            </p>
            <ul className="text-slate-400 text-xs space-y-1 list-disc pl-5">
              <li>The device is powered off</li>
              <li>The device has no internet connection</li>
              <li>The remote access service is not running</li>
            </ul>
            <Button
              onClick={handleRetry}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Retry Connection
            </Button>
          </div>
        )}

        {/* Waiting for home screen message */}
        {stage === 'waiting' && showHomeScreenMessage && !onConnectionSuccess && (
          <p className="text-amber-400 text-xs mt-4 text-center">
            Still waiting for device home screen to appear...
          </p>
        )}

        {/* Security message - only show when not in error state */}
        {stage !== 'error' && (
          <p className="text-slate-400 text-xs mt-8 text-center">
            Establishing end-to-end encrypted connection for secure remote access
          </p>
        )}
      </div>
    </div>
  );
}
