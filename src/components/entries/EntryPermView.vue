<template>
  <div>
    <Panel
      :header="'Eintrag: (von: ' + userPersonNames.get(entry_perms.creator_id) + ')'"
      toggleable
    >
      <div class="flex flex-row flex-wrap bg-primary-50">
        <!--
            <div class="flex align-items-center justify-content-left w-20rem h-4rem ">
                <h5>Ersteller:</h5>
                &nbsp;
                <Chip>{{ getUserPersonName(entry_perms.creator_id) }}</Chip>
            </div>
            -->
        <div class="flex align-items-center justify-content-left w-20rem h-4rem">
          <span>Verantwortlich:</span>
          &nbsp;
          <Chip>{{ userPersonNames.get(entry_perms.responsible_user_id) }}</Chip>

          <Button
            @click.prevent="showSelectResponsibleUser = !showSelectResponsibleUser"
            icon="pi pi-pencil"
          />
        </div>

        <div class="flex align-items-center justify-content-left w-15rem h-4rem">
          <span>Öffentlich:</span>
          &nbsp;
          <InputSwitch
            v-model="entry_perms.get_metadata_and_previews"
            @change="save('get_metadata_and_previews')"
          />
        </div>
        <div class="flex align-items-center justify-content-left w-15rem h-4rem">
          <span>Download:</span>
          &nbsp;
          <InputSwitch
            v-model="entry_perms.get_full_size"
            @change="save('get_full_size')"
          />
        </div>
      </div>
    </Panel>

    <Panel header="Benutzer-Rechte" toggleable>
      <div v-for="user_perm in users_perms" class="userPerm bg-primary-50">
        <div class="flex flex-row flex-wrap">
          <div class="flex align-items-center justify-content-left w-3rem h-4rem">
            <Button @click.prevent="clickedDeleteUser(user_perm)" icon="pi pi-trash" />
          </div>

          <div class="flex align-items-center justify-content-left w-15rem h-4rem">
            <Chip>{{ userPersonNames.get(user_perm.user_id) }}</Chip>
          </div>

          <div
            v-for="perm in user_perm_options"
            class="flex align-items-center justify-content-left w-15rem h-4rem"
          >
            <span>{{ perm.label }}</span>
            &nbsp;
            <InputSwitch
              v-model="user_perm[perm.value]"
              @change="saveUser(user_perm, perm.value)"
            />
          </div>
        </div>
      </div>
      <br />
      <Button
        @click.prevent="showAddUser = !showAddUser"
        icon="pi pi-plus"
        label="Nutzer hinzufügen"
      />
    </Panel>

    <Panel header="Gruppen-Rechte:" toggleable>
      <div v-for="group_perm in groups_perms" class="bg-primary-50">
        <div class="flex flex-row flex-wrap bg-secondary-100">
          <div class="flex align-items-center justify-content-left w-3rem h-4rem">
            <Button @click.prevent="clickedDeleteGroup(group_perm)" icon="pi pi-trash" />
          </div>
          <div class="flex align-items-center justify-content-left w-15rem h-4rem">
            <Chip>{{ groupsMap.get(group_perm.group_id)?.name }}</Chip>
          </div>
          <div
            v-for="perm in user_perm_options"
            class="flex align-items-center justify-content-left w-15rem h-4rem"
          >
            <span>{{ perm.label }}</span>
            &nbsp;

            <InputSwitch
              v-model="group_perm[perm.value]"
              @change="saveGroup(group_perm, perm.value)"
            />
            &nbsp;
          </div>
        </div>
      </div>
      <Button
        @click.prevent="showAddGroup = !showAddGroup"
        icon="pi pi-plus"
        label="Gruppe hinzufügen"
      />
    </Panel>
    <Dialog
      v-model:visible="showAddUser"
      header="Benutzer aussuchen:"
      :style="{ width: '80vw' }"
    >
      <PeopleSearch @selectedPerson="selectedPerson" :subtype="'Person'" />
    </Dialog>

    <Dialog v-model:visible="showAddGroup" style="width: 80vw">
      <h5>Gruppe hinzufügen:</h5>
      <!--
            <PeopleSearch @selectedPerson="selectedGroup" :subtype="'PeopleGroup'"/>
            -->
      <GroupSearch @selectedGroup="selectedGroup" />
    </Dialog>
  </div>
