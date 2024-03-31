import { Ref } from 'vue';

const isRef = <T>(variable: T | Ref<T>): variable is Ref<T> => {
  return variable !== null && typeof variable === 'object' && 'value' in variable;
};

const getValue = <T>(val: T | Ref<T>): T => {
  return isRef(val) ? val.value : val;
};

export { isRef, getValue };
