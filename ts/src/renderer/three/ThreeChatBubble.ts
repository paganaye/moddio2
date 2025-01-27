class ThreeChatBubble extends THREE.Group {
	width = 97;
	height = 16;
	radius = 7;

	private sprite;
	private scaleScalar = 1;

	private size = new THREE.Vector2();
	private center = new THREE.Vector2(0.5, 0.5);
	private offset = new THREE.Vector2();

	private timeout;

	constructor(text: string) {
		super();

		this.scaleScalar = 1;
		console.log(this.scaleScalar);

		this.sprite = this.createBubble(text);
		this.add(this.sprite);

		this.timeout = setTimeout(() => {
			this.visible = false;
		}, 3000);
	}

	update(text: string) {
		this.remove(this.sprite);
		this.sprite = this.createBubble(text);
		this.add(this.sprite);

		this.visible = true;

		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}

		this.timeout = setTimeout(() => {
			this.visible = false;
		}, 3000);
	}

	setOffset(offset: THREE.Vector2, center = new THREE.Vector2(0.5, 0.5)) {
		this.center.copy(center);
		this.offset.copy(offset);

		if (this.sprite) {
			this.sprite.center.set(
				center.x - offset.x / (this.size.x * this.scaleScalar),
				center.y - offset.y / (this.size.y * this.scaleScalar)
			);
		}
	}

	setScale(scale: number) {
		this.scaleScalar = scale;

		this.sprite.center.set(
			this.center.x + this.offset.x / (this.size.x * scale),
			this.center.y + this.offset.y / (this.size.y * scale)
		);

		this.sprite.scale.set(
			this.scaleScalar * Utils.pixelToWorld(this.size.x),
			this.scaleScalar * Utils.pixelToWorld(this.size.y),
			1
		);

		this.sprite.center.set(
			this.center.x - this.offset.x / (this.size.x * scale),
			this.center.y - this.offset.y / (this.size.y * scale)
		);
	}

	private createBubble(text: string, color = '#000000') {
		const textCanvas = document.createElement('canvas');

		const ctx = textCanvas.getContext('2d');
		const font = `bold 12px Arial`;

		const padding = 4;

		var x = padding / 2;
		var y = padding / 2;

		ctx.font = font;
		const metrics = ctx.measureText(text);
		const textWidth = metrics.width;
		const textHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

		const width = textWidth + 20;
		const height = textHeight + 10;

		textCanvas.width = width + padding;
		textCanvas.height = height + padding + 7;
		this.size.set(textCanvas.width, textCanvas.height);

		const halfSizeX = width / 2;
		const halfSizeY = height / 2;

		Utils.fillRoundedRect(ctx, x, y, width, height, 5, color, 0.5);
		Utils.fillTriangle(
			ctx,
			x + halfSizeX,
			y + halfSizeY * 2 + 7,
			x + halfSizeX + 7,
			y + halfSizeY * 2,
			x + halfSizeX + -7,
			y + halfSizeY * 2,
			color,
			0.5
		);

		ctx.font = font;
		ctx.fillStyle = '#fff';
		ctx.fillText(text, x + halfSizeX - textWidth / 2, y + halfSizeY + textHeight / 2 - 3);

		const spriteMap = new THREE.Texture(ctx.getImageData(0, 0, textCanvas.width, textCanvas.height));
		spriteMap.magFilter = ThreeTextureManager.instance().filter;
		spriteMap.generateMipmaps = false;
		spriteMap.needsUpdate = true;
		spriteMap.colorSpace = THREE.SRGBColorSpace;

		const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
		spriteMaterial.depthTest = false;

		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.renderOrder = 1000;
		sprite.scale.set(
			this.scaleScalar * Utils.pixelToWorld(textCanvas.width),
			this.scaleScalar * Utils.pixelToWorld(textCanvas.height),
			1
		);

		sprite.center.set(
			this.center.x - this.offset.x / (this.size.x * this.scaleScalar),
			this.center.y - this.offset.y / (this.size.y * this.scaleScalar)
		);

		return sprite;
	}
}
