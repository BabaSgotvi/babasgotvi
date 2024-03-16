import { local, session, memory } from "wix-storage-frontend";
import wixWindowFrontend from 'wix-window-frontend';

let previewFood;
let portionSizes;
let portionSize;
let amount;
let initAmount;
let maxAmount;
const infoStates = {
    ingredients: 0,
    description: 1
}
let infoState = infoStates.ingredients;
$w.onReady(function () {
    $w("#image").src = session.getItem("previewImage");
    $w("#name").text = session.getItem("previewName");
    amount = initAmount = session.getItem("previewAmount");
    maxAmount = session.getItem("previewMaxAmount");
    amountCheck();
    let isDashBoardPreview = session.getItem("isDashBoardPreview");
    if (isDashBoardPreview == "true") {
        $w("#addToCartButton").disable();
    } else {
        $w("#addToCartButton").enable();
    }
    displayFoodInfo();
    const price = session.getItem("previewPrice");
    const portionSizes = session.getItem("previewPortionSizes").split(", ");
    const portionSizesData = portionSizes.map((portionSize, index) => ({
        _id: `portion${index}`, // Unique ID for each portion size item
        portionSize: portionSize // Data property containing the portion size
    }));

    $w("#repeater1").data = portionSizesData;
    $w("#repeater1").forEachItem(($w, itemData, index) => {
        $w("#sizeandprice").text = itemData.portionSize + " гр. | " + price + " лв.";
    });
});

function displayFoodInfo() {
    if (infoState == infoStates.ingredients) {
        $w("#info").text = "" + session.getItem("previewIngredients");
        $w("#ingredientsButton").disable();
        $w("#descriptionButton").enable();
    } else {
        $w("#info").text = "" + session.getItem("previewDescription");
        $w("#descriptionButton").disable();
        $w("#ingredientsButton").enable();
    }
}
$w("#ingredientsButton").onClick(() => {
    infoState = infoStates.ingredients;
    displayFoodInfo();
});
$w("#descriptionButton").onClick(() => {
    infoState = infoStates.description;
    displayFoodInfo();
});
$w("#plusButton").onClick(() => {
    amount++;
    amountCheck();
    $w("#minusButton").enable();

});
$w("#minusButton").onClick(() => {
    amount--;
    amountCheck();
    $w("#plusButton").enable();
});

function amountCheck() {
    if (amount <= 1 || amount == "undefined" || amount == "null") {
        console.log("Here!");
        amount = 1;
        $w("#minusButton").disable();
    }
    if (amount >= maxAmount) {
        amount = maxAmount;
        $w("#plusButton").disable();
    }
    $w("#foodAmountText").text = "" + amount;
}
$w("#addToCartButton").onClick(() => {
    wixWindowFrontend.lightbox.close(amount);
});
$w("#closeButton").onClick(() => {
    wixWindowFrontend.lightbox.close(initAmount);
});