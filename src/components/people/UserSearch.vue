<template>
    <div>
        <span>Suche:</span>
        <br/>
        <br/>
        <!-- @change="changedSearch" -->
        <InputText type="text"
            v-model.lazy.trim="searchValue"
            
            placeholder="Tippe zum Suchen" />
        <br/>
        <br/>
        <div class="searchResults">
            <span v-for="user in userList" class="resultUser">
                <Button
                    @click.prevent="clickedSelectUser(user)"
                    :label="getUserLabel(user)"
                    />

            </span>
        </div>
    </div>
</template>

<script setup lang="ts" >
import InputText from 'primevue/inputtext';
import { ref, watch } from 'vue'
import { iUser } from '../../api_resources'
import { apiHelper } from '../../modules/api'

const { api, authParams } = apiHelper()

const searchValue = ref('')
const userList = ref([] as iUser[])

const props = defineProps({
    subtype: { type: String, required: true}
})
const getUserLabel = (user: iUser) => {    
    return user.first_name + ' ' + user.last_name
}

const emit = defineEmits(['selectedUser'])

const clickedSelectUser = (user: iUser) => {
    console.log("clickedSelectUser: " + JSON.stringify(user))
    emit('selectedUser', user)
}
watch(searchValue, ()=> {
    console.log("changed search")
    const query = {
        'search_term': searchValue.value,
        count: 50,
        page: 0,
        full_data: true
    }
    api.api.usersList(query, authParams?.value)
        .then(resp => {

            userList.value = resp.data.users.sort((a,b) => {
                const result = a.searchable_similarity > b.searchable_similarity
                console.log("A: " + a.searchable_similarity + " B: " + b.searchable_similarity + " result: " + result)
                return result
            })
            
            console.dir(userList.value)
        })
})

</script>
<style scoped>
.resultUser {
    padding: 0.5rem;
}
</style>