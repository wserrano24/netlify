<script setup lang="ts">
import useContentfulImage from '@/composables/useContentfulImage';
import { IconNames, IconSizes } from '@/constants/icons';
import { computed, onMounted, ref } from 'vue';
import BaseCard from './base/BaseCard.vue';
import BaseSkeletonLoader from './base/BaseSkeletonLoader.vue';
import BaseKeyValueText from './base/BaseKeyValueText.vue';
import BaseBadge from './base/BaseBadge.vue';

interface Props {
  amount: string;
  badgeType: 'pending';
  balanceLabel: string;
  dataTestId: string;
  loanId: number | string;
  loanLabel: string;
  loanTitle: string;
  isNakedCard?: boolean;
  loanType: 'installment' | 'line-of-credit' | 'payday' | 'title';
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isNakedCard: false,
});

const cxLoanCardClasses = computed(() => [
  'theme-loan-card',
  {
    'theme-loan-card-naked': Boolean(props.isNakedCard),
  },
]);

const abandonedLoanItems = [
  {
    title: 'Status',
    value: 'Pending',
  },
  {
    title: 'Minimum due',
    value: '--',
  },
  {
    title: 'Due date',
    value: '--',
  },
]

const image = ref()

onMounted(async ()=>{
  image.value = await useContentfulImage('1yffvagpom52SjPUBYEdce');
})
</script>

<template>
  <BaseCard class="theme-loan-card" :data-test-id="`${dataTestId}-card`">
    <template #header>
      <div class="theme-loan-card-header theme-loan-card-with-border-bottom d-flex justify-content-between">
        <BaseSkeletonLoader :is-loading="isLoading">
          <div class="d-flex align-items-center">
            <div class="theme-loan-card-header-logo">
              <!--TODO: Get the loan card logo from CMS-->
              <img
                :src="image.url"
                :alt="image.altText"
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
              :aria-label="`${dataTestId}-card-link`">
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
          :value="'--'"
          :is-loading="isLoading"
        />
      </div>
    </template>

    <template #text>
      <div class="theme-loan-card-details-content row">
        <BaseSkeletonLoader :is-loading="isLoading">
          <div
            v-for="(item, index) in abandonedLoanItems"
            :key="`${item.title}-${index}`"
            class="col-md-4">
            <BaseKeyValueText
              :label="item?.title"
              :value="item?.title !== 'Status' ? item?.value || '--' : ''"
              :data-test-id="`${dataTestId}-${item.title}`"
              :is-loading="isLoading">
              <template v-if="item?.title === 'Status'" #value>
                <BaseBadge
                  :label="item?.value"
                  :badge-type="'pending-esign'"
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
