<template>
  <svg 
    :width="size" 
    :height="size" 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
  </svg>
</template>

<script>
export default {
  name: 'NextIcon',
  props: {
    size: {
      type: [String, Number],
      default: 20
    }
  }
}
</script>