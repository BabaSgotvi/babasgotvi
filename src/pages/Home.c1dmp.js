import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import wixWindowFrontend from 'wix-window-frontend';
import * as timeManager from 'public/timeManager';
let allDates;
let deliveryDate;
$w.onReady(function () {
    initializeElements();

});
$w("#providerList").onReady(() => {
    refreshListed();
})
function refreshListed() {
    $w("#providerList").setFilter(wixData.filter().eq(timeManager.getDayOfWeek(deliveryDate, "EN"), true));
    $w("#providerList").refresh();
    $w("#providerRepeater").onItemReady(($w, itemData) => {
        $w("#ratingsText").text = "★ " + itemData.rating + " (" + itemData.ratings + ")";
        $w('#providerBox').onClick(() => {
            let providerId = itemData._id;
            wixLocation.to('/menu?Id=' + providerId);
        });
    })
}
function initializeElements() {
    allDates = timeManager.getNextTwoWeeks();

    session.setItem("allDates", allDates);
    let promises = allDates.map(date => countAvailableProviders(date));

    Promise.all(promises)
        .then(counts => {
            let availableProviders = counts.map(count => count.toString());
            session.setItem("availableProviders", availableProviders);
        })
    deliveryDate = allDates[0];
    $w("#deliveryDate").text = timeManager.dateDisplay(deliveryDate);

    if (session.getItem("selectedDay") == null && session.getItem("selectedDay") == undefined) {
        session.setItem("selectedDay", allDates[0]);
    }
}

function countAvailableProviders(dateString) {
    return wixData.query("ProviderList")
        .eq(timeManager.getDayOfWeek(dateString, "EN"), true)
        .count();
}

$w("#text7").onClick(async () => {
    deliveryDate = await wixWindow.openLightbox("DatePick");
    $w("#deliveryDate").text = timeManager.dateDisplay(deliveryDate);
    refreshListed();
})
$w("#deliveryDate").onClick(async () => {
    deliveryDate = await wixWindow.openLightbox("DatePick");
    $w("#deliveryDate").text = timeManager.dateDisplay(deliveryDate);
    refreshListed();
});


//
/// TODO: ADD ORDER CUTOFF TIME FILTERING
//