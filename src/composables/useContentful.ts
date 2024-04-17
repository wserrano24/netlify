import { useAsyncData } from "./useAsyncData";
import useComposite from "./useComposite";

export default () => {
    const { getContentful } = useComposite();


    async function getMoneyCardSlider(slug: string) {
        const res = await getContentful(
            `pageWidgetMoneyCardSlider?fields.slug=${slug}`
        );

        const cardsFields = res?.entries?.[0]?.fields?.find(
            (item) => item?.id === 'cards'
        )?.fields?.cards;

        const titleFields = res?.entries?.[0]?.fields?.find(
            (item) => item?.id === 'title'
        )?.fields;

        const cards:any = [];
        cardsFields[0]?.fields?.cards?.forEach((item:any) => {
            cards.push({
                cardType: item?.fields?.cardType?.fields?.label,
                copy: item.fields?.copy?.fields?.content?.content[0]?.content[0]?.value,
                dataTestId: `${item?.fields?.cardType?.fields?.label}-card`,
                logo: item?.fields?.logo?.fields?.cloudinary[0]?.secure_url || '',
                logoAlt: item?.fields?.logo?.fields?.internalName,
                title: item?.fields?.title?.fields?.label,
            });
        });

        return {
            cards,
            sectionTitle: titleFields?.label,
        };
    }

   async function getMoneyCardSliderData(slug: string) {
        return await useAsyncData(
            `${slug}-money-card-slider-data`,
            async () => {
                const fields = await getMoneyCardSlider(slug);
                return {
                    ...fields,
                };
            },
            { server: false }
        );
    }
    function getAlertBannerData(slug: string) {
        return useAsyncData(
            `${slug}-alert-banner-data`,
            async () => {
                const fields = await getAlertBanner(slug);
                return { ...fields };
            },
            { server: false }
        );
    }

    async function getAlertBanner(slug: string) {
        const res = await getContentful(
            `pageWidgetAlertBanner?fields.slug=${slug}`
        );
        const fields = res?.entries[0]?.fields[1]?.fields;
        const heading = fields?.title?.fields?.label;
        const description =
            fields?.description?.fields?.content?.content[0]?.content[0]?.value;
        const linkLabel = fields?.link?.fields?.label;

        if (slug === 'widget-banner-add-to-home-screen') {
            const bannerImg = fields?.icon?.fields?.cloudinary[0]?.secure_url;

            return {
                heading,
                bannerImg,
            };
        }
        if (slug === 'widget-alert-ccpa-banner') {
            const descriptionNextLine =
                fields?.description?.fields?.content?.content[1]?.content[0]?.value;
            const descriptionLastLine =
                fields?.description?.fields?.content?.content[2]?.content[0]?.value;

            return {
                heading,
                description,
                linkLabel,
                descriptionNextLine,
                descriptionLastLine,
            };
        }
        if (slug === 'widget-alert-banner-refinance-ilp') {
            const descriptionAlt =
                fields?.description?.fields?.content?.content[1]?.content[0]?.value;

            return {
                descriptionAlt,
                heading,
                description,
                linkLabel,
            };
        }

        return {
            heading,
            description,
            linkLabel,
        };
    }
    function getCtaData(slug: string) {
        return useAsyncData(
            `${slug}-cta-data`,
            async () => {
                const fields = await getCta(slug);

                return {
                    ...fields,
                };
            },
            { server: false }
        );
    }
    async function getCta(slug: string) {
        const { mapCtaRoutes } = useCtaRoute();

        const res = await getContentful(`pageWidgetCta?fields.slug=${slug}`);
        const fields = res?.entries?.[0]?.fields;

        const ctaList = fields?.[1]?.fields?.ctaList?.map((cta) => ({
            label: cta?.fields?.label,
            docType: cta?.fields?.type,
            url: mapCtaRoutes(cta?.fields?.label),
        }));

        return {
            ctaList,
        };
    }

    async function getLoanDetailsSummaryCard(slug: string) {
        const res = await getContentful(
          `pageWidgetLoanSummaryCard?fields.slug=${slug}`
        );
        const fields = res?.entries[0]?.fields[1]?.fields;
        const title = fields?.heading?.fields?.label || '';
        const titleIlp = fields?.headingIlp?.fields?.label || '';
        const subTitle = fields?.subHeading?.fields?.label || '';
        const balanceLabel = fields?.balanceLabel?.fields?.label || '';
        const availableCreditLabel =
          fields?.availableCreditLabel?.fields?.label || '';
        const trackerContent = {} as { [key: string]: string };
        res?.entries?.[0]?.fields
          ?.find((item) => item?.id === 'trackerContent')
          ?.fields?.trackerContent?.forEach((el) => {
            const { key, value } = el.fields;
            trackerContent[key] = value;
          });
    
        const productStatus = {} as { [key: string]: string };
        res?.entries?.[0]?.fields
          ?.find((item) => item?.id === 'productStatus')
          ?.fields?.productStatus?.forEach((el) => {
            const { key, value } = el.fields;
            productStatus[key] = value;
          });

        if (
          [
            'widget-loan-summary-card-payday-refinance',
            'widget-loan-summary-card-title-loan-refinance',
            'widget-loan-summary-card-installment-loan-refinance',
            'widget-loan-summary-card-payday',
            'widget-loan-summary-card-line-of-credit',
          ].includes(slug)
        ) {
    return {
            loanTitle: title,
            loanTypes: {
              [LoanTypes.Payday]: title,
              [LoanTypes.Installment]: titleIlp,
              [LoanTypes.LineOfCredit]: title,
            },
            loanLabel: subTitle,
            balanceLabel,
            availableCreditLabel,
            loanItems: [
              fields?.statusLabel?.fields?.label,
              fields?.dueAmountLabel?.fields?.label,
              fields?.dueDateLabel?.fields?.label,
            ],
            ctaList: fields?.cta?.fields?.ctaList.map(
              (ctaData) => ctaData?.fields?.label
            ),
            productStatus,
            trackerContent,
          };
        }
    
        const headerLabels = [
          fields?.dueAmountLabel?.fields?.label,
          fields?.dueDateLabel?.fields?.label,
        ];
    
        const detailsLabels = [
          balanceLabel,
          fields?.statusLabel?.fields?.label,
          fields?.loanNumberLabel?.fields?.label,
          fields?.makeAndModelLabel?.fields?.label,
          fields?.vinNumberLabel?.fields?.label,
          fields?.autopayLabel?.fields?.label,
        ].filter((label) => label);
    
        return {
          title,
          headerLabels,
          detailsLabels,
        };
      }
    function getLoanDetailsSummaryCardData(slug: string) {
        return useAsyncData(
          `${slug}-details-summary-card`,
          async () => {
            const fields = await getLoanDetailsSummaryCard(slug);
            return { ...fields };
          },
          { server: false }
        );
      }
    return {
        getMoneyCardSliderData,
        getAlertBannerData,
        getCtaData,
        getLoanDetailsSummaryCardData
    }
}