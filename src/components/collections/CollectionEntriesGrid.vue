<template>
    <div>
        <Paging 
            :page="pagingPage"
            :count="pagingCount"
            @changed="pagingChanged" />
        <EntriesGrid 
            :entriesList="entriesList"
            :show_actions="show_actions"
            :show_published="show_published"
            :show_action_list="['view', 'edit', 'delete']"
            :show_preview="show_preview"
            @clickedDelete="clickedDelete"
            @clickedEdit="clickedEdit"
            @clickedView="clickedView"
            />
    </div>
</template>
<script setup lang="ts">

import { watch, ref, onMounted } from 'vue'
import { apiHelper } from '../../modules/api'
import { errorHelper } from '../../modules/error'
import {
    iMediaEntry,
    iMediaEntriesQuery,

} from '../../api_resources'

import EntriesGrid from '../entries/EntriesGrid.vue'
import Paging from '../Paging.vue'
const { api, authParams } = apiHelper()
const { error_msg, handle_error } = errorHelper()

const props = defineProps({
    show_paging: { type: Boolean, default: true, required: false},
    show_actions: { type: Boolean, default: false, required: false},
    show_preview: { type: Boolean, default: true, required: false},
    show_published: { type: Boolean, default: true, required: false},
    collection_id: { type: String, default: undefined, required: true }
})

const pagingPage = ref(1)
const pagingCount = ref(10)
const entriesList = ref([] as iMediaEntry[])
const queryResult = ref({})

const updateData = (show_published: boolean) => {
    if (!props.collection_id) {
        console.log("ABORT: invalid collection_id prop.")
        return
    }
    const iquery : iMediaEntriesQuery = {
        collection_id: props.collection_id,
        full_data: true,
        order: 'desc'
    }
    if (props.show_paging == true) {
        iquery.page = pagingPage.value -1
        iquery.count = pagingCount.value
    }

    api.api.mediaEntriesList(iquery, authParams?.value)
        .then(resp => {
            queryResult.value = resp.data
            entriesList.value = resp.data.media_entries as iMediaEntry[];
        })
        .catch(error => handle_error("get mediaEntriesList: ", error));
}

const pagingChanged = (data) => {
    pagingPage.value = data.page
    pagingCount.value = data.count
    updateData(props.show_published)
}

const emit = defineEmits(['clickedEdit', 'clickedView', 'clickedDelete'])

// TODO as emits
const clickedEdit = (entryId: string) => {
    console.log("clickedEdit: " + entryId)
    emit('clickedEdit', entryId)
}
const clickedView = (entryId: string) => {
    console.log("clickedView: " + entryId)
    emit('clickedView', entryId)
}
const clickedDelete = (entryId: string) => {
    console.log("clickedDelete: " + entryId)
    emit('clickedDelete', entryId)
}



watch(props, () => {
    console.log("changed props: new " + JSON.stringify(props))
    updateData(props.show_published)
})

onMounted(() => {
    updateData(props.show_published)
})

</script>