import { useNotification } from '@/composables/useNotification';
import { useSession } from '@/composables/useSession';
import { Routes } from '@/constants/pages';
import { useRouter } from 'vue-router';



export const AuthGuards = () => {

  const router = useRouter();
  const notification = useNotification();
  const session = useSession();

  const isLoggedIn:Boolean = (session.isLoggedIn ==="false");

  if ( isLoggedIn ) {

    notification.updateMessage("Log out");
    return router.push(Routes.Login);
  
  }

}