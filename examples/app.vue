<template>
  <div class="template-container">
    <w-schema-form :configs="configs" :source="source" :globalConfigs="globalConfigs">
      <template #slotInput>
        <t-input size="large" v-model="source.slotInput"></t-input>
      </template>
      <template #submitBtn>
        <t-button type="submit" size="large" block>提交</t-button>
      </template>
    </w-schema-form>
    <div class="source">
      {{ source }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { schemaTransfer } from "../packages/index";
const globalConfigs = ref({
  colSettings: {
    span: 12,
  },
});
const configs = computed(() => {
  return [
    {
      component: "t-input",
      label: "输入框",
      props: {
        size: "large",
        placeholder: "请输入",
      },
      model: "tInput",
      type: "string",
      rules: [
        {
          required: true,
        },
      ],
    },
    {
      component: "t-date-picker",
      label: "日期选择器",
      props: {
        size: "large",
        class: "custom-date-picker",
      },
      model: "tDatePicker",
      type: "string",
    },
    {
      component: "slot",
      label: "插槽输入框",
      model: "slotInput",
      type: "string",
    },
  ];
});
const source = ref(schemaTransfer(configs.value));
</script>

<style lang="less" scoped>
.template-container {
  width: 50%;
  margin: 0 auto;
  :deep(.custom-date-picker) {
    width: 100%;
    .t-input {
      height: 40px;
    }
  }
  .source {
    background: #1c1c1c;
    margin-top: 30px;
    padding: 30px;
    border-radius: 8px;
    color: #fff;
    word-break: break-all;
    &::before {
      content: "数据";
      display: block;
      margin-bottom: 10px;
      color: #a1a1a1;
      font-size: 14px;
    }
  }
}
</style>
