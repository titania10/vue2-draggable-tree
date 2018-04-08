import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import './components/tree/style/tree.styl';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	render: h => h(App)
})
