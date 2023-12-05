<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { artDelChannelService } from '../../api/article'
const channelList = ref([])

const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // console.log(channelList.value)
  loading.value = false
}

getChannelList()

const onEditChannel = (row, $index) => {
  dialog.value.open(row, $index)
}

const onDelChannel = (row) => {
  // dialog.value.open(row)
  ElMessageBox.confirm('你是否删除文章分类?', '是否删除', {
    conifrmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await artDelChannelService(row.id)
    getChannelList()
  })
}

const onAddChannel = () => {
  dialog.value.open({})
}

const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel()" type="primary">添加分类</el-button>
    </template>

    <el-table
      v-loading="loading"
      :data="channelList"
      style="width: 100%"
      stripe="true"
    >
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            @click="onEditChannel(row, $index)"
            type="primary"
            circle
            plain
          ></el-button>
          <el-button
            :icon="Delete"
            @click="onDelChannel(row, $index)"
            type="danger"
            circle
            plain
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无分类"></el-empty>
      </template>
    </el-table>

    <channel-edit ref="dialog" @success="onSuccess()"></channel-edit>
  </page-container>
</template>
