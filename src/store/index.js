import Vue from 'vue';
import Vuex from 'vuex';
import table from './modules/table';
import tableComp from './modules/tableComp';
import tableUser from './modules/tableUser';
import tableDevice from './modules/tableDevice';
import actions from './actions.js';
import mutations from './mutations.js';

Vue.use(Vuex);

const state = {

};

export default new Vuex.Store({
	// mode: 'history',
	modules: {
		t:table,
		tc:tableComp,
		tu:tableUser,
		td:tableDevice
	},
	actions,
	mutations,
});
