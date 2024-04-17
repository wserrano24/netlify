import { useDomainVariables } from '@/composables/useDomainVariables';
import { SplitFactory } from '@splitsoftware/splitio';

export const useSplitIO = () => {
  
  const env = useDomainVariables();
  const factory : SplitIO.ISDK = SplitFactory({
    core: {
      authorizationKey: `${env.variables.value?.SPLIT_IO_SERVER}`,
      key: 'ILPLOCKey',
    },
  });

  const client : SplitIO.IClient = factory.client();

  return {
    client,
  };

};