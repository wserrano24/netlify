<template>
  <ul id="pills-tab" class="nav nav-pills mb-3" role="tablist">
    <slot name="nav"> </slot>
  </ul>
  <div id="pills-tabContent" class="tab-content">
    <slot name="content"></slot>
  </div>
</template>
