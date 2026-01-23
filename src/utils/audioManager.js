export const audioManager = {
    audioCtx: null,

    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playTone(frequency, type, duration, volume = 0.1) {
        try {
            if (!this.audioCtx) this.init();
            if (!this.audioCtx) return; // Failed to init

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume().catch(() => { });
            }

            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

            gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            oscillator.start();
            oscillator.stop(this.audioCtx.currentTime + duration);
        } catch (e) {
            console.warn('Audio play failed', e);
        }
    },

    // UI Click (Short High Blip)
    playClick() {
        this.playTone(800, 'sine', 0.1, 0.1);
    },

    // Confirm/Positive (Rising Tone)
    playConfirm() {
        try {
            if (!this.audioCtx) this.init();
            if (!this.audioCtx) return;

            if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => { });

            const now = this.audioCtx.currentTime;
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            oscillator.start();
            oscillator.stop(now + 0.2);
        } catch (e) {
            console.warn('Audio confirm failed', e);
        }
    },

    // Cancel/Back (Falling Tone) - optional
    playHover() {
        this.playTone(400, 'sine', 0.05, 0.05);
    },

    // Damage/Fail (Low Sawtooth)
    playDamage() {
        this.playTone(150, 'sawtooth', 0.2, 0.2);
    },

    // Win/Clear (Fanfare-ish)
    playWin() {
        try {
            if (!this.audioCtx) this.init();
            if (!this.audioCtx) return;
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => { });

            const now = this.audioCtx.currentTime;

            // Simple arpeggio
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now + (i * 0.1));
                gain.gain.setValueAtTime(0.1, now + (i * 0.1));
                gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.1);
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now + (i * 0.1));
                osc.stop(now + (i * 0.1) + 0.1);
            });
        } catch (e) { }
    },

    // Jump/Action
    playJump() {
        try {
            if (!this.audioCtx) this.init();
            if (!this.audioCtx) return;
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => { });

            const now = this.audioCtx.currentTime;
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.linearRampToValueAtTime(300, now + 0.1);

            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            oscillator.start();
            oscillator.stop(now + 0.1);
        } catch (e) { }
    }
};
