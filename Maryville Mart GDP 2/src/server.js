const express = require('express');
const path=require('path');
const app = express();
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv').config();
const port = process.env.PORT || 4040
const ngrok = require('@ngrok/ngrok');
const publicRouters = require('./Routers/publicRouters.js');
const adminRouters = require('./Routers/adminRouters.js');
const authRoutes = require('./Routers/authRouters.js');
const DirectoryPath=path.join(__dirname,'../public');
const AdminDirectoryPath = path.join(__dirname, '../admin');
const deliveryPartner = path.join(__dirname,'../Delivery-partner');
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use('/api/public', publicRouters);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRouters);
app.use(express.static(DirectoryPath));
app.use('/admin', express.static(AdminDirectoryPath));
app.use('/delivery-partner', express.static(deliveryPartner));

app.listen(port, ()=> {
    console.log(`Server running... http://localhost:${port}`);
});
