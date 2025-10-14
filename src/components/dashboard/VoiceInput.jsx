/**
 * Voice Input Component
 * Records voice using Web Speech API and displays transcription
 */

import { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useToast } from '../../contexts/ToastContext';

const VoiceInput = () => {
  const {
    isRecording,
    setIsRecording,
    transcription,
    setTranscription,
    setAiFormattedData,
  } = useDashboard();

  const { showToast } = useToast();

  const [isSupported, setIsSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  // Check if Web Speech API is supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);

      // Initialize speech recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscription(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);

        if (event.error === 'not-allowed') {
          showToast('Microphone access denied. Please enable microphone permissions.', 'error');
        } else if (event.error === 'no-speech') {
          showToast('No speech detected. Please try again.', 'warning');
        } else {
          showToast(`Voice input error: ${event.error}`, 'error');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setIsRecording, setTranscription, showToast]);

  const handleStartRecording = () => {
    if (!isSupported) {
      showToast('Voice input is not supported in your browser. Please use Chrome or Edge.', 'error');
      return;
    }

    try {
      // Clear previous transcription
      setTranscription('');
      setAiFormattedData(null);

      // Start recording
      recognitionRef.current?.start();
      setIsRecording(true);
      showToast('Listening... Speak your trading call', 'info');
    } catch (error) {
      console.error('Failed to start recording:', error);
      showToast('Failed to start voice input', 'error');
    }
  };

  const handleStopRecording = () => {
    try {
      recognitionRef.current?.stop();
      setIsRecording(false);

      if (transcription.trim()) {
        showToast('Recording stopped. You can now format with AI or edit manually.', 'success');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      showToast('Failed to stop voice input', 'error');
    }
  };

  const handleFormatWithAI = async () => {
    if (!transcription.trim()) {
      showToast('Please record something first', 'warning');
      return;
    }

    try {
      setIsProcessing(true);

      // TODO: Call Claude API to format the transcription
      // For now, we'll create a stub that extracts basic information
      // This will be implemented in the next phase

      // Stub: Parse basic keywords from transcription
      const text = transcription.toLowerCase();

      // Extract stock symbol (look for common patterns like "RELIANCE", "TCS", etc.)
      const stockMatch = text.match(/\b([A-Z]{2,10}|reliance|tcs|infy|hdfc|icici)\b/i);
      const symbol = stockMatch ? stockMatch[1].toUpperCase() : '';

      // Extract action (buy/sell)
      const action = text.includes('buy') ? 'BUY' : text.includes('sell') ? 'SELL' : '';

      // Extract prices (look for numbers)
      const numbers = text.match(/\d+(\.\d+)?/g) || [];
      const prices = numbers.map(n => parseFloat(n));

      // Stub formatted data
      const formattedData = {
        stock_symbol: symbol,
        action: action,
        entry_price: prices[0] || '',
        target_price: prices[1] || '',
        stop_loss: prices[2] || '',
        strategy_type: 'swing', // Default
        notes: transcription,
      };

      setAiFormattedData(formattedData);
      showToast('AI formatting complete! Review and edit as needed.', 'success');

      // TODO: In production, this would call:
      // const response = await apiClient.post('/api/ai/format-call', { transcription });
      // setAiFormattedData(response.data);

    } catch (error) {
      console.error('AI formatting error:', error);
      showToast('AI formatting failed. Please use manual input.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Microphone Button */}
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={!isSupported || isProcessing}
        className={`
          relative w-32 h-32 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg
          ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 scale-110'
              : 'bg-primary hover:bg-primary-dark'
          }
          ${!isSupported || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {/* Pulsing animation when recording */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
            <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-75" />
          </>
        )}

        {/* Microphone Icon */}
        <svg
          className="w-16 h-16 text-white relative z-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>

      {/* Status Text */}
      <p className="mt-6 text-center text-gray-600">
        {!isSupported ? (
          <span className="text-red-500 font-semibold">
            Voice input not supported in this browser
          </span>
        ) : isRecording ? (
          <span className="text-red-500 font-semibold animate-pulse">
            Recording... Tap to stop
          </span>
        ) : (
          <span className="font-medium">
            Tap to speak your trading call
          </span>
        )}
      </p>

      {/* Browser Compatibility Note */}
      {!isSupported && (
        <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
          Please use Chrome, Edge, or Safari for voice input functionality
        </p>
      )}

      {/* Transcription Preview */}
      {transcription && !isRecording && (
        <div className="mt-8 w-full max-w-2xl">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Transcription</h4>
              <button
                onClick={() => {
                  setTranscription('');
                  setAiFormattedData(null);
                }}
                className="text-xs text-red-500 hover:text-red-600 font-semibold"
              >
                Clear
              </button>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">{transcription}</p>
          </div>

          {/* Format with AI Button */}
          <button
            onClick={handleFormatWithAI}
            disabled={isProcessing}
            className="mt-4 w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Processing with AI...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path
                    fillRule="evenodd"
                    d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Format with AI</span>
              </>
            )}
          </button>

          <p className="mt-2 text-xs text-gray-500 text-center">
            AI will extract stock symbol, action, prices, and format your call
          </p>
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mt-8 flex items-center gap-2 text-red-500">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold">Recording in progress...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
