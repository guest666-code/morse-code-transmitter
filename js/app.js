import { textToMorse, morseToText } from './morseMap.js';
import { playBeep, playMorseSequence, stopMorseSequence } from './audio.js';

const inputArea = document.getElementById('input-text');
const outputDiv = document.getElementById('output-morse');
const wpmSlider = document.getElementById('wpm-slider');
const wpmValue = document.getElementById('wpm-value');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnToggleMode = document.getElementById('btn-toggle-mode');
const modeIndicator = document.getElementById('mode-indicator');
const labelInput = document.getElementById('label-input');
const labelOutput = document.getElementById('label-output');

let currentMode = 'TEXT_TO_MORSE';

btnToggleMode.addEventListener('click', () => {
    stopMorseSequence();
    inputArea.value = '';
    outputDiv.innerText = '...';

    if (currentMode === 'TEXT_TO_MORSE') {
        currentMode = 'MORSE_TO_TEXT';
        modeIndicator.innerText = 'MODE: MORSE ➔ TEXT';
        labelInput.innerText = 'ENTER MORSE CODE (use . and -):';
        labelOutput.innerText = 'TEXT OUTPUT:';
        inputArea.placeholder = 'Type morse code here...';
    } else {
        currentMode = 'TEXT_TO_MORSE';
        modeIndicator.innerText = 'MODE: TEXT ➔ MORSE';
        labelInput.innerText = 'ENTER TEXT:';
        labelOutput.innerText = 'MORSE OUTPUT:';
        inputArea.placeholder = 'Type text here...';
    }
});

wpmSlider.addEventListener('input', (e) => {
    wpmValue.innerText = e.target.value;
});

inputArea.addEventListener('input', (e) => {
    const val = inputArea.value;

    if (currentMode === 'TEXT_TO_MORSE') {
        outputDiv.innerText = textToMorse(val) || '...';
    } else {
        outputDiv.innerText = morseToText(val) || '...';
    }

    if (e.inputType !== 'deleteContentBackward') {
        playBeep(50, 700);
    }
});

btnPlay.addEventListener('click', () => {
    let morseToPlay = currentMode === 'TEXT_TO_MORSE' ? outputDiv.innerText : inputArea.value;

    if (!morseToPlay || morseToPlay === '...') return;

    btnPlay.disabled = true;
    btnStop.disabled = false;

    const wpm = parseInt(wpmSlider.value, 10);

    playMorseSequence(morseToPlay, wpm, () => {
        btnPlay.disabled = false;
        btnStop.disabled = true;
    });
});

btnStop.addEventListener('click', () => {
    stopMorseSequence();
    btnPlay.disabled = false;
    btnStop.disabled = true;
});