</template>
<script setup lang="ts">

import { watch, ref, onMounted } from 'vue'
import Chip from 'primevue/chip';
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import PeopleSearch from '../people/PeopleSearch.vue'
import { iMediaEntry, iPerson, iGroup, iEntryUserPermission, iEntryGroupPermission } from '../../api_resources'

import { apiHelper } from '../../modules/api'
import { madekHelper } from '../../modules/madek'
import GroupSearch from '../people/GroupSearch.vue';
import { MediaEntryPermsUserDetailData } from '../../generated/data-contracts';

const { api, authParams } = apiHelper()
const { getUser, getUserPerson } = madekHelper()

const props = defineProps({
    entry_id: { type: String, required: true},
})

const user_perm_options = [
    { label: "Öffentlich", value: 'get_metadata_and_previews', icon: "pi pi-globe"},
    { label: "Download", value: 'get_full_size', icon: "pi pi-download"},
    { label: "Bearbeiten", value: 'edit_metadata', icon: "pi pi-pencil"},
    { label: "Berechtigungen", value: 'edit_permissions', icon: "pi pi-user-edit"},
]


const group_perm_options = [
    { label: "Öffentlich", value: 'get_metadata_and_previews', icon: "pi pi-globe"},
    { label: "Download", value: 'get_full_size', icon: "pi pi-download"},
    { label: "Bearbeiten", value: 'edit_metadata', icon: "pi pi-pencil"},
]

const entry_perms = ref({} as iMediaEntry)
const users_perms = ref([] as iEntryUserPermission[])
const groups_perms = ref([] as iEntryGroupPermission[])
const creatorP = ref({} as iPerson)
const responsibleP = ref({} as iPerson)

const showAddUser = ref(false as boolean)
const showAddGroup = ref(false as boolean)

//const userPersonMap = ref(new Map<String,iPerson>)
const userPersonNames = ref(new Map<String,String>)
const groupPersonNames = ref(new Map<String,String>)
const groupsMap = ref(new Map<String,{}>)

const getUserPersonName = (userId:string) => {
    if (userPersonNames.value.has(userId)) {
        return userPersonNames.value.get(userId)
    }
    else {
        getUserPerson(userId, (person:iPerson) => {
            // TODO type
            console.log("got user person: "  + userId + ":")
            let result = ''
            if (person.subtype == 'Person') {
                result =  person.first_name + ' ' + person.last_name
            }
            if (person.subtype == 'PeopleGroup') {
                result = person.first_name + ' ' + person.last_name
            }
            if (person.subtype == 'PeopleInstitutionalGroup') {
                result = person.first_name + ' ' + person.last_name
            }

            userPersonNames.value.set(userId, result)


        })
    }

}

const getGroupPersonName = (groupId:string) => {
    if (groupPersonNames.value.has(groupId)) {
        return groupPersonNames.value.get(groupId)
    } else {
        api.api.groupsList({id: groupId}, authParams?.value)
            .then(resp => {
                const groupName = resp.data.groups[0].name
                groupPersonNames.value.set(groupId, groupName)
            })
    }

}

const updateData = () => {


    api.api.mediaEntryPermsResourcesDetail(props.entry_id, authParams?.value)
        .then(resp => {
            entry_perms.value = resp.data

            getUserPerson(entry_perms.value.creator_id, (p:iPerson) => {
                creatorP.value = p
                getUserPersonName(entry_perms.value.creator_id)
            })

            getUserPerson(entry_perms.value.responsible_user_id, (p:iPerson) => {
                responsibleP.value = p
                getUserPersonName(entry_perms.value.responsible_user_id)
            })
        })

    api.api.mediaEntryPermsUsersDetail(props.entry_id, authParams?.value)
        .then(resp =>{
            users_perms.value = resp.data
            // TODO get user names
            users_perms.value.forEach((elem: MediaEntryPermsUserDetailData) => {
              getUserPersonName(elem.user_id)
            })
        })

    api.api.mediaEntryPermsGroupsDetail(props.entry_id, authParams?.value)
        .then(resp => {
            groups_perms.value = resp.data
            groups_perms.value.forEach(gp => {
                api.api.groupsList({id: gp.group_id, full_data: true}, authParams?.value)
                    .then(resp => {
                        const group = resp.data.groups[0]
                        
                        groupsMap.value.set(group.id, group)
                    })
            })
            // TODO get group names

        })
}

