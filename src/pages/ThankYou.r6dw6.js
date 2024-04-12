import { get } from 'wix-data';
import { fetch } from 'wix-fetch';
// @ts-ignore
import * as SendNotification from 'backend/SendNotification';

$w.onReady(async function () {
    console.log("script is running");
    SendNotification.sendEmail("duckata@gmail.com", "Този имейл е за тестови цели", "Това е тестово съобщение.");
});
