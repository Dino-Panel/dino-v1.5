<template>
  <div class="dp-tooltip" :style="style">
    <div class="dp-tooltip-item">
      <div
        class=".dp-tooltip-text"
        v-html="text || `No tooltip info was defined`"
      ></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["text", "style"],
};
</script>

<style scoped>
.dp-tooltip {
  position: relative;
  width: fit-content !important;
  min-width: fit-content !important;
}

.dp-tooltip:hover .dp-tooltip-item {
  display: block;
}

.dp-tooltip-item {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: calc(100% + 8px);
  z-index: 2000;
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 6px;
  background-color: #595959;
  border-radius: 4px;
  max-width: 175px;
  width: fit-content !important;
  min-width: fit-content !important;
  display: none;
  line-height: 12px;
}

.dp-tooltip-item:hover {
  display: none;
}

.dp-tooltip-item::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #595959 transparent transparent transparent;
}
.dp-tooltip-text {
  max-width: 500px !important;
  word-wrap: break-word;
  white-space: pre-line;
}
</style>
