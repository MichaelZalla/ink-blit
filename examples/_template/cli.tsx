#!/usr/bin/env node
import React, { StrictMode } from 'react';

import {render} from 'ink';

import App from '../../src/components/App/App';
import TemplateGame from './components/TemplateGame/TemplateGame';

const { clear, waitUntilExit } = render(
  <StrictMode>
    <App>
      <TemplateGame />
    </App>
  </StrictMode>
);

waitUntilExit().then(clear)

clear()
