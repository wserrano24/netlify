<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { currencyFormatting } from '@/constants/masks';
import { LoanOffer } from '@/types/LoanOffer';
import { computed, ref, watch } from 'vue';

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

type TypeTheme = `${Theme}`;

enum ShowCurrency {
  NONE = 'none',
  ALL = 'all',
  ONLY_SYMBOL = 'only-symbol',
}

type TypeShowCurrency = `${ShowCurrency}`;

interface Props {
  currency?: Intl.NumberFormatOptions;
  currencySymbol?: string;
  delayInput?: number;
  header?: string;
  id: string;
  incrementValue?: number; // Steps to increment & decrement the value
  initialValue?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  language?: string;
  limits?: Array<[number, number]>;
  maxValue?: number;
  minValue?: number;
  showCurrency?: TypeShowCurrency;
  theme?: TypeTheme;
  useKeyboardArrows?: boolean;
  validateMultipleValue?: boolean;
  basis?: number;
  isRefi: boolean;
  originalLoanAmt: number;
  offerDetails?: LoanOffer;
  isLOC?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currency: () => ({
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: 'currency',
    useGrouping: true,
  }),
  limits: () => [],
  currencySymbol: '$',
  delayInput: 0,
  header: '',
  incrementValue: 1,
  initialValue: 1000,
  isDisabled: false,
  isReadOnly: false,
  language: 'en',
  maxValue: 1000,
  minValue: 0,
  basis: 0,
  showCurrency: 'all',
  theme: 'dark',
  useKeyboardArrows: true,
  validateMultipleValue: true,
  isRefi: false,
  originalLoanAmt: 0,
  offerDetails: null,
  isLOC: false,
});

const MAX_FONT_SIZE = {
  xl: [6, 11],
  lg: [11, 16],
  mdl: [16, 19],
};

const returnNVMinAmount = () => {
  if (props.offerDetails?.stateCode === 'NV' && props.offerDetails?.minLoanAmount === 100) {
    return parseFloat((100 - props.offerDetails?.offers[0]?.refinance?.payOffAmount).toFixed(2));
  } else {
    return null;
  }
}

const emit = defineEmits(['handleChange']);
const amount = ref<any>(props.initialValue);
const nevadaMinAmount = ref<any>(returnNVMinAmount())
const isNevadaState = ref<any>(props.offerDetails?.stateCode === 'NV');
const inputRef = ref<any>(null);
const inExcludedRange = ref({
  input: false,
  button: false,
});
let interval: null | ReturnType<typeof setTimeout> = null;

/**
 * Function that sets a delay to execute user input
 */
const debounce = (fn, delay: number) => {
  clearTimeout(interval);
  interval = setTimeout(fn, delay);
};
/**
 * Function that validates if the amount is within the allowed range
 * check to see if val creates amt less than 100 for NV
 */
const valueIsInRange = (value = 0) => {
  if (isNevadaState.value && props.isRefi) {
    return value >= nevadaMinAmount.value && value <= props.maxValue;
  } else if (props.isLOC) {
    return value <= props.maxValue;
  }
  else {
    return value >= props.minValue && value <= props.maxValue;
  }
}

//refi alabama has to calculate the excluded range of the entire loan not just the additional amount
const valueIsInExcludedRange = (val = 0) => {
  const value = props.isRefi ? val + props.originalLoanAmt : val;
  return value >= props.limits[0][0] + 1 && value <= props.limits[0][1] - props.incrementValue;
}

/**
 * Function that increases or decreases the amount
 */
const handleAmount = (increase = 1) => {
  const newAmount = getMultipleValue(
    amount.value ? amount.value + props.incrementValue * increase : props.basis
  );
  if (increase === -1 && props.isLOC && newAmount < props.minValue) {
    amount.value = 0;
    inExcludedRange.value.button = false;
    inExcludedRange.value.input = false;
    return;
  } else if (increase === 1 && props.isLOC && newAmount < props.minValue) {
    amount.value = props.minValue;
    inExcludedRange.value.button = false;
    inExcludedRange.value.input = false;
    return;
  }

  if (valueIsInRange(newAmount) && !valueIsInExcludedRange(newAmount)) {
    amount.value = newAmount;
    inExcludedRange.value.button = false;
    inExcludedRange.value.input = false;
  } else if (valueIsInRange(newAmount) && valueIsInExcludedRange(newAmount)) {
    setTimeout(() => {
      if (props.isRefi) {
        //if lower limit is less than loan amt - we would get negative amt output - AL Stepdown scenario
        if (increase === -1 && (props.limits[0][0] < props.originalLoanAmt)) {
          amount.value = 0; // return 1490 (Al Stepdown Amt)
        } else if (increase === -1) {
          amount.value = props.limits[0][0] - props.originalLoanAmt;
        } else {
          amount.value = props.limits[0][1] - props.originalLoanAmt;
        }
      } else {
        amount.value = increase === -1 ? props.limits[0][0] : props.limits[0][1];
      }
      inExcludedRange.value.button = true;
      inExcludedRange.value.input = false;
    }, 2000);
    inExcludedRange.value.button = false;
    inExcludedRange.value.input = false;
  }
};

