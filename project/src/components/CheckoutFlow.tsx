import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check, Package, Truck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onOrderComplete: () => void;
  isAgentic?: boolean;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  isOpen,
  onClose,
  items,
  totalPrice,
  onOrderComplete,
  isAgentic = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states for autofill animation
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const steps = [
    { icon: CreditCard, title: 'Payment Details', description: 'Enter your payment information' },
    { icon: Package, title: 'Order Processing', description: 'We\'re preparing your order' },
    { icon: Truck, title: 'Order Confirmed', description: 'Your order has been placed successfully' }
  ];

  // Agentic Workflow Automation
  useEffect(() => {
    if (isOpen && isAgentic && currentStep === 0) {
      const automateCheckout = async () => {
        // Wait a bit before starting
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate typing card number
        const targetCard = "4532 1234 5678 9012";
        for (let i = 0; i <= targetCard.length; i++) {
          setCardNumber(targetCard.slice(0, i));
          await new Promise(r => setTimeout(r, 50));
        }

        // Simulate typing expiry
        const targetExpiry = "12/28";
        for (let i = 0; i <= targetExpiry.length; i++) {
          setExpiry(targetExpiry.slice(0, i));
          await new Promise(r => setTimeout(r, 100));
        }

        // Simulate typing CVV
        const targetCvv = "123";
        for (let i = 0; i <= targetCvv.length; i++) {
          setCvv(targetCvv.slice(0, i));
          await new Promise(r => setTimeout(r, 100));
        }

        // Wait then submit
        await new Promise(resolve => setTimeout(resolve, 800));
        handlePayment();
      };

      automateCheckout();
    }
  }, [isOpen, isAgentic, currentStep]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentStep(1);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStep(2);
    
    // Complete order
    setTimeout(() => {
      onOrderComplete();
      onClose();
      setCurrentStep(0);
      setIsProcessing(false);
      // Reset form
      setCardNumber("");
      setExpiry("");
      setCvv("");
    }, 4000); // Longer delay at the end to read the success message
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative overflow-hidden ${isAgentic ? 'border-2 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isAgentic && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold py-1 px-4 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 animate-pulse" />
            AGENTIC MODE ACTIVE: AUTOMATING CHECKOUT
          </div>
        )}

        <div className="p-6 border-b mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            {currentStep < 2 && !isAgentic && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={index} className="flex items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isActive ? 'bg-blue-600 text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        backgroundColor: isCompleted ? '#10B981' : isActive ? '#2563EB' : '#E5E7EB'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-2 ${
                        index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold">{steps[currentStep].title}</h3>
              <p className="text-gray-600 text-sm">{steps[currentStep].description}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${isAgentic ? 'bg-blue-50 border-blue-200 text-blue-800' : 'border-gray-300'}`}
                      readOnly={isAgentic}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${isAgentic ? 'bg-blue-50 border-blue-200 text-blue-800' : 'border-gray-300'}`}
                        readOnly={isAgentic}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${isAgentic ? 'bg-blue-50 border-blue-200 text-blue-800' : 'border-gray-300'}`}
                        readOnly={isAgentic}
                      />
                    </div>
                  </div>

                  <motion.button
                    onClick={handlePayment}
                    disabled={isProcessing || (isAgentic && isProcessing)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      isAgentic 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:opacity-50`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        AI Processing...
                      </span>
                    ) : (
                      `Pay ₹${totalPrice.toFixed(2)}`
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">Processing your order</h3>
                <p className="text-gray-600">Please wait while we prepare your items...</p>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for your purchase. You'll receive a confirmation email shortly.
                </p>
                <p className="text-sm text-gray-500">
                  Order #WM{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutFlow;