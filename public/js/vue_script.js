/**
 * Instantiates in Strict mode, and opens a socket we'll need later
 */
'use strict';
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

    },
    methods: {
        submitNewProduct: () => {
            let productData = 
                {
                    productCode: vm.productCode, 
                    quantity: vm.quantity,
                    price: vm.price,
                    supplierId: vm.supplierId
                };
            socket.emit('putNewProduct', productData);
            return false;
        },
        displayAllProducts: () => {
            socket.on('responseGetProducts', function ({success, returnValue}) {
                console.log(JSON.stringify(returnValue));
            });
            socket.emit('getProducts');
            return false;
        },
        submitNewSupplier: () =>{
            let supplierData =
            {
                   supplierName: vm.name,
                   supplierPhone: vm.phone        
            };
            socket.emit("putNewSupplier", supplierData);
            return false;
        }
    }
})
