import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStationsStore } from './stations'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([
    {
      id: 'ORDER123',
      stationId: 'ST001',
      stationName: '城东充电站',
      pileId: 'P001',
      startTime: new Date('2023-09-15T10:30:00'),
      chargingTime: 45, // 分钟
      remainingTime: 15, // 分钟
      currentAmount: 22.5, // 当前金额
      expectedIncome: 30.0, // 预计收入
      status: 'charging'
    },
    {
      id: 'ORDER124',
      stationId: 'ST002',
      stationName: '城西充电站',
      pileId: 'P004',
      startTime: new Date('2023-09-15T11:15:00'),
      chargingTime: 30, // 分钟
      remainingTime: 20, // 分钟
      currentAmount: 15.0, // 当前金额
      expectedIncome: 25.0, // 预计收入
      status: 'charging'
    },
    {
      id: 'ORDER125',
      stationId: 'ST003',
      stationName: '城南充电站',
      pileId: 'P006',
      startTime: new Date('2023-09-15T09:45:00'),
      chargingTime: 60, // 分钟
      remainingTime: 10, // 分钟
      currentAmount: 35.0, // 当前金额
      expectedIncome: 42.0, // 预计收入
      status: 'charging'
    }
  ])

  // 计算属性：正在充电的订单
  const chargingOrders = computed(() => 
    orders.value.filter(order => order.status === 'charging')
  )

  // 计算属性：已完成的订单
  const completedOrders = computed(() => 
    orders.value.filter(order => order.status === 'completed')
  )

  // 添加新订单
  const addOrder = (order) => {
    orders.value.push({
      ...order,
      id: `ORDER${orders.value.length + 1}`,
      status: 'charging'
    })
  }

  // 更新订单状态
  const updateOrderStatus = (orderId, status) => {
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = status
    }
  }

  // 结束订单并计算最终金额
  const endOrder = (orderId) => {
    const orderIndex = orders.value.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      const order = orders.value[orderIndex]
      const stationsStore = useStationsStore()
      const station = stationsStore.stations.find(s => s.id === order.stationId)
      const pile = station?.piles.find(p => p.id === order.pileId)
      
      if (pile) {
        // 计算最终金额（假设按小时计费）
        const finalAmount = (order.chargingTime / 60) * pile.pricePerHour
        order.currentAmount = finalAmount
        order.status = 'completed'
      }
    }
  }

  return {
    orders,
    chargingOrders,
    completedOrders,
    addOrder,
    updateOrderStatus,
    endOrder
  }
})
