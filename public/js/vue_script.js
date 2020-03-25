/**
 * Instantiates in Strict mode, and opens a socket we'll need later
 */
"use strict";
const socket = io();

const vm = new Vue({
    el: '#everything',
    data: {
        productCode: "",
        quantity: 0,
        price: 0,
        supplierId: "",
	    productId: "",
        supplierName: "",
        supplierPhone: "",
        orderId: "",
    },
    mounted: function() {
        socket.on('responseGetProducts', function ({success, returnValue}) {
            console.log(JSON.stringify(returnValue));
        });
        socket.on('responseGetSuppliers', function({success, returnSupplier}) {
                console.log(JSON.stringify(returnSupplier));
        });
        socket.on('responseDeleteProduct', function ({success}) {
            if (!success) {
                console.error("Product was not deleted properly!");
            } else { 
                console.log("Product was deleted succesfully!");
            }
        });
        socket.on('responseDeleteSupplier', function ({success}) {
            if (!success) {
                console.error("Supplier was not deleted properly!");
            } else {
                console.log("Supplier was deleted succesfully!");
            }
        });
	    socket.on('responseDeleteOrder', function ({success}) {
            if (!success) {
                console.error("Order was not deleted properly!");
            } else {
                console.log("Order was deleted succesfully!");
            }
        });
	    socket.on('responseGetOrders', function ({success, returnValue}) {
	        if (success) {
		        console.log(JSON.stringify(returnValue));
	        } else {
		        console.log("Something went wrong in socket.emit('getOrders')");
	        }
        });
    },
    methods: {

        /*  PRODUCT   CLIENT LOGIC   */

        createProduct: () => {
            console.log("socket.emit createProduct");
            let productData = 
                {
                    productCode: vm.productCode, 
                    quantity: vm.quantity,
                    price: vm.price,
                    supplierId: vm.supplierId
                };
            socket.emit('createNewProduct', productData);
            return false;
        },
        readProducts: () => {
            console.log("readProducts");
            socket.emit('getProducts');
            return false;
        },
        updateProduct: () => {
            console.log("updateProduct");
            let productData = {
                productCode: vm.productCode,
                quantity: vm.quantity,
                price: vm.price,
                supplierId: vm.supplierId
            };
            let productId = vm.productId;
            socket.emit("updateProduct", { productId, productData });
        },
        deleteProduct: () => {
            if (vm.productId !== "") {
                socket.emit("deleteProduct", {productID: vm.productId});
            }
            return false;
        },

        /*  ORDER   CLIENT LOGIC   */

        createOrder: () => {
            console.log("createOrder");
            let productId = vm.productId;
            let quantity = vm.quantity; 
            socket.emit("createNewOrder", { productId, quantity });
        },
        readOrders: () => {
            console.log("readOrders")M
            socket.emit('getOrders');
            return false;
        },
        updateOrder: () => {
            console.log("socket.emit updateOrder");
            let orderId = vm.orderId;
            let productId = vm.productId;
            let quantity = vm.quantity;
            socket.emit("updateOrder", { orderId, productId, quantity });
        },
        deleteOrder: () => {
            if (vm.orderId !== "") {
                socket.emit("deleteOrder", {orderId: vm.orderId});
            }
            return false;
        },

        /*  ORDER   CLIENT LOGIC   */

        createSupplier: () => {
            console.log("createSupplier");
            let supplierData =
            {
                   name: vm.supplierName,
                   phone: vm.supplierPhone        
            };
            socket.emit("createNewSupplier", supplierData);
            socket.on("responseCreateNewSupplier", function({success, supplierId}){
                console.log("New supplier has id: " + supplierId);
            });
            return false;
        },
        readSuppliers: () => {
           console.log("readSuppliers");
           socket.emit('getSuppliers');
           return false; 
        },
        updateSupplier: () => {
            console.log("socket.emit updateSupplier")
            let supplierId = vm.supplierId;
            let supplierName = vm.supplierName; 
            let supplierPhone = vm.supplierPhone;
            console.log(supplierId);
            console.log(supplierName);
            console.log(supplierPhone);
            socket.emit("updateSupplier", { supplierId, supplierName, supplierPhone });
        },
        deleteSupplier: () => {
            if (vm.supplierId !== "") {
                socket.emit("deleteSupplier", {supplierId: vm.supplierId});
            }
            return false;
        },
    }
});
