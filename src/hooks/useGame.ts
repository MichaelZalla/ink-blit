import React from 'react';

import { Key, useInput } from 'ink';

import TextBuffer from '../types/Buffer';
import Dimensions from '../types/Dimensions';

import { getEmptyFrameBuffer } from '../utils/buffer/index';

import FullScreenContext, { FullScreenContextProviderValue } from '../components/FullScreen/contexts/FullScreenContext';

export type GameInput = {
	char: string|null;
	key: Key|null;
}

type UpdateFn = (input: GameInput, deltaT?: number) => void;
type RenderFn = (buffer: TextBuffer) => TextBuffer;

type UseGameHookResult = [
	Dimensions,
	TextBuffer,
]

type UseGameHookOptions = {
	update: UpdateFn,
	render: RenderFn,
	tickRate: number,
}

const useGame = (
	options: UseGameHookOptions): UseGameHookResult =>
{

	const fullScreenDimensions = React.useContext<FullScreenContextProviderValue>(FullScreenContext);

	const [frameBufferDimensions, setFrameBufferDimensions] = React.useState<Dimensions>({
		width: fullScreenDimensions.width - 2,
		height: fullScreenDimensions.height - 2,
	})

	const [screenBuffer, setScreenBuffer] = React.useState<TextBuffer>([])

	React.useEffect(
		() => {

			// Account for <FullScreen> borders

			setFrameBufferDimensions({
				width: fullScreenDimensions.width - 2,
				height: fullScreenDimensions.height - 2,
			})

		},
		[
			fullScreenDimensions,
			setFrameBufferDimensions,
		]
	)

	const [gameInput, setGameInput] = React.useState<GameInput>({
		char: null,
		key: null,
	})

	const gameInputRef = React.useRef(gameInput)

	useInput(React.useCallback((char, key) => {
		setGameInput(_gameInput => {

			let newGameInput: GameInput = {
				char,
				key,
			}

			gameInputRef.current = newGameInput

			return newGameInput

		})
	}, [setGameInput]));

	React.useEffect(() => {

		let intervalId = window.setInterval(
			() => {

				options.update(gameInputRef.current)

				let newInput = {
					char: null,
					key: null,
				}

				setGameInput(newInput)
				gameInputRef.current = newInput

				const emptyFrame = getEmptyFrameBuffer(frameBufferDimensions)

				let nextFrame = options.render(emptyFrame)

				setScreenBuffer(nextFrame)

			},
			1000 / options.tickRate
		)

		return () => window.clearInterval(intervalId)

	}, [
		frameBufferDimensions,
		setGameInput,
	])

	return [
		frameBufferDimensions,
		screenBuffer,
	]

}

export default useGame
