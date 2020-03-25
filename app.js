/* jslint node: true */
/* eslint-env node */
'use strict';

// Require express, socket.io, and vue
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');

const ObjectID = require('mongodb').ObjectID;

// Pick arbitrary port for server
const port = 3000;
app.set('port', (process.env.PORT || port));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public/')));
// Serve vue from node_modules as vue/

app.use('/vue',
	express.static(path.join(__dirname, '/node_modules/vue/dist/')));

// Serve index.html directly as root page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});


// -- DB-related -- //

//Sets up the MongoClient
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@dsp-mod7-b-cluster-4xabi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

//Utility function
let highestUID = 1;
function getUID () {
    return ObjectID();
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
        socket.on("createNewProduct", function({productCode, quantity, price, supplierId}) {
            const products = database.collection("Product");
            const productSupplier = database.collection("ProductSupplier");
            const productId = getUID();

            products.insertOne({productId, productCode, quantity, price}, (err) => {
                if (err) {
                    socket.emit("responseCreateNewProduct", {success: false});
                } else {
                    productSupplier.insertOne({productId, supplierId}, (err) => {
                        if (err) {
                            socket.emit("responseCreateNewProduct", {success: false});
                        } else {
                            socket.emit("responseCreateNewProduct", {success: true, productId});
                        }
                    });
                }
            });
        });

        //GET : products
        socket.on("getProducts", async function() {
        const products = database.collection("Product");
          let returnValue= {};
          await products.find().forEach(element => returnValue[element._id] = element);
          socket.emit("responseGetProducts", {success: true, returnValue});
        });


        //PUT : new suppliers
        socket.on("createNewSupplier", function({name, phone}) {
            const suppliers = database.collection("Supplier");
            const supplierId = getUID();

            suppliers.insertOne({supplierId, name, phone}, (err) => {
                if (err) {
                    socket.emit("responseCreateNewSupplier", {success: false});
                } else {
                    socket.emit("responseCreateNewSupplier", {success: true, supplierId});
                }
            });
        });


        //PUT : new orders
        socket.on("createNewOrder", function({productId, quantity}) {
            const orders = database.collection("Orders");
            const orderId = getUID();

            orders.insertOne({orderId, productId, quantity}, (err) => {
                if (err) {
                    socket.emit("responseCreateNewOrder", {success: false});
                } else {
                    socket.emit("responseCreateNewOrder", {success: true, orderId});
                }
            });
        });

	socket.on("updateProduct", function({id, productData }) {
	    console.log("updateProduct");
	    var objectId = new ObjectID(id);
	    const products = database.collection("Product");
	    products.updateOne(
		{"_id": objectId}, {$set: {
		"productCode": productData.productCode,
		"quantity": productData.quantity,
		"price": productData.price,
		"supplierId": productData.supplierId,
		}}
	    );
	});
    });

    const server = http.listen(app.get('port'), function() {
        console.log("Server listening on port " + app.get('port'));
    });
    //client.close();
});
