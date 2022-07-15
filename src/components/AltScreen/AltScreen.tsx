import React, { FC, ReactElement } from 'react';

import { useInput, useStdout } from 'ink';

const EnterAltScreenCommand = '\x1b[?1049h';
const ExitAltScreenCommand = '\x1b[?1049l';

const AltScreen: FC<React.PropsWithChildren> = ({ children }) => {

  const { stdout } = useStdout();

  // See: https://github.com/vadimdemedes/ink/issues/263#issuecomment-1096781629
  React.useMemo(() => stdout?.write(EnterAltScreenCommand), [stdout]);

  React.useEffect(() => {
    return () => {
      process.exit()
    }
  }, [])

  React.useLayoutEffect(() => {

    stdout?.write(EnterAltScreenCommand)

    return () => {
      stdout?.write(ExitAltScreenCommand)
    }

  })

  useInput((input, key) => {

    if(
      key.escape ||
      (
        key.ctrl && input === `c`
      )
    )
    {
      stdout?.write(ExitAltScreenCommand)
    }

  });

  return children as ReactElement

}

AltScreen.displayName = `AltScreen`

module.exports = AltScreen
export default AltScreen
