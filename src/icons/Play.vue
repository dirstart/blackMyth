<template>
  <svg 
    :width="size" 
    :height="size" 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
</template>

<script>
export default {
  name: 'PlayIcon',
  props: {
    size: {
      type: [String, Number],
      default: 24
    }
  }
}
</script>