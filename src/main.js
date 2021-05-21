import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import uploader from 'vue-simple-uploader'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import App from './App.vue'
import IMPlugin from './index'
import './assets/index.css'
import './assets/icon/iconfont.css'
import './utils/directive'
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.use(uploader)
Vue.use(IMPlugin)
Vue.use(Viewer)
new Vue({ 
  el: '#app',
  render: h => h(App)
})
