import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from 'wix-window';
let account;
const sections = {
    orders: 1,
    menu: 2,
    account: 3,
    buy: 4
};
let currentSection = sections.orders;
$w.onReady(function () {
    let doTour = local.getItem("tour");
    if (doTour == "doTour")
        Tour();
    validateAccount();
    changeSection();
    $w("#sendToLiveMenu").onClick(() => {
        wixLocation.to('/menu?Id=' + account._id);
    });
    $w("#menuRepeaterDashboard").onItemReady(($w, itemData, index) => {
        $w("#previewButton").onClick(() => {
            session.removeItem("previewFoodId");
            session.setItem("previewFoodId", itemData._id);
        })
    });
    $w("#logoutButton").onClick(() => {
        local.removeItem("accountKey");
        wixLocation.to("/");
    });
    $w("#deleteAccountButton").onClick(async () => {
        // TODO:
        // add confirmation message
        // add second confirmation message
        let confirmation = await wixWindow.openLightbox("ConfirmDelete");
        if (confirmation == "proceedDeletion") {
            await wixData.remove("ProviderList", account._id);
            const query = wixData.query("FoodList").eq("owner", account._id);
            const results = await query.find();
            if (results.items.length > 0) {
                const foodIds = results.items.map(food => food._id);
                await wixData.bulkRemove("FoodList", foodIds);
            }
            local.removeItem("accountKey");
            wixLocation.to("/");
        }
    });
});

function validateAccount() {
    const accountKey = local.getItem("accountKey");
    if (accountKey == null || accountKey == undefined) {
        wixLocation.to("/");
    } else {
        wixData.query("ProviderList")
            .eq("accountKey", accountKey)
            .find()
            .then((results) => {
                if (results.items.length > 0) {
                    account = results.items[0];
                    updateProfile(); // Call updateProfile() after account data is fetched
                } else {
                    wixLocation.to("/");
                }
            })
            .catch((error) => {
                wixLocation.to("/");
            });
    }
    console.log("validated!");
}

function changeSection() {
    switch (currentSection) {
        case sections.orders:
            $w("#ordersSection").expand();
            $w("#menuSection").collapse();
            $w("#accountSection").collapse();
            $w("#buySection").collapse();
            break;
        case sections.menu:
            $w("#menuSection").expand();
            $w("#ordersSection").collapse();
            $w("#accountSection").collapse();
            $w("#buySection").collapse();
            break;
        case sections.account:
            $w("#accountSection").expand();
            $w("#ordersSection").collapse();
            $w("#menuSection").collapse();
            $w("#buySection").collapse();
            break;
        case sections.buy:
            $w("#buySection").expand();
            $w("#accountSection").collapse();
            $w("#ordersSection").collapse();
            $w("#menuSection").collapse();
            break;
    }
}
$w("#ordersSectionButton").onClick(() => {
    currentSection = sections.orders;
    changeSection();
});
$w("#menuSectionButton").onClick(() => {
    currentSection = sections.menu;
    changeSection();
});
$w("#accountSectionButton").onClick(() => {
    currentSection = sections.account;
    changeSection();
});
$w("#buySectionButton").onClick(() => {
    currentSection = sections.buy;
    changeSection();
});

function Tour() {

}

function updateProfile() {
    console.log("ACCOUNT: " + account);
    console.log("updating profile: last name: " + account.title + " " + account.lastName);
    $w("#profileName").text = account.title + " " + account.lastName;
    if (account.profilePic != null || account.profilePic != undefined)
        $w("#profilePic").src = account.profilePic;
}

$w("#profilePicUploadButton").onChange(() => {
    if ($w("#profilePicUploadButton").value.length > 0) {
        $w("#profilePicUploadButton")
            .uploadFiles()
            .then((uploadedFiles) => {
                $w("#profilePic").src = uploadedFiles[0].fileUrl;
                let changed = account;
                changed.profilePic = uploadedFiles[0].fileUrl;
                wixData.save("ProviderList", changed);
            })
    }
});