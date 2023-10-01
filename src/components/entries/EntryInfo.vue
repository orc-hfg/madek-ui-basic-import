<template>
    <div>
        <span>Created:&nbsp;<Chip>{{ entry_data?.created_at }}</Chip></span>
        <br/>
        <span>Updated:&nbsp;<Chip>{{ entry_data?.updated_at }}</Chip></span>
        <br/>
        <span>Updated Meta-Data:&nbsp;<Chip>{{ entry_data?.meta_data_updated_at }}</Chip></span>
        <br/>
        <span>Updated Edit-Session:&nbsp;<Chip>{{ entry_data?.edit_session_updated_at }}</Chip></span>
        <br/>
        <span>Published:&nbsp;<Chip>{{ entry_data?.is_published }}</Chip></span>
        <br/>
        
    </div>
</template>
<script setup lang="ts">
import { iMediaEntry } from '../../api_resources';

import Chip from 'primevue/chip';
//const showable = [ 'is_published', 'created_at', 'updated_at', 'meta_data_updated_at', 'edit_session_updated_at' ]

const props = defineProps({
    entry_data: { type: Object , required: true }
})
</script>
