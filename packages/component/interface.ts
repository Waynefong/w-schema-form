/**
 * 全局配置说明
 * [formSettings] 表单配置
 * [rowSettings] 栅格行配置
 * [colSettings] 栅格列配置
 * [operationSlot] 是否自定义取消、确认按钮
 */
export interface GLOBAL_CONFIGS_INTERFACE {
  formSettings?: Record<string, any>;
  rowSettings?: Record<string, any>;
  colSettings?: Record<string, any>;
  operationSlot?: boolean;
}

/**
 * schema配置说明
 * [component] 组件名称 slot 为插槽
 * [label] label form-item 标题
 * [labelToolTips] 关于label的提示语
 * [props] 组件属性 size:"large"
 * [listener] 组件事件 change:()=>{}
 * [colSettings] 栅格列配置 span:12
 * [model] v-model绑定值，多层级直接按照调用方式传，'a.b.c'
 * [type] v-model绑定值数据类型
 * [rules] 校验规则
 * [dependence] 其他依赖，仅支持v-if判断，if:'__name__ === 'abc''，name为数据源中name的值，__${}__为固定写法
 * [default] v-model绑定默认值
 */
export interface SCHEMA_CONFIGS_INTERFACE {
  component: string;
  label: string;
  labelToolTips?: string;
  props?: Record<string, any>;
  listener?: Record<string, any>;
  colSettings?: Record<string, any>;
  model: string;
  type?: string;
  rules?: Array<any>;
  dependence?: Record<string, any>;
  default?: string;
}
