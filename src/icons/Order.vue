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
      d="M3 10h18M8 15l4-4-4-4M16 15l-4-4 4-4"
    />
  </svg>
</template>

<script>
export default {
  name: "OrderIcon",
  props: {
    size: {
      type: [String, Number],
      default: 16,
    },
  },
};
</script>
