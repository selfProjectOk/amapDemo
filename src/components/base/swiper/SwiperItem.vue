<template>
  <div class="swiper-item">
    <slot></slot>
  </div>
</template>
<style scoped>
  .swiper-item{
    height: 100%;
    background-position: 50%;
    background-size: cover;
    position: relative;
    overflow: hidden;
    float: left;
  }
</style>
