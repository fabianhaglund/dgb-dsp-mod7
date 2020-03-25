/* jslint node: true */
/* eslint-env node */
"use strict";

// Require express, socket.io, and vue
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const fs = require("fs");

const ObjectID = require("mongodb").ObjectID;

// Pick arbitrary port for server
const port = 3000;
app.set("port", process.env.PORT || port);

// Serve static assets from public/
app.use(express.static(path.join(__dirname, "public/")));
// Serve vue from node_modules as vue/

app.use(
  "/vue",
  express.static(path.join(__dirname, "/node_modules/vue/dist/"))
);

// Serve index.html directly as root page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// -- DB-related -- //

//Sets up the MongoClient
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://admin:admin@dsp-mod7-b-cluster-4xabi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

//Utility function
let highestUID = 1;
function getUID() {
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

  io.on("connection", function(socket) {
    console.log("We're in");

    //CREATE : new products
    socket.on("createNewProduct", function({
      productCode,
      quantity,
      price,
      supplierId
    }) {
      const products = database.collection("Product");
      const productSupplier = database.collection("ProductSupplier");
      const productId = getUID();

      products.insertOne({ productId, productCode, quantity, price }, err => {
        if (err) {
          socket.emit("responseCreateNewProduct", { success: false });
        } else {
          productSupplier.insertOne({ productId, supplierId }, err => {
            if (err) {
              socket.emit("responseCreateNewProduct", { success: false });
            } else {
              socket.emit("responseCreateNewProduct", {
                success: true,
                productId
              });
            }
          });
        }
      });
    });

    //READ : products
    socket.on("getProducts", async function() {
      const products = database.collection("Product");
      let returnValue = {};
      await products
        .find()
        .forEach(element => (returnValue[element._id] = element));
      socket.emit("responseGetProducts", { success: true, returnValue });
    });

    //UPDATE: Products
    socket.on("updateProduct", function({ id, productData }) {
      console.log("updateProduct");
      var objectId = new ObjectID(id);
      const products = database.collection("Product");
      products.updateOne(
        { _id: objectId },
        {
          $set: {
            productCode: productData.productCode,
            quantity: productData.quantity,
            price: productData.price,
            supplierId: productData.supplierId
          }
        }
      );
    });

    //DELETE : Products
    socket.on("deleteProduct", async function({ productId }) {
        const productSupplier = database.collection("ProductSupplier");
        const products = database.collection("Product");

        let res = await products.deleteOne({productId: ObjectID(productId)});
        if (res.result.ok && res.result.n && res.result.n > 0) {
            // -- Since there's no "cascade delete" in a MongoDB database, we need to handle that ourselves
            res = await productSupplier.deleteMany({productId: ObjectID(productId)});      
            if (res.result.ok) {
                socket.emit("responseDeleteProduct", {success: true});
                console.log(res.result);
            } else {
                socket.emit("responseDeleteProduct", {success: false});
                console.warn(res.result);
            }
        } else {
            //No supplier found, or no succesful message sent
            socket.emit("responseDeleteProduct", {success: false});
            console.warn(res.result);
        }
    });


    //CREATE : new suppliers
    socket.on("createNewSupplier", function({ name, phone }) {
      const suppliers = database.collection("Supplier");
      const supplierId = getUID();

      suppliers.insertOne({ supplierId, name, phone }, err => {
        if (err) {
          socket.emit("responseCreateNewSupplier", { success: false });
        } else {
          socket.emit("responseCreateNewSupplier", {
            success: true,
            supplierId
          });
        }
      });
    });

    //UPDATE: update suppliers
    socket.on("updateSupplier", function({ supplierId, supplierName, supplierPhone }) {
      console.log("updateSupplier");
      var objectId = new ObjectID(supplierId);
      const suppliers = database.collection("Supplier");
      suppliers.updateOne(
        { _id: objectId },
        {
          $set: {
            _id: objectId,
            supplierId: objectId,
            name: supplierName,
            phone: supplierPhone
          }
        }
      );
    });

    //DELETE : Supplier
    socket.on("deleteSupplier", async function({supplierId}) {
        const supplier = database.collection("Supplier");
        const productSupplier = database.collection("ProductSupplier");
        const products = database.collection("Product");

        let res = await supplier.deleteOne({supplierId: ObjectID(supplierId)});
        if (res.result.ok && res.result.n && res.result.n > 0) {
            // -- Since there's no "cascade delete" in a MongoDB database, we need to handle that ourselves
            // -- Gets a bit tricky here since it's technically two degrees of indirection
            //Finds all products linked to our supplier, and deletes them
            let productsToDelete = [];
            await productSupplier.find({supplierId: ObjectID(supplierId)}).forEach((document) => {
                productsToDelete.push(document.productId);
            });
            res = await products.deleteMany({productId: {$in: productsToDelete}});
            if (res.result.ok) {
                if (res.deletedCount && res.deletedCount > 0) {
                    //Then, actually delete the link between product and supplier in that table
                    res = await productSupplier.deleteMany({supplierId: ObjectID(supplierId)});      
                    if (res.result.ok) {
                        socket.emit("responseDeleteSupplier", {success: true});
                        console.log(res.result);
                    } else {
                        socket.emit("responseDeleteSupplier", {success: false});
                        console.warn(res.result);
                    }
                } else {
                    //No cascade found, we're done here
                    socket.emit("responseDeleteSupplier", {success: true});
                    console.log(res.result);
                }
            } else {
                socket.emit("responseDeleteSupplier", {success: false});
                console.warn(res.result);
            }
        } else {
            //No supplier found, or no succesful message sent
            socket.emit("responseDeleteSupplier", {success: false});
            console.warn(res.result);
        }
    });


    //CREATE : new orders
    socket.on("createNewOrder", function({ productId, quantity }) {
        console.log("socket.on createNewOrder");
        const orders = database.collection("Orders");
        const orderId = getUID();
        productId = ObjectID(productId);

        orders.insertOne({ orderId, productId, quantity }, err => {
            if (err) {
                socket.emit("responseCreateNewOrder", { success: false });
            } else {
                socket.emit("responseCreateNewOrder", { success: true, orderId });
            }
        });
    });

    //UPDATE: update orders 
    socket.on("updateOrder", function({ orderId, productId, quantity }){
        console.log("socket.on updateOrder");
        const orders = database.collection("Orders");
        orderId = ObjectID(orderId);
        productId = ObjectID(productId);
        orders.updateOne (
            { "orderId": orderId },
            {
                $set: {
                    "orderId": orderId,
                    "productId": productId, 
                    "quantity": quantity
                }
            }
        );
    });


      //READ: orders
      socket.on("getOrders", async function() {
	  const orders = database.collection("Orders");
	  let returnValue = {};
	  await orders.find().forEach(element => (returnValue[element._id] = element));
	  socket.emit("responseGetOrders", { success: true, returnValue }); 
      });
  });


  const server = http.listen(app.get("port"), function() {
    console.log("Server listening on port " + app.get("port"));
  });
  //client.close();
});
