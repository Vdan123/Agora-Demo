import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  VBtn,
  VCard,
  VCol,
  VContainer,
  VIcon,
  VResponsive,
  VRow,
  VSpacer,
  VToolbar,
  VToolbarTitle
} from "vuetify/components";
import './Dashboard.scss';
import CommonContent from "@/components/CommonContent";
import { useList } from "./useList";


import { setTemporaryCourse } from "@/api/classroom";
import { useVisibility } from "@/composables/useVisibility";
import { useRouter } from "vue-router";
import { useDisplay, useLayout } from "vuetify";


function Header ({ onVisible, onCreatePack, width }) {
  return (
    <VToolbar
      class={ 'dashboard-header' }
      style={ { width: width } }
    >
      <VToolbarTitle>
        直播课堂
      </VToolbarTitle>

      <VSpacer/>
      <div class={ 'd-flex ga-3 mr-4' }>
        <VBtn
          onClick={ onVisible }
          variant={ 'elevated' }
          color={ 'primary' }
        >
          发起课程
        </VBtn>
        <VBtn
          onClick={ onCreatePack }
          variant={ 'outlined' }
        >
          <VIcon icon={ 'mdi-plus' }/>
          创建课程包
        </VBtn>
      </div>
    </VToolbar>
  )
}

export const Dashboard = defineComponent({
  id: 'Dashboard',
  setup () {
    const router = useRouter();
    const CardInfoRef = ref(null);
    const {
      addVisibleListener,
      removeVisibleListener,
      isChromeTabActive
    } = useVisibility();

    const { width: layoutWidth, md, smAndDown, xs, xlAndUp } = useDisplay();
    const isBottom = ref(false);

    const { lists: cardData, isLoading, resetList, onFetchData } = useList();
    const cols = computed(() => {
      return smAndDown.value ?
        xs.value ? 12 : 6 :
        3
    })

    const filterCardData = computed(() => {
      return cardData.value.filter((item) => {
        return item.state !== 'start'
      })
    })
    const isStartCard = computed(() => {
      const startCards = cardData.value
        .filter((item) => {
          return item.state === 'start'
        })
        .sort((a, b) => {
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        })

      return startCards.slice(0, 1)
    })

    console.log(isStartCard, 'isStartCard..')

    const { mainRect } = useLayout();
    // 创建一个计算属性来动态计算 Toolbar 的宽度
    const toolbarWidth = computed(() => {
      return `calc(100% - ${ mainRect.value.left }px)`;
    });


    watch(isBottom, (newValue) => {
      if (newValue) {
        onFetchData(); // 当到达底部时调用 onFetchData
      }
    })

    watch(isChromeTabActive, (visible) => {
      console.log(visible, 'visible...')
      if (visible) {
        resetList()
      }
    })


    const handleCreate = () => {
      if (!CardInfoRef.value) return
      CardInfoRef.value.handleCreate()
    }

    const handleModalSubmit = async (params) => {
      try {
        await setTemporaryCourse({
          data: params,
          course_no: params?.course_no ?? 0
        });
        resetList()
      } catch (e) {
        console.log(e)
      }
    }


    const handleCreatePack = () => {
      router.push({
        name: 'CreatePack'
      })
    }


    onMounted(async () => {
      try {
        console.log('加载了')
        addVisibleListener()
      } catch (error) {
        console.error(`首页发生错误${ error }`)
      }
    })
    onUnmounted(removeVisibleListener);

    return () => (
      <>
        <Header
          width={ toolbarWidth.value }
          onVisible={ handleCreate }
          onCreatePack={ handleCreatePack }
        />
        <div class={ 'dashboard-content' }>
          <VContainer
            class={ 'd-flex flex-column ga-2' }
          >
            <VRow>
              <VCol cols={ cols.value }>
                {
                  isStartCard.value.length > 0 ?
                    (
                      <CommonContent
                        ref={
                          (el) => {
                            CardInfoRef.value = el
                          }
                        }
                        noLayout={ true }
                        cards={ isStartCard.value }
                        loading={ isLoading.value }
                        onRefresh={ resetList }
                        onLoadMore={ onFetchData }
                        onSubmit={ handleModalSubmit }
                      />
                    ) :
                    (<VCard
                        height={ '208px' }
                      >
                        <VContainer class={ 'h-100 d-flex align-center justify-center' }>
                    <span
                      class={ 'text-h6' }
                      style={ { color: '#A7A7A7' } }
                    >
                      今日暂无课程
                    </span>
                        </VContainer>
                      </VCard>
                    )
                }
              </VCol>
            </VRow>

            <VResponsive
              width={ '100%' }
              height={ '28px' }
            />

            <div class={ 'd-flex align-center justify-space-between' }>
              <div class={ 'text-h5 font-weight-bold' }>
                我的课程
              </div>
            </div>

            {
              <CommonContent
                ref={
                  (el) => {
                    CardInfoRef.value = el
                  }
                }
                cards={ filterCardData.value }
                cols={ cols.value }
                loading={ isLoading.value }
                onRefresh={ resetList }
                onLoadMore={ onFetchData }
                onSubmit={ handleModalSubmit }
              />
            }
          </VContainer>
        </div>
      </>
    )
  }
})
