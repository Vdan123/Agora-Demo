import { onMounted, ref } from 'vue';

const getWidgetName = widgetClass => {
  const Clz = widgetClass;
  return Object.create(Clz.prototype).widgetName;
};

export const useClassroomWidgets = ids => {
  const ready = ref(false);
  const widgets = ref({});

  onMounted(async () => {
    const loadedWidgets = {};
    if (ids.includes('FcrWebviewWidget')) {
      const {
        FcrWebviewWidget
      } = window;
      loadedWidgets[getWidgetName(FcrWebviewWidget)] = FcrWebviewWidget;
    }


    if (ids.includes('FcrBoardWidget')) {
      const {
        FcrBoardWidget
      } = window;
      loadedWidgets[getWidgetName(FcrBoardWidget)] = FcrBoardWidget;
    }

    if (ids.includes('AgoraHXChatWidget')) {
      const {
        AgoraHXChatWidget
      } = window;
      loadedWidgets[getWidgetName(AgoraHXChatWidget)] = AgoraHXChatWidget;
    }

    if (ids.includes('AgoraSelector')) {
      const {
        AgoraSelector
      } = window;
      loadedWidgets[getWidgetName(AgoraSelector)] = AgoraSelector;
    }

    if (ids.includes('AgoraCountdown')) {
      const {
        AgoraCountdown
      } = window;
      loadedWidgets[getWidgetName(AgoraCountdown)] = AgoraCountdown;
    }

    if (ids.includes('FcrStreamMediaPlayerWidget')) {
      const {
        FcrStreamMediaPlayerWidget
      } = window;
      loadedWidgets[getWidgetName(FcrStreamMediaPlayerWidget)] = FcrStreamMediaPlayerWidget;
    }

    if (ids.includes('AgoraPolling')) {
      const {
        AgoraPolling
      } = window;
      loadedWidgets[getWidgetName(AgoraPolling)] = AgoraPolling;
    }

    if (ids.includes('FcrWatermarkWidget')) {
      const {
        FcrWatermarkWidget
      } = window;
      loadedWidgets[getWidgetName(FcrWatermarkWidget)] = FcrWatermarkWidget;
    }

    widgets.value = loadedWidgets;
    ready.value = true;
  });

  return { ready, widgets };
};
