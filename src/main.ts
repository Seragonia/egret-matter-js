import DebugRender from "./DebugRender";
export default class Main extends egret.DisplayObjectContainer {
    private _engine: Matter.Engine;
    private _debugRender: DebugRender;

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
    }

    runGame() {
        // create an engine
        const engine = Matter.Engine.create();
        this._engine = engine;

        // create two boxes and a ground
        var boxA = Matter.Bodies.rectangle(750 / 2, 200, 750, 80);
        var boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
        var ground = Matter.Bodies.rectangle(750 / 2, 1000, 750, 60, { isStatic: true });

        // add all of the bodies to the world
        Matter.World.add(engine.world, [boxA, boxB, ground]);

        // run the engine
        this.runEngine();

        this._debugRender = new DebugRender(this._engine);
        this.addChild(this._debugRender);
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
        return false;
    }
}
window['Main'] = Main;