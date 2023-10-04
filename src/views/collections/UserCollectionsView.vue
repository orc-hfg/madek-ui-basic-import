<template>
    <div>
        <div v-if="error_msg" >ERROR: {{ error_msg }}</div>

        <Paging 
            :page="pagingPage"
            :count="pagingCount"
            @changed="pagingChanged" />
            
        <CollectionsGrid
            :collectionsList="allCollections"
            :show_action_list="['view', 'edit', 'delete']"
            @clickedView="clickedView"
            @clickedEdit="clickedEdit"
            @clickedEntries="clickedEntries"
            @clickedDelete="clickedDelete"
            />

        <Dialog v-model:visible="askDeleteShow">
            <div v-if="deleteResult">
                <h4>Deleted Collection:</h4>
                <p>ID: {{ askDeleteId }}</p>
                <p>
                    <JsonViewer :value="deleteResult"/>
                </p>
                <Button label="OK" @click.prevent="askDeleteId = ''; askDeleteShow = false"/>
            </div>
            <div v-else-if="deleteError">
                <h4>Could not delete Collection:</h4>
                <p>ID: {{ askDeleteId }}</p>
                <p>
                    <JsonViewer :value="deleteError"/>
                </p>
                <Button label="OK" @click.prevent="askDeleteId = ''; askDeleteShow = false"/>
            </div>
            <div v-else>
                <h4>Delete Collection?</h4>

                <p>ID: {{ askDeleteId }}</p>


                <Button label="OK" @click.prevent="clickedDeleteConfirm(askDeleteId)"/>
                &nbsp;
                <Button label="Cancel" @click.prevent="askDeleteId = ''; askDeleteShow = false"/>
            </div>

        </Dialog>

    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { apiHelper } from '../../modules/api';
import { authHelper } from '../../modules/auth'
import { madekHelper } from '../../modules/madek';
import { errorHelper } from '../../modules/error';
import MetaDataView from '../../components/meta-data/MetaDataView.vue'
import { iCollection } from '../../api_resources';
import CollectionsGrid from '../../components/collections/CollectionsGrid.vue'
import Dialog from 'primevue/dialog';
import Paging from '../../components/Paging.vue';

const { 
    
} = madekHelper()

const route = useRoute()
const router = useRouter()

const { api, authParams} = apiHelper()
const { user } = authHelper()
const { error_msg, handle_error, reset_error } = errorHelper()


const props = defineProps({
    max_count: { type: Number, default: 10, required: true}
})

const show_paging = ref(true)
const pagingPage = ref(1)
const pagingCount = ref(10)
const allCollections = ref([] as iCollection[])

watch(props, () => {
    pagingCount.value = props.max_count
})
const updateData = () => {
    reset_error()

    const userId = user?.value?.id
    const iquery = {
        full_data: true,
        me_edit_metadata_and_relations:true,
        creator_id: userId,
    }
    if (show_paging.value == true) {
        iquery.page = pagingPage.value -1
        iquery.count = pagingCount.value
    }
    
    api.api.collectionsList(iquery, authParams?.value)
        .then(resp => {
            console.log("got colls")
            const cols = resp.data.collections as iCollection[]
            allCollections.value = cols
            
            
            
        })
        .catch(error => handle_error('get collectionList', error))
}

const pagingChanged = (data) => {
    pagingPage.value = data.page
    pagingCount.value = data.count
    updateData()
}
const clickedEdit = (colId: string) => {
    console.log("UCV: clickedEdit:" + colId)
    router.push({ path: `/collection/edit/${colId}`})
}
const clickedView = (colId: string) => {
    console.log("UCV: clickedView:" + colId)
    //router.push({ path: `/collection/view/${colId}`})
    router.push({ path: `/collection/entryList/${colId}`})
}

const clickedEntries = (colId: string) => {
    console.log("UCV: clickedEntries:" + colId)
    router.push({ path: `/collection/entryList/${colId}`})
}


const askDeleteId = ref("" as string);
const askDeleteShow = ref(false as boolean);
const deleteResult = ref("" as string);
const deleteError = ref("" as string);

const clickedDelete = (colId: string) => {
    console.log("UCV: clickedDelete:" + colId)

  deleteError.value = "";
  deleteResult.value = "";
  askDeleteId.value = colId;
  askDeleteShow.value = true;
}

const clickedDeleteConfirm = (colId: string) => {
  console.log("clickedDeleteConfirm: " + colId);
  deleteError.value = "";
  deleteResult.value = "";
  api.api.collectionDelete(colId, authParams?.value)
    .then((resp) => {
      const msg = "deleted collection " + JSON.stringify(resp.data);
      console.log(msg);
      deleteResult.value = resp.ok ? 'OK' : 'Failed';
      updateData()
      askDeleteShow.value = false
      
      
    })
    .catch((error) => {
      deleteError.value = error;
      handle_error("Could not delete media entry: ", error);
    });
};

onMounted(() => {
    pagingCount.value = props.max_count
  
  updateData()
})


</script>