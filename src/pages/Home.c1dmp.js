import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import * as tools from 'public/tools';

let allDates;
let deliveryDate;
let dateHasBeenPicked = false;
$w("#providerList").onReady(() => {
    if (!dateHasBeenPicked) {
        console.log("line 12 to 15!");
        initializeElements();
        refreshListed();
    }
});
$w("#providerRepeater").onItemReady(($w, itemData) => {
    if (itemData.validForDisplay == false) {
        $w("#providerBox").collapse();
        return;
    }
    switch (tools.getDayOfWeek(deliveryDate, "EN", false)) {
        case "monday":
            if (itemData.monday == false) {
                $w("#providerBox").collapse();
            }
            return;
        case "tuesday":
            if (itemData.tuesday == false) {
                $w("#providerBox").collapse();
            }
            return;
        case "wednesday":
            if (itemData.wednesday == false) {
                $w("#providerBox").collapse();
            }
            return;
        case "thursday":
            if (itemData.thursday == false) {
                $w("#providerBox").collapse();
            }
            return;
        case "friday":
            if (itemData.friday == false) {
                $w("#providerBox").collapse();
            }
            return;
        case "saturday":
            if (itemData.saturday == false) {
                $w("#providerBox").collapse();
            }
            return;
        case "sunday":
            if (itemData.sunday == false) {
                $w("#providerBox").collapse();
            }
            return;
    }
    $w("#providerBox").onClick(() => {
        let providerId = itemData._id;
        wixLocation.to('/menu?Id=' + providerId);
    });
})
function refreshListed() {
    $w("#providerList").setFilter(wixData.filter()); // this clears the filters
    $w("#providerList").setFilter(wixData.filter().eq(tools.getDayOfWeek(deliveryDate, "EN", false), true));
    $w("#providerList").setFilter(wixData.filter().eq("validForDisplay", true));
    $w("#providerList").refresh();
}
function initializeElements() {
    allDates = tools.getNextTwoWeeks();
    session.setItem("allDates", allDates);
    let promises = allDates.map(date => tools.countAvailableProviders(date));
    Promise.all(promises)
        .then(counts => {
            let availableProviders = counts.map(count => count.toString());
            session.setItem("availableProviders", availableProviders);
        })
    deliveryDate = allDates[0];
    $w("#deliveryDate").text = tools.dateDisplay("" + deliveryDate);
    if (session.getItem("selectedDay") == null && session.getItem("selectedDay") == undefined) {
        session.setItem("selectedDay", allDates[0]);
    }
}



$w("#text7").onClick(async () => {
    deliveryDate = await wixWindow.openLightbox("DatePick");
    dateHasBeenPicked = true;
    $w("#deliveryDate").text = tools.dateDisplay("" + deliveryDate);
    // refreshListed();
    $w("#providerList").setFilter(wixData.filter()); // this clears the filters
    // $w("#providerList").setFilter(wixData.filter().eq(tools.getDayOfWeek(deliveryDate, "EN", false), true));
    // $w("#providerList").setFilter(wixData.filter().eq("validForDisplay", true));
    $w("#providerList").refresh();
})
$w("#deliveryDate").onClick(async () => {
    deliveryDate = await wixWindow.openLightbox("DatePick");
    dateHasBeenPicked = true;
    $w("#deliveryDate").text = tools.dateDisplay("" + deliveryDate);
    // refreshListed();
    $w("#providerList").setFilter(wixData.filter()); // this clears the filters
    // $w("#providerList").setFilter(wixData.filter().eq(tools.getDayOfWeek(deliveryDate, "EN", false), true));
    // $w("#providerList").setFilter(wixData.filter().eq("validForDisplay", true));
    $w("#providerList").refresh();
});


//
/// TODO: ADD ORDER CUTOFF TIME FILTERING
//