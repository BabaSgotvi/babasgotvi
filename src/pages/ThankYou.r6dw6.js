import { get } from 'wix-data';
import { fetch } from 'wix-fetch';
// @ts-ignore
import * as SendNotification from 'backend/SendNotification';

$w.onReady(async function () {
    console.log("script is running");
    SendNotification.sendSMSNotificationFETCH("+359896830657", "Helo from Wix Fetch");
    // SendNotification.sendSMSNotificationMODULE("+359896830657", "Helo from Twilio Module");
});