import getRotation from "./utils/getRotation";
import MovieClip from "./movieclip/MovieClip";

export default class EgretRender {
    private _root: egret.DisplayObjectContainer;
    private _engine: Matter.Engine;
    constructor(root: egret.DisplayObjectContainer, engine: Matter.Engine) {
        this._root = root;
        this._engine = engine;
    }

    addBody(body: Matter.Body, display: egret.DisplayObject) {
        if (display) {
            body['display'] = display;
            this._root.addChild(display);
        }
        return body;
    }

    run() {
        const bodies = Matter.Composite.allBodies(this._engine.world);
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            const display = body['display'] as egret.DisplayObject;
            if (!display) continue;

            // 贴图与刚体位置的小数点后几位有点不一样，需要降低精度
            const x1 = Math.round(display.x)
            const x2 = Math.round(body.position.x)
            const y1 = Math.round(display.y)
            const y2 = Math.round(body.position.y)
            const distanceX = Math.abs(x1 - x2);
            const distanceY = Math.abs(y1 - y2);
            const precision = 0;//精度
            if (distanceX > precision || distanceY > precision) {
                if (display instanceof MovieClip) display.resume();
            } else {
                if (display instanceof MovieClip) display.pause();
            }
            display.x = body.position.x;
            display.y = body.position.y;
            display.rotation = getRotation(body.angle);
        }
    }

    //快速方法
    rectangle(x: number, y: number, width: number, height: number, display: egret.DisplayObject, options?: Matter.IChamferableBodyDefinition) {
        const body = this.rectangleToRender(x, y, width, height, display, options);
        this.addBodyToWorld(body);
        return body;
    }

    circle(x: number, y: number, radius: number, display: egret.DisplayObject, options?: Matter.IChamferableBodyDefinition) {
        const body = this.circleToRender(x, y, radius, display, options);
        this.addBodyToWorld(body);
        return body;
    }

    //工具方法
    private addBodyToWorld(body: Matter.Body) {
        Matter.World.add(this._engine.world, body);
        return body;
    }

    private rectangleToRender(x: number, y: number, width: number, height: number, display: egret.DisplayObject, options?: Matter.IChamferableBodyDefinition) {
        const body = Matter.Bodies.rectangle(x, y, width, height, options);
        this.addBody(body, display);
        return body;
    }

    private circleToRender(x: number, y: number, radius: number, display: egret.DisplayObject, options?: Matter.IChamferableBodyDefinition) {
        const body = Matter.Bodies.circle(x, y, radius, options);
        this.addBody(body, display);
        return body;
    }
}