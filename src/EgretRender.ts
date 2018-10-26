import getRotation from "./utils/getRotation";

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
        const body = this.circleToRender(x, y, radius, display);
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