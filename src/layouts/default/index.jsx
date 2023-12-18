import { computed, defineComponent } from "vue";
import { VApp, VMain } from 'vuetify/components';
import Navigator from "@/layouts/default/Navigator.vue";
import AppBar from '@/components/AppBar/index.vue';
import { useRoute } from "vue-router";


const layouts = defineComponent({
  id: 'default-layout',
  name: 'DefaultLayout',
  setup: function(props, { slots }) {
    const route = useRoute();
    const hideHeader = computed(() => {
      return route.meta.hideAppBar
    })


    return () => (
      <VApp id={ 'goal-go-app' }>
        <Navigator/>
        { !hideHeader.value && <AppBar/> }
        <VMain class="goal-go-main">
          { slots.default ? slots.default() : null }
        </VMain>
      </VApp>
    )
  }
})


export default layouts;