/**
 * Since javascript only approximates some decimal numbers, modulus calculations with decimals can sometimes be inaccurate
 * @param first remainder value
 * @param second divisor
 * @returns A true value when finding the modulus of decimal numbers
 */
const currencyMod = (first: number, second: number) => {
  return ((first * 100) % (second * 100)) / 100;
};

/**
 * Given a string (the one found in the input)
 * returns the numbers that are available
 */
const getNumericValue = (value = '') => value.replace(/[^0-9.]/g, '');

/**
 * Given an amount, it validates if it is a
 * multiple of the value of the increment value
 * - Now accounts for a basis value above the increment value
 */
const valueIsMultiple = (value = 0) => {
  return props.validateMultipleValue
    ? currencyMod(value, props.incrementValue) === props.basis ||
        value === props.maxValue ||
        value <= props.minValue
    : true;
};

/**
 * Returns the multiple of an amount,
 * also validates that it is within the allowed range
 * will adhere to returning values of some basis above a multiple
 */
const getMultipleValue = (value = 0) => {
  //Floating point math is glitchy, cuasing error with currency mod comparison EX: 5.98000000004 > 5.98 (Math.round fixes)
  const stepValue = valueIsMultiple(value) ? value : props.isRefi
    ? value - currencyMod(value, props.incrementValue) + props.basis + ((Math.round(100 * currencyMod(value, props.incrementValue)) / 100) > props.basis ? props.incrementValue : 0)
    : value - currencyMod(value, props.incrementValue) + props.incrementValue;

  if (props.isLOC && value < props.minValue) {
    return 0;
  }
  // next step if uneven
  return value === 0
    ? 0
    : stepValue <= props.minValue
    ? props.minValue
    : stepValue >= props.maxValue
    ? props.maxValue
    : stepValue;
};

/**
 * returns the amount in currency format
 */
const getCurrencyString = (value = 0) =>
  props.showCurrency === ShowCurrency.ALL
    ? currencyFormatting(value, props.language, props.currency)
    : props.showCurrency === ShowCurrency.ONLY_SYMBOL
    ? `${props.currencySymbol}${value.toString()}`
    : value.toString();

/**
 * Validates the values entered by the user
 */
const handleInput = (event: Event) => {
  let newValue = amount.value;
  const getValue = getNumericValue((event.target as HTMLInputElement).value);

  if (/^[0-9.]*$/.test(getValue) && !props.isDisabled && !props.isReadOnly) {
    const value = +getValue;

    if (value <= props.maxValue) {
      amount.value = value;
      newValue = value;
    }
  }
  inputRef.value.value = getCurrencyString(newValue);
  if (valueIsInExcludedRange(newValue)) {
    inExcludedRange.value.input = true;
  } else {
    inExcludedRange.value.input = false;
  }
};

/**
 * Valid when the user has hit enter or has clicked outside  (blur) the input
 */
const handleBlur = (event: Event) => {
  inExcludedRange.value.button = false;
  let stepValue;
  const value = +getNumericValue((event.target as HTMLInputElement).value);
  if (props.isLOC && value < props.minValue) {
      amount.value = 0;
      inputRef.value.value = getCurrencyString(0);
      return;
  }
    if (isNevadaState && props.isRefi) {
      if (value < nevadaMinAmount.value) {
        stepValue = nevadaMinAmount.value;
        amount.value = nevadaMinAmount.value;
        inputRef.value.value = getCurrencyString(amount.value)
      } else {
        stepValue = getMultipleValue(value);
        if (amount.value !== stepValue) {
          amount.value = stepValue;
          inputRef.value.value = getCurrencyString(stepValue);
        }
      }
    } else {
      stepValue = valueIsInExcludedRange(value)
        ? value
        : getMultipleValue(value);
        if (amount.value !== stepValue) {
          amount.value = stepValue;
          inputRef.value.value = getCurrencyString(stepValue);
        }
    }
  };

