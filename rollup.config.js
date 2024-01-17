/*
 * @Author: ao.tu
 * @email: 2250467773@qq.com
 * @Date: 2024-01-15 16:28:00
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-01-17 15:40:06
 */
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss'
export default [
  {
    input: './src/main.js',
    output: {
      file: './dist/cropic.js',
      format: 'umd',
      name: 'Cropic'
    },
    plugins: [
      postcss({
        minimize: true
      }),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
  {
    input: './src/main.js',
    output: {
      file: './dist/cropic.min.js',
      format: 'umd',
      name: 'Cropic'
    },
    plugins: [
      postcss({
        minimize: true
      }),
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ]
  }
]
