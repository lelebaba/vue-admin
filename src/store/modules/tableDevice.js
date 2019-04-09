import { getDevsPage,saveDev} from '../../api/api';
import * as types from '../mutation-types';

const state = {
	deviceObj: {
		data: {},
	},
	listLoading: false,
	editLoading:false,
};

/**
 * getter有点类似vue.js的计算属性，当我们需要从store的state中派生出一些状态，那么我们就需要使用getter，
 * getter会接收state作为第一个参数，而且getter的返回值会根据它的依赖被缓存起来，
 * 只有getter中的依赖值（state中的某个需要派生状态的值）发生改变的时候才会被重新计算。
 */  

const getters = {
	//可以不用getter，直接在vue中取到state中的userObj
	device: state => {
		return state.deviceObj.data;
	},
};


const actions = {
	getDevices({ commit, state }, para) {
		state.listLoading = true;
		getDevsPage(para).then((value) => {
			//console.log("getCompListPage:value=="+JSON.stringify(value));
			commit(types.GET_DEVICES, { value });
			state.listLoading = false;
		});
	},
	editDevice({ dispatch, commit, state }, para) {
		state.editLoading = true;
		//console.log('tb--para==before delete pageInfo::'+JSON.stringify(para));
		let pageInfo = para.pageInfo;
		delete para.pageInfo;
		saveDev(para).then((value) => {
			dispatch('editSuccess');
			dispatch('getDevices',pageInfo);
			state.editLoading = false;
		});
	},
	removeDevice({ dispatch, commit, state }, para) {
		state.listLoading = true;
		//console.log('removeComp -----para=='+JSON.stringify(para));
		let pageInfo = para.pageInfo;
		delete para.pageInfo;
		return delDevice({ id: para.id }).then((value) => {
			dispatch('getSysUsers',pageInfo);
		}, (res) => {
			console.log('failure');
			return Promise.reject(res);
		});
	}
};

const mutations = {
	[types.GET_DEVICES](state, { value }) {
		state.deviceObj = value.data;
	},

};

export default {
	state,
	getters,
	actions,
	mutations,
};
