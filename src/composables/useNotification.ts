import { useCookie } from '@/utils/cookie';

export const useNotification = () => {

  const { value: messageCookie, set: message, delete: deleteCookie } = useCookie('customMessage');
  
  const updateMessage = (newMessage: string): void => {
    message(newMessage);
  };

  const deleteMessage = (): void => deleteCookie();

  return {
    message: messageCookie,
    updateMessage,
    deleteMessage,
  };
};