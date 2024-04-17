import { ChainModifiers, EntryCollection, EntrySkeletonType } from "contentful";
import {created} from "@/plugins/contentful";

const content = created()

interface Copy {
  [key: string]: string;
}

interface NestedCopy {
  [key: string]: {
    copy: string;
  };
}

type CopyRecord = Copy & NestedCopy;

interface SEO {
  name: string;
  title: string;
}

interface Image {
  altText: string;
  url: string;
}

type ImageRecord = {
  [key: string]: Image;
} & Image;

interface GenericRecord {
  [key: string]: string;
}

export interface ProductTracker {
  [key: string]: {
    label: string;
    value: string;
  };
}

interface Step {
  [key: string]: {
    copy: string;
    title: string;
    stepNo: number;
  };
}

type Resource = GenericRecord & {
  [key: string]: GenericRecord;
} & {
  [key: string]: {
    [key: string]: GenericRecord;
  };
};

interface FormInputI {
  [key: string]: {
    label?: string;
    value?: string;
  };
}

type FormInputs = FormInputI & { [key: string]: string };

type CardDescType = unknown & string & { [key: number]: string };

interface CardDescription {
  label?: string;
  copy?: CardDescType;
}
interface Cards {
  description?: CardDescription;
  header?: string;
  isRecommended?: boolean;
  link?: string;
  title?: string;
}

interface ModalContent {
  copy?: CardDescType;
  title?: string;
  icon?: {
    url: string;
    altText: string;
  };
  labels?: GenericRecord;
  slug?: string;
  documentLink?: string;
}

interface Disclosures {
  key?: string;
  cta?: string;
  copy?: CardDescType;
  label?: string;
  modalContent?: ModalContent;
}
export interface ContentfulSlug
  extends EntryCollection<EntrySkeletonType, ChainModifiers, string> {
  title?: string;
  copy?: CopyRecord;
  cta?: Resource;
  seo?: SEO;
  images?: ImageRecord;
  labels?: GenericRecord;
  steps?: Step;
  resources?: Resource;
  productStatus?: ProductTracker;
  trackerContent?: ProductTracker;
  formInputs?: FormInputs;
  keyValueList?: GenericRecord;
  cards?: Cards;
  disclosures?: Disclosures[];
}

export default async function useContentfulSlug({ slug, contentTypeId }: {slug: string; contentTypeId: string; }): Promise<ContentfulSlug | null> {

  try {
    const pageData = await content.getEntries({
      content_type: contentTypeId,
      include: 10,
      "fields.slug": slug,
    });

    return processData(pageData);
  
  } catch (error) {
  
    console.error("Error fetching data from Contentful:", error);
  
  }

  return null;
}


function processData(data:any): ContentfulSlug {
  const key = getKey(
    ['items[0].fields.content.fields', 'items[0].fields'],
    data
  );
  if (key && !checkIfKeyExist(data, 'items[0].fields.resources')) {
    const fields = getNestedObject(key, data);
    return Object.assign(
      data,
      processTitle(fields),
      processImages(fields),
      processSEO(data.items[0].fields),
      processCopy(fields),
      processCta(fields),
      processDocuments(fields),
      processSteps(fields),
      processProductTracker(fields),
      processFormInputs(fields),
      processKeyValueList(fields),
      processCards(fields),
      processDisclosures(fields),
      { labels: { ...processLabels(fields), ...processSpecialLabels(fields) } }
    );
  }
  if (checkIfObjectContainsLinks(data)) {
    return Object.assign(data, processIncludes(data));
  }
  if (checkIfKeyExist(data, 'items[0].fields.resources')) {
    return Object.assign(data, processResources(data.items[0].fields));
  }

  return data;
}

