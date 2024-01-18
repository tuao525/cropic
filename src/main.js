import './style.css'
import dom from './dom'

class Cropic {
  constructor() {
    this.default = {
      width: 500, // 裁剪宽度
      height: 500, // 裁剪高度
      src: '', // 需要裁剪的图片
      ratio: 1,
      encode: 'base64', // 导出格式，支持 base64|blob|file
      type: 'jpeg', // 裁剪后图片的类型，仅支持jpeg/png两种
      name: 'crop-picture', // 如果导出格式位file, 则可以填写图片名
      quality: 0.9, // 压缩质量
      buttonText: ['取消', '重置', '完成'], // 底部三个按钮文案,
      buttonColor: ['#e04c4c', '#3680fd', '#23c667'], // 底部三个按钮颜色,
      buttonSize: 12 // 底部三个按钮大小
    }
    this.init() // 初始化，渲染dom跟css
    this.cropic = this.getId('cropic')
    this.img1 = this.getId('cropicImg1') // 背景图
    this.img2 = this.getId('cropicImg2') // 前景图
    this.frame1 = this.getId('cropicFrame1') // 背景操作框
    this.frame2 = this.getId('cropicFrame2') // 前景操作框
    this.cancelBtn = this.getId('cropicCancel') // 取消按钮
    this.resetBtn = this.getId('cropicReset') // 重置按钮
    this.confirmBtn = this.getId('cropicConfirm') // 完成按钮
    this.borderLine = this.getId('borderLine') // 九宫格线
    this.cropicLayer = this.getId('cropicLayer') // 图片背景图
    this.shadyPlot = this.getId('shadyPlot') // 图片背景图
    this.reset = this.reset.bind(this)
    this.done = this.done.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  init() {
    if (!this.getId('cropic')) {
      this.createHtml()
    }
  }

  getId(id) {
    return document.getElementById(id)
  }

  createHtml() {
    const div = document.createElement('div')
    div.className = 'cropic-body'
    div.setAttribute('id', 'cropic')
    div.innerHTML = dom
    document.body.appendChild(div)
  }

  getImage(options = {}) {
    // 初始化参数
    this.scale = 1 // 缩放
    this.rotate = 0 // 旋转
    this.translateX = 0 // 水平偏移
    this.translateY = 0 // 垂直偏移
    this.cropicWidth = 0 // 计算宽度
    this.cropicHeight = 0 // 计算高度
    const defaults = JSON.parse(JSON.stringify(this.default))
    this.options = Object.assign(defaults, options)
    this.cancelBtn.innerHTML = this.options.buttonText[0] //关闭按钮
    this.resetBtn.innerHTML = this.options.buttonText[1] // 重置按钮
    this.confirmBtn.innerHTML = this.options.buttonText[2] // 提交按钮
    this.cancelBtn.style.color = this.options.buttonColor[0] //关闭按钮颜色
    this.resetBtn.style.color = this.options.buttonColor[1] //重置按钮颜色
    this.confirmBtn.style.color = this.options.buttonColor[2] //提交按钮颜色
    this.cancelBtn.style.fontSize = this.options.buttonSize + 'px' //关闭按钮大小
    this.resetBtn.style.fontSize = this.options.buttonSize + 'px' //重置按钮大小
    this.confirmBtn.style.fontSize = this.options.buttonSize + 'px' //提交按钮大小
    this.img1.src = this.options.src
    this.img2.src = this.options.src
    let tempImage = new Image()
    tempImage.onload = () => {
      this.originW = this.img2.width
      this.originH = this.img2.height
      this.originRatio = this.originW / this.originH
      this.initSize()
      this.cropic.style.transform = 'translate(0, 0)'
      // 图片宽度大于图片高度
      setTimeout(() => {
        if (this.img1.width > this.img1.height) {
          this.img1.style.height = this.frame1.clientHeight + 'px'
          this.img2.style.height = this.frame1.clientHeight + 'px'
          this.img1.style.width =
            this.img1.width * (this.frame1.clientHeight / this.img1.height) +
            'px'
          this.img2.style.width =
            this.img1.width * (this.frame1.clientHeight / this.img1.height) +
            'px'
        } else {
          this.img1.style.width = this.frame1.clientWidth + 'px'
          this.img2.style.width = this.frame1.clientWidth + 'px'
          this.img1.style.height =
            this.img1.height * (this.frame1.clientWidth / this.img1.width) +
            'px'
          this.img2.style.height =
            this.img1.height * (this.frame1.clientWidth / this.img1.width) +
            'px'
        }
        // 使图片居中显示
        if (this.img1.height > this.img1.width) {
          this.translateY = -Math.floor(
            (this.img1.height - this.options.cropicHeight) / 2
          )
          this.translateX = 0
        } else {
          this.translateX = -Math.floor(
            (this.img1.width - this.options.cropicWidth) / 2
          )
          this.translateY = 0
        }
        this.setTransform()
      }, 300)
      setTimeout(() => {
        this.shadyPlot.style.display = 'none'
      }, 310)
      this.cancelBtn.addEventListener('click', this.cancel)
      this.resetBtn.addEventListener('click', this.reset)
      this.confirmBtn.addEventListener('click', this.done)
      this.cropic.addEventListener('touchmove', (e) => {
        e.preventDefault()
        if (e.touches.length > 1) {
          this.setScale(e.touches[0], e.touches[1])
          this.setRotate(e.touches[0], e.touches[1])
          return
        }
        this.setTranslate(e.touches[0])
        this.cropicLayer.style.display = 'none'
        this.borderLine.setAttribute('class', 'borderLinefadeIn')
        this.cropicLayer.setAttribute('class', 'cropic-layer')
      })
      this.cropic.addEventListener('touchend', (e) => {
        this.distance = null
        this.angle = null
        this.moveX = null
        this.moveY = null

        const img1 = this.img1.getBoundingClientRect()
        const frame1 = this.frame1.getBoundingClientRect()

        if (img1.top >= frame1.top) {
          if (this.scale === 1) {
            this.translateY = 0
          } else {
            this.translateY = (img1.height - this.img1.height) / 2
          }
        }
        if (img1.bottom <= frame1.bottom) {
          if (this.scale === 1) {
            this.translateY = -(this.img1.height - frame1.height)
          } else {
            this.translateY = -(
              img1.height -
              frame1.height -
              (img1.height - this.img1.height) / 2
            )
          }
        }
        if (img1.left >= frame1.left) {
          if (this.scale === 1) {
            this.translateX = 0
          } else {
            this.translateX = (img1.width - this.img1.width) / 2
          }
        }
        if (img1.right <= frame1.right) {
          if (this.scale === 1) {
            this.translateX = 0
          } else {
            this.translateX = -(img1.width - this.img1.width) / 2
          }
        }
        this.setTransform()

        setTimeout(() => {
          this.cropicLayer.style.display = 'block'
          this.borderLine.setAttribute('class', 'borderLinefadeOut')
          this.cropicLayer.setAttribute('class', 'cropicFadeOut')
        }, 300)
      })
    }
    tempImage.src = this.options.src
  }

  // 初始化
  initSize() {
    const body = document.documentElement || document.body
    let cropicWidth = 0
    let cropicHeight = 0
    let ratio = this.options.width / this.options.height
    if (ratio === 1) {
      if (body.clientHeight > body.clientWidth) {
        cropicWidth = body.clientWidth - 60
        cropicHeight = body.clientWidth - 60
      } else {
        cropicWidth = body.clientHeight - 60
        cropicHeight = body.clientHeight - 60
      }
    } else {
      if (body.clientHeight > body.clientWidth) {
        if (body.clientWidth > this.options.width) {
          cropicWidth = this.options.width
          cropicHeight = this.options.height
        } else {
          cropicWidth = body.clientWidth - 60
          cropicHeight = (body.clientWidth - 60) / ratio
        }
      } else {
        if (body.clientHeight > this.options.height) {
          cropicWidth = this.options.width
          cropicHeight = this.options.height
        } else {
          cropicWidth = body.clientHeight - 60
          cropicHeight = (body.clientHeight - 60) / ratio
        }
      }
    }
    this.options.cropicWidth = cropicWidth
    this.options.cropicHeight = cropicHeight
    this.options.width = cropicWidth
    this.options.height = cropicHeight
    this.frame1.style.width = cropicWidth + 'px'
    this.frame1.style.height = cropicHeight + 'px'
    this.frame2.style.width = cropicWidth + 'px'
    this.frame2.style.height = cropicHeight + 'px'
    this.cropicLayer.style.display = 'block'
  }

  setScale(touches1, touches2) {
    const x = Math.abs(touches1.clientX - touches2.clientX)
    const y = Math.abs(touches1.clientY - touches2.clientY)
    const s = Math.sqrt(x * x + y * y)
    if (this.distance) {
      this.scale += (s - this.distance) / this.img2.clientWidth
      this.setTransform()
    }
    this.distance = s
  }

  setRotate(touches1, touches2) {
    const x = touches1.clientX - touches2.clientX
    const y = touches1.clientY - touches2.clientY
    const s = Math.sqrt(x * x + y * y)
    const angle = (Math.atan2(y, x) * 180) / Math.PI
    if (this.angle) {
      this.rotate += angle - this.angle
      this.setTransform()
    }
    this.angle = angle
  }

  setTranslate(touches) {
    const x = touches.clientX
    const y = touches.clientY
    if (this.moveX) {
      this.translateX += x - this.moveX
    }
    if (this.moveY) {
      this.translateY += y - this.moveY
    }
    this.moveX = x
    this.moveY = y
    this.setTransform()
  }

  // 图片移动
  setTransform() {
    let transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale}) rotate(${this.rotate}deg)`
    this.img1.style.transform = transform
    this.img2.style.transform = transform
  }

  // 关闭按钮
  cancel(eventType) {
    this.cropic.style.transform = 'translate(0, 100%)'
    setTimeout(() => {
      this.img1.style = ''
      this.img1.src = ''
      this.img2.style = ''
      this.img2.src = ''
    }, 400)
    if (this.options.onCancel && eventType !== 'done') {
      this.options.onCancel()
    }
    this.cancelBtn.removeEventListener('click', this.cancel)
    this.resetBtn.removeEventListener('click', this.reset)
    this.confirmBtn.removeEventListener('click', this.done, true)
    this.shadyPlot.style.display = 'block'
  }

  // 重置按钮
  reset() {
    const body = document.documentElement || document.body
    this.scale = 1
    this.rotate = 0
    if (this.img1.height > this.img1.width) {
      this.translateY = -Math.floor(
        (this.img1.height - this.options.cropicHeight) / 2
      )
      this.translateX = 0
    } else {
      this.translateX = -Math.floor(
        (this.img1.width - this.options.cropicWidth) / 2
      )
      this.translateY = 0
    }
    this.img1.style.transition = '0.3s'
    this.img2.style.transition = '0.3s'
    this.setTransform()
    setTimeout(() => {
      this.img1.style.transition = ''
      this.img2.style.transition = ''
    }, 300)
  }

  done() {
    const zommRatio = this.options.width / this.frame2.clientWidth
    const canvas = document.createElement('canvas')
    canvas.width = this.options.width
    canvas.height = this.options.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    let drawImageW
    let drawImageH
    if (this.img1.height > this.img1.width) {
      drawImageW = this.options.width
      drawImageH = this.img1.height / (this.img1.width / this.options.width)
    } else {
      drawImageH = this.options.height
      drawImageW = this.img1.width / (this.img1.height / this.options.height)
    }
    const point = { x: drawImageW / 2, y: drawImageH / 2 }
    ctx.translate(this.translateX * zommRatio, this.translateY * zommRatio)
    if (this.rotate !== 0) {
      ctx.translate(point.x, point.y)
      ctx.rotate((this.rotate * Math.PI) / 180)
      ctx.translate(-point.x, -point.y)
    }
    if (this.scale !== 1) {
      ctx.translate(point.x * (1 - this.scale), point.y * (1 - this.scale))
      ctx.scale(this.scale, this.scale)
    }
    ctx.drawImage(this.img2, 0, 0, drawImageW, drawImageH)
    if (this.options.onDone) {
      switch (this.options.encode) {
        case 'base64':
          this.options.onDone(
            canvas.toDataURL(`image/${this.options.type}`, this.options.quality)
          )
          break
        case 'blob':
          canvas.toBlob((blob) => {
            this.options.onDone(blob)
          }, `image/${this.options.type}`)
          break
        case 'file':
          canvas.toBlob((blob) => {
            let file = new window.File([blob], this.options.name, {
              type: `image/${this.options.type}`
            })
            this.options.onDone(file)
          }, `image/${this.options.type}`)
          break
        default:
          this.options.onDone(
            canvas.toDataURL(`image/${this.options.type}`, this.options.quality)
          )
          break
      }
    }
    this.cancel('done')
  }
}
export default Cropic
