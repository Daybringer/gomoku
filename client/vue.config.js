const path = require("path");
module.exports = {
  outputDir: path.resolve(__dirname, "../dist/public"),
  devServer: {
    proxy: "http://localhost:3000",
  },
};
