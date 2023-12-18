<script setup>
import { UploadOutlined } from '@ant-design/icons-vue';
import { computed, inject } from "vue";
import { getLocal } from "@/utils/localStorage";
import { BASE_URL } from "@/api";
import { isArray } from "lodash-es";

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => ([])
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'update:modelValue',
  'update:loading'
])

const display = inject('display');

const fileList = computed({
  get () {
    console.log(props.modelValue, 'props.modelValue..')
    return isArray(props.modelValue) ? props.modelValue : JSON.parse(props.modelValue)
  },
  set (value) {
    emits('update:modelValue', value)
  }
})

const handleUpload = ({ fileList: list }) => {
  fileList.value = (list || []).map(el => {
    console.log(el, 'el...')
    if (el.status === 'done') {
      emits('update:loading', false)
      return {
        uid: el.uid,
        status: 'done',
        ...el?.response?.data
      }
    } else {
      emits('update:loading', true)
      return el
    }
  })
}

const headers = {
  token: getLocal('token')
}

const url = BASE_URL + '/file'

</script>

<template>
  <div class="d-flex align-center w-100">
    <a-upload
      v-if="!display"
      :action="url"
      :file-list="fileList"
      :headers="headers"
      :maxCount="15"
      :multiple="true"
      :show-upload-list="{ showDownloadIcon: true, showRemoveIcon: true }"
      accept=".ppt,.pptx,.pdf,.doc,.docx"
      class="w-100"
      name="file"
      @change="handleUpload"
    >
      <a-button class="ml-auto" size="small">
        <upload-outlined/>
        上传课件
      </a-button>
    </a-upload>
    <div v-else>
      foo
    </div>
  </div>
</template>


<style lang="scss" scoped>

</style>
