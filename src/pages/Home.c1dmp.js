import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import * as tools from 'public/tools';

let allDates;
let deliveryDate;
setContinuousRefresh();
initializeVars();
forEachItemsInRepeater();

function setContinuousRefresh() {
    clearInterval(parseInt(session.getItem("intervalId")));
    const intervalId = setInterval(() => {
        console.log("refreshing");
        forEachItemsInRepeater();
    }, tools.convertTime(1, "minutes", "milliseconds"));
    session.setItem("intervalId", intervalId);
}
function forEachItemsInRepeater() {
    const cutoff = tools.isInCutoff(deliveryDate);
    $w("#providerRepeater").onItemReady(($w, itemData) => {
        if (cutoff < itemData.orderCutoff) { // cutoff time exceeded
            $w("#providerBox").collapse();
            return;
        }
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
                if (itemData.monday != true)
                    $w("#providerBox").collapse();
                return;
            case "tuesday":
                if (itemData.tuesday != true)
                    $w("#providerBox").collapse();
                return;
            case "wednesday":
                if (itemData.wednesday != true)
                    $w("#providerBox").collapse();
                return;
            case "thursday":
                if (itemData.thursday != true)
                    $w("#providerBox").collapse();
                return;
            case "friday":
                if (itemData.friday != true)
                    $w("#providerBox").collapse();
                return;
            case "saturday":
                if (itemData.saturday != true)
                    $w("#providerBox").collapse();
                return;
            case "sunday":
                if (itemData.sunday != true)
                    $w("#providerBox").collapse();
                return;
        }
    });
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
    if (session.getItem("deliveryDate") == null && session.getItem("deliveryDate") == undefined) {
        session.setItem("deliveryDate", allDates[0]);
    }
}



const updateDeliveryDate = async () => {
    deliveryDate = (await wixWindow.openLightbox("DatePick")) || deliveryDate;
    session.setItem("deliveryDate", deliveryDate);
    forEachItemsInRepeater();
    $w("#deliveryDate").text = tools.dateDisplay("" + deliveryDate);
};

$w("#text7").onClick(updateDeliveryDate);
$w("#deliveryDate").onClick(updateDeliveryDate);


//
/// TODO: ADD ORDER CUTOFF TIME FILTERING
//