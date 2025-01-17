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
            <span v-for="person in peopleList" class="resultPerson">
                <Button
                    @click.prevent="clickedSelectPerson(person)"
                    :label="getPersonLabel(person)"
                    />

            </span>
        </div>
    </div>
</template>

<script setup lang="ts" >
import InputText from 'primevue/inputtext';
import { ref, watch } from 'vue'
import { iPerson } from '../../api_resources'
import { apiHelper } from '../../modules/api'

const { api, authParams } = apiHelper()

const searchValue = ref('')
const peopleList = ref([] as iPerson[])

const props = defineProps({
    subtype: { type: String, required: true}
})
const getPersonLabel = (person: iPerson) => {
    if (person.subtype == 'Person') {
        return person.first_name + ' ' + person.last_name
    }
    else if (person.subtype == 'PeopleGroup') {
        return (person.first_name ? person.first_name :'') + ' ' + (person.last_name ? person.last_name :'')
        
    }
    else if (person.subtype == 'PeopleInstitutionalGroup') {
        return person.institutional_id + ' ' + person.last_name
    }

}

const emit = defineEmits(['selectedPerson'])

const clickedSelectPerson = (person: iPerson) => {
    console.log("clickedSelectPerson: " + JSON.stringify(person))
    emit('selectedPerson', person)
}
/*
subtype?: "PeopleInstitutionalGroup" | "Person" | "PeopleGroup";
        institutional_id?: string;
        searchable?: string;
        id?: string;
        count?: number;
        pseudonym?: string;
        last_name?: string;
        first_name?: string;
        page?: number;
        full_data?: boolean;
        description?: string;
*/
watch(searchValue, ()=> {
    console.log("changed search")
    const query = {
        'search-term': searchValue.value,
        subtype: props.subtype,
        count: 50,
        page: 0,
        full_data: true
    }
    api.api.peopleList(query, authParams?.value)
        .then(resp => {
            peopleList.value = resp.data.people
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