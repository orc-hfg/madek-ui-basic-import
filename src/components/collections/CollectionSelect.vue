<template>
    <div class="collectionSelect">

        <DataTable :value="collection_list" tableStyle="min-width: 50rem">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Sets:</span>
                    <span>
                        Es stehen {{ collection_list ? collection_list.length : 0 }} Sets zu Auswahl.
                    </span>
                </div>
            </template>
            
            <Column field="id" header="Wähle">
              <template #body="slotProps">
                <Button @click.prevent="selectCollection(slotProps.data.id)" icon="pi pi-caret-right" />
              </template>
            </Column>

            <Column header="Set">
                <template #body="slotProps">
                        <span>Titel:</span>
                        &nbsp;
                        <span>{{ getTitle(slotProps.data.id) }}</span>
                </template>
            </Column>
            
            <Column header="ID">
                <template #body="slotProps">
                        <span>{{ slotProps.data.id }}</span>
                </template>
            </Column>
            
            <!--<template #footer> In total there are {{ collection_list ? collection_list.length : 0 }} collections. </template>
            -->
        </DataTable>
    </div>
</template>
<script setup lang="ts">
import { onMounted,ref  } from 'vue';
import { iCollection } from '../../api_resources';
import { apiHelper } from '../../modules/api';
import { madekHelper } from '../../modules/madek';
import MetaDataView from '../meta-data/MetaDataView.vue';

const { api, authParams } = apiHelper()

const { getCollectionTitle } = madekHelper()

const props = defineProps({
    collection_list: { type: Array<iCollection>, required: true }
})

const emit = defineEmits(['selectedCollectionId'])

const selectCollection = (colID: string) => {
    emit('selectedCollectionId', colID)
}

const titleMap = ref(new Map<string, string>())

const getTitle = (id: string) => {
    if (titleMap.value.has(id)) {
        return titleMap.value.get(id)
    }

    getCollectionTitle(id, (title:string) => {
        titleMap.value.set(id, title)
    })
    
}

</script>