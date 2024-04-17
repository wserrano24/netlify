import { Colors } from '@/constants/colors';
import { IconNames } from '@/constants/icons';

export type BannerVariations =
  | 'dark'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | 'scheduled'
  | 'holiday';
type IconVariations = Record<
  BannerVariations,
  { name: IconNames; color: Colors }
>;

export const iconsVariations: IconVariations = {
  dark: {
    name: IconNames.RefinanceWithPercentage,
    color: Colors.AADarkBlue,
  },
  error: {
    name: IconNames.Error,
    color: Colors.AARed,
  },
  info: {
    name: IconNames.Refinance,
    color: Colors.AADarkBlue,
  },
  success: {
    name: IconNames.DoingGreat,
    color: Colors.AAGreen,
  },
  warning: {
    name: IconNames.Refinance,
    color: Colors.AAGoldenrod,
  },
  scheduled: {
    name: IconNames.ApprovedSquare,
    color: Colors.AAGreen,
  },
  holiday: {
    name: IconNames.AlertTriangle,
    color: Colors.AADarkBlue,
  },
};
