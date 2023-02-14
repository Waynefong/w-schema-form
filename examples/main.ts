import { createApp } from "vue";
import app from "./app.vue";
import TDesign from "tdesign-vue-next";
import "tdesign-vue-next/es/style/index.css";
import wSchemaForm from "../packages/index";

const App = createApp(app).use(wSchemaForm).use(TDesign);

App.mount("#app");
