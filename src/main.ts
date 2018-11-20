import DebugRender from "./DebugRender";
import EgretRender from "./EgretRender";
import ImagesLoader from "./loaders/ImagesLoader";
import getAngle from "./utils/getAngle";
import getRotation from "./utils/getRotation";
const { Body, Bodies, World, Constraint } = Matter;
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

    //开始游戏
    async runGame(texture: egret.Texture[]) {
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

        const shape4 = new egret.Shape();
        shape4.graphics.beginFill(0x00ff00, 1);
        shape4.graphics.drawRect(0, 0, 750, 60);
        shape4.graphics.endFill();
        shape4.anchorOffsetX = 750 / 2;
        shape4.anchorOffsetY = 60 / 2;

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

        const wall = 1;
        const noname = 2;
        const wallMask = noname;
        const nonameMask = wall;

        this._egretRender.rectangle(750 / 2, 1000, 750, 60, shape, { isStatic: true, collisionFilter: { group: wall, category: wall, mask: wallMask } });
        this._egretRender.rectangle(750 / 2, 50, 750, 60, shape4, { isStatic: true, collisionFilter: { group: wall, category: wall, mask: wallMask } });
        this._egretRender.rectangle(0, 1624 / 2, 60, 1624, shape2, { isStatic: true, collisionFilter: { group: wall, category: wall, mask: wallMask } });
        this._egretRender.rectangle(750, 1624 / 2, 60, 1624, shape3, { isStatic: true, collisionFilter: { group: wall, category: wall, mask: wallMask } });

        // create a renderer
        const render = Matter.Render.create({
            element: document.getElementById('debugCanvas'),
            engine: engine,
            options: {
                width: 750,
                height: 1624,
                wireframes: !1,
            }
        });
        Matter.Render.run(render);

        // run the engine
        this.runEngine();

        //开启debug渲染
        this._debugRender = new DebugRender(this._engine);
        this.addChild(this._debugRender);



        // Create a cross-shaped compound body that is composed of two rectangle bodies joined together
        const seesaw = Bodies.rectangle(375, 700, 400, 10, {
            isStatic: true,
            friction: 0,
            collisionFilter: { group: noname, category: noname, mask: nonameMask },
        });

        let touchLeft = false;
        let touchRight = false;
        let angle = 0;
        egret.startTick(() => {
            if (touchLeft)
                angle += getAngle(-1);
            if (touchRight)
                angle += getAngle(1);
            let rotation = getRotation(angle);
            if (rotation > 30) {
                rotation = 30;
            }
            if (rotation < -30) {
                rotation = -30;
            }
            Body.setAngle(seesaw, getAngle(rotation));
            return false;
        }, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
            touchLeft = e.stageX < 375;
            touchRight = !touchLeft;
        }, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => {
            touchLeft = false;
            touchRight = false;
        }, this);

        const rectangle = Bodies.circle(375 + 150, 200, 20, {
            isStatic: false,
            friction: 0,
            restitution: .5,
            collisionFilter: { group: noname, category: noname, mask: nonameMask }
        });

        //钉子约束
        const nailConstraint = Constraint.create({
            pointA: {
                x: 375,
                y: 700
            },
            bodyB: seesaw,
            pointB: {
                x: 0,
                y: 0
            },
            stiffness: 1
        })

        World.add(this._engine.world, [seesaw, rectangle]);
        World.add(this._engine.world, nailConstraint);
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
        if (delta > 20)
            delta = 20;
        this._lastTimestamp = timestamp;
        Matter.Engine.update(this._engine, delta);
        // console.log(delta);
        // this._debugRender.run();
        this._egretRender.run();
        return false;
    }
}
window['Main'] = Main;