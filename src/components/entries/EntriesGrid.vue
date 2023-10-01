<template>
    <div>
        <!--
            <p>Entries Grid</p>
        
        EL:
        <p>{{ entriesList }}</p>
        TL:
        <p>{{ titleMap }}</p>
-->
        <p v-if="error_msg">
            <span>ERROR:</span>
            &nbsp;
            <span>{{ error_msg }}</span>
        </p>


        <DataView :value="entriesList" :layout="layout">
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
                            <!--<span class="text-2xl font-semibold">{{ slotProps.data.created_at }}</span>-->

                            <Button
                                v-if="isShowAction('view')"
                                icon="pi pi-eye"
                                @click.prevent="clickedView(slotProps.data.id)"/>

                            <Button
                                v-if="isShowAction('edit')"
                                icon="pi pi-pencil"
                                @click.prevent="clickedEdit(slotProps.data.id)"/>
                            <Button
                                v-if="isShowAction('add')"
                                icon="pi pi-plus"
                                @click.prevent="clickedAdd(slotProps.data.id)"/>

                            <Button
                                v-if="isShowAction('delete')"
                                icon="pi pi-trash" 
                                severity="secondary"
                                @click.prevent="clickedDelete(slotProps.data.id)"/>    
                            
                        </div>
                        <div v-if="show_preview"
                            class="w-20 sm:w-16rem xl:w-30rem shadow-2 block xl:block mx-auto  px-1 py-1 border-1 surface-border surface-card border-round"
                            style="height: 25rem;">
                            <EntryPreview :entry_data="slotProps.data" :size="'medium'"/>
                        </div> 
                        
<!--
                        <img v-if="show_preview"
                            class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                            :src="getPreviewDefaultUrl(slotProps.data.id)" :alt="'no download img'" />
-->
                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3 border-1 surface-border surface-card">
                                <MetaDataView :entry-id="slotProps.data.id" mode="showSummary"/>
                            </div>
<!--
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <div class="text-2xl font-bold text-900">T:{{ getTitle(slotProps.data.id) }}</div>

                                    <EntryInfo :entry_data="slotProps.data" />
                                    <EntryFileInfo :file_data="filesMap.get(slotProps.data.id)" />
                            </div>
    -->                        
                        </div>
                    </div>
                </div>
            </template>

            <template #grid="slotProps">
                <div class="col-6 xs:col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                    <div class="p-3 border-1 surface-border surface-card border-round">
                        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                        <!--
                            <div class="flex align-items-center gap-2">
                                <span class="font-semibold">{{ getTitle(slotProps.data.id) || 'Ohne Titel'}} </span>
                            </div>
-->
                            <div v-if="show_actions == true"
                                class="flex align-items-center justify-content-end gap-2 py-2" style="width:100%">

                                <Button
                                    v-if="isShowAction('view')"
                                    icon="pi pi-eye"
                                    title="Betrachten..."
                                    @click.prevent="clickedView(slotProps.data.id)"/>
                                
                                <Button
                                    v-if="isShowAction('add')"
                                    icon="pi pi-plus"
                                    title="Zu Set hinzufügen..."
                                    @click.prevent="clickedAdd(slotProps.data.id)"/>    

                                <Button
                                    v-if="isShowAction('edit')"
                                    severity="secondary"
                                    icon="pi pi-pencil"
                                    title="Bearbeiten..."
                                    @click.prevent="clickedEdit(slotProps.data.id)"/>
                                
                                <Button
                                    v-if="isShowAction('delete')"
                                    icon="pi pi-trash" 
                                    severity="secondary"
                                    title="Löschen..."
                                    @click.prevent="clickedDelete(slotProps.data.id)"/>    
                            </div>
                        </div>
                        <div v-if="show_preview"
                            class="flex flex-column align-items-center px-1 py-1 border-1 surface-border surface-card"
                            style="height: 15rem">
                            <EntryPreview :entry_data="slotProps.data"/>
                        </div>
<!--
                        <div v-if="show_data_stream"
                            class="flex flex-column align-items-center px-1 py-1 border-1 surface-border surface-card" 
                            style="height: 18rem">
                            <FileView :entry_data="slotProps.data" />
                        </div>
