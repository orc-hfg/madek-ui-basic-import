<template>
    <div>
        
        <div v-if="user && user.id">
            <div>
                <span>Hallo</span>&nbsp;
                <Chip class="login_user_name">
                    <span>{{ person?.first_name }}</span>
                    &nbsp;
                    <span>{{ person?.last_name }}</span>
                </Chip>
                &nbsp;
                <Button @click.prevent="apiLogout()">Logout</Button>
            </div>
        </div>
        <div v-else>
            <Button @click.prevent="login()">Login</Button>
            <Button @click.prevent="loginAuth()">Login via auth</Button>
            <Button @click.prevent="checkSession()">Check Session</Button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiHelper } from '../modules/api'
import { authHelper } from '../modules/auth'
import Chip from 'primevue/chip'

const { user, person } = authHelper()
const { apiLogout, checkSession, apiConfig } = apiHelper(undefined)

const router = useRouter()

const login = () => {
    
    router.push({path: '/login'})
}

const loginAuth = () => {
    location.href = apiConfig.baseUrl + '/auth/sign-in?return-to=%2Fimporter&lang=de'

    //router.push({path: '/', beforeEnter: () => {
    //}})
}

</script>
<style scoped>
.login_user_name {
    padding: 0.7rem;
}
</style>