const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cart_item: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Parent_Products'
            },
            variantId: {
                type: mongoose.Schema.ObjectId,
            },
            series: {
                type: String,
            },
            item_count: {
                type: Number,
            },
            quantity: {
                type: Number,
            },
            cogs: {
                type: Number,
            },
            price: {
                type: Number,
            },
            vendor_margin: {
                type: Number,
            },
            order_status: {
                type: String,
            },
        }
    ],
    payment_at: {
        type: Date,
    }
});

// orderSchema.pre(/^find/, function (next) {
//     this.populate({
//       path: 'cart_item.product',
//     });
//     next();
//   });

const Order = mongoose.model('Orders', orderSchema);

module.exports = Order;