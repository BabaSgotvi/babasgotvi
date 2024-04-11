import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from 'wix-window';

let account;
const sections = {
    orders: 1,
    menu: 2,
    account: 3,
};
let currentSection = sections.orders;
const cutOffOptions =
{
    threedaysbeforemidnight: 1, // 3 дни преди полунощ
    twodaysbeforenoon: 2, // 2 дни преди обяд
    twodaysbeforemidnight: 3, // 2 дни преди полунощ
    daybeforenoon: 4, // ден преди обяд
    daybeforemidnight: 5, // ден преди полунощ
}
let currentCutOffOption = cutOffOptions.daybeforenoon;
$w.onReady(async function () {
    await validateAccount();
    syncAvaiableDaysWithFood();
    let doTour = local.getItem("tour");
    if (doTour == "doTour")
        Tour();
    retrieveData();
    changeSection();
    displayProfile();
    changeCutOffOption();
    $w("#FoodList").setFilter(wixData.filter().eq("owner", account._id));
    $w("#FoodList").refresh();
    // @ts-ignore
    $w("#menuRepeaterDashboard").onItemReady(($w, itemData, index) => {
        $w("#editFoodButton").onClick(() => {
            session.setItem("editMode", "true");
            session.setItem("editFoodId", itemData._id);
            wixLocation.to("/savedish");
        });
        $w("#deleteFoodButton").onClick(async () => {
            let confirmation = await wixWindow.openLightbox("ConfirmFoodDelete");
            if (confirmation == "confirmed") {
                await wixData.remove("FoodList", itemData._id);
                $w("#FoodList").refresh();
                $w("#foodItemBox").collapse();
            }
        });
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
            break;
        case sections.menu:
            $w("#menuSection").expand();
            $w("#ordersSection").collapse();
            $w("#accountSection").collapse();
            break;
        case sections.account:
            $w("#accountSection").expand();
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
    let confirmation = await wixWindow.openLightbox("ConfirmAccountDelete");
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
$w("#sendToSaveDishButton").onClick(() => {
    session.setItem("editMode", "false");
    session.setItem("editFoodId", "");
    wixLocation.to("/savedish");
});
function changeCutOffOption() {
    switch (currentCutOffOption) {
        case cutOffOptions.threedaysbeforemidnight:
            $w("#threedaysbeforemidnight").disable();
            $w("#twodaysbeforenoon").enable();
            $w("#twodaysbeforemidnight").enable();
            $w("#daybeforenoon").enable();
            $w("#daybeforemidnight").enable();
            break;
        case cutOffOptions.twodaysbeforenoon:
            $w("#threedaysbeforemidnight").enable();
            $w("#twodaysbeforenoon").disable();
            $w("#twodaysbeforemidnight").enable();
            $w("#daybeforenoon").enable();
            $w("#daybeforemidnight").enable();
            break;
        case cutOffOptions.twodaysbeforemidnight:
            $w("#threedaysbeforemidnight").enable();
            $w("#twodaysbeforenoon").enable();
            $w("#twodaysbeforemidnight").disable();
            $w("#daybeforenoon").enable();
            $w("#daybeforemidnight").enable();
            break;
        case cutOffOptions.daybeforenoon:
            $w("#threedaysbeforemidnight").enable();
            $w("#twodaysbeforenoon").enable();
            $w("#twodaysbeforemidnight").enable();
            $w("#daybeforenoon").disable();
            $w("#daybeforemidnight").enable();
            break;
        case cutOffOptions.daybeforemidnight:
            $w("#threedaysbeforemidnight").enable();
            $w("#twodaysbeforenoon").enable();
            $w("#twodaysbeforemidnight").enable();
            $w("#daybeforenoon").enable();
            $w("#daybeforemidnight").disable();
            break;
    }
}
$w("#threedaysbeforemidnight").onClick(() => {
    currentCutOffOption = cutOffOptions.threedaysbeforemidnight;
    saveMenuSettings();
    changeCutOffOption();
});
$w("#twodaysbeforenoon").onClick(() => {
    currentCutOffOption = cutOffOptions.twodaysbeforenoon;
    saveMenuSettings();
    changeCutOffOption();
});
$w("#twodaysbeforemidnight").onClick(() => {
    currentCutOffOption = cutOffOptions.twodaysbeforemidnight;
    saveMenuSettings();
    changeCutOffOption();
});
$w("#daybeforenoon").onClick(() => {
    currentCutOffOption = cutOffOptions.daybeforenoon;
    saveMenuSettings();
    changeCutOffOption();
});
$w("#daybeforemidnight").onClick(() => {
    currentCutOffOption = cutOffOptions.daybeforemidnight;
    saveMenuSettings();
    changeCutOffOption();
});
$w("#maxOrdersPerDayInput").onBlur(() => {
    let amount = parseInt($w("#maxOrdersPerDayInput").value.replace(/[^0-9]/g, ""));
    if (amount == null || amount == undefined || amount <= 0 || isNaN(amount))
        amount = 5;
    else if (amount >= 20)
        amount = 20;
    $w("#maxOrdersPerDayInput").value = "" + amount;
    saveMenuSettings();
});
$w("#maxOrdersPerDayInput").onFocus(() => {
    $w("#maxOrdersPerDayInput").value = $w("#maxOrdersPerDayInput").value.replace(/[^0-9]/g, "");
});
async function saveMenuSettings() {
    let changed = account;
    changed.maxOrdersPerDay = parseInt($w("#maxOrdersPerDayInput").value);
    changed.orderCutoff = currentCutOffOption;
    await wixData.save("ProviderList", changed);
};
function retrieveData() {
    $w("#maxOrdersPerDayInput").value = "" + account.maxOrdersPerDay;
    currentCutOffOption = account.cutOffOption;
}

function syncAvaiableDaysWithFood() {
    let changed = account;
    let monday = false;
    let tuesday = false;
    let wednesday = false;
    let thursday = false;
    let friday = false;
    let saturday = false;
    let sunday = false;
    wixData.query("FoodList")
        .eq("owner", account._id)
        .find()
        .then((results) => {
            results.items.forEach((food) => {
                if (food.monday == true)
                    monday = true;
                if (food.tuesday == true)
                    tuesday = true;
                if (food.wednesday == true)
                    wednesday = true;
                if (food.thursday == true)
                    thursday = true;
                if (food.friday == true)
                    friday = true;
                if (food.saturday == true)
                    saturday = true;
                if (food.sunday == true)
                    sunday = true;
            });
            changed.monday = monday;
            changed.tuesday = tuesday;
            changed.wednesday = wednesday;
            changed.thursday = thursday;
            changed.friday = friday;
            changed.saturday = saturday;
            changed.sunday = sunday;
            wixData.save("ProviderList", changed);
        });
}
function displayBalance() {

}

//
/// TODO: ADD EDITING PROFILE
//
//
/// TODO: ADD CHANGING / RESETING PROFILE DATA ( like password, address, phone number, etc.) using verification messages
//
//

/// TODO: ADD ORDERS
//

//
/// TODO: ADD BALANCE SYSTEM
//

//
/// TODO: ADD NOTIFICATIONS
//

//
/// TODO: ADD BUYING PACKAGING
//

//
/// TODO: ADD TOUR
//

