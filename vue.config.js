const path = require("path");
module.exports = {
  outputDir: path.resolve(__dirname, "./server/dist/public"),
  devServer: {
    proxy: "http://localhost:3000",
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       use: [
  //         {
  //           loader: MiniCssExtractPlugin.loader,
  //           options: { hmr: !env.prod },
  //         },
  //         "css-loader",
  //         "postcss-loader",
  //       ],
  //     },
  //   ],
  // },
};
