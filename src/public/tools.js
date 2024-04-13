export function transliterate(name) {
    const transliterationMap = {
        'A': 'А', 'B': 'Б', 'C': 'Ц', 'D': 'Д', 'E': 'Е', 'F': 'Ф', 'G': 'Г', 'H': 'Х', 'I': 'И',
        'J': 'Ж', 'K': 'К', 'L': 'Л', 'M': 'М', 'N': 'Н', 'O': 'О', 'P': 'П', 'Q': 'К', 'R': 'Р',
        'S': 'С', 'T': 'Т', 'U': 'У', 'V': 'В', 'W': 'Ш', 'X': 'КС', 'Y': 'Й', 'Z': 'З',
        'a': 'а', 'b': 'б', 'c': 'ц', 'd': 'д', 'e': 'е', 'f': 'ф', 'g': 'г', 'h': 'х', 'i': 'и',
        'j': 'ж', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п', 'q': 'к', 'r': 'р',
        's': 'с', 't': 'т', 'u': 'у', 'v': 'в', 'w': 'ш', 'x': 'кс', 'y': 'й', 'z': 'з',
        'ch': 'ч', 'zh': 'ж', 'dj': 'дж', 'yo': 'ьо', // Handle combinations
        ' ': ' '
    };

    let transliteratedName = '';
    for (let i = 0; i < name.length; i++) {
        let key = name[i];
        if (i < name.length - 1) {
            const twoChars = name[i] + name[i + 1];
            if (transliterationMap.hasOwnProperty(twoChars)) {
                key = twoChars;
                i++; // Skip the next character
            }
        }
        transliteratedName += transliterationMap[key] || key;
    }
    return transliteratedName;
}