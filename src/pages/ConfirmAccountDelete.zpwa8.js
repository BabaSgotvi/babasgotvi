import wixWindowFrontend from 'wix-window-frontend';

$w.onReady(function () {
    testConfirm($w("#confirmBoxInput").value);
});

$w("#closeButton").onClick(() => {
    wixWindowFrontend.lightbox.close("cancel");
});
$w("#cancelButton").onClick(() => {
    wixWindowFrontend.lightbox.close("cancel");
});
$w("#confirmDeleteButton").onClick(() => {
    wixWindowFrontend.lightbox.close("confirmed");
});
$w("#confirmBoxInput").onInput(() => {
    testConfirm($w("#confirmBoxInput").value);
});
function testConfirm(testText) {
    if (testText == "ИЗТРИЙ")
        $w("#confirmDeleteButton").enable();
    else
        $w("#confirmDeleteButton").disable();
}