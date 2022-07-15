import React from 'react'

import { render } from 'ink-testing-library'

import ScreenBuffer from './ScreenBuffer';

const Test = () => <ScreenBuffer buffer={[]} />

const { lastFrame } = render(<Test />)

lastFrame() === `Hello from ScreenBuffer!`
