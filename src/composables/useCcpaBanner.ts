import { computed, ref } from "vue";

const bannerState = ref<any>(false);

export const useCcpaBanner = () => {

  const handleBannerState = (state: boolean): void => {
    bannerState.value = state;
  };

  return {
    handleBannerState,
    bannerState: computed(() => bannerState)?.value,
  };
};