function processDisclosures(data:any): { disclosures: Disclosures[] } | any {
  const keys = ['disclosuresList'].filter((key) => checkIfKeyExist(data, key));
  if (keys.length) {
    try {
      const disclosures: Disclosures[] = [];
      keys.forEach((key) => {
        if (Array.isArray(getNestedObject(key, data))) {
          getNestedObject(key, data).forEach(({ fields } ) => {

            const objDisclosure: Disclosures = {};

            if (!fields.key) {
              console.warn(
                `${data.slug} disclosure list doesn't have keys, add them in Contentful`
              );
              return;
            }
            objDisclosure.key = fields.key;
            objDisclosure.label = fields.label;
            objDisclosure.cta = fields.cta;

            // copy
            if (checkIfKeyExist(fields, 'content.content')) {
              objDisclosure.copy = {} as CardDescType;

              fields.content.content.forEach(({ content }, index) => {
                objDisclosure.copy[index] = content[0].value;
              });
            }

            // modal content
            if (checkIfKeyExist(fields, 'modalContent')) {
              objDisclosure.modalContent = {} as ModalContent;
              objDisclosure.modalContent.title =
                fields.modalContent.fields.title.fields.label;

              //  modal copy
              if (
                checkIfKeyExist(
                  fields,
                  'modalContent.fields.copy.fields.content.content'
                ) &&
                Array.isArray(
                  fields.modalContent.fields.copy.fields.content.content
                )
              ) {
                objDisclosure.modalContent.copy = {} as CardDescType;

                fields.modalContent.fields.copy.fields.content.content.forEach(
                  ({ content }, index) => {
                    objDisclosure.modalContent.copy[
                      `${fields.modalContent.fields.copy.fields.key}${index}`
                    ] = content[0].value;
                  }
                );
              }

              //  modal footerNote
              if (
                checkIfKeyExist(
                  fields,
                  'modalContent.fields.footerNote.fields.key'
                )
              ) {
                objDisclosure.modalContent.copy[
                  fields.modalContent.fields.footerNote.fields.key
                ] = fields.modalContent.fields.footerNote.fields.label;
              }

              // modal icon
              if (checkIfKeyExist(fields, 'modalContent.fields.icon')) {
                objDisclosure.modalContent.icon = {
                  url: `https:${fields.modalContent.fields.icon.fields.image.fields.file.url}`,
                  altText:
                    fields.modalContent.fields.icon.fields.image.fields
                      .description ||
                    fields.modalContent.fields.icon.fields.image.fields.title,
                };
              }

              // modal saveButton/cta
              if (checkIfKeyExist(fields, 'modalContent.fields.saveButton')) {
                objDisclosure.modalContent.labels = {
                  [fields.modalContent.fields.saveButton.fields.key]:
                    fields.modalContent.fields.saveButton.fields.label,
                };
              }

              // modal slug
              if (checkIfKeyExist(fields, 'modalContent.fields.slug')) {
                objDisclosure.modalContent.slug =
                  fields.modalContent.fields.slug;
              }

              // modal additionalImages
              if (
                checkIfKeyExist(
                  fields,
                  'modalContent.fields.additionalImages.fields.imagesSet'
                )
              ) {
                const imageSet = getNestedObject(
                  'modalContent.fields.additionalImages.fields.imagesSet',
                  fields
                );
                if (Array.isArray(imageSet) && imageSet.length === 1) {
                  objDisclosure.modalContent.documentLink = `https:${imageSet[0].fields.image.fields.file.url}`;
                }
              }
            }
            disclosures.push(objDisclosure);
          });
        }
      });
      return {
        disclosures,
      };
    } catch (error) {
      console.warn(error);
    }
  }
}

