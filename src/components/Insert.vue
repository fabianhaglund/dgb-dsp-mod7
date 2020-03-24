<template>
    <div id="insert">

        <p>Product code</p>
        <input v-model="productCode"/>

        <p>Quantity</p>
        <input v-model="quantity" type="number"/>

        <p>Price</p>
        <input v-model="price" type="number"/>

        <p>Supplier ID</p>
        <input v-model="supplierId"/>

        <button class="actionButton" v-on:click="insertProduct">Confirm</button>


    </div>
</template>

<script>

    import io from "socket.io-client";

    const socket = io();

    export default {
        name: 'Insert',
        data: function(){
            return {
                productCode: "",
                quantity: 0,
                price: 0,
                supplierId: "", 
            }
        },
        methods: {
            insertProduct: function(){
                console.log("Insert product into database:");
                console.log("productCode: " + this.productCode); 
                console.log("quantity: " + this.quantity);
                console.log("price " + this.price);
                console.log("supplier ID " + this.supplierId);
                socket.emit('putNewProduct', {"productCode": this.productCode, "quantity": this.quantity, "price": this.price, "supplierId": this.supplierId});
            }
        }
    }

</script>

<style scoped>
    #insert {
        display: flex; 
        flex-direction: column;
        width: 200px;
    }
</style>