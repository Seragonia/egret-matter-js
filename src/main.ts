import DebugRender from "./DebugRender";
import EgretRender from "./EgretRender";
import ImagesLoader from "./loaders/ImagesLoader";
import loadSpriteSheet from "./loaders/loadSpriteSheet";
import loadRingSpritesheet from "./loadRingSpritesheet";
import MovieClip from "./movieclip/MovieClip";
const { Body } = Matter;
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

    deviceorientationCb(t) {
        var e = t.gamma;
        e < -70 && (e = -70);
        e > 70 && (e = 70);
        // console.log(e / 70 )

        this._engine.world.gravity.x = e / 70 * .8;
        let f = t.beta;
        f < -70 && (f = -70);
        f > 70 && (f = 70);
        if (f < -20) {
            console.log(f / 70 * .4)
            this._engine.world.gravity.y = f / 70 * .4;
        } else {
            this._engine.world.gravity.y = .4;
        }
    }

    addForce = false;
    stageX = 0;

    // 首先，定义一个摇动的阀值
    SHAKE_THRESHOLD = 3000;
    // 定义一个变量保存上次更新的时间
    last_update = 0;
    // 紧接着定义x、y、z记录三个轴的数据以及上一次出发的时间
    __x;
    __y;
    __z;
    last_x;
    last_y;
    last_z;
    tag = 0;
    deviceMotionHandler(eventData) {
        // 获取含重力的加速度
        var acceleration = eventData.accelerationIncludingGravity;

        // 获取当前时间
        var curTime = new Date().getTime();
        var diffTime = curTime - this.last_update;
        // 固定时间段
        if (diffTime > 100) {
            this.last_update = curTime;

            this.__x = acceleration.x;
            this.__y = acceleration.y;
            this.__z = acceleration.z;

            var speed = Math.abs(this.__x + this.__y + this.__z - this.last_x - this.last_y - this.last_z) / diffTime * 10000;

            if (speed > this.SHAKE_THRESHOLD) {
                // TODO:在此处可以实现摇一摇之后所要进行的数据逻辑操作
                if (this.tag == 0) {
                    this.tag = 1;
                    console.log('摇一摇了');
                    const bodies = Matter.Composite.allBodies(this._engine.world);
                    bodies.forEach(body => {
                        const display = body['display'] as egret.DisplayObject;
                        if (!display) return;
                        const stren = .5;
                        const dir = Math.random() * 2 - 1;
                        Matter.Body.applyForce(body, { x: body.position.x, y: body.position.y }, { x: stren * dir, y: stren * dir });
                    });
                    setTimeout(() => {
                        this.tag = 0;

                    }, 1000);
                }

            }

            this.last_x = this.__x;
            this.last_y = this.__y;
            this.last_z = this.__z;
        }
    }


    //开始游戏
    async runGame(texture: egret.Texture[]) {

        if (window['DeviceMotionEvent']) {
            // 移动浏览器支持运动传感事件
            window.addEventListener('devicemotion', this.deviceMotionHandler.bind(this), false);
        } else {
            // 移动浏览器不支持运动传感事件
        }

        if (window['DeviceOrientationEvent']) {
            window.addEventListener('deviceorientation', this.deviceorientationCb.bind(this), false);
        } else { document.querySelector('body').innerHTML = '你的瀏覽器不支援喔'; }

        const keys = ['resource/asset/box.json', 'resource/asset/box.png'];
        const keysBoom = ['resource/asset/boom.json', 'resource/asset/boom.png'];
        const boxTexture = await loadSpriteSheet(keys);
        const boomTexture = await loadSpriteSheet(keysBoom);
        const ringTextures = texture[2];
        const ringTextures_yellow = texture[3];
        const spritesheet = loadRingSpritesheet(ringTextures);
        const spritesheet_yellow = loadRingSpritesheet(ringTextures_yellow);

        //创建引擎
        const engine = Matter.Engine.create();
        this._engine = engine;
        this._engine.world.gravity.y = 0.2;

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
        const basket = 2;
        const award = 4;
        const bubble = 8;
        const bubbleStandby = 16;
        const bubbleGroup = -1;
        const bubbleStandbyGroup = -2;

        const wallMask = award + bubble + bubbleStandby;
        const basketMask = award + bubble + bubbleStandby;
        const awardMask = wall + basket + bubble;
        const bubbleMask = wall + basket + award;
        const bubbleStandbyMask = wall + basket;

        this._egretRender.rectangle(750 / 2, 1000, 750, 60, shape, { isStatic: true, collisionFilter: { group: wall, category: wall, mask: wallMask } });
        this._egretRender.rectangle(750 / 2, 50, 750, 60, shape4, { isStatic: true, collisionFilter: { group: wall, category: wall, mask: wallMask } });
        this._egretRender.rectangle(0, 1624 / 2, 60, 1624, shape2, { isStatic: true, collisionFilter: { group: wall, category: wall, mask: wallMask } });
        this._egretRender.rectangle(750, 1624 / 2, 60, 1624, shape3, { isStatic: true, collisionFilter: { group: wall, category: wall, mask: wallMask } });

        // create a renderer
        const options: any = {
            width: 750,
            height: 1624,
            wireframes: !1,
        };

        const render = Matter.Render.create({
            element: document.getElementById('debugCanvas'),
            engine: engine,
            options: options
        });
        Matter.Render.run(render);

        const horseShoe = Matter.Vertices.fromPath('0 0 1 0 10 90 190 90 199 0 200 0 200 100 0 100', null);
        const body = Matter.Bodies.fromVertices(750 / 2, 400, [horseShoe], { isStatic: true, collisionFilter: { group: basket, category: basket, mask: basketMask } }, true);
        Matter.World.add(this._engine.world, body);

        let count = 0;
        let coinsFall = setInterval(() => {
            if (count < 20) {
                const animation = this.createBoomMovieClip(boomTexture);
                // const animation = this.createBoxMovieClip(boxTexture);
                this.addChild(animation);
                this._egretRender.circle(375 + Math.random() * 200 - 100, 800, 215 / 2/2.5, animation,
                    {
                        collisionFilter: { group: award, category: award, mask: awardMask }
                    });
                count++;
            } else {
                //结束
            }
        }, 10);


        setInterval(() => {
            const scale = .5;
            const scaleX = .1;
            const x0 = Math.random() > .5 ? (120) : (750 - 120);
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const body = Matter.Bodies.circle(x0, 950, Math.random() * 3 + 6, {
                        restitution: 0,
                        force: { x: (Math.random() * .02 - .01) * scaleX, y: -0.02 * scale },
                        collisionFilter: { group: bubbleStandbyGroup, category: bubbleStandby, mask: bubbleStandbyMask }
                    }, 4);
                    setTimeout(() => {
                        Matter.World.remove(this._engine.world, body);
                    }, 800);
                    Matter.World.add(this._engine.world, body);
                }, i * 50);
            }
            console.log('自动吹')
        }, 2000);

        // run the engine
        this.runEngine();

        //开启debug渲染
        this._debugRender = new DebugRender(this._engine);
        this.addChild(this._debugRender);

        Matter.Events.on(this._engine, 'beforeUpdate', () => {
            if (!this.addForce) return
            this.addForce = false;
            const scale = 1.7;
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const body = Matter.Bodies.circle(this.stageX, 950 + 50, Math.random() * 5 + 8, {
                        density: 0.001 * 3,
                        restitution: 1,
                        force: { x: Math.random() * .02 - .01, y: -0.02 * scale },
                        collisionFilter: { group: bubbleGroup, category: bubble, mask: bubbleMask }
                    }, 4);
                    setTimeout(() => {
                        Matter.World.remove(this._engine.world, body);
                    }, 2000);
                    Matter.World.add(this._engine.world, body);
                }, Math.random() * 200);
            }
            console.log('吹起来');
        });

        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
            this.addForce = true;
            this.stageX = e.stageX;
        }, this);

    }

    createMovieClip(spritesheet) {
        const movieclip = new MovieClip({
            spritesheet: spritesheet,
            frameInterval: 4,
            frames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
            position: [100, 100], anchor: .5
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
            scale: 0.2, anchor: .5
        });
        return movieclip
    }

    createBoomMovieClip(spritesheet) {
        const list = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
        const movieclip = new MovieClip({
            spritesheet: spritesheet,
            frameInterval: 60/30,
            frames: list,
            position: [750 / 2, 750 / 2],
            scale: .3,
            anchor: [.505,.268]
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