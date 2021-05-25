import './assets/index.css'
import './assets/icon/iconfont.css'
import './utils/directive'
import IM from "./components"
IM.install = Vue => Vue.component(IM.name, IM)
export default IM