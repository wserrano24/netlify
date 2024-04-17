export const kebabToCapitalizeName = (name) =>
  name
    .split('-')
    .map((v) => `${v[0].toUpperCase()}${v.substr(1)}`)
    .join(' ');

/**
 * @function getWithDashLowercaseString - Will lowercase the string and with replacing space with dash i.e (Contact Us -> contact-us)
 * @param {LinkLabel} str.
 * @return {String}
 */
export const getWithDashLowercaseString = (str: string): string =>
  str.toLowerCase().replace(/\s/g, '-');

/**
 * TODO: Since richtext is not used, the necessary text
 * to be displayed is generated. (v-html directive is used),
 * it would be ideal to use a contentful rich text renderer
 */
export const getHTMLByContentfulJSON = (data, classNameBold = ''): string =>
  data
    ?.map(
      (v) =>
        '<p>' +
        v?.content
          .map((p) => {
            const isBold =
              p?.marks?.length !== 0 &&
              p.marks.filter((v) => v?.type === 'bold')?.length !== 0;

            return isBold
              ? `<span class='${classNameBold}'>${p?.value || ''}</span>`
              : p?.value || '';
          })
          .join('') +
        '</p>'
    )
    .join('');
