export const mod = (
	a: number,
	b: number): number =>
{
	let c = a % b

	return (c < 0) ? c + b : c
}
