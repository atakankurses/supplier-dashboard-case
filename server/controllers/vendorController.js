const Vendor = require('../models/vendorModel');

exports.getVendors = async (req, res) => {
    const vendors = await Vendor.find().limit(20);

    res.send(vendors);
}