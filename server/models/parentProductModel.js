const mongoose = require('mongoose');

const parentProductSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendors'
    }
});

const ParentProduct = mongoose.model('Parent_Products', parentProductSchema);

module.exports = ParentProduct;