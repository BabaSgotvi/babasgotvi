// @ts-ignore
// @ts-ignore
import * as Pay from 'backend/Pay';
// @ts-ignore
import wixPayFrontend from 'wix-pay-frontend';
// @ts-ignore
import { local, session, memory } from "wix-storage-frontend";
// @ts-ignore
import { STRIPE_PUBLISHABLE_KEY } from 'public/PayKeys';
// @ts-ignore
import * as stripeProxy from 'backend/stripeProxy';
import * as stripeAPI from "public/stripeAPI";
let ids = [];
let amounts = [];
function retrieveCart() {
    ids = JSON.parse(session.getItem("CheckoutIds"));
    amounts = JSON.parse(session.getItem("CheckoutAmounts"));
}
function displayCart() {

}
$w.onReady(async function () {
    console.log("script is running");
    retrieveCart();
    displayCart();
});

$w("#PayNowButton").onClick(() => {
    $w("#PayNowButton").label = "Processing...";
    $w("#PayNowButton").disable();
    payNow();
    console.log("payNow has been executed");
});




export function payNow() {
    // stripeProxy.createCart(ids, amounts);
    let cart =
    {
        "amount": 100,
        "currency": "BGN",
        "description": "test charge"
    };
    stripeAPI.createToken(stripeAPI.encodeCard(createCard()))
        .then((token) => {
            stripeProxy.charge(token, cart)
                .then((response) => {
                    if (response.chargeId) {
                        console.log("Payment Successful");
                        console.log("Charge ID: " + response.chargeId);
                    }
                    else {
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