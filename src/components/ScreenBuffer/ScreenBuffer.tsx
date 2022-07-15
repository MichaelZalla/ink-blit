import React, { FC } from 'react';

import { Text, Box } from 'ink';
import { Styles } from 'ink/build/styles';

import TextBuffer from '../../types/Buffer';

type InkBoxProps = 'position'|'marginLeft'|'marginRight'|'marginTop'|'marginBottom'|'paddingLeft'|'paddingRight'|'paddingTop'|'paddingBottom'|'flexGrow'|'flexShrink'|'flexDirection'|'flexBasis'|'alignItems'|'alignSelf'|'justifyContent'|'width'|'height'|'minWidth'|'minHeight'|'display'|'borderStyle'|'borderColor'

export type BoxProps = Pick<Styles,InkBoxProps>

type ScreenBuffer = React.PropsWithChildren<BoxProps & {
	buffer: TextBuffer;
}>

const ScreenBuffer: FC<ScreenBuffer> = ({ buffer, ...props }) => {

	return (
    	<Box data-testid="ScreenBuffer" {...props}>
			{
				buffer.map((line, index) => {

					let lineStr = line.join(``)
					let key = `${index}${lineStr}`

					return (
						<Text key={key}>
							{lineStr}
						</Text>
					)

				})
			}
		</Box>
	)

}

ScreenBuffer.displayName = `ScreenBuffer`

module.exports = ScreenBuffer
export default ScreenBuffer
