export default (texture: egret.Texture) => {
    const spriteSheet = new egret.SpriteSheet(texture);
    const frames = 12;
    const size = 62;
    for (let i = 0; i < frames; i++) {
        const key = i + '';
        const x = size * i;
        spriteSheet.createTexture(key, x, 0, size, size, 0, 0, size, size);
    }
    return spriteSheet;
}