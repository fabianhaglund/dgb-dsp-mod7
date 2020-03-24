<template>
    <div id="display">
        <button class="actionButton" v-on:click="getProducts">Get products!</button>

        <div id="displayData">{{ this.responseGetProducts }}</div>
    </div>
</template>

<script scoped>

    import io from "socket.io-client";

    const socket = io();

    export default {
        name: 'Display',
        data: function(){
            return {
                responseGetProducts: "Click to fetch data"
            }
        },
        methods: {
            getProducts: function(){
                console.log("getProducts");
                socket.on('responseGetProducts', function({success, ourString}) {
                    console.log("...how?");
                    if (success) {
                        console.log(ourString);
                    } else {
                        console.log("Something went wrong displaying the products!");
                    }
                });
                socket.emit('getProducts');
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
    #displayData {
        margin: 20px;
        padding: 10px; 
        font-family: 'Courier New', Courier, monospace;
        font-size: 16px;    
    }
</style>