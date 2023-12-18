import { defineComponent, ref, watch } from 'vue';
import {
  VBtn,
  VCard,
  VCardActions,
  VCardItem,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VIcon,
  VList,
  VListItem,
  VMenu,
  VRow,
  VSheet,
  VSkeletonLoader,
  VSpacer
} from "vuetify/components";
import { useCourse } from "@/composables/useCourse";
import AppConfirmModal from "@/components/AppConfirmModal";
import { cancelCourse, deleteMyCourse, getRoomToken } from "@/api/classroom";
import { delay, isTeacher } from "@/utils/tool";
import './style/index.scss';
import moment from "moment";
import { setSession } from "@/utils/sessionStorage";
import { getLocal } from "@/utils/localStorage";
import { useSnackbar } from "@/store/snackbar";

const MIN_HEIGHT = 226;

const { showSnackbar } = useSnackbar();

const menus = [
  {
    key: 'details',
    label: '查看详情'
  },
  {
    key: 'edit',
    label: '修改课程'
  },
  {
    key: 'copy',
    label: '复制课程'
  },
  {
    key: 'cancel',
    label: '取消课程'
  },
  {
    key: 'delete',
    label: '删除',
  }
]

const { chipStates } = useCourse();
const ChipsOfState = ({ state }) => {
  const { color, msg } = chipStates.value[state];
  return (
    <VChip
      color={ color }
      label
      size={ 'small' }
    >
      <span class={ 'course-state-chip' }>
        { msg }
      </span>
    </VChip>
  )
}

const ChipsOfLabel = ({ tags }) => {
  if (!Array.isArray(tags)) return
  const lists = tags.map(el =>
    <VChip
      key={ el }
      label
      class={ 'mr-1' }
      size={ 'small' }
    >
      { el }
    </VChip>
  )
  return (
    <div class={ 'mt-2 card-tags' }>
      { lists }
    </div>
  )
}


const LoadingData = () => {
  const lists = Array.from({ length: 4 }, (_, i) => (
    <VCol key={ i }>
      <VSkeletonLoader type={ 'card' }/>
    </VCol>
  ))
  return (
    <VRow>
      { lists }
    </VRow>
  )
}


const Content = ({ data, onMenuAction, cols, onClickEmpty, noLayout }) => {
  const showTime = el => {
    if (!el || !el.start_time || !el.end_time) {
      // 处理错误或异常情况
      return 'Invalid input';
    }

    const [startDate, startTime] = el.start_time.split(' ');
    const [endDate, endTime] = el.end_time.split(' ');

    // 检查日期格式，可选择更多的错误处理
    if (!startDate || !startTime || !endDate || !endTime) {
      return 'Invalid date format';
    }

    const transferDate = moment(startDate, 'YY-MM-DD').format('MM月DD日')

    return `${ transferDate } ${ startTime }-${ endTime }`;
  }


  const getButtonLabel = (state) => {
    switch (state) {
      case 'ready':
        return {
          label: '即将开始',
          color: '#555555',
          fn: (el) => onMenuAction({
            key: 'start'
          }, el)
        };
      case 'start':
      case 'delay':
        return {
          label: '进入课堂',
          color: 'primary',
          fn: (el) => onMenuAction({
            key: 'start'
          }, el)
        };
      case 'close':
        return {
          label: '已关闭',
          color: '#555555',
          disabled: true,
          fn: () => {

          }
        };
      case 'finish':
        return {
          label: '回放',
          color: '#555555',
          fn: () => {
            showSnackbar({
              message: '暂无回放内容',
              color: 'warning'
            })
          }
        };
      default:
        return '';
    }
  }

  const renderButton = ({ el }) => {
    const { label, color, disabled, fn } = getButtonLabel(el.state);
    if (!label) {
      return null;
    }

    return (
      <VBtn
        variant={ 'elevated' }
        color={ color }
        disabled={ disabled }
        onClick={ () => fn(el) }
      >
        { label }
      </VBtn>
    )
  }

  const lists = data.map((el, key) => {
    if (noLayout) {
      return (
        <div>
          fll
        </div>
      )
    } else {
      return (
        <VCol
          key={ key }
          cols={ cols }
          class={ 'pa-2' }
        >
          <VCard
            class={ 'goal-card' }
            min-height={ MIN_HEIGHT }
          >
            {
              el?.isEmpty ?
                (
                  <VCardItem
                    class={ 'goal-go-pointer' }
                    style={ `height: ${ MIN_HEIGHT }px` }
                    onClick={ onClickEmpty }
                  >
                    <div class={ 'd-flex align-center justify-center flex-column' }>
                      <VIcon icon={ 'mdi-plus' }/>
                      <div class={ 'font-weight-black' }>
                        创建课程
                      </div>
                    </div>
                  </VCardItem>
                ) :
                <>
                  <VCardTitle class="d-flex align-center">
                    <ChipsOfState
                      state={ el.state }
                    />
                    <VBtn
                      size={ 'x-small' }
                      icon
                      variant={ 'flat' }
                      class={ 'ml-auto' }
                    >
                      <VIcon
                        icon={ 'mdi-dots-horizontal' }
                        size={ 24 }
                      />

                      <VMenu
                        activator={ 'parent' }
                        transition={ 'slide-y-transition' }
                      >
                        <VList
                          rounded={ 'lg' }
                          variant={ 'elevated' }
                          class={ 'pa-2' }
                          border
                        >
                          {
                            menus
                              .filter(menu => {
                                  const teacher = isTeacher(el?.teacher?.uid)
                                  if (teacher) {
                                    if (['close', 'finish'].includes(el.state)) {
                                      return ['delete', 'details'].includes(menu.key)
                                    } else if (el.state === 'start') {
                                      return ['details'].includes(menu.key)
                                    } else {
                                      return true
                                    }
                                  } else {
                                    return ['details'].includes(menu.key)
                                  }
                                }
                              )
                              .map((menu) =>
                                  <VListItem
                                    key={ menu.key }
                                    link
                                    variant={ 'flat' }
                                    rounded={ 'lg' }
                                    onClick={ () => onMenuAction(menu, el) }
                                  >
                            <span class={ menu.key === 'delete' ? 'text-error' : '' }>
                              { menu.label }
                            </span>
                                  </VListItem>
                              )
                          }
                        </VList>
                      </VMenu>
                    </VBtn>
                  </VCardTitle>
                  <VCardText>
                <span class="text-h5 d-inline-block font-weight-500">
                  { el.title }
                </span>
                    <div class={ 'card-timer' }>
                      { showTime(el) }
                    </div>
                    <ChipsOfLabel tags={ el.tags }/>
                  </VCardText>
                  <VCardActions>
                    <VSpacer/>
                    { renderButton({ el }) }
                  </VCardActions>
                </>
            }
          </VCard>
        </VCol>
      )
    }
  })
  return (
    <VRow
      no-gutters
      class={ 'ma-n2' }
    >
      { lists }
    </VRow>
  )
}

