<script setup>
import CardInfo from "@/components/CourseCard";
import Bottom from "@/components/AppBottom/index.vue";
import CourseInfoModal from "@/components/CourseInfoModal";
import { reactive, ref, watch } from "vue";
import { useCourse } from "@/composables/useCourse";
import { getCourseInfo } from "@/api/classroom";
import { formatTimeToFull } from "@/utils/tool";

const getDefaultFormState = () => {
  return {
    title: '',
    tags: [],
    start_time: '',
    end_time: '',
    students: [],
    attachments: [],
    cost: '0'
  };
}

const { tags } = useCourse();
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  cols: {
    type: [String, Number],
    default: 4
  },
  cards: {
    type: Array,
    default: () => ([])
  },
  noLayout: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'refresh',
  'loadMore',
  'submit'
])

const isBottom = ref(false)
const showModal = ref(false)
const showContent = ref(false)
const courseModalRef = ref(null)

const confirmForm = reactive(getDefaultFormState())

const handleMenuAction = async item => {
  let course;
  let students;
  const { action, data } = item;
  if (['details', 'edit', 'copy'].includes(action?.key)) {
    const { data: courseInfo } = await getCourseInfo(data?.course_no);
    ({
      course,
      students
    } = courseInfo.value?.data || {})
    showModal.value = true;
  }
  switch (action?.key) {
    case 'details':
      Object.assign(confirmForm, {
        ...course,
        students,
        start_time: formatTimeToFull(course?.start_time),
        end_time: formatTimeToFull(course?.end_time),
      });
      showContent.value = true;
      break
    case 'edit':
      Object.assign(confirmForm, {
        ...course,
        students: students.map(el => {
          return {
            name: el?.name,
            mobile: el?.mobile
          }
        }),
        start_time: formatTimeToFull(course?.start_time),
        end_time: formatTimeToFull(course?.end_time),
      });
      break
    case 'copy':
      Object.assign(confirmForm, {
        ...course,
        students,
        start_time: formatTimeToFull(course?.start_time),
        end_time: formatTimeToFull(course?.end_time),
        title: `${ course?.title }-副本`,
        course_no: 0
      });
      break
    case 'refresh':
      emits('refresh')
      break
    default:
      console.log('default...')
  }
}

const handleRestForm = () => {
  const defaultState = getDefaultFormState();
  Object.keys(confirmForm).forEach(key => delete confirmForm[key]);
  Object.assign(confirmForm, defaultState);
}


const handleCreate = () => {
  courseModalRef.value?.handleResetFields();
  handleRestForm();
  showModal.value = true
}

const handleModalSubmit = params => {
  emits('submit', {
    ...params,
    start_time: formatTimeToFull(params?.start_time),
    end_time: formatTimeToFull(params?.end_time),
  })
  showModal.value = false
}

watch(isBottom, isDown => {
  if (isDown) {
    emits('loadMore')
  }
})
watch(showModal, visible => {
  if (!visible) {
    showContent.value = false
  }
})

defineExpose({
  handleCreate
})
</script>

<template>
  <CardInfo
    v-if="props.cards.length"
    :cols="props.cols"
    :data="props.cards"
    :loading="props.loading"
    :noLayout="props.noLayout"
    @click:create="handleCreate"
    @menu-action="handleMenuAction"
  />
  <AppEmpty
    v-else
    class="mx-auto"
  />
  <Bottom
    v-model="isBottom"
  />


  <CourseInfoModal
    ref="courseModalRef"
    v-model="showModal"
    :data="confirmForm"
    :display-content="showContent"
    :loading="props.loading"
    :tags="tags"
    @click:submit="handleModalSubmit"
  />
</template>

<style lang="scss" scoped>

</style>
