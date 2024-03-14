import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import wixWindowFrontend from 'wix-window-frontend';


let firstWeek;
let secondWeek;
let dateIndex = 0;
let allDatesString = session.getItem("allDates");
console.log("allDates: " + allDatesString)
let totalProvidersPerDateString = session.getItem("totalProviders");
console.log("totalProviders: " + totalProvidersPerDateString);
let allDates = allDatesString.split(',');
let totalProviders = totalProvidersPerDateString.split(',').map(str => parseInt(str));


$w("#week1repeater").forEachItem(($w) => {
    let localIndex = dateIndex;
    $w("#dayText").text = getDayFromDate(allDates[dateIndex]);
    if (isTommorow(allDates[dateIndex]))
        $w("#dayText").text = "Утре";
    $w("#dateText").text = formatDateString(allDates[dateIndex]);
    let singorplur = (totalProviders[dateIndex] === 1) ? "готвач" : "готвача";
    $w("#totalProvidersText").text = "" + totalProviders[dateIndex] + " " + singorplur;
    if (totalProviders[dateIndex++] === 0) {
        $w("#button1").disable();
    } else {
        $w("#button1").onClick(() => {
            session.setItem("selectedDay", allDates[localIndex]);
            wixWindowFrontend.lightbox.close(allDates[localIndex]);
        });
    }
});
$w("#week2repeater").forEachItem(($w) => {
    let localIndex = dateIndex;
    $w("#dayText2").text = getDayFromDate(allDates[dateIndex]);
    if (isTommorow(allDates[dateIndex]))
        $w("#dayText2").text = "Утре";
    $w("#dateText2").text = formatDateString(allDates[dateIndex]);
    let singorplur = (totalProviders[dateIndex] === 1) ? "готвач" : "готвача";
    $w("#totalProvidersText2").text = "" + totalProviders[dateIndex] + " " + singorplur;
    if (totalProviders[dateIndex++] === 0) {
        $w("#button2").disable();
    } else {
        $w("#button2").onClick(() => {
            session.setItem("selectedDay", allDates[localIndex]);
            wixWindowFrontend.lightbox.close(allDates[localIndex]);
        });
    }
});

function getDayFromDate(dateString) {
    // Split the date string into day and month components
    let [day, month] = dateString.split("/");

    // Create a new Date object with the given day and month (year is assumed to be current year)
    let date = new Date(new Date().getFullYear(), month - 1, day); // month - 1 because months are zero-based in JavaScript

    // Get the day of the week (0=Sunday, 1=Monday, ..., 6=Saturday)
    let dayOfWeek = date.getDay();

    // Define an array of weekday names
    let weekdays = ["Нед", "Пон", "Вто", "Сря", "Чет", "Пет", "Съб"];

    // Return the corresponding weekday name
    return weekdays[dayOfWeek];
}

function formatDateString(dateString) {
    // Split the date string into day and month components
    let [day, month] = dateString.split("/");

    // Define an array of month names in the desired language
    let monthNames = ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"];

    // Convert month to the corresponding name
    let monthName = monthNames[parseInt(month) - 1];

    // Return the formatted date string
    return day + " " + monthName;
}
function isTommorow(date) {
    var parts = date.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var dateObj = new Date(new Date().getFullYear(), month, day);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateObj.getFullYear() === tomorrow.getFullYear() && dateObj.getMonth() === tomorrow.getMonth() && dateObj.getDate() === tomorrow.getDate();
}