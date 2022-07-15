import React, { FC } from 'react';

import { Box, Key, useApp } from 'ink';

import TextBuffer from '../../../../src/types/Buffer'
import Coordinate, { CoordinateMap } from '../../../../src/types/Coordinate'
import Dimensions from '../../../../src/types/Dimensions'

import { mod } from '../../../../src/utils/math/index'
import { getRandomCoordinate } from '../../../../src/utils/rand/index'

import useGame, { GameInput } from '../../../../src/hooks/useGame';

import ScreenBuffer from '../../../../src/components/ScreenBuffer/ScreenBuffer';
import Direction from '../../../../src/types/Direction';

type SnakeGame = React.PropsWithChildren

const SnakeGame: FC<SnakeGame> = ({}) => {

	const { exit } = useApp()

	const update = React.useCallback(
		(input: GameInput) => {

			let nextGameState: GameState = applyInput(
				gameStateRef.current,
				input,
				exit
			);

			if(nextGameState.didCollide) {
				nextGameState = makeGameState(
					gameState.dimensions,
					gameState.settings
				)
			}

			gameStateRef.current = nextGameState;

			setGameState(nextGameState)

		},
		[exit]
	)

	const render = (buffer: TextBuffer) => {

		// Renders snake

		for(let i = 0; i < gameStateRef.current.snake.length; i++) {
			buffer[gameStateRef.current.snake[i]!.y]![gameStateRef.current.snake[i]!.x] = `@`
		}

		// Renders fruit

		buffer[gameStateRef.current.fruit.y]![gameStateRef.current.fruit.x] = '$'

		// Renders score

		let score = `score: ${gameStateRef.current.score}`.split(``)

		for(let i = 0; i < score.length; i++) {
			buffer[0]![i] = score[i]!
		}

		// Renders debug output

		// let debug = `head: (${gameStateRef.current.snake[0]!.x}, ${gameStateRef.current.snake[0]!.y})`.split(``)
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
    	<Box data-testid="SnakeGame" borderStyle='classic'>
			<ScreenBuffer buffer={buffer}
				alignSelf='center'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'>
			</ScreenBuffer>
		</Box>
	)

}

SnakeGame.displayName = `SnakeGame`

module.exports = SnakeGame
export default SnakeGame

const updatesPerSecond = 24

type GameSettings = {
	snakeStartingPosition: Coordinate;
	snakeStartingLength: number;
	shouldCollideWithWalls: boolean;
}

const DefaultGameSettings: GameSettings = {
	snakeStartingPosition: {
		x: 1,
		y: 1,
	},
	snakeStartingLength: 16,
	shouldCollideWithWalls: true,
}

type Snake = Coordinate[]

type GameState = {
	dimensions: Dimensions;
	snake: Snake;
	direction: Direction;
	didCollide: boolean;
	fruit: Coordinate;
	frame: number;
	score: number;
	settings: GameSettings;
}

const makeGameState = (
	dimensions: Dimensions,
	settings: GameSettings = DefaultGameSettings): GameState =>
{
	let randomSnake: Snake = [
		{
			x: settings.snakeStartingPosition.x,
			y: settings.snakeStartingPosition.y,
		}
	]

	randomSnake = grow(
		randomSnake,
		dimensions,
		settings.snakeStartingLength - 1
	)

	return {
		dimensions,
		snake: randomSnake,
		fruit: getRandomCoordinate(dimensions),
		direction: Direction.Right,
		didCollide: false,
		frame: 1,
		score: 0,
		settings,
	}
}

const grow = (
	snake: Snake,
	dimensions: Dimensions,
	segments: number = 1): Snake =>
{

	const getRandomNeighbor = (coord: Coordinate): Coordinate => {
		return (Math.random() > 0.5) ?
			{
				x: coord.x,
				y: coord.y + 1,
			} :
			{
				x: coord.x + 1,
				y: coord.y,
			}
	}

	while(segments > 0)
	{
		let segment: Coordinate;

		do {
			segment = getRandomNeighbor(snake[snake.length-1]!)
		}
		while(
			segment.x <= 0 || segment.x >= dimensions.width ||
			segment.y <= 0 || segment.y >= dimensions.height ||
			collides([segment, ...snake])
		)

		snake.push(segment)

		segments -= 1
	}

	snake.reverse()

	return snake

}

