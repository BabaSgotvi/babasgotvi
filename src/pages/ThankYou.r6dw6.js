import { get } from 'wix-data';
import { fetch } from 'wix-fetch';
// @ts-ignore
import { getSecret } from 'wix-secrets-backend';

$w.onReady(async function () {
    console.log("script is running");
    // sendSMSNotificationFETCH("+359896830657", "Helo from Wix Fetch");
    // sendSMSNotificationMODULE("+359896830657", "Helo from Twilio Module");
});





const accountSid = getSecret("TEST_TWILIO_ACCOUNT_SID");
const authToken = getSecret("TEST_TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = '+13344534393'; // +1 334 453 4393

// // Function to send SMS using Twilio
// async function sendSMSNotificationFETCH(phoneNumber, message) {
//     console.log("sendSMSNotification has been called");


//     const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

//     const headers = {
//         'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
//         'Content-Type': 'application/x-www-form-urlencoded',
//     };

//     const body = `To=${encodeURIComponent(phoneNumber)}&From=${encodeURIComponent(twilioPhoneNumber)}&Body=${encodeURIComponent(message)}`;

//     const response = await fetch(url, {
//         method: 'POST',
//         headers: headers,
//         body: body
//     });

//     const responseData = await response.json();
//     console.log(responseData);
// }
// function sendSMSNotificationMODULE(phoneNumber, message) {
//     const client = require('twilio')(accountSid, authToken);
//     client.messages
//         .create({
//             body: message,
//             from: twilioPhoneNumber,
//             to: phoneNumber
//         })
//         .then(message => console.log(message.sid));

// }
