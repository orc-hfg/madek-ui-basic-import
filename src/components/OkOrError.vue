<script setup lang="ts">
import { defineProps } from 'vue';
//import { errorHelper } from '../modules/error';
//const { error_msg, ok_msg } = errorHelper()

defineProps({
    error_msg: { type: String, default: '', required: false},
    ok_msg: { type: String, default: '', required: false}
})
</script>
<template>
    <div class="border-1 surface-border border-rounded">
    <div class="bg-pink-400 h-4rem border-1 surface-border border-rounded my-1"
        v-if="error_msg">
        <div class="px-3 py-3"><span>{{ error_msg }}</span></div>
    </div>
    <div class="bg-green-500 h-3rem border-1 surface-border border-rounded my-1"
        v-if="ok_msg">
        <div class="px-3 py-3"><span>{{ ok_msg }}</span></div>
        
    </div>
</div>
</template>