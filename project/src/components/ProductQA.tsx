import React, { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send, Sparkles, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../types";
import { GeminiService } from "../services/geminiService";
import ReactMarkdown from 'react-markdown';
import { useTTS } from "../hooks/useTTS";

interface ProductQAProps {
  product: Product;
  onClose: () => void;
}

interface QAItem {
  question: string;
  answer: string;
  confidence: number;
  followUpQuestions: string[];
  suggestedProduct?: string;
}

const ProductQA: React.FC<ProductQAProps> = ({ product, onClose }) => {
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<QAItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const recognitionRef = useRef<any>(null);
  const lastInputWasVoice = useRef(false);
  const { speak } = useTTS();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [qaHistory]);

  // Voice recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      return;
    }
    setHasSpeechSupport(true);

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
      lastInputWasVoice.current = true;
      handleSubmit(syntheticEvent, transcript);
    };

    recognitionRef.current = recognition;
  }, [handleSubmit]);

  async function handleSubmit(e: React.FormEvent, q: string = question) {
    // If this was called from text input submission, mark as text
    if (!lastInputWasVoice.current) {
      lastInputWasVoice.current = false;
    }

    e.preventDefault();
    if (!q.trim()) return;

    const currentQuestion = q.trim();
    setQuestion("");
    setIsLoading(true);

    // Add user's question to history immediately
    setQaHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        answer: "", // Placeholder for AI answer
        confidence: 0,
        followUpQuestions: [],
      },
    ]);

    try {
      const history = qaHistory.flatMap(item => [
        { role: "user", content: item.question },
        { role: "assistant", content: item.answer }
      ]).filter(msg => msg.content !== "");

      const geminiService = GeminiService.getInstance();
      const response = await geminiService.answerProductQuestion(
        product.id,
        currentQuestion,
        history
      );

      // Update the last item in history with the AI response
      setQaHistory((prev) => {
        const newHistory = [...prev];
        const lastItem = newHistory[newHistory.length - 1];
        if (lastItem && lastItem.question === currentQuestion) {
          lastItem.answer = response.answer;
          lastItem.confidence = response.confidence;
          lastItem.followUpQuestions = response.followUpQuestions;
          lastItem.suggestedProduct = response.suggestedProduct;
        }
        if (lastInputWasVoice.current) {
          try {
            speak(response.answer);
          } catch (err) {
            console.error('TTS error', err);
          }
          lastInputWasVoice.current = false;
        }
        return newHistory;
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Update the last item with an error message
      setQaHistory((prev) => {
        const newHistory = [...prev];
        const lastItem = newHistory[newHistory.length - 1];
        if (lastItem && lastItem.question === currentQuestion) {
          lastItem.answer =
            "Sorry, I couldn't get a response. Please try again.";
        }
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpClick = (followUpQuestion: string) => {
    // Create a synthetic event to pass to handleSubmit
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    handleSubmit(syntheticEvent, followUpQuestion);
  };

  const getProductSpecificQuestions = (product: Product): string[] => {
    const category = product.category.toLowerCase();

    if (category.includes("rice") || category.includes("pantry")) {
      return [
        "What's the best way to cook this rice?",
        "How much water should I use for cooking?",
        "Is this good for biryani?",
        "What's the grain size and texture?",
      ];
    }

    if (category.includes("running") || category.includes("shoes")) {
      return [
        "Are these suitable for long-distance running?",
        "How does the cushioning compare to other shoes?",
        "What's the durability like?",
        "Are they good for different terrains?",
      ];
    }

    if (category.includes("sunscreen") || category.includes("cream")) {
      return [
        "Is this good for sensitive skin?",
        "How often should I reapply?",
        "Is this water resistant?",
        "Does it leave a white residue?",
      ];
    }

    if (category.includes("jacket") || category.includes("clothing")) {
      return [
        "What's the warmth rating?",
        "Is this waterproof or water-resistant?",
        "How does this fit?",
        "What materials is it made from?",
      ];
    }

    if (category.includes("vegetable") || category.includes("food")) {
      return [
        "How fresh is this product?",
        "What's the best way to store this?",
        "What dishes can I make with this?",
        "Is this organic?",
      ];
    }

    return [
      "What's the quality like?",
      "How does this compare to similar products?",
      "What are the main features?",
      "Is this good value for money?",
    ];
  };

  const commonQuestions = getProductSpecificQuestions(product);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 1.1, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gray-50 rounded-3xl max-w-4xl w-full h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="relative z-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-white rounded-t-3xl relative"
          >
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <motion.div
                className="flex-1 flex items-center justify-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 text-white">
                  <motion.div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MessageCircle className="w-6 h-6" />
                  </motion.div>
                  <h2 className="text-lg font-semibold m-0">
                    AI Product Assistant
                  </h2>
                </div>
              </motion.div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>

          {/* Floating Product Image & Badge */}
          <div className="absolute left-6 -bottom-12 flex items-end gap-3 z-20">
            <motion.div
              className="w-24 h-24 rounded-2xl border-4 border-white bg-white flex items-center justify-center shadow-lg overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/80?text=No+Image";
                }}
              />
            </motion.div>
            <motion.div
              className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-blue-900">
                AI Ready
              </span>
            </motion.div>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto px-6 pb-6 pt-20 -mt-1 relative z-0"
        >
          <AnimatePresence initial={false}>
            {qaHistory.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Ask me anything!
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  I'm here to help you learn everything about this product.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {commonQuestions.map((q, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleFollowUpClick(q)}
                      className="text-left p-4 bg-white rounded-xl hover:bg-blue-50 transition-all duration-300 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.3 + index * 0.1 },
                      }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors">
                        {q}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {qaHistory.map((qa, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-md p-4 max-w-md shadow-lg">
                        <p className="font-medium">{qa.question}</p>
                      </div>
                    </div>
                    {qa.answer && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-md p-4 max-w-lg shadow-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                              AI Assistant ({Math.round(qa.confidence * 100)}%
                              confidence)
                            </span>
                          </div>
                          <div className="text-gray-900 mb-4 leading-relaxed">
                            <ReactMarkdown 
                              components={{
                                ul: ({...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                ol: ({...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                li: ({...props}) => <li className="mb-1" {...props} />,
                                strong: ({...props}) => <span className="font-bold text-blue-900" {...props} />,
                                p: ({...props}) => <p className="mb-2 last:mb-0" {...props} />
                              }}
                            >
                              {qa.answer}
                            </ReactMarkdown>
                          </div>
                          {qa.followUpQuestions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                You might also want to ask:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {qa.followUpQuestions.map((fq, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleFollowUpClick(fq)}
                                    className="text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors"
                                  >
                                    {fq}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {qa.suggestedProduct && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-sm text-gray-600 mb-2">
                                You might be interested in:
                              </p>
                              <button
                                onClick={() => {
                                  onClose();
                                  // Trigger search for the suggested product
                                  const searchBar = document.querySelector('input[type="text"]') as HTMLInputElement;
                                  if (searchBar) {
                                    searchBar.value = qa.suggestedProduct || '';
                                    searchBar.dispatchEvent(new Event('input', { bubbles: true }));
                                    const form = searchBar.closest('form');
                                    if (form) {
                                      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                                    }
                                  }
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium text-sm"
                              >
                                View {qa.suggestedProduct}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading &&
                  qaHistory[qaHistory.length - 1]?.answer === "" && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-2xl rounded-bl-md p-4 max-w-lg shadow-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex items-center gap-1">
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                transition: { duration: 0.8, repeat: Infinity },
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                transition: {
                                  duration: 0.8,
                                  delay: 0.2,
                                  repeat: Infinity,
                                },
                              }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                transition: {
                                  duration: 0.8,
                                  delay: 0.4,
                                  repeat: Infinity,
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Input Form */}
        <div className="p-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-auto rounded-b-3xl">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask another question..."
              className="w-full p-4 bg-gray-100 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              disabled={isLoading}
            />
            {hasSpeechSupport && (
              <motion.button
                type="button"
                onClick={() => {
                  lastInputWasVoice.current = true;
                  recognitionRef.current && recognitionRef.current.start();
                }}
                disabled={isLoading}
                className="p-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 transition-colors"
                whileHover={{ scale: listening ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className={`w-6 h-6 ${listening ? 'text-red-600 animate-pulse' : ''}`} />
              </motion.button>
            )}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <motion.div
                  className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductQA;
