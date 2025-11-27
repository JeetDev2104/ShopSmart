import { useState, useEffect, useCallback } from 'react';

export const useTTS = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const getBestVoice = useCallback(() => {
    if (voices.length === 0) return null;

    // Priority list for "friendly/natural" female voices
    const preferredVoices = [
      'Google US English',
      'Microsoft Zira',
      'Samantha',
      'Google UK English Female',
      'Karen'
    ];

    // 1. Try to find a preferred voice
    for (const name of preferredVoices) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }

    // 2. Try to find any female voice (heuristic: often contain "female" or specific names)
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('woman')
    );
    if (femaleVoice) return femaleVoice;

    // 3. Fallback to default
    return voices.find(v => v.default) || voices[0];
  }, [voices]);

  const speak = useCallback((text: string) => {
    if (!supported) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice();
    
    if (voice) {
      utterance.voice = voice;
    }

    // Adjust parameters for a more natural sound
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [supported, getBestVoice]);

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return { speak, cancel, speaking, supported };
};
