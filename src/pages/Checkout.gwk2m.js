import * as Pay from 'backend/Pay';
import wixPayFrontend from 'wix-pay-frontend';
import { local, session, memory } from "wix-storage-frontend";
let ids = [];
let amounts = [];
retrieveCart();
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
    Pay.payIBAN("BG45INTF40012090790288");
    console.log("after payIBAN");
});

//
/// TODO: CHECKOUT
//

//
/// TODO: ADD SEND ORDER TO CMS AND PROVIDER
//

//
/// TODO: ADD CANCELATION
//