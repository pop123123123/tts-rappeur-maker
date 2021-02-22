import Vue from 'vue';
import VueMaterial from 'vue-material';
import App from './App.vue';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Vue.use(VueMaterial);

Vue.material = {
  ...Vue.material,
  locale: {
    ...Vue.material.locale,
    dateFormat: 'dd/MM/yyyy',
    firstDayOfAWeek: 1,
  },
};

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
