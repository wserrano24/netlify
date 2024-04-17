<script setup lang="ts">
import { Routes } from '@/constants/pages';
import { apiJobStatus } from '@/constants/api-values';
import { useSchema } from '@/composables/useSchema';
import { useFormValidState } from '@/composables/useFormValidState';
import { useFinancialFlowState } from '@/composables/useFinancialFlowState';
import { useRouter } from 'vue-router';
import { useCompositeValidState } from '@/composables/useCompositeValidState';
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import BaseForm from '@/components/base/BaseForm.vue';
import BaseRadioButton from '@/components/base/BaseRadioButton.vue';
import BaseAlert from '@/components/base/BaseAlert.vue';
import usePersonalInfo from '@/composables/usePersonalInfo';
import useContentfulSlug from '@/composables/useContentfulSlug';
const { useJobStatusSchema } = useSchema();
const schema = useJobStatusSchema();
const { getIncomeInfo, putIncomeInfo, postIncomeInfo } = usePersonalInfo();

const { setLoadingState, getFormLoadingState } = useFormValidState();
const { setJobStatus } = useFinancialFlowState();

const router = useRouter();

const { getCompositeValidState, setCompositeValidState } = useCompositeValidState();

const showAlert = ref(false);
const incomeId = ref(getCompositeValidState.value);

const userData = reactive({
  pending: true,
  data: {},
  entry: {},
});

const jobStatus = reactive({
  value: '',
  options: [],
});



const slug = ref();
let data:any


onMounted(async () => {

  setLoadingState(true);
  let employmentType = '';
  const { incomeSources } = await getIncomeInfo();
  slug.value = await useContentfulSlug({slug: 'widget-form-financial-job-status', contentTypeId: 'page'});
  data = computed(() => ({
  jobStatus: {
    EMPLOYED: slug?.value.formInputs.employedInput.label,
    RECEIVE_ASSISTANCE: slug?.value.formInputs.socialSecurity.label,
    SELF_EMPLOYED: slug?.value.formInputs.selfEmployed.label
  }
}))

  if (
    incomeSources.length === 3 &&
    getCompositeValidState.value === null &&
    !employmentType
  ) {
    return router.push(Routes.FinancialSummary);
  }

  if (getCompositeValidState.value !== null) {
    const id = getCompositeValidState;
    const dataIncome = await getIncomeInfo();
    userData.data = dataIncome;
    userData.entry = employmentType
      ? { employmentType }
      : userData?.data?.incomeSources.find(
          (item) => item?.incomeId === id?.value
        );
  }
  setLoadingState(false);
  userData.pending = false;
});

watchEffect(() => {
  changeRadioValue(data?.value.jobStatus[userData?.entry?.employmentType]);

  if (data?.value?.jobStatus) {
    jobStatus.options = [];
    Object.values(data?.value?.jobStatus).map((item) =>
      jobStatus.options.push(item)
    );
  }
});

function changeRadioValue(value: string) {
  jobStatus.value = value;
}
async function handleSubmit(res) {
  
  showAlert.value = false;


  const key = Object.keys(data?.value?.jobStatus).find(
    (key) => data?.value?.jobStatus[key] === res?.jobStatus
  );

  const payload = { employmentType: key };

  if (getCompositeValidState.value !== null) {
    
    await putIncomeInfo(payload, getCompositeValidState.value);

  } else {
    const newId = await postIncomeInfo(payload);
    setCompositeValidState(newId);
   incomeId.value = newId;
  }

  setJobStatus(key);
  key === apiJobStatus.employed
    ? router.push(Routes.FinancialEmployerInformation)
    : router.push(Routes.FinancialPaymentFrequency);
}
</script>

<template>
  <BaseForm
    id="formJobStatus"
    data-test-id="formJobStatus"
    :schema="schema"
    :submit="handleSubmit"
    hide-submit
  >
    <!-- TODO: The error messages returned by the service/contentful should be displayed -->
    <BaseAlert
      v-if="showAlert"
      data-test-id="formJobStatus-default"
      message="You can not add more than 3 sources of income"
    />
    <BaseRadioButton
      id="jobStatus-0"
      :checked-value="jobStatus.value"
      data-test-id="formJobStatus-status-0"
      :is-loading="getFormLoadingState || userData?.pending"
      :is-disabled="getFormLoadingState || userData?.pending"
      :is-validate-disabled="false"
      :label="data?.jobStatus[apiJobStatus.employed]"
      :value="data?.jobStatus[apiJobStatus.employed]"
      name="jobStatus"
      @click="changeRadioValue"
    />
    <BaseRadioButton
      id="jobStatus-1"
      :checked-value="jobStatus.value"
      data-test-id="formJobStatus-status-1"
      :is-loading="getFormLoadingState || userData?.pending"
      :is-disabled="getFormLoadingState || userData?.pending"
      :is-validate-disabled="false"
      :label="data?.jobStatus[apiJobStatus.selfEmployed]"
      :value="data?.jobStatus[apiJobStatus.selfEmployed]"
      name="jobStatus"
      @click="changeRadioValue"
    />
    <BaseRadioButton
      id="jobStatus-2"
      :checked-value="jobStatus.value"
      data-test-id="formJobStatus-status-2"
      :is-loading="getFormLoadingState || userData?.pending"
      :is-disabled="getFormLoadingState || userData?.pending"
      :label="data?.jobStatus[apiJobStatus.receiveAssistance]"
      :value="data?.jobStatus[apiJobStatus.receiveAssistance]"
      name="jobStatus"
      @click="changeRadioValue"
    />
    <input type="hidden" name="incomeId" :value="incomeId" />
  </BaseForm>
</template>
