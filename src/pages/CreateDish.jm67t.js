import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from 'wix-window';

$w("#uploadFoodImageButton").onChange(() => {
    if ($w("#uploadFoodImageButton").value.length > 0) {
        $w("#uploadFoodImageButton")
            .uploadFiles()
            .then((uploadedFiles) => {
                $w("#foodImage").src = uploadedFiles[0].fileUrl;
                // let changed = account;
                // changed.profilePic = uploadedFiles[0].fileUrl;
                // wixData.save("ProviderList", changed);
            })
        console.log(" ");

    }
});