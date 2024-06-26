import wixLocationFrontend from "wix-location-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
import { local, session, memory } from "wix-storage-frontend";
import wixWindow from 'wix-window';
import * as tools from "public/tools";

// vars
let providerId;
let deliveryDate;
let deliveryDay;
let cartList = [];
let foodAmount = [];
let priceList = [];
$w.onReady(async function () {
  providerId = wixLocationFrontend.query.Id;
  if (providerId == undefined) {
    wixLocation.to("/");
  }
  deliveryDate = session.getItem("deliveryDate");
  if (deliveryDate == undefined) {
    wixLocation.to("/");
  }
  deliveryDay = tools.getDayOfWeek(deliveryDate, "EN", false);
  $w("#foodlist").onReady(() => {
    RefreshProfile();
    listFood();
    RefreshProfile();
  });
  function listFood() {
    $w("#menuRepeater").forEachItem(($w, itemData, index) => {
      let price;
      let rating;
      let maxAmountPerDay;

      wixData.query("FoodList").eq("_id", itemData._id).find().then((results) => {
        if (results.items[0].owner != providerId) {
          $w("#foodItem").collapse();
          return;
        }
        // add filtering based on day
        if (results.items[0][deliveryDay] != true) {
          console.log("collapsed!");
          $w("#foodItem").collapse();
          return;
        }
        price = results.items[0].price;
        priceList[index] = price;
        rating = results.items[0].rating;
        maxAmountPerDay = results.items[0].maxPerDay;
        $w("#price").text = "" + price + " лв.";
        $w("#rating").text = "" + rating + "%";
      });
      $w("#minusButton").collapse();
      $w("#foodAmountText").collapse();
      $w("#plusButton").onClick(() => {
        //
        if (!cartList.includes(itemData._id))
          cartList[index] = itemData._id;
        foodAmount[index] = (foodAmount[index] || 0) + 1;

        if (foodAmount[index] >= maxAmountPerDay) {
          foodAmount[index] = maxAmountPerDay;
          $w("#plusButton").collapse();
        }
        $w("#foodAmountText").text = "" + foodAmount[index];
        $w("#minusButton").expand();
        $w("#foodAmountText").expand();
        session.setItem("previewAmount", foodAmount[index]);
        listCart(itemData._id, index);
        //
      });
      $w("#minusButton").onClick(() => {
        if (cartList.includes(itemData._id)) {
          foodAmount[index]--;
          if (foodAmount[index] < 1) {
            foodAmount[index] = 0;
            cartList[index] = null;
            $w("#minusButton").collapse();
            $w("#foodAmountText").collapse();
          }
          $w("#foodAmountText").text = "" + foodAmount[index];
          $w("#plusButton").expand();
          listCart(itemData._id, index);
        }
      });
      session.setItem("previewAmount", foodAmount[index]);
      listCart(itemData._id, index);
      $w("#foodAmountText").text = "" + foodAmount[index];
      // async
      $w("#foodProfileHitTrigger").onClick(async () => {
        session.removeItem("previewImage");
        session.setItem("previewImage", itemData.image);
        session.setItem("previewName", itemData.title);
        session.setItem("previewDescription", itemData.description);
        session.setItem("previewIngredients", itemData.ingredients);
        session.setItem("previewPrice", itemData.price);
        session.setItem("previewMaxAmount", itemData.maxPerDay);
        session.setItem("previewAmount", foodAmount[index]);
        let amm = await wixWindow.openLightbox("foodProfile");
        if (amm <= 0 || amm == "undefined" || amm == "null") {
          amm = 0;
          $w("#minusButton").collapse();
          $w("#foodAmountText").collapse();
        }
        else {
          $w("#minusButton").expand();
          $w("#foodAmountText").expand();
        }
        if (amm >= maxAmountPerDay) {
          amm = maxAmountPerDay;
          $w("#plusButton").collapse();
        }
        else {
          $w("#plusButton").expand();
        }
        if (amm != 0) {
          if (!cartList.includes(itemData._id))
            cartList[index] = itemData._id;
          foodAmount[index] = amm;
          $w("#foodAmountText").text = "" + foodAmount[index];
          listCart(itemData._id, index);
        }
      });
    });
  }

  function listCart(id, index) {
    $w("#checkoutRepeater").onItemReady(($w, itemData) => {
      if (id == itemData._id) {
        let grossPrice = Number(
          (priceList[index] * foodAmount[index]).toFixed(2)
        );
        $w("#text10").text = priceList[index] + " лв. x " + foodAmount[index] + " бр. = " + grossPrice + " лв.";
        if (cartList[index] == id) {
          $w("#checkoutedFoodItem").expand();
        } else {
          $w("#checkoutedFoodItem").collapse();
          return;
        }
      }
    });
    let finalPrice = 0;
    let loopIndex = 0;
    while (loopIndex < cartList.length) {
      if (
        priceList[loopIndex] != undefined &&
        foodAmount[loopIndex] != undefined
      ) {
        finalPrice = Number(
          (finalPrice + priceList[loopIndex] * foodAmount[loopIndex]).toFixed(2)
        );
      }
      loopIndex++;
    }
    $w("#finalSum").text = "Сума: " + finalPrice + " лв.";
    session.setItem("totalPrice", finalPrice);
    if (finalPrice <= 0) {
      finalPrice = 0;
      $w("#orderButton").disable();
    }
    else {
      $w("#orderButton").enable();
    }
  }
  function RefreshProfile() {
    wixData.get("ProviderList", providerId).then((result) => {
      $w("#profileName").text = result["title"];
      $w("#profilePic").src = result["profilePic"];
      wixData
        .get("FoodList", result["frontPageFood"])
        .then((referencedItem) => {
          $w("#foodBannerPic").src = referencedItem["image"];
        });
    })
      .catch(err => {
        console.error(err);
        wixLocation.to("/");
      })
  }
});
$w("#orderButton").onClick(() => {
  let CheckoutIds = removeNullItemsFromArray(cartList);
  let CheckoutAmounts = removeNullItemsFromArray(foodAmount);
  session.setItem("CheckoutIds", JSON.stringify(CheckoutIds));
  session.setItem("CheckoutAmounts", JSON.stringify(CheckoutAmounts));
  session.setItem("providerId", providerId);
  wixLocation.to("/checkout");
});
function removeNullItemsFromArray(array) {
  let newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] != null) {
      newArray.push(array[i]);
    }
  }
  return newArray;
}
//
/// TODO: ADD FOOD FILTERING BASED ON AVAILABLE DAYS
//