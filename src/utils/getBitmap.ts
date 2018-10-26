/**
 * 获取一个锚点居中的位图
 */
export const getBitmap = (texture: egret.Texture, width: number, height: number) => {
    var display = new egret.Bitmap(texture);
    display.anchorOffsetX = display.width / 2;
    display.anchorOffsetY = display.height / 2;
    display.scaleX = width / display.width;
    display.scaleY = height / display.height;
    return display;
}

/**
 * 获取一个锚点居中的矩形位图
 */
export const getRectangeBitmap = (texture: egret.Texture, size: number) => {
    return getBitmap(texture, size, size);
}

/**
 * 获取一个锚点居中的圆形位图
 */
export const getCircleBitmap = (texture: egret.Texture, radius: number) => {
    return getBitmap(texture, radius * 2, radius * 2);
}