export class SpeechUtil {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static isSupported(): boolean {
    return Boolean(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }

  public static speak(text: string, lang: 'en' | 'ml' = 'en', onEnd?: () => void, onError?: (err: any) => void): void {
    if (!this.isSupported() || !this.synth) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    this.stop(); // Stop any active speech

    // Clean markdown asterisks, hashes, backticks from spoken text
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'ml' ? 'ml-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly slower, clear conversational pace
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find((v) => 
      lang === 'ml' 
        ? v.lang.toLowerCase().includes('ml') || v.name.toLowerCase().includes('malayalam')
        : v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en-gb') || v.lang.toLowerCase().includes('en-us')
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public static pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public static resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public static isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }
}
