//
/// IMPORTS
//

import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import wixWindowFrontend from 'wix-window-frontend';
import * as globalData from "public/globalData";


let allDates;
//
let deliveryDate;
$w.onReady(function () {
    initializeElements();
});

function refreshListed() {
    let [day, month] = deliveryDate.split("/");
    let date = new Date(new Date().getFullYear(), month - 1, day);
    let dayOfWeek = date.getDay();
    let weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let collectionName = weekdays[dayOfWeek] + "List";

    // Query the collection to get items
    wixData.query(collectionName)
        .find()
        .then(results => {
            // Populate the repeater with items from the collection
            $w("#repeater1").data = results.items;

            // Populate referenced items in the repeater data
            $w("#repeater1").forEachItem(($w, itemData, index) => {
                $w("#providerBox").expand();
                const providerId = itemData.provider;
                if (globalData.tempGet(providerId) == providerId) {
                    $w("#nameText").text = globalData.tempGet(providerId + "_name");
                    $w("#profilePic").src = globalData.tempGet(providerId + "_profilePic");
                    $w("#frontPageImage").src = globalData.tempGet(providerId + "_frontPageImage");
                    $w("#ratingsText").text = globalData.tempGet(providerId + "_ratingsText");
                } else {
                    wixData.get("ProviderList", providerId)
                        .then(provider => {
                            globalData.tempSet(providerId, providerId);
                            const name = provider.title;
                            globalData.tempSet(name, providerId + "_name");
                            const profilePic = provider.profilePic;
                            globalData.tempSet(profilePic, providerId + "_profilePic");
                            const rating = provider.rating;
                            const ratings = provider.ratings;
                            const ratingsText = "★ " + rating + " (" + ratings + ") ";
                            $w("#ratingsText").text = ratingsText;
                            globalData.tempSet(ratingsText, providerId + "_ratingsText");
                            $w("#nameText").text = name;
                            $w("#profilePic").src = profilePic;
                            wixData.get("FoodList", provider.frontPageFood)
                                .then(food => {
                                    $w("#frontPageImage").src = food.image;
                                    globalData.tempSet(food.image, providerId + "_frontPageImage");
                                })
                                .catch(error => {
                                    console.error("Error getting referenced item:", error);
                                    $w("#providerBox").collapse(); // Collapse box if error occurs
                                });
                        })
                        .catch(error => {
                            console.error("Error getting referenced item:", error);
                            $w("#providerBox").collapse(); // Collapse box if error occurs
                        });
                }
                $w('#providerBox').onClick(() => {
                    wixLocation.to('/menu?Id=' + providerId);
                });
            });


        })
        .catch(error => {
            // Handle any errors that occur during the query
            console.error("Error querying collection:", error);
        });

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
    // if (memory.getItem("preloadedProviders") != "preloadedProviders")
    // {
    //     memory.setItem("preloadedProviders", "preloadedProviders");
    //     preloadProviders();
    // }
    allDates = getNextTwoWeeks();
    memory.setItem("allDates", allDates);
    let promises = allDates.map(date => retrieveTotalProviders(date));

    Promise.all(promises)
        .then(results => {
            // Convert the results array to a comma-separated string
            let totalProvidersString = results.join(', ');
            memory.setItem("totalProviders", totalProvidersString);
        })
        .catch(error => {
            // Handle errors here
        });
    deliveryDate = allDates[0];
    dateDisplay(deliveryDate);
    refreshListed();
}

function retrieveTotalProviders(dateString) {
    return new Promise((resolve, reject) => {
        let [day, month] = dateString.split("/");
        let date = new Date(new Date().getFullYear(), month - 1, day);
        let dayOfWeek = date.getDay();
        let weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let collectionName = weekdays[dayOfWeek] + "List";
        wixData.query(collectionName).count()
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
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

function preloadProviders() {
    wixData.query("ProviderList")
        .find()
        .then(results => {
            results.items.forEach(provider => {
                const providerId = provider._id;
                memory.setItem(providerId + "_fetched", providerId);
                const profilePic = provider.profilePic;
                memory.setItem(providerId + "_profilePic", profilePic);
                const name = provider.title;
                memory.setItem(providerId + "_name", name);
                const rating = provider.rating;
                const ratings = provider.ratings;
                const ratingsText = "★ " + rating + " (" + ratings + ") ";
                memory.setItem(providerId + "_ratingsText", ratingsText);
                wixData.get("FoodList", provider.frontPageFood).then(food => {
                    memory.setItem(providerId + "_frontPageImage", food.image);
                });
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}