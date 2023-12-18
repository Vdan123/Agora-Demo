import { computed, defineComponent } from "vue";
import { VApp, VAppBar, VMain } from "vuetify/components";
import Logo from "@/layouts/components/Logo.vue";
import { useRoute } from "vue-router";


function Header () {
  return (
    <VAppBar
      border
      scroll-behavior={ 'elevate' }
    >
      {
        {
          prepend: () => (
            <Logo/>
          )
        }
      }
    </VAppBar>
  )
}

const noNavigator = defineComponent({
  name: 'NoNavigator',
  setup (props, { slots }) {
    const route = useRoute();
    const hideHeader = computed(() => {
      return route.meta.hideAppBar;
    })

    return () => (
      <VApp id={ 'no-navigator' }>
        { !hideHeader.value && <Header/> }
        <VMain class={ 'h-screen goal-go-main' }>
          { slots?.default ? slots.default() : null }
        </VMain>
      </VApp>
    )
  }
})

export default noNavigator;
