import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStationsStore = defineStore('stations', () => {
  // 状态
  const stations = ref([
    {
      id: 'ST001',
      name: '城东充电站',
      address: '城东区科技路88号',
      isOperating: true,
      totalPiles: 12,
      chargingPiles: 5,
      idlePiles: 6,
      faultyPiles: 1,
      piles: [
        { id: 'P001', power: 50, pricePerHour: 3.5, status: 'charging', currentOrder: 'ORDER123' },
        { id: 'P002', power: 100, pricePerHour: 5.0, status: 'idle', currentOrder: '' },
        { id: 'P003', power: 200, pricePerHour: 8.0, status: 'faulty', currentOrder: '' }
      ]
    },
    {
      id: 'ST002',
      name: '城西充电站',
      address: '城西区创业大道66号',
      isOperating: true,
      totalPiles: 8,
      chargingPiles: 3,
      idlePiles: 4,
      faultyPiles: 1,
      piles: [
        { id: 'P004', power: 50, pricePerHour: 3.5, status: 'charging', currentOrder: 'ORDER124' },
        { id: 'P005', power: 100, pricePerHour: 5.0, status: 'idle', currentOrder: '' }
      ]
    },
    {
      id: 'ST003',
      name: '城南充电站',
      address: '城南区阳光路123号',
      isOperating: true,
      totalPiles: 10,
      chargingPiles: 4,
      idlePiles: 5,
      faultyPiles: 1,
      piles: [
        { id: 'P006', power: 50, pricePerHour: 3.5, status: 'charging', currentOrder: 'ORDER125' },
        { id: 'P007', power: 100, pricePerHour: 5.0, status: 'charging', currentOrder: 'ORDER126' },
        { id: 'P008', power: 200, pricePerHour: 8.0, status: 'charging', currentOrder: 'ORDER127' },
        { id: 'P009', power: 100, pricePerHour: 5.0, status: 'charging', currentOrder: 'ORDER128' },
        { id: 'P010', power: 50, pricePerHour: 3.5, status: 'idle', currentOrder: '' },
        { id: 'P011', power: 100, pricePerHour: 5.0, status: 'idle', currentOrder: '' },
        { id: 'P012', power: 200, pricePerHour: 8.0, status: 'idle', currentOrder: '' },
        { id: 'P013', power: 100, pricePerHour: 5.0, status: 'idle', currentOrder: '' },
        { id: 'P014', power: 50, pricePerHour: 3.5, status: 'idle', currentOrder: '' },
        { id: 'P015', power: 200, pricePerHour: 8.0, status: 'faulty', currentOrder: '' }
      ]
    }
  ])

  // 计算属性
  const operatingStations = computed(() => 
    stations.value.filter(station => station.isOperating)
  )

  // 更新充电站统计数据
  const updateStationStats = (station) => {
    const piles = station.piles
    station.totalPiles = piles.length
    station.chargingPiles = piles.filter(p => p.status === 'charging').length
    station.idlePiles = piles.filter(p => p.status === 'idle').length
    station.faultyPiles = piles.filter(p => p.status === 'faulty').length
  }

  // 添加充电桩
  const addPile = async (stationId, pile) => {
    const station = stations.value.find(s => s.id === stationId)
    if (!station) {
      throw new Error('充电站不存在')
    }

    // 检查编号是否已存在
    if (station.piles.some(p => p.id === pile.id)) {
      throw new Error('充电桩编号已存在')
    }

    // 添加新充电桩
    station.piles.push({
      ...pile,
      currentOrder: ''
    })

    // 更新统计数据
    updateStationStats(station)
  }

  // 更新充电桩
  const updatePile = async (stationId, pile) => {
    const station = stations.value.find(s => s.id === stationId)
    if (!station) {
      throw new Error('充电站不存在')
    }

    const existingPile = station.piles.find(p => p.id === pile.id)
    if (!existingPile) {
      throw new Error('充电桩不存在')
    }

    // 更新充电桩信息
    Object.assign(existingPile, pile)

    // 更新统计数据
    updateStationStats(station)
  }

  // 删除充电桩
  const deletePile = async (stationId, pileId) => {
    const station = stations.value.find(s => s.id === stationId)
    if (!station) {
      throw new Error('充电站不存在')
    }

    const index = station.piles.findIndex(p => p.id === pileId)
    if (index === -1) {
      throw new Error('充电桩不存在')
    }

    // 删除充电桩
    station.piles.splice(index, 1)

    // 更新统计数据
    updateStationStats(station)
  }

  return {
    stations,
    operatingStations,
    addPile,
    updatePile,
    deletePile
  }
})