function processCards(data): { cards: Cards } {
  const keys = ['cards'].filter((key) => checkIfKeyExist(data, key));

  if (keys.length) {
    const cards: Cards = {};
    try {
      keys.forEach((key) => {
        const cardsContent = getNestedObject(key, data);
        if (Array.isArray(cardsContent)) {
          cardsContent.forEach(({ fields }) => {
            const {
              title,
              description: descriptionContent,
              link,
              isRecommended,
              header,
            } = fields;
            const description: CardDescription = {
              label: descriptionContent && descriptionContent.fields.label,
            };

            if (
              descriptionContent &&
              checkIfKeyExist(descriptionContent, 'fields.content.content')
            ) {
              if (
                getNestedObject('fields.content.content', descriptionContent)
                  .length > 1
              ) {
                description.copy = {} as CardDescType;
                getNestedObject(
                  'fields.content.content',
                  descriptionContent
                ).forEach((desc, index) => {
                  description.copy[`${descriptionContent.fields.key}${index}`] =
                    checkIfKeyExist(desc, 'content[0].value')
                      ? desc.content[0].value
                      : undefined;
                });
              } else {
                description.copy = checkIfKeyExist(
                  descriptionContent,
                  'fields.content.content[0].content[0].value'
                )
                  ? descriptionContent.fields.content.content[0].content[0]
                      .value
                  : undefined;
              }
            }
            cards[title.fields.key] = {
              isRecommended,
              header,
              description,
              title: title && title.fields.label,
              link: link && link.fields.label,
            };
          });
        }
      });
    } catch (error) {
      console.warn(error);
    }

    return {
      cards,
    };
  }
}

function processKeyValueList(data): { keyValueList: GenericRecord } {
  const keys = ['contents[0].fields.keyValueList'].filter((key) =>
    checkIfKeyExist(data, key)
  );
  if (keys.length) {
    const keyValueList = {};
    try {
      keys.forEach((key) => {
        getNestedObject(key, data).forEach(({ fields }) => {
          keyValueList[fields.key] = fields.value;
        });
      });
    } catch (error) {
      console.warn(error);
    }
    return {
      keyValueList,
    };
  }
}

function processFormInputs(data): FormInputs {
  const keys = ['formInputs.fields.inputs'].filter((key) =>
    checkIfKeyExist(data, key)
  );
  if (keys.length) {
    const formInputs: FormInputs = {};
    try {
      keys.forEach((key) => {
        getNestedObject(key, data).forEach(({ fields }) => {
          formInputs[fields.key] = {
            label: fields.label,
            value: fields.value,
          };

          const inputLabelLocation = findKeyLocation(data, key, 'label');
          const inputKeyLocation = findKeyLocation(data, key, 'key');

          if (inputLabelLocation && inputKeyLocation) {
            formInputs[getNestedObject(inputKeyLocation, data).key] =
              getNestedObject(inputLabelLocation, data).label;
          }
        });
      });
    } catch (error) {
      console.warn(error);
    }
    return {
      formInputs,
    };
  }
}

function processProductTracker(data): {
  productStatus?: ProductTracker;
  trackerContent?: ProductTracker;
} {
  const keys = [
    checkIfKeyExist(data, 'productStatus') && 'productStatus',
    checkIfKeyExist(data, 'trackerContent') && 'trackerContent',
  ].filter((key) => key);
  if (keys.length) {
    try {
      return Object.assign(
        {},
        keys.reduce((obj, key) => {
          if (checkIfKeyExist(data, key) && Array.isArray(data[key])) {
            return {
              ...obj,
              [key]: Object.assign(
                {},
                ...data[key].map(({ fields }) => ({
                  [fields.key]: {
                    label: fields.internalName,
                    value: fields.value,
                  },
                }))
              ),
            };
          }
        }, {})
      );
    } catch (error) {
      console.warn(error);
    }
  }
}

function processSteps(data: any): { steps: Step } {
  const key = getKey(['steps.fields.steps', 'steps'], data);
  if (key) {
    try {
      return {
        steps: Object.assign(
          {},
          checkIfKeyExist(data, 'steps.fields.label') && {
            label: data.steps.fields.label,
          },
          {
            ...getNestedObject(key, data).reduce((obj, { fields }, index) => {
              const copyKeyPath = findPath(
                fields,
                'copy.fields.content.content[0].content[0].value'
              );
              const titleKeyPath = findPath(fields, 'title.fields.label');
              return {
                ...obj,
                [fields.type || fields.key]: {
                  copy: getNestedObject(copyKeyPath, fields),
                  title: getNestedObject(titleKeyPath, fields),
                  stepNo: index,
                },
              };
            }, {}),
          }
        ),
      };
    } catch (error) {
      console.warn('useContentfulSlug Error: ', error);
    }
  }
}

