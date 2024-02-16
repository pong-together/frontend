const path = require("path");

module.exports = {
  mode: "development", // 또는 'production'
  entry: "./src/index.js", // 애플리케이션 진입점
  output: {
    // 번들링된 파일 출력 설정
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
