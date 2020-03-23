<template>
    <div id="display">
        <button class="displayButton" v-on:click="displayProducts">Display!</button>
    </div>
</template>

<script>

    import io from "socket.io-client";

    const socket = io();

    export default {
        name: 'Display',
        methods: {
            displayProducts: function(){
                socket.emit('getProducts');
                socket.on('responseGetProducts', function({success, ourString}) {
                    console.log("...how?");
                    if (success) {
                        console.log(ourString);
                    } else {
                        console.log("Something went wrong displaying the products!");
                    }
                });
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