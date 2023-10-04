<template>

<DataView :value="collectionsList" :layout="layout">
            <template #header>
                <div class="flex justify-content-end">
                    <DataViewLayoutOptions v-model="layout" />
                </div>
            </template>

            <template #list="slotProps">
                <div class="col-12">
                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                        <div v-if="show_actions == true"
                            class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                      
                            <Button 
                                v-if="isShowAction('view')"
                                icon="pi pi-eye" @click.prevent="clickedView(slotProps.data.id)"/>
                            <Button
                                v-if="isShowAction('entries')"
                                icon="pi pi-caret-right"
                                @click.prevent="clickedEntries(slotProps.data.id)"/>
                            <Button
                                v-if="isShowAction('edit')"
                                severity="secondary"
                                icon="pi pi-pencil"
                                @click.prevent="clickedEdit(slotProps.data.id)"/>
                            
                            <Button
                                v-if="isShowAction('delete')"
                                severity="secondary"
                                icon="pi pi-trash"
                                @click.prevent="clickedDelete(slotProps.data.id)"/>    
                        </div>
                      

                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <MetaDataView :collection-id="slotProps.data.id"
                                mode="showSummary"/>
                            </div>

                        </div>
                    </div>
                </div>
            </template>

            <template #grid="slotProps">
                <div class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                    <div class="p-3 border-1 surface-border surface-card border-round">
                        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div class="flex align-items-center gap-2">
                                <span class="font-semibold">{{ getTitle(slotProps.data.id) || 'Ohne Titel'}} </span>
                            </div>

                            <div v-if="show_actions == true"
                                class="flex align-items-center justify-content-left">

                                <Button
                                    v-if="isShowAction('view')"
                                    icon="pi pi-eye"
                                    @click.prevent="clickedView(slotProps.data.id)"/>
                                <Button
                                    v-if="isShowAction('entries')"
                                    icon="pi pi-caret-right"
                                    @click.prevent="clickedEntries(slotProps.data.id)"/>
                                <Button
                                    v-if="isShowAction('edit')"
                                    severity="secondary"
                                    icon="pi pi-pencil"
                                    @click.prevent="clickedEdit(slotProps.data.id)"/>
                                <Button
                                    v-if="isShowAction('delete')"
                                    severity="secondary"
                                    icon="pi pi-trash"
                                    @click.prevent="clickedDelete(slotProps.data.id)"/>
                                
                            </div>
                        </div>
                     
                        <div class="flex align-items-center justify-content-center">
                            <MetaDataView :collection-id="slotProps.data.id" mode="showCore"
                                class="border-1 surface-border surface-card border-round px-3 py-3"
                                style="width: 100%; margin-top: 1rem; overflow-x:hidden "/>
                            <br/>
                            <br/>

                        </div>
                        
                    </div>
                </div>
            </template>
        </DataView>
</template>
<script setup lang="ts">

import { watch, ref, onMounted } from 'vue'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'

import MetaDataView from '../meta-data/MetaDataView.vue'
import { apiHelper } from '../../modules/api'
import { madekHelper } from '../../modules/madek'
import { errorHelper } from '../../modules/error'

import { iCollection } from '../../api_resources'

const { api, authParams } = apiHelper()
const { getCollectionTitle } = madekHelper()

const props = defineProps({
    collectionsList: { type: Array<iCollection>, required: true },
    show_preview: { type: Boolean, default: true, required: false},
    show_published: { type: Boolean, default: true, required: false},
    show_actions: { type: Boolean, default: true, required: false},
    show_action_list: {type: Array<string>, default: ['entries', 'view', 'edit', 'delete'], required: false },
    max_count: { type: Number, default: 100, required: false},
})
const layout = ref('grid')


const titleMap = ref(new Map<string, string>())

const getTitle = (colId: string) => {
    if (titleMap.value.has(colId)) {
        //console.log("getTitle: cached: " + colId)
        return titleMap.value.get(colId)
    }

    getCollectionTitle(colId, (title:string) => {
        titleMap.value.set(colId, title)
    })
    return ''
}

const isShowAction = (action: string) => {
    return props.show_action_list.includes(action)
    
}

const emit = defineEmits(['clickedEdit', 'clickedView', 'clickedEntries', 'clickedDelete'])

// TODO as emits
const clickedEdit = (entryId: string) => {
    console.log("CGclickedEdit: " + entryId)
    emit('clickedEdit', entryId)
}
const clickedView = (entryId: string) => {
    console.log("CGclickedView: " + entryId)
    emit('clickedView', entryId)
}
const clickedDelete = (entryId: string) => {
    console.log("CGclickedDelete: " + entryId)
    emit('clickedDelete', entryId)
}

const clickedEntries = (colId: string) => {
    console.log("CGclickedEntries: " + colId)
    emit('clickedEntries', colId)
}


watch(props, () => {
    //console.log("changed props: new " + JSON.stringify(props))
    //updateData(props.show_published)
})

onMounted(() => {
    
   // updateData(props.show_published)
})


</script>