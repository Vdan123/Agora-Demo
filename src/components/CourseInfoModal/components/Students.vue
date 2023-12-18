<script setup>
import { computed, h, inject, ref } from "vue";
import { message } from 'ant-design-vue';

import { DeleteOutlined } from '@ant-design/icons-vue';

const MAX_STUDENTS_COUNT = 10;
const formRef = ref(null);

const display = inject('display');

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => ([])
  }
})

const emits = defineEmits([
  'update:modelValue',
  'addStudent'
])

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '电话',
    dataIndex: 'mobile',
    key: 'mobile',
  }
]


const tableData = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emits('update:modelValue', value)
  }
})


const onAddStudent = () => {
  if ((tableData.value.length + 1) > MAX_STUDENTS_COUNT) {
    message.error(`最多支持${MAX_STUDENTS_COUNT}名学生`)
    return
  }
  // 检查现有数据的合规性
  const isDataValid = tableData.value.every(student => student.name && student.mobile);
  if (!isDataValid) {
    message.error('请确保所有学生的姓名和手机号都已填写');
    return;
  }
  tableData.value.push({
    name: '',
    mobile: ''
  })
}

const onRemoveInfo = index => {
  tableData.value.splice(index, 1)
}

const handleClearAll = () => {
  tableData.value.length = 0;
};


</script>


<template>
  <div class="d-flex align-center ga-3 mb-4">
    <div class="text-subtitle-2">
      学生({{ tableData.length }}/{{ MAX_STUDENTS_COUNT }})
    </div>
    <a-space
        v-if="!display"
        class="ml-auto"
    >
      <a-button
          size="small"
          type="text"
          @click="handleClearAll"
      >
        清空
      </a-button>
      <a-button size="small" @click="onAddStudent">
        添加学生
      </a-button>
    </a-space>
  </div>
  <div class="students-container">
    <div v-if="!display">
      <a-form
          v-if="tableData.length"
          ref="formRef"
      >
        <a-form-item
            v-for="(user, index) in tableData"
            :key="index"
        >
          <div
              class="d-flex align-center ga-3"
          >
            <a-input
                v-model:value="user.name"
                name='name'
                placeholder="请填写学生姓名"

            />
            <a-input
                v-model:value="user.mobile"
                placeholder="请填写学生电话"
            />
            <a-button
                :icon="h(DeleteOutlined)"
                danger
                size="small"
                type="link"
                @click="onRemoveInfo(index)"
            >
            </a-button>
          </div>
        </a-form-item>
      </a-form>
      <div v-else class="students-empty">
      <span class="text-h6">
         添加学生加入此课程
      </span>
      </div>
    </div>
    <div v-else>
      <a-table
          :columns="columns"
          :dataSource="tableData"
          :pagination="false"
          :scroll="{ y: 240 }"
          size="small"
      />
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/styles/scrollbar.scss";

.students-container {
  @include fancy-scrollbar-mixin;
  height: 220px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.students-empty {
  height: 100%;
}
</style>
