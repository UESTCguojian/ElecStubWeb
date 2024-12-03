<template>
  <div class="pile-container">
    <div class="page-header">
      <h2 class="page-title">充电桩管理</h2>
    </div>

    <!-- 充电站列表 -->
    <div class="station-list">
      <el-card v-for="station in stations" :key="station.id" class="station-card">
        <div class="station-header">
          <div class="station-info">
            <div class="station-title">
              <h3>{{ station.name }}</h3>
              <el-tag type="success" size="small">营业中</el-tag>
            </div>
            <div class="station-id">编号：{{ station.id }}</div>
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

          <div class="station-actions">
            <el-button type="primary" @click="showCreatePileDialog(station)">
              <el-icon><Plus /></el-icon>新建充电桩
            </el-button>
            <el-button 
              class="expand-button"
              :class="{ 'is-expanded': expandedStations[station.id] }"
              @click="toggleExpand(station.id)"
            >
              <el-icon><ArrowDown /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 充电桩列表 -->
        <el-collapse-transition>
          <div v-show="expandedStations[station.id]" class="pile-list">
            <el-row :gutter="20">
              <el-col 
                v-for="pile in station.piles" 
                :key="pile.id"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
              >
                <el-card class="pile-card" shadow="hover">
                  <template #header>
                    <div class="pile-header">
                      <span class="pile-id">{{ pile.id }}</span>
                      <el-tag :type="getStatusType(pile.status)">
                        {{ getStatusText(pile.status) }}
                      </el-tag>
                    </div>
                  </template>
                  <div class="pile-info">
                    <div class="pile-content">
                      <div class="info-item">
                        <span class="label">充电功率：</span>
                        <span class="value">{{ pile.power }}kW</span>
                      </div>
                      <div class="info-item">
                        <span class="label">充电价格：</span>
                        <span class="value">{{ pile.pricePerHour }}元/小时</span>
                      </div>
                      <div class="info-item" v-if="pile.currentOrder">
                        <span class="label">当前订单：</span>
                        <span class="value">{{ pile.currentOrder }}</span>
                      </div>
                    </div>
                    <div class="pile-actions">
                      <el-button 
                        type="primary" 
                        link 
                        :disabled="pile.status === 'charging'"
                        @click="showEditPileDialog(station, pile)"
                      >
                        编辑
                      </el-button>
                      <el-button 
                        type="danger" 
                        link 
                        :disabled="pile.status === 'charging'"
                        @click="handleDeletePile(station, pile)"
                      >
                        删除
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-collapse-transition>
      </el-card>
    </div>

    <!-- 新建/编辑充电桩对话框 -->
    <el-dialog
      v-model="pileFormDialogVisible"
      :title="editingPile ? '编辑充电桩' : '新建充电桩'"
      width="500px"
    >
      <el-form ref="pileFormRef" :model="pileForm" :rules="pileRules" label-width="100px">
        <el-form-item label="充电桩编号" prop="id" v-if="!editingPile">
          <el-input v-model="pileForm.id" placeholder="请输入充电桩编号（P加3位数字）" />
        </el-form-item>
        <el-form-item label="充电功率" prop="power">
          <el-select v-model="pileForm.power" style="width: 100%">
            <el-option :label="'50kW'" :value="50" />
            <el-option :label="'100kW'" :value="100" />
            <el-option :label="'200kW'" :value="200" />
          </el-select>
        </el-form-item>
        <el-form-item label="充电价格" prop="pricePerHour">
          <el-input-number 
            v-model="pileForm.pricePerHour" 
            :min="0.1" 
            :max="20"
            :step="0.1"
            :precision="1"
            style="width: 100%"
          >
            <template #append>元/小时</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="pileForm.status" style="width: 100%">
            <el-option label="闲置" value="idle" />
            <el-option label="故障" value="faulty" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pileFormDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePile">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useStationsStore } from '../stores/stations'

