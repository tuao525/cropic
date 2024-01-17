const dom = `
  <div class='shady-plot' id='shadyPlot'></div>
    <div class="cropic-frame" id="cropicFrame1"><img id="cropicImg1"></div>
    <div class="cropic-layer" id="cropicLayer"></div>
    <div class="cropic-frame cropic-frame-show" id="cropicFrame2">
      <img id="cropicImg2">
      <div id="borderLine" class="border-line">
        <div class="cropic-frame-show-border1"></div>
        <div class="cropic-frame-show-border2"></div>
        <div class="cropic-frame-show-border3"></div>
        <div class="cropic-frame-show-border4"></div>
      </div>
    </div>
    <div class="cropic-operation-bar">
      <div class="cropic-cancel" id="cropicCancel" role="button">取消</div>
      <div class="cropic-reset" id="cropicReset" role="button">重置</div>
      <div class="cropic-confirm" id="cropicConfirm" role="button">完成</div>
    </div>
  `
export default dom
