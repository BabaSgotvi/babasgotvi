import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { local, session, memory } from 'wix-storage';
import * as tools from 'public/tools';

let allDates;
let deliveryDate;
setContinuousRefresh();
initializeVars();
filterProviderRepeater();

function setContinuousRefresh() {
    clearInterval(parseInt(session.getItem("intervalId")));
    const intervalId = setInterval(() => {
        console.log("refreshing");
        filterProviderRepeater();
    }, tools.convertTime(1, "minutes", "milliseconds"));
    session.setItem("intervalId", intervalId);
}

async function filterProviderRepeater() {
    $w("#noProvidersMessage").collapse();
    const shownProviders = await forEachItemsInRepeater();
    console.log("Shown providers: ", shownProviders);
    if (shownProviders == 0) {
        $w("#noProvidersMessage").expand();
    }
}


async function forEachItemsInRepeater() {
    return new Promise((resolve, reject) => {
        const cutoff = tools.isInCutoff(deliveryDate);
        let totalItems = 0;
        let shownProviders = 0;

        $w("#providerRepeater").onItemReady(($w, itemData) => {
            totalItems++;

            $w("#providerBox").onClick(() => {
                wixLocation.to('/menu?Id=' + itemData._id);
            });
            const dayOfWeek = tools.getDayOfWeek(deliveryDate, "EN", false);
            let isDayValid;
            switch (dayOfWeek) {
                case "monday":
                    isDayValid = itemData.monday;
                    break;
                case "tuesday":
                    isDayValid = itemData.tuesday;
                    break;
                case "wednesday":
                    isDayValid = itemData.wednesday;
                    break;
                case "thursday":
                    isDayValid = itemData.thursday;
                    break;
                case "friday":
                    isDayValid = itemData.friday;
                    break;
                case "saturday":
                    isDayValid = itemData.saturday;
                    break;
                case "sunday":
                    isDayValid = itemData.sunday;
                    break;
            }
            if (isDayValid && itemData.validForDisplay && cutoff >= itemData.orderCutoff) {
                shownProviders++;
            } else {
                $w("#providerBox").collapse();
            }

            // If all items are processed, resolve the promise
            if (totalItems === $w("#providerRepeater").data.length) {
                resolve(shownProviders);
            }
        });
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