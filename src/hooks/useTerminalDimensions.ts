import React from 'react';

type TerminalDimensions = {
	columns: number;
	rows: number;
}

const stdout = process.stdout

const useTerminalDimensions = (): TerminalDimensions => {

	const [dimensions, setDimensions] = React.useState<TerminalDimensions>({
		columns: stdout.columns,
		rows: stdout.rows,
	})

	React.useLayoutEffect(() => {

		function onResize() {

			setDimensions({
				columns: stdout.columns,
				rows: stdout.rows,
			})

		}

		stdout.on('resize', onResize)

		return () => {
			stdout.off('resize', onResize)
		}

	}, [])

	return dimensions

}

export default useTerminalDimensions
