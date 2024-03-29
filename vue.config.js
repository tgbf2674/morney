// eslint-disable-next-line @typescript-eslint/no-var-requires
/* eslint-disable */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/morney-website/'
        : '/' ,
    lintOnSave: false,
    chainWebpack: config => {
        const dir = path.resolve(__dirname, 'src/assets/icons');
        config.module
            .rule('svg-sprite')
            .test(/\.svg$/)
            .include.add(dir).end()//只包含icons目录
            .use('svg-sprite-loader').loader("svg-sprite-loader").options({extract: false}).end()
            .use('svgo-loader').loader('svgo-loader').end()
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        config.plugin('svg-sprite').use(require('svg-sprite-loader/plugin'), [{plainSprite: true}]);
      config.module.rule('svg').exclude.add(dir)
    },
    configureWebpack:{
        externals: {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'echarts': 'echarts',
            'lodash': '_'
        },
      plugins: [new UglifyJsPlugin({
          uglifyOptions: {
              compress:{
                  drop_debugger: true,
                  drop_console: true
              }
          },
          sourceMap: false,
          parallel: true
      })]
    },
};
