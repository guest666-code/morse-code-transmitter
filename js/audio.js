let audioCtx = null;
let isPlaying = false;
let currentTimeoutIds = [];

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

export function playBeep(duration = 60, frequency = 600) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + (duration / 1000));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (duration / 1000));
}

export function playMorseSequence(morseString, wpm = 15, onComplete = () => {}) {
    stopMorseSequence();
    isPlaying = true;

    const ctx = getAudioContext();
    const dotDuration = 1200 / wpm;
    let currentTime = ctx.currentTime + 0.1;

    const words = morseString.trim().split(' / ');

    words.forEach((word) => {
        const letters = word.split(' ');
        
        letters.forEach((letter) => {
            const symbols = letter.split('');

            symbols.forEach((symbol) => {
                if (!isPlaying) return;

                if (symbol === '.' || symbol === '-') {
                    const duration = (symbol === '.' ? 1 : 3) * dotDuration / 1000;
                    
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, currentTime);

                    gain.gain.setValueAtTime(0.1, currentTime);
                    gain.gain.setValueAtTime(0.1, currentTime + duration - 0.005);
                    gain.gain.linearRampToValueAtTime(0.00001, currentTime + duration);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(currentTime);
                    osc.stop(currentTime + duration);

                    currentTime += duration + (dotDuration / 1000);
                }
            });

            currentTime += (2 * dotDuration / 1000);
        });

        currentTime += (4 * dotDuration / 1000);
    });

    const totalMs = (currentTime - ctx.currentTime) * 1000;
    const timeoutId = setTimeout(() => {
        isPlaying = false;
        onComplete();
    }, totalMs);

    currentTimeoutIds.push(timeoutId);
}

export function stopMorseSequence() {
    isPlaying = false;
    currentTimeoutIds.forEach(id => clearTimeout(id));
    currentTimeoutIds = [];
    if (audioCtx) {
        audioCtx.close().then(() => {
            audioCtx = null;
        });
    }
}
