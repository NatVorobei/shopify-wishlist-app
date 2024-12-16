import { json } from "@remix-run/node";
import db from "../db.server";
// import { cors } from "remix-utils/cors";

// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const customerId = url.searchParams.get("customerId");
//   const shop = url.searchParams.get("shop");
//   const productId = url.searchParams.get("productId");

//   if (!customerId || !shop || !productId) {
//     return json({
//       message: "Missing data. Required data: customerId, productId, shop",
//       method: "GET",
//     });
//   }

//   // If customerId, shop, productId is provided, return wishlist items for that customer.
//   const wishlist = await db.wishlist.findMany({
//     where: {
//       customerId: customerId,
//       shop: shop,
//       productId: productId,
//     },
//   });

//   const response = json({
//     ok: true,
//     message: "Success",
//     data: wishlist,
//   });

//   return request, response;
// }

// // Expexted data comes from post request. If
// // customerID, productID, shop
// export async function action({ request }) {
//   let data = await request.formData();
//   data = Object.fromEntries(data);
//   const customerId = data.customerId;
//   const productId = data.productId;
//   const shop = data.shop;
//   const _action = data._action;

//   if (!customerId || !productId || !shop || !_action) {
//     return json({
//       message:
//         "Missing data. Required data: customerId, productId, shop, _action",
//       method: _action,
//     });
//   }

//   let response;

//   switch (_action) {
//     case "CREATE":
//       // Handle POST request logic here
//       // For example, adding a new item to the wishlist
//       const wishlist = await db.wishlist.create({
//         data: {
//           customerId,
//           productId,
//           shop,
//         },
//       });

//       response = json({
//         message: "Product added to wishlist",
//         method: _action,
//         wishlisted: true,
//       });
//       return request, response;

//     case "PATCH":
//       // Handle PATCH request logic here
//       // For example, updating an existing item in the wishlist
//       return json({ message: "Success", method: "Patch" });

//     case "DELETE":
//       // Handle DELETE request logic here (Not tested)
//       // For example, removing an item from the wishlist
//       await db.wishlist.deleteMany({
//         where: {
//           customerId: customerId,
//           shop: shop,
//           productId: productId,
//         },
//       });

//       response = json({
//         message: "Product removed from your wishlist",
//         method: _action,
//         wishlisted: false,
//       });
//       return request, response;

//     default:
//       // Optional: handle other methods or return a method not allowed response
//       return new Response("Method Not Allowed", { status: 405 });
//   }
// }

export async function loader({ request }) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  if (!productId) {
    return json({
      message: "Missing productId",
      method: "GET",
    });
  }

  // Check if the product is in the wishlist (no customerId needed)
  const wishlist = await db.wishlist.findMany({
    where: {
      productId: productId,
    },
  });

  const response = json({
    ok: true,
    message: "Success",
    data: wishlist,
  });

  return response;
}

export async function action({ request }) {
  let data = await request.formData();
  data = Object.fromEntries(data);
  const productId = data.productId;
  const _action = data._action;

  if (!productId || !_action) {
    return json({
      message: "Missing data. Required data: productId, _action",
      method: _action,
    });
  }

  let response;

  switch (_action) {
    case "CREATE":
      // Handle adding to the wishlist (no customerId)
      const wishlist = await db.wishlist.create({
        data: {
          productId,
        },
      });

      response = json({
        message: "Product added to wishlist",
        method: _action,
        wishlisted: true,
      });
      return response;

    case "DELETE":
      // Handle removing from the wishlist
      await db.wishlist.deleteMany({
        where: {
          productId: productId,
        },
      });

      response = json({
        message: "Product removed from wishlist",
        method: _action,
        wishlisted: false,
      });
      return response;

    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
