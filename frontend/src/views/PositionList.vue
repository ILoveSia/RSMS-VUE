<template>
  <div>
    <h3>직책관리</h3>

    <!-- 액션 버튼 -->
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="openCreateDialog">직책 등록</el-button>
      <el-button type="danger" @click="deleteSelected" :disabled="!selectedRows.length">선택 삭제</el-button>
    </div>

    <!-- 데이터 테이블 -->
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="position_id" label="ID" width="80" />
      <el-table-column prop="position_code" label="직책코드" width="120" />
      <el-table-column prop="position_name" label="직책명" width="150" />
      <el-table-column prop="org_name" label="소속조직" width="150" />
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
        <el-form-item label="직책코드">
          <el-input v-model="formData.position_code" />
        </el-form-item>
        <el-form-item label="직책명">
          <el-input v-model="formData.position_name" />
        </el-form-item>
        <el-form-item label="소속조직">
          <el-select v-model="formData.org_code" style="width: 100%">
            <el-option
              v-for="org in orgOptions"
              :key="org.org_code"
              :label="org.org_name"
              :value="org.org_code"
            />
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
import { positionApi, organizationApi } from '../api'

const tableData = ref([])
const selectedRows = ref([])
const orgOptions = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formData = ref({
  position_code: '',
  position_name: '',
  org_code: null,
  is_active: true
})

// 직책 목록 조회
const fetchData = async () => {
  try {
    const response = await positionApi.getAll()
    tableData.value = response.data.data
  } catch (error) {
    ElMessage.error('직책 목록 조회 실패')
  }
}

// 조직 목록 조회 (Select 옵션용)
const fetchOrganizations = async () => {
  try {
    const response = await organizationApi.getAll()
    orgOptions.value = response.data.data
  } catch (error) {
    ElMessage.error('조직 목록 조회 실패')
  }
}

// 직책 등록 다이얼로그
const openCreateDialog = () => {
  isEdit.value = false
  dialogTitle.value = '직책 등록'
  formData.value = { position_code: '', position_name: '', org_code: null, is_active: true }
  dialogVisible.value = true
}

// 직책 수정 다이얼로그
const openEditDialog = (row) => {
  isEdit.value = true
  dialogTitle.value = '직책 수정'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 직책 등록/수정 처리
const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await positionApi.update(formData.value.position_id, formData.value)
      ElMessage.success('직책이 수정되었습니다')
    } else {
      await positionApi.create(formData.value)
      ElMessage.success('직책이 등록되었습니다')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('처리 실패')
  }
}

// 직책 삭제 (단일)
const deleteOne = async (row) => {
  try {
    await ElMessageBox.confirm('정말 삭제하시겠습니까?', '확인', {
      type: 'warning'
    })
    await positionApi.delete(row.position_id)
    ElMessage.success('직책이 삭제되었습니다')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('삭제 실패')
    }
  }
}

// 직책 삭제 (선택)
const deleteSelected = async () => {
  try {
    await ElMessageBox.confirm(`${selectedRows.value.length}개 직책을 삭제하시겠습니까?`, '확인', {
      type: 'warning'
    })
    for (const row of selectedRows.value) {
      await positionApi.delete(row.position_id)
    }
    ElMessage.success('선택된 직책이 삭제되었습니다')
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

// 날짜 포맷
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('ko-KR')
}

onMounted(() => {
  fetchData()
  fetchOrganizations()
})
</script>
