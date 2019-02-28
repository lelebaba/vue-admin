<template>
	<section>
		<!-- 工具条 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入公司名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getComps">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 列表 -->
		<el-table :data="currentComps" highlight-current-row v-loading="compListLoading" @selection-change="selsChange"
		style="width: 100%;">
			<el-table-column type="selection" width="55">
      </el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="tel" label="电话" width="150" sortable>
			</el-table-column>
			<el-table-column prop="linkman" label="联系人" width="100" sortable>
			</el-table-column>
			<el-table-column prop="address" label="地址" width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
    </el-table>

    <!-- 工具条 -->
			<el-col :span="24" class="toolbar">
				<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
				<el-pagination
					layout="sizes, total, prev, pager, next"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="page"
					:page-sizes="pageSizes"
					:page-size="pageSize"
					:total="total"
					style="float:right;">
				</el-pagination>
			</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="tel">
					<el-input v-model="editForm.tel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系人">
					<el-input v-model="editForm.linkman" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

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
				// users: [],
				// total: 0,
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
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},

				// 编辑界面数据
				editForm: {
//					id: 0,
//					name: '',
//					tel: '',
//					linkman: '',
//					address: '',
				},

				// 新增界面是否显示
				addFormVisible: false,
				// addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},

				// 新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: '',
				}
			}
		},
		computed: {
			// users() {
			// 	if (!this.$store.getters.users.length) {
			// 		return this.getUsers();
			// 	}
			// 	return this.$store.getters.users;
			// },
			...mapGetters([
				'comps', // 映射 `this.users` 为 `store.getters.users`
				'compListLoading',
				'listLoading',
				'editLoading',
				'addLoading',
			]),
			currentComps() {
				//首次打开页面取列表时，tableComp中getCompListPage(para).then((value)还没执行完毕
				//就开始从store.state中取值，此时store.getters.comps为空
				//如下处理后，当store.getters.comps取到值后，此函数会自动再次执行？
				
				//当tableComp.js中state定义为：
// 				compObj: {
// 					data: {},
// 				},
				//则不会出现上述问题
// 				if(this.comps){
// 					this.total=this.comps.totalNum;
// 					return this.comps.content;
// 				}else{
// 					console.log("this.comps:没取到值 " + this.comps);
// 					this.total = 0;
// 					return [];
// 				}
					//listLoading为false，compListLoading为true
					//这就是为什么如果使用listLoading时，加载效果出不来。但什么原因并不清楚。
					console.log('this.listLoading=='+this.listLoading);
					console.log('this.compListLoading=='+this.compListLoading);
					this.total=this.comps.totalNum;
					return this.comps.content;
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
				this.getComps();
			},

			// 翻页
			handleCurrentChange(val) {
				console.log(`当前是 ${val} 页`);
				this.page = val;
				this.getComps();
			},

			// 获取所有用户列表
			getCompsAll() {
				this.$store.dispatch('getCompsAll');
			},
			
			getComps() {
				let para = {
					pageNo: this.page,
					pageSize:this.pageSize,
					name: this.filters.name,
				};
				this.$store.dispatch('getComps',para);
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
						page: this.page,
						name: this.filters.name,
					};
					this.$store.dispatch('removeUser', para).then(() => {
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
					// removeUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '删除成功',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
				}).catch(() => {

				});
			},

			// 显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				console.log("this.editForm=="+JSON.stringify(this.editForm));
			},

			// 显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: '',
				};
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
							//console.log('para=='+JSON.stringify(para));
							
							this.$store.dispatch('editComp', para).then(() => {
								//NProgress.done();
								
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								//this.getComps();
							});
						});
					}
				});
			},

			// 新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							//NProgress.start();
							let para = Object.assign({}, this.addForm, {
								all: {
									page: this.page,
									name: this.filters.name,
								},
							});
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							this.$store.dispatch('addUser', para).then(() => {
								//NProgress.done();
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
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
			this.getComps();
		},
		// mounted() {
		// 	this.getUsers();
		// }
	}
</script>
