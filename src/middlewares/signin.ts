import { useSession } from '@/composables/useSession';
import { Routes } from '@/constants/pages';
import { useRouter } from 'vue-router';

export const SigninGuards = () => {
  
  const session = useSession();
  const router = useRouter();

  const isLoggedIn = (session.isLoggedIn === "true");
  
  const currentRoute = router.currentRoute.value.path;

  const preAuthenticationUrls = [
    Routes.Register,
    Routes.Login,
    Routes.Landing,
    Routes.Zipcode,
    Routes.Redirect,
    Routes.InStoreAccountFind,
  ];

  if (isLoggedIn && preAuthenticationUrls.includes(currentRoute as any)) {
    return router.push(Routes.Dashboard);
  }
}