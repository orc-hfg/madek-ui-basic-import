<template>
    <div class="mediaEntryView">
        <div style="float: right">
            <span>Id:</span>
            &nbsp;
            <InputText type="text" v-model.lazy.trim="$route.params.entry_id as string" class="gap-1"/>
            &nbsp;
            <Button label="Edit"
              severity="secondary"
              @click.prevent="clickedEdit()">
              <i class="pi pi-pencil"/>
              &nbsp;
              <i class="pi pi-caret-right"/>
              
              </Button>

        </div>
        <h2>Medien-Eintrag:</h2>
        <OkOrError :error_msg="error_msg"/>
        <div class="flex flex-wrap">
          
            

            
            <div class="col-12 lg:h-20rem sm:h-13rem sm:col-6 md:col-4 lg:col-4 border-1 surface-border border-round px-1 py-1" >
                <EntryPreview :entry_data="mediaEntryDetails" size="large" class=" px-1 py-1" />
            </div>
            <div class="col-12 md:col-8 lg:col-8 border-1 surface-border border-round px-3 py-1">
              <h3>
                <span>Meta-Daten:</span>
                <SelectButton 
                    v-model="mdshow_mode"
                    :options="mdshow_mode_options"
                    option-label="name"
                    style="float:right"/>
              </h3>
              <br/>
              
              <MetaDataView 
                class="px-1 border-1 surface-border surface-card border-round"
                  :entry-id="$route.params.entry_id as string"
                  :mode="mdshow_mode.value" />
              
            </div>
            
       
        </div>        
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiHelper } from '../../modules/api';
import { madekHelper } from '../../modules/madek';
import { errorHelper } from '../../modules/error';
import SelectButton from 'primevue/selectbutton';
import MetaDataView from '../../components/meta-data/MetaDataView.vue';
import EntryPreview from '../../components/files/EntryPreview.vue';
import OkOrError from '../../components/OkOrError.vue';

const {  } = madekHelper()

const route = useRoute()
const router = useRouter()

const { api, authParams} = apiHelper()
const { error_msg, handle_error, reset_error } = errorHelper()

const mdshow_mode = ref({ name: 'Core', value: 'showCore' })

const mdshow_mode_options = [
        { name: 'All', value: 'showAll' },
        { name: 'Summary', value: 'showSummary' },
        { name: 'Core', value: 'showCore' },
        { name: 'Title', value: 'showTitle' },
        //{ name: 'Hide', value: 'showNon' }
      ]

const clickedEdit = () => {
    const entryId = route.params.entry_id
    router.push({ path: `/entry/edit/${entryId}`})
}


const mediaEntryDetails = ref({} as object)

const updateData = () => {
    reset_error()

    const eid = route.params.entry_id as string
    api.api.mediaEntryDetail(eid, authParams?.value)
        .then(result => {
          mediaEntryDetails.value = result.data
        })
        .catch(error => handle_error('get mediaEntriesDetail: ', error))
}


onMounted(() => {
  
  updateData()
})

</script>
<style scoped>
input {
    width: 24em;
}
.ippad-small {
  padding: 0.7rem;
}
.preview {
  width: 50%;
  max-width: 50%;
  height: 100%;
  border: 1px solid lightgray;
}
</style>