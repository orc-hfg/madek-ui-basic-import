<template>
    <div>
        <span>Filename:&nbsp;<Chip>{{ file_data?.filename }}</Chip></span>
        <br/>
        <span>Size:&nbsp;<Chip>{{ file_data?.size }}</Chip></span>
        <br/>
        <span>Content-Type:&nbsp;<Chip>{{ file_data?.content_type }}</Chip></span>
    </div>

</template>
<script setup lang="ts">

import Chip from 'primevue/chip';

const props = defineProps({
    file_data: { type: Object , required: true }
})
</script>
