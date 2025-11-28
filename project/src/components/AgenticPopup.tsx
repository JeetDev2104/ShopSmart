import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingCart, Mic } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Product } from '../types';

interface AgenticPopupProps {
  isOpen: boolean;
  onConfirm: (alternativeProduct?: Product) => void;
  onCancel: () => void;
  recipeIngredients?: string[];
  foundProducts?: string[];
  onFindAlternative: (missingItem: string) => Promise<Product | null>;
}

const AgenticPopup: React.FC<AgenticPopupProps> = ({ isOpen, onConfirm, onCancel, recipeIngredients = [], foundProducts = [], onFindAlternative }) => {
  const { speak, cancel: cancelSpeech } = useTTS();
  const { isListening, transcript, startListening, stopListening, supported: speechSupported } = useSpeechRecognition();
  
  // Find missing ingredients
  const missingIngredients = React.useMemo(() => {
    return recipeIngredients.filter(ingredient => 
      !foundProducts.some(product => 
        product.toLowerCase().includes(ingredient.toLowerCase()) ||
        ingredient.toLowerCase().includes(product.toLowerCase())
      )
    );
  }, [recipeIngredients, foundProducts]);
  
  const hasMissingIngredients = missingIngredients.length > 0;
  
  type Step = 'initial' | 'ask_search' | 'searching' | 'confirm_alternative' | 'adding';
  const [step, setStep] = React.useState<Step>('initial');
  const [foundAlternative, setFoundAlternative] = React.useState<Product | null>(null);
  
  const isActiveRef = React.useRef(true);
  const isProcessingStep = React.useRef(false);
  const lastTranscriptRef = React.useRef("");
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reset state when popup opens
  useEffect(() => {
    if (isOpen) {
      setStep('initial');
      setFoundAlternative(null);
      isActiveRef.current = true;
      lastTranscriptRef.current = "";
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      isActiveRef.current = false;
    };
  }, [isOpen]);

  // Handle voice interaction
  useEffect(() => {
    if (isOpen) {
      // Stop listening immediately when step changes to prevent carry-over
      stopListening();
      isProcessingStep.current = true;
      lastTranscriptRef.current = ""; // Reset transcript memory for the new step

      // Speak the prompt
      let textToSpeak = "";
      if (step === 'initial') {
        textToSpeak = "Want me to do the shopping for you?";
      } else if (step === 'ask_search') {
        const missing = missingIngredients[0];
        textToSpeak = `${missing} is missing. Shall I find an alternative?`;
      } else if (step === 'searching') {
        // No speech, just loading
      } else if (step === 'confirm_alternative' && foundAlternative) {
        textToSpeak = `I found ${foundAlternative.name}. Should I add it?`;
      } else if (step === 'adding') {
        textToSpeak = "Adding to cart and checking out.";
      }
      
      if (textToSpeak) {
        speak(textToSpeak);
      }
      
      // Start listening after the speech finishes (approximate duration)
      if (speechSupported && step !== 'adding' && step !== 'searching') {
        // Estimate duration: 350ms per word + 500ms buffer (faster response)
        const wordCount = textToSpeak.split(' ').length;
        const duration = Math.max(1500, wordCount * 350 + 500);
        
        const timer = setTimeout(() => {
          if (isActiveRef.current) {
            isProcessingStep.current = false;
            startListening();
          }
        }, duration);
        return () => clearTimeout(timer);
      } else {
        // If not speaking/listening (e.g. searching), unlock immediately
        isProcessingStep.current = false;
      }
    } else {
      cancelSpeech();
      stopListening();
    }
  }, [isOpen, step, missingIngredients, speak, cancelSpeech, startListening, stopListening, speechSupported]);

  const handleConfirm = async () => {
    if (!isActiveRef.current) return;

    if (step === 'initial') {
      if (hasMissingIngredients) {
        setTimeout(() => { if (isActiveRef.current) setStep('ask_search'); }, 500);
      } else {
        onConfirm();
      }
    } else if (step === 'ask_search') {
      setStep('searching');
      try {
        const alternative = await onFindAlternative(missingIngredients[0]);
        if (isActiveRef.current) {
          if (alternative) {
            setFoundAlternative(alternative);
            setStep('confirm_alternative');
          } else {
            speak("I couldn't find a good alternative. Proceeding without it.");
            onConfirm();
          }
        }
      } catch (e) {
        if (isActiveRef.current) onConfirm();
      }
    } else if (step === 'confirm_alternative') {
      setStep('adding');
      timeoutRef.current = setTimeout(() => {
        if (isActiveRef.current) {
            onConfirm(foundAlternative || undefined);
        }
      }, 2000);
    }
  };

  const handleStop = () => {
    isActiveRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    speak("Stopping.");
    onCancel();
  };

  // Check transcript for commands
  useEffect(() => {
    // Strictly ignore input if we are processing/speaking
    if (isProcessingStep.current) return;

    if (isOpen && transcript && step !== 'adding' && step !== 'searching') {
      // Ignore if we already processed this exact transcript (deduplication)
      if (transcript === lastTranscriptRef.current) return;
      
      const lowerTranscript = transcript.toLowerCase();
      
      // Priority check for STOP
      if (lowerTranscript.includes('stop') || lowerTranscript.includes('cancel') || lowerTranscript.includes('wait')) {
        lastTranscriptRef.current = transcript;
        handleStop();
        return;
      }

      if (lowerTranscript.includes('yes') || lowerTranscript.includes('sure') || lowerTranscript.includes('please') || lowerTranscript.includes('ok') || lowerTranscript.includes('add')) {
        lastTranscriptRef.current = transcript;
        handleConfirm();
      } else if (lowerTranscript.includes('no') || lowerTranscript.includes('skip')) {
        lastTranscriptRef.current = transcript;
        if (step === 'ask_search' || step === 'confirm_alternative') {
           // User declined substitution, proceed without it
           onConfirm();
        } else {
          onCancel();
        }
      }
    }
  }, [transcript, isOpen, step]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-50 max-w-sm w-full"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-blue-100 dark:border-gray-700 relative overflow-hidden transition-colors duration-200">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-2xl opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
                    {step === 'initial' && "Want me to shop for you? 🛒"}
                    {step === 'ask_search' && "⚠️ Item Missing"}
                    {step === 'searching' && "Finding Alternative..."}
                    {step === 'confirm_alternative' && "Found Alternative! ✨"}
                    {step === 'adding' && "Adding to Cart..."}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {step === 'initial' && "I can add all these ingredients to your cart and checkout automatically!"}
                    {step === 'ask_search' && `${missingIngredients[0]} is missing. Shall I find an alternative?`}
                    {step === 'searching' && "Scanning catalog for best match..."}
                    {step === 'confirm_alternative' && `Found ${foundAlternative?.name}. Should I add it?`}
                    {step === 'adding' && "Updating your cart and checking out..."}
                  </p>

                  {/* Nutrition Info (Only in initial step) */}
                  {step === 'initial' && (
                    <div className="flex gap-3 mb-3 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                      <span>🔥 450 Cal</span>
                      <span>💪 25g Protein</span>
                      <span>🌾 60g Carbs</span>
                    </div>
                  )}

                  {isListening && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                      <Mic className="w-3 h-3" />
                      Listening... Say "Yes"
                    </div>
                  )}
                </div>
              </div>

              {step === 'adding' && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                  <motion.div 
                    className="bg-blue-600 h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  />
                </div>
              )}

              {step === 'searching' && (
                 <div className="flex justify-center py-4">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                    />
                 </div>
              )}

              {step !== 'adding' && step !== 'searching' && (
                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold transition-colors"
                  >
                    {step === 'initial' ? "No, thanks" : "Skip"}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                        {step === 'initial' && "Yes, please"}
                        {step === 'ask_search' && "Find Alternative"}
                        {step === 'confirm_alternative' && "Add Item"}
                    </span>
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(AgenticPopup);
