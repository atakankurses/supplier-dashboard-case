const Vendor = require('../models/vendorModel');

exports.getVendors = async (req, res) => {
    const vendors = await Vendor.find();

    res.send(vendors);
}