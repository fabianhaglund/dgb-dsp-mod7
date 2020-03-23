<template>
    <div>
        <div id="buttons">
            <button v-on:click="insert">Insert</button>
            <button>Remove</button>
            <button>Display</button>
            <button>Update</button>
        </div>

        <div v-if="showInsert">
            <Insert/>
        </div>

    </div>
</template>

<script>

import Insert from './Insert.vue'

export default {
    name: 'Start',
    components: {
        Insert
    },
    data: function (){
        return {
            showInsert: false
        }
    },
    methods: {
        insert: function(){
            console.log("insert");
            this.showInsert = true;
        }
    }
}
</script>

<style scoped>
    #buttons {
        display: flex; 
        flex-direction: row;
    }
</style>