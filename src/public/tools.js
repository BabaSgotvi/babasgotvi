import wixData from 'wix-data';

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
export function addMinutes(time, minutesToAdd) {
    // Split the time string into hours and minutes
    const [hoursStr, minutesStr] = time.split(':');

    // Convert hours and minutes to numbers
    let hours = parseInt(hoursStr);
    let minutes = parseInt(minutesStr);
    let totalMinutes = hours * 60 + minutes;
    let newMinutes = totalMinutes + minutesToAdd;
    let formattedHours = Math.floor(newMinutes / 60);
    let formattedMinutes = newMinutes % 60;
    return `${formattedHours}:${formattedMinutes}`;
}
export async function calculateRouteTime() {
    return 40;
}
export function replaceFlags(text, flags, tags) {
    for (let i = 0; i < tags.length; i++) {
        text = text.replace(new RegExp(flags[i], 'g'), tags[i]);
    }
    return text;
}

export function dateDisplay(dateString) {
    var parts = dateString.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
    var dateObj = new Date(new Date().getFullYear(), month, day);
    let daysOfWeek = ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"];
    let months = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
    let formattedDate = daysOfWeek[dateObj.getDay()] + " " + dateObj.getDate() + " " + months[dateObj.getMonth()];
    if (isTomorrow(dateString))
        formattedDate = "Утре";
    return "" + formattedDate;
}
export function getDayOfWeek(dateString, language, short) {
    let [day, month] = dateString.split("/"); // error: cannot read properties of undefined
    let date = new Date(new Date().getFullYear(), month - 1, day);
    let dayOfWeek = date.getDay();
    let weekdays;
    if (language == "EN" && !short)
        weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    else if (language == "EN" && short)
        weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    else if (language == "BG" && !short)
        weekdays = ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"];
    else if (language == "BG" && short)
        weekdays = ["Нед", "Пон", "Вто", "Сря", "Чет", "Пет", "Съб"];
    return weekdays[dayOfWeek];

}
export function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are 0-indexed, so we add 1
    return (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month;
}
export function getNextTwoWeeks() {
    var dates = [];
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date

    for (var i = 0; i < 14; i++) {
        dates.push(formatDate(tomorrow));
        tomorrow.setDate(tomorrow.getDate() + 1);
    }
    return dates;
}
export function isTomorrow(date) {
    var parts = date.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var dateObj = new Date(new Date().getFullYear(), month, day);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateObj.getFullYear() === tomorrow.getFullYear() && dateObj.getMonth() === tomorrow.getMonth() && dateObj.getDate() === tomorrow.getDate();
}
export function formatDateString(dateString) {
    // Split the date string into day and month components
    let [day, month] = dateString.split("/");

    // Define an array of month names in the desired language
    let monthNames = ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"];

    // Convert month to the corresponding name
    let monthName = monthNames[parseInt(month) - 1];

    // Return the formatted date string
    return day + " " + monthName;
}
export async function countAvailableProviders(dateString) {
    const cutoff = isInCutoff(dateString);
    const providers = await wixData.query("ProviderList")
        .eq(getDayOfWeek(dateString, "EN", false), true)
        .eq("validForDisplay", true)
        .find();
    let count = 0;
    providers.items.forEach(provider => {
        if (cutoff > provider.orderCutoff) {
            count++;
        }
    });
    return count;
}
export function isInCutoff(futureDateString) {
    /*
        outsidecutoff: 6, // извън всякакви недостъпни времеви интервали
        threedaysbeforemidnight: 5, // 3 дни преди полунощ
        twodaysbeforenoon: 4, // 2 дни преди обяд
        twodaysbeforemidnight: 3, // 2 дни преди полунощ
        daybeforenoon: 2, // ден преди обяд
        daybeforemidnight: 1, // ден преди полунощ
     */
    const [day, month] = futureDateString.split("/");
    const year = new Date().getFullYear();
    const futureDate = new Date(year, month - 1, day);
    const today = new Date();

    const timeDiff = futureDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const hours = today.getHours();

    if (daysDiff == 1) { // tommorow
        if (hours < 12) {
            return 2; // daybeforenoon
        } else {
            return 1; // daybeforemidnight
        }
    }
    else if (daysDiff == 2) // day after tomorrow
    {
        if (hours < 12) {
            return 4; // twodaysbeforenoon
        } else {
            return 3; // twodaysbeforemidnight
        }
    }
    else if (daysDiff == 3) // day after day after tomorrow
    {
        return 5; // threedaysbeforemidnight
    }
    else if (daysDiff > 3) // more than 3 days in the future
    {
        return 6; // outsidecutoff
    }
    else {
        return "Unexpected value. Outside of the expected range";
    }
}


export function convertTime(amount, from, to) {
    let result;
    switch (from) {
        case 'milliseconds':
            switch (to) {
                case 'seconds':
                    result = amount / 1000;
                    break;
                case 'minutes':
                    result = amount / (1000 * 60);
                    break;
                case 'hours':
                    result = amount / (1000 * 60 * 60);
                    break;
                case 'days':
                    result = amount / (1000 * 60 * 60 * 24);
                    break;
                default:
                    result = amount;
                    break;
            }
            break;
        case 'seconds':
            switch (to) {
                case 'milliseconds':
                    result = amount * 1000;
                    break;
                case 'minutes':
                    result = amount / 60;
                    break;
                case 'hours':
                    result = amount / (60 * 60);
                    break;
                case 'days':
                    result = amount / (60 * 60 * 24);
                    break;
                default:
                    result = amount;
                    break;
            }
            break;
        case 'minutes':
            switch (to) {
                case 'milliseconds':
                    result = amount * (1000 * 60);
                    break;
                case 'seconds':
                    result = amount * 60;
                    break;
                case 'hours':
                    result = amount / 60;
                    break;
                case 'days':
                    result = amount / (60 * 24);
                    break;
                default:
                    result = amount;
                    break;
            }
            break;
        case 'hours':
            switch (to) {
                case 'milliseconds':
                    result = amount * (1000 * 60 * 60);
                    break;
                case 'seconds':
                    result = amount * (60 * 60);
                    break;
                case 'minutes':
                    result = amount * 60;
                    break;
                case 'days':
                    result = amount / 24;
                    break;
                default:
                    result = amount;
                    break;
            }
            break;
        case 'days':
            switch (to) {
                case 'milliseconds':
                    result = amount * (1000 * 60 * 60 * 24);
                    break;
                case 'seconds':
                    result = amount * (60 * 60 * 24);
                    break;
                case 'minutes':
                    result = amount * (60 * 24);
                    break;
                case 'hours':
                    result = amount * 24;
                    break;
                default:
                    result = amount;
                    break;
            }
            break;
        default:
            result = amount;
            break;
    }
    return result;
}
export function createId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_+-=<>?/.:,;[]{}';
    let id = '';
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }
    return id;
}