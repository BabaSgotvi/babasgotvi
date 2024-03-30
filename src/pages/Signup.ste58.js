import { local, session, memory } from "wix-storage-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
let realPassword = "";
// Function to capitalize the first letter of a string
function capitalizeFirstLetter(input) {
  const lowercasedInput = input.toLowerCase();
  return lowercasedInput.charAt(0).toUpperCase() + lowercasedInput.slice(1);
}
let stage = 0;

function tryEnableButton() {
  if ($w("#firstNameInput").valid && $w("#lastNameInput").valid && $w("#phoneNumberInput").valid && $w("#emailInput").valid && $w("#addressInput").valid && $w("#passwordInput").valid)
    $w("#createAccountButton").enable();
  else
    $w("#createAccountButton").disable();
}
// Function to handle input validation for basic inputs
function setInputValidation() {
  // Variables to store last valid inputs
  let lastFirstName = "";
  let lastLastName = "";
  let lastPhoneNumber = "";
  let lastEmail = "";

  // FIRST NAME input validation
  $w("#firstNameInput").onInput(() => {
    // Validate input against regex pattern for Bulgarian alphabet
    if (
      /^[а-яА-Я]+$/.test($w("#firstNameInput").value) ||
      $w("#firstNameInput").value == ""
    ) {
      lastFirstName = $w("#firstNameInput").value;
    } else {
      $w("#firstNameInput").value = lastFirstName;
    }
  });

  $w("#firstNameInput").onChange(() => {
    lastFirstName = $w("#firstNameInput").value = capitalizeFirstLetter(
      $w("#firstNameInput").value
    );
    tryEnableButton();
  });

  // LAST NAME input validation
  $w("#lastNameInput").onInput(() => {
    // Validate input against regex pattern for Bulgarian alphabet
    if (
      /^[а-яА-Я]+$/.test($w("#lastNameInput").value) ||
      $w("#lastNameInput").value == ""
    ) {
      lastLastName = $w("#lastNameInput").value;
    } else {
      $w("#lastNameInput").value = lastLastName;
    }
  });

  $w("#lastNameInput").onChange(() => {
    lastLastName = $w("#lastNameInput").value = capitalizeFirstLetter(
      $w("#lastNameInput").value
    );
    tryEnableButton();
  });

  // PHONE NUMBER input validation
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
    tryEnableButton();
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
    tryEnableButton();
  });
  // ADDRESS input validation
  $w("#addressInput").onCustomValidation((value, reject) => {
    let fullAddress = value;

    function GetPropertyValue(obj1, dataToRetrieve) {
      return dataToRetrieve
        .split(".") // split string based on `.`
        .reduce(function (o, k) {
          return o && o[k]; // get inner property if `o` is defined else get `o` and return
        }, obj1); // set initial value as object
    }

    let location = GetPropertyValue(fullAddress, "location");

    if (location === undefined) {
      reject("Please select an address option only.");
    }
  });
  $w("#addressInput").onChange(() => {
    session.removeItem("addressInput");
    session.setItem("addressInput", JSON.stringify($w("#addressInput").value));
    tryEnableButton();
  });

  // PASSWORD input validation
  let lastPassword = "";

  $w("#previewPassword").text = realPassword;
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
    tryEnableButton();
  });
  // CREATE ACCOUNT button
  $w("#createAccountButton").onClick(() => {
    createAccount();
  });
  // });
}

$w.onReady(function () {
  tryEnableButton();
  setInputValidation();
});

function createAccount() {
  const accountKey = generateRandomString(25);
  let newAccount = {
    title: $w("#firstNameInput").value,
    lastName: $w("#lastNameInput").value,
    address: $w("#addressInput").value,
    password: realPassword,
    phoneNumber: $w("#phoneNumberInput").value,
    email: $w("#emailInput").value,
    accountKey: accountKey,
    rating: "5.00",
    ratings: "0",
    served: "0",
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    balance: "0",
    allTimeEarned: "0",
    orderCutoff: "4"
  };
  wixData
    .insert("ProviderList", newAccount)
    .then((results) => {
      local.setItem("accountKey", accountKey);
      local.setItem("tour", "doTour");
      wixLocation.to("/providerdashboard");
    })
}

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

//
/// TODO: ADD EMAIL, PHONENUMBER, VERIFICATION ( meaning:
// checking if the email and phonenumber are not in use
// and sending an SMS and an email verification message to make sure the user is real)
