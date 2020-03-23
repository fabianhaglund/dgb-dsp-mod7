<template>
    <div>

        <p>Unique integer identifier</p>
        <input/>
        <p>Product code</p>
        <input/>
        <p>Quantity</p>
        <input/>
        <p>Price</p>
        <input/>

        <button v-on:click="insertProduct"/>


    </div>
</template>

<script>

    export default {
        name: 'Insert'
    }
</script>