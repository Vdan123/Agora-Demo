<script setup>

const rawData = [
  {
    label: '手机绑定',
    type: 'button-group',
    options: [
      {
        label: '修改密码',
        value: 0
      },
      {
        label: '更改绑定',
        value: 1
      }
    ]
  },
  // {
  //   label: '主题选择',
  //   type: 'radio-group',
  //   options: [
  //     {
  //       label: '浅色',
  //       value: 0,
  //     },
  //     {
  //       label: '深色',
  //       value: 1,
  //     }
  //   ]
  // }
]


const settingLists = []
</script>


<template>
  <v-card>
    <v-card-title>
      更多设置
    </v-card-title>
    <v-card-subtitle class="pb-4">
      绑定账户、银行卡、服务集成等
    </v-card-subtitle>
    <v-divider
      class="border-opacity-75"
    />
    <v-card-item>
      <v-list>
        <v-list-item
          v-for="(item, index) in settingLists"
          :key="index"
          :title="item.label"
        >
          <template v-slot:append>
            <component
              :is="item.component"
              v-bind="item.props"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-card-item>
  </v-card>
</template>


<style scoped>

</style>
