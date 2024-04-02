// @ts-ignore
import * as Pay from 'backend/Pay';
import wixPayFrontend from 'wix-pay-frontend';
import { local, session, memory } from "wix-storage-frontend";
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51OLgRxCW4moslVDKuOA45Tpc0cQicgRqM8kr3lrCMqtFkeIJAcGs1TJjaNvXj9UXeM1hvkAIqrMUh9Y0ZS4FHs8700gdx0mKmw';
// @ts-ignore
import { charge } from 'backend/stripeProxy';
import { createToken, encodeCard } from "public/stripeAPI.js";
let ids = [];
let amounts = [];
retrieveCart();
$w.onReady(async function () {
    console.log("script is running");
});

function retrieveCart() {
    ids = JSON.parse(session.getItem("CheckoutIds"));
    amounts = JSON.parse(session.getItem("CheckoutAmounts"));
}
$w("#payButton").onClick((event) => {
    Pay.createPaymentObj(ids, amounts).then(payment => {
        wixPayFrontend.startPayment(payment.id).then(() => {
        });
    });
});

$w("#button1").onClick(() => {
    console.log("clicked");
    payNow();
    console.log("payNow has been executed");
    // Pay.transferToBankAccount(150, 'bgn', 'BG45INTF40012090790288')
    //     .then(transfer => console.log('Transfer successful:', transfer))
    //     .catch(error => console.error('Transfer failed:', error));
});


export function payNow() {
    let payment = {
        "amount": ($w("#amount").value * 100),
        "currency": "BGN",
        "description": $w("#description").value
    }
    createToken(encodeCard(createCard()))
        .then((token) => {
            charge(token, payment)
                .then((response) => {
                    if (response.chargeId) {
                        console.log("Charge ID: " + response.chargeId);
                        // $w('#response').text = response.chargeId;
                        // $w('#lblResponse').text = "Charge ID (response from Stripe):";
                        // $w('#btnClearPaid').label = "CLEAR PAID";
                        // $w('#btnClearPaid').show();
                    }
                    else {
                        // $w('#response').text = response.error;
                        // $w('#lblResponse').text = "Processing error (from Stripe):";
                        console.log(response.error);
                    }
                    // $w('#response').show();
                });
        });
}


function createCard() {
    return {
        "name": $w("#cardholder").value,
        "number": $w("#cardnum").value,
        "cvc": $w("#cvc").value,
        "exp_year": $w("#year").value,
        "exp_month": $w("#month").value
    };
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