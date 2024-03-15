import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import wixWindowFrontend from 'wix-window-frontend';
import * as timeManager from 'public/timeManager';

let dateIndex = 0;
let allDatesString = session.getItem("allDates");
let availableProvidersString = session.getItem("availableProviders");
let allDates = allDatesString.split(',');
let availableProviders = availableProvidersString.split(',').map(str => parseInt(str));

let weeks = timeManager.splitDatesIntoWeeks(allDates);

$w("#week1repeater").forEachItem(($w) => {
    let localIndex = dateIndex;
    $w("#dayText").text = timeManager.getDayOfWeek(allDates[dateIndex], "BG");
    if (timeManager.isTommorow(allDates[dateIndex]))
        $w("#dayText").text = "Утре";
    $w("#dateText").text = formatDateString(allDates[dateIndex]);
    let singorplur = (availableProviders[dateIndex] === 1) ? "готвач" : "готвача";
    $w("#availableProvidersText").text = "" + availableProviders[dateIndex] + " " + singorplur;
    if (availableProviders[dateIndex++] === 0) {
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
    $w("#dayText2").text = timeManager.getDayOfWeek(allDates[dateIndex], "BG");
    if (timeManager.isTommorow(allDates[dateIndex]))
        $w("#dayText2").text = "Утре";
    $w("#dateText2").text = formatDateString(allDates[dateIndex]);
    let singorplur = (availableProviders[dateIndex] === 1) ? "готвач" : "готвача";
    $w("#availableProvidersText2").text = "" + availableProviders[dateIndex] + " " + singorplur;
    if (availableProviders[dateIndex++] === 0) {
        $w("#button2").disable();
    } else {
        $w("#button2").onClick(() => {
            session.setItem("selectedDay", allDates[localIndex]);
            wixWindowFrontend.lightbox.close(allDates[localIndex]);
        });
    }
});



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