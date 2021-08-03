import React from 'react';

export default MenuFactory = props => {
  return (
    <SelectInput
      items={items}
      onSelect={handleSelect}
      height={4}
      marginLeft={5}
    />
  );
};
