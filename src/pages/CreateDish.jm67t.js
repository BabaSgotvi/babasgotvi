// This script handles the creation of a food item including uploading an image and validating input fields.

import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from 'wix-window';
let srcHasBeenChanged = false;
$w.onReady(function () {
    isValidForCreation();
    console.log("src: " + $w("#foodImage").src);
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
        $w("#createFoodButton").enable();
        return true;
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