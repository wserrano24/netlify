import { computed, ref } from "vue";

export const useAsyncData = async (key: string, handler: () => Promise<any>) => {
    const data = ref();
    const pending = ref(false);
    try {
        data.value = await handler;
    } catch (err) {
        console.log(err)
    } finally {
        pending.value = false
    }

    return {
        data: computed(() => data.value),
        pending: computed(() => pending.value)
    };
};