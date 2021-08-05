import React, { useContext, useEffect } from 'react';

import { StoreContext } from './StoreProvider';

export default function StoreSaver({ children }) {
  const {
    state: { CloudflareConfig }
  } = useContext(StoreContext);

  useEffect(() => {
    console.log('CONFIG Updated!!!!', JSON.stringify(CloudflareConfig));
  }, [CloudflareConfig]);

  return children;
}
