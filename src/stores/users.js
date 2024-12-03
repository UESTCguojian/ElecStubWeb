import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUsersStore = defineStore('users', () => {
  // 管理员数据
  const admins = ref([
    {
      id: 'ADMIN001',
      username: 'admin',
      realName: '系统管理员',
      email: 'admin@example.com',
      phone: '13800138000',
      lastLoginTime: new Date('2023-09-15T10:30:00'),
      status: 'active'
    }
  ])

  // 普通用户数据
  const users = ref([
    {
      id: 'USER001',
      username: 'user1',
      realName: '张三',
      email: 'zhangsan@example.com',
      phone: '13512345678',
      accountBalance: 500.00,
      chargingHistory: [
        {
          orderId: 'ORDER123',
          amount: 50.00,
          date: new Date('2023-09-10T14:30:00')
        }
      ],
      rechargeRecords: [
        {
          id: 'RECHARGE001',
          amount: 200.00,
          date: new Date('2023-09-05T09:15:00'),
          method: 'alipay'
        }
      ]
    }
  ])

  // 管理员操作
  const addAdmin = (admin) => {
    // 检查用户名是否已存在
    if (admins.value.some(a => a.username === admin.username)) {
      throw new Error('管理员用户名已存在')
    }
    
    const newAdmin = {
      ...admin,
      id: `ADMIN${admins.value.length + 1}`,
      status: 'active'
    }
    admins.value.push(newAdmin)
    return newAdmin
  }

  const updateAdmin = (adminId, updates) => {
    const index = admins.value.findIndex(a => a.id === adminId)
    if (index !== -1) {
      admins.value[index] = { ...admins.value[index], ...updates }
    }
  }

  const deleteAdmin = (adminId) => {
    const index = admins.value.findIndex(a => a.id === adminId)
    if (index !== -1) {
      admins.value.splice(index, 1)
    }
  }

  // 用户操作
  const addUser = (user) => {
    // 检查用户名是否已存在
    if (users.value.some(u => u.username === user.username)) {
      throw new Error('用户名已存在')
    }
    
    const newUser = {
      ...user,
      id: `USER${users.value.length + 1}`,
      accountBalance: user.initialBalance || 0,
      chargingHistory: [],
      rechargeRecords: []
    }
    users.value.push(newUser)
    return newUser
  }

  // 用户充值
  const rechargeUser = (userId, amount, method = 'alipay') => {
    const user = users.value.find(u => u.id === userId)
    if (!user) {
      throw new Error('用户不存在')
    }

    // 添加充值记录
    const rechargeRecord = {
      id: `RECHARGE${user.rechargeRecords.length + 1}`,
      amount,
      date: new Date(),
      method
    }
    user.rechargeRecords.push(rechargeRecord)

    // 更新账户余额
    user.accountBalance += amount

    return rechargeRecord
  }

  // 计算属性
  const activeAdmins = computed(() => 
    admins.value.filter(admin => admin.status === 'active')
  )

  const totalUsers = computed(() => users.value.length)
  const totalAdmins = computed(() => admins.value.length)

  return {
    // 数据
    admins,
    users,

    // 管理员方法
    addAdmin,
    updateAdmin,
    deleteAdmin,
    activeAdmins,

    // 用户方法
    addUser,
    rechargeUser,

    // 统计
    totalUsers,
    totalAdmins
  }
})
