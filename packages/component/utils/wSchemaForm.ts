import { computed } from "vue";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

//初始数据，类型:初始值
const defaultData: Record<string, any> = {
  string: "",
  number: 0,
  array: [],
  object: {},
};

/**
 * 将schema配置转换为初始数据源
 * @param schemaConfigs
 * @param oriData
 * @returns
 */
export const schemaTransfer = (schemaConfigs: Record<any, any>, oriData = {}) => {
  const transfer = (data: Record<any, any>, result: any) => {
    for (let i = 0; i < data.length; i++) {
      if ((data[i]?.default || data[i]?.type) && data[i]?.model) {
        if (data[i]?.model?.split(".")?.length < 2) {
          result[data[i].model] = data[i]?.default ? data[i].default : defaultData[data[i].type];
        } else {
          result[data[i]?.model?.split(".")[0]] = {
            ...result[data[i]?.model?.split(".")[0]],
            ...setDeepVal(data[i].model, data[i]?.default ? data[i].default : defaultData[data[i].type]),
          };
        }
      }
    }
    return result;
  };
  return transfer(schemaConfigs, oriData);
};

/**
 * 深层嵌套对象赋值
 */
export const setDeepVal = (modelKey: string, newVal: any) => {
  return modelKey
    .split(".")
    .slice(1, modelKey.length)
    .reduceRight((obj, key) => {
      return {
        [key]: obj,
      };
    }, newVal);
};

/**
 * 深层嵌套对象取值
 */
export const getDeepVal = (modelKey: string, sourceData: any) => {
  return modelKey.split(".").reduce((total, current) => {
    return total && total[current];
  }, sourceData);
};

/**
 * 生成组件响应式数据
 * @param configs schema配置
 * @param source 原始数据
 * 将长字符串映射到真实深层嵌套对象中取值
 * 如key为'a.b.c'自动映射数据{a:{b:{c:'xxx'}}}
 */
export const renderVModel = (configs: any, source: any) => {
  let result: Record<string, any> = {};
  for (let i = 0; i < configs.length; i++) {
    if (configs[i]?.model) {
      result[configs[i].model] = computed({
        get: () => {
          return getDeepVal(configs[i].model, source);
        },
        set: (val) => {
          if (configs[i].model?.split(".").length > 1) {
            source[configs[i].model?.split(".")[0]] = {
              ...source[configs[i].model?.split(".")[0]],
              ...setDeepVal(configs[i].model, val),
            };
          } else {
            source[configs[i].model] = val;
          }
        },
      });
    }
  }
  return result;
};

/**
 * 生成校验规则
 * @param configs schema配置
 */
export const renderRules = (configs: any) => {
  let rules: Record<string, any> = {};
  for (let i = 0; i < configs.length; i++) {
    if (configs[i]?.rules) {
      rules[configs[i].model] = configs[i].rules;
    }
  }
  return rules;
};

/**
 * 处理依赖公式
 * @param {string} fn
 * __${}__为需要替换为真实数据的固定格式
 * v-if条件，输入'__name__ === 'abc''，自动处理成''abc'==='abc''（假设name的值为'abc'）
 * 待优化：正则可靠性
 */
export const evalFn = (componentVModel: any, fn: string) => {
  if (fn) {
    let regx = /__(.*?)__/g;
    let regxArr = fn.match(regx)?.map((item) => {
      return item.replace(/_/g, "");
    });
    if (regxArr) {
      for (let i = 0; i < regxArr.length; i++) {
        if (componentVModel?.[regxArr[i]] !== undefined) {
          let newFn = fn.replace(
            new RegExp(`__${regxArr[i]}__`, "g"),
            (typeof componentVModel[regxArr[i]] === "string"
              ? `'${componentVModel[regxArr[i]]}'`
              : componentVModel[regxArr[i]]) || null
          );
          fn = newFn;
        } else {
          console.log("参数值有误");
          return false;
        }
      }
      let Fn = Function;
      return new Fn(`return ${fn}`)();
    }
  } else {
    return true;
  }
};

/**
 *  校验日期属于哪种格式，返回不同时间控件
 * @param {string} date 日期，暂时仅支持string类型
 * dateFormat为目前所校验日期格式
 */
export const returnDateComponent = (date: string) => {
  const dateFormat: Record<string, any> = {
    "YYYY-MM-DD": {
      component: "t-date-picker",
    },
    "YYYY/MM/DD": {
      component: "t-date-picker",
    },
    "YYYY-M-D": {
      component: "t-date-picker",
    },
    "YYYY/M/D": {
      component: "t-date-picker",
    },
    "YYYY-MM-DD HH:mm:ss": {
      component: "t-date-picker",
      props: {
        enableTimePicker: true,
      },
    },
    "YYYY-M-D HH:mm:ss": {
      component: "t-date-picker",
      props: {
        enableTimePicker: true,
      },
    },
    "YYYY年MM月DD日 HH:mm:ss": {
      component: "t-date-picker",
      props: {
        enableTimePicker: true,
      },
    },
    "YYYY年M月D日 HH:mm:ss": {
      component: "t-date-picker",
      props: {
        enableTimePicker: true,
      },
    },
    "HH:mm:ss": {
      component: "t-timePicker",
    },
  };
  const formatKeys = Object.keys(dateFormat);
  for (let i = 0; i < formatKeys.length; i++) {
    if (dayjs(date, formatKeys[i], "zh-cn", true).isValid()) {
      return dateFormat[formatKeys[i]];
    }
  }
  return {};
};
