<template>
  <svg
    :width="size"
    :height="size"
    fill="white"
    viewBox="0 0 24 24"
  >
    <path
      d="M16 3L20 7M20 7H13M20 7V14M8 21L4 17M4 17H11M4 17V10"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  name: "ShuffleIcon",
  props: {
    size: {
      type: [String, Number],
      default: 16,
    },
  },
};
</script>
