// Web Audio API Synthesizer for Emergency Fraud Alarms
// No external MP3 files needed - 100% reliable, zero latency, runs directly in browser

class FraudAudioAlertEngine {
  private ctx: AudioContext | null = null;
  private alarmInterval: any = null;
  private isAlarmPlaying = false;
  private isMuted = false;
  private listeners: Array<(playing: boolean) => void> = [];

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public subscribe(fn: (playing: boolean) => void): () => void {
    this.listeners.push(fn);
    fn(this.isAlarmPlaying);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isAlarmPlaying));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isAlarmPlaying) {
      this.stopAlarm();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsAlarmPlaying(): boolean {
    return this.isAlarmPlaying;
  }

  /**
   * Loud "BEEP-BEEP! BEEP-BEEP!" Security Alarm for High-Risk Fraud (Score > 70) & McAfee/360 Simulation
   * Plays rapid, loud, piercing dual-tone alert pulses at high volume.
   */
  public playLoudFraudBeepAlert(durationSeconds: number = 10): void {
    if (this.isMuted) return;

    this.stopAlarm();

    const ctx = this.getContext();
    if (!ctx) return;

    // Ensure audio context is active
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    this.isAlarmPlaying = true;
    this.notify();

    const playBeepBurst = () => {
      if (!this.isAlarmPlaying || this.isMuted) return;
      const currentCtx = this.getContext();
      if (!currentCtx) return;

      try {
        const now = currentCtx.currentTime;

        // Beep 1: 1100 Hz sharp piercing pulse (duration 0.11s)
        const osc1 = currentCtx.createOscillator();
        const gain1 = currentCtx.createGain();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(1150, now);

        gain1.gain.setValueAtTime(0.01, now);
        gain1.gain.linearRampToValueAtTime(0.35, now + 0.015);
        gain1.gain.setValueAtTime(0.35, now + 0.09);
        gain1.gain.linearRampToValueAtTime(0.001, now + 0.11);

        osc1.connect(gain1);
        gain1.connect(currentCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        // Beep 2: 1380 Hz higher louder pulse (starts after 0.14s)
        const osc2 = currentCtx.createOscillator();
        const gain2 = currentCtx.createGain();
        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(1380, now + 0.14);

        gain2.gain.setValueAtTime(0.01, now + 0.14);
        gain2.gain.linearRampToValueAtTime(0.38, now + 0.155);
        gain2.gain.setValueAtTime(0.38, now + 0.25);
        gain2.gain.linearRampToValueAtTime(0.001, now + 0.28);

        osc2.connect(gain2);
        gain2.connect(currentCtx.destination);
        osc2.start(now + 0.14);
        osc2.stop(now + 0.29);
      } catch (err) {
        console.warn("Error synthesizing beep alert:", err);
      }
    };

    // Play initial burst immediately
    playBeepBurst();

    // Repeat every 520ms (BEEP-BEEP ... BEEP-BEEP ...)
    this.alarmInterval = setInterval(() => {
      playBeepBurst();
    }, 520);

    // Auto-silence after specified duration
    if (durationSeconds > 0) {
      setTimeout(() => {
        this.stopAlarm();
      }, durationSeconds * 1000);
    }
  }

  /**
   * Stop any playing alarm / siren
   */
  public stopAlarm(): void {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    this.isAlarmPlaying = false;
    this.notify();
  }

  // Backward compatibility aliases
  public playEmergencySiren(durationSeconds: number = 8): void {
    this.playLoudFraudBeepAlert(durationSeconds);
  }

  public stopSiren(): void {
    this.stopAlarm();
  }

  public getIsSirenPlaying(): boolean {
    return this.isAlarmPlaying;
  }

  /**
   * Suspicious anomaly warning chirp (2 moderate pulses)
   */
  public playWarningBeep(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      [0, 0.18].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(740, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + delay + 0.12);

        gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.14);
      });
    } catch {}
  }

  /**
   * Safe transaction approved chime (C-E-G major harmonic sweep)
   */
  public playSuccessChime(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const delay = idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.32);
      });
    } catch {}
  }
}

export const fraudAudio = new FraudAudioAlertEngine();

