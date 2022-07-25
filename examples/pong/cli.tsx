#!/usr/bin/env node
import React, { StrictMode } from 'react';

import {render} from 'ink';

import App from '../../src/components/App/App';
import PongGame from './components/PongGame/PongGame';

const { clear, waitUntilExit } = render(
  <StrictMode>
    <App>
      <PongGame />
    </App>
  </StrictMode>
);

waitUntilExit().then(clear)

clear()
