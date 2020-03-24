<template>
    <div id="remove">


    </div>
</template>

<script>

    import io from "socket.io-client";

    const socket = io();

    export default {
        name: 'Remove',
        data: function(){
            return {
            }
        },
        methods: {
        }
    }

</script>

<style scoped>
    #remove {
        display: flex; 
        flex-direction: column;
        width: 200px;
    }
</style>