// This script handles the creation of a food item including uploading an image and validating input fields.

import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from 'wix-window';

$w("#uploadFoodImageButton").onChange(() => {
    uploadFoodImage();
    isValidForCreation();
});
$w("#createFoodButton").onClick(createFood);

function uploadFoodImage() {
    if ($w("#uploadFoodImageButton").value.length > 0) {
        $w("#uploadFoodImageButton")
            .uploadFiles()
            .then((uploadedFiles) => {
                $w("#foodImage").src = uploadedFiles[0].fileUrl;
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
    if (isNotEmpty("#foodNameInput") && isNotEmpty("#foodDescriptionInput") && isNotEmpty("#foodPortionSizeInput") && isNotEmpty("#foodPriceInput") && isNotEmpty("#foodMaxOrdersPerDay") && $w("#foodMaxOrdersPerDay").value !== "0") {
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