<template>
    <div>
        <div id="buttons">
            <button v-on:click="insert">Insert</button>
            <button>Remove</button>
            <button v-on:click="display">Display</button>
            <button>Update</button>
        </div>

        <div v-if="modalToShow==='insert'">
            <Insert/>
        </div>
        <div v-if="modalToShow==='display'">
            <Display/>
        </div>

    </div>
</template>

<script>

import Insert from './Insert.vue'
import Display from './Display.vue'

export default {
    name: 'Start',
    components: {
        Insert,
        Display
    },
    data: function (){
        return {
            modalToShow: "none"
        }
    },
    methods: {
        insert: function(){
            console.log("insert");
            this.modalToShow = "insert";
        },
        display: function(){
            console.log("display");
            this.modalToShow = "display";
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