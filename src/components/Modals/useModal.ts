import { ref, type Ref } from 'vue';

interface ReturnType {
  show: Ref<boolean>;
  showModal: Function;
  hideModal: Function;
}

export function useModal(): ReturnType {
  const show = ref<boolean>(false);

  const showModal = () => {
    show.value = true;
  }

  const hideModal = () => {
    show.value = false;
  }

  return { 
    show,
    showModal,
    hideModal
   };
}