<template>
  <div
    class="entry_preview_bg"
    v-if="preview_file.media_type === 'image'"
    :style="cssProps"
  ></div>
  <div class="entry_preview_bg" v-else-if="download_file.media_type !== 'image'">
    <!--
      P {{ preview_file }}
      D {{ download_file }}
      <span class="pi pi-file-excel"></span>
      <span class="pi pi-file-word"></span>
      -->
    <div class="flex flex-column align-items-center justify-content-between py-6">
      <i class="pi pi-file" />
      <br />

      <span>{{ download_file.content_type }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { apiHelper } from "../../modules/api";
import { madekHelper } from "../../modules/madek";
import { iMediaFile, iPreview } from "../../api_resources";

const { asyncApplyPreviewData } = madekHelper();
const { api, authParams } = apiHelper();

const props = defineProps({
  entry_data: { type: Object, required: false },
  size: { type: String, default: "small", required: false },
});

const cssProps = ref();
const entry_id = ref("" as string);
const preview_file = ref({} as iPreview);
const download_file = ref({} as iMediaFile);
//const imgData = ref();

const update = () => {
  cssProps.value = {}
  preview_file.value = {}
  download_file.value = {}

  if (!props.entry_data || !props.entry_data.id) {
    return;
  }
  entry_id.value = props.entry_data?.id;

  const onImgData = (objUrl: any) => {
    //    imgData.value = objUrl
    cssProps.value = { backgroundImage: `url('${objUrl}')` };
  };

  const onPreviewData = (jsondata: any) => {
    preview_file.value = jsondata[0];
    asyncApplyPreviewData(entry_id.value, onImgData, props.size);
  };

  const onPreviewError = (error) => {
    console.error("Could not get preview data for entry: " + entry_id.value);

    api.api
      .mediaEntryMediaFileDetail(entry_id.value, authParams?.value)
      .then((resp) => {
        download_file.value = resp.data;
      })
      .catch((error) => {
        console.error("Could not get file data for entry: " + entry_id.value);
      });
  };

  api.api
    .mediaEntryPreviewDetail(entry_id.value, { size: props.size }, authParams?.value)
    .then((resp) => {
      onPreviewData(resp.data);
    })
    .catch(onPreviewError);
};

watch(entry_id.value, () => {
  console.error("EntryPreview: entry_id changed");
});
watch(props, () => {
  console.error("EntryPreview: entry_data changed");

  update();
});

onMounted(() => {
  update();
});
</script>
<style scoped>
.entry_preview {
  max-height: 100%;
}
.entry_preview_bg {
  width: 100%;
  height: 100%;
  max-height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.pi {
  font-size: 6rem;
}
</style>
