import React from 'react'

import { render } from 'ink-testing-library'

import TemplateName from './TemplateName';

const Test = () => <TemplateName />

const { lastFrame } = render(<Test />)

lastFrame() === `Hello from TemplateName!`
