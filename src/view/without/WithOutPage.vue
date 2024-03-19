<!--通知群组页面-->
<template>
    <BigPageView :position="position" :showTools="showTools">
      <template #tools>
        <a-divider type="vertical" />
        <a :href="link" target="_blank">原页面
        </a>
      </template>
      <template #content>
        <iframe id="iframe" width="100%" height="100%" frameborder="0" :src="link"></iframe>
      </template>
    </BigPageView>
</template>

<script>
import BigPageView from '@/layout/BigPageView'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
export default {
  props: {
    pageLink: { type: String, default: '' },
    showTools: { type: Boolean, default: true },
    position: { type: String, default: 'absolute' }
  },
  setup (props) {
    const route = useRoute()
    const link = ref(props.pageLink)
    if (route.params.link) {
      link.value = decodeURIComponent(route.params.link)
    }
    return {
      link
    }
  },
  components: { BigPageView }
}
</script>
