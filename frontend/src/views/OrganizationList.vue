<template>
  <div>
    <h3>조직관리</h3>

    <!-- 액션 버튼 -->
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="openCreateDialog">조직 등록</el-button>
      <el-button type="danger" @click="deleteSelected" :disabled="!selectedRows.length">선택 삭제</el-button>
    </div>

    <!-- 데이터 테이블 -->
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="org_code" label="조직코드" width="120" />
      <el-table-column prop="org_name" label="조직명" width="200" />
      <el-table-column prop="org_type" label="조직유형" width="100">
        <template #default="scope">
          {{ getOrgTypeText(scope.row.org_type) }}
        </template>
      </el-table-column>
      <el-table-column prop="is_active" label="활성화" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.is_active ? 'success' : 'danger'">
            {{ scope.row.is_active ? '활성' : '비활성' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="생성일시" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="작업" width="150">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">수정</el-button>
          <el-button size="small" type="danger" @click="deleteOne(scope.row)">삭제</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 등록/수정 다이얼로그 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="조직코드">
          <el-input v-model="formData.org_code" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="조직명">
          <el-input v-model="formData.org_name" />
        </el-form-item>
        <el-form-item label="조직유형">
          <el-select v-model="formData.org_type" style="width: 100%">
            <el-option label="본부" value="head" />
            <el-option label="부서" value="dept" />
            <el-option label="지점" value="branch" />
          </el-select>
        </el-form-item>
        <el-form-item label="활성화" v-if="isEdit">
          <el-switch v-model="formData.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">취소</el-button>
        <el-button type="primary" @click="handleSubmit">확인</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { organizationApi } from '../api'

const tableData = ref([])
const selectedRows = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formData = ref({
  org_code: '',
  org_name: '',
  org_type: 'dept',
  is_active: true
})

// 조직 목록 조회
const fetchData = async () => {
  try {
    const response = await organizationApi.getAll()
    tableData.value = response.data.data
  } catch (error) {
    ElMessage.error('조직 목록 조회 실패')
  }
}

// 조직 등록 다이얼로그
const openCreateDialog = () => {
  isEdit.value = false
  dialogTitle.value = '조직 등록'
  formData.value = { org_code: '', org_name: '', org_type: 'dept', is_active: true }
  dialogVisible.value = true
}

// 조직 수정 다이얼로그
const openEditDialog = (row) => {
  isEdit.value = true
  dialogTitle.value = '조직 수정'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 조직 등록/수정 처리
const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await organizationApi.update(formData.value.org_code, formData.value)
      ElMessage.success('조직이 수정되었습니다')
    } else {
      await organizationApi.create(formData.value)
      ElMessage.success('조직이 등록되었습니다')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('처리 실패')
  }
}

// 조직 삭제 (단일)
const deleteOne = async (row) => {
  try {
    await ElMessageBox.confirm('정말 삭제하시겠습니까?', '확인', {
      type: 'warning'
    })
    await organizationApi.delete(row.org_code)
    ElMessage.success('조직이 삭제되었습니다')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('삭제 실패')
    }
  }
}

// 조직 삭제 (선택)
const deleteSelected = async () => {
  try {
    await ElMessageBox.confirm(`${selectedRows.value.length}개 조직을 삭제하시겠습니까?`, '확인', {
      type: 'warning'
    })
    for (const row of selectedRows.value) {
      await organizationApi.delete(row.org_code)
    }
    ElMessage.success('선택된 조직이 삭제되었습니다')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('삭제 실패')
    }
  }
}

// 선택 변경
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 조직유형 텍스트
const getOrgTypeText = (type) => {
  const typeMap = { head: '본부', dept: '부서', branch: '지점' }
  return typeMap[type] || type
}

// 날짜 포맷
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('ko-KR')
}

onMounted(() => {
  fetchData()
})
</script>
