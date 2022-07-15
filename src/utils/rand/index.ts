import Coordinate from '../../types/Coordinate';
import Dimensions from '../../types/Dimensions';

export const getRandomCoordinate = (dimensions: Dimensions): Coordinate => ({
	x: Math.round(Math.random() * (dimensions.width  - 1)),
	y: Math.round(Math.random() * (dimensions.height  - 1)),
})
