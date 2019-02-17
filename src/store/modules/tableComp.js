import { getCompListAll,getCompListPage} from '../../api/api';
import * as types from '../mutation-types';

// TODO: Should not deal with view state in Vuex;
// import { Message } from 'element-ui';

// This is just as an Vuex example;
const state = {
	compObj: {}
};

// const getters = {
// 	comps: state => state.compObj.data,
// 	total: state => state.compObj.data.totalNum,
// 	listLoading: state => state.listLoading,
// 	editLoading: state => state.editLoading,
// 	addLoading: state => state.addLoading,
// };
/**
 * getter有点类似vue.js的计算属性，当我们需要从store的state中派生出一些状态，那么我们就需要使用getter，
 * getter会接收state作为第一个参数，而且getter的返回值会根据它的依赖被缓存起来，
 * 只有getter中的依赖值（state中的某个需要派生状态的值）发生改变的时候才会被重新计算。
 */  

const getters = {
	comps: state => {
		console.log("const getters comps:state.compObj.data====="+JSON.stringify(state.compObj.data));
		return state.compObj.data;
		},
// 	total: state => {
// 		console.log("const getters total: state.compObj.data=="+JSON.stringify(state.compObj.data));
// 		return state.compObj.data.totalNum;
// 		},
// 	listLoading: state => state.listLoading,
// 	editLoading: state => state.editLoading,
// 	addLoading: state => state.addLoading,
};


const actions = {
	getComps({ commit, state }, para) {
		state.listLoading = true;
		console.log("调用getCompListPage..........");
		getCompListPage(para).then((value) => {
			console.log("getCompListPage:value=="+JSON.stringify(value));
			commit(types.GET_COMPS, { value });
			state.listLoading = false;
		});
	},
	editComp({ dispatch, commit, state }, para) {
		state.editLoading = true;
		editComp(para).then((value) => {
			dispatch('editSuccess');
			//dispatch('getUsersAll');
			state.editLoading = false;
		});
	},
// 	getCompsAll({ commit, state }) {
// 		state.listLoading = true;
// 		getCompListAll().then((value) => {
// 			console.log("value: " + JSON.stringify(value));
// 			commit(types.GET_COMPS_ALL, { value });
// 			state.listLoading = false;
// 		});
// 	},
};

const mutations = {
// 	[types.GET_COMPS_ALL](state, { value }) {
// 		state.compObj = value.data;
// 		//console.log("state.compObj: " + JSON.stringify(state.compObj));
// 	},
	[types.GET_COMPS](state, { value }) {
		state.compObj = value.data;
		console.log("mutations==>tate.compObj: " + JSON.stringify(state.compObj.data.totalNum));
	},

};

export default {
	state,
	getters,
	actions,
	mutations,
};
