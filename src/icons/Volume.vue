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
      d="M15.536 8.464a5 5 0 010 7.072M11 5L6 9H2v6h4l5 4V5z"
    />
  </svg>
</template>

<script>
export default {
  name: "VolumeIcon",
  props: {
    size: {
      type: [String, Number],
      default: 16,
    },
  },
};
</script>
