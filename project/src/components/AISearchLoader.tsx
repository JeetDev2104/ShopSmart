import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Zap } from 'lucide-react';
import { TbBrandWalmart } from 'react-icons/tb';

interface AISearchLoaderProps {
  query: string;
}

const AISearchLoader: React.FC<AISearchLoaderProps> = ({ query }) => {
  const steps = [
    { icon: Search, text: "Analyzing your query...", delay: 0 },
    { icon: TbBrandWalmart, text: "Understanding intent...", delay: 0.5 },
    { icon: Sparkles, text: "Finding perfect matches...", delay: 1 },
    { icon: Zap, text: "Preparing results...", delay: 1.5 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-[#0071CE] via-blue-500 to-blue-800 flex items-center justify-center"
    >
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Main AI Brain Animation */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Pulsing Background Circle */}
          <motion.div
            className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-blue-400 to-white-400 rounded-full opacity-20"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Central Brain Icon */}
          <motion.div
            className="relative w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-white-400 rounded-full flex items-center justify-center shadow-2xl"
            animate={{ 
              rotateY: [0, 360],
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.5)",
                "0 0 40px rgba(237, 214, 14, 0.7)",
                "0 0 20px rgba(59, 130, 246, 0.5)"
              ]
            }}
            transition={{ 
              rotateY: { duration: 1.5, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <TbBrandWalmart className="w-20 h-20 text-yellow-400" />
          </motion.div>

          {/* Orbiting Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0'
              }}
              animate={{
                rotateY: [0, 360],
                x: [0, 80 * Math.cos((i * 60) * Math.PI / 180)],
                y: [0, 80 * Math.sin((i * 60) * Math.PI / 180)],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>

        {/* Query Display */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">WalSmart AI is thinking...</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="text-white/90 text-lg">
              "<span className="text-blue-300 font-medium">{query}</span>"
            </p>
          </div>
        </motion.div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: step.delay * 0.5 + 0.5 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-blue-400 to-white-500 rounded-full flex items-center justify-center"
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{step.text}</p>
                </div>

                {/* Progress Dots */}
                <div className="flex gap-1">
                  {[...Array(3)].map((_, dotIndex) => (
                    <motion.div
                      key={dotIndex}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        delay: dotIndex * 0.2 + step.delay * 0.5
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Sparkles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 flex justify-center gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AISearchLoader;