import { App } from "vue";
import wSchemaForm from "./component/wSchemaForm.vue";
import { schemaTransfer, returnDateComponent } from "./component/utils/wSchemaForm";
const components = [wSchemaForm];

export { wSchemaForm, schemaTransfer, returnDateComponent };
export default {
  install(app: App) {
    for (let i in components) {
      let component = <any>components[i];
      app.component(component.name, component);
    }
  },
};
