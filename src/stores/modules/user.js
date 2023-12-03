import { defineStore } from 'pinia'
import { ref } from 'vue'

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

    const username = ref('')
    const setUsername = (newUsername) => {
      username.value = newUsername
    }
    const removeUsername = () => {
      username.value = ''
    }

    const password = ref('')
    const setPassword = (newPassword) => {
      password.value = newPassword
    }
    const removePassword = () => {
      password.value = ''
    }

    const remenberMe = ref('')
    const setRemenberMe = (newRemenberMe) => {
      remenberMe.value = newRemenberMe
    }
    const removeRemenberMe = () => {
      remenberMe.value = ''
    }
    return {
      token,
      setToken,
      removeToken,
      username,
      setUsername,
      removeUsername,
      password,
      setPassword,
      removePassword,
      remenberMe,
      setRemenberMe,
      removeRemenberMe
    }
  },
  {
    persist: true
  }
)
