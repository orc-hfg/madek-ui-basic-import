<template>
    <div>
    
    <p v-if="error_msg">
        <span>ERROR:</span>
        &nbsp;
        <span>{{ error_msg }}</span>
        <hr/>
    </p>

    <Paging 
        :paging="paging"
        @changed="pagingChanged" />
    <EntriesGrid
        :entriesList="entriesList"
        :show_preview="true"
        :show_published="show_published"
        :show_actions="show_actions"
        :show_action_list="show_action_list"
        @clickedDelete="clickedDelete"
        @clickedEdit="clickedEdit"
        @clickedAdd="clickedAdd"
        @clickedView="clickedView" />
    </div>
</template>
<script setup lang="ts">

import { watch, ref, onMounted } from 'vue'


import EntriesGrid from './EntriesGrid.vue'
import { authHelper } from '../../modules/auth'
import { apiHelper } from '../../modules/api'
import { madekHelper } from '../../modules/madek'
import Paging from '../Paging.vue'
import {
    iMediaEntry,
    iMediaEntriesQuery,
    iMediaEntriesQueryFilterBy,
    iMediaEntriesQueryFilterByMediaEntry,
    buildMEQuery,
    iPagingState
 } from '../../api_resources'

const { api, user, authParams } = apiHelper()

interface Action {
    name: string
    icon: string
    label: string
}



const props = defineProps({
    show_paging: { type: Boolean, default: true, required: false},
    //show_data_stream: { type: Boolean, default: false, required: false},
    show_preview: { type: Boolean, default: true, required: false},
    show_published: { type: Boolean, default: true, required: false},
    show_actions: { type: Boolean, default: true, required: false},
    show_action_list: {type: Array<string>, default: ['add', 'view', 'edit', 'delete'], required: false },
    actions: { type:Array<Action>, default: {}, required: false},
    max_count: { type: Number, default: 10, required: false},
})

const default_paging : iPagingState = {
    page: 1,
    count: 8
}
const paging = ref(default_paging)

const error_msg = ref('' as string)
const entriesList = ref([] as iMediaEntry[])


const emit = defineEmits(['clickedEdit', 'clickedView', 'clickedAdd', 'clickedDelete'])


const handle_error = (msg: string, error: Response) => {
    const mmsg = "ERROR: " + msg + " status: " + error.status;
    console.error(mmsg);
    error_msg.value = mmsg;
}



const updateData = (show_published: boolean) => {

    const iquery : iMediaEntriesQuery = {
        filter_by_data: {
            media_entry: {
                responsible_user_id: user?.value?.id,
                is_published: show_published ? true : false
            } as iMediaEntriesQueryFilterByMediaEntry
        } as iMediaEntriesQueryFilterBy,
        //count: props.max_count,
        order: 'desc'
    }
    if (props.show_paging == true) {
        iquery.page = paging.value.page -1
        iquery.count = paging.value.count
    }
    buildMEQuery(iquery)
    
    api.api.mediaEntriesList(iquery, authParams?.value)
        .then(resp => {
            const melist = resp.data.media_entries as iMediaEntry[]
            entriesList.value = melist.sort( (a:iMediaEntry, b:iMediaEntry) => {
                const result = Date.parse(b.created_at)- Date.parse(a.created_at) 
                return result
            })

            entriesList.value.forEach(element => {
                    const entryId = element.id;
                    //console.log(" get media file for " + entryId);
                    
                });
            })
            .catch(error => handle_error("get mediaEntriesList: ", error));
}

const pagingChanged = (data: iPagingState) => {
    paging.value.page = data.page
    paging.value.count = data.count
    updateData(props.show_published)
}
const clickedEdit = (entryId: string) => {
    console.log("UEG:clickedEdit: " + entryId)
    emit('clickedEdit', entryId)
}

const clickedAdd = (entryId: string) => {
    console.log("UEG:clickedAdd: " + entryId)
    emit('clickedAdd', entryId)
}

const clickedView = (entryId: string) => {
    console.log("UEG:clickedView: " + entryId)
    emit('clickedView', entryId)
}

const clickedDelete = (entryId: string) => {
    console.log("UEG:clickedDelete: " + entryId)
    emit('clickedDelete', entryId) 
}


watch(props, () => {
    console.log("changed props: new " + JSON.stringify(props))
    updateData(props.show_published)
})

onMounted(() => {
    paging.value.count = props.max_count
    updateData(props.show_published)
})

</script>