import { UserActions } from '@/types/user-actions';
import usePersonalInfo from './usePersonalInfo';
import { ref } from 'vue';

export const useUserActions = () => {
  const userActions = ref<UserActions>();

  const {fetchUserActions} = usePersonalInfo();
  
  
  const getUserActions = async () => {
    if (userActions.value === null) {
      userActions.value = await fetchUserActions();
    }

    return userActions.value;
  };

  return {
    getUserActions,
  };
};
