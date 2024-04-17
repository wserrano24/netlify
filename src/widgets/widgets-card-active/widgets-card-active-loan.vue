<script setup lang="ts">
import {
  ApplicationSummary,
  ProductSummary,
  ProductType,
} from '@/constants/product';
import useProductStore from '../../stores/useProductStore';
import { ref, resolveComponent } from 'vue';
import WidgetsCardActiveLoanPayday from './widgets-card-active-loan-payday.vue';
import WidgetsCardActiveLoanInstallment from './widgets-card-active-loan-installment.vue';
import WidgetsCardActiveLoanLineOfCredit from './widgets-card-active-loan-line-of-credit.vue';

const { setProductId, setIsEpp } = useProductStore();

const props = defineProps<{
  product: ProductSummary;
  application?: ApplicationSummary;
}>();

const productRef = ref(props.product);
const applicationRef = ref(props.application);

setIsEpp(productRef.value.eligibleTransaction.isEPPInitiated ?? false); //use session storage instead of product store if defect from refreshing occur

// const componentMapping = {
//   // This is the Old reliable PDL Card just renamed and moved to the 'card-active-loan' folder
//   [ProductType.PDL]: resolveComponent('@/widgets/widgets-card-active/widgets-card-active-loan-payday.vue'),
//   [ProductType.ILP]: resolveComponent('@/widgets/widgets-card-active/widgets-card-active-loan-installment.vue'),
//   [ProductType.LOC]: resolveComponent('WidgetsCardActiveLoanLineOfCredit/widgets-card-active-loan-line-of-credit.vue'),
// };
const componentMapping = {
  // This is the Old reliable PDL Card just renamed and moved to the 'card-active-loan' folder
  [ProductType.PDL]: WidgetsCardActiveLoanPayday,
  [ProductType.ILP]: WidgetsCardActiveLoanInstallment,
  [ProductType.LOC]: WidgetsCardActiveLoanLineOfCredit,
};

setProductId(productRef.value.productId);
</script>

<template>
  <component
    :is="componentMapping[ProductType[props.product.productType]]"
    :product="props.product"
    :application="applicationRef"
  ></component>
</template>

<style scoped>
.common-style {
  margin: 24px;
}
</style>