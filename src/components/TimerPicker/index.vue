<script setup>
import DatePicker from 'vue-datepicker-next';
import './datepicker.scss';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'date'
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss'
  },
})

const emit = defineEmits(['update:value'])

const time = computed({
  get: () => {
    return props.value
  },
  set: val => {
    emit('update:value', val)
  }
});


</script>

<template>
  <date-picker
    v-model:value="time"
    :format="props.format"
    :type="props.type"
    :value-type="props.format"
    class="time-picker"
    placeholder="请填写时间"
    style="width: 100%;"
  >
  </date-picker>
</template>


<style lang="scss" scoped>
.time-picker {
  :deep(.mx-input) {
    background-color: #010101;
    height: auto;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);
    border: 1px solid #424242;
    border-radius: 6px;
  }
}

</style>
