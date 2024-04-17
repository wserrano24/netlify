<script setup lang="ts">
import {
  FundingMethodType,
  FundingTrackerStatus,
  LoanTrackerResponse,
} from '@/types/loan-tracker';
import { IconNames, IconSizes } from '@/constants/icons';
import { ModalIds } from '@/constants/modal-ids';
import { Routes } from '@/constants/pages';
import { formatDate } from '@/composables/schemas/useDate';
import { ProductTracker } from '@/composables/useContentfulSlug';
import { computed } from 'vue';
import router from '@/router';
import BaseProgressBar from './BaseProgressBar.vue';
import BaseIcon from './BaseIcon.vue';
import WidgetsModalPickupInStore from '@/widgets/widgets-modal-pickup-in-store.vue';
import WidgetsModalSentReceivedInstantly from '@/widgets/widgets-modal-sent-received-instantly.vue';
import WidgetsModalSentNotReceived from '@/widgets/widgets-modal-sent-not-received.vue';

interface Props {
  dataTestId: string;
  loanTrackerDetails: LoanTrackerResponse;
  trackerContent: ProductTracker;
}

const props = defineProps<Props>();

const isFundingTypeDebit = computed(
  () =>
    props.loanTrackerDetails?.fundingMethodType === FundingMethodType.DEBIT_CARD
);
const isFundingTypeBankAccount = computed(
  () =>
    props.loanTrackerDetails?.fundingMethodType ===
    FundingMethodType.BANK_ACCOUNT
);
const isFundingTypeInStore = computed(
  () =>
    props.loanTrackerDetails?.fundingMethodType ===
    FundingMethodType.STORE_PICKUP
);

const infoModalId = computed(() => {
  if (isFundingTypeDebit.value)
    return ModalIds.MONEY_SENT_AND_RECEIVED_INSTANTLY_INFO;
  if (isFundingTypeBankAccount.value)
    return ModalIds.MONEY_SENT_BUT_NOT_RECEIVED_INFO;
  if (isFundingTypeInStore.value)
    return ModalIds.MONEY_SENT_AND_PICK_UP_IN_STORE_INFO;
});

const footerTextLeft = computed(() => {
  let prefix = props.trackerContent?.estimatedArrivalDate?.value || props.trackerContent?.estimatedArrivalDate;
  if (isFundingTypeInStore.value) {
    prefix = props.trackerContent?.fundsAvailableUntilLabel?.value || props.trackerContent?.fundsAvailableUntilLabel;
  }

  const date = formatDate(props.loanTrackerDetails?.estimatedArrivalDate);

  return `${prefix} ${date}`;
});

const footerTextRight = computed(() => {
  const prefix = isFundingTypeDebit.value
    ? props.trackerContent.debitCardLabel.value || props.trackerContent.debitCardLabel
    : props.trackerContent.bankCardLabel.value || props.trackerContent.bankCardLabel;
  const fourDigitCardNumber =
    props.loanTrackerDetails?.acctLastFourDigit || '**';

  return `${prefix}${fourDigitCardNumber}`;
});

const progressBarProps = computed(() => {
  if (isFundingTypeBankAccount.value &&
      props.loanTrackerDetails?.fundingStatus ===
      FundingTrackerStatus.ARRIVED) {
    return { progress: 50, theme: 'goldenrod' }
  } else {
    return props.loanTrackerDetails?.fundingStatus ===
      FundingTrackerStatus.ARRIVED
      ? { progress: 100, theme: 'green' }
      : { progress: 50, theme: 'goldenrod' };
  }
});
</script>
<template>
  <div class="theme-loan-card-tracker" :data-test-id="`${dataTestId}-tracker`">
    <button
      :aria-controls="infoModalId"
      :data-bs-target="`#${infoModalId}`"
      class="theme-loan-card-tracker-modal-cta"
      data-bs-toggle="modal"
      data-test-id="info-modal-open"
    >
      <BaseIcon :name="IconNames.Info" :size="IconSizes.Small" />
      <span>{{props.trackerContent?.moneySentLabel.value || props.trackerContent?.moneySentLabel}}</span>
    </button>
    <BaseProgressBar
      :class="`theme-loan-card-tracker-${progressBarProps?.theme}`"
      :progress="progressBarProps?.progress"
    />
    <div class="theme-loan-card-tracker-footer">
      <p>{{ footerTextLeft }}</p>
      <router-link
        v-if="isFundingTypeInStore"
        :to="Routes.StoreLocator"
        data-test-id="store-locator-link"
      >
        {{ props.trackerContent?.pickUpInStoreLinkLabel.value }}
      </router-link>
      <p v-else>{{ footerTextRight }}</p>
    </div>
    <WidgetsModalPickupInStore />
    <WidgetsModalSentNotReceived />
    <WidgetsModalSentReceivedInstantly />
  </div>
</template>
