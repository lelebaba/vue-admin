<template>
	<section>
		<!-- 工具条 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="设备名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getSysUsers()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleEdit">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- 列表 -->
		<el-table :data="curDevs" highlight-current-row v-loading="listLoading" @selection-change="selsChange">
		<el-table-column type="selection" >     </el-table-column>
			<el-table-column type="index" >
			</el-table-column>
			<el-table-column prop="id" label="设备号">
			</el-table-column>
			<el-table-column prop="name" label="名称">
			</el-table-column>
			<el-table-column prop="compName" label="所属公司">
			</el-table-column>
			<el-table-column prop="descr" label="描述">
			</el-table-column>
			<el-table-column label="操作" >
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
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input v-model="editForm.descr" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属公司">
					<el-select v-model="editForm.compid" placeholder="请选择所属公司">
						 <el-option v-for="(item,index) in comps" :key="index"  :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		

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
					name: [
						{ required: true, message: '请输入设备名称', trigger: 'blur' }
					],
					compid: [
						{ required: true, message: '请选择所属公司', trigger: 'blur' }
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
			devices() {
				return this.$store.state.td.deviceObj.data;
			},
			
			...mapGetters({
				//users:'usersNew', // 映射 `this.users` 为 `store.getters.users`
				listLoading:'listLoadingNew',
				editLoading:'editLoadingNew',
			}),
			curDevs() {
					this.total=this.devices.totalNum;
					return this.devices.content;
			},
		},
		methods: {

			// 改变页容量
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
				this.getDevices();
			},

			// 翻页
			handleCurrentChange(val) {
				console.log(`当前是 ${val} 页`);
				this.page = val;
				this.getDevices();
			},
			
			getDevices(){
				let para = {
					pageNo: this.page,
					pageSize:this.pageSize,
					name: this.filters.name,
				};
				//console.log('time=='+new Date().toLocaleDateString());
				this.$store.dispatch('getDevices',para);
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
					this.$store.dispatch('removeDevice', para).then(() => {
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

			// 编辑提交
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
							
							this.$store.dispatch('editDevice', para).then(() => {
								
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
					this.$store.dispatch('batchRemoveDevs', para).then((res) => {
						//NProgress.done();
					});
				}).catch(() => {
				});
			}
		},
		created() {
			//console.log("comp.vue-->调用this.getComps().....");
			this.getDevices();
		},
		// mounted() {
		// 	this.getUsers();
		// }
	}
</script>
