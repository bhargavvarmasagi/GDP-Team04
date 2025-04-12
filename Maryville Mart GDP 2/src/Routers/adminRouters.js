const express = require('express')
const Router = express.Router();
const multer = require('multer');
const Controllers = require('../Controllers/adminControllers.js')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { parse } = require('dotenv');

const dotenv=require('dotenv').config();

cloudinary.config({ 
    cloud_name: 'dyxhjjm73', 
    api_key: '571995274645822', 
    api_secret: 'P_rsaGvZASoh9CrAUd3O3Bm_c6U' 
});

const upload = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "products"
    }
});

const parser = multer({ storage: upload });


Router.get('/getProducts', Controllers.getProducts);
Router.get('/products/:id', Controllers.getProductById);
Router.get('/orders', Controllers.getOrders);
Router.get('/getStores', Controllers.getStores);
Router.get('/getStore/:id', Controllers.getStoreById);

Router.post('/login', Controllers.login);
Router.post('/addProduct', parser.single('image'), Controllers.addProduct);
Router.post('/addStore', Controllers.addStore);


Router.put('/updateProduct/:id', Controllers.updateProduct);
Router.put('/updateStore/:id', Controllers.updateStore);
Router.put('/orders/:orderId/status', Controllers.updateOrderStatus);

Router.delete('/deleteProduct/:id', Controllers.deleteProduct);
Router.delete('/deleteStore/:id', Controllers.deleteStore);
 

module.exports = Router