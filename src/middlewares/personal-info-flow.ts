import { useApplicationProcess } from "@/composables/useApplicationProcess";
import useComposite from "@/composables/useComposite";
import { usePage } from "@/composables/usePage";
import { useRoute } from "vue-router";

export const PersonalInfoFlowGuards =  async ( from:any ) => {

    const { updateApplicationProcess } = useApplicationProcess();
    const { getApplicationData } = useComposite();
    const { lastApplicationPage } = await getApplicationData();
    const { getPageName, getQueryParams } = usePage();
    const lastSavedPage = lastApplicationPage?.page;
    const isSaveAndExit = lastApplicationPage?.isSaveAndExit;
    const page = getPageName(from.path);

    const isPageUpdateNotNeeded = lastSavedPage === page && isSaveAndExit;

    if (isPageUpdateNotNeeded) return;

    const route = useRoute();
    const query = route?.query || {};
    const queryStrings = getQueryParams(query);

    updateApplicationProcess({ page, query: queryStrings, data: {} });
  
}