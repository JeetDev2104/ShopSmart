import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingCart, Mic } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface AgenticPopupProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AgenticPopup: React.FC<AgenticPopupProps> = ({ isOpen, onConfirm, onCancel }) => {
  const { speak, cancel: cancelSpeech } = useTTS();
  const { isListening, transcript, startListening, stopListening, supported: speechSupported } = useSpeechRecognition();

  // Handle voice interaction
  useEffect(() => {
    if (isOpen) {
      // Speak the prompt
      speak("Want me to do the shopping for you?");
      
      // Start listening after a short delay to allow speaking to start
      if (speechSupported) {
        const timer = setTimeout(() => {
          startListening();
        }, 1500);
        return () => clearTimeout(timer);
      }
    } else {
      cancelSpeech();
      stopListening();
    }
  }, [isOpen, speak, cancelSpeech, startListening, stopListening, speechSupported]);

  // Check transcript for "yes"
  useEffect(() => {
    if (isOpen && transcript) {
      const lowerTranscript = transcript.toLowerCase();
      if (lowerTranscript.includes('yes') || lowerTranscript.includes('sure') || lowerTranscript.includes('please')) {
        onConfirm();
      } else if (lowerTranscript.includes('no')) {
        onCancel();
      }
    }
  }, [transcript, isOpen, onConfirm, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-50 max-w-sm w-full"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-blue-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                    Want me to shop for you? 🛒
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    I can add all these ingredients to your cart and checkout automatically!
                  </p>
                  {isListening && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 font-medium animate-pulse">
                      <Mic className="w-3 h-3" />
                      Listening... Say "Yes"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  No, thanks
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>Yes, please</span>
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgenticPopup;
