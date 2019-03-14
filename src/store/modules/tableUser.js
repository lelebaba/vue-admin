import { getUsersPage,saveUser,delUser} from '../../api/api';
import * as types from '../mutation-types';

// TODO: Should not deal with view state in Vuex;
// import { Message } from 'element-ui';

// This is just as an Vuex example;
const state = {
	userObj: {
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
// 	usersNew: state => {
// 		return state.userObj.data;
// 	},

    listLoadingNew:state => state.listLoading,
	editLoadingNew:state => state.editLoading,
};


const actions = {
	getSysUsers({ commit, state }, para) {
		console.log("调用getUsersPage..........");
		state.listLoading = true;
		getUsersPage(para).then((value) => {
			//console.log("getCompListPage:value=="+JSON.stringify(value));
			commit(types.GET_SYS_USERS, { value });
			state.listLoading = false;
		});
	},
	editSysUser({ dispatch, commit, state }, para) {
		state.editLoading = true;
		//console.log('tb--para==before delete pageInfo::'+JSON.stringify(para));
		let pageInfo = para.pageInfo;
		delete para.pageInfo;
		console.log('tbUsers--para==after delete pageInfo::'+JSON.stringify(para));
		saveUser(para).then((value) => {
			dispatch('editSuccess');
			dispatch('getSysUsers',pageInfo);
			state.editLoading = false;
		});
	},
	removeSysUser({ dispatch, commit, state }, para) {
		state.listLoading = true;
		//console.log('removeComp -----para=='+JSON.stringify(para));
		let pageInfo = para.pageInfo;
		delete para.pageInfo;
		return delUser({ id: para.id }).then((value) => {
			// commit(types.REMOVE_USER, {value});
			// dispatch('removeUserSuccess');
			
			//console.log('value == '+JSON.stringify(value));
			//console.log('pageInfo=='+JSON.stringify(pageInfo));
			dispatch('getSysUsers',pageInfo);
		}, (res) => {
			console.log('failure');
			return Promise.reject(res);
		});
	}
};

const mutations = {
	[types.GET_SYS_USERS](state, { value }) {
		state.userObj = value.data;
	},

};

export default {
	state,
	getters,
	actions,
	mutations,
};
