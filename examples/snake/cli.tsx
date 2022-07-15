#!/usr/bin/env node
import React, { StrictMode } from 'react';

import {render} from 'ink';

import App from '../../src/components/App/App';
import SnakeGame from './components/SnakeGame/SnakeGame';

const { clear, waitUntilExit } = render(
  <StrictMode>
    <App>
      <SnakeGame />
    </App>
  </StrictMode>
);

waitUntilExit().then(clear)

clear()
