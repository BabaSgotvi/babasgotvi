import wixLocationFrontend from "wix-location-frontend";
import wixLocation from "wix-location";
import wixData from "wix-data";
let orderId;
let order;
let itemIds;
let takeawayTime;
let earnAmount;
$w.onReady(async function () {
    $w("#itemBox").collapse(); // collapse all itemBoxes
    orderId = wixLocationFrontend.query.id;
    if (orderId == undefined) {
        wixLocation.to("/");
    }
    order = await wixData.query("UpcomingOrders").eq("_id", orderId).find();
    itemIds = order.items[0].ids;
    takeawayTime = order.items[0].takeawayTime;
    let price = order.items[0].price;
    earnAmount = Math.round(price * 75 / 100);
    earnAmount /= 100; // turn from cents to lvs
    filterRepeater();
    displayInfo();
});
function filterRepeater() {
    $w("#orderItemsRepeater").forEachItem(($w, itemData) => {
        itemIds.forEach((itemId) => {
            if (itemData._id == itemId) {
                $w("#itemBox").expand();
            }
        });
    });
}
function displayInfo() {
    $w("#takeawayTime").text = "Час на взимане: " + takeawayTime;
    $w("#earnAmount").text = "Печелите: " + earnAmount + " лв.";
}