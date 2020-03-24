<template>
    <div id="update">


    </div>
</template>

<script>

    import io from "socket.io-client";

    const socket = io();

    export default {
        name: 'Update',
        data: function(){
            return {
            }
        },
        methods: {
        }
    }

</script>

<style scoped>
    #update {
        display: flex; 
        flex-direction: column;
        width: 200px;
    }
</style>