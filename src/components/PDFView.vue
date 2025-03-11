<template>
  <div class="canvas-container">
    <canvas v-for="page in pages" :id="'the-canvas' + page" :key="page"> </canvas>
  </div>
</template>
<script>
import PDFJS from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';
PDFJS.workerSrc = workerSrc;
export default {
  name: 'PDFView',
  data() {
    return {
      pages: [],
      pdfUrl: `${process.env.BASE_URL}demo.pdf`,
    };
  },
  created() {
    this._loadFile(this.pdfUrl);
  },
  methods: {
    _renderPage(num) {
      this.pdfDoc.getPage(num).then((page) => {
        let canvas = document.getElementById('the-canvas' + num);
        var vp = page.getViewport({ scale: 1 });
        let ctx = canvas.getContext('2d');
        let dpr = window.devicePixelRatio || 1;
        let bsr =
          ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio ||
          1;
        let ratio = dpr / bsr;
        let viewport = page.getViewport({ scale: window.innerWidth / vp.width });
        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        canvas.style.width = viewport.width + 'px';
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        page.render(renderContext);
        if (this.pages > num) {
          this._renderPage(num + 1);
        }
      });
    },
    _loadFile(url) {
      PDFJS.getDocument(url).promise.then((pdf) => {
        console.log(pdf);
        this.pdfDoc = pdf;
        this.pages = pdf.numPages;
        this.$nextTick(() => {
          this._renderPage(1);
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.canvas-container {
  margin: 0 auto;
}
</style>
