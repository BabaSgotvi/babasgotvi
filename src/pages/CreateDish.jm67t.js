import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from 'wix-window';
let srcHasBeenChanged = false;
let availableDays = {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false
}
$w.onReady(function () {
    isValidForCreation();
    toUnav("mon"); toUnav("tue"); toUnav("wed"); toUnav("thu"); toUnav("fri"); toUnav("sat"); toUnav("sun");
});
$w("#uploadFoodImageButton").onChange(uploadFoodImage);
$w("#createFoodButton").onClick(createFood);

function uploadFoodImage() {
    if ($w("#uploadFoodImageButton").value.length > 0) {
        $w("#uploadFoodImageButton")
            .uploadFiles()
            .then((uploadedFiles) => {
                $w("#foodImage").src = uploadedFiles[0].fileUrl;
                srcHasBeenChanged = true;
                isValidForCreation();
            });
    }
}

function createFood() {
    if (isValidForCreation()) {
        // Implement food creation logic here
    } else {
        // Handle invalid food creation scenario
    }
}

function isValidForCreation() {
    if (isNotEmpty("#foodNameInput") && isNotEmpty("#foodDescriptionInput") && isNotEmpty("#foodIngredientsInput")
        && isNotEmpty("#foodPortionSizeInput") && isNotEmpty("#foodPriceInput") && isNotEmpty("#foodMaxOrdersPerDay")
        && $w("#foodMaxOrdersPerDay").value !== "0" && srcHasBeenChanged && cleanedPrice != "") {
        if (availableDays["mon"] || availableDays["tue"] || availableDays["wed"] || availableDays["thu"]
            || availableDays["fri"] || availableDays["sat"] || availableDays["sun"]) {
            $w("#createFoodButton").enable();
            return true;
        }
        else {
            $w("#createFoodButton").disable();
            return false;
        }
    } else {
        $w("#createFoodButton").disable();
        return false;
    }
}


function isNotEmpty(id) {
    return $w(id).value !== undefined && $w(id).value !== null && $w(id).value !== "";
}
$w("#foodNameInput").onChange(() => {
    isValidForCreation();
});
$w("#foodDescriptionInput").onChange(() => {
    isValidForCreation();
});
$w("#foodPortionSizeInput").onChange(() => {
    isValidForCreation();
});
$w("#foodPriceInput").onChange(() => {
    isValidForCreation();
});
$w("#foodMaxOrdersPerDay").onChange(() => {
    isValidForCreation();
});
$w("#foodIngredientsInput").onChange(() => {
    isValidForCreation();
})
$w("#monAv").onClick(() => {
    toUnav("mon");
});
$w("#monUnav").onClick(() => {
    toAv("mon");
});
$w("#tueAv").onClick(() => {
    toUnav("tue");
});
$w("#tueUnav").onClick(() => {
    toAv("tue");
});
$w("#wedAv").onClick(() => {
    toUnav("wed");
});
$w("#wedUnav").onClick(() => {
    toAv("wed");
});
$w("#thuAv").onClick(() => {
    toUnav("thu");
});
$w("#thuUnav").onClick(() => {
    toAv("thu");
});
$w("#friAv").onClick(() => {
    toUnav("fri");
});
$w("#friUnav").onClick(() => {
    toAv("fri");
});
$w("#satAv").onClick(() => {
    toUnav("sat");
});
$w("#satUnav").onClick(() => {
    toAv("sat");
});
$w("#sunAv").onClick(() => {
    toUnav("sun");
});
$w("#sunUnav").onClick(() => {
    toAv("sun");
});

function toAv(day) {

    // @ts-ignore
    $w("#" + day + "Unav").collapse();
    // @ts-ignore
    $w("#" + day + "Av").expand();
    availableDays[day] = true;
    isValidForCreation();
}
function toUnav(day) {
    // @ts-ignore
    $w("#" + day + "Av").collapse();
    // @ts-ignore
    $w("#" + day + "Unav").expand();
    availableDays[day] = false;
    isValidForCreation();
}
$w("#foodPortionSizeInput").onFocus(() => {
    $w("#foodPortionSizeInput").value = $w("#foodPortionSizeInput").value.replace(/[^0-9]/g, "");
});

$w("#foodPortionSizeInput").onBlur(() => {
    let cleanedText = $w("#foodPortionSizeInput").value.replace(/[^0-9]/g, "");
    if (cleanedText.length > 0)
        $w("#foodPortionSizeInput").value = cleanedText + " гр.";
    else {
        $w("#foodPortionSizeInput").value = cleanedText;
    }
});
$w("#foodMaxOrdersPerDay").onBlur(() => {
    $w("#foodMaxOrdersPerDay").value = $w("#foodMaxOrdersPerDay").value.replace(/[^0-9]/g, "");
});
let cleanedPrice = "";
$w("#providerSlice").collapse();
$w("#foodPriceInput").onFocus(() => {
    $w("#foodPriceInput").value = cleanedPrice;
});


$w("#foodPriceInput").onBlur(() => {
    let cleanedPrice = charmPricing($w("#foodPriceInput").value.replace(/[^\d,.]/g, ""));
    if (cleanedPrice.length > 0 && cleanedPrice != "0.00") {
        $w("#foodPriceInput").value = cleanedPrice + " лв.";
        $w("#providerSlice").expand();
        let slicedPriceProvider = slicePrice(cleanedPrice, "provider") + " лв.";
        let slicedPriceBabaSgotvi = slicePrice(cleanedPrice, "babasgotvi") + " лв.";
        let slicedPriceOther = slicePrice(cleanedPrice, "other") + " лв.";
        $w("#providerSlice").html = `<span style="font-size: 1.5vw; font-weight: bold;">Печелите <span style="color: #42AF91;">${slicedPriceProvider}</span> от всяка продадена порция!</span>`;
        $w("#babasgotviSlice").html = `<span style="font-size: 1.5vw; font-weight: bold; color: #D2D2D2;">БабаСготви взима ${slicedPriceBabaSgotvi}, за да покрие разходи</span>`;
        $w("#otherSlice").html = `<span style="font-size: 1.5vw; font-weight: bold; color: #D2D2D2;">${slicedPriceOther} отиват за опаковка и доставка</span>`;
    }
    else {
        $w("#foodPriceInput").value = "";
        $w("#providerSlice").text = "";
        $w("#providerSlice").collapse();
    }
    isValidForCreation();
});

function charmPricing(price) {
    // Round the price to two decimal places
    let roundedPrice = Math.round(price * 100) / 100;

    // Determine the cents part of the price
    let cents = Math.round((roundedPrice - Math.floor(roundedPrice)) * 100);

    // Set the charm price based on the cents value
    if (cents <= 25) {
        // Decrease the whole number part by 1 to get the desired charm price
        if (Math.floor(roundedPrice - 1) < 0)
            return "0.00";
        return Math.floor(roundedPrice - 1) + ".99";
    } else if (cents > 25 && cents <= 75) {
        return Math.floor(roundedPrice) + ".49";
    }
    else if (cents > 75) {
        return Math.floor(roundedPrice) + ".99";
    }
}
function slicePrice(price, side) {
    switch (side) {
        case "provider":
            return Number((price * 0.75).toFixed(2));
        case "babasgotvi":
            return Number((price * 0.15).toFixed(2));
        case "other":
            return Number((price * 0.10).toFixed(2));
        default:
            return price;
    }
}