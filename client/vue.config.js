const path = require("path");
module.exports = {
  outputDir: path.resolve(__dirname, "../dist/public"),
  devServer: {
    proxy: "http://localhost:3000",
  },
  // FIXME pinia ^2.0.0 esm workaround
  // chainWebpack: (config) => {
  //   // ...
  //   config.resolve.extensions.prepend(".mjs");

  //   config.module
  //     .rule("mjs")
  //     .test(/\.mjs$/)
  //     .include.add(/node_modules/)
  //     .end()
  //     .type("javascript/auto");
  //   // ...
  // },
};
