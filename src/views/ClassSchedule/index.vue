<script setup>
import { computed, h, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { VChip } from "vuetify/components"
import CommonContent from '@/components/CommonContent';
import Bottom from '@/components/AppBottom';
import { usePack } from "./usePack";
import AppEmpty from "@/components/AppEmpty/index.vue";

const router = useRouter();
const isBottom = ref(false);
const showModal = ref(false);

const {
  packList,
  fetchPackage,
  courses,
  fetchCourse,
  isLoading,
  current_pack,
  setCourse
} = usePack()

const cols = computed(() => {
  return 4
})

const onClickPack = ({ pack_no }) => {
  try {
    fetchCourse(pack_no)
  } catch (error) {
    console.error('Error fetching pack details:', error);
  }
}

const handleCreatePack = () => {
  router.push({
    path: '/create-pack'
  })
}

const handleRefresh = () => {
  const pack_no = current_pack.pack_no
  onClickPack({
    pack_no
  })
}


const handleModalSubmit = async params => {
  try {
    current_pack.newList = params;
    showModal.value = false
    await setCourse()
  } catch (e) {
    console.error(e)
  }
}

const hasCourse = computed(() => {
  return packList.value.length !== 0
})

watch(isBottom, newData => {
  if (newData) {
    fetchPackage()
  }
})

const ChipsOfState = ({ state }) => {
  return h(VChip, {
    size: 'small',
    label: true
  }, () => state)
}

</script>

<template>
  <div
      v-if="hasCourse"
      class="class-schedule-wrapper"
  >
    <div class="class-schedule-nav">
      <v-list-item
          class="class-fixed-bar"
          height="64"
      >
        <span class="text-h6">
          课程列表
        </span>
      </v-list-item>
      <v-list
          class="pa-2 class-schedule-nav-list"
          lines="three"
      >
        <v-list-item
            v-for="(item, index) in packList"
            :key="index"
            :link="true"
            border
            class="mb-4"
            rounded="lg"
            @click="onClickPack(item)"
        >
          <v-list-item-title
              class="d-flex justify-space-between align-center"
          >
            <h3>{{ item.title }}</h3>
            <ChipsOfState
                :state="item.status"
            />
          </v-list-item-title>

          <div class="text-subtitle-1">
            {{ item.description }}
          </div>
          <v-list-item-subtitle>
            {{ item.create_time }}
          </v-list-item-subtitle>
        </v-list-item>
        <Bottom v-model="isBottom"/>
      </v-list>
    </div>
    <main class="class-schedule-main">
      <v-toolbar
          color="#010101"
          scroll-behavior="elevate"
      >
      </v-toolbar>
      <v-container>
        <CommonContent
            :cards="courses"
            :cols="cols"
            :loading="isLoading"
            @refresh="handleRefresh"
            @submit="handleModalSubmit"
        />
      </v-container>
    </main>
  </div>
  <v-sheet
      v-else
      class="d-flex align-center justify-center flex-column"
      height="100%"
      style="gap: 16px;"
  >
    <AppEmpty format="boy"/>
    <v-btn
        color="primary"
        @click="handleCreatePack"
    >
      <v-icon icon="mdi-plus"></v-icon>
      创建课程包
    </v-btn>
  </v-sheet>


</template>

<style lang="scss" scoped>
.class-schedule-wrapper {
  width: 100%;
  display: flex;
}

.class-schedule-main {
  width: 100%;
}

.class-schedule-nav {
  width: 320px;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.class-schedule-nav-list {
  height: calc(100vh - 64px);
  //background-color: #010101;
  border-right: 1px solid #2B3038;
}

.class-fixed-bar {
  position: sticky;
}
</style>
