import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/index.css'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import Image from 'primevue/image'
import Tooltip from 'primevue/tooltip'
import AutoComplete from 'primevue/autocomplete'
import Select from 'primevue/select'

import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import StepItem from 'primevue/stepitem'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Editor from 'primevue/editor'
import FileUpload from 'primevue/fileupload'
import DatePicker from 'primevue/datepicker'

import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  // Default theme configuration
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false,
    },
  },
})

app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Tag', Tag)
app.component('Dialog', Dialog)
app.component('Message', Message)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Image', Image)
app.component('AutoComplete', AutoComplete)
app.component('Select', Select)

app.component('Stepper', Stepper)
app.component('StepList', StepList)
app.component('StepPanels', StepPanels)
app.component('StepItem', StepItem)
app.component('Step', Step)
app.component('StepPanel', StepPanel)
app.component('Editor', Editor)
app.component('FileUpload', FileUpload)
app.component('DatePicker', DatePicker)

app.directive('tooltip', Tooltip)

app.use(router)

app.mount('#app')
