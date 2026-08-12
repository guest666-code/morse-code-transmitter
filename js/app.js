import { morseCodeMap } from './morseMap.js';
import { playBeep } from './audio.js';

const inputArea = document.getElementById('input-text');
const outputDiv = document.getElementById('output-morse');

inputArea.addEventListener('input', (e) => {
    const text = inputArea.value.toUpperCase();
    let morseResult = [];

    for (let char of text) {
        if (morseCodeMap[char]) {
            morseResult.push(morseCodeMap[char]);
        } else {
            morseResult.push(char);
        }
    }

    outputDiv.innerText = morseResult.join(' ') || '...';

    if (e.inputType !== 'deleteContentBackward') {
        playBeep(50, 700);
    }
});
