import * as Contentful from 'contentful';

export const created = () => {
  
    const client = Contentful.createClient({
      environment: 'pwa',
      space: 'yrugpsw9ue58',
      accessToken: 'E-Tq7ojlb5nN9naTGeYT88VUYFrSgdghCs2V_52I8Rw'
    });

    return client;
  
};
