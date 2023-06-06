type Shape = 'circle' | 'rectangle'

interface Vector2D {
	x: number;
	y: number;
}


class TileShape {
	shape: Shape;
	size: Vector2D;
	sample: Record<number, Record<number, number>> = {};

	constructor(size: Vector2D = { x: 1, y: 1 }, shape: Shape = 'circle') {
		this.shape = shape;
		this.size = size;
	}

	calcSample(selectedTileArea: Record<number, Record<number, number>>, size: Vector2D): Record<number, Record<number, number>> {
		const xArray = Object.keys(selectedTileArea);
		const yArray = Object.values(selectedTileArea).map((object) => Object.keys(object)).flat().sort((a, b) => parseInt(a) - parseInt(b));
		const minX = parseInt(xArray[0]);
		const minY = parseInt(yArray[0]);
		const maxX = parseInt(xArray[xArray.length - 1]);
		const maxY = parseInt(yArray[yArray.length - 1]);
		const xLength = maxX - minX + 1;
		const yLength = maxY - minY + 1;
		this.sample = {};
		switch (this.shape) {
			case 'rectangle': {
				this.calcRect(minX, xLength, minY, yLength, selectedTileArea, size);
				break;
			}
			case 'circle': {
				this.calcCircle(minX, xLength, minY, yLength, selectedTileArea, size);
				break;
			}
		}

		return this.sample;
	}

	calcCircle(minX: number, xLength: number, minY: number, yLength: number, selectedTileArea: Record<number, Record<number, number>>, size: Vector2D) {

		const circleGenerator = circle(Math.floor(Math.max(size.x, size.y) / 2) + 1);
		let maxLoop = MAX_LOOP;
		while (maxLoop > 0) {
			const circleValue = circleGenerator.next();
			if (circleValue.done) {
				break;
			}
			const vec2d = circleValue.value as Vector2D;
			if (selectedTileArea[minX + vec2d.x % xLength] && selectedTileArea[minX + vec2d.x % xLength][minY + vec2d.y % yLength]) {
				if (!this.sample[vec2d.x]) {
					this.sample[vec2d.x] = {};
				}
				this.sample[vec2d.x][vec2d.y] = selectedTileArea[minX + vec2d.x % xLength][minY + vec2d.y % yLength];
			}
			console.log(vec2d);
			maxLoop -= 1;
		}
	}

	calcRect(minX: number, xLength: number, minY: number, yLength: number, selectedTileArea: Record<number, Record<number, number>>, size: Vector2D) {
		for (let i = 0; i < size.x; i++) {
			if (!this.sample[i]) {
				this.sample[i] = {};
			}
			for (let j = 0; j < size.y; j++) {
				if (selectedTileArea[minX + i % xLength] && selectedTileArea[minX + i % xLength][minY + j % yLength]) {
					this.sample[i][j] = selectedTileArea[minX + i % xLength][minY + j % yLength];
				}
			}
		}
	}

}