import { ProductUnionType } from '@/constants/product';

export enum UploadedDocumentsType {
  UPLOADED_DOCUMENTS = 'Uploaded Documents',
}

export interface UploadedDocument {
  documentCategory: string;
  documentDateTime: string;
  documentDisplayName: string;
  documentId: number;
  downloadDisplayFileName: string;
  fileName: string;
}

interface ProductDocument extends UploadedDocument {
  statementEndDate: string | null;
  statementStartDate: string | null;
}

export interface Product {
  productId: string;
  productType: ProductUnionType;
}

export interface ProductDetails {
  productId?: string;
  productType?: ProductUnionType;
  productTypeDescription?: string;
  documentDetails?: Array<ProductDocument>;
}

export interface UploadedDocumentsRefType {
  documents: Array<UploadedDocument>;
  isResponsePending: boolean;
}

export interface ProductsListRefType {
  products: Array<Product>;
  isResponsePending: boolean;
}

export interface ProductDocumentsRefType {
  product: ProductDetails;
  isResponsePending: boolean;
}

export interface CategorizedDocumentsType {
  [key: string]: Array<UploadedDocument | ProductDocument>;
}

export interface AccordionItemsType {
  heading: string;
  id: string;
  isOpen: boolean;
  productId: string;
  subSections: Array<{
    accordionId: string;
    heading: string;
    id: string;
  }>;
}

export interface AccordionItemCmsType {
  heading: string;
  subSections: { heading: string }[];
}
