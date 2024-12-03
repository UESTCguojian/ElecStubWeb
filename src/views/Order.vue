<template>
  <div class="order-container">
    <div class="page-header">
      <h2 class="page-title">订单管理</h2>
    </div>

    <div class="order-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="正在充电" name="charging">
          <el-row :gutter="20">
            <el-col 
              v-for="order in chargingOrders" 
              :key="order.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
            >
              <el-card class="order-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>订单号: {{ order.id }}</span>
                    <el-tag type="success" size="small">充电中</el-tag>
                  </div>
                </template>
                <div class="order-content">
                  <div class="info-item">
                    <span class="label">充电站：</span>
                    <span class="value">{{ order.stationName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">充电桩：</span>
                    <span class="value">{{ order.pileId }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">开始时间：</span>
                    <span class="value">{{ formatDate(order.startTime) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">充电时长：</span>
                    <span class="value">{{ order.chargingTime }}分钟</span>
                  </div>
                  <div class="info-item">
                    <span class="label">预计剩余时间：</span>
                    <span class="value">{{ order.remainingTime }}分钟</span>
                  </div>
                  <div class="info-item">
                    <span class="label">当前金额：</span>
                    <span class="value">¥{{ order.currentAmount.toFixed(2) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">预计收入：</span>
                    <span class="value">¥{{ order.expectedIncome.toFixed(2) }}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <el-button type="danger" size="small" @click="endOrder(order.id)">
                    结束订单
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        
        <el-tab-pane label="已完成订单" name="completed">
          <el-row :gutter="20">
            <el-col 
              v-for="order in completedOrders" 
              :key="order.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
            >
              <el-card class="order-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>订单号: {{ order.id }}</span>
                    <el-tag type="info" size="small">已完成</el-tag>
                  </div>
                </template>
                <div class="order-content">
                  <div class="info-item">
                    <span class="label">充电站：</span>
                    <span class="value">{{ order.stationName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">充电桩：</span>
                    <span class="value">{{ order.pileId }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">开始时间：</span>
                    <span class="value">{{ formatDate(order.startTime) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">充电时长：</span>
                    <span class="value">{{ order.chargingTime }}分钟</span>
                  </div>
                  <div class="info-item">
                    <span class="label">总金额：</span>
                    <span class="value">¥{{ order.currentAmount.toFixed(2) }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'

const ordersStore = useOrdersStore()

const activeTab = ref('charging')

const chargingOrders = computed(() => ordersStore.chargingOrders)
const completedOrders = computed(() => ordersStore.completedOrders)

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const endOrder = (orderId) => {
  ordersStore.endOrder(orderId)
}
</script>

<style scoped>
.order-container {
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

.order-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-content {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 600;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
