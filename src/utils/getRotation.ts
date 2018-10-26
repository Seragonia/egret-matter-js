/**
 * matter.js angle转egret rotation
 */
export default (angle: number) => {
    return angle / Math.PI / 2 * 360;
}