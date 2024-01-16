<!--
 * @Author: 涂澳
 * @email: 2250467773@qq.com
 * @Date: 2024-01-04 10:53:07
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-01-16 14:19:00
-->

# Cropic.js

移动端 h5 头像裁剪工具

此插件是基于 https://github.com/teojs/cropic 进行修改、更新

## npm 方式

```bath
$ npm install cropic
```

在 vue 项目里使用

```html
// xxx.vue
<template>
  <img :src="base64" />
  <input type="file" name="file" accept="image/*" @change="uploadImg" />
</template>
<script>
  import Cropic from 'cropic'
  const cropic = new Cropic()
  export default {
    data () {
      return {
        base64: ''
      }
    }
    methods: {
      uploadImg(event) {
        const files = event.files
        const reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = img => {
          cropic.getImage({
            width: 500,
            height: 400,
            src: img.target.result,
            onDone: base64 => {
              this.base64 = base64
            }
          })
        }
        event.value = ''
      }
    }
  }
</script>
```

## cdn 方式

```html
<!-- xxx.html -->
<script src="https://unpkg.com/cropic/dist/cropic.min.js"></script>
<script>
  var cropic = new Cropic()
  cropic.getImage({
    // width: 500,
    // height: 400,
    src: e.target.result,
    // buttonText: ['Cancel', 'Reset', 'Done'],
    name: 'test',
    encode: 'base64', // 支持 base64、blob、file
    type: 'png',
    // quality: '0.9', // 导出图片的质量
    onDone: function (e) {
      document.getElementById('previewImg').src = e
    },
    onCancel: function () {
      console.log('取消裁剪')
    }
  })
</script>
```

## 参数说明

| 字段        | 类型   | 必填 | 默认                              | 说明                                        |
| :---------- | :----- | :--- | :-------------------------------- | :------------------------------------------ |
| width       | Number |      | 500                               | 裁剪宽度                                    |
| height      | Number |      | 500                               | 裁剪高度                                    |
| src         | String | 是   |                                   | 需要裁剪的图片，可以是图片链接，或者 base64 |
| type        | String |      | jpeg                              | 裁剪后图片的类型，仅支持 jpeg/png 两种      |
| quality     | Number |      | 0.9                               | 压缩质量(0.1-1)                             |
| buttonText  | Array  |      | ['取消', '重置', '完成']          | 底部三个按钮文本                            |
| buttonColor | Array  |      | ['#e04c4c', '#3680fd', '#23c667'] | 底部三个按钮文本的颜色                      |
| buttonSize  | String |      | 12                                | 底部三个按钮文本的大小                      |
| name        | String |      | cropic                            | 如果导出编码为 file，则可填图片名           |
| encode      | String |      | base64                            | 导出的格式，支持 base64、blob、file         |

## 事件说明

| 事件     | 回调                 | 说明     |
| :------- | :------------------- | :------- |
| onDone   | 导出裁剪后的图片编码 | 完成裁剪 |
| onCancel | 无                   | 取消裁剪 |
