<script lang="ts" setup>
  import apiTokens from '@/axios/axiosToken'

  const users = ref<[]>([])

  const getUsers = async () => {
    const response = await apiTokens.get('people')
    users.value = response.data
  }
  onMounted(getUsers)
</script>

<template>
  <v-container /></template>
