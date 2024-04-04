import { local, session, memory } from "wix-storage-frontend";
import * as stripeProxy from 'backend/stripeProxy';
import * as stripeAPI from "public/stripeAPI";
import wixLocation from 'wix-location';
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
    $w("#PayNowButton").enable();
}

$w.onReady(async function () {
    console.log("script is running");
    $w("#PayNowButton").disable();
    retrieveCart();
    displayCart();
});

$w("#PayNowButton").onClick(() => {
    $w("#errorMessage").collapse();
    $w("#PayNowButton").label = "Обработване...";
    $w("#PayNowButton").disable();
    payNow();

    console.log("payNow has been executed");
});

export function payNow() {
    stripeAPI.createToken(stripeAPI.encodeCard(createCard()))
        .then((token) => {
            stripeProxy.charge(token, ids, amounts, $w("#email").value)
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