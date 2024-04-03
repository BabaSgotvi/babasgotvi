import { fetch } from 'wix-fetch';
import { STRIPE_PUBLISHABLE_KEY } from './PayKeys';
const apiKey = STRIPE_PUBLISHABLE_KEY; // (public key)
export async function createToken(card) {
    const response = await fetch("https://api.stripe.com/v1/tokens", {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + apiKey
        },
        body: card
    });
    if (response.status >= 200 && response.status < 300) {
        const json = await response.json()
        return json.id;
    }
    const responseText = await response.text();
    return response.status;
}

// Builds the fetch body from the array of card details.
export function encodeCard(card) {
    let encoded = "";
    for (let [k, v] of Object.entries(card)) {
        encoded = encoded.concat("card[", k, "]=", encodeURI(v), "&");
    }
    return encoded.substr(0, encoded.length - 1);
}