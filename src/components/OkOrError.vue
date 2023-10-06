<script setup lang="ts">
import { defineProps } from 'vue';
import Message from 'primevue/message';
//import { errorHelper } from '../modules/error';
//const { error_msg, ok_msg } = errorHelper()

defineProps({
    error_msg: { type: String, default: '', required: false},
    ok_msg: { type: String, default: '', required: false}
})
</script>
<template>
    <div class="border-1 surface-border border-rounded my-1">
    <Message
        severity="error"
        v-if="error_msg">
        {{ error_msg }}
    </Message>
    <Message
        severity="success"
        v-if="ok_msg">
        {{ ok_msg }}
    </Message>
    <!--
    <div class="bg-pink-400 h-4rem "
        v-if="error_msg">
        <div class="px-3 py-3"><span>{{ error_msg }}</span></div>
    </div>
    <div class="bg-green-500 h-3rem "
        v-if="ok_msg">
        <div class="px-3 py-3"><span>{{ ok_msg }}</span></div>
        
    </div>
    -->
</div>
</template>