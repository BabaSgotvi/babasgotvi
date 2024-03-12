import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";

let lastPhoneNumber = "";
let lastEmail = "";
$w("#phoneNumberInput").onChange(() => {
  // Validate input against regex pattern for Bulgarian phone numbers
  if (
    /^\+359\d{9}$/.test($w("#phoneNumberInput").value) ||
    $w("#phoneNumberInput").value == ""
  ) {
    lastPhoneNumber = $w("#phoneNumberInput").value;
  } else {
    $w("#phoneNumberInput").value = lastPhoneNumber;
  }
  tryNextStage();
});

// EMAIL input validation
$w("#emailInput").onChange(() => {
  // Validate input against regex pattern for email addresses
  if (
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      $w("#emailInput").value
    ) ||
    $w("#emailInput").value == ""
  ) {
    lastEmail = $w("#emailInput").value;
  } else {
    $w("#emailInput").value = lastEmail;
  }
  $w("#emailInput").value = $w("#emailInput").value.toLowerCase();
  tryNextStage();
});

let lastPassword = "";
let realPassword = "";

$w("#passwordInput").onInput(() => {
  let inputValue = $w("#passwordInput").value;

  // Check if the input value decreased in length, indicating a backspace key press
  if (inputValue.length < lastPassword.length) {
    let difference = lastPassword.length - inputValue.length;
    realPassword = realPassword.slice(0, -difference);
  } else {
    if (inputValue.length <= 0) {
      realPassword = "";
    } else {
      for (let i = 0; i < inputValue.length; i++) {
        let char = inputValue.charAt(i);
        if (char === "●") {
          continue;
        }
        if (char !== " ") {
          realPassword += char;
        }
      }
    }
  }

  lastPassword = realPassword;

  let maskedPassword = "●".repeat(realPassword.length);
  $w("#passwordInput").value = maskedPassword;
  $w("#previewPassword").text = realPassword;
});
$w("#passwordInput").onChange(() => {
  if (realPassword.length < 6 || realPassword.length > 25) {
    lastPassword = realPassword = "";
    $w("#passwordInput").value = "●".repeat(realPassword.length);
    $w("#previewPassword").text = realPassword;
  }
  tryNextStage();
});
$w("#changeToEmail").onClick(() => {
  $w("#emailInput").expand();
  $w("#changeToPhoneNumber").expand();
  $w("#phoneNumberInput").collapse();
  $w("#changeToEmail").collapse();
  tryNextStage();
});
$w("#changeToPhoneNumber").onClick(() => {
  $w("#phoneNumberInput").expand();
  $w("#changeToEmail").expand();
  $w("#emailInput").collapse();
  $w("#changeToPhoneNumber").collapse();
  tryNextStage();
});
$w("#loginButton").onClick(() => {
  let inputValue = $w("#phoneNumberInput").collapsed
    ? $w("#emailInput").value
    : $w("#phoneNumberInput").value;

  // Define the field to query based on the input field used
  let fieldToQuery = $w("#phoneNumberInput").collapsed
    ? "email"
    : "phoneNumber";

  console.log(fieldToQuery + ": " + inputValue);
  console.log("password: " + $w("#passwordInput").value);
  //
  //
  $w("#errorText").collapse();
  // Perform the data query
  //
  wixData
    .query("ProviderList")
    .eq(fieldToQuery, inputValue)
    .eq("password", realPassword)
    .find()
    .then((results) => {
      if (results.items.length > 0) {
        let accountKey = results.items[0].accountKey;
        local.setItem("accountKey", accountKey);
        wixLocation.to("/providerdashboard");
      } else {
        $w("#errorText").expand();
      }
    })
    .catch((error) => {
      $w("#errorText").expand();
      console.error("Error:", error);
    });
});
$w.onReady(() => {
  //
  $w("#passwordInput").expand();
  $w("#changeToEmail").expand();
  $w("#changeToPhoneNumber").collapse();
  $w("#emailInput").collapse();
  $w("#errorText").collapse();
  //
  tryNextStage();
});
function tryNextStage() {
  $w("#loginButton").collapse();
  if (
    $w("#passwordInput").value.length >= 6 &&
    $w("#passwordInput").value.length <= 25
  ) {
    if (!$w("#phoneNumberInput").collapsed) {
      if ($w("#phoneNumberInput").valid) {
        $w("#loginButton").expand();
      }
    } // if using email
    else {
      if ($w("#emailInput").valid) {
        $w("#loginButton").expand();
      }
    }
  }
}
