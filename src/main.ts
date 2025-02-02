import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/main.css'

const app = createApp(App)

//app.config.globalProperties.window = window

app.use(createPinia())
//app.use(router)

app.mount('#app')
