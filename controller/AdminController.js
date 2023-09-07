const Orders = require('../models/order');
const Products = require('../models/product');
const User = require('../models/user');
const Response = require('../utilities/response')



const dashboardStatistics = async(req, res) => {

    const response = new Response()
    var totalOrders = 0;
    var totalCustomers = 0;
    var totalProducts = 0;


    try {

        totalOrders = await Orders.countDocuments();

        totalCustomers = await User.countDocuments({type:{$ne:'admin'}});

        totalProducts = await Products.countDocuments();

        response.data = {"Orders":totalOrders,"Customers":totalCustomers,"Products":totalProducts}

        res.send(response)

    } catch (error) {
        console.log(error)
        res.send(error)
    }

}


module.exports = {
    dashboardStatistics
}