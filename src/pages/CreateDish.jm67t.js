// This script handles the creation of a food item including uploading an image and validating input fields.

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
    if (isNotEmpty("#foodNameInput") && isNotEmpty("#foodDescriptionInput") && isNotEmpty("#foodPortionSizeInput") && isNotEmpty("#foodPriceInput") && isNotEmpty("#foodMaxOrdersPerDay") && $w("#foodMaxOrdersPerDay").value !== "0" && srcHasBeenChanged) {
        if (availableDays["mon"] || availableDays["tue"] || availableDays["wed"] || availableDays["thu"] || availableDays["fri"] || availableDays["sat"] || availableDays["sun"]) {
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
    $w("#" + day + "Unav").collapse();
    $w("#" + day + "Av").expand();
    availableDays[day] = true;
    isValidForCreation();
}
function toUnav(day) {
    $w("#" + day + "Av").collapse();
    $w("#" + day + "Unav").expand();
    availableDays[day] = false;
    isValidForCreation();
}