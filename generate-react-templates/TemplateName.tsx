import React, { FC } from 'react';

import { Box, useApp } from 'ink';

import TextBuffer from '../../../../src/types/Buffer'
import Dimensions from '../../../../src/types/Dimensions'

import useGame, { GameInput } from '../../../../src/hooks/useGame';

import ScreenBuffer from '../../../../src/components/ScreenBuffer/ScreenBuffer';

type GameSettings = {}

const DefaultGameSettings: GameSettings = {}

type GameState = {
	dimensions: Dimensions;
	frame: number;
	score: number;
	shouldReset: boolean;
	settings: GameSettings;
}

const makeGameState = (
	dimensions: Dimensions,
	settings: GameSettings = DefaultGameSettings): GameState =>
{
	return {
		dimensions,
		frame: 1,
		score: 0,
		shouldReset: false,
		settings,
	}
}

const applyInput = (
	gameState: GameState,
	input: GameInput,
	exit: (error?: Error | undefined) => void): GameState =>
{

	if(input.key?.escape) {
		exit()
	}

	if(input.key?.backspace) {
		return makeGameState(gameState.dimensions)
	}

	// @TODO: Process latest user input
	// @TODO: Update game state

	let nextGameState: GameState = {
		...gameState,
		frame: gameState.frame + 1,
	}

	return nextGameState

}


const UpdatesPerSecond = 24

type TemplateName = React.PropsWithChildren

const TemplateName: FC<TemplateName> = ({}) => {

	const { exit } = useApp()

	const update = React.useCallback(
		(input: GameInput/*, deltaT: number*/) => {

			let nextGameState: GameState = applyInput(
				gameStateRef.current,
				input,
				exit
			);

			// @TODO: Reset game state on lose condition
			//
			// if(nextGameState.shouldReset) {
			// 	nextGameState = makeGameState(
			// 		gameState.dimensions,
			// 		gameState.settings
			// 	)
			// }
			//

			gameStateRef.current = nextGameState;

			setGameState(nextGameState)

		},
		[exit]
	)

	const render = (buffer: TextBuffer) => {

		// @TODO: Render game state to buffer

		// buffer[row]![column] = '#'

		// Renders debug output

		let debug = `frame: ${gameStateRef.current.frame}`.split(``)

		for(let i = 0; i < debug.length; i++) {
			buffer[buffer.length - 1]![i] = debug[i]!
		}

		return buffer

	}

	const [dimensions, buffer] = useGame({
		update,
		render,
		tickRate: UpdatesPerSecond,
	})

	const dimensionsRef = React.useRef(dimensions)

	const [gameState, setGameState] = React.useState<GameState>(
		makeGameState(dimensions)
	)

	const gameStateRef = React.useRef(gameState)

	React.useEffect(() => {

		let newGame = makeGameState(dimensionsRef.current)

		setGameState(newGame)
		gameStateRef.current = newGame


	}, [
		dimensions,
		setGameState,
	])

	return (
    	<Box data-testid="TemplateName" borderStyle='classic'>
			<ScreenBuffer buffer={buffer}
				alignSelf='center'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'>
			</ScreenBuffer>
		</Box>
	)

}

TemplateName.displayName = `TemplateName`

module.exports = TemplateName
export default TemplateName
