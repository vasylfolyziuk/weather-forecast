<script setup lang="ts">

const props = defineProps<{
  text: string
}>();

const emit = defineEmits<{
  (e: 'onClose'): void,
}>();

const close = () => {
  emit('onClose');
}

</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" @click="close">&times;</span>
        <h2>Alert modal</h2>
      </div>
      <div class="modal-body">
        <p>{{ text }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="close">
          Ok
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  display: block; 
  position: fixed; 
  z-index: 1; 
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
}

.close {
  color: grey;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.modal-header {
  padding: 2px 16px;
}

.modal-body {padding: 2px 16px;}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}
</style>