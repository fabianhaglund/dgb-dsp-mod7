'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

//Select a port
const port = 8080;
app.set('port', (process.env.PORT || port));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, '../public/')));

// Serve vue from node_modules as vue/
app.use('/vue', express.static(path.join(__dirname, '../node_modules/vue/dist/')));
    

//Serve index.html: it's the only one we have ATM
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


// -- DB-related -- //

//Sets up the MongoClient
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@dsp-mod7-b-cluster-4xabi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

//Utility function
let highestUID = 1;
function getUID () {
    return highestUID++;
}

//Main function: once we connect to the mongo client, we start the server proper
client.connect(err => {
    if (err) {
        console.log(err);
        client.close();
        return;
    }

    const database = client.db("maindb");

    io.on("connection", function (socket) {
        console.log("We're in");

        //PUT : new products
        socket.on("putNewProduct", function({productCode, quantity, price, supplierId}) {
            const products = database.collection("Product");
            const productSupplier = database.collection("ProductSupplier");
            const productId = getUID();

            products.insertOne({productId, productCode, quantity, price}, (err) => {
                if (err) {
                    socket.emit("responsePutNewProduct", {success: false});
                } else {
                    productSupplier.insertOne({productId, supplierId}, (err) => {
                        if (err) {
                            socket.emit("responsePutNewProduct", {success: false});
                        } else {
                            socket.esmit("responsePutNewProduct", {success: true, productId});
                        }
                    });
                }
            });
        });

        //GET : products
        socket.on("getProducts", function() {
            const products = database.collection("Product");

            const ourString = JSON.stringify(products);

            socket.emit("responseGetProducts", {success: true, ourString});
        });


        //PUT : new suppliers
        socket.on("putNewSupplier", function({name, phone}) {
            const suppliers = database.collection("Supplier");
            const supplierId = getUID();

            suppliers.insertOne({supplierId, name, phone}, (err) => {
                if (err) {
                    socket.emit("responsePutNewSupplier", {success: false});
                } else {
                    socket.emit("responsePutNewSupplier", {success: true, supplierId});
                }
            });
        });


        //PUT : new orders
        socket.on("putNewOrder", function({productId, quantity}) {
            const orders = database.collection("Orders");
            const orderId = getUID();

            orders.insertOne({orderId, productId, quantity}, (err) => {
                if (err) {
                    socket.emit("responsePutNewOrder", {success: false});
                } else {
                    socket.emit("responsePutNewOrder", {success: true, orderId});
                }
            });
        });
    });

    const server = http.listen(app.get('port'), function() {
        console.log("Server listening on port " + app.get('port'));
    });
    //client.close();
});