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

        supplierName: "",
        supplierPhone: "",

        productId: "",
        orderId: ""
    },
    mounted: function() {
        socket.on('responseGetProducts', function ({success, returnValue}) {
            console.log(JSON.stringify(returnValue));
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
	socket.on('responseGetOrders', function ({success, returnValue}) {
	    if (success) {
		console.log(JSON.stringify(returnValue));
	    }
	    else {
		console.log("Something went wrong in socket.emit('getOrders')");
	    }
        });
    },
    methods: {
        createNewProduct: () => {
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
        createNewOrder: () => {
            console.log("createNewOrder");
            let productId = vm.productId;
            let quantity = vm.quantity; 
            socket.emit("createNewOrder", { productId, quantity });
        },
        displayAllProducts: () => {
            socket.emit('getProducts');
            return false;
        },
        submitNewSupplier: () =>{
            let supplierData =
            {
                   supplierName: vm.name,
                   supplierPhone: vm.phone        
            };
            socket.emit("createNewSupplier", supplierData);
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
        updateOrder: () => {
            console.log("socket.emit updateOrder");
            let orderId = vm.orderId;
            let productId = vm.productId;
            let quantity = vm.quantity;
            socket.emit("updateOrder", { orderId, productId, quantity });
        },
        deleteSupplier: () => {
            if (vm.supplierId !== "") {
                socket.emit("deleteSupplier", {supplierId: vm.supplierId});
            }
            return false;
        },
        deleteProduct: () => {
            if (vm.productId !== "") {
                socket.emit("deleteProduct", {productID: vm.productId});
            }
            return false;
        },
	    displayOrders: () => {
            socket.emit('getOrders');
            return false;
        },
    }
});
