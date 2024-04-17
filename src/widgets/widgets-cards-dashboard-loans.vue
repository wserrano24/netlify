<script setup lang="ts">
import '@splidejs/splide/dist/css/splide.min.css';

import {
  ApplicationStatus,
  ApplicationSummary,
  ProductSummary,
} from '@/constants/product';
import { GoogleAppObject, GoogleProductObject } from '../types/google-tag-info';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import { useSessionStorage } from '@/composables/useSessionStorage';
import { onMounted, reactive, ref } from 'vue';
import WidgetsCardApplication from './widgets-card-application.vue';
import WidgetsCardActiveLoan from './widgets-card-active/widgets-card-active-loan.vue';
import BaseSwipeable from '@/components/base/BaseSwipeable.vue';

const { setItem } = useSessionStorage();

interface Props {
  hasEsignPending: boolean;
  products: Array<ProductSummary>;
  applications: Array<ApplicationSummary>;
}
interface cardState {
  products: Array<ProductSummary>;
  activeApplication?: ApplicationSummary | null;
  isActiveApplicationValid: boolean;
  isLoading: boolean;
  applicationIsRefinance: boolean;
}
const props = defineProps<Props>();
  const state = reactive<cardState>({
  products: [],
  isActiveApplicationValid: false,
  isLoading: false,
  applicationIsRefinance: false,
});

const loanCardSliderOptions = {
  arrows: false,
  type: 'loop',
  wheel: true,
  wheelMinThreshold: 120,
  wheelSleep: 125,
};
const testProductsRef = ref(props.products);
const testAppsRef = ref(props.applications);
const testEsignPending = ref(props.hasEsignPending);

const handleCheckProdForRefiAndUpdateState = () => {
  state.isLoading = true;
  const checkProdForRefi = () => {
    if (testProductsRef.value) {
      const product = testProductsRef.value.find(
        (prod) =>
          prod?.productId == testAppsRef.value[0]?.refinance?.originalProductId
      );
      return !!product;
    } else {
      return false;
    }
  };
  state.products = testProductsRef.value;
  state.activeApplication = testAppsRef.value && testAppsRef.value.length > 0 ? testAppsRef.value[0] : null;
  state.isActiveApplicationValid =
    state?.activeApplication?.state === ApplicationStatus.ACTION_PENDING ||
    state?.activeApplication?.state === ApplicationStatus.UNDER_REVIEW ||
    state?.activeApplication?.state === ApplicationStatus.READY_FOR_PICKUP;
  state.isLoading = false;
  state.applicationIsRefinance = checkProdForRefi();
  if (state.products?.length === 1) {
    setItem('productId', state.products[0].productId);
  }
  
};

onMounted(() => {
  handleCheckProdForRefiAndUpdateState();
});


if (testEsignPending.value === false) {
  handleCheckProdForRefiAndUpdateState();
}
</script>

<template>
  <section v-if="state?.isActiveApplicationValid && !state.applicationIsRefinance">
    <WidgetsCardApplication
      v-if="state?.activeApplication && !testEsignPending"
      :application="state?.activeApplication"
    />
  </section>
  <section
    v-if="
      !state.isLoading && state.products?.length > 0 && !testEsignPending
    "
    class="theme-dashboard-card-section"
  >
    <!-- For single loan card -->
    <WidgetsCardActiveLoan
      v-if="state.products?.length === 1"
      :product="state.products[0]"
      :application="state.activeApplication"
    />
    <!-- For multiple loan cards -->
    <template v-else>
      <!-- Mobile version with stacked loan card -->
      <div class="d-block d-lg-none">
        <BaseSwipeable
          data-test-id="swipeable=loan-card"
          :list-length="state.products?.length"
        >
          <template
            v-for="(productMobile, index) in state.products"
            :key="`loan-card-${index}`"
            #[`item-${index}`]
          >
            <WidgetsCardActiveLoan
              :product="productMobile"
              :application="state.activeApplication"
            />
          </template>
        </BaseSwipeable>
      </div>

      <!-- Desktop version with infinite carousel -->
      <div
        class="theme-splide-slider theme-splide-slider-pad-bottom d-none d-lg-block"
      >
        <Splide :options="loanCardSliderOptions">
          <SplideSlide
            v-for="(productDesktop, index) in state.products"
            :key="`loan-card-${index}`"
          >
            <WidgetsCardActiveLoan
              :product="productDesktop"
              :application="state.activeApplication"
            />
          </SplideSlide>
        </Splide>
      </div>
    </template>
  </section>
</template>