-->
                      

                        <div class="flex align-items-center justify-content-center " style="overflow-x: hidden;">
                            <MetaDataView :entry-id="slotProps.data.id" mode="showCore"
                                class="border-1 surface-border surface-card border-round px-3 py-3"
                                style="max-width: 100%; width: 100%; margin-top: 1rem; overflow-x: hidden; "/>
                            <br/>
                            <br/>

<!--
                            <EntryFileInfo :file_data="filesMap.get(slotProps.data.id)" />
                            
                            <br/>
                            <EntryPermView :entry_id="slotProps.data.id" />
                            <br/>
                            <EntryInfo :entry_data="entriesMap.get(slotProps.data.id)" />
                            -->
                        </div>
                        
                    </div>
                </div>
            </template>
        </DataView>

    </div>
</template>
<script setup lang="ts">

import { watch, ref, onMounted } from 'vue'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'

import MetaDataView from '../meta-data/MetaDataView.vue'
import { apiHelper } from '../../modules/api'
import { madekHelper } from '../../modules/madek'

import {
    iMediaFile,
    iMediaEntry,
    iPreview,
iMetaData
 } from '../../api_resources'

import router from '../../router'


import FileView from '../files/FileView.vue'
import EntryPreview from '../files/EntryPreview.vue'

import { errorHelper } from '../../modules/error'
const {error_msg, handleError} = errorHelper()

const { api, authParams } = apiHelper()

const { getEntryTitle } = madekHelper()

const props = defineProps({
    entriesList: { type: Array<iMediaEntry>, required: true },
    //show_data_stream: { type: Boolean, default: false, required: false},
    show_preview: { type: Boolean, default: true, required: false},
    show_published: { type: Boolean, default: true, required: false},
    show_actions: { type: Boolean, default: true, required: false},
    show_action_list: {type: Array<string>, default: ['add', 'view', 'edit', 'delete'], required: false },
    max_count: { type: Number, default: 100, required: false},
})

const entriesMap = ref(new Map<string, iMediaEntry>())
const filesMap = ref(new Map<string, iMediaFile>())


const layout = ref('grid')

const isShowAction = (action: string) => {
    return props.show_action_list.includes(action)
    
}


const titleMap = ref(new Map<string, string>())

const getTitle = (entryId: string) => {
    if (titleMap.value.has(entryId)) {
        //console.log("getTitle: cached: " + entryId)
        return titleMap.value.get(entryId)
    }

    getEntryTitle(entryId, (title:string) => {
        titleMap.value.set(entryId, title)
    })
    return ''
}
const getMediaFile = (entryId: string) => {
    if (filesMap.value.has(entryId)) {
        //console.log("getMediaFile: " + entryId + " is cached.")
        return filesMap.value.get(entryId);
    }
    else {
        console.log("getMediaFile: " + entryId + " not cached, reload");
        api.api.mediaEntryMediaFileDetail(entryId, authParams?.value)
            .then(res => {
                const result = res.data as iMediaFile;
                filesMap.value.set(entryId, result);
                return result
        });
    }
}

const updateData = (show_published: boolean) => {

    entriesMap.value.clear()
    titleMap.value.clear()
    filesMap.value.clear()
    
    props.entriesList.forEach(element => {
        const entryId = element.id;
        console.log("EntriesGrid: get media entry and file for " + entryId);
        //getMediaEntry(entryId);
        entriesMap.value.set(entryId, element);
        getMediaFile(entryId);
        getTitle(entryId);
    });

}


const emit = defineEmits(['clickedEdit', 'clickedView', 'clickedAdd', 'clickedDelete'])

// TODO as emits
const clickedEdit = (entryId: string) => {
    console.log("EGclickedEdit: " + entryId)
    emit('clickedEdit', entryId)
}
const clickedView = (entryId: string) => {
    console.log("EGclickedView: " + entryId)
    emit('clickedView', entryId)
}
const clickedDelete = (entryId: string) => {
    console.log("EGclickedDelete: " + entryId)
    emit('clickedDelete', entryId)
}
const clickedAdd = (entryId: string) => {
    console.log("EGclickedAdd: " + entryId)
    emit('clickedAdd', entryId)
    
}

watch(props, () => {
    //console.log("changed props: new " + JSON.stringify(props))
    updateData(props.show_published)
})

onMounted(() => {
   // updateData(props.show_published)
})

</script>
<style scoped>
.media_file_full_size_view {
    width: 100%;
    max-width: 100%;
    height: auto;
}
</style>