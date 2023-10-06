<template>
  <div class="home">

      <h2>Willkommen bei Madek</h2>
 
 


      <div v-if="user && user.id">
        <h3>Benutzer HUB</h3>

        <p>Du kannst einen Import starten.</p>

        <p>Du kannst Deine Medien und Sets betrachten und deren Meta-Daten editieren.</p>

        <p>
          <span>Hallo {{ person?.first_name }} {{ person?.last_name }}</span>
        </p>


        <h4>Deine Sets / Collections</h4>
        <UserCollectionsView
          :show_actions="true"
          :max_count="4"
          />
          

        <hr/>
        <h3>Your entries:</h3>
        <UserEntriesGrid
          
          :show_preview="true"
          :show_published="true"
          :show_actions="false"
          :max_count="4"
          />
<!--
        <h3>Your incomplete entries:</h3>
        <UserEntriesGrid
          :show_preview="true"
          :show_published="false"
          :show_actions="false"
          :max_count="5"
          />
-->
      </div>
      <div v-else>
        <h3>Public HUB</h3>

        <p>Show app settings collections</p>
      </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { authHelper } from '../modules/auth';
import UserEntriesTable from '../components/entries/UserEntriesTable.vue';
import UserCollectionsView from './collections/UserCollectionsView.vue';
import UserEntriesGrid from '../components/entries/UserEntriesGrid.vue';

const { user, person, authParams } = authHelper()



</script>
<style>
img {
  max-width: 16em;
  height: auto;
}
</style>
