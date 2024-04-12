import { local, session, memory } from "wix-storage-frontend";
import * as Pay from 'backend/Pay';
import * as stripeAPI from "public/stripeAPI";
import wixLocation from 'wix-location';
import wixData from 'wix-data';
import * as timeManager from 'public/timeManager';

//
let ids = [];
let amounts = [];
function retrieveCart() {
    ids = JSON.parse(session.getItem("CheckoutIds"));
    amounts = JSON.parse(session.getItem("CheckoutAmounts"));
}
async function displayCart() {
    $w("#errorMessage").collapse();
    $w("#totalPrice").text = session.getItem("totalPrice") + " лв.";
    $w("#PayNowButton").label = "Плати " + session.getItem("totalPrice") + " лв.";
}

$w.onReady(async function () {
    console.log("script is running");
    retrieveCart();
    displayCart();
    retrieveInputs();
    // iterateFocus();
    $w("#date").disable();
    $w("#date").value = timeManager.getDayOfWeek(session.getItem("selectedDay"), "BG", false) + " " + session.getItem("selectedDay");
    const hours = await retrieveHours(session.getItem("providerId"));
    $w("#time").options = hours;
});
$w("#address1").onCustomValidation((value, reject) => {
    let fullAddress = value;

    function GetPropertyValue(obj1, dataToRetrieve) {
        return dataToRetrieve
            .split(".") // split string based on `.`
            .reduce(function (o, k) {
                return o && o[k]; // get inner property if `o` is defined else get `o` and return
            }, obj1); // set initial value as object
    }

    let location = GetPropertyValue(fullAddress, "location");

    if (location === undefined) {
        reject("Please select an address option only.");
    }
});
$w("#PayNowButton").onClick(() => {
    payNow();
});

export function payNow() {
    if (!allRequiredInputsAreValid()) {
        $w("#errorMessage").expand();
        $w("#errorMessage").text = "Моля попълнете всички задължителни полета (тези със звездичка *) правилно.";
        return;
    }
    $w("#errorMessage").collapse();
    $w("#PayNowButton").label = "Обработване...";
    $w("#PayNowButton").disable();
    saveInputsToLocal();
    const orderObj =
    {
        "ids": ids,
        "amounts": amounts,
        "cardholder": $w("#cardholder").value,
        "email": $w("#email").value,
        "phonenum": $w("#phonenum").value,
        "providerId": session.getItem("providerId"),
        "address1": $w("#address1").value,
        "address2": $w("#address2").value,
        "instructions": $w("#instructions").value,
        "date": session.getItem("selectedDay"),
        "time": $w("#time").value,
    }
    stripeAPI.createToken(stripeAPI.encodeCard(createCard()))
        .then((token) => {
            Pay.charge(token, orderObj)
                .then((response) => {
                    if (response.chargeId) {
                        console.log("Payment Successful");
                        $w("#PayNowButton").label = "Готово!";
                        wixLocation.to("/thankyou");
                    }
                    else {
                        $w("#PayNowButton").label = "Плати " + session.getItem("totalPrice") + " лв.";
                        $w("#PayNowButton").enable();
                        $w("#errorMessage").text = "Възникна проблем: " + response.error;
                        $w("#errorMessage").expand();
                        console.log(response.error);
                    }
                });
        });
}


