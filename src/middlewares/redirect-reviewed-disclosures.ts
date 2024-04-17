import { Routes } from '@/constants/pages';
import { useProductStore } from '@/stores/useProductStore';
import { useSessionStorage } from '../composables/useSessionStorage';
import { useRouter } from 'vue-router';

export const RedirectReviewedDisclosuresGuards = async () => {
  
  const { getHasReviewedDisclosures } = useProductStore();
  const { getItem } = useSessionStorage();
  const router = useRouter();

  if (getHasReviewedDisclosures || getItem('hasReviewedDisclosures')) {
    router.push(Routes.Dashboard);
  }

}
