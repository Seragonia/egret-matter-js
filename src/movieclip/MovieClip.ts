export default class MovieClip extends egret.Bitmap {
    textures: egret.Texture[];
    frames: string[];
    keys: string[];
    autoplay: boolean;
    loop: boolean;
    anchorX: number;
    anchorY: number;
    currentFrame: number;
    frameInterval: number;
    counter: number;
    scale: number;

    constructor({ spritesheet, frames, position, keys = null, autoplay = true, scale = 1, loop = true, anchor, frameInterval = 1 }) {
        super();
        this.frames = frames;
        this.frameInterval = frameInterval;
        this.keys = keys;
        this.autoplay = autoplay;
        this.loop = loop;
        this.anchorX = anchor;
        this.anchorY = anchor;
        if (Array.isArray(anchor)) {
            this.anchorX = anchor[0];
            this.anchorY = anchor[1];
        }
        this.scale = scale;
        this.x = position[0];
        this.y = position[1];
        this.spritesheet = spritesheet;
        if (this.autoplay) {
            this.play();
        }
    }

    pause() {
        egret.stopTick(this.onTick, this);
    }

    resume() {
        egret.startTick(this.onTick, this);
    }

    play(start = 0) {
        this.goto(start);
        this.currentFrame = 0;
        this.counter = 0;
        egret.startTick(this.onTick, this);
    }

    goto(frame: number) {
        this.texture = this.textures[frame];
    }

    onTick() {
        this.counter++;
        if (this.counter == this.frameInterval) {
            this.counter = 0;
            this.currentFrame++;
            this.goto(this.currentFrame);
            if (this.currentFrame == this.frames.length - 1) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.stop();
                }
            }
        }
        return false;
    }

    stop() {
        this.currentFrame = 0;
        egret.stopTick(this.onTick, this);
    }

    set spritesheet(value: egret.SpriteSheet) {
        this.textures = this.frames.map(frame => value.getTexture(frame));
        this.anchorOffsetX = this.textures[0].textureWidth * this.anchorX;
        this.anchorOffsetY = this.textures[1].textureWidth * this.anchorY;
        this.scaleY = this.scale;
        this.scaleX = this.scale;
    }
}