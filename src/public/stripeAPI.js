import { fetch } from 'wix-fetch';

// const apiKey = 'pk_live_51OLgRxCW4moslVDKuOA45Tpc0cQicgRqM8kr3lrCMqtFkeIJAcGs1TJjaNvXj9UXeM1hvkAIqrMUh9Y0ZS4FHs8700gdx0mKmw'; // real public key
const apiKey = 'pk_test_51OLgRxCW4moslVDKsNm2MV8bKLiCjO52eaZbT3Jb0J4TquqLWpw5e37PFYbMfR5nNx8EqIWhSrlH0bqdtJ7apom000fmYbhC0u'; // test public key

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