import { local, session, memory } from "wix-storage-frontend";
import wixLocation from "wix-location";
import wixWindowFrontend from 'wix-window-frontend';

$w.onReady(function () {
    const accountKey = local.getItem("accountKey");
    if (accountKey == undefined) {
        $w("#button2").label = "Регистрация";
        $w("#button2").onClick(() => {
            wixLocation.to("/signup");
        });
        $w("#button3").label = "Вход";
        $w("#button3").onClick(() => {
            wixLocation.to("/login");
        });
    }
    else {
        $w("#button2").label = "Табло";
        $w("#button2").onClick(() => {
            wixLocation.to("/providerdashboard");
        });
        $w("#button3").label = "Излез";
        $w("#button3").onClick(() => {
            local.removeItem("accountKey");
            wixWindowFrontend.lightbox.close();
        });
    }
});
