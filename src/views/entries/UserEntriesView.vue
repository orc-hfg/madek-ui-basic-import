<template>
  <div class="entriesView">
    <h3>Deine Medien Einträge:</h3>

    <h4>Vollständige Einträge:</h4>
    <UserEntriesGrid
      :show_published="true"
      :show_preview="showDSTriggerReload"
      :show_action_list="['view', 'edit', 'add', 'delete']"
      @clickedEdit="clickedEdit"
      @clickedView="clickedView"
      @clickedAdd="clickedAdd"
      @clickedDelete="clickedDelete"
    />

    <h4>Unvollständige Einträge:</h4>
    <UserEntriesGrid
      :show_published="false"
      :show_preview="showDSTriggerReload"
      
      :show_action_list="['view', 'edit', 'delete']"
      @clickedEdit="clickedEdit"
      @clickedView="clickedView"
      @clickedDelete="clickedDelete"
    />

    <Dialog v-model:visible="askAddShow" class="">
      
      <div class="ask_dialog">
        <div v-if="add2CollectionResult">
          <p>
              <span>Add to collection result:</span>
              <br/>
              <span>
              {{ add2CollectionResult }}
              </span>
          </p>
          
          <Button label="Show Collection" @click="clickedShowCollection()"/>
        </div>

        <div v-else-if="add2CollectionError">
          <p>
              <span>Add to collection error:</span>
              <br/>
              <span>
              {{ add2CollectionError }}
              </span>
          </p>
          <Button label="OK" @click="askAddShow = !askAddShow"/>
        </div>

        <div v-else>
          <p>
            <span>Select Collection to add to:</span>
          </p>
          <CollectionSelect 
            :collection_list="collection_list"
            @selected-collection-id="addSelectedCollection"/>
        </div>
      </div>
    </Dialog>

    <Dialog v-model:visible="askDeleteShow" class="ask_dialog">
            <div v-if="deleteResult">
                <h4>Deleted Media Entry:</h4>
                <p>ID: {{ askDeleteEntryId }}</p>
                <p>
                    <JsonViewer :value="deleteResult"/>
                </p>
                <Button label="OK" @click.prevent="askDeleteEntryId = ''; askDeleteShow = false"/>
            </div>
            <div v-else-if="deleteError">
                <h4>Could not delete Media Entry:</h4>
                <p>ID: {{ askDeleteEntryId }}</p>
                <p>
                    <JsonViewer :value="deleteError"/>
                </p>
                <Button label="OK" @click.prevent="askDeleteEntryId = ''; askDeleteShow = false"/>
            </div>
            <div v-else>
                <h4>Delete Media Entry?</h4>

                <p>ID: {{ askDeleteEntryId }}</p>


                <Button label="OK" @click.prevent="clickedDeleteConfirm(askDeleteEntryId)"/>
                &nbsp;
                <Button label="Cancel" @click.prevent="askDeleteEntryId = ''; askDeleteShow = false"/>
            </div>
<!--
            <Button label="Override OK" @click.prevent="clickedDeleteConfirm(askDeleteEntryId)"/>
    -->        
        </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Dialog from 'primevue/dialog'


import UserEntriesGrid from "../../components/entries/UserEntriesGrid.vue";
import CollectionSelect from "../../components/collections/CollectionSelect.vue";
import { authHelper } from "../../modules/auth";
import { apiHelper } from "../../modules/api";
import { madekHelper } from "../../modules/madek";
import { errorHelper } from "../../modules/error";
import { iCollection } from "../../api_resources";

const { error_msg, handle_error} = errorHelper()
const router = useRouter();
const { user, authParams } = authHelper();
const { api } = apiHelper();
const {  } = madekHelper();

const showDSTriggerReload = ref(true as boolean)
const askDeleteEntryId = ref("" as string);
const askDeleteShow = ref(false as boolean);
const deleteResult = ref("" as string);
const deleteError = ref("" as string);

const clickedDelete = (entryId: string) => {
  console.log("UEV clickedDelete: " + entryId);
  
  deleteError.value = "";
  deleteResult.value = "";
  askDeleteEntryId.value = entryId;
  askDeleteShow.value = true;
};

const clickedDeleteConfirm = (entryId: string) => {
  console.log("clickedDeleteConfirm: " + entryId);
  deleteError.value = "";
  deleteResult.value = "";
  api.api.mediaEntryDelete(entryId, authParams?.value)
    .then((resp) => {
      const msg = "deleted media entry " + JSON.stringify(resp.data);
      console.log(msg);
      deleteResult.value = resp.data;
      showDSTriggerReload.value = false
      askDeleteShow.value = false
      setTimeout(()=> {
        showDSTriggerReload.value = true
      },100)
      
    })
    .catch((error) => {
      deleteError.value = error;
      handle_error("Could not delete media entry: ", error);
    });
};

const clickedView = (entryId: string) => {
  console.log("UEV clickedView: " + entryId);
  router.push({ path: `/entry/view/${entryId}` });
};

const clickedEdit = (entryId: string) => {
  console.log("UEV clickedEdit: " + entryId);
  router.push({ path: `/entry/edit/${entryId}` });
};

const askAddEntryId = ref("" as string);
const askAddShow = ref(false as boolean);
const addResult = ref("" as string);
const addError = ref("" as string);
const collection_list = ref([] as iCollection[])


const updateCollectionList = () => {
    const query = {
      responsible_user_id: user?.value?.id,
        me_get_metadata_and_previews: true,
        me_get_full_size: true,
    }
    api.api.collectionsList(query, authParams?.value)
        .then(result => {
            const cols = result.data.collections as iCollection[]

            collection_list.value = cols.sort((a:iCollection, b:iCollection) => {
                const result = Date.parse(b.created_at)- Date.parse(a.created_at) 
                return result
            })
            
  })
  .catch(error => handle_error('api collectionsList:', error))
  
}

const clickedAdd = (entryId: string) => {
  console.log("UEV clickedEdit: " + entryId);
  updateCollectionList()
  addResult.value = ""
  addError.value = ""
  askAddEntryId.value = entryId
  askAddShow.value = true
  add2CollectionError.value = ''
  add2CollectionResult.value = ''
  add2CollectionId.value = ''
};

const add2CollectionError = ref('' as string)
const add2CollectionResult = ref('' as string)
const add2CollectionId = ref('' as string)

const addSelectedCollection = (id:string) => {
    console.log("addSelectedCollection: " + id + ":")
    const collectionId = id

    add2CollectionId.value = id

    const body = {
        position: 10,
        cover: false
    };
    
    api.api.collectionMediaEntryArcCreate(collectionId,
		askAddEntryId.value,
		body,
		authParams?.value)
	.then(resp => {
        const msg = "Entry added to collection!" + " : " + JSON.stringify(resp.data)
		console.log(msg)
        add2CollectionResult.value = msg
	}).catch(error => {
          const parsed = JSON.stringify(error.error.message)
            const msg = "Could not add media entry to collection: " + parsed
            add2CollectionError.value = msg
		      handle_error(msg,error)    
        
	})

    //showCollectionList.value = false
}

const clickedShowCollection = () => {
    console.log("clickedShowCollection: " + add2CollectionId.value)
    router.push({path: `/collection/entryList/${add2CollectionId.value}`})
}

onMounted(() => {
  
});
</script>

<style >
input {
  width: 24em;
}
img {
  width: 10em;
  height: auto;
}
.p-dialog .ask_dialog {
  width: 70vw;
}
</style>
