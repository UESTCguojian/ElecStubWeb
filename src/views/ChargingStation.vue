<template>
  <div class="station-container">
    <div class="page-header">
      <h2 class="page-title">充电站管理</h2>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>新建充电站
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :span="8" v-for="station in stations" :key="station.id">
        <el-card class="station-card" :class="{ 'inactive': !station.isOperating }">
          <div class="station-header">
            <div class="station-title">
              <h3>{{ station.name }}</h3>
              <el-tag :type="station.isOperating ? 'success' : 'info'" size="small">
                {{ station.isOperating ? '营业中' : '暂停营业' }}
              </el-tag>
            </div>
            <div class="station-id">编号：{{ station.id }}</div>
            <div class="station-address">
              <el-icon><Location /></el-icon>
              {{ station.address }}
            </div>
          </div>
          
          <div class="station-stats">
            <div class="stat-item total">
              <div class="stat-value">{{ station.totalPiles }}</div>
              <div class="stat-label">充电桩总数</div>
            </div>
            <div class="stat-item charging">
              <div class="stat-value">{{ station.chargingPiles }}</div>
              <div class="stat-label">正在充电</div>
            </div>
            <div class="stat-item idle">
              <div class="stat-value">{{ station.idlePiles }}</div>
              <div class="stat-label">闲置</div>
            </div>
            <div class="stat-item faulty">
              <div class="stat-value">{{ station.faultyPiles }}</div>
              <div class="stat-label">故障</div>
            </div>
          </div>

          <div class="station-footer">
            <el-button 
              :type="station.isOperating ? 'danger' : 'success'"
              :disabled="!station.isOperating && station.chargingPiles > 0"
              @click="toggleStationStatus(station)"
            >
              {{ station.isOperating ? '停止营业' : '开始营业' }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新建充电站对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新建充电站"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="站点编号" prop="id">
          <el-input v-model="createForm.id" placeholder="请输入站点编号" />
        </el-form-item>
        <el-form-item label="站点名称" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入站点名称" />
        </el-form-item>
        <el-form-item label="站点地址" prop="address">
          <el-input 
            v-model="createForm.address" 
            type="textarea" 
            :rows="2"
            placeholder="请输入站点地址" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreate">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Location } from '@element-plus/icons-vue'

// 模拟数据
const stations = ref([
  {
    id: 'ST001',
    name: '城东充电站',
    address: '城东新区科技路88号',
    isOperating: true,
    totalPiles: 12,
    chargingPiles: 5,
    idlePiles: 6,
    faultyPiles: 1
  },
  {
    id: 'ST002',
    name: '城西充电站',
    address: '城西商务区金融街66号',
    isOperating: true,
    totalPiles: 8,
    chargingPiles: 3,
    idlePiles: 4,
    faultyPiles: 1
  },
  {
    id: 'ST003',
    name: '城南充电站',
    address: '城南新区文化路33号',
    isOperating: false,
    totalPiles: 10,
    chargingPiles: 0,
    idlePiles: 8,
    faultyPiles: 2
  },
  {
    id: 'ST004',
    name: '城北充电站',
    address: '城北商务区科技路99号',
    isOperating: true,
    totalPiles: 15,
    chargingPiles: 7,
    idlePiles: 7,
    faultyPiles: 1
  },
  {
    id: 'ST005',
    name: '高新区充电站',
    address: '高新区科技路77号',
    isOperating: false,
    totalPiles: 6,
    chargingPiles: 0,
    idlePiles: 5,
    faultyPiles: 1
  }
])

const toggleStationStatus = (station) => {
  // 如果要停止营业，检查是否有正在充电的充电桩
  if (station.isOperating && station.chargingPiles > 0) {
    ElMessage.warning('当前还有充电桩正在使用中，无法停止营业')
    return
  }
  
  station.isOperating = !station.isOperating
  ElMessage.success(`${station.name}已${station.isOperating ? '开始' : '停止'}营业`)
}

// 新建充电站相关
const dialogVisible = ref(false)
const createFormRef = ref(null)

const createForm = reactive({
  id: '',
  name: '',
  address: '',
  isOperating: true,
  totalPiles: 0,
  chargingPiles: 0,
  idlePiles: 0,
  faultyPiles: 0
})

const createRules = {
  id: [
    { required: true, message: '请输入站点编号', trigger: 'blur' },
    { pattern: /^ST\d{3}$/, message: '站点编号格式为ST加3位数字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入站点名称', trigger: 'blur' },
    { min: 2, max: 20, message: '站点名称长度为2-20个字符', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入站点地址', trigger: 'blur' },
    { min: 5, max: 100, message: '地址长度为5-100个字符', trigger: 'blur' }
  ]
}

const showCreateDialog = () => {
  dialogVisible.value = true
  // 重置表单
  if (createFormRef.value) {
    createFormRef.value.resetFields()
  }
}

const handleCreate = () => {
  createFormRef.value.validate((valid) => {
    if (valid) {
      // 检查站点编号是否已存在
      if (stations.value.some(station => station.id === createForm.id)) {
        ElMessage.error('站点编号已存在')
        return
      }

      // 创建新站点
      const newStation = {
        ...createForm,
        piles: []
      }

      // 添加到站点列表
      stations.value.push(newStation)
      
      // 关闭对话框并提示
      dialogVisible.value = false
      ElMessage.success('充电站创建成功')
    }
  })
}
</script>

<style scoped>
.station-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  color: #1d1d1f;
  font-size: 24px;
  font-weight: 500;
}

.station-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.station-card.inactive {
  opacity: 0.7;
}

.station-header {
  margin-bottom: 20px;
}

.station-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.station-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.station-id {
  color: #86868b;
  font-size: 14px;
}

.station-address {
  color: #666;
  font-size: 14px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.station-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  text-align: center;
}

.stat-item {
  padding: 12px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

/* 不同状态的样式 */
.stat-item.total {
  background-color: #f5f7fa;
}

.stat-item.total .stat-value {
  color: #1d1d1f;
}

.stat-item.charging {
  background-color: #ecf5ff;
}

.stat-item.charging .stat-value {
  color: #409eff;
}

.stat-item.idle {
  background-color: #f0f9eb;
}

.stat-item.idle .stat-value {
  color: #67c23a;
}

.stat-item.faulty {
  background-color: #fef0f0;
}

.stat-item.faulty .stat-value {
  color: #f56c6c;
}

.station-footer {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-tag) {
  border-radius: 4px;
}

:deep(.el-button) {
  padding: 8px 20px;
  border-radius: 6px;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

:deep(.el-input-number) {
  width: 180px;
}

:deep(.el-switch) {
  margin-left: 8px;
}
</style>
