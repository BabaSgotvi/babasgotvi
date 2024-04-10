import { fetch } from 'wix-fetch'; // Import Wix Fetch library
import * as Secrets from 'backend/secrets';
// Function to send SMS using Twilio
async function sendSMSNotification(phoneNumber, message) {
    const accountSid = 'AC8118e6cba5ba315d316ee4de5007e0b0';
    const authToken = Secrets.TWILIO_TEST_AUTH_TOKEN;
    const twilioPhoneNumber = '+13344534393';

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const headers = {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = `To=${encodeURIComponent(phoneNumber)}&From=${encodeURIComponent(twilioPhoneNumber)}&Body=${encodeURIComponent(message)}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
    });

    const responseData = await response.json();
    console.log(responseData);
}

$w.onReady(function () {
    let userPhoneNumber = '+359896830657';
    let notificationMessage = 'Hello, you have a new notification!';

    sendSMSNotification(userPhoneNumber, notificationMessage);
});
