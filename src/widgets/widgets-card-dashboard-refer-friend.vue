<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import useComposite from '@/composables/useComposite';
import useContentfulSlug from '@/composables/useContentfulSlug';
import usePersonalInfo from '@/composables/usePersonalInfo';
import { onMounted, reactive, ref } from 'vue';

const slug = ref()
const {getPersonalInfo} = usePersonalInfo()
const state = reactive({
  validState: false,
});

onMounted(async () => {
  slug.value = await useContentfulSlug({ slug: 'widget-dashboard-refer-a-friend', contentTypeId: 'page' });
  const personalData = await getPersonalInfo();

  const validStates = [
    'CA',
    'IA',
    'MI',
    'RI',
    'WY',
    'IN',
    'AL',
    'DE',
    'FL',
    'ID',
    'MO',
    'MS',
    'NV',
    'OH',
    'OK',
    'UT',
    'WI',
  ];
  state.validState = validStates.includes(personalData.homeAddress.stateCode);

  (function (c, b, f, k, a) {
    c[b] = c[b] || {};
    for (c[b].q = c[b].q || []; a < k.length; ) f(k[a++], c[b]);
  })(
    window,
    'extole',
    function (c, b) {
      b[c] =
        b[c] ||
        function () {
          b.q.push([c, arguments]);
        };
    },
    ['createZone'],
    0
  );
  extole.createZone({
    name: 'account_summary_page',
    element_id: 'extole_zone_account_summary_page',
    data: {
      email: personalData.email,
      first_name: personalData?.personal?.firstName,
      last_name: personalData?.personal?.lastName,
      partner_user_id: personalData?.homeAddress?.purposeId,
      state: personalData?.homeAddress?.stateCode,
    },
  });
});
</script>
<template>
  <section v-if="state.validState" class="theme-dashboard-card-section">
    <BaseCard
      is-base-card
      data-test-id="refer-friend-card"
      class="theme-refer-friend-card"
    >
      <div class="theme-refer-friend-card-content banner-bottom-spacing">
          <h2 class="card-title">
            {{ slug?.title }}
          </h2>
          <p class="card-text">
            {{ slug?.copy.itPaysToShare }}
          </p>
      </div>

      <div class="btn-container banner-button-container">
        <span id="extole_zone_account_summary_page"></span>
      </div>
      <img
        :src="slug?.images.url"
        class="refer-friend-background-graphic"
        alt="profile cards graphic"
      />
    </BaseCard>
  </section>
</template>

<style>
.extole-cta-button {
  width: 50%;
  font-size: max(13px, 1.6vh) !important;
  background: #0e406a !important;
  color: white !important;
  transition: 0.3s !important;
  border-radius: 24px !important;
}

.extole-cta-button:hover {
  background: #072238 !important;
}

.banner-button-container {
  position: relative;
  margin-bottom: 80px;
  width: 100%;
  z-index: 1;
}

.banner-bottom-spacing {
  margin-bottom: 20px;
}

.refer-friend-background-graphic {
  position: absolute;
  bottom: -30px;
  right: 0px;
  pointer-events: none;
}
</style>
