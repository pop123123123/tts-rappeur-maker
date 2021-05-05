import Vue from 'vue';
import { MdApp, MdAppContent, MdAppToolbar } from 'vue-material/dist/components/MdApp';
import MdButton from 'vue-material/dist/components/MdButton';
import {
  MdCard, MdCardActions, MdCardContent, MdCardHeader,
} from 'vue-material/dist/components/MdCard';
import MdDivider from 'vue-material/dist/components/MdDivider';
import { MdField, MdInput, MdTextarea } from 'vue-material/dist/components/MdField';
import MdSnackbar from 'vue-material/dist/components/MdSnackbar';
import MdSwitch from 'vue-material/dist/components/MdSwitch';
import App from './App.vue';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Vue.use(MdApp);
Vue.use(MdAppContent);
Vue.use(MdAppToolbar);
Vue.use(MdButton);
Vue.use(MdCard);
Vue.use(MdCardActions);
Vue.use(MdCardContent);
Vue.use(MdCardHeader);
Vue.use(MdDivider);
Vue.use(MdField);
Vue.use(MdInput);
Vue.use(MdSnackbar);
Vue.use(MdSwitch);
Vue.use(MdTextarea);

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
