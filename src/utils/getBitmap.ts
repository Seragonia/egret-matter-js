export const getBitmap = (texture: egret.Texture, width: number, height: number) => {
    var display = new egret.Bitmap(texture);
    display.anchorOffsetX = display.width / 2;
    display.anchorOffsetY = display.height / 2;
    display.scaleX = width / display.width;
    display.scaleY = height / display.height;
    return display;
}

export const getRectangeBitmap = (texture: egret.Texture, size: number) => {
    return getBitmap(texture, size, size);
}

export const getCircleBitmap = (texture: egret.Texture, radius: number) => {
    return getBitmap(texture, radius * 2, radius * 2);
}