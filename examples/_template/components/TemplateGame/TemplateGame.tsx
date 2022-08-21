import React, { FC } from 'react';

import { Box, Key, useApp } from 'ink';

import TextBuffer from '../../../../src/types/Buffer'
import Dimensions from '../../../../src/types/Dimensions'

import useGame, { GameInput } from '../../../../src/hooks/useGame';

import ScreenBuffer from '../../../../src/components/ScreenBuffer/ScreenBuffer';

// type BorderStyle =
// 	`single`|
// 	`double`|
// 	`round`|
// 	`bold`|
// 	`singleDouble`|
// 	`doubleSingle`|
// 	`classic`;

type TemplateGame = React.PropsWithChildren

const TemplateGame: FC<TemplateGame> = ({}) => {

	const { exit } = useApp()

	const update = React.useCallback(
		(input: GameInput/*, deltaT: number*/) => {

			let nextGameState: GameState = applyInput(
				gameStateRef.current,
				input,
				exit
			);

			gameStateRef.current = nextGameState;

			setGameState(nextGameState)

		},
		[exit]
	)

	const render = (buffer: TextBuffer) => {

		// Renders score

		let score = `score: ${gameStateRef.current.score}`.split(``)

		for(let i = 0; i < score.length; i++) {
			buffer[0]![i] = score[i]!
		}

		// Renders debug output

		// let debug = `head: (${gameStateRef.current.template[0]!.x}, ${gameStateRef.current.template[0]!.y})`.split(``)
		// let debug = `fruit: (${gameStateRef.current.fruit.x}, ${gameStateRef.current.fruit.y})`.split(``)
		let debug = `frame: ${gameStateRef.current.frame}`.split(``)

		for(let i = 0; i < debug.length; i++) {
			buffer[buffer.length - 1]![i] = debug[i]!
		}

		return buffer

	}

	const [dimensions, buffer] = useGame({
		update,
		render,
		tickRate: updatesPerSecond,
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
    	<Box data-testid="TemplateGame" borderStyle='classic'>
			<ScreenBuffer buffer={buffer}
				alignSelf='center'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'>
			</ScreenBuffer>
		</Box>
	)

}

TemplateGame.displayName = `TemplateGame`

module.exports = TemplateGame
export default TemplateGame

const updatesPerSecond = 24

type GameSettings = {}

const DefaultGameSettings: GameSettings = {}

type GameState = {
	dimensions: Dimensions;
	frame: number;
	score: number;
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

	// Process latest user input

	let nextGameState: GameState = {
		...gameState,
		frame: gameState.frame + 1,
	}

	return nextGameState

}
