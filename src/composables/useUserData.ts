import { useCookie }  from "@/utils/cookie";

export enum FlowType {
  inStore = 'in-store',
}

type UserData = {
  flow?: `${FlowType}`;
  recommendedCard?: string;
  zipCode?: string;
  plaidFailConnectionAttempts?: number;
  purposeId: string;
};

export const useUserData = () => {
const { value: userCookie, set: user, delete: deleteCookie } = useCookie('user');
  const updateUser = (data: UserData): void => {
    user(JSON.stringify({...data }));
  };

  const deleteUser = (): void => {
    deleteCookie()
  };

  const aux: any = {
    deleteUser,
    updateUser,
    user: JSON.parse(userCookie),
    recommendedCard: userCookie?.recommendedCard ? window?.atob(userCookie?.recommendedCard) : '',
  };

  return aux;
  
};
