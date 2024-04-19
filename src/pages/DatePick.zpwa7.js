import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import wixWindowFrontend from 'wix-window-frontend';
import * as tools from 'public/tools';

let dateIndex = 0;
let allDatesString = session.getItem("allDates");
let availableProvidersString = session.getItem("availableProviders");
let allDates = allDatesString.split(',');
let availableProviders = availableProvidersString.split(',').map(str => parseInt(str));
$w("#weekRepeater").forEachItem(($w) => {
    let localIndex = dateIndex;
    $w("#dayText").text = tools.getDayOfWeek(allDates[dateIndex], "BG", true);
    if (tools.isTomorrow(allDates[dateIndex]))
        $w("#dayText").text = "Утре";
    $w("#dateText").text = tools.formatDateString(allDates[dateIndex]);
    let singorplur = (availableProviders[dateIndex] === 1) ? "готвач" : "готвача";
    $w("#availableProvidersText").text = "" + availableProviders[dateIndex++] + " " + singorplur;
    $w("#box1").onClick(() => {
        session.setItem("deliveryDate", allDates[localIndex]);
        setTimeout(() => {
            wixWindowFrontend.lightbox.close(allDates[localIndex]);
        }, 300);
    });
});