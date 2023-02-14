<template>
  <t-form
    v-bind="{ ...defaultGlobalConfigs.formSettings, ...globalConfigs?.formSettings }"
    :rules="rules"
    :data="componentVModel"
    @submit="submitForm"
    ref="form"
  >
    <t-row v-bind="{ ...defaultGlobalConfigs.rowSettings, ...globalConfigs?.rowSettings }">
      <t-col
        v-for="(item, index) in configs"
        :key="index"
        v-bind="{ ...defaultGlobalConfigs.colSettings, ...globalConfigs?.colSettings, ...item.colSettings }"
      >
        <t-form-item :name="item.model" v-if="evalFn(componentVModel, item?.dependence?.if)">
          <template #label>
            {{ item.label
            }}<t-tooltip :content="item.labelToolTips" placement="right" v-if="item.labelToolTips"
              ><t-icon name="help-circle" size="large" class="tips"></t-icon
            ></t-tooltip>
          </template>
          <component
            :is="item.component"
            v-bind="item.props"
            v-on="item.listener"
            v-model="componentVModel[item.model]"
            v-if="item.component != 'slot'"
          ></component>
          <slot v-if="item.component == 'slot'" :name="item.model" :item="item"></slot>
        </t-form-item>
      </t-col>
      <t-col
        :span="12"
        v-if="globalConfigs?.operationSlot ? globalConfigs.operationSlot : defaultGlobalConfigs.operationSlot"
      >
        <t-form-item>
          <slot name="submitBtn"></slot>
        </t-form-item>
      </t-col>
    </t-row>
  </t-form>
</template>

<script lang="ts">
import { renderRules, renderVModel, evalFn } from "./utils/wSchemaForm";
import { ref, watch, onMounted, defineComponent, PropType } from "vue";
import { defaultGlobalConfigs } from "./constants";
import { GLOBAL_CONFIGS_INTERFACE, SCHEMA_CONFIGS_INTERFACE } from "./interface";

export default defineComponent({
  name: "wSchemaForm",
  props: {
    globalConfigs: {
      type: Object as PropType<GLOBAL_CONFIGS_INTERFACE>,
      default: { ...defaultGlobalConfigs },
    },
    configs: {
      type: Array as PropType<Array<SCHEMA_CONFIGS_INTERFACE>>,
    },
    source: {
      type: Array,
    },
  },
  emits: ["submitForm", "exposeFormRef"],
  setup(props, ctx) {
    const form = ref();
    //校验规则
    const rules = ref({ ...renderRules(props.configs) });
    //组件响应式数据
    const componentVModel = ref({ ...renderVModel(props.configs, props.source) });

    // const emits = defineEmits<{
    //   (e: "submitForm", validateResult: any): void;
    //   (e: "exposeFormRef", formRef: any): void;
    // }>();

    /**
     * 提交表单
     */
    function submitForm({ validateResult, firstError }: any) {
      ctx.emit("submitForm", validateResult);
    }
    /**
     * 向外部暴露form对象
     */
    function exposeFormRef() {
      ctx.emit("exposeFormRef", form.value);
    }

    watch(
      () => props.source,
      (newV) => {
        rules.value = { ...renderRules(props.configs) };
        componentVModel.value = { ...renderVModel(props.configs, props.source) };
      }
    );

    onMounted(() => {
      exposeFormRef();
    });
    return {
      defaultGlobalConfigs,
      globalConfigs: props.globalConfigs,
      configs: props.configs,
      evalFn,
      rules,
      componentVModel,
      submitForm,
    };
  },
});
</script>
