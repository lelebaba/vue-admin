import { getCompListAll,getCompListPage,saveComp,delComp} from '../../api/api';
import * as types from '../mutation-types';

// TODO: Should not deal with view state in Vuex;
// import { Message } from 'element-ui';

// This is just as an Vuex example;
const state = {
	compObj: {
		data: {},
	},
	compAllObj:{data:{},},
	compListLoading: false,
};

/**
 * getter有点类似vue.js的计算属性，当我们需要从store的state中派生出一些状态，那么我们就需要使用getter，
 * getter会接收state作为第一个参数，而且getter的返回值会根据它的依赖被缓存起来，
 * 只有getter中的依赖值（state中的某个需要派生状态的值）发生改变的时候才会被重新计算。
 */  

const getters = {
	comps: state => {
		return state.compObj.data;
		},

    compListLoading:state => state.compListLoading,
};


const actions = {
	getComps({ commit, state }, para) {
		//console.log("调用getCompListPage..........");
		state.listLoading = true;
		state.compListLoading = true;
		getCompListPage(para).then((value) => {
			//console.log("getCompListPage:value=="+JSON.stringify(value));
			commit(types.GET_COMPS, { value });
			state.compListLoading = false;
			state.listLoading = false;
		});
	},
	editComp({ dispatch, commit, state }, para) {
		state.editLoading = true;
		//console.log('tb--para==before delete pageInfo::'+JSON.stringify(para));
		let pageInfo = para.pageInfo;
		delete para.pageInfo;
		//console.log('tb--para==after delete pageInfo::'+JSON.stringify(para));
		saveComp(para).then((value) => {
			dispatch('editSuccess');
			dispatch('getComps',pageInfo);
			state.editLoading = false;
		});
	},
	removeComp({ dispatch, commit, state }, para) {
		state.listLoading = true;
		//console.log('removeComp -----para=='+JSON.stringify(para));
		let pageInfo = para.pageInfo;
		delete para.pageInfo;
		return delComp({ id: para.id }).then((value) => {
			// commit(types.REMOVE_USER, {value});
			// dispatch('removeUserSuccess');
			
			console.log('value == '+JSON.stringify(value));
			console.log('pageInfo=='+JSON.stringify(pageInfo));
			dispatch('getComps',pageInfo);
		}, (res) => {
			console.log('failure');
			return Promise.reject(res);
		});
	},
	getCompsAll({ commit, state }, para) {
		//console.log("调用getCompListAll..........");
		getCompListAll(para).then((value) => {
			//console.log("getCompListAll:value=="+JSON.stringify(value));
			commit(types.GET_COMPS_ALL, { value });
			state.compListLoading = false;
			state.listLoading = false;
		});
	},
};

const mutations = {
	[types.GET_COMPS_ALL](state, { value }) {
		state.compAllObj = value.data;
		//console.log("state.compAllObj: " + JSON.stringify(state.compAllObj));
	},
	[types.GET_COMPS](state, { value }) {
		state.compObj = value.data;
		//console.log("mutations==>tate.compObj: " + JSON.stringify(state.compObj.data.totalNum));
	},

};

export default {
	state,
	getters,
	actions,
	mutations,
};
