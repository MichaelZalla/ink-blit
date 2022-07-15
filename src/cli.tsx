#!/usr/bin/env node
import React, { StrictMode } from 'react';

import { Text, render } from 'ink';

import App from './components/App/App';

const { clear } = render(
  <StrictMode>
    <App>
      <Text>Hello from App!</Text>
    </App>
  </StrictMode>
);

clear()
