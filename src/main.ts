import * as Matter from 'matter-js'
export default class Main extends egret.DisplayObjectContainer {
    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    onAddToStage(event) {
        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.textColor = 0xffffff;
        textfield.text = 'hello world';

        console.log(Matter)
    }
}


window['Main'] = Main;

import runEgret from "./runEgret";
runEgret();