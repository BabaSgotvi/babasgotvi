import { createMyPayment } from 'backend/pay';
import wixPayFrontend from 'wix-pay-frontend';
import wixWindowFrontend from 'wix-window-frontend';

// Step 1 - User clicks a button.
$w("#payButton").onClick((event) => {
    console.log("Pay button clicked");
    // Step 2 - Call backend function. 
    // (Next, see step 3 in the backend code below.)
    // createMyPayment()
    //     // When the payment has been created and a paymentId has been returned:
    //     .then((payment) => {
    //         // Step 5 - Call the startPayment() function with the paymentId.
    //         // Include PaymentOptions to customize the payment experience.
    //         wixPayFrontend.startPayment(payment.id, {
    //             "showThankYouPage": false,
    //             "termsAndConditionsLink": "https://mysite.com/terms"
    //         })
    //             // Step 6 - Visitor enters the payment information.
    //             // When the payment form is completed:
    //             .then((result) => {
    //                 // Step 7 - Handle the payment result.
    //                 // (Next, see step 8 in the backend code below.)
    //                 if (result.status === "Successful") {
    //                     wixWindowFrontend.openLightbox("Success Box");
    //                 } else if (result.status === "Pending") {
    //                     wixWindowFrontend.openLightbox("Pending Box");
    //                 }
    //             });
    //     });
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