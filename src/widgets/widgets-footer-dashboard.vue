<script setup lang="ts">
import { Colors } from '@/constants/colors';
import { FooterSocialLinks } from '@/constants/pages';
import { IconNames } from '@/constants/icons';
import { getWithDashLowercaseString } from '@/utils/strings';
import { FooterCtaRoutes } from '@/constants/pages';
import useCtaRoute from '@/composables/useCtaRoute';
import useContentfulSlug from '@/composables/useContentfulSlug';
import { onBeforeMount, ref } from 'vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import WidgetsModalTermsAndConditions from './widgets-modal-terms-and-conditions.vue';

const { mapFooterRoutes } = useCtaRoute();
const slug = ref()
const socialIcons = {
  Facebook: {
    name: IconNames.FaceBook,
  },
  Twitter: {
    name: IconNames.Twitter,
  },
  Instagram: {
    name: IconNames.Instagram,
  },
  'You Tube': {
    name: IconNames.YouTube,
  },
  Pinterest: {
    name: IconNames.Pinterest,
  },
};


const footerList = ref(null);
const privacyLinks = ref(null);
const socialLinks = ref(null);

onBeforeMount(async () => {
  slug.value = await useContentfulSlug({slug: 'widgets-application-footer', contentTypeId: 'page'});
  const buildFooterRoute = (label: string): string => FooterCtaRoutes[label] || '/';
  footerList.value = [
    {
      title: slug?.value?.cta?.aboutCta?.label,
      footerLinks: [
        [
          {
          label: slug?.value?.cta?.aboutCta?.ctas?.aboutUs,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.aboutUs)
        },
          {
          label: slug?.value?.cta?.aboutCta?.ctas?.careersCta,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.careersCta)
        },
          {
          label: slug?.value?.cta?.aboutCta?.ctas?.videosCta,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.videosCta)
        },
      ],
        [
          {
          label: slug?.value?.cta?.aboutCta?.ctas?.customerReviews,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.customerReviews)
        },
          {
          label: slug?.value?.cta?.aboutCta?.ctas?.moneyTips,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.moneyTips)
        },
        ]
      ]
    },
    {
      title: slug?.value?.cta?.supportCta?.label,
      footerLinks: [
      [
          {
          label: slug?.value?.cta?.supportCta?.ctas?.contactUs,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.contactUs)
        },
          {
          label: slug?.value?.cta?.aboutCta?.ctas?.storeLocator,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.storeLocator)
        },
          {
          label: slug?.value?.cta?.aboutCta?.ctas?.siteMap,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.siteMap)
        },
      ],
        [
          {
          label: slug?.value?.cta?.aboutCta?.ctas?.securityCta,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.securityCta)
        },
          {
          label: slug?.value?.cta?.aboutCta?.ctas?.accessibilityCta,
          route: buildFooterRoute(slug?.value?.cta?.aboutCta?.ctas?.accessibilityCta)
        },
        ]
      ],
    }
  ];

  privacyLinks.value = [slug?.value?.cta?.bottomLinksCta?.ctas?.privacyTerms, slug?.value?.cta?.bottomLinksCta?.ctas?.cookiesAdvertising];

  socialLinks.value = Object.keys(slug?.value?.cta?.socialCta?.ctas).map(social => slug?.value?.cta?.socialCta?.ctas[social])
});
</script>
<template>
  <footer class="theme-global-footer-dashboard" data-test-id="dashboard-footer">
    <div class="container">
      <div class="row">
        <div
          v-for="(footerWidget, index) in footerList || [1, 2]"
          :key="index"
          class="col-6 col-lg-3 theme-global-footer-dashboard-link-widget"
          :class="{ 'offset-lg-1': index === 1 }"
        >
            <h5>{{ footerWidget?.title || '' }}</h5>
          <div class="row">
            <!-- TODO: In footerLinks one cta is a `Apply Now`, which needs to show/hide dynamically later on -->
            <div
              v-for="(links, newIndex) in footerWidget?.footerLinks || [
                1, 2, 3, 4, 5, 6,
              ]"
              :key="newIndex"
              class="col-12 col-lg-6"
            >
                <ul class="nav flex-column">
                  <li v-for="link in links" :key="link.label">
                    <RouterLink
                      class="footer-link widget-item-link"
                      :to="mapFooterRoutes(link?.label)"
                      data-test-id="`dashboard-footer-${getWithDashLowercaseString(
                        link?.label || ''
                      )}-link`"
                      >{{ link?.label || '' }}</RouterLink
                    >
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-6 order-2 order-lg-1 d-flex align-items-center theme-global-footer-dashboard-privacy-links"
        >
          <div
            v-for="(item, index) in privacyLinks || [1, 2]"
            :key="`${item}-${index}`"
            :rows="[{ col: 10 }]"
          >
            <RouterLink
              :to="mapFooterRoutes(item)"
              class="footer-link"
              :data-test-id="`${item}-link`"
            >
              {{ item || '' }}
            </RouterLink>
          </div>
        </div>
        <div class="col-12 col-lg-6 order-1 order-lg-2 d-flex justify-content-start justify-content-lg-end theme-global-footer-dashboard-social-links"
        >
          <ul class="nav">
              <li
                v-for="(link, index) in socialLinks || [1, 2, 3, 4, 5]"
                :key="`social-link-${index}`"
              >
                <!--NOTE: Using anchor tag since it is external redirection-->
                <a
                  :data-test-id="`dashboard-footer-${getWithDashLowercaseString(
                    link?.fields?.label || ''
                  )}-social-link`"
                  :href="FooterSocialLinks[link]"
                  class="theme-global-footer-dashboard-item"
                  target="_blank"
                  noreferrer
                  noopener
                >
                  <BaseIcon
                    :name="socialIcons[link]?.name"
                    :color="Colors.White"
                  />
                  <span class="d-none">{{
                    socialIcons[link]?.name
                  }}</span>
                </a>
              </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="theme-global-footer-dashboard-copyright-details">
            <div class="d-flex theme-global-footer-images">
                <img :src="slug?.images?.shieldLogo?.url" :alt="slug?.images?.shieldLogo?.altText" />
              <div
                id="ola-member-seal"
                class="theme-ola-member-seal-image-wrapper"
              ></div>
            </div>
          </div>
            <p>
              {{ slug?.labels?.allRightsReserved || '' }}
            </p>
        </div>
      </div>
    </div>
    <WidgetsModalTermsAndConditions />
  </footer>
</template>
