<script setup>

const props = defineProps([
  'devices',
  'isDeviceAccessible',
  'currentDeviceID'
])

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (item) => {
  emit('change', item)
}
</script>

<template>
  {{ devices }}
  <v-select
    v-if="isDeviceAccessible"
    :items="props.devices"
    :model-value="currentDeviceID"
    density="compact"
    item-title="label"
    item-value="deviceId"
    variant="outlined"
    @update:modelValue="handleChange"
  >
  </v-select>
  <v-text-field
    v-else
    :disabled="true"
    model-value="未请开启权限"
    prepend-inner-icon="mdi-alert-circle-outline"
  />
</template>
<style scoped>

</style>
