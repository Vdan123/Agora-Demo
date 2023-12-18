<script setup>
import { computed, provide, reactive, ref, watch } from "vue";
import { Form, theme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import Students from "./components/Students.vue";
import Files from "./components/Files.vue";
import { cloneDeep } from "lodash-es";
import moment from "moment";
import TimePicker from '@/components/TimerPicker/index.vue'

const useForm = Form.useForm;

const props = defineProps({
  modelValue: Boolean,
  tags: {
    type: Array,
    default: () => ([])
  },
  data: {
    type: Object,
    required: true,
    default: () => ({})
  },
  displayContent: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits([
  'update:modelValue',
  'click:submit'
])

const initForm = () => {
  return {
    title: '',
    tags: [],
    date: '',
    start_time: '',
    end_time: '',
    students: [],
    attachments: [],
    cost: '0',
  }
}

const form = reactive(initForm())

const rules = reactive({
  title: [
    {
      required: true,
      message: '请输入课程名称'
    }
  ],
  tags: [
    {
      required: true,
      message: '请选择课程类型'
    }
  ],
  date: [
    {
      required: true,
      message: '请选择上课日期'
    }
  ],
  start_time: [
    {
      required: true,
      message: '请选择上课时间'
    }
  ],
  end_time: [
    {
      required: true,
      message: '请选择下课时间'
    }
  ]
})

const activeWindow = ref(0);
const uploadLoading = ref(false);

const modalVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const display = computed(() => {
  return props.displayContent
})

provide('display', computed(() => props.displayContent));


const { validate, validateInfos, resetFields } = useForm(form, rules);
const handleOk = () => {
  if (display.value) {
    modalVisible.value = false
    return
  }
  validate()
    .then(() => {
      const params = {
        ...form,
        start_time: `${ form.date } ${ form.start_time }`,
        end_time: `${ form.date } ${ form.end_time }`
      }
      delete params.date
      emit('click:submit', params)
    })
    .catch(err => {
      console.log(err, 'err...')
    })
}

const handleCancel = () => {
  modalVisible.value = false
  resetFields()
}

const handleResetFields = () => {
  resetFields()
  const defaultState = initForm();
  Object.keys(form).forEach(key => delete form[key]);
  Object.assign(form, defaultState);
}

const disabledDate = current => {
  return current && current < moment().startOf('day');
};


watch(
  () => props.data,
  newData => {
    const cloneData = cloneDeep(newData)
    Object.assign(form, {
      ...cloneData,
      date: cloneData?.start_time && moment(cloneData?.start_time).format('YYYY-MM-DD') || '',
      start_time: cloneData?.start_time && moment(cloneData?.start_time).format('HH:mm:ss') || '',
      end_time: cloneData?.end_time && moment(cloneData?.end_time).format('HH:mm:ss') || ''
    });

    console.log(form, 'form..')
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  handleResetFields
})
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#F50000',
          colorPrimaryHover: '#FFFFFF',
        },
        components: {
          Button: {
            colorPrimaryHover: '#F50000',
          },
          Modal: {
            borderRadiusLG: '16px',
          },
        },
    }"
  >
    <a-modal
      v-model:open="modalVisible"
      :closable="false"
      :maskClosable="false"
      :maskStyle="{
        background: 'rgba(255,255, 255, 0.2)'
      }"
      :ok-button-props="{
        loading: props.loading || uploadLoading
      }"
      :width="969"
      cancel-text="取消"
      centered
      ok-text="确定"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-row :gutter="24">
        <a-col :span="12">
          <div class="modal-header">
            {{ display ? '课程详情' : (props.data?.course_no ? "编辑课程" : '添加课程') }}
          </div>
          <a-form
            layout="vertical"
          >
            <a-form-item
              label="课程名称"
              name="title"
              v-bind="validateInfos.title"
            >
              <a-input
                v-if="!display"
                v-model:value="form.title"
                placeholder="请输入课程名称"
                size="large"
              />
              <span v-else>
               {{ form.title }}
              </span>
            </a-form-item>
            <a-form-item
              label="课程类型"
              name="tags"
              v-bind="validateInfos.tags"
            >
              <a-select
                v-if="!display"
                v-model:value="form.tags"
                :showSearch="false"
                mode="multiple"
                placeholder="请选择课程类型"
                size="large"
              >
                <a-select-option value="思维拓展">
                  思维拓展
                </a-select-option>
                <a-select-option value="语言拓展">
                  语言拓展
                </a-select-option>
                <a-select-option value="其他">
                  其他
                </a-select-option>
              </a-select>
              <template v-else>
                <a-tag
                  v-for="(chip, index) in form.tags"
                  :key="index"
                  class="mr-2"
                >
                  {{ chip }}
                </a-tag>
              </template>
            </a-form-item>
            <a-form-item
              label="上课时间"
              required
            >
              <div
                v-if="!display"
                class="modal-timer"
              >
                <a-form-item
                  v-bind="validateInfos.date"
                >
                  <a-date-picker
                    v-model:value="form.date"
                    :disabledDate="disabledDate"
                    :locale="locale"
                    name="date"
                    size="large"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>

                <a-form-item
                  v-bind="validateInfos.start_time"
                >
                  <TimePicker
                    v-model:value="form.start_time"
                    format="HH:mm"
                    name="start_time"
                    type="time"
                  />
                </a-form-item>

                <a-form-item
                  v-bind="validateInfos.end_time"
                >
                  <TimePicker
                    v-model:value="form.end_time"
                    format="HH:mm"
                    name="end_time"
                    type="time"
                  />
                </a-form-item>
              </div>
              <div v-else>
                {{ form.date }} {{ form.start_time }} 至 {{ form.end_time }}
              </div>
            </a-form-item>
          </a-form>
        </a-col>

        <a-col :span="12">
          <a-tabs
            v-model:active-key="activeWindow"
          >
            <a-tab-pane
              :key="0"
              tab="学生"
            >
              <Students v-model="form.students"/>
            </a-tab-pane>
            <a-tab-pane
              :key="1"
              tab="课件"
            >
              <Files
                v-model="form.attachments"
                v-model:loading="uploadLoading"
              />
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-modal>
  </a-config-provider>
</template>

<style lang="scss" scoped>
.modal-header {
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 20px;
}

.modal-timer {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
