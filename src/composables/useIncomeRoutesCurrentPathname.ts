import { getIncomeRoutesCurrentPathname } from '@/utils/getIncomeRoutesCurrentPathname';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default () => {
  const router = useRouter();
  const currentPath = router?.currentRoute?.value?.fullPath;

  return {
    currentPathname: computed(() =>
      getIncomeRoutesCurrentPathname(currentPath)
    ),
  };
};
