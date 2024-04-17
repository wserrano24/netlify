export const sanitizeTags = (input: string): string =>
  input ? input.replace(/<\/?[^>]+(>|$)/g, '') : '';

export const getFormDataValues = (form: HTMLFormElement): unknown => {
  return [...new FormData(form).entries()]
    ?.map((v) => ({ [v?.[0]]: sanitizeTags(String(v?.[1] || '')) }))
    ?.reduce((a, s) => ({ ...a, ...s }), {});
};
