<template>
    <div class="collectionView">

        <div v-if="!collectionId || collectionId === 'undefined'">
            <h3>Kein Set ausgewählt!</h3>
            <Button label="Wähle ein Set" @click.prevent="toggleCollectionSearch()" style="float:right"/>
        </div>

        <div v-if="collectionId && collectionId !== 'undefined'">
          
          <h2>Set mit Medien-Enträgen</h2>
          <div class="flex flex-row">
            <div class="flex justify-content-left gap-2">
              <p>Titel:</p>
              &nbsp;
               <Chip>{{ collectionTitle }} </Chip>
            </div>
            <div class="flex justify-content-right gap-2">

              <p>&nbsp;&nbsp;Id:</p>
              &nbsp;
              <Chip>{{ collectionId }} </Chip>
              &nbsp;
            </div>
            <div class="flex justify-content-right gap-2">
              <Button label="Wähle anderes..." @click.prevent="toggleCollectionSearch()" style="float:right"/>
            </div>
          </div>
          <br/>
            

          <hr/>

            <h3>
              <span>Meta-Daten:</span>
              <SelectButton
                v-model="mdshow_mode"
                :options="mdshow_mode_options"
                option-label="name"
                style="float:right"/>
            </h3>
            <div style="padding: 1em">
              <MetaDataView                    
                  :collection-id="collectionId"
                  :mode="mdshow_mode.value"
                   />
            </div>

          <hr/>
          <Button label="Zeige Vollbild-Gallerie" @click.prevent="showSlideshow()" />

          <hr/>
          <h3>Set Einträge:</h3>

          <CollectionEntriesGrid
            :show_preview="true"
            :show_published="showPublished"
            :collection_id="collectionId"
            :show_actions="true"
            :show_action_list="['view', 'edit', 'delete']"
            @clicked-view="clickedView"
            @clicked-edit="clickedEdit"
            @clicked-delete="clickedDelete"
            />


        </div>

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
<!--
        <Dialog v-model:visible="showGaleria">
            <h3>Gallerie:</h3>
          -->
            <Galeria 
            v-model:visible="showGaleria"
              :value="images" :responsiveOptions="responsiveOptions"
              :show-indicators="true"
              :show-thumbnails="true"
              indicators-position="top"
              thumbnails-position="bottom"
              :show-item-navigators="true"
              :full-screen="true"
              :numVisible="5" containerStyle="max-width: 80vw">
                <template #item="slotProps">
                    <div :style="{backgroundImage: `url('${slotProps.item.itemImageSrc}')`}"
                      class="gallery_img">
                    </div>
                    <!--
                    <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 70vw; max-width:70vw;" />
                    -->
                </template>
                <template #thumbnail="slotProps">
                    <div :style="{backgroundImage: `url('${slotProps.item.itemImageSrc}')`}"
                      class="gallery_preview">
                    </div>
                    <!--
                    <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
                    -->
                </template>
            </Galeria>
        <!--
        </Dialog>
        -->

        <Dialog v-model:visible="showCollectionList">
          <p>
            <span>Wähle ein Set:</span>
          </p>
          <CollectionSelect :collection_list="collectionList" @selected-collection-id="selectCollection"/>
        </Dialog>


    </div>
</template>

<script lang="ts">

import { hasOwn } from '@vue/shared'
import { defineComponent } from 'vue'
import { apiHelper } from '../..//modules/api'
import { madekHelper } from '../../modules/madek'
import { errorHelper } from '../../modules/error'

import {
  iMetaData,
  iMediaFile,
  iMediaEntry,
  iCollection,
iPreview
} from '../../api_resources'

import Dialog from 'primevue/dialog'
import Chip from 'primevue/chip'
import SelectButton from 'primevue/selectbutton'
import Galeria from 'primevue/galleria'
import MetaDataView from '../../components/meta-data/MetaDataView.vue'
import CollectionEntriesGrid from '../../components/collections/CollectionEntriesGrid.vue'
import CollectionSelect from '../../components/collections/CollectionSelect.vue'
import { authHelper } from '../../modules/auth'

const { handle_error, error_msg, reset_error} = errorHelper()

const { api, authParams } = apiHelper()
const { user } = authHelper()
const { getCollectionTitle, asyncApplyPreviewData } = madekHelper()



