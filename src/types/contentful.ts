// Partial Contentful data interface to avoid usage of type `any`
export interface Field {
  content: object;
  fields: Partial<Entry>;
  id: string;
}

interface Cloudinary {
  original_url: string;
  secure_url?: string;
  url: string;
}

interface Entry {
  cloudinary: Array<Cloudinary>;
  content: Partial<Field>;
  contentTypeId: string | null;
  copy: Partial<Field>;
  fields: Array<Partial<Field>>;
  icon: Partial<Field>;
  id: string;
  inputs: Partial<Field>;
  label: string;
  labels: Partial<Field>;
  links: Array<Partial<Field>>;
  locale: string;
  saveButton: Partial<Field>;
  title: Partial<Field>;
}

export interface Contentful {
  entries: Array<Entry>;
}
