<template>
  <div class="app-container">
    <eHeader :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" ref="table" :data="data" size="small" style="width: 100%;">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="oldName" label="原文件名"/>
      <el-table-column prop="fileType" label="文件类型">
        <template slot-scope="scope">
          <div v-for="item in file_type" :key="item.id">
            <span v-if="item.value==scope.row.fileType+''">{{ item.label }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="上传者"/>
      <el-table-column ref="table" :show-overflow-tooltip="true" prop="url" label="缩略图">
        <template slot-scope="scope">
          <a :href="scope.row.url" style="color: #42b983" target="_blank"><img :src="scope.row.url" alt="点击打开" class="el-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="文件大小"/>
      <el-table-column prop="url" label="文件地址"/>
      <el-table-column prop="height" label="高度"/>
      <el-table-column prop="width" label="宽度"/>
      <el-table-column width="180px" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PICTURE_ALL','PICTURE_DELETE'])" label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { get } from '@/api/dictDetail'
import initData from '@/mixins/initData'
import { del } from '@/api/picture'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
export default {
  components: { eHeader },
  mixins: [initData],
  data() {
    return {
      delLoading: false, sup_this: this
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getSelectData()
    })
  },
  methods: {
    getSelectData() {
      get('file_type').then(res => {
        this.file_type = res.content
      })
    },
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/file'
      const sort = 'id,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      const fileType = query.fileType
      this.params = { page: this.page, size: this.size, sort: sort }
      if (fileType) { this.params['fileType'] = fileType }
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
