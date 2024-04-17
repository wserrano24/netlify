type TCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type TSize = 'xs' | 'sm' | 'lg' | '';

export type TPlaceHolder = {
  size?: TSize;
  col?: TCols;
};
