const express = require('express');
const router = new express.Router();
const Jwt_Secret="Deliveryapp";
const dotenv=require('dotenv').config();

const Controllers = require('../Controllers/controllers.js');
const dpControllers = require('../Controllers/deliveryPartnerControllers.js');

router.get('/test', (req,res) => {
    res.send('Server working fine...');
});
router.get('/getProducts', Controllers.getProducts);
router.get('/products/:id', Controllers.getProductById);
router.get('/orders', Controllers.getOrders);
router.get('/getStores', Controllers.getStores);
router.get('/getReviews', Controllers.getReviews);
router.get('/delivery-partner/orders', dpControllers.getOrdersByDeliveryPartner);

router.post('/order', Controllers.addOrder);
router.post('/addReview', Controllers.addReview);

router.delete('/deleteReview', Controllers.deleteReview);

module.exports = router
