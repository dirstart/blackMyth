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
      d="M17 3l-5 5-5-5M7 21l5-5 5 5"
    />
  </svg>
</template>

<script>
export default {
  name: "RepeatIcon",
  props: {
    size: {
      type: [String, Number],
      default: 16,
    },
  },
};
</script>
