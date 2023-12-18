import { onMounted, reactive, ref } from 'vue'
import { getMyPackage, getMyPackDetails, setPackCourse } from "@/api/classroom";
import { createFormData } from "@/utils/tool";

export const usePack = () => {
  const packList = ref([])
  const courses = ref([])
  const current_pack = reactive({
    pack_no: '',
    pack: {},
    newList: {}
  })

  const isLoading = ref(false)
  const totalPage = ref(0)
  const requestPages = reactive({
    page: 1,
    per_page: 15
  })

  const fetchPackage = async (reset = false) => {
    if (reset) {
      packList.value = []
      requestPages.page = 1
      totalPage.value = 0
    }


    if (isLoading.value || requestPages.page > totalPage.value && totalPage.value !== 0) return;
    isLoading.value = true;
    try {
      const { data: { data: { data, total_page } } } = await getMyPackage(requestPages)
      console.log(data)
      packList.value = [...packList.value, ...data]

      totalPage.value = total_page

      // 检查是否是第一次加载，并且列表中至少有一个包
      if (requestPages.page === 1 && packList.value.length > 0) {
        const { pack_no } = packList.value[0]
        await fetchCourse(pack_no);
      }

      requestPages.page += 1;
    } catch (e) {
      console.error(e,)
    } finally {
      isLoading.value = false;
    }
  }

  const fetchCourse = async pack_no => {
    const { data: { data: { list, pack } } } = await getMyPackDetails(pack_no)
    Object.assign(current_pack, {
      pack_no: pack?.pack_no,
      pack
    })
    courses.value = [...list, { isEmpty: true }];
  }


  const setCourse = async () => {
    try {
      const { pack_no, pack, newList } = current_pack

      const formData = createFormData({
        description: pack.description,
        pack_no: pack.pack_no,
        title: pack.title,
        courses: [{
          ...newList,
          students: JSON.stringify(newList.students) || [], // 确保 students 存在，如果不存在则设为 []
          attachments: JSON.stringify(newList.attachments) || [], // 确保 attachments 存在，如果不存在则设为 []
          tags: JSON.stringify(newList.tags) || [],
          cost: 0,
          pack_no: pack_no,
          course_no: newList?.course_no ?? "0"
        }]
      })
      await setPackCourse({
        data: formData,
        pack_no
      })

      await fetchCourse(current_pack.pack_no)
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(async () => {
    await fetchPackage()
  })

  return {
    current_pack,
    isLoading,
    packList,
    courses,
    fetchPackage,
    fetchCourse,
    setCourse
  }
}
