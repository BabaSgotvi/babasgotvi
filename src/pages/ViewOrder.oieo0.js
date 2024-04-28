import wixLocationFrontend from "wix-location-frontend";
import wixLocation from "wix-location";
import wixData from "wix-data";
import * as tools from "public/tools";
let orderId;
let order;
let itemIds;
let takeawayDate;
let takeawayTime;
let earnAmount;
let status;
let amounts;
$w.onReady(async function () {
    $w("#itemBox").collapse(); // collapse all itemBoxes
    await retrieveData();
    filterRepeater();
    displayInfo();
});
function filterRepeater() {
    $w("#orderItemsRepeater").forEachItem(($w, itemData) => {
        $w("#itemBox").collapse();
        itemIds.forEach((itemId, index) => {
            if (itemData._id == itemId) {
                $w("#itemBox").expand();
                $w("#amountText").text = amounts[index] + " бр.";
            }
        });
    });
}
function displayInfo() {
    if (status == "upcoming") {
        $w("#status").text = "статут: Предстои";
    }
    else if (status == "completed") {
        $w("#status").text = "статут: Завършена";
    }
    else if (status == "error") {
        $w("#status").text = "статут: Проблем";
    }
    let untilOrder = tools.calculateTimeDifference(takeawayDate, takeawayTime);
    let daysText = "";
    let hoursText = "";
    let minutesText = "";
    if (untilOrder.days == 1) {
        daysText = untilOrder.days + " ден, ";
    }
    else if (untilOrder.days > 1) {
        daysText = untilOrder.days + " дена, ";
    }
    if (untilOrder.hours == 1) {
        hoursText = untilOrder.hours + " час, ";
    }
    else if (untilOrder.hours > 1) {
        hoursText = untilOrder.hours + " часа, ";
    }
    if (untilOrder.minutes == 1) {
        minutesText = untilOrder.minutes + " минута";
    }
    else if (untilOrder.minutes > 1) {
        minutesText = untilOrder.minutes + " минути";
    }
    $w("#untilOrder").text = daysText + hoursText + minutesText + " до взимане на поръчката";
    $w("#takeawayDateTime").text = takeawayTime + ", " + takeawayDate + " ( " + tools.getDayOfWeek(takeawayDate, "BG", false) + " )";
}
setInterval(displayInfo, 1000);
async function retrieveData() {
    orderId = wixLocationFrontend.query.Id;
    if (orderId == undefined) {
        wixLocation.to("/");
    }
    order = await wixData.query("UpcomingOrders").eq("_id", orderId).find();
    if (order.items.length <= 0) {
        wixLocation.to("/providerdashboard");
    }
    itemIds = order.items[0].ids;
    takeawayTime = order.items[0].takeawayTime;
    takeawayDate = order.items[0].date;
    let price = order.items[0].price;
    earnAmount = Math.round(price * 75 / 100);
    earnAmount /= 100; // turn from cents to lvs
    status = order.items[0].status;
    amounts = order.items[0].amounts;

}