export default defineComponent({
  name: 'CollectionEntriesListView',
  
  components: {
    MetaDataView: MetaDataView,
    CollectionEntriesGrid: CollectionEntriesGrid,
    CollectionSelect: CollectionSelect,
    Dialog: Dialog,
    SelectButton: SelectButton,
    Galeria: Galeria,
    Chip: Chip,
  },
  data () {
    return {

      showCollectionList: false as boolean,
      mdshow_mode: { name: 'Core', value: 'showCore' },
      mdshow_mode_options: [
        { name: 'All', value: 'showAll' },
        { name: 'Summary', value: 'showSummary' },
        { name: 'Core', value: 'showCore' },
        { name: 'Title', value: 'showTitle' }
      ],
      showGaleria: false as boolean,
      images: [],
      responsiveOptions: [{
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }],
      collectionList: [] as iCollection[],
      collectionId: '' as string,
      collectionTitle: '' as string,

      col_me_get_metadata_and_previews: true,
      col_public_get_metadata_and_previews: false,
      col_me_get_full_size: false,

      showPublished: true,
      showDataStream: true,
      showPreviewDataStream: false
    }
  },
  mounted () {    

    this.collectionId = this.$route.params.collection_id as string
    this.updateCollectionTitle()
    this.buildGallery()
  },
  methods: {
    showSlideshow () {
      this.buildGallery()
      this.showGaleria = true
    },
    toggleCollectionSearch () {

      this.showCollectionList = !this.showCollectionList
      if (this.showCollectionList = true) {
        this.updateCollectionList()
      }
    },
    updateCollectionTitle () {
      getCollectionTitle(this.collectionId, (title:string) => {
        this.collectionTitle = title;
      })
    },
    selectCollection (id:string) {
      this.collectionId = id
      this.$router.push({path: `/collection/entryList/${id}` })
      this.showCollectionList = false
      this.updateCollectionTitle()
    },

    updateCollectionList () {
      reset_error()

      const query = {
        full_data: true,
        me_edit_metadata_and_relations: true,
      }
      
      api.api.collectionsList(query, authParams?.value)
        .then(resp => {
          this.collectionList = resp.data.collections
        })
        .catch(error => handle_error('api collectionsList:', error))
        
    },
    clickedView (entryId: string) {
      console.log("clickedView: " + entryId)
      this.$router.push({ path: `/entry/view/${entryId}`})
    },
    clickedEdit (entryId: string) {
      console.log("clickedEdit: " + entryId)
      this.$router.push({ path: `/entry/edit/${entryId}`})
    },
    clickedDelete (entryId: string) {
      console.log("clickedDelete: TODO " + entryId)
      //askDeleteEntryId.value = entryId
      //askDeleteShow.value = true

      api.api.collectionMediaEntryArcDelete(this.collectionId, entryId, authParams?.value)
        .then(resp => {
          this.showPublished = false
          setTimeout(() => {
            this.showPublished = true
          },200)
        })
    },

    buildGallery () {
      this.images.length = 0;

      const query = {
        collection_id: this.collectionId,
        full_data: true,
        order: 'desc'
      };
    
      api.api.mediaEntriesRelatedDataList(query, authParams?.value)
        .then(resp => {
            const entriesList = resp.data.media_entries as iMediaEntry[];

            //debugger
            const previews = resp.data.previews as iPreview[][]
            const largeMap = new Map<string, iPreview>()
            const smallMap = new Map<string, iPreview>()

            const files = resp.data.media_files as iMediaFile[]
            const filesMap = new Map<string, iMediaFile>()
            const filesIdMap = new Map<string, string>()

            files.forEach((file:iMediaFile) => {
              filesMap.set(file.media_entry_id, file)
              filesIdMap.set(file.id, file.media_entry_id)
            })
            previews.forEach(pvlist =>{
              pvlist.forEach(preview => {
                const entryId = filesIdMap.get(preview.media_file_id)
                if (preview.thumbnail === 'small') {
                  smallMap.set(entryId, preview)
                } else if (preview.thumbnail === 'large') {
                  largeMap.set(entryId,preview)
                }
              })
            })
            
            entriesList.forEach(element => {
              const entryId = element.id;
              //if (filesMap.get(entryId)?.content_type.startsWith('image')) {
              if (smallMap.has(entryId)) {
                const imgData = {
                  itemImageSrc: '', 
                  thumbnailImageSrc: '',
                  alt: 'no image',
                  title: 'Title'
                }
                asyncApplyPreviewData(entryId, (img) => {
                  //imgData.itemImageSrc = img
                  imgData.thumbnailImageSrc = img
                }, 'small')
                asyncApplyPreviewData(entryId, (img) => {
                  imgData.itemImageSrc = img
                  //imgData.thumbnailImageSrc = img
                }, 'large')
                this.images.push(imgData)                
              }

            });

        })
        .catch(error => handle_error("api mediaEntriesRelatedDataList: ", error));
    }
    
  }
})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
    width: 24em;

}
/*img {
  width: 10em;
  height: auto;
}*/
.p-galleria-thumbnail-container {
  background-color: transparent !important;
}
.gallery_img {
  width: 90vw;
  height: 80vh;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.gallery_preview {
  width: 12rem;
  height: 6rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>