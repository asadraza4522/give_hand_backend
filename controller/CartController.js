const Cart = require("../models/cart");
const Product = require("../models/product");
const Response = require("../utilities/response");

const deleteCart = (req, res) => {
  const response = new Response();

  try {
    Cart.findOneAndDelete({ user: req?.body?.user })
      .then((result) => {
        response.data = result;
        response.message = "Cart Deleted";
        res.send(response);
      })
      .catch((err_cart) => {
        res.send(err_cart);
        // console.log(err_cart)
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const viewCart = (req, res) => {
  const response = new Response();

  try {
    Cart.findOne({ user: req?.params?.user })
      .populate([
        {
          path: "cart.products.productID",
          select: "name price image discountPrice productType",
        },
      ])
      .populate([
        {
          path: "cart.products.cardItem.productID",
          select: "name price image discountPrice",
        },
      ])
      .then((result) => {
        if (result) {
          console.log(
            "🚀 ~ file: CartController.js:44 ~ .then ~ result:",
            JSON.stringify(result, null, 2)
          );
          response.data = result;
        } else {
          response.data = [];
        }
        response.message = "Cart List";
        res.send(response);
      })
      .catch((err) => {
        console.log(err, "err");
        response.data = err;
        response.message = "Error";
        response.error = true;
        res.send(response);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const addCartItem = (req, res) => {
  const response = new Response();

  try {
    let price = 0;
    if (req.body.cardItem) {
      Product.find({
        _id: { $in: req.body.cardItem?.productID },
      }).then((resultProduct) => {
        console.log(
          "🚀 ~ file: CartController.js:83 ~ .then ~ resultProduct:",
          resultProduct
        );
        if (resultProduct?.length > 0) {
          resultProduct.map((item) => {
            price += item?.discountPrice ? item?.discountPrice : item?.price;
          });
        }
      });
    }
    Product.findById({ _id: req.body.productID })
      .then((resultProduct) => {
        price += resultProduct?.discountPrice
          ? resultProduct?.discountPrice
          : resultProduct?.price;

        console.log(
          "🚀 ~ file: CartController.js:71 ~ .then ~ req.body.cardItem:",
          req.body.cardItem
        );
        console.log(
          "🚀 ~ file: CartController.js:84 ~ resultProduct.map ~ totl price:",
          price
        );

        Cart.findOne({ user: req?.body?.user })
          .then((userCart) => {
            if (!userCart) {
              // Yahan pr cart create kryngy

              let cart_data = {
                user: req?.body?.user,
                cart: {
                  products: [
                    {
                      productID: req.body.productID,
                      cartQty: 1,
                      cardItem: req.body.cardItem ? req.body.cardItem : [],
                    },
                  ],
                  amount: price,
                },
              };

              const cart = new Cart(cart_data);

              cart
                .save()
                .then((result) => {
                  response.data = result;
                  response.message = "Added Successfully+";
                  res.send(response);
                })
                .catch((err) => {
                  response.data = err;
                  response.message = "Error";
                  response.error = true;
                  res.send(response);
                });
            } else {
              let found = userCart.cart.products.filter(
                (product) => product.productID == req.body.productID
              );

              if (found.length == 0) {
                userCart.cart.products.unshift({
                  productID: req.body.productID,
                  cartQty: 1,
                });
                userCart.cart.amount += price;
                Cart.findOneAndUpdate(
                  { user: req?.body?.user },
                  userCart,
                  (error, data) => {
                    if (error) {
                      response.message = "Maybe wrong id";
                      response.error = true;
                      res.status(422).send(response);
                    } else {
                      response.message = "Updated Cart";
                      response.data = userCart;
                      res.send(response);
                    }
                  }
                );
              } else {
                response.error = true;
                response.message = "Product Already Exists!";
                res.send(response);
              }
            }
          })
          .catch((error) => {
            response.message = "User ID not correct";
            response.error = true;
            res.send(response);
          });
      })
      .catch((error) => {
        response.data = error;
        response.message = "No product against ID";
        response.error = true;
        res.send(response);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const UpdateQty = (req, res) => {
  const response = new Response();

  try {
    Cart.findOne({ user: req?.body?.user })
      .populate([
        { path: "cart.products.productID", select: "price discountPrice" },
      ])
      .populate([
        {
          path: "cart.products.cardItem.productID",
          match: { "cart.products.cardItem": { $ne: null } },
          select: "price discountPrice",
        },
      ])
      .then((userCart) => {
        if (userCart) {
          console.log(
            "🚀 ~ file: CartController.js:192 ~ .then ~ userCart:",
            userCart
          );
          let prevTotal = userCart.cart.amount;
          let selected = "";
          let selIndex = -1;

          for (let index = 0; index < userCart.cart.products.length; index++) {
            if (
              userCart.cart.products[index].productID._id.toString() ==
              req?.body?.productID
            ) {
              selected = userCart.cart.products[index];
              selIndex = index;
              break;
            }
          }

          if (selIndex != -1) {
            let selectedPrice = selected.productID.discountPrice
              ? selected.productID.discountPrice
              : selected.productID.price;

            if (req?.body?.qty != 0) {
              prevTotal = prevTotal - selected.cartQty * selectedPrice;

              selected.cartQty = req?.body?.qty;

              prevTotal = prevTotal + selected.cartQty * selectedPrice;
              userCart.cart.products.splice(selIndex, 1, selected);
              userCart.cart.amount = prevTotal;
              response.message = "Qty Updated";
            } else {
              prevTotal = prevTotal - selected.cartQty * selectedPrice;
              userCart.cart.products.splice(selIndex, 1);
              userCart.cart.amount = prevTotal;
              response.message = "Product Deleted from cart";
            }
            Cart.findOneAndUpdate(
              { user: req?.body?.user },
              userCart,
              (error, data) => {
                if (error) {
                  response.message = "Maybe wrong id";
                  response.error = true;
                }
              }
            );

            res.send(response);
          } else {
            response.message = "Product Not Found";
            response.error = true;
            res.send(response);
          }
        } else {
          response.message = "Invalid User ID";
          response.error = true;
          res.send(response);
        }
      })
      .catch((error) => {
        res.send(error);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
const UpdateDonation = (req, res) => {
  const response = new Response();

  try {
    Cart.findOne({ user: req?.body?.user })
      .populate([
        { path: "cart.products.productID", select: "price discountPrice" },
      ])
      .populate([
        {
          path: "cart.products.cardItem.productID",
          match: { "cart.products.cardItem": { $ne: null } },
          select: "price discountPrice",
        },
      ])
      .then((userCart) => {
        if (userCart) {
          console.log(
            "🚀 ~ file: CartController.js:192 ~ .then ~ userCart:",
            userCart
          );
          let prevTotal = userCart.cart.amount;

          if (req?.body?.donationAmount != 0) {
            prevTotal += req.body.donationAmount;
            userCart.cart.donationAmount = req?.body?.donationAmount;
            userCart.cart.amount = prevTotal;
          } else {
            console.log(
              "🚀 ~ file: CartController.js:304 ~ .then ~ userCart.cart.donationAmount:",
              userCart.cart.donationAmount
            );
            console.log(
              "🚀 ~ file: CartController.js:304 ~ .then ~ prevTotal:",
              prevTotal
            );
            userCart.cart.donationAmount = null;
            userCart.cart.amount = prevTotal - userCart.cart.donationAmount;
          }

          Cart.findOneAndUpdate(
            { user: req?.body?.user },
            userCart,
            (error, data) => {
              if (error) {
                response.message = "Maybe wrong id";
                response.error = true;
              }
            }
          );

          res.send(response);
        } else {
          response.message = "Invalid User ID";
          response.error = true;
          res.send(response);
        }
      })
      .catch((error) => {
        res.send(error);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = {
  addCartItem,
  viewCart,
  UpdateQty,
  deleteCart,
  UpdateDonation,
};
