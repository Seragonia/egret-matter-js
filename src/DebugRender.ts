export default class DebugRender extends egret.Shape {
    private _engine: Matter.Engine;
    constructor(engine: Matter.Engine) {
        super();
        this._engine = engine;
    }

    run() {
        const bodies = Matter.Composite.allBodies(this._engine.world);
        this.graphics.clear();
        this.graphics.lineStyle(1, 0x999999);
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            const vertices = body.vertices;
            this.graphics.moveTo(vertices[0].x, vertices[0].y);
            for (let j = 1; j < vertices.length; j++) {
                const vertice = vertices[j];
                this.graphics.lineTo(vertice.x, vertice.y);
            }
            this.graphics.lineTo(vertices[0].x, vertices[0].y);
        }
        this.graphics.endFill();
    }
}