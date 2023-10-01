import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ImportView from '../views/ImportView.vue'
import LoginView from '../views/LoginView.vue'
//import CollectionView from '../views/collections/CollectionView.vue'
import CollectionEdit from '../views/collections/CollectionEdit.vue'

import UserCollectionsView from '../views/collections/UserCollectionsView.vue'

import EntryView from '../views/entries/EntryView.vue'
import EntryEdit from '../views/entries/EntryEdit.vue'

import UserEntriesVIew from '../views/entries/UserEntriesView.vue'
import CollectionEntriesListView from '../views/collections/CollectionEntriesListView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/login',
    name: 'login',
    component: LoginView
  },

  {
    path: '/import',
    name: 'import',
    component: ImportView
  },
  /*
  {
    path: '/collection/view/:collection_id',
    name: 'collectionView',
    component: CollectionView
  },*/
  {
    path: '/collection/edit/:collection_id',
    name: 'collectionEdit',
    component: CollectionEdit
  },
  {
    path: '/collection/entryList/:collection_id',
    name: 'collectionMediaEntryList',
    component: CollectionEntriesListView
  },

  {
    path: '/entry/view/:entry_id',
    name: 'entryView',
    component: EntryView
  },
  {
    path: '/entry/edit/:entry_id',
    name: 'entryEdit',
    component: EntryEdit
  },
  {
    path: '/mediaEntry/userList',
    name: 'mediaEntryUserList',
    component: UserEntriesVIew
  },
  
  

  {
    path: '/collection/userList',
    name: 'collectionUserList',
    component: UserCollectionsView
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
