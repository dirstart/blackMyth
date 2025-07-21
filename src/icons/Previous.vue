<template>
  <svg 
    :width="size" 
    :height="size" 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
  </svg>
</template>

<script>
export default {
  name: 'PreviousIcon',
  props: {
    size: {
      type: [String, Number],
      default: 20
    }
  }
}
</script>