function processSpecialLabels(data: unknown): GenericRecord {
  const keys = [
    'saveButton.fields',
    'entry.fields.link.fields',
    'modalLink.fields',
    'footerNote.fields',
    'emailInput.fields',
    'copyrightText.fields',
    'extraLabel.fields',
    'seeAllLink.fields',
    'links.fields.links',
    'link1.fields',
    'link2.fields',
    'link3.fields',
  ].filter((key) => checkIfKeyExist(data, key));

  if (keys.length) {
    const labels: GenericRecord = {};

    keys.forEach((key) => {
      if (Array.isArray(getNestedObject(key, data))) {
        try {
          getNestedObject(key, data).forEach(({ fields }) => {
            labels[fields.key] = fields.label;
          });
        } catch (error) {
          console.warn(error);
        }
      } else {
        try {
          labels[getNestedObject(key, data).key] = getNestedObject(
            key,
            data
          ).label;
        } catch (error) {
          console.warn(error);
        }
      }
    });
    return {
      ...labels,
    };
  }
}

function processDocuments(docs): { documents: GenericRecord } {
  const key = getKey(['documents.fields.documents'], docs);
  if (key) {
    const entries = getNestedObject(key, docs);
    if (Array.isArray(getNestedObject(key, docs))) {
      try {
        return {
          documents: Object.assign(
            {},
            ...entries.map(({ fields }) =>
              Object.assign(
                {},
                checkIfKeyExist(fields, 'title.fields.key') && {
                  [fields.title.fields.key]: fields.title.fields.label,
                },
                checkIfKeyExist(fields, 'ctaList.fields.ctaList') && {
                  ...processCta(fields).cta,
                }
              )
            )
          ),
        };
      } catch (error) {
        console.warn('useContentfulSlug Error: ', error);
      }
    }
  }
}

function processResources(data: unknown): { resources: Resource } {
  const key = getKey(['resources'], data);
  if (key) {
    if (!Array.isArray(getNestedObject(key, data))) {
      return;
    }
    try {
      return {
        resources: Object.assign(
          {},
          ...getNestedObject(key, data).map(({ fields }) => {
            if (checkIfKeyExist(fields, 'resources')) {
              return {
                [fields.key]: Object.assign(
                  {},
                  processResources(fields).resources
                ),
              };
            } else if (
              checkIfKeyExist(fields, 'key') &&
              checkIfKeyExist(fields, 'image')
            ) {
              return {
                [fields.key]: { ...processImages(fields).images },
              };
            } else if (
              checkIfKeyExist(fields, 'label') &&
              checkIfKeyExist(fields, 'content')
            ) {
              return {
                [fields.key]: fields.content.content[0].content[0].value,
                [`${fields.key}Label`]: fields.label,
              };
            } else if (
              checkIfKeyExist(fields, 'label') &&
              checkIfKeyExist(fields, 'key')
            ) {
              return {
                [fields.key]: fields.label,
              };
            } else if (
              checkIfKeyExist(fields, 'key') &&
              checkIfKeyExist(fields, 'longFormText')
            ) {
              return {
                [fields.key]: fields.longFormText,
              };
            }
          })
        ),
      };
    } catch (error) {
      console.warn('useContentfulSlug Error: ', error);
    }
  }
}

function processIncludes(data): any {
  const { fields } = data.items[0];
  try {
    return Object.keys(fields).reduce((obj, key) => {
      if (!Array.isArray[fields[key]] && typeof fields[key] === 'object') {
        const matchedEntry = data.includes.Entry.find(
          ({ sys }) => sys.id === fields[key].sys.id
        );
        if (
          checkIfKeyExist(matchedEntry, `fields.${key}`) &&
          getNestedObject(`fields.${key}`, matchedEntry).length > 1
        ) {
          return {
            ...obj,
            [key]: Object.assign(
              {},
              ...matchedEntry.fields[key].map(
                ({ fields }) => processCta(fields.ctaList.fields).cta
              )
            ),
          };
        } else if (checkIfKeyExist(matchedEntry, `fields.key`)) {
          return {
            ...obj,
            [key]: checkIfKeyExist(matchedEntry, `fields.label`)
              ? getNestedObject(`fields.label`, matchedEntry)
              : undefined,
          };
        }
      }
      return obj;
    }, {});
  } catch (error) {
    console.warn('useContentfulSlug Error: ', error);
  }
}

