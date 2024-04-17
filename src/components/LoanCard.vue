<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { currency, currencyFormatting } from '@/constants/masks';
import { Routes } from '@/constants/pages';
import BaseSkeletonLoader from './base/BaseSkeletonLoader.vue';
import BaseIcon from './base/BaseIcon.vue';
import BaseKeyValueText from './base/BaseKeyValueText.vue';
import { computed, onMounted, ref } from 'vue';
import useContentfulImage from '@/composables/useContentfulImage';
import BaseCard from './base/BaseCard.vue';
import BaseBadge from './base/BaseBadge.vue';

interface LoanItem {
  title: string;
  value: string;
}

interface Props {
  amount: string | number;
  badgeType: 'active' | 'processing' | 'pending' | 'closed';
  balance: string;
  balanceLabel: string;
  dataTestId: string;
  loanId: number | string;
  loanItems: LoanItem[];
  loanLabel: string;
  loanTitle: string;
  isNakedCard?: boolean;
  loanType: 'installment' | 'line-of-credit' | 'payday' | 'title';
  status?: string;
  isLoading?: boolean;
  redirectUri?: string;
  isApplicationCard?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  balance: null,
  isNakedCard: false,
  status: '',
  isLoading: false,
  redirectUri: Routes.Dashboard,
  isApplicationCard: false,
});

const cxLoanCardClasses = computed(() => [
  'theme-loan-card',
  {
    'theme-loan-card-naked': Boolean(props.isNakedCard),
  },
]);

const customCurrencyFormat = {
  ...currency,
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

const formattedValues = (value: number) => {
  return currencyFormatting(Number(value || 0), 'en', customCurrencyFormat);
};

const image = ref()

onMounted(async()=>{
  image.value = await useContentfulImage('1yffvagpom52SjPUBYEdce');
})
</script>

<template>
  <BaseCard :class="cxLoanCardClasses" :data-test-id="`${dataTestId}-card`">
    <template #header>
      <div
        class="theme-loan-card-header theme-loan-card-with-border-bottom d-flex justify-content-between"
      >
        <BaseSkeletonLoader :is-loading="isLoading">
          <div class="d-flex align-items-center">
            <div class="theme-loan-card-header-logo">
              <!--TODO: Get the loan card logo from CMS-->
              <img
                :src="image?.url"
                :alt="image?.altText"
                class="theme-loan-card-header-logo-icon"
              />
            </div>
            <div class="theme-loan-card-header-title">
              <p>{{ loanTitle }}</p>
              <p>{{ loanLabel }} #{{ loanId }}</p>
            </div>
          </div>
          <div class="theme-loan-card-header-amount d-flex">
            <p>{{ amount }}</p>
            <RouterLink
              v-if="!isApplicationCard"
              :to="`/details/${loanId}`"
              :data-test-id="`${dataTestId}-card-link`"
              :aria-label="`${dataTestId}-card-link`"
            >
              <BaseIcon :name="IconNames.Info" :size="IconSizes.Medium" />
            </RouterLink>
          </div>
        </BaseSkeletonLoader>
      </div>
    </template>
    <template #title>
      <div class="theme-loan-card-details-header">
        <BaseKeyValueText
          :data-test-id="`${dataTestId}-card-balance`"
          text-direction="column"
          :label="balanceLabel"
          :value="balance ? formattedValues(Number(balance)) : '--'"
          :is-loading="isLoading"
        />
      </div>
    </template>

    <template #text>
      <div class="theme-loan-card-details-content row">
        <BaseSkeletonLoader :is-loading="isLoading">
          <div
            v-for="(item, index) in loanItems"
            :key="`${item.title}-${index}`"
            class="col-md-4"
          >
            <BaseKeyValueText
              :label="item?.title"
              :value="item?.title !== 'Status' ? item?.value || '--' : ''"
              :data-test-id="`${dataTestId}-${item.title}`"
              :is-loading="isLoading"
            >
              <template v-if="item?.title === 'Status'" #value>
                <BaseBadge
                  :label="item?.value ? item?.value : 'N/A'"
                  :badge-type="badgeType"
                />
              </template>
            </BaseKeyValueText>
          </div>
        </BaseSkeletonLoader>
      </div>
    </template>
    <template v-if="!isNakedCard" #footer>
      <slot name="footerContent" />
    </template>
  </BaseCard>
</template>

<style scoped>
p {
  font-family: 'Inter' !important;
}
</style>
