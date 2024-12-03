<template>
  <div class="login-container">
    <div class="login-box">
      <h2>充电桩管理系统</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      // 这里添加实际的登录逻辑
      localStorage.setItem('token', 'demo-token')
      ElMessage.success('登录成功')
      router.push('/')
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.login-box {
  width: 380px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 4px 8px rgba(0, 0, 0, 0.02),
    0 8px 16px rgba(0, 0, 0, 0.02),
    0 16px 32px rgba(0, 0, 0, 0.02);
  animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

h2 {
  text-align: center;
  margin-bottom: 35px;
  color: #1d1d1f;
  font-size: 27px;
  font-weight: 500;
  letter-spacing: -0.5px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  background: rgba(0, 0, 0, 0.02) !important;
  border: none !important;
  border-radius: 12px !important;
  height: 44px;
  box-shadow: none !important;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

:deep(.el-input__wrapper:hover) {
  background: rgba(0, 0, 0, 0.04) !important;
}

:deep(.el-input__wrapper.is-focus) {
  background: rgba(0, 0, 0, 0.05) !important;
  box-shadow: inset 0 0 0 1px #0066cc !important;
}

:deep(.el-input__inner) {
  color: #1d1d1f !important;
  font-size: 16px !important;
  height: 44px !important;
  line-height: 44px !important;
}

:deep(.el-input__inner::placeholder) {
  color: #86868b !important;
  font-size: 16px;
}

:deep(.el-button--primary) {
  background: #0066cc;
  border: none;
  height: 44px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

:deep(.el-button--primary:hover) {
  background: #0077ed;
  transform: translateY(-1px);
}

:deep(.el-button--primary:active) {
  background: #0055b3;
  transform: translateY(0);
}

:deep(.el-icon) {
  color: #86868b;
  font-size: 16px;
}

/* 添加苹果风格的装饰元素 */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 错误提示样式 */
:deep(.el-form-item__error) {
  color: #ff3b30;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 4px;
}
</style>
