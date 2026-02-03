
// A simple synthesizer to mimic system sounds without needing external files
export const playNotificationSound = (type: 'none' | 'sonar' | 'chime' | 'digital') => {
    if (type === 'none') return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const createOscillator = (freq: number, type: OscillatorType, startTime: number, duration: number, gainVal: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(gainVal, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    if (type === 'sonar') {
        // Sonar Ping: High pitched sine with a distinct echo
        // Main ping
        createOscillator(1200, 'sine', now, 0.4, 0.2);
        // Lower echo
        createOscillator(600, 'sine', now + 0.5, 0.6, 0.05);
    } 
    else if (type === 'chime') {
        // A pleasant chord
        createOscillator(440, 'sine', now, 1.5, 0.2);
        createOscillator(554, 'sine', now + 0.1, 1.5, 0.2);
        createOscillator(659, 'sine', now + 0.2, 1.5, 0.2);
    }
    else if (type === 'digital') {
        // A digital beep
        createOscillator(880, 'square', now, 0.1, 0.1);
        createOscillator(1760, 'square', now + 0.1, 0.1, 0.1);
        createOscillator(880, 'square', now + 0.2, 0.2, 0.1);
    }
};
