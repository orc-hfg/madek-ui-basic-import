<template>
    <img id="imgFS"
      class="media_file_full_size_view" :src="imgData" />

</template>
<script setup lang="ts">

import { watch, ref, onMounted } from "vue";
import { apiHelper } from "../../modules/api";
import { madekHelper } from "../../modules/madek";

const { imgCache } = madekHelper()
const { api, authParams } = apiHelper();

const props = defineProps({
  entry_data: { type: Object, required: false }
  
});

const entry_id = ref("" as string);
const imgData = ref();

const update = () => {
  if (!props.entry_data || !props.entry_data.id) {
    return;
  }
  entry_id.value = props.entry_data?.id;
  
  if (imgCache.value.has(entry_id.value)) {
    console.log("Cache already has blob")
    const blob = imgCache.value.get(entry_id.value)
    imgData.value = blob
  }
  else {
    api.api.mediaEntryMediaFileDataStreamDetail(entry_id.value, authParams?.value)
    .then(resp => {
        console.log("loaded image for " + entry_id.value)
        
        resp.blob().then(blob => {
            console.log("loaded image has blob for " + entry_id.value)
            imgData.value = URL.createObjectURL(blob)
            imgCache.value.set(entry_id.value, imgData.value)
            console.log("assigned loaded image for " + entry_id.value)
        })
        
        
    })
    .catch(error => {
        console.error("Could not get image for " + entry_id.value)
        //imgCache.value.set(entry_id.value, undefined)
    })
  }
  
};

watch(entry_id.value, () => {
  console.error("entry_id changed");
});
watch(props, () => {
  console.error("entry_data changed");

  update();
});


onMounted(() => {
  update();
});
</script>