const amountValue = computed(() => {
  const amt = amount.value > 0 ? getCurrencyString(amount.value).split(".") : props.isLOC ? [getCurrencyString(0)] : [getCurrencyString(props.minValue)];
  if(!amt[1]) {
    return amt[0];
  } else if (amt[1].length < 2) {
    //Ex. 2005.4 - add extra 0 to amt
    return amt.join(".") + "0";
  } else {
    return amt.join(".");
  }
});

const isDecrementDisabled = computed(
  () =>
    props.isDisabled ||
    ((!props.isLOC) && amount.value - props.incrementValue < props.minValue &&
      amount.value !== props.basis) ||
      ((props.limits[0][0] < props.originalLoanAmt) &&
      amount.value === 0) || (isNevadaState && amount.value <= nevadaMinAmount.value)
);

const isIncrementDisabled = computed(
  () => props.isDisabled || amount.value >= props.maxValue
);

/**
 * Sets the dynamic font for the input, according to the length of the text
 */
const cxInput = computed(() => {
  const size = amountValue.value.length;
  const fontSize = Object.keys(MAX_FONT_SIZE).find(
    (v) => size >= MAX_FONT_SIZE[v][0] && size < MAX_FONT_SIZE[v][1]
  );
  return [
    'theme-amount-increment-value-input',
    fontSize ? `font-${fontSize}` : '',
  ];
});

/**
 * When the amount changes, its new value is sent to the parent component
 */

watch(
  () => {
    amount.value;
  },
  () => {
    /**
     * If a delay is set, this value is only sent when it has been fulfilled
     * (useful when making a request to a service)
     */
    debounce(() => {
      /**
       * Only values that are multiples of the increment value are emitted,
       * in addition to being within the allowed range
       */
      if (valueIsInRange(amount.value)) {
        emit('handleChange', {
          amount: amount.value,
          id: props.id,
          isExcluded: inExcludedRange.value,
        });
      }
    }, props.delayInput);
  },
  { deep: true }
);

</script>
<template>
  <div :class="props.theme + ' theme-amount-increment'">
    <p v-if="props.header">{{ props.header }}</p>
    <div class="theme-amount-increment-widget">
      <div class="theme-amount-increment-button">
        <button
          :aria-label="`decrement by ${props.incrementValue}`"
          :data-test-id="`${props.id}-btn-decrement`"
          :disabled="isDecrementDisabled"
          @click="handleAmount(-1)"
        >
          <BaseIcon
            :name="IconNames.MinusCircle"
            :color="Colors[theme === Theme.DARK ? 'White' : 'AADarkBlue']"
            :size="IconSizes.Large"
          />
        </button>
      </div>
      <div class="center-input">
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
        <input
          ref="inputRef"
          :data-testid="`${props.id}-amount-input`"
          :class="cxInput"
          type="tel"
          :readonly="props.isReadOnly"
          :disabled="props.isDisabled || props.isReadOnly"
          :value="amountValue"
          @keydown.stop.prevent.up="props.useKeyboardArrows && handleAmount(1)"
          @keydown.stop.prevent.down="props.useKeyboardArrows && handleAmount(-1)"
          @keyup.enter="handleBlur"
          @input="handleInput"
          @blur="handleBlur"
        />
      </div>
      <div class="theme-amount-increment-button">
        <button
          :aria-label="`increment by ${props.incrementValue}`"
          :data-test-id="`${props.id}-btn-increment`"
          :disabled="isIncrementDisabled"
          @click="handleAmount(1)"
        >
          <BaseIcon
            :name="IconNames.PlusCircle"
            :color="Colors[theme === Theme.DARK ? 'White' : 'AADarkBlue']"
            :size="IconSizes.Large"
          />
        </button>
      </div>
    </div>
    <div class="theme-amount-increment-value center-line"></div>
  </div>
</template>

<style scoped>

.center-input {
  justify-content: center;
  text-align: center;
}
@media only screen and (max-width: 639px) {
  .center-line {
    width: 50%;
    display: inline;
  }
}
@media only screen and (min-width: 640px) and (max-width: 1023px) {
  .center-line {
    width: 50%;
    display: inline;
  }
}
@media only screen and (min-width: 1024px) {
  .center-line {
    width: 50%;
    display: inline;
  }
}
</style>
