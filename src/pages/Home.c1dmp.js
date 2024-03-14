//
/// IMPORTS
//

import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import wixWindowFrontend from 'wix-window-frontend';


let allDates;
//
let deliveryDate;
$w.onReady(function () {
    initializeElements();
});
$w("#providerList").onReady(() => {
    refreshListed();
})

function refreshListed() {
    let [day, month] = deliveryDate.split("/");
    let date = new Date(new Date().getFullYear(), month - 1, day);
    let dayOfWeek = date.getDay();
    let weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let collectionName = weekdays[dayOfWeek] + "List";
    $w("#providerList").setFilter(wixData.filter().eq(weekdays[dayOfWeek], true));
    $w("#providerList").refresh();
    $w("#providerRepeater").forEachItem(($w, itemData) => {
        $w('#providerBox').onClick(() => {
            let providerId = itemData._id;
            wixLocation.to('/menu?Id=' + providerId);
        });
    })
}

function dateDisplay(date) {
    var parts = date.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
    var dateObj = new Date(new Date().getFullYear(), month, day);
    let daysOfWeek = ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"];
    let months = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];
    let formattedDate = daysOfWeek[dateObj.getDay()] + " " + dateObj.getDate() + " " + months[dateObj.getMonth()];
    if (isTommorow(date))
        formattedDate = "Утре";
    $w("#deliveryDate").text = "" + formattedDate;
}

// function isDateAvailable(providerId) {
//     return wixData.get('ProviderList', providerId)
//         .then((provider) => {
//             const availableDaysText = provider.availableDays;
//             let availableDaysArray = availableDaysText.split(',').map(day => day.trim().toLowerCase());
//             const selectedDate = $w("#datePicker1").value;
//             const selectedDayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//             return availableDaysArray.includes(selectedDayOfWeek);
//         })
// }

// Function to format a date as "dd/mm"
function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are 0-indexed, so we add 1
    return (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month;
}

// Function to get an array of dates for the next 2 weeks
function getNextTwoWeeks() {
    var dates = [];
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date

    for (var i = 0; i < 14; i++) {
        dates.push(formatDate(tomorrow));
        tomorrow.setDate(tomorrow.getDate() + 1);
    }
    return dates;
}

function initializeElements() {
    allDates = getNextTwoWeeks();
    session.setItem("allDates", allDates);

    let promises = allDates.map(date => retrieveTotalProviders(date));

    Promise.all(promises)
        .then(results => {
            // Convert the results array to a comma-separated string
            let totalProvidersString = results.join(',');
            session.setItem("totalProviders", totalProvidersString);
        })
        .catch(error => {
            // Handle errors here
        });
    deliveryDate = allDates[0]; 2
    dateDisplay(deliveryDate);
}

function retrieveTotalProviders(dateString) {
    return new Promise((resolve, reject) => {
        let [day, month] = dateString.split("/");
        let date = new Date(new Date().getFullYear(), month - 1, day);
        let dayOfWeek = date.getDay();
        let weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        wixData.query("#providerList").eq(weekdays[dayOfWeek], true).find().then((results) => {
            resolve(results.items.length);
        })
    });
}

$w("#text7").onClick(async () => {
    deliveryDate = await wixWindow.openLightbox("DatePick");
    dateDisplay(deliveryDate);
    refreshListed();
})
$w("#deliveryDate").onClick(async () => {
    deliveryDate = await wixWindow.openLightbox("DatePick");
    dateDisplay(deliveryDate);
    refreshListed();
});

function isTommorow(date) {
    var parts = date.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var dateObj = new Date(new Date().getFullYear(), month, day);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateObj.getFullYear() === tomorrow.getFullYear() && dateObj.getMonth() === tomorrow.getMonth() && dateObj.getDate() === tomorrow.getDate();
}