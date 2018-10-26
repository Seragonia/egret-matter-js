/**
 * egret rotation转matter.js angle
 */
export default (rotation: number) => {
    return rotation / 360 * Math.PI * 2;
}