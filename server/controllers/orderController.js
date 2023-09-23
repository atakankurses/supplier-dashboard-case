const Order = require('../models/orderModel');
const mongoose = require('mongoose');
const luxon = require('luxon');

exports.getOrders = async (req, res) => {
    const orders = await Order.find();

    res.send(order);
};

exports.getMonthlyData = async(req, res) => {
    try {
        const vendorId = req?.body?.vendor;
        const year = req?.body?.year;
        const startDate = luxon.DateTime.fromISO(`${year}-01-01T00:00:00.000+00:00`);
        const endDate = luxon.DateTime.fromISO(`${year}-12-31T23:59:59.999+00:00`);
        const orders = await Order.aggregate([
            {
                $match: {
                    payment_at: {$gte: startDate, $lt: endDate}
                }
            },
            {
                $unwind: {
                    path: "$cart_item"
                },
            }, 
            {
                $lookup: {
                    from: "parent_products",
                    localField: "cart_item.product",
                    foreignField: "_id",
                    as: "cart_item.product",
                },
            },
            {
                $unwind: {
                    path: "$cart_item.product",
                    preserveNullAndEmptyArrays: true,     
                },
            },
            {
                $match: {
                    "cart_item.product.vendor": new mongoose.Types.ObjectId(vendorId),
                },
            },
            {
                $group: {
                    _id: {
                        $month: "$payment_at",
                    },
                    count: {
                        $sum: {
                            $multiply: ['$cart_item.item_count', '$cart_item.quantity']
                        }
                    }
                },
            },
        ]);

        res.send(orders);

    } catch (err){
        console.error(err.message)
    }
}

exports.getAllTimeData = async(req, res) => {
    try {
        const vendorId = req?.body?.vendor;
        const orders = await Order.aggregate([
            {
                $unwind: {
                    path: "$cart_item"
                },
            }, 
            {
                $lookup: {
                    from: "parent_products",
                    localField: "cart_item.product",
                    foreignField: "_id",
                    as: "cart_item.product",
                },
            },
            {
                $unwind: {
                    path: "$cart_item.product",
                    preserveNullAndEmptyArrays: true,     
                },
            },
            {
                $match: {
                    "cart_item.product.vendor": new mongoose.Types.ObjectId(vendorId),
                },
            },
            {
                $group: {
                    _id: "$cart_item.product._id",
                    count: {
                        $sum: {
                            $multiply: ['$cart_item.item_count', '$cart_item.quantity']
                        }
                    },
                    product: {
                        $first: "$cart_item.product"
                      }
                },
            },
            {
                $sort: {
                    "product.name": 1,
                }
            }
        ]);

        res.send(orders);

    } catch (err){
        console.error(err.message)
    }
}