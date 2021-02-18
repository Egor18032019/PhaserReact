/* eslint-disable strict */
const path = require(`path`);
//  экспортируем настройки
module.exports = {
  entry: `./src/index.js`, // - точка входа в приложение
  output: {
    // файл сборки (бандл) назвали bundle.js;
    filename: `bundle.js`,
    // eslint-disable-next-line no-undef
    path: path.join(__dirname, `build`) // абсолютный путь до public где будет лежать bundle.js
  },
  devServer: {
    // eslint-disable-next-line no-undef
    contentBase: path.join(__dirname, `public`), // - пишем откуда серверу забирать файлы
    // где лежат html и css файлы
    open: false, // чтобы при запуске не открывался браузер
    port: 888, // - порт в котором открывается
    historyApiFallback: true // для react-router-dom
  },
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1500,
  },
  module: { // как преобразуються файлы для webpacka
    rules: [{
      test: /\.(js|jsx)$/, // те типы файлов котоорые проверям
      exclude: /node_modules/, // исключаем из проверки
      use: {
        loader: `babel-loader`,
      },
    },
    {
      test: /\.(tsx|ts)?$/,
      loader: `ts-loader`
    },
    {
      test: /\.(gif|png|jpe?g|svg|xml)$/i,
      use: `file-loader`,
    },
    {
      test: /\.css$/i,
      use: [
        `style-loader`,
        `css-loader`,
      ],
    },
    ],
  },
  resolve: {
    extensions: [`.ts`, `.tsx`, `.js`, `json`]
  },
  devtool: `source-map`,
};
