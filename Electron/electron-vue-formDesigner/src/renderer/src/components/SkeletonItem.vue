<!-- SkeletonItem.vue -->
<template>
    <div class="skeleton-item">
      <div class="avatar shimmer"></div>
      <div class="text shimmer"></div>
    </div>
  </template>
  
  <style scoped>
  .skeleton-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  .avatar {
    width: 50px;
    height: 50px;
    background: #ddd;
    border-radius: 50%;
    margin-right: 1rem;
  }
  .text {
    flex: 1;
    height: 16px;
    background: #ddd;
    border-radius: 4px;
  }
  .shimmer {
    animation: shimmer 1.2s infinite linear;
    background: linear-gradient(90deg, #ddd 25%, #eee 50%, #ddd 75%);
    background-size: 200% 100%;
  }
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  </style>
  