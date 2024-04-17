import { ref } from 'vue';
import { parse, serialize } from 'cookie-es';

export function useCookie(name:any, options:any = {} ) {

const initialValue = parse(document.cookie)[name] ?? options.default ?? null;

const cookieValue = ref<any>(initialValue);


const setCookie = (value:any, opts = {path:"/"}) =>{

  document.cookie = serialize(name, value, opts);
  cookieValue.value = value;
}

const deleteCookie = (opts = {}) => {
  document.cookie = serialize(name, '', { ...opts, expires: new Date(0) });
  cookieValue.value = null;
}

return {
  value: cookieValue.value,
  set: setCookie,
  delete: deleteCookie
};

}