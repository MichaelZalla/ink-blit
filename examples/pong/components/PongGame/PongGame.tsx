import React, { FC } from 'react';

import { Box, useApp } from 'ink';

import TextBuffer from '../../../../src/types/Buffer'
import Dimensions from '../../../../src/types/Dimensions'
import Coordinate from '../../../../src/types/Coordinate';

import useGame, { GameInput } from '../../../../src/hooks/useGame';

import ScreenBuffer from '../../../../src/components/ScreenBuffer/ScreenBuffer';

type PongGame = React.PropsWithChildren

const PongGame: FC<PongGame> = ({}) => {

	const { exit } = useApp()

	const update = React.useCallback(
		(input: GameInput/*, deltaT: number*/) => {

			let nextGameState: GameState = applyInput(
				gameStateRef.current,
				input,
				exit
			);

			// Update ball

			let nextBall = {
				x: nextGameState.ball.x + nextGameState.ballVelocity.x,
				y: nextGameState.ball.y + nextGameState.ballVelocity.y,
			}

			let nextBallVelocity = nextGameState.ballVelocity

			if(
				nextBall.x === 1 &&
				nextBall.y >= nextGameState.paddles[0].y &&
				nextBall.y < (nextGameState.paddles[0].y + nextGameState.paddleHeight)
			)
			{
				// Left paddle collision

				nextBall.x += 1
				nextBallVelocity.x *= -1
			}
			else if(
				nextBall.x === nextGameState.dimensions.width - 2 &&
				nextBall.y >= nextGameState.paddles[1].y &&
				nextBall.y < (nextGameState.paddles[1].y + nextGameState.paddleHeight)
			)
			{
				// Right paddle collision

				nextBall.x -= 1
				nextBallVelocity.x *= -1
			}

			if(
				nextBall.x < 0 ||
				nextBall.x >= nextGameState.dimensions.width
			)
			{
				if(nextBall.x < 0) {
					nextGameState.score -= 1
				} else {
					nextGameState.score += 1
				}

				nextGameState.didFinishPlay = true
			}

			if(nextBall.y < 0) {
				nextBall.y += 1
				nextBallVelocity.y *= -1
			} else if(nextBall.y >= nextGameState.dimensions.height) {
				nextBall.y -= 1
				nextBallVelocity.y *= -1
			}

			nextGameState.ball = nextBall
			nextGameState.ballVelocity = nextBallVelocity

			// Update right paddle

			let nextRightPaddle = nextGameState.paddles[1]

			let distance = gameStateRef.current.ball.y - (
				nextRightPaddle.y + (gameStateRef.current.paddleHeight / 2)
			)

			if(
				distance > 0 &&
				nextRightPaddle.y < (
					nextGameState.dimensions.height - nextGameState.paddleHeight
				)
			)
			{
				nextRightPaddle.y += 1
			}
			else if(
				distance < 0 &&
				nextRightPaddle.y > 0
			)
			{
				nextRightPaddle.y -= 1
			}

			// Reset game?

			if(nextGameState.didFinishPlay) {
				nextGameState = {
					...makeGameState(
						gameState.dimensions,
						gameState.settings
					),
					score: nextGameState.score,
				}
			}

			gameStateRef.current = nextGameState;

			setGameState(nextGameState)

		},
		[exit]
	)

	const render = (buffer: TextBuffer) => {

		// Renders ball

		let ball = gameStateRef.current.ball

		buffer[ball.y]![ball.x] = '𝝤'

		// Renders paddles

		let [leftPaddle, rightPaddle] = gameStateRef.current.paddles

		for(let i = 0; i < gameStateRef.current.paddleHeight; i++) {
			buffer[leftPaddle.y + i]![leftPaddle.x] = '|'
			buffer[rightPaddle.y + i]![rightPaddle.x] = '|'
		}

		// Renders score

		let score = `score: ${gameStateRef.current.score}`.split(``)

		for(let i = 0; i < score.length; i++) {
			buffer[buffer.length - 1]![buffer[0]!.length - score.length + i] = score[i]!
		}

		// Renders debug output

		// let debug = `head: (${gameStateRef.current.pong[0]!.x}, ${gameStateRef.current.pong[0]!.y})`.split(``)
		// let debug = `fruit: (${gameStateRef.current.fruit.x}, ${gameStateRef.current.fruit.y})`.split(``)
		let debug = `frame: ${gameStateRef.current.frame}`.split(``)

		// for(let i = 0; i < debug.length; i++) {
		// 	buffer[buffer.length - 1]![i] = debug[i]!
		// }

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
    	<Box data-testid="PongGame" borderStyle='classic'>
			<ScreenBuffer buffer={buffer}
				alignSelf='center'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'>
			</ScreenBuffer>
		</Box>
	)

}

PongGame.displayName = `PongGame`

module.exports = PongGame
export default PongGame

const updatesPerSecond = 24

type GameSettings = {
	paddleHeight: number;
}

const DefaultGameSettings: GameSettings = {
	paddleHeight: 5,
}

type GameState = {
	dimensions: Dimensions;
	ball: Coordinate;
	ballVelocity: Coordinate;
	paddles: [Coordinate, Coordinate];
	paddleHeight: number;
	didFinishPlay: boolean;
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
		ball: {
			x: Math.round(dimensions.width / 2),
			y: Math.round(dimensions.height / 2),
		},
		ballVelocity: {
			x: 1,
			y: 1,
		},
		paddles: [
			{
				x: 1,
				y: 0,
			},
			{
				x: dimensions.width - 1,
				y: 0,
			},
		],
		paddleHeight: settings.paddleHeight,
		didFinishPlay: false,
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

	let [leftPaddle] = gameState.paddles

	if(
		input.key?.upArrow &&
		leftPaddle.y > 0
	)
	{
		leftPaddle.y -= 1
	}
	else if(
		input.key?.downArrow &&
		leftPaddle.y < (gameState.dimensions.height - gameState.paddleHeight)
	)
	{
		leftPaddle.y += 1
	}

	//

	let nextGameState: GameState = {
		...gameState,
		frame: gameState.frame + 1,
	}

	return nextGameState

}
