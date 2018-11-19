import DebugRender from "./DebugRender";
import EgretRender from "./EgretRender";
import ImagesLoader from "./loaders/ImagesLoader";
import loadRingSpritesheet from "./loadRingSpritesheet";
import MovieClip from "./movieclip/MovieClip";
import Body from "./physics/Body";
import { getCircleBitmap, getRectangeBitmap } from "./utils/getBitmap";
import loadSpriteSheet from "./loaders/loadSpriteSheet";
export default class Main extends egret.DisplayObjectContainer {
    private _engine: Matter.Engine;
    private _debugRender: DebugRender;
    private _egretRender: EgretRender;
    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    onAddToStage(event) {
        egret.lifecycle.onPause = () => {
            console.log("app 进入后台");
            egret.ticker.pause(); // 关闭渲染与心跳
        }
        egret.lifecycle.onResume = () => {
            console.log("app 进入前台");
            this._lastTimestamp = 0;
            egret.ticker.resume(); // 打开渲染与心跳
        }

        //资源预先加载
        const loader = new ImagesLoader();
        loader.load(['resource/asset/rect.png',
            'resource/asset/circle.png',
            'resource/asset/ring_red.png',
            'resource/asset/ring_yellow.png'
        ]);
        loader.once(egret.Event.COMPLETE, this.onImageLoad, this);
    }

    //资源加载完成
    onImageLoad(e: egret.Event) {
        this.runGame(e.data as egret.Texture[]);
    }

    // this.deviceorientationCb = function(t) {
    //     var e = t.gamma;
    //     this.gamma = e,
    //     e < -70 && (e = -70),
    //     e > 70 && (e = 70),
    //     this._engine.world.gravity.x = t.gamma / 70 * .4
    // }
    deviceorientationCb(t) {
        var e = t.gamma;
        e < -70 && (e = -70);
        e > 70 && (e = 70);
        this._engine.world.gravity.x = t.gamma / 70 * .4;
        alert(1)
    }

    //开始游戏
    async runGame(texture: egret.Texture[]) {
        const keys = ['resource/asset/box.json', 'resource/asset/box.png'];
        const boxTexture = await loadSpriteSheet(keys);
        const ringTextures = texture[2];
        const ringTextures_yellow = texture[3];
        const spritesheet = loadRingSpritesheet(ringTextures);
        const spritesheet_yellow = loadRingSpritesheet(ringTextures_yellow);

        //创建引擎
        const engine = Matter.Engine.create();
        this._engine = engine;

        //创建egret渲染
        const egretRenderContainer = new egret.Sprite();
        this.addChild(egretRenderContainer);
        this._egretRender = new EgretRender(egretRenderContainer, this._engine);

        const shape = new egret.Shape();
        shape.graphics.beginFill(0x00ff00, 1);
        shape.graphics.drawRect(0, 0, 750, 60);
        shape.graphics.endFill();
        shape.anchorOffsetX = 750 / 2;
        shape.anchorOffsetY = 60 / 2;

        const shape2 = new egret.Shape();
        shape2.graphics.beginFill(0x00ff00, 1);
        shape2.graphics.drawRect(0, 0, 60, 1624);
        shape2.graphics.endFill();
        shape2.anchorOffsetX = 60 / 2;
        shape2.anchorOffsetY = 1624 / 2;

        const shape3 = new egret.Shape();
        shape3.graphics.beginFill(0x00ff00, 1);
        shape3.graphics.drawRect(0, 0, 60, 1624);
        shape3.graphics.endFill();
        shape3.anchorOffsetX = 60 / 2;
        shape3.anchorOffsetY = 1624 / 2;

        this._egretRender.rectangle(750 / 2, 1000, 750, 60, shape, { isStatic: true });
        this._egretRender.rectangle(0, 1624 / 2, 60, 1624, shape2, { isStatic: true });
        this._egretRender.rectangle(750, 1624 / 2, 60, 1624, shape3, { isStatic: true });

        //开启debug渲染
        this._debugRender = new DebugRender(this._engine);
        this.addChild(this._debugRender);

        let count = 0;
        let coinsFall = setInterval(() => {
            if (count < 40) {

                // const s = Math.random() > 0.5 ? spritesheet : spritesheet_yellow;
                // const animation = this.createMovieClip(s);
                const animation = this.createBoxMovieClip(boxTexture);
                this.addChild(animation);

                this._egretRender.circle(750 / 2, 100, 80 / 2, animation,
                    { frictionAir: 0.02, restitution: .15 });
                count++;
            } else {
                //结束
            }
        }, 10);

        // const animation = this.createBoxMovieClip(boxTexture);
        // this.addChild(animation);

        // run the engine
        this.runEngine();

        // this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        //     const bodies = Matter.Composite.allBodies(this._engine.world);
        //     const index = Math.floor(Math.random() * bodies.length);
        //     const body = bodies[index];
        //     const display = body['display'] as egret.DisplayObject;
        //     if (!display) return;
        //     var i = body.position.x;
        //     var r = body.position.y;
        //     Matter.Body.applyForce(body,
        //         {
        //             x: i,
        //             y: r
        //         },
        //         {
        //             x: .02,
        //             y: -.03
        //         });
        //     Matter.Body.setAngularVelocity(body, Math.PI / 24)

        //     console.log('this.addforce=1;')
        // }, this);

    }

    createMovieClip(spritesheet) {
        const movieclip = new MovieClip({
            spritesheet: spritesheet,
            frameInterval: 4,
            frames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
            position: [100, 100]
        });
        return movieclip
    }

    createBoxMovieClip(spritesheet) {
        const list = this.fill(1, 20);
        const movieclip = new MovieClip({
            spritesheet: spritesheet,
            frameInterval: 3,
            frames: list,
            position: [750 / 2, 750 / 2],
            scale: 0.2
        });
        return movieclip
    }

    fill(start, end) {
        const list = [];
        for (let i = start; i <= end; i++) {
            let str = i + '';
            if (i < 10)
                str = `0${i}`;
            list.push(str);
        }
        return list;
    }

    runEngine() {
        egret.startTick(this.onTick, this);
    }

    private _lastTimestamp = 0;
    private onTick(timestamp: number) {
        if (this._lastTimestamp === 0) {
            this._lastTimestamp = timestamp;
            return;
        }
        let delta = timestamp - this._lastTimestamp;
        // if (delta > 20)
        //     delta = 20;
        this._lastTimestamp = timestamp;
        Matter.Engine.update(this._engine, delta);
        console.log(delta);
        this._debugRender.run();
        this._egretRender.run();
        return false;
    }
}
window['Main'] = Main;