<template>
    <div id="insert">

        <p>Unique integer identifier</p>
        <input/>
        <p>Product code</p>
        <input/>
        <p>Quantity</p>
        <input/>
        <p>Price</p>
        <input/>

        <button class="submitButton" v-on:click="insertProduct">Confirm</button>


    </div>
</template>

<script>

    const socket = io();

    export default {
        name: 'Insert',
        methods: {
            insertProduct: function(){
                socket.emit('putNewProduct', {"productCode": "A100", "quantity": 20, "price": 400, "supplierId": "sjdksjdksjdk"})
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