const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Vendor = require('./models/vendorModel');
const ParentProduct = require('./models/parentProductModel');
const Order = require('./models/orderModel');
const orderRoutes = require('./routes/orderRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
dotenv.config()

app.use(bodyParser.json({limit: '10MB', extended: true}))
app.use(cors());

app.get("/", async (req, res) => {
    res.send("Test");
})

app.use("/orders", orderRoutes);
app.use("/vendors", vendorRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`)
    })
}).catch((err) => {
    console.error(err.message);
})