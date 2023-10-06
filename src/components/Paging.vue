<template>
    <div style="float:right; padding-top: 1rem">
        <div>
            &nbsp;
            <span>Seitenauswahl</span>
            &nbsp;
            <Button icon="pi pi-caret-left" @click.prevent="pagePrev()"/>
            <!---<InputText type="number" 
                @change="pageChanged"
                v-model.lazy.trim="pagingPage"
                style="width: 4rem"/>-->

            <InputText type="number" 
                @change="pageChanged"
                v-model.lazy.trim="paging.page"
                style="width: 4rem"/>

            <Button icon="pi pi-caret-right" @click.prevent="pageNext()"/>
            &nbsp;
            <span>von</span>
            &nbsp;
            <InputText type="number"
                @change="pageChanged"
                v-model.lazy.trim="paging.count"
                style="width: 4rem"/>
            <!--<InputText type="number"
                @change="pageChanged"
                v-model.lazy.trim="pagingCount"
                style="width: 4rem"/>-->
            &nbsp;
        </div>
    </div>
</template>
<script setup lang="ts">
import { watch, ref, onMounted, PropType } from 'vue'
import { iPagingState } from '../api_resources';

const default_paging : iPagingState = {
    page: 1,
    count: 8
}

const props = defineProps({
//    page: { type: Number, default: 1, required: true},
//    count: { type: Number, default: 20, required: true},
    paging: { type: Object as PropType<iPagingState>, default: {page:1, count:8}, required: false }
})
const emit = defineEmits(['changed'])


const pageChanged = () => {
    emit('changed',
     {
        page: props.paging.page,
        count: props.paging.count
    })
}
const pagePrev = () => {
    props.paging.page--
    if (props.paging.page < 1) props.paging.page = 1
    pageChanged()
}
const pageNext = () => {
    props.paging.page++
    pageChanged()
}
/*
watch(props, () => {
    pagingPage.value = props.page
    pagingCount.value = props.count
})
onMounted(() => {
    pagingPage.value = props.page
    pagingCount.value = props.count
})*/

</script>
<style scoped>
</style>