const express = require('express')
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { ValidateToken } = require('../controller/AuthController');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Orders = require('../models/order');
const Response = require('../utilities/response');

router.get('/payment/check_stripe_id', ValidateToken, async (req, res) => {

    const accountId = 'acct_1MznoDR9bYs68fS0';

    stripe.accounts.retrieve(accountId, function (err, account) {
        // Handle any errors
        if (err) {
            console.error(err);
            res.send({
                err
            })
            return;
        }

        // The account object contains the retrieved account's information
        console.log(account);
        res.send({
            account
        })
    });



});

router.get('/payment/create-stripe-account', ValidateToken, async (req, res) => {

    const token = req.headers.authorization.split(' ')[1]
    let userType = null
    let userId = null

    try {

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            userType = user?.type
            userId = user?.id
        })

    } catch (error) {
        console.log(error, "error");
    }


    const account = await stripe.accounts.create({
        country: 'US',
        type: 'express',
        capabilities: { transfers: { requested: true } },
        business_type: 'individual',
        business_profile: { url: 'https://ecommerce-app-kohl.vercel.app/' },
        individual: {
            email: 'user@example.com',
            phone: '0000000000',
        },
    });

    User.findByIdAndUpdate({ "_id": userId }, { stripe_id: account.id }, (error, data) => {
        if (data) {
            console.log(data, "data");
        }
    })


    const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://ecommerce-app-kohl.vercel.app/refresh',
        return_url: 'https://ecommerce-app-kohl.vercel.app/complete',
        type: 'account_onboarding',
    });


    res.send({
        url: accountLink?.url
    })

});

router.post('/api/pay', async (req, res) => {

    const { currency, card, order_id } = req.body;

    const response = new Response();

    try {

        Orders.findById(order_id)
        .populate([{ path: 'sellers.seller_id' }])
            .then(async (order) => {

                if (order) {

                    // Create a Payment Method with the credit card details
                    const paymentMethod = await stripe.paymentMethods.create({
                        type: 'card',
                        card: {
                            number: card.number,
                            exp_month: card.exp_month,
                            exp_year: card.exp_year,
                            cvc: card.cvc,
                        },
                    });

                    // Attach the Payment Method to a customer
                    const customer = await stripe.customers.create();
                    await stripe.paymentMethods.attach(paymentMethod.id, {
                        customer: customer.id,
                    });

                    // Create a Payment Intent with the Payment Method
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount:order.amount,
                        currency,
                        customer: customer.id,
                        payment_method: paymentMethod.id,
                        confirm: true,
                    });

                    if (paymentIntent.status === 'succeeded') {
                        // Calculate the amount to distribute to each connected account
                        const numAccounts = order.sellers.length; // replace with actual number of connected accounts

                        // Create a transfer for each connected account
                        for (let i = 0; i < numAccounts; i++) {
                            if(order.sellers[i].seller_id.stripe_id){
                                const transfer = await stripe.transfers.create({
                                    amount: order.sellers[i].total,
                                    currency: paymentIntent.currency,
                                    destination: order.sellers[i].seller_id.stripe_id, // replace with actual connected account IDs
                                    transfer_group: paymentIntent.id,
                                });
                                console.log(`Transfer ${i} succeeded:`, transfer);
                            }
                        }
                    } else {
                        console.log('Payment failed:', paymentIntent.status);
                    }

                    Orders.findByIdAndUpdate(order_id, { payment:true }, (error, data) => {
                        if (data) {
                            console.log("Order Payment Updated");
                        }
                    })

                    res.send({
                        clientSecret: paymentIntent.client_secret,
                    });


                } else {
                    response.error = true
                    response.message = "Order Not Found"
                    res.status(422).send(response)
                }
            })
            .catch((err) => { console.log(err); res.send(err); })


    } catch (err) {
        res.status(500).send({
            error: {
                message: err.message,
            },
        });
    }
});


module.exports = router;