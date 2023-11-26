<script setup lang="ts">

export interface Props {
  title?: string,
  text: string,
  confirmBtnText: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm modal',
  confirmBtnText: 'Confirm'
});


const emit = defineEmits<{
  (e: 'onClose'): void,
  (e: 'onConfirm'): void,
}>();

const close = () => {
  emit('onClose');
}

const confirm = () => {
  emit('onConfirm');
}

</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" @click="close">&times;</span>
        <h2>{{ title }}</h2>
      </div>
      <div class="modal-body">
        <p>{{ text }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">
          Cancel
        </button>
        <button class="btn btn-primary" @click="confirm">
          {{ confirmBtnText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-footer .btn-secondary {
  margin-right: 1rem;
}
</style>