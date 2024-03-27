import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from 'wix-window';
let srcHasBeenChanged = false;
let account;
let editMode;
let foodId;
let portionSize;
let availableDays = {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false
}

$w.onReady(async function () {
    await validateAndRetrieveData();
    validateChangeButton();
    toUnav("mon"); toUnav("tue"); toUnav("wed"); toUnav("thu"); toUnav("fri"); toUnav("sat"); toUnav("sun");
});
$w("#uploadFoodImageButton").onChange(uploadFoodImage);
$w("#saveFoodButton").onClick(saveFood);

function uploadFoodImage() {
    if ($w("#uploadFoodImageButton").value.length > 0) {
        $w("#uploadFoodImageButton")
            .uploadFiles()
            .then((uploadedFiles) => {
                $w("#foodImage").src = uploadedFiles[0].fileUrl;
                srcHasBeenChanged = true;
                validateChangeButton();
            });
    }
}
function saveFood() {
    if (validateChangeButton()) {
        const savedFood = {
            _id: foodId,
            title: $w("#foodNameInput").value,
            image: $w("#foodImage").src,
            description: $w("#foodDescriptionInput").value,
            ingredients: $w("#foodIngredientsInput").value,
            price: cleanedPrice,
            maxPerDay: $w("#foodMaxOrdersPerDay").value,
            owner: account._id,
            rating: "5.00",
            portionSize: portionSize,
            type: $w("#foodTypeDropdown").value,
            monday: $w("#monUnav").collapsed,
            tuesday: $w("#tueUnav").collapsed,
            wednesday: $w("#wedUnav").collapsed,
            thursday: $w("#thuUnav").collapsed,
            friday: $w("#friUnav").collapsed,
            saturday: $w("#satUnav").collapsed,
            sunday: $w("#sunUnav").collapsed
        };

        // Add the new item to the CMS collection
        wixData.save("FoodList", savedFood)
            .then((results) => {
                wixLocation.to("/providerdashboard");
            })
            .catch((error) => {

            });
    } else {
        // Handle invalid food creation scenario
    }
}

function validateChangeButton() {
    if (isNotEmpty("#foodNameInput") && isNotEmpty("#foodDescriptionInput") && isNotEmpty("#foodIngredientsInput")
        && isNotEmpty("#foodPortionSizeInput") && isNotEmpty("#foodPriceInput") && isNotEmpty("#foodMaxOrdersPerDay")
        && srcHasBeenChanged) {
        if (availableDays["mon"] || availableDays["tue"] || availableDays["wed"] || availableDays["thu"] || availableDays["fri"] || availableDays["sat"] || availableDays["sun"]) {
            $w("#saveFoodButton").enable();
            return true;
        }
        else {
            $w("#saveFoodButton").disable();
            return false;
        }
    } else {
        $w("#saveFoodButton").disable();
        return false;
    }
}