const getNextSnakeHead = (
	gameState: GameState,
	nextDirection: Direction): Coordinate =>
{

	// Update game state representation

	let oldHead = gameState.snake[0]!

	// Everything in the old snake, minus the tail

	let newHead = {
		x: oldHead.x,
		y: oldHead.y,
	}

	// Snake: [H] [1] [2] [3]...[n-1] [T]

	switch(nextDirection)
	{
		case Direction.Up:
			newHead.y -= 1
			break;
		case Direction.Down:
			newHead.y += 1
			break;
		case Direction.Left:
			newHead.x -= 1
			break;
		case Direction.Right:
			newHead.x += 1
			break;
	}

	if(gameState.settings.shouldCollideWithWalls === false)
	{
		newHead.x = mod(newHead.x, gameState.dimensions.width)
		newHead.y = mod(newHead.y, gameState.dimensions.height)
	}

	return newHead

}

const getNextDirection = (
	currentDirection: Direction,
	key: Key|null) =>
{

	let nextDirection: Direction = currentDirection;

	if(
		key?.upArrow &&
		currentDirection !== Direction.Down
	)
	{
		nextDirection = Direction.Up
	}
	else if(
		key?.downArrow &&
		currentDirection !== Direction.Up
	)
	{
		nextDirection = Direction.Down
	}
	else if(
		key?.leftArrow &&
		currentDirection !== Direction.Right
	)
	{
		nextDirection = Direction.Left
	}
	else if(
		key?.rightArrow &&
		currentDirection !== Direction.Left
	)
	{
		nextDirection = Direction.Right
	}

	return nextDirection

}

const collides = (
	snake: Snake) =>
{

	// @TODO(mzalla) Keep stateful coordinate map and update on tick;

	let coords: CoordinateMap = {}

	for(let i = 0; i < snake.length; i++) {
		let coord = `${snake[i]!.x}:${snake[i]!.y}`
		if(coord in coords) {
			return true
		}
		coords[coord] = true
	}

	return false

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

	let nextDirection = getNextDirection(gameState.direction, input.key)

	let nextSnakeHead = getNextSnakeHead(gameState, nextDirection)

	let nextDidCollide = false

	if(
		nextSnakeHead.x < 0 || nextSnakeHead.x === gameState.dimensions.width ||
		nextSnakeHead.y < 0 || nextSnakeHead.y === gameState.dimensions.height
	)
	{
		if(gameState.settings.shouldCollideWithWalls === false) {
			nextSnakeHead.x = mod(nextSnakeHead.x, gameState.dimensions.width)
			nextSnakeHead.y = mod(nextSnakeHead.y, gameState.dimensions.height)
		} else {
			nextDidCollide = true;
		}
	}

	let snakeTail = gameState.snake.slice()

	let didGetFruit = (
		nextSnakeHead.x === gameState.fruit.x &&
		nextSnakeHead.y === gameState.fruit.y
	)

	let nextFruit = gameState.fruit

	if(didGetFruit) {
		nextFruit = getRandomCoordinate(gameState.dimensions)
	} else {
		snakeTail.pop()
	}

	let nextSnake = [nextSnakeHead, ...snakeTail]

	if(!nextDidCollide)
	{
		nextDidCollide = collides(nextSnake)
	}

	let nextGameState: GameState = {
		...gameState,
		frame: gameState.frame + 1,
		direction: nextDirection,
		snake: nextSnake,
		fruit: nextFruit,
		score: didGetFruit ? gameState.score + 1 : gameState.score,
		didCollide: nextDidCollide,
	}

	return nextGameState

}
