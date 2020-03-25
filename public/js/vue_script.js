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

        supplierIdToDelete: "",
        productIdToDelete: "",
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
            let productData = {
                productCode: vm.productCode,
                quantity: vm.quantity,
                price: vm.price,
                supplierId: vm.supplierId
            };
            let id = vm.productId;
            socket.emit("updateProduct", { id, productData });
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
            if (vm.supplierIdToDelete !== "") {
                socket.emit("deleteSupplier", {supplierId: vm.supplierIdToDelete});
            }
            return false;
        },
        deleteProduct: () => {
            if (vm.productIdToDelete !== "") {
                socket.emit("deleteProduct", {productID: vm.productIdToDelete});
            }
            return false;
        },
	displayOrders: () => {
            socket.emit('getOrders');
            return false;
        },
    }
});
