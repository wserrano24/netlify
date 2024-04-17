import { event } from 'vue-gtag';
import { useSessionStorage } from './useSessionStorage';

export const TrackGTMEvent = (eventName: string, eventCategory?: string) => {
  const { getItem } = useSessionStorage();

  interface UserObject {
    purposeId: string;
    zipcode: string;
    state: string;
  }

  const userObject: UserObject = {
    purposeId: '',
    zipcode: '',
    state: '',
  };

  Object.assign(userObject, getItem('userInfoGTM'));

  event(eventName, {
    event_label: eventName,
    event_category: eventCategory ? eventCategory : 'PWA APP',
    purposeId: userObject?.purposeId,
    state: userObject?.state,
    zipcode: userObject?.zipcode,
  });
};
