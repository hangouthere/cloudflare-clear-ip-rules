import { useContext, useEffect } from 'react';

import { StoreContext } from './StoreProvider';

import { ConfigStore } from '../Config';

// Normally would use `useRef`,
// but in reality we will only ever have one of these components
let hasSeen = false;

export default function StoreSaver({ children }) {
  const {
    state: { CloudflareConfig }
  } = useContext(StoreContext);

  useEffect(() => {
    if (!hasSeen) {
      hasSeen = true;
      return;
    }

    ConfigStore.store = CloudflareConfig;
  }, [CloudflareConfig]);

  return children;
}
