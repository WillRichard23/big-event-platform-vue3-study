import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'

export const useUserStore = defineStore(
  'big-store',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }

    const loginInfo = ref({})
    const setLoginInfo = (key, value) => {
      loginInfo.value[key] = value
    }
    const removeLoginInfo = () => (loginInfo.value = {})

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser,
      loginInfo,
      setLoginInfo,
      removeLoginInfo
    }
  },
  {
    persist: true
  }
)
