import {created} from "@/plugins/contentful";

const content = created()

import { ref } from "vue";

export interface ContentfulImage {
  url: string;
  altText: string;
}


const data = ref();

export default async function (assetId: string): Promise<ContentfulImage> {

  data.value = await content.getAsset(assetId);

  return {
    altText: data.value.fields.description,
    url: `https:${data.value.fields.file.url}`,
  };
};
