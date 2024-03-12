import { local, session, memory } from 'wix-storage-frontend';
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixLocationFrontend from 'wix-location-frontend';

$w.onReady(function () {
    let redirected = session.getItem("redirected");
    if(redirected == null)
    {
        wixData.query('ProviderList').find().then(results => {
            results.items.forEach(item => {
                const accountKey = item.accountKey;
				if(local.getItem("accountKey") == item.accountKey)
				{
                    session.removeItem("redirected");
                    session.setItem("redirected", "Redirected!");
					wixLocation.to("/providerdashboard");

				}
            });
        })
        .catch(error => {
            console.error(error);
        });
        //
    }
});