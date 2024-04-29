import { ok, serverError } from 'wix-http-functions';
import { getSecret } from 'wix-secrets-backend';
import wixData from 'wix-data';
const zapKey = "zap";
let isAwake = false;
let secondsAwake = 0;
let runIntervalId;

// Makes sure the backend system (that is not triggered by user inputs) stays alive.
// it is very important that the backend system keeps running, as it handles payouts, sending emails, etc. 
// Which are very important events that are independent of user interaction
//
// A external api is used to continoulsy zap the backend to make sure it doesn't stop.
//

//
// TODO: As of now, the problem is that without zaps every 30 seconds, the backend side falls asleep. 
// We could replace this with webhooks from the delivery service. 
//
export async function get_zapBackend(request) {
    let key = request.path[0];
    if (key != zapKey) {
        return serverError({ body: "Invalid key." });
    }
    if (isAwake) {
        return ok({ body: "Backend is awake. Continue zapping. Been running for " + secondsAwake + " seconds." });
    }
    else {
        isAwake = true;
        runIntervalId = setInterval(refreshBackend, 1000);
        return ok({ body: "Backend was awoken from deep sleep. Continue zapping." });
    }
}
export async function get_shutDownBackend(request) {
    let key = request.path[0];
    if (key != zapKey) {
        return serverError({ body: "Invalid key." });
    }
    if (!isAwake) {
        return ok({ body: "Backend is already asleep. Keep quiet." });
    }
    else {
        isAwake = false;
        clearInterval(runIntervalId);
        secondsAwake = 0;
        return ok({ body: "Shut down completed. Backend is now asleep." });
    }
}
function refreshBackend() {
    secondsAwake++;
    // ....
}


export async function post_postDeliveryStatus(request) {
    const body = JSON.parse(await request.body.text());
    const status = body.status;
    const orderId = body.orderId;
    const order = await wixData.get("UpcomingOrders", orderId);
    const key = body.key;
    const deliveryApiKey = await getSecret("DELIVERY_API_KEY");
    if (key != deliveryApiKey)
        return serverError({ body: "Invalid key." });
    if (order == null || order == undefined)
        return serverError({ body: "Order could not be found." });
    if (status == "delivered") {
        // issue payouts
        // send emails
        // send email that asks for food review after 1.5 hour
        return ok({ body: "Everything has been processed successfully." });
    }
    else {
        return ok({ body: "All has been dealt with." });
    }
}