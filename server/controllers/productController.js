const ParentProduct = require('../models/parentProductModel');

exports.getProducts = async (req, res) => {
    const products = await ParentProduct.find().limit(20);

    res.send(products);
}