function isNotEmpty(id) {
    return $w(id).value !== undefined && $w(id).value !== null && $w(id).value !== "";
}
$w("#foodNameInput").onChange(() => {
    validateChangeButton();
});
$w("#foodDescriptionInput").onChange(() => {
    validateChangeButton();
});
$w("#foodPortionSizeInput").onChange(() => {
    validateChangeButton();
});
$w("#foodPriceInput").onChange(() => {
    validateChangeButton();
});
$w("#foodMaxOrdersPerDay").onChange(() => {
    validateChangeButton();
});
$w("#foodIngredientsInput").onChange(() => {
    validateChangeButton();
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
    validateChangeButton();
}
function toUnav(day) {
    // @ts-ignore
    $w("#" + day + "Av").collapse();
    // @ts-ignore
    $w("#" + day + "Unav").expand();
    availableDays[day] = false;
    validateChangeButton();
}
$w("#foodPortionSizeInput").onFocus(() => {
    $w("#foodPortionSizeInput").value = portionSize;
});

$w("#foodPortionSizeInput").onBlur(() => {
    portionSize = $w("#foodPortionSizeInput").value.replace(/[^0-9]/g, "");
    if (portionSize.length > 0)
        $w("#foodPortionSizeInput").value = portionSize + " гр.";
    else {
        $w("#foodPortionSizeInput").value = portionSize;
    }
});

$w("#foodMaxOrdersPerDay").onBlur(() => {
    $w("#foodMaxOrdersPerDay").value = $w("#foodMaxOrdersPerDay").value.replace(/[^0-9]/g, "");
    if ($w("#foodMaxOrdersPerDay").value == "0")
        $w("#foodMaxOrdersPerDay").value == "";
});
let cleanedPrice = "";
$w("#priceBreakdownBox").collapse();
$w("#foodPriceInput").onFocus(() => {
    if (cleanedPrice != "0.00")
        $w("#foodPriceInput").value = cleanedPrice;
    else
        $w("#foodPriceInput").value = "";
});

$w("#foodPriceInput").onBlur(() => {
    cleanedPrice = charmPricing($w("#foodPriceInput").value.replace(/[^\d,.]/g, ""));
    if (cleanedPrice.length > 0 && cleanedPrice != "0.00") {
        $w("#foodPriceInput").value = cleanedPrice + " лв.";
        $w("#priceBreakdownBox").expand();
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
        $w("#priceBreakdownBox").collapse();
    }
    validateChangeButton();
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

function validateAccount() {
    return new Promise((resolve, reject) => {
        const accountKey = local.getItem("accountKey");
        if (accountKey == null) {
            wixLocation.to("/");
            reject("Account key is null."); // Reject the promise if there's no accountKey
        } else {
            wixData.query("ProviderList")
                .eq("accountKey", accountKey)
                .find()
                .then((results) => {
                    if (results.items.length > 0) {
                        account = results.items[0];
                        resolve(account); // Resolve the promise with the account
                    } else {
                        wixLocation.to("/");
                        reject("No account found."); // Reject the promise if no account is found
                    }
                })
                .catch((error) => {
                    wixLocation.to("/");
                    reject(error); // Reject the promise on error
                });
        }
    });
}
function retrieveData() {
    editMode = session.getItem("editMode");
    foodId = session.getItem("editFoodId");
    if (foodId == null || foodId == undefined || foodId == "") {
        foodId = account._id + generateId(25);
    }
    if (editMode == "true") {
        wixData.get("FoodList", foodId)
            .then((result) => {
                $w("#foodNameInput").value = result.title;
                $w("#foodImage").src = result.image;
                $w("#foodDescriptionInput").value = result.description;
                $w("#foodIngredientsInput").value = result.ingredients;
                cleanedPrice = $w("#foodPriceInput").value = result.price;
                $w("#foodMaxOrdersPerDay").value = result.maxPerDay;
                $w("#foodPortionSizeInput").value = result.portionSize;
                $w("#foodTypeDropdown").value = result.type;
                collapseOrExpand("mon", result.monday);
                collapseOrExpand("tue", result.tuesday);
                collapseOrExpand("wed", result.wednesday);
                collapseOrExpand("thu", result.thursday);
                collapseOrExpand("fri", result.friday);
                collapseOrExpand("sat", result.saturday);
                collapseOrExpand("sun", result.sunday);
                srcHasBeenChanged = true;
            })
            .catch((error) => {
                console.error(error);
            });
    }
}
async function validateAndRetrieveData() {
    try {
        await validateAccount();
        retrieveData();
    } catch (error) {
        console.error(error);
    }
}
function collapseOrExpand(day, expand) {
    console.log("day: " + day + "; expand: " + expand);
    if (expand) {
        // @ts-ignore
        $w("#" + day + "Av").expand();
        // @ts-ignore
        $w("#" + day + "Unav").collapse();
    }
    else {
        // @ts-ignore
        $w("#" + day + "Unav").expand();
        // @ts-ignore
        $w("#" + day + "Av").collapse();
    }
    availableDays[day] = expand;
}
function generateId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}