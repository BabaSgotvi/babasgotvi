import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
let account;
const sections = {
    orders: 1,
    menu: 2,
    account: 3,
};
let currentSection = sections.orders;
$w.onReady(function () {
    validateAccount();
    changeSection();

    $w("#logoutButton").onClick(() => {
        local.removeItem("accountKey");
        wixLocation.to("/");
    });
    $w("#sendToLiveMenu").onClick(() => {
        wixLocation.to('/menu?Id=' + account._id);
    });
    $w("#menuRepeaterDashboard").onItemReady(($w, itemData, index) => 
    {
      $w("#previewButton").onClick(() => 
      {
          session.removeItem("previewFoodId");
          session.setItem("previewFoodId", itemData._id);
      })
    });
});

function validateAccount() {
    const accountKey = local.getItem("accountKey");
    if (accountKey == null || accountKey == undefined) {
        wixLocation.to("/");
    } else {
        // Query the "ProviderList" collection for the account with the matching account key
        wixData.query("ProviderList")
            .eq("accountKey", accountKey)
            .find()
            .then((results) => {
                if (results.items.length > 0) {
                    account = results.items[0];
                } else {
                    wixLocation.to("/");
                }
            })
            .catch((error) => {
                // Handle errors
                console.error("Error:", error);
            });
    }
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
$w("#ordersButton").onClick(() => {
    currentSection = sections.orders;
    changeSection();
});
$w("#menuButton").onClick(() => {
    currentSection = sections.menu;
    changeSection();
});
$w("#accountButton").onClick(() => {
    currentSection = sections.account;
    changeSection();
});