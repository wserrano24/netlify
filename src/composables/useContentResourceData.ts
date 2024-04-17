import useAxios from "./useAxios";
import { Contentful } from "@/types/contentful";
import { useDomainVariables } from "./useDomainVariables";
import { useAsyncData } from "./useAsyncData";

export const getResourceSetData = (slug: string) => {
  
    return useAsyncData(
      `${slug}`,
      async () => {
        const fields: { [key: string]: any } = await getResourceSet(slug);
        return {
          ...fields,
        };
      }
    );
  }


  async function getContentful(url: string) {
    const env = useDomainVariables();
    const { get } = await useAxios({ useAuth: false })
    const endpointUrl = env.variables.value?.CONTENTFUL_ENDPOINT + url;

    const response: Partial<Contentful > | any = await get(endpointUrl, {
      context: "contentful",
    });

    if (response) {
      return response;
    }
  }


  async function getResourceSet(slug: string) {

    const res = await getContentful(`resourceSet?fields.slug=${slug}`);

    const topLevelResources = res.entries[0].fields.find(
      (element) => element.id == 'resources'
    ).fields.resources;

    const destructResources = (obj: any) => {
      const destructure = {};
      obj.forEach((item, index) => {
        if (item.contentTypeId == 'resourceSet') {
          if (item.fields.resources) {
            destructure[item.fields.key] = destructResources(
              item.fields.resources
            );
          }
        } else {
          destructure[item.fields.key] = destructContentType(item);
        }
      });
      return destructure;
    };

    const destructContentType = (item: any) => {
      switch (item.contentTypeId) {
        case 'componentTitle':
          return item.fields.label;
        case 'componentCopy':
          return {
            label: item.fields.label,
            content: item.fields.content.content[0].content[0].value,
          };
        case 'componentCloudinaryImage':
          return item.fields.cloudinary[0].secure_url;
        case 'componentLongFormText':
          return item.fields.longFormText;
        default:
          return item;
      }
    };
    const destructFields = destructResources(topLevelResources);

    return destructFields;
  }