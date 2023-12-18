import { computed, defineComponent, provide } from 'vue';
import { VOverlay } from 'vuetify/components';
import './style/index.scss';

export const AppDrawer = defineComponent({
  name: 'foo',
  props: {
    modelValue: {
      type: Boolean,
      default: null
    },
    width: {
      type: [Number, String],
      default: 256,
    },
  },
  emits: {
    'update:modelValue': () => true,
  },
  setup (props, { emit, slots }) {
    const isActive = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const layoutItemStyles = computed(() => {
      return {
        width: `${ props.width }px`
      }
    })

    // 提供一个方法供子组件调用以关闭抽屉
    provide('closeDrawer', () => {
      isActive.value = false;
    });

    return () => (
      <VOverlay
        class={ 'app-drawer' }
        v-model={ isActive.value }
      >
        <div
          class={ 'app-drawer-content' }
          style={
            [
              layoutItemStyles.value
            ]
          }
        >
          { slots.default ? slots.default() : null }
        </div>
      </VOverlay>
    )
  }
})
