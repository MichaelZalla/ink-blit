import React from 'react';

import Dimensions from '../../../types/Dimensions';

export type FullScreenContextProviderValue = Dimensions

const FullScreenContext = React.createContext<FullScreenContextProviderValue>({
	width: 0,
	height: 0,
});

FullScreenContext.displayName = `FullScreenContext`

export default FullScreenContext
