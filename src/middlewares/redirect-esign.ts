import { Routes } from '@/constants/pages';
import { useSessionStorage } from '../composables/useSessionStorage';
import { useRouter } from 'vue-router';

export const RedirectEsignGuards = async () => {

    const { getItem } = useSessionStorage();
    const hasEsigned = getItem('hasEsigned') ?? false;
    const router = useRouter();
    if (hasEsigned) {
      router.replace(Routes.Dashboard);
    }
}