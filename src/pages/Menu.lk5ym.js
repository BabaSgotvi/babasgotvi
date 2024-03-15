import wixLocationFrontend from "wix-location-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";
import { local, session, memory } from "wix-storage-frontend";

// vars
let providerId;
let cartList = [];
let foodAmount = [];
let priceList = [];
$w.onReady(async function () {
  providerId = wixLocationFrontend.query.Id;
  if (providerId == undefined) {
    wixLocation.to("/");
  }
  $w("#foodlist").onReady(() => {
    RefreshProfile();
    listFood();
  });
  function listFood() {
    $w("#menuRepeater").onItemReady(($w, itemData, index) => {
      let price;
      let rating;
      let maxAmountPerDay;

      wixData.query("FoodList").eq("_id", itemData._id).find().then((results) => {
        let foodOwnerId = results.items[0].owner;
        if (foodOwnerId != providerId) {
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
      $w("#foodProfileHitTrigger").onMouseIn(() => {
        session.removeItem("previewImage");
        session.setItem("previewImage", itemData.image);
        session.setItem("previewName", itemData.title);
        session.setItem("previewDescription", itemData.description);
        session.setItem("previewIngredients", itemData.ingredients);
        session.setItem("previewPrice", itemData.price);
        session.setItem("previewPortionSizes", itemData.portionSizes);
        session.setItem("previewMaxAmount", itemData.maxPerDay);
        session.setItem("previewAmount", foodAmount[index]);
      });
      $w("#plusButton").onClick(() => {
        //
        if (!cartList.includes(itemData._id)) cartList[index] = itemData._id;
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
    });
  }
});
export function foodProfileLightBox_closed() {
  // Run your function here
  console.log("Lightbox closed!");
}