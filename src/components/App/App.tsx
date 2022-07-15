import React, { FC } from 'react';

// import { Box, Text } from 'ink';

import AltScreen from '../AltScreen/AltScreen';
import FullScreen from '../FullScreen/FullScreen';

type AppProps = React.PropsWithChildren

const App: FC<AppProps> = ({ children }) => {

  // const { exit } = useApp();

  // const { isFocused } = useFocus()

  // const {
  //   enableFocus,
  //   disableFocus,
  //   focusNext,
  //   focusPrevious,
  //   focus,
  // } = useFocusManager();

  // https://github.com/vadimdemedes/ink

  return (
    <AltScreen>
      <FullScreen
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        paddingTop={0}
        paddingBottom={0}
        paddingLeft={0}
        paddingRight={0}>

        {children}

      </FullScreen>
    </AltScreen>
	)

}

App.displayName = `App`

module.exports = App
export default App