const stationsStore = useStationsStore()
const stations = computed(() => stationsStore.operatingStations)

const expandedStations = ref({})
const pileFormDialogVisible = ref(false)
const pileFormRef = ref(null)
const currentStation = ref(null)
const editingPile = ref(null)

const pileForm = ref({
  id: '',
  power: 50,
  pricePerHour: 3.5,
  status: 'idle'
})

const pileRules = {
  id: [
    { required: true, message: '请输入充电桩编号', trigger: 'blur' },
    { pattern: /^P\d{3}$/, message: '编号格式为P加3位数字', trigger: 'blur' }
  ],
  power: [
    { required: true, message: '请选择充电功率', trigger: 'change' }
  ],
  pricePerHour: [
    { required: true, message: '请输入充电价格', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 20, message: '价格范围为0.1-20元/小时', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

const toggleExpand = (stationId) => {
  expandedStations.value[stationId] = !expandedStations.value[stationId]
}

const showCreatePileDialog = (station) => {
  currentStation.value = station
  editingPile.value = null
  pileForm.value = {
    id: '',
    power: 50,
    pricePerHour: 3.5,
    status: 'idle'
  }
  pileFormDialogVisible.value = true
}

const showEditPileDialog = (station, pile) => {
  currentStation.value = station
  editingPile.value = pile
  pileForm.value = {
    ...pile
  }
  pileFormDialogVisible.value = true
}

const handleSavePile = async () => {
  if (!pileFormRef.value) return
  
  await pileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (editingPile.value) {
          // 编辑充电桩
          await stationsStore.updatePile(currentStation.value.id, pileForm.value)
          ElMessage.success('充电桩修改成功')
        } else {
          // 新建充电桩
          await stationsStore.addPile(currentStation.value.id, pileForm.value)
          ElMessage.success('充电桩创建成功')
        }
        pileFormDialogVisible.value = false
      } catch (error) {
        ElMessage.error(error.message)
      }
    }
  })
}

const handleDeletePile = (station, pile) => {
  ElMessageBox.confirm(
    '确定要删除该充电桩吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await stationsStore.deletePile(station.id, pile.id)
      ElMessage.success('充电桩删除成功')
    } catch (error) {
      ElMessage.error(error.message)
    }
  })
}

const getStatusType = (status) => {
  const types = {
    idle: 'success',
    charging: 'primary',
    faulty: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    idle: '闲置',
    charging: '充电中',
    faulty: '故障'
  }
  return texts[status] || status
}
</script>

<style scoped>
.pile-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.station-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.station-card {
  width: 100%;
}

.station-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.station-info {
  flex: 1;
}

.station-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.station-title h3 {
  margin: 0;
  font-size: 18px;
}

.station-id {
  color: #909399;
  font-size: 14px;
}

.station-stats {
  display: flex;
  gap: 20px;
  margin: 0 20px;
}

.stat-item {
  text-align: center;
  padding: 0 15px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.total .stat-value {
  color: #409EFF;
}

.charging .stat-value {
  color: #67C23A;
}

.idle .stat-value {
  color: #909399;
}

.faulty .stat-value {
  color: #F56C6C;
}

.station-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.expand-button {
  padding: 8px;
  transition: transform 0.3s ease;
}

.expand-button.is-expanded {
  transform: rotate(180deg);
}

.pile-list {
  margin-top: 20px;
}

.pile-card {
  height: 280px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.pile-card :deep(.el-card__header) {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.pile-card :deep(.el-card__body) {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.pile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pile-id {
  font-size: 16px;
  font-weight: 500;
  color: #1d1d1f;
}

.pile-info {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pile-content {
  flex: 1;
}

.info-item {
  margin-bottom: 12px;
  line-height: 1.5;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  color: #666;
  font-size: 14px;
}

.info-item .value {
  color: #1d1d1f;
  font-size: 14px;
  font-weight: 500;
}

.pile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-collapse-transition) {
  transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out;
}
</style>
