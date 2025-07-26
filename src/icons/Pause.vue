<template>
  <svg 
    :width="size" 
    :height="size" 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
</template>

<script>
export default {
  name: 'PauseIcon',
  props: {
    size: {
      type: [String, Number],
      default: 24
    }
  }
}
</script>