const Order = require('../models/order')
const Cart = require('../models/cart')
const Product = require('../models/product')
const Response = require('../utilities/response')
const SendNotification = require('../utilities/SendNotification')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const updateOrderStatus = (req, res) => {

    const response = new Response();

    try {

        const token = req.headers.authorization.split(' ')[1];
        let userId = null;
    
        try {
    
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                userType = user?.type;
                userId = user?.id;
            });
    
        } catch (error) {
            console.log(error, "error");
        }

        // Find the order by ID and the seller by ID in the sellers array
        Order.findOne({ "_id": req?.body?.id, "sellers.seller_id": userId }, (error, order) => {
            if (error) {
                response.message = "Maybe wrong id";
                response.error = true;
                res.status(422).send(response);
            } else {
                // Update the status of the seller in the sellers array
                order.sellers.forEach(seller => {
                    if (seller.seller_id === userId) {
                        seller.status = req?.body?.status;
                    }
                });
                // Save the updated order
                order.save((error, updatedOrder) => {
                    if (error) {
                        response.message = "Error updating status";
                        response.error = true;
                        res.status(422).send(response);
                    } else {
                        response.message = "Status Updated";
                        response.data = updatedOrder;
                        res.send(response);
                    }
                });
            }
        });

    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

const viewOrders = async (req, res) => {
    const response = new Response();

    const searchOptions = {};
    const { user } = req.params;
    const { userType, type, status } = req.query;

    if (user && userType !== 'seller') {
        searchOptions.userID = user;
    }

    if (userType === 'seller') {
        searchOptions.sellers = {
            $elemMatch: {
                seller_id: user,
            },
        };
    }

    if (status) {
        searchOptions.sellers = {
            $elemMatch: {
                status: status,
            },
        };
    }

    try {
        const result = await Order.paginate(searchOptions, {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: [
                {
                    path: 'sellers.products.productID',
                    select: 'name image',
                },
                {
                    path: 'userID',
                    select: 'name avatar',
                },
            ],
            sort: { createdAt: -1 },
        });

        if (result) {
            response.data = result;
        } else {
            response.data = [];
        }

        response.message =
            result?.docs?.length !== 0 ? 'Orders List' : 'No Orders Yet';
        res.send(response);
    } catch (error) {
        console.log(error);
        response.data = error;
        response.message = 'Error';
        response.error = true;
        res.send(response);
    }
};


const createUserOrder = (req, res) => {

    const response = new Response()

    let recieved_data = req?.body

    try {

        Cart.findOne({ user: recieved_data?.userID })
            .populate([{ path: 'cart.products.productID', select: 'price discountPrice user' }])
            .then((userCart) => {

                if (userCart) {

                    recieved_data.amount = userCart.cart.amount
                    recieved_data.total_items = userCart.cart.products.length

                    let orderProductList = []
                    let sellers = {}

                    for (let index = 0; index < userCart.cart.products.length; index++) {

                        let seller = userCart.cart.products[index]?.productID?.user

                        let ActualPrice = userCart.cart.products[index].productID.discountPrice ? userCart.cart.products[index].productID.discountPrice : userCart.cart.products[index].productID.price
                        orderProductList.push({ productID: userCart.cart.products[index].productID._id, price: ActualPrice, cartQty: userCart.cart.products[index].cartQty })
                        let prev = sellers[seller]
                        sellers[seller] = [
                            ...(prev ? prev : []),
                            { productID: userCart.cart.products[index].productID._id, price: ActualPrice, cartQty: userCart.cart.products[index].cartQty }
                        ]

                    }

                    let finalResult = []

                    for (const seller in sellers) {

                        let total_price = 0

                        for (let index = 0; index < sellers[seller].length; index++) {
                            
                            total_price += sellers[seller][index].price
                            
                        }

                        finalResult.push({
                            seller_id: seller,
                            products: sellers[seller],
                            status: "Pending Approval",
                            total:total_price
                        })
                    }


                    recieved_data.sellers = finalResult

                    const order = new Order(recieved_data)

                    order.save()
                        .then((result) => {

                            Cart.findOneAndDelete({ user: recieved_data?.userID })
                                .catch((err_cart) => {
                                    console.log(err_cart)
                                })
                            
                            response.data = result
                            response.message = "Order Created SuccessFully"
                            res.send(response)

                        })
                        .catch((err) => {
                            response.data = err
                            response.message = "Error"
                            response.error = true
                            res.send(response)
                        })


                } else {
                    response.message = "Cart Is Empty"
                    response.error = true
                    res.send(response)
                }

            })
            .catch((error) => {
                response.message = "Cart Is Empty"
                response.error = true
                res.send(response)
            })


    } catch (error) {
        console.log(error)
        res.send(error)
    }


}

module.exports = {
    createUserOrder,
    viewOrders,
    updateOrderStatus
}


