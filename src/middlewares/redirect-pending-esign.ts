import { Routes } from '@/constants/pages';
import { useSessionStorage } from '../composables/useSessionStorage';
import { useRouter } from 'vue-router';

export const RedirectPendingEsignGuards = async () => {
 
  const { getItem } = useSessionStorage();
 
  const pendEsign = getItem('hasAppPendingEsign') ?? false;
 
  const router = useRouter();
    
  if (pendEsign) {
      router.push(Routes.Dashboard);
  }

}