const save = (permName: "get_metadata_and_previews" | "get_full_size") => {
    const permVal = entry_perms.value[permName] === true ? true : false
    api.api.mediaEntryPermsResourceUpdate(props.entry_id,permName, permVal, authParams?.value)
        .then(resp => {
            entry_perms.value = resp.data
        })
}

const saveUser = (userPerm: iEntryUserPermission, permName) => {
    const userId = userPerm.user_id
    const permVal = userPerm[permName] === true ? true : false

    api.api.mediaEntryPermsUserUpdate(props.entry_id, userId, permName, permVal, authParams?.value)
        .then(resp => {
            console.log("updated user perms: " + JSON.stringify(resp.data))
        })
}

const saveGroup = (groupPerm: iEntryGroupPermission, permName) => {
    const groupId = groupPerm.group_id
    const permVal = groupPerm[permName] === true ? true : false

    api.api.mediaEntryPermsGroupUpdate(props.entry_id, groupId, permName, permVal, authParams?.value)
        .then(resp => {
            console.log("updated group perms: " + JSON.stringify(resp.data))

        })
}

const clickedDeleteUser = (userPerm: iEntryUserPermission) => {
    api.api.mediaEntryPermsUserDelete(props.entry_id, userPerm.user_id, authParams?.value)
        .then(resp => {
            console.log("deleted user perms:" + JSON.stringify(resp.data))
            updateData()
        })

}
const clickedDeleteGroup = (groupPerm: iEntryGroupPermission) => {
    api.api.mediaEntryPermsGroupDelete(props.entry_id, groupPerm.group_id, authParams?.value)
        .then(resp => {
            console.log("deleted group perms:" + JSON.stringify(resp.data))
            updateData()
        })
}


const selectedPerson = (person: iPerson) => {
    console.log("selectedPerson: " + JSON.stringify(person))
    api.api.usersList({person_id: person.id}, authParams?.value)
        .then(resp => {
            const user_id = resp.data.users[0].id
            const data = {
                get_metadata_and_previews: false,
                get_full_size: false,
                edit_metadata: false,
                edit_permissions: false
            }
            api.api.mediaEntryPermsUserCreate(props.entry_id, user_id, data, authParams?.value)
                .then(resp => {
                    updateData()
                })
        })

    showAddUser.value = false
}
const selectedGroup = (group: iGroup) => {
    console.log("selectedGroup: " + JSON.stringify(group))
    const data = {
        get_metadata_and_previews: false,
        get_full_size: false,
        edit_metadata: false
    }
    api.api.mediaEntryPermsGroupCreate(props.entry_id, group.id, data, authParams?.value)
                .then(resp => {
                    updateData()
                })
    showAddGroup.value = false
}
/*
const selectedPersonGroup = (person: iPerson) => {
    console.log("selectedGroup: " + JSON.stringify(person))

    api.api.groupsList({person_id: person.id}, authParams?.value)
        .then(resp => {
            const group_id = resp.data.groups[0].id
            const data = {
                get_metadata_and_previews: false,
                get_full_size: false,
                edit_metadata: false
            }
            api.api.mediaEntryPermsGroupCreate(props.entry_id, group_id, data, authParams?.value)
                .then(resp => {
                    updateData()
                })
        })
    showAddGroup.value = false
}
*/

watch(props, () => {
    //console.log("changed props: " + props.entry_id)
    updateData()
})

onMounted(() => {
    //console.log("onMounted: " + props.entry_id)
    updateData()
})
</script>
<style scoped>
.p-card .p-card-title {
  background-color: var(--primary-200);
}
.userPerm {
  /*border: 1px solid gray;*/
  padding: 0.5rem;
}
.editPerm {
  float: left;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid gray;
}
.peopleSearch {
  width: 85vw;
  max-width: 85vw;
}
</style>
