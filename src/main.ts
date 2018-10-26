import DebugRender from "./DebugRender";
import EgretRender from "./EgretRender";
import ImagesLoader from "./loaders/ImagesLoader";
import { getCircleBitmap, getRectangeBitmap } from "./utils/getBitmap";
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
        loader.load(['resource/asset/rect.png', 'resource/asset/circle.png']);
        loader.once(egret.Event.COMPLETE, this.onImageLoad, this);
    }

    //资源加载完成
    onImageLoad(e: egret.Event) {
        this.runGame(e.data as egret.Texture[]);
    }

    //开始游戏
    runGame(texture: egret.Texture[]) {
        //创建引擎
        const engine = Matter.Engine.create();
        this._engine = engine;

        //创建egret渲染
        const egretRenderContainer = new egret.Sprite();
        this.addChild(egretRenderContainer);
        this._egretRender = new EgretRender(egretRenderContainer, this._engine);

        //创建刚体
        var boxADisplay = getRectangeBitmap(texture[0], 110);
        this._egretRender.rectangle(750 / 2, 200, 110, 110, boxADisplay);

        var boxBDisplay = getRectangeBitmap(texture[0], 80);
        this._egretRender.rectangle(550, 50, 80, 80, boxBDisplay);

        var boxCDisplay = getCircleBitmap(texture[1], 110 / 2)
        this._egretRender.circle(750 / 2 - 10, 100, 110 / 2, boxCDisplay);

        const shape = new egret.Shape();
        shape.graphics.beginFill(0x00ff00, 1);
        shape.graphics.drawRect(0, 0, 750, 60);
        shape.graphics.endFill();
        shape.anchorOffsetX=750/2;
        shape.anchorOffsetY=60/2;
        this._egretRender.rectangle(750 / 2, 1000, 750, 60, shape, { isStatic: true });

        //开启debug渲染
        this._debugRender = new DebugRender(this._engine);
        this.addChild(this._debugRender);

        // run the engine
        this.runEngine();
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
        const delta = timestamp - this._lastTimestamp;
        this._lastTimestamp = timestamp;
        Matter.Engine.update(this._engine, delta);

        this._debugRender.run();
        this._egretRender.run();
        return false;
    }
}
window['Main'] = Main;