import TextBuffer from '../../types/Buffer'
import Dimensions from '../../types/Dimensions'

export const getEmptyFrameBuffer = (
	dimensions: Dimensions): TextBuffer =>
{

	let { width, height } = dimensions

	let buffer: TextBuffer = []

	for(let i = 0; i < height; i++) {
		buffer.push(` `.repeat(width).split(``))
	}

	return buffer

}
