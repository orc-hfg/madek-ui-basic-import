<template>
    <div>
        <span>Suche:</span>
        <br/>
        <br/>
        <InputText type="text"
            v-model.lazy.trim="searchValue"
            @change="changedSearch"
            placeholder="Tippe zum Suchen" />
        <br/>
        <br/>
        <div class="searchResults">
            <span v-for="group in groupList" class="resultPerson">
                <Button
                    @click.prevent="clickedSelectGroup(group)"
                    >
                    <span>
                        {{getLabel(group)}}
                    </span>

                </Button>

            </span>
        </div>
    </div>
</template>

<script setup lang="ts" >
import InputText from 'primevue/inputtext';
import { ref, watch } from 'vue'
import { iPerson,iGroup } from '../../api_resources'
import { apiHelper } from '../../modules/api'

const { api, authParams } = apiHelper()

const searchValue = ref('')
const groupList = ref([] as iGroup[])

const props = defineProps({
    
})
const getLabel = (group: iGroup) => {
    return group.name || group.institutional_name || ''
}

const emit = defineEmits(['selectedGroup'])

const clickedSelectGroup = (group: iGroup) => {
    console.log("clickedSelectGroup: " + JSON.stringify(group))
    emit('selectedGroup', group)
}

watch(searchValue, ()=> {
    console.log("changed search")
    const query = {
        //institutional_name: searchValue.value,
        searchable: searchValue.value,
        //name: searchValue.value,
        //subtype: props.subtype,
        count: 50,
        page: 0,
        full_data: true
    }
    api.api.groupsList(query, authParams?.value)
        .then(resp => {
            
            
            groupList.value = resp.data.groups as  iGroup[]
            //console.log("got groups: " + JSON.stringify(groupList.value))
        })
})

/*
selectedType = ref("Person")
subTypeOptions = ref([
    {name: "Person", value: "Person"},
    {name: "Gruppe", value: "PeopleGroup"},
    {name: "Institut", value: "PeopleInstitutionalGroup"},
])
*/
</script>
<style scoped>
.resultPerson {
    padding: 0.5rem;
}
</style>