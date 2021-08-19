import { Box, Text, useApp } from 'ink';

import SelectInput from '_Shared/SelectInput';

const MENU_ITEMS = [
  { value: 0, label: "Yes, I'm sure!" },
  { value: 2, label: 'No - Exit' }
];

export default MenuConfigured = ({ handleStartScan }) => {
  const { exit } = useApp();

  function handleSelectUnconfigured(item) {
    switch (item.value) {
      case 0:
        return handleStartScan();

      default:
        return exit();
    }
  }

  return (
    <Box flexDirection="column">
      <Text color="yellow">
        Are you sure you want to Clear ALL entries from your Cloudflare Firewall
        IP Rules?
      </Text>

      <SelectInput
        items={MENU_ITEMS}
        onSelect={handleSelectUnconfigured}
        marginLeft={1}
      />
    </Box>
  );
};
