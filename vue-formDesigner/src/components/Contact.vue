<template>
    {{ dataEgg.description }}
</template>
<script>
import dataEggs from "../data.json";
// console.log('dataEggs_: ', dataEggs)
export default {
    computed: {
        eggType() {
            return this.$route.params.eggType
        },
        dataEgg() {
            return dataEggs.find(v=> v.type===this.eggType)
        }
    }
}
</script>