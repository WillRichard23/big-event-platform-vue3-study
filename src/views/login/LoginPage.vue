<script setup>
import { userRegisterService, userLoginService } from '@/api/user'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const isRegister = ref(false)
const remenberMe = ref(false)
const isLoading = ref(false)
const form = ref()
const ruleForm = ref({
  username: '',
  password: '',
  repassword: ''
})
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入二次密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== ruleForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const register = async () => {
  await form.value.validate()
  const res = await userRegisterService(ruleForm.value)
  console.log(res)
  isLoading.value = true
  if (res.status === 200) {
    ElMessage.success(res.data.message)
    isRegister.value = false
  } else {
    ElMessage.error(res.error.message)
  }
}

const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  await form.value.validate()
  isLoading.value = true
  const res = await userLoginService(ruleForm.value)
  console.log(res)
  if (res.status === 200) {
    if (remenberMe.value) {
      userStore.setLoginInfo('username', ruleForm.value.username)
      userStore.setLoginInfo('password', ruleForm.value.password)
    } else {
      userStore.removeLoginInfo()
    }
    userStore.setLoginInfo('remenberMe', remenberMe.value)
    userStore.setToken(res.data.token)
    ElMessage.success(res.data.message)
    router.push('/')
  } else {
    ElMessage.error(res.error.message)
  }
  isLoading.value = false
}

//忘记密码
const forgot = () => ElMessage('暂未实现')

// 注册登录切换监听
watch(isRegister, () => {
  ruleForm.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

onMounted(() => {
  ruleForm.value.username = userStore.loginInfo.username
  ruleForm.value.password = userStore.loginInfo.password
  remenberMe.value = userStore.loginInfo.remenberMe
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="background"></el-col>
    <el-col :span="6" :offset="3" class="login-form">
      <!-- 注册表单 -->
      <el-form
        ref="form"
        :model="ruleForm"
        :rules="rules"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="ruleForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="ruleForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请再次输入密码"
            v-model="ruleForm.repassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录表单 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox v-model="remenberMe">记住我</el-checkbox>
            <el-link @click="forgot" type="primary" :underline="false"
              >忘记密码？</el-link
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            :loading="isLoading"
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
      <div class="copyright">Copyright©拂晓之梦</div>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .background {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .copyright {
      width: 100%;
      color: #666;
      font-size: 16px;
      text-align: center;
      letter-spacing: 1px;
    }
  }
}
</style>
