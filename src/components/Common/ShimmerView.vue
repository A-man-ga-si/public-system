<template>
  <div class="shimmer">

  </div>
</template>

<style scoped>
  .shimmer {
    background: #f6f7f8;
    background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
    background-repeat: no-repeat;
    background-size: 800px 104px;
    position: relative;
    width: 100%;
    
    animation-duration: 1s;
    animation-fill-mode: forwards; 
    animation-iteration-count: infinite;
    animation-name: placeholderShimmer;
    animation-timing-function: linear;
  }

  @keyframes placeholderShimmer {
    0% {
      background-position: -468px 0;
    }
    
    100% {
      background-position: 468px 0; 
    }
  }
</style>
