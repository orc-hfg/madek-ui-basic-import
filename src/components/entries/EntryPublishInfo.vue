<template>
    <div>
        <span>Fehlende Meta-Daten:</span>
        <div v-if="publish_result?.publishable != true"
            class="flex flex-wrap">
            <span v-for="mkid in publish_result?.failedKeys"
                class="px-1 py-1">
                <Tag severity="danger">{{ mkid }}</Tag>
                <br/>
            </span>                    
        </div>
    
    </div>
</template>
<script setup lang="ts">

import { watch, ref, onMounted } from 'vue'
import Tag from 'primevue/tag';
import {
    iMediaFile,
    iMediaEntry,
    iPreview,
    iPublishableResult,
    iCollection,
    iMediaEntriesQuery,
    iMediaEntriesQueryFilterBy,
    iMediaEntriesQueryFilterByMediaEntry,
    buildMEQuery
 } from '../../api_resources'

import { apiHelper } from '../../modules/api'
import { madekHelper } from '../../modules/madek'
const { api, authParams } = apiHelper()
const { checkPublishable } = madekHelper()
const props = defineProps({
    entry_id: { type: String, required: true},
    publish_result: { type: Object , required: true }
})

//const publish_result = ref()
/*
const tryPublish = (entryId: string) => {
    api.api.mediaEntryPublishUpdate(entryId, authParams?.value)
        .then(resp => {
            console.log("publish result: " + JSON.stringify(resp.data))


        })
}
*/
watch(props, () => {
    console.log("changed props: " + props.entry_id)
    
  /*  checkPublishable(props.entry_id , (result:iPublishableResult) => {
        console.log("checkPublishable: " + props.entry_id + ' result:\n' + JSON.stringify(result))
        publish_result.value = result
    })*/
})

onMounted(() => {
    console.log("onMounted: " + props.entry_id)
    /*checkPublishable(props.entry_id , (result:iPublishableResult) => {
        console.log("checkPublishable: " + props.entry_id + ' result:\n' + JSON.stringify(result))
        publish_result.value = result
    })*/
})

</script>
