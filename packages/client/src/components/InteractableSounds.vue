<template>
  <Sound sound="button-hover.m4a" :triggers="['mouseenter']">
    <Sound sound="button-click.m4a" :triggers="['mousedown']"><slot /></Sound>
  </Sound>
</template>
