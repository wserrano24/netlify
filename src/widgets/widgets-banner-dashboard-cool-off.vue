<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';
import useAvailLoan from '@/composables/useAvailLoan';
import useComposite from '@/composables/useComposite';
import { Colors } from '@/constants/colors';
import { IconNames } from '@/constants/icons';
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue';

const { getAvailLoanData } = useComposite();
const { getAvailLoan, setAvailLoanData } = useAvailLoan();
const coolOffDate = computed(() => getAvailLoan.value?.data?.coolOffDate);
let countdownInterval;

onBeforeMount(async () => {
  const availLoanData = await getAvailLoanData();
  setAvailLoanData(availLoanData);
  handleCountdownDisplay();
});

onMounted(() => {
   countdownInterval = setInterval(() => {
    handleCountdownDisplay();
  }, 60000);
});

onUnmounted(() => {
  clearInterval(countdownInterval);
});

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const displayString = ref('');

const handleCountdownDisplay = () => {
  const countdownDate = new Date(coolOffDate.value).getTime();
  let currentJSDateTime = new Date().getTime();
  let countdownDiff = countdownDate - currentJSDateTime;

  days.value = Math.floor(countdownDiff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((countdownDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes.value = Math.floor((countdownDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (days.value > 0) {
    displayString.value = `Apply in ${days.value} day${days.value > 1 ? 's' : ''} and ${hours.value} hour${hours.value > 1 || hours.value === 0 ? 's' : ''} and ${minutes.value} minute${minutes.value > 1 || minutes.value === 0 ? 's' : ''}`
  } else if (hours.value < 1) {
    displayString.value = `Apply in ${minutes.value} minute${minutes.value > 1 || minutes.value === 0 ? 's' : ''}`
  } else {
    displayString.value = `Apply in ${hours.value} hour${hours.value > 1 || hours.value === 0 ? 's' : ''} and ${minutes.value} minute${minutes.value > 1 || minutes.value === 0 ? 's' : ''}`
  }
}
</script>

<template>
  <div class="banner">
    <p class="banner-text">
      {{ displayString }}
      <BaseIcon
        class="banner-text-icon"
        :name="IconNames.Clock"
        :color="Colors.AAGreen"
      />
    </p>
  </div>
</template>

<style>
.banner {
  background-color: #e5f5fc;
  width: 100%;
  border-radius: 10px;
  position: relative;
}
.banner-text {
  padding: 20px;
  color: #068e2c;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: start;
}
.banner-text-icon {
  position: absolute;
  top: 30%;
  right: 2.5%;
}
</style>
