import { createPaymentObj } from 'backend/Pay';
import wixPayFrontend from 'wix-pay-frontend';
import { local, session, memory } from "wix-storage-frontend";
let ids = [];
let amounts = [];
function retrieveCart() {
    let cart = local.getItem("cart");
    if (cart) {
        cart = JSON.parse(cart);
    }
}
$w("#payButton").onClick((event) => {
    console.log("Pay button clicked");
    createPaymentObj(ids, amounts).then(payment => {
        console.log("Payment object created");
        wixPayFrontend.startPayment(payment.id).then(() => {
            console.log("Payment started");
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