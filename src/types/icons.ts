// This is reference file due to Vue's limitation on importing types
// https://vuejs.org/guide/typescript/composition-api.html#syntax-limitations

import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';

interface Icon {
  color?: Colors;
  name: IconNames;
  size?: IconSizes;
}

export default Icon;
