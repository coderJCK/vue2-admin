import { initModules } from '@/utils/modules';
import Vue from 'vue';

// 将封装的所有请求导出为一个对象
// eslint-disable-next-line no-undef
const files = require.context('./requests', false, /\.js$/); // require(路径，是否递归，正则)
const apis = initModules(files);

// 将绑定到vue原型
Vue.prototype.$api = apis;
// 使用方式：this.$api.a.add
