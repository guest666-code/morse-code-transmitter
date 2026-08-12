export const morseCodeMap = {
    'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
    'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
    'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
    'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
    'Z': '--..',  '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '0': '-----', ' ': '/'
};

export const reverseMorseMap = Object.fromEntries(
    Object.entries(morseCodeMap).map(([key, value]) => [value, key])
);

export function textToMorse(text) {
    return text.toUpperCase().split('').map(char => morseCodeMap[char] || char).join(' ');
}

export function morseToText(morse) {
    return morse.trim().split(' / ').map(word => {
        return word.split(' ').map(code => reverseMorseMap[code] || code).join('');
    }).join(' ');
}
