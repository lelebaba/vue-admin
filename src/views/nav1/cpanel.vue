<template>
	<section>
	<el-row>
		<el-col :span="12" style="border: #475669 solid 1px;">
			<div  class="toolbar" style="margin: 0px;height: 30px; background-color: cadetblue;">这是标题</div>
		<!-- 列表 -->
			<el-table :data="currentUsers" highlight-current-row v-loading="listLoading" @selection-change="selsChange">
			<el-table-column type="selection" >     </el-table-column>
				<el-table-column type="index" >
				</el-table-column>
				<el-table-column prop="logname" label="登录名"  sortable>
				</el-table-column>
				<el-table-column prop="name" label="显示名"  sortable>
				</el-table-column>
				<el-table-column prop="mobile" label="手机号"  sortable>
				</el-table-column>
				<el-table-column prop="compName" label="所属公司"  sortable>
				</el-table-column>
				<el-table-column label="操作" >
					<template slot-scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
		</el-table>
		
		</el-col>
		<el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>
	</el-row>

	</section>
</template>
<script>
	import util from '../../common/js/util';
	import { mapGetters } from 'vuex';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: '',
				},
				page: 1,
				pageSize: 5,
				pageSizes: [5, 10, 30, 50],
				// listLoading: false,

				// 列表选中列
				sels: [],

				// 编辑界面是否显示
				editFormVisible: false,
				// editLoading: false,
				editFormRules: {
					logname: [
						{ required: true, message: '请输入登录名', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					mobile:[
						{ required: true, message: '请输入电话', trigger: 'blur' },
						{ pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码'}
					],
				},

				// 编辑界面数据
				editForm: {	},
			}
		},
		computed: {
			comps(){
				let compList = this.$store.state.tc.compAllObj.data;
				//console.log('compList=='+JSON.stringify(compList));
				return compList;
			},
			//试验使用function+mapGetters的形式，完全可以
			//mapGetter可以不要，也就是说，vuex的store并不一定非要getter来获取值
			//getter获取值时，因为其变量是全局的，所以不能重复定义
			//而state中的变量是局部的，这就导致：
			//当state中可以定义与别的module中同名的变量，但当要经由getter送出时，则必须重新定义一个新的变量，再将state中变量传递给它
			sysUsers() {
				//console.log('users==00000000');
				return this.$store.state.tu.userObj.data;
			},
			
			...mapGetters({
				//users:'usersNew', // 映射 `this.users` 为 `store.getters.users`
				listLoading:'listLoadingNew',
				editLoading:'editLoadingNew',
			}),
			currentUsers() {
					this.total=this.sysUsers.totalNum;
					return this.sysUsers.content;
			},
		},
		methods: {
			// 性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},

			// 改变页容量
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
				this.getSysUsers();
			},

			// 翻页
			handleCurrentChange(val) {
				console.log(`当前是 ${val} 页`);
				this.page = val;
				this.getSysUsers();
			},
			
			getSysUsers(){
				let para = {
					pageNo: this.page,
					pageSize:this.pageSize,
					name: this.filters.name,
				};
				//console.log('time=='+new Date().toLocaleDateString());
				this.$store.dispatch('getSysUsers',para);
			},

			// 删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					// this.listLoading = true;
					//NProgress.start();
					let para = {
						id: row.id,
						pageInfo:{
							pageNo: this.page,
							pageSize: this.pageSize,
							name: this.filters.name,
						}
					};
					this.$store.dispatch('removeSysUser', para).then(() => {
						console.log('dispatch');
						this.$message({
							message: '删除成功',
							type: 'success',
						});
					}).catch((res) => {
						console.error('fff>>>>', res);
						this.$message({
							message: '删除失败了哦!',
							type: 'error',
						});
					});
				}).catch(() => {

				});
			},

			// 显示编辑界面
			handleEdit: function (index, row) {
				this.$store.dispatch('getCompsAll');
				
				//使用这种方法时，是在data中定义一个comps，然后在这里给comps赋值
				//但由于$store.dispatch是异步执行，所以还没执行完时，下面语句就执行了
				//导致this.comps为空值，所以不能用这种方法，
				//而是采用在computed中定义comps方法,这样，只有state中值变化后才触发return
				//相当于是this.$store.dispatch('getCompsAll');方法的回调
				// this.comps = this.$store.state.tc.compAllObj.data;
				// console.log('this.comps==--=====++++'+JSON.stringify(this.comps));
				
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},

			// 编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							//NProgress.start();
							//let para = Object.assign({}, this.editForm);
							let para = Object.assign({}, this.editForm, {
								pageInfo: {
									pageNo: this.page,
									pageSize:this.pageSize,
									name: this.filters.name,
								},
							});
							
							this.$store.dispatch('editSysUser', para).then(() => {
								
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								//this.getComps();
							});
						});
					}
				});
			},

			selsChange: function (sels) {
				this.sels = sels;
			},

			// 批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning',
				}).then(() => {
					//NProgress.start();
					let para = Object.assign({}, { ids: ids }, {
						all: {
							page: this.page,
							name: this.filters.name,
						},
					});
					this.$store.dispatch('batchRemoveUser', para).then((res) => {
						//NProgress.done();
					});
				}).catch(() => {
				});
			}
		},
		created() {
			//console.log("comp.vue-->调用this.getComps().....");
			this.getSysUsers();
		},
		// mounted() {
		// 	this.getUsers();
		// }
	}
</script>
