import { onMounted, reactive, ref } from 'vue'
import { getMyCourse } from "@/api/classroom";

export const useList = () => {
  const lists = ref([])
  const isLoading = ref(false)
  const totalPage = ref(0)
  const isEmpty = ref(false)
  const requestPages = reactive({
    page: 1,
    per_page: 15
  })

  const onFetchData = async (reset = false) => {
    if (reset) {
      lists.value = [];
      requestPages.page = 1;
      totalPage.value = 0;
      isEmpty.value = false;
    }

    if (isLoading.value || (requestPages.page > totalPage.value && totalPage.value !== 0) || isEmpty.value) return;
    if (requestPages.page === 1) {
      isLoading.value = true;
    }


    try {
      const { data: { data: { data, total_page } } } = await getMyCourse(requestPages)
      lists.value = [...lists.value, ...data];
      totalPage.value = total_page
      isEmpty.value = total_page === 0;
      requestPages.page += 1;
    } catch (e) {
      console.error(e)
      lists.value = [];
      requestPages.page = 1;
      totalPage.value = 0;
      isEmpty.value = false;
    } finally {
      isLoading.value = false;
    }
  }

  const resetList = async () => {
    try {
      await onFetchData(true);
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(async () => {
    try {
      await onFetchData()
    } catch (e) {
      console.error(e)
    }
  })


  return {
    isLoading,
    lists,
    onFetchData,
    resetList
  }
}
