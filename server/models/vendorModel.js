const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
    },
});

const Vendor = mongoose.model('Vendors', vendorSchema);

module.exports = Vendor;