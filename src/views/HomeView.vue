<template>
  <div class="home">
    <PDFView />
  </div>
</template>

<script>
// @ is an alias to /src
import PDFView from '@/components/PDFView';

export default {
  name: 'HomeView',
  components: {
    PDFView,
  },
};
</script>
