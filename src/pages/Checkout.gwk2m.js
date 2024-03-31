import { createPaymentObj } from 'backend/Pay';
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
    createPaymentObj(ids, amounts).then(payment => {
        wixPayFrontend.startPayment(payment.id).then(() => {
        });
    });
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