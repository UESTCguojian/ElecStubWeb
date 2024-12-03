<template>
  <div class="user-container">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
    </div>

    <el-tabs v-model="activeTab">
      <!-- 管理员管理 -->
      <el-tab-pane label="管理员管理" name="admins">
        <div class="admin-actions">
          <el-button type="primary" @click="showAddAdminDialog = true">
            <el-icon><Plus /></el-icon>添加管理员
          </el-button>
        </div>

        <el-table :data="usersStore.admins" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="180" />
          <el-table-column prop="username" label="用户名" width="180" />
          <el-table-column prop="realName" label="姓名" width="180" />
          <el-table-column prop="email" label="邮箱" width="250" />
          <el-table-column prop="phone" label="电话" width="180" />
          <el-table-column prop="lastLoginTime" label="最后登录时间" width="250">
            <template #default="scope">
              {{ formatDate(scope.row.lastLoginTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button 
                type="primary" 
                link 
                @click="editAdmin(scope.row)"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                link 
                @click="deleteAdmin(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 用户管理 -->
      <el-tab-pane label="用户列表" name="users">
        <div class="user-actions">
          <el-button type="primary" @click="showAddUserDialog = true">
            <el-icon><Plus /></el-icon>添加用户
          </el-button>
        </div>

        <el-table :data="usersStore.users" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="180" />
          <el-table-column prop="username" label="用户名" width="180" />
          <el-table-column prop="realName" label="姓名" width="180" />
          <el-table-column prop="email" label="邮箱" width="250" />
          <el-table-column prop="phone" label="电话" width="180" />
          <el-table-column prop="accountBalance" label="账户余额" width="150">
            <template #default="scope">
              ¥{{ scope.row.accountBalance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button 
                type="primary" 
                link 
                @click="showRechargeDialog(scope.row)"
              >
                充值
              </el-button>
              <el-button 
                type="info" 
                link 
                @click="showUserDetails(scope.row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加管理员对话框 -->
    <el-dialog 
      v-model="showAddAdminDialog" 
      title="添加管理员" 
      width="500px"
    >
      <el-form :model="newAdmin" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="newAdmin.username" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="newAdmin.realName" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="newAdmin.email" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="newAdmin.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddAdminDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAddAdmin">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加用户对话框 -->
    <el-dialog 
      v-model="showAddUserDialog" 
      title="添加用户" 
      width="500px"
    >
      <el-form :model="newUser" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="newUser.username" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="newUser.realName" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="newUser.email" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="newUser.phone" />
        </el-form-item>
        <el-form-item label="初始余额">
          <el-input-number 
            v-model="newUser.initialBalance" 
            :precision="2" 
            :step="100" 
            :min="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddUserDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAddUser">确定</el-button>
      </template>
    </el-dialog>

    <!-- 用户充值对话框 -->
    <el-dialog 
      v-model="showRechargeDialogVisible" 
      title="用户充值" 
      width="400px"
    >
      <el-form :model="rechargeForm" label-width="100px">
        <el-form-item label="充值金额">
          <el-input-number 
            v-model="rechargeForm.amount" 
            :precision="2" 
            :step="100" 
            :min="0"
          />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="rechargeForm.method">
            <el-option label="支付宝" value="alipay" />
            <el-option label="微信支付" value="wechat" />
            <el-option label="银行卡" value="bank" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRechargeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRecharge">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()
const activeTab = ref('admins')

// 管理员相关
const showAddAdminDialog = ref(false)
const newAdmin = reactive({
  username: '',
  realName: '',
  email: '',
  phone: ''
})

const submitAddAdmin = () => {
  try {
    usersStore.addAdmin(newAdmin)
    ElMessage.success('管理员添加成功')
    showAddAdminDialog.value = false
    // 重置表单
    Object.keys(newAdmin).forEach(key => newAdmin[key] = '')
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const editAdmin = (admin) => {
  // TODO: 实现管理员编辑逻辑
  ElMessage.info('编辑管理员功能开发中')
}

const deleteAdmin = (adminId) => {
  ElMessageBox.confirm('确定要删除这个管理员吗?', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    usersStore.deleteAdmin(adminId)
    ElMessage.success('管理员删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 用户相关
const showAddUserDialog = ref(false)
const newUser = reactive({
  username: '',
  realName: '',
  email: '',
  phone: '',
  initialBalance: 0
})

const submitAddUser = () => {
  try {
    usersStore.addUser(newUser)
    ElMessage.success('用户添加成功')
    showAddUserDialog.value = false
    // 重置表单
    Object.keys(newUser).forEach(key => {
      if (key === 'initialBalance') {
        newUser[key] = 0
      } else {
        newUser[key] = ''
      }
    })
  } catch (error) {
    ElMessage.error(error.message)
  }
}

// 充值相关
const showRechargeDialogVisible = ref(false)
const currentRechargeUser = ref(null)
const rechargeForm = reactive({
  amount: 0,
  method: 'alipay'
})

const showRechargeDialog = (user) => {
  currentRechargeUser.value = user
  showRechargeDialogVisible.value = true
  rechargeForm.amount = 0
  rechargeForm.method = 'alipay'
}

const submitRecharge = () => {
  if (!currentRechargeUser.value) return

  try {
    usersStore.rechargeUser(
      currentRechargeUser.value.id, 
      rechargeForm.amount, 
      rechargeForm.method
    )
    ElMessage.success('充值成功')
    showRechargeDialogVisible.value = false
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const showUserDetails = (user) => {
  // TODO: 实现用户详情展示逻辑
  ElMessage.info('用户详情功能开发中')
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.user-container {
  background-color: #f0f2f5;
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  color: #333;
}

.admin-actions,
.user-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