function processCta(data): { cta: Resource } {
  const keys = [
    'cta.fields.ctaList',
    'cta.fields',
    'ctaList.fields.ctaList',
    'ctaList',
    'ctas',
    'entry.fields.cta.fields.ctaList',
    'card.fields.cardCta.fields',
    'headerLink.fields',
    'aboutLinks.fields.ctaList',
    'bottomLinks.fields.ctaList',
    'locationLinks.fields.ctaList',
    'socialLinks.fields.ctaList',
    'supportLinks.fields.ctaList',
  ].filter((key) => checkIfKeyExist(data, key));

  if (keys.length) {
    const cta = {};

    keys.forEach((key) => {
      try {
        if (!Array.isArray(getNestedObject(key, data))) {
          const prop = getKey(['key', 'type'], data);
          const itemKey = prop
            ? getNestedObject(`${key}.${prop}`, data)
            : 'ctaLabel';
          cta[itemKey] = getNestedObject(key, data).label;
        }
        const ctaKeyPath = findKeyLocation(data, key, 'key');
        const ctaLabelPath = findKeyLocation(data, key, 'label');
        const ctaKey = ctaKeyPath && getNestedObject(`${ctaKeyPath}.key`, data);
        const ctaLabel =
          ctaLabelPath && getNestedObject(`${ctaLabelPath}.label`, data);
        Object.assign(
          cta,
          getNestedObject(key, data).reduce((obj, { fields }) => {
            const ctas = {};
            if (checkIfKeyExist(fields, 'key')) {
              ctas[fields.key] = fields.label;
            } else {
              ctas[fields.type] = fields.label;
            }
            if (ctaKey && ctaLabel) {
              if (checkIfKeyExist(obj, ctaKey)) {
                obj[ctaKey].ctas = Object.assign(obj[ctaKey].ctas, { ...ctas });
              } else {
                obj[ctaKey] = {
                  label: ctaLabel,
                  ctas,
                };
              }
              return obj;
            }
            return {
              ...obj,
              ...ctas,
            };
          }, {})
        );
      } catch (error) {
        console.warn('useContentfulSlug Error: ', error);
      }
    });
    return {
      cta,
    };
  }
}

