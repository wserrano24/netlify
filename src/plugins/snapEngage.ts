import { useDomainVariables } from '@/composables/useDomainVariables';

let agentAvailableResolve:any;
export const agentAvailable = new Promise((resolve) => {
  agentAvailableResolve = resolve;
});

  const env = useDomainVariables();
  const se = document.createElement('script');
  se.type = 'text/javascript';
  se.id = 'snap-engage-script';
  se.async = true;
  se.src = `${env.variables.value.SNAP_ENGAGE_API}`;
  se.onload = () => {

      SnapEngage.getAgentStatusAsync(function (online) {

        if (online) {
        
          agentAvailableResolve(true);
        
        } else {
        
          agentAvailableResolve(false);
        
        }
      });
  };
  const s = document.getElementsByTagName('script')[0];
  
  s.parentNode.insertBefore(se, s);