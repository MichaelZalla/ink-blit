import React, { FC, useRef } from 'react';

import { Box, DOMElement, measureElement } from 'ink';

import useTerminalDimensions from '../../hooks/useTerminalSize';

import FullScreenContext from './contexts/FullScreenContext';

type FullScreenProps = React.PropsWithChildren<any>

const FullScreen: FC<FullScreenProps> = ({ children, ...props }) => {

	const boxRef = useRef<DOMElement>(null);

	const dimensions = useTerminalDimensions()

	React.useEffect(() => {

		if(boxRef.current !== null)
		{
			const { width, height } = measureElement(boxRef.current);

			console.log(width, height)
		}

	}, [boxRef.current])

	return (
		<Box ref={boxRef}
			width={dimensions.columns}
			height={dimensions.rows}
			{...props}>

			<FullScreenContext.Provider value={{
				width: dimensions.columns,
				height: dimensions.rows,
			}}>

				{children}

			</FullScreenContext.Provider>

		</Box>
	)

}

FullScreen.displayName = `FullScreen`

module.exports = FullScreen
export default FullScreen
