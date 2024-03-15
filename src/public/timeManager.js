export function dateDisplay(dateString) {
    var parts = dateString.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
    var dateObj = new Date(new Date().getFullYear(), month, day);
    let daysOfWeek = ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"];
    let months = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
    let formattedDate = daysOfWeek[dateObj.getDay()] + " " + dateObj.getDate() + " " + months[dateObj.getMonth()];
    if (isTommorow(dateString))
        formattedDate = "Утре";
    return "" + formattedDate;
}
export function getDayOfWeek(dateString, language) {
    let [day, month] = dateString.split("/");
    let date = new Date(new Date().getFullYear(), month - 1, day);
    let dayOfWeek = date.getDay();
    let weekdays;
    if (language == "EN")
        weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    else if (language == "BG")
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
export function isTommorow(date) {
    var parts = date.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var dateObj = new Date(new Date().getFullYear(), month, day);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateObj.getFullYear() === tomorrow.getFullYear() && dateObj.getMonth() === tomorrow.getMonth() && dateObj.getDate() === tomorrow.getDate();
}
export function splitDatesIntoWeeks(dates) {
    // Get the day of the week for the first date
    const firstDate = new Date(dates[0]);
    const firstDayOfWeek = firstDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Split the array into weeks based on the first day of the week
    if (firstDayOfWeek === 1) {
        // Case 1: First date is Monday, so we have exactly 2 arrays
        const firstWeek = dates.slice(0, 7);
        const secondWeek = dates.slice(7);
        return [firstWeek, secondWeek];
    } else {
        // Case 2: First date is not Monday, so we have 3 arrays
        const firstIncompleteWeek = dates.slice(0, firstDayOfWeek);
        const remainingDays = dates.slice(firstDayOfWeek);
        const secondWeek = remainingDays.slice(0, 7);
        const thirdWeek = remainingDays.slice(7);
        return [firstIncompleteWeek, secondWeek, thirdWeek];
    }
}