function processCopy(data, copyIndex = 1) {
  let key = getKey(
    [
      'entry.fields.description.fields.content.content',
      'copy.fields.content.content',
      'copy',
      'entry.fields.description',
      'card.fields.copy',
      'description.fields.content.content',
      'privacyPolicy.content',
      `copyLine${copyIndex}`,
      'formInputs.fields.inputCopy',
    ],
    data
  );
  if (!key) {
    key = findPath(data, 'entry.fields.description');
  }
  if (key) {
    try {
      if (key === 'copy.fields.content.content') {
        if (getNestedObject('copy.fields.content.content', data).length === 1) {
          return {
            copy: getNestedObject(`${key}[0].content[0].value`, data),
          };
        } else {
          // the array of 'copy.fields.content.content' does not contain multiple keys, using the key and adding the index to it
          const contentfulKey = findKeyLocation(data, key, 'key');
          return {
            copy: getNestedObject(key, data).reduce(
              (obj, { content }, index) => {
                const prop = contentfulKey
                  ? `${getNestedObject(contentfulKey, data).key}${index}`
                  : index;
                return {
                  ...obj,
                  [prop]: content[0].value,
                };
              },
              {}
            ),
          };
        }
      } else if (
        key !== 'copy.fields.content.content' &&
        Array.isArray(getNestedObject(key, data))
      ) {
        return {
          copy: Object.assign(
            {},
            ...getNestedObject(key, data).map((item, index) => {
              const prop = getKey(['fields', 'content'], item);
              const contentfulKey =
                findKeyLocation(data, key, 'key') ||
                findKeyLocation(item, 'fields', 'key');
              const valuePath =
                findPath(item, 'content.content[0].content[0].value') ||
                findPath(item, 'fields.content.content[0].content[0].value');
              const itemKey = checkIfKeyExist(item, 'fields.key')
                ? getNestedObject('fields', item).key
                : checkIfKeyExist(item, 'content[0].key')
                ? getNestedObject('content[0]', item).key
                : `${getNestedObject(contentfulKey, data).key}${index}`;
              return {
                [itemKey]: Object.assign(
                  {},
                  checkIfKeyExist(item, `${contentfulKey}.label`) && {
                    label: item[prop].label,
                  },
                  { copy: getNestedObject(valuePath, item) }
                ),
              };
            })
          ),
        };
      }
      if (/copyLine/.test(key)) {
        const copy = {
          [getNestedObject(key, data).fields.key]: getNestedObject(key, data)
            .fields.label,
          [`copy${copyIndex}`]:
            (checkIfKeyExist(
              data,
              `${key}.fields.content.content[0].content[0].value`
            ) &&
              getNestedObject(key, data).fields.content.content[0].content[0]
                .value) ||
            getNestedObject(key, data).fields.label,
        };
        if (checkIfKeyExist(data, `${key.replace(/\d/, '')}${copyIndex + 1}`)) {
          Object.assign(copy, processCopy(data, copyIndex + 1).copy);
        }

        return {
          copy,
        };
      }
      return {
        copy: {
          [getNestedObject(key, data).fields.key]: getNestedObject(key, data)
            .fields.label,
          copy:
            (checkIfKeyExist(
              data,
              `${key}.fields.content.content[0].content[0].value`
            ) &&
              getNestedObject(key, data).fields.content.content[0].content[0]
                .value) ||
            getNestedObject(key, data).fields.label,
        },
      };
    } catch (error) {
      console.warn('useContentfulSlug Error: ', error);
    }
  }
}
function processTitle(fields) {
  const key = getKey(
    [
      'title.fields.label',
      'entry.fields.title.fields.label',
      'card.fields.title.fields.label',
    ],
    fields
  );
  if (key) {
    try {
      return {
        title: getNestedObject(key, fields),
      };
    } catch (error) {
      console.warn('useContentfulSlug Error: ', error);
    }
  }
}

function processImages(fields: any): { images: ImageRecord } {
  const keys = [
    'logos.fields.imagesSet',
    'images[0].fields.imagesSet',
    'images.fields.imagesSet',
    'entry.fields.icon.fields.image.fields.file',
    'icon.fields.image.fields.file',
    'image.fields.file',
    'additionalImages.fields.imagesSet',
    'images',
    'card.fields.cardImage.fields.image.fields.file',
  ].filter((key) => checkIfKeyExist(fields, key));

  if (keys.length) {
    const images: any = {};

    keys.forEach((key, index) => {
      if (key === 'entry.fields.icon.fields.image.fields.file') {
        try {
          images[fields.entry.fields.icon.fields.key] = {
            altText: fields.entry.fields.icon.fields.key,
            url: `https:${getNestedObject(key, fields).url}`,
          };
          return;
        } catch (error) {
          console.warn('useContentfulSlug Error: ', error);
        }
      }
      try {
        if (Array.isArray(getNestedObject(key, fields))) {
          getNestedObject(key, fields).forEach(({ fields }) => {
            images[fields.key] = {
              altText: fields.image.fields.description || fields.key,
              url: `https:${fields.image.fields.file.url}`,
            };
          });
          return;
        }
        if (keys.length > 1) {
          const prop = findKeyLocation(fields, key, 'key');
          const description = findKeyLocation(fields, key, 'description');
          const url = findKeyLocation(fields, key, 'url');
          if (!prop || !description || !url) return;
          images[prop ? getNestedObject(`${prop}.key`, fields) : index] = {
            altText: description
              ? getNestedObject(description, fields).description
              : index,
            url: `https:${getNestedObject(url, fields).url}`,
          };
        } else {
          if (!checkIfKeyExist(fields, `${key}.url`)) return;
          images.altText =
            getNestedObject(key, fields).description ||
            getNestedObject(key, fields).fileName;
          images.url = `https:${getNestedObject(key, fields).url}`;
        }
        return;
      } catch (error) {
        console.warn('useContentfulSlug Error: ', error);
      }
    });
    return {
      images,
    };
  }
}

