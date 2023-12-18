import { computed, defineComponent, watch } from 'vue';
import { VBtn, VCard, VCardActions, VCardSubtitle, VCardTitle, VDialog, VIcon, VSpacer } from "vuetify/components";

export const ConfirmModal = defineComponent({
  name: 'AppConfirmModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  emits: [
    'ok',
    'cancel',
    'update:modelValue'
  ],
  setup (props, { emit }) {

    const showConfirm = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })
    const handleOk = () => {
      emit('ok')
    }

    const handleCancel = () => {
      emit('cancel')
    }

    watch(() => showConfirm.value, (state) => {
      if (!state) {
        emit('cancel')
      }
    })

    return () => (
      (
        <VDialog
          v-model={ showConfirm.value }
        >
          <VCard
            class={ 'mx-auto' }
            width={ 504 }
          >
            <VCardTitle class={ 'd-flex ga-2 align-center' }>
              <VIcon
                icon={ 'mdi-alert-circle-outline' }
                color={ 'warning' }
              />
              { props.title }
            </VCardTitle>
            <VCardSubtitle>
              { props.content }
            </VCardSubtitle>
            <VCardActions>
              <VSpacer/>
              <VBtn onClick={ () => showConfirm.value = false }>
                取消
              </VBtn>
              <VBtn
                color={ 'primary' }
                variant={ 'elevated' }
                onClick={ handleOk }
              >
                确定
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>

      )
    )
  }
})
