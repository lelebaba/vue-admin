import { getCompListAll} from '../../api/api';
import * as types from '../mutation-types';

// TODO: Should not deal with view state in Vuex;
// import { Message } from 'element-ui';

// This is just as an Vuex example;
const state = {
	compObj: {
		comps: [],
		total: 0,
	},
	listLoading: false,
	editLoading: false,
	addLoading: false,
};

const getters = {
	comps: state => state.compObj.comps,
	total: state => state.compObj.total,
	listLoading: state => state.listLoading,
	editLoading: state => state.editLoading,
	addLoading: state => state.addLoading,
};


const actions = {
	getCompsAll({ commit, state }) {
		state.listLoading = true;
		getCompListAll().then((value) => {
			commit(types.GET_COMPS_ALL, { value });
			state.listLoading = false;
		});
	},
};

const mutations = {
	[types.GET_COMPS_ALL](state, { value }) {
		state.compObj = value.data;
	},

};

export default {
	state,
	getters,
	actions,
	mutations,
};