function processSEO(fields: unknown): { seo: SEO } {
  const key = getKey(['content.seo.fields', 'seo'], fields);
  if (key) {
    try {
      return {
        seo: {
          ...getNestedObject(key, fields),
        },
      };
    } catch (error) {
      console.warn('useContentfulSlug Error: ', error);
    }
  }
}

function processLabels(data: any): GenericRecord {
  const key = getKey(
    [
      'labels',
      'entry.fields',
      'inputSet.fields.inputs',
      'label.fields.content.content[0].content[0].value',
    ],
    data
  );
  if (key) {
    if (Array.isArray(getNestedObject(key, data))) {
      try {
        return {
          ...(
            getNestedObject(key, data) as Array<{
              fields: { key: string; label: string };
            }>
          ).reduce(
            (obj, { fields }) => ({
              ...obj,
              [fields.key]: fields.label,
            }),
            {}
          ),
        };
      } catch (error) {
        console.warn('useContentfulSlug Error: ', error);
      }
    }
    if (key === 'label.fields.content.content[0].content[0].value') {
      try {
        const labelKeyLocation = findKeyLocation(data, key, 'key');
        const labelKey = getNestedObject(labelKeyLocation, data).key;
        return {
          [labelKey]: getNestedObject(key, data),
        };
      } catch (error) {
        console.warn(error);
      }
    }
    try {
      return {
        ...Object.keys(getNestedObject(key, data)).reduce(
          (obj, prop) => ({
            ...obj,
            [prop]: data.label || getNestedObject(key, data)[prop].fields.label,
          }),
          {}
        ),
      };
    } catch (error) {
      console.warn('useContentfulSlug Error: ', error);
    }
  }
}

function checkIfObjectContainsLinks(data: any): boolean {
  const { fields } = data.items[0];
  return Object.keys(fields).some((key) => {
    if (
      typeof fields[key] === 'object' &&
      !Array.isArray(fields[key]) &&
      checkIfKeyExist(fields[key], 'sys') &&
      fields[key].sys.type === 'Link'
    ) {
      return true;
    }
    return false;
  });
}

function checkIfKeyExist(obj: unknown, keyPath: string): boolean {
  if (obj === undefined) return false;
  const keys = keyPath.split('.');
  const key = keys.shift();
  let hasKey = false;
  if (Object.prototype.hasOwnProperty.call(obj, key.replace(/(\[.\])/, ''))) {
    hasKey = true;
    if (keys.length) {
      hasKey = checkIfKeyExist(
        /(\[.\])/.test(key) ? getNestedObject(key, obj) : obj[key],
        keys.join('.')
      );
    }
    return hasKey;
  }
  return hasKey;
}

function getNestedObject(key: string, data: unknown): any {
  if (key) {
    return key
      .replace(/\[([^\]]+)]/g, '.$1')
      .split('.')
      .reduce(function (obj, prop) {
        return obj[prop];
      }, data);
  }
}

function getKey(keyArr: Array<string>, obj: unknown) {
  return keyArr.find((key) => checkIfKeyExist(obj, key));
}

function findKeyLocation(
  obj: unknown,
  keyPath: string,
  prop: string
): string | undefined {
  if (!keyPath) {
    return;
  }
  if (checkIfKeyExist(getNestedObject(keyPath, obj), prop)) {
    return keyPath;
  }
  if (keyPath) {
    return findKeyLocation(
      obj,
      keyPath.split('.').slice(0, -1).join('.'),
      prop
    );
  }
  return undefined;
}

// remove object keys in keyPath until the proper path is found
function findPath(obj: unknown, keyPath: string): string | undefined {
  if (checkIfKeyExist(obj, keyPath)) {
    return keyPath;
  }
  if (keyPath) {
    return findPath(obj, keyPath.split('.').slice(1).join('.'));
  }
  return undefined;
}