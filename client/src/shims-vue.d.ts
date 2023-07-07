// declare module "*.vue" {
//   import Vue from "vue";
//   export default Vue;
// }
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.svg" {
  // It's really a string, precisely a resolved path pointing to the image file
  const filePath: string;

  export default filePath;
}

import "vite/client";