/**
 * 这里的样式待调整
 * **/
function NoData () {
  return (
    <VSheet border>
      暂无数据
    </VSheet>
  )
}

export const CardCourse = defineComponent({
  name: 'CardInfo',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => ([])
    },
    cols: {
      type: Number,
      default: 4
    },
    noLayout: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'menuAction',
    'click:create'
  ],
  setup (props, { emit }) {
    const showConfirm = ref(false);
    const confirmItems = ref({});
    watch(showConfirm, async visible => {
      if (!visible) {
        await delay(200);
        confirmItems.value = {};
      }
    });


    const handleOk = async () => {
      const { key, data: { course_no } } = confirmItems.value;
      if (key === 'cancel') {
        await cancelCourse(course_no);
      } else if (key === 'delete') {
        await deleteMyCourse(course_no);
      }

      showConfirm.value = false;
      emit('menuAction', {
        action: {
          key: 'refresh'
        }
      }); // 通知父组件
    };
    const handleMenuAction = async (action, data) => {
      if (action.key === 'cancel') {
        showConfirm.value = true;
        confirmItems.value = {
          key: 'cancel',
          data,
          title: '确认取消此课程?',
          content: '取消后将无法开课，课程记录可在课程列表查看'
        }
      } else if (action.key === 'delete') {
        showConfirm.value = true;
        confirmItems.value = {
          key: 'delete',
          data,
          title: '确认删除此课程?',
          content: '课程删除后无法恢复，请谨慎操作!'
        }
      } else if (action.key === 'start') {
        const { course_no, title, start_time, end_time } = data

        const format = 'YY-MM-DD HH:mm';
        const startTime = moment(start_time, format);
        const endTime = moment(end_time, format);
        const secondsDiff = endTime.diff(startTime, 'seconds');


        if (!course_no) return
        const { data: { data: { token, role, roomType } } } = await getRoomToken({ course_no })
        const { uid, name, mobile } = getLocal('userInfo')

        if (!token) return

        const classroomInfo = {
          userUuid: uid,
          userName: name || mobile || role,
          roomUuid: course_no,
          roleType: role === "teacher" ? 1 : 2,
          roomType: roomType ?? 2,
          roomName: title,
          rtmToken: token,
          duration: secondsDiff,
        }
        setSession('classroomInfo', classroomInfo)

        window.open('/live-classroom/index.html', '_blank')
        return
      }
      emit('menuAction', { action, data }); // 通知父组件
    };

    const handleCreate = () => {
      emit('click:create')
    }

    return () => (
      <>
        {
          props.loading ?
            <LoadingData/> :
            (
              props.data.length === 0 ?
                <NoData/> :
                <Content
                  noLayout={ props.noLayout }
                  cols={ props.cols }
                  data={ props.data }
                  onMenuAction={ handleMenuAction }
                  onClickEmpty={ handleCreate }
                />
            )
        }

        <AppConfirmModal
          v-model={ showConfirm.value }
          title={ confirmItems.value.title }
          content={ confirmItems.value.content }
          onOk={ handleOk }
        />
      </>
    )
  }
})
