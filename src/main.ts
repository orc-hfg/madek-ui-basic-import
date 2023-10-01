import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import JsonViewer from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import MultiSelect from 'primevue/multiselect';

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'   // optional

import LoginInfo from './components/LoginInfo.vue'
//import ColumnGroup from 'primevue/columngroup';   // optional
//import Row from 'primevue/row';                   // optional

//import '@/assets/main.css'
//import 'primevue/resources/themes/lara-light-indigo/theme.css';

import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import 'primeflex/primeflex.css';
import './theme-fluent-light.css';

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(JsonViewer)
app.use(PrimeVue)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputSwitch', InputSwitch)
app.component('MultiSelect', MultiSelect)

app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)

app.component('DataTable', DataTable)
app.component('Column', Column)

app.component('DataView', DataView)
app.component('DataViewLayoutOptions', DataViewLayoutOptions)

app.component('LoginInfo', LoginInfo)
app.use(router)
app.mount('#app')
