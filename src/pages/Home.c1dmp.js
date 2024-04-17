import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import * as tools from 'public/tools';

let allDates;
let deliveryDate;
//
initializeVars();
forEachItemsInRepeater();
//
function forEachItemsInRepeater() {
    $w("#providerRepeater").onItemReady(($w, itemData) => {
        $w("#providerBox").onClick(null); // Remove any existing onClick event handler from #providerBox
        $w("#providerBox").onClick(() => {
            wixLocation.to('/menu?Id=' + itemData._id);
        });
        if (itemData.validForDisplay == true) {
            $w("#providerBox").expand();
        }
        else {
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
    });
}
function refreshFilter() {
    // console.log("refreshing filter");
    // $w("#providerList").setFilter(wixData.filter()); // this clears the filters
    // $w("#providerList").setFilter(wixData.filter().eq(tools.getDayOfWeek(deliveryDate, "EN", false), true));
    // $w("#providerList").setFilter(wixData.filter().eq("validForDisplay", true));
    // $w("#providerList").refresh();
}
function initializeVars() {
    console.log("Initializing vars");
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
    forEachItemsInRepeater();
    $w("#deliveryDate").text = tools.dateDisplay("" + deliveryDate);
})
$w("#deliveryDate").onClick(async () => {
    deliveryDate = await wixWindow.openLightbox("DatePick");
    forEachItemsInRepeater();
    $w("#deliveryDate").text = tools.dateDisplay("" + deliveryDate);
});


//
/// TODO: ADD ORDER CUTOFF TIME FILTERING
//