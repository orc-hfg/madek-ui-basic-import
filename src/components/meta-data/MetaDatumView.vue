<template>
  <div class="metaDatumView">
    <div v-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_TEXT)">
      <span>{{ metaData.string }}</span>
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_TEXT_DATE)">
      <span>{{ metaData.string }}</span>
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_JSON)">
      <JsonViewer :value="metaData.json" />
      <!--<br />
      <span>{{ metaData.json }}</span>-->
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_PEOPLE)">
      <Chip v-for="person in metaData.selectedPeople">
        <span>{{ person.first_name }}</span>
        &nbsp;
        <span>{{ person.last_name }}</span>
      </Chip>
      &nbsp;
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_KEYWORDS)">
      <Chip v-for="kw in metaData.selectedKeywords">
        <span>{{ kw.term }}</span>
      </Chip>
    </div>

    <div v-else-if="isMetaKeyObjectType(metaKey.id, MD_TYPE_ROLES)">
      <p>TODO Roles view</p>
    </div>

    <div v-else>Unknown Meta-Data type</div>
  </div>
</template>

<script setup lang="ts">
import Chip from "primevue/chip";
import { madekHelper } from "../../modules/madek";
import { errorHelper } from "../../modules/error";

const {
  MD_KEYWORDS,
  MD_PEOPLE,
  
  MD_TYPE_TEXT,
  MD_TYPE_TEXT_DATE,
  MD_TYPE_JSON,
  MD_TYPE_KEYWORDS,
  MD_TYPE_PEOPLE,
  MD_TYPE_ROLES,

  isMetaKeyObjectType,

} = madekHelper()

const props = defineProps({
  default_locale: { type: String, required: true },

  metaKey: { type: Object, required: true },
  metaData: { type: Object, required: true },
//  metaDataExtended: { type: Object, required: true },

  mode: { type: String, required: false },
})

</script>
<style scoped>
.metaDatumView {
  padding: 0.25em;
  font-weight: bolder;
}
</style>
