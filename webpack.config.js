var path = require('path')
var webpack = require('webpack')
const NODE_ENV = process.env.NODE_ENV;
module.exports = {
  entry: NODE_ENV == 'development' ? './src/main.js' : './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'IM.js',
    library: 'IM', // 指定的就是你使用require时的模块名
    libraryTarget: 'umd', // 指定输出格式
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        loader: "less-loader", // 将 Less 文件编译为 CSS 文件
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    open: true, // 启动成功是否打开页面
    historyApiFallback: true,
    inline: true, // 用来支持dev-server自动刷新
    noInfo: true,
    overlay: true,
    host: '0.0.0.0', // 设置IP地址访问
    useLocalIp: true, // 自动使用本地IP地址打开
    port: '8080', // 端口 默认就是8080
    proxy: {
      '/api': {
        // target: 'http://192.168.101.69:8081/',
        target: 'http://192.168.101.27:8081/',
        // target: 'http://192.168.101.40:8082/',
        // target: 'http://qa-backstage.bestlvs.com/',
        changeOrinin: true, // 如果需要跨域需要配置
        // secure: false, // https需要配置
        pathRewrite: { '^/api': '/api' }
      },
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
