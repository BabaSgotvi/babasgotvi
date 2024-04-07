import { local, session, memory } from "wix-storage-frontend";
import * as Pay from 'backend/Pay';
import * as stripeAPI from "public/stripeAPI";
import wixLocation from 'wix-location';
import wixData from 'wix-data';
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
    $w("#date").disable();
    // $w("#date").label = session.getItem("selectedDate");
    // $w("#date").value = "test label";
    const hours = await retrieveHours(session.getItem("providerId"));
    console.log(hours);
    $w("#time").options = hours;
});

$w("#PayNowButton").onClick(() => {
    $w("#errorMessage").collapse();
    $w("#PayNowButton").label = "Обработване...";
    $w("#PayNowButton").disable();
    payNow();

    console.log("payNow has been executed");
});

export function payNow() {
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
        "date": $w("#date").value,
        "time": $w("#time").value,
    }
    saveInputsToLocal();
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

                        $w("#PayNowButton").label = "Плати";
                        $w("#PayNowButton").enable();
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

//
/// TODO: CHECKOUT
//

//
/// TODO: ADD SEND ORDER TO CMS AND PROVIDER
//

//
/// TODO: ADD CANCELATION
//

async function retrieveHours(providerId) {
    const provider = await wixData.query("ProviderList").eq("_id", providerId).find();
    console.log("provider: " + provider);
    const availableHours = provider.items[0].availableHours;
    // const availableHours = provider.items[0].title;
    console.log("avHours: " + availableHours);
    const availableHoursArray = availableHours.split(",");
    console.log("array " + availableHoursArray);
    return availableHoursArray.map(hour => ({
        label: " ≈ " + hour, value: hour
    }));
}