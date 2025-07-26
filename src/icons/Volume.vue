<template>
  <svg 
    :width="size" 
    :height="size" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M6.343 6.343L4.929 4.93A1 1 0 003.515 6.343l1.414 1.414m0 0L7.07 9.9a1 1 0 001.414-1.414L6.343 6.343zm0 0a4 4 0 000 5.657m0 0L7.757 13.414a1 1 0 01-1.414-1.414l-1.414-1.414"
    />
  </svg>
</template>

<script>
export default {
  name: 'VolumeIcon',
  props: {
    size: {
      type: [String, Number],
      default: 16
    }
  }
}
</script>