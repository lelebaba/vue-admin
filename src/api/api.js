import axios from 'axios';


let base = '';
//let wbas = 'http://www.mybestiot.com/nb';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUsersListAll = params => { return axios.get(`${base}/users/list/full`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

var axiosInst = axios.create({
  baseURL: 'http://www.mybestiot.com/nb/'
});


export const getCompListAll = params => { return axiosInst.get(`compListAll`, { params: params }); };
export const getCompListPage = params => { return axiosInst.get(`compList`, { params: params }); };
export const saveComp = params => { 
	let usParam = new URLSearchParams();
	Object.keys(params).forEach(function(key){
		usParam.append(key,params[key]);
	});
	return axiosInst.post(`compSave`, usParam); 
	};