function createCard() {
    let { month, year } = splitExpirationDate($w("#expiration").value);
    return {
        // @ts-ignore
        "name": $w("#cardholder").value,
        // @ts-ignore
        "number": $w("#cardnum").value,
        // @ts-ignore
        "cvc": $w("#cvc").value,
        // @ts-ignore
        "exp_year": year,
        // @ts-ignore
        "exp_month": month
    };
}
function saveInputsToLocal() {
    local.setItem("address1", JSON.stringify($w("#address1").value));
    local.setItem("address2", $w("#address2").value);
    local.setItem("instructions", $w("#instructions").value);
    local.setItem("cardholder", $w("#cardholder").value);
    local.setItem("cardnum", $w("#cardnum").value);
    local.setItem("cvc", $w("#cvc").value);
    local.setItem("expiration", $w("#expiration").value);
    local.setItem("email", $w("#email").value);
    local.setItem("phonenum", $w("#phonenum").value);
    local.setItem("inputsSaved", "true");

}
function retrieveInputs() {
    if (local.getItem("inputsSaved") == "true") {
        $w("#address1").value = JSON.parse(local.getItem("address1"));
        $w("#address2").value = local.getItem("address2");
        $w("#instructions").value = local.getItem("instructions");
        $w("#cardholder").value = local.getItem("cardholder");
        $w("#cardnum").value = local.getItem("cardnum");
        $w("#cvc").value = local.getItem("cvc");
        $w("#expiration").value = local.getItem("expiration");
        $w("#email").value = local.getItem("email");
        $w("#phonenum").value = local.getItem("phonenum");
    }
}

function splitExpirationDate(date) {
    const [month, year] = date.split('/');
    return { month, year };
}

async function retrieveHours(providerId) {
    const provider = await wixData.query("ProviderList").eq("_id", providerId).find();
    const availableHours = provider.items[0].availableHours;
    const availableHoursArray = availableHours.split(",");
    return availableHoursArray.map(hour => ({
        label: " ≈ " + hour, value: hour
    }));
}

$w("#returnToMenu").onClick(() => {
    wixLocation.to('/menu?Id=' + session.getItem("providerId"));
});


function allRequiredInputsAreValid() {
    // the function is SUPER BASIC at the moment. But I can't afford to spend time on a fancy soultion, so this will do fine for now.
    return $w("#address1").valid && $w("#time").valid && $w("#cardholder").valid && $w("#cardnum").valid && $w("#cvc").valid && $w("#expiration").valid && $w("#email").valid && $w("#phonenum").valid;
}
// let done = 0;
// function iterateFocus() {
//     switch (done) {
//         case 0:
//             $w("#address1").focus();
//             console.log("address1 focused");
//             done++;
//             break;
//         case 1:
//             $w("#address2").focus();
//             console.log("address2 focused");
//             done++;
//             break;
//         case 3:
//             $w("#instructions").focus();
//             console.log("instructions focused");
//             done++;
//             break;
//         case 4:
//             $w("#time").focus();
//             console.log("time focused");
//             done++;
//             break;
//         case 5:
//             $w("#phonenum").focus();
//             console.log("phonenum focused");
//             done++;
//             break;
//         case 6:
//             $w("#email").focus();
//             console.log("email focused");
//             done++;
//             break;
//         case 7:
//             $w("#cardholder").focus();
//             console.log("cardholder focused");
//             done++;
//             break;
//         case 8:
//             $w("#cardnum").focus();
//             console.log("cardnum focused");
//             done++;
//             break;
//         case 9:
//             $w("#expiration").focus();
//             console.log("expiration focused");
//             done++;
//             break;
//         case 10:
//             $w("#cvc").focus();
//             console.log("cvc focused");
//             done++;
//             break;
//     }
// }

// $w("#address1").onBlur(() => {
//     iterateFocus();
// });
// $w("#address2").onBlur(() => {
//     iterateFocus();
// });
// $w("#instructions").onBlur(() => {
//     iterateFocus();
// });
// $w("#time").onBlur(() => {
//     iterateFocus();
// });
// $w("#phonenum").onBlur(() => {
//     iterateFocus();
// });
// $w("#email").onBlur(() => {
//     iterateFocus();
// });
// $w("#cardholder").onBlur(() => {
//     iterateFocus();
// });
// $w("#cardnum").onBlur(() => {
//     iterateFocus();
// });
// $w("#expiration").onBlur(() => {
//     iterateFocus();
// });
// $w("#cvc").onBlur(() => {
//     iterateFocus();
// });
