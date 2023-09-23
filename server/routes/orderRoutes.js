const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get("/", orderController.getOrders);

router.post("/getMonthlyData", orderController.getMonthlyData);
router.post("/getAllTimeData", orderController.getAllTimeData);

module.exports = router;