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
//
$w.onReady(async function () {
    await validateAccount();
    let doTour = local.getItem("tour");
    if (doTour == "doTour")
        Tour();
    changeSection();
    displayProfile();
    $w("#FoodList").setFilter(wixData.filter().eq("owner", account._id)); // account is undefined
    // TODO: FIX ASYNC OF VALIDATEACCOUNT() AND FIX UNDEFINED ISSUE
    $w("#FoodList").refresh();
    $w("#menuRepeaterDashboard").onItemReady(($w, itemData, index) => {

    });
});

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

function displayProfile() {
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
$w("#sendToLiveMenu").onClick(() => {
    wixLocation.to('/menu?Id=' + account._id);
});
$w("#logoutButton").onClick(() => {
    local.removeItem("accountKey");
    wixLocation.to("/");
});
$w("#deleteAccountButton").onClick(async () => {
    let confirmation = await wixWindow.openLightbox("ConfirmDelete");
    if (confirmation == "confirmed") {
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