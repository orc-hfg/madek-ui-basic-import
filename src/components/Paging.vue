<template>
    <div style="float:right; padding-top: 1rem">
        <div></div>
        <div>
            &nbsp;
            <span>Seitenauswahl</span>
            &nbsp;
            <Button icon="pi pi-caret-left" @click.prevent="pagePrev()"/>
            <InputText type="number" v-model.lazy.trim="pagingPage" style="width: 3rem"/>
            <Button icon="pi pi-caret-right" @click.prevent="pageNext()"/>
            &nbsp;
            <span>von</span>
            &nbsp;
            <InputText type="number" v-model.lazy.trim="pagingCount" style="width: 4rem"/>
            &nbsp;
        </div>
    </div>
</template>
<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'

const props = defineProps({
    page: { type: Number, default: 1, required: true},
    count: { type: Number, default: 20, required: true},
})
const emit = defineEmits(['changed'])

const pagingPage = ref(1)
const pagingCount = ref(20)

const changed = () => {
    emit('changed',
     {
        page: pagingPage.value,
        count: pagingCount.value
    })
}
const pagePrev = () => {
    pagingPage.value--
    if (pagingPage.value < 1) pagingPage.value = 1
    changed()
}
const pageNext = () => {
    pagingPage.value++
    changed()
}

watch(props, () => {
    pagingPage.value = props.page
    pagingCount.value = props.count
})
onMounted(() => {
    pagingPage.value = props.page
    pagingCount.value = props.count
})

</script>
<style scoped>
</style>