import { defineStore } from "pinia";
import { isNaN } from "lodash-es";


export const useDrawer = defineStore('drawer', {
  state: () => ({
    visible: false,
    currentComponent: '',
    width: 256
  }),
  actions: {
    updateDrawerVisible (visible) {
      this.visible = visible
    },
    setCurrentComponent ({ current, width = 256 }) {
      this.currentComponent = current
      this.width = !isNaN(width) ? width : 256
    }
  }
})
