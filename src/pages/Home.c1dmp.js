//
/// IMPORTS
//

import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import wixWindowFrontend from 'wix-window-frontend';
import * as timeManager from 'public/timeManager';

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
    $w("#providerList").setFilter(wixData.filter().eq(timeManager.getDayOfWeekEN(deliveryDate), true));
    $w("#providerList").refresh();
    $w("#providerRepeater").forEachItem(($w, itemData) => {
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
            console.log(session.getItem("availableProviders"));
        })
    deliveryDate = allDates[0];
    $w("#deliveryDate").text = timeManager.dateDisplay(deliveryDate);
}

function countAvailableProviders(dateString) {
    return wixData.query("ProviderList")
        .eq(timeManager.getDayOfWeekEN(dateString), true)
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

