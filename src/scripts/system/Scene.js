import * as PIXI from "pixi.js";

export class Scene {


    constructor() {
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.order = 1;
    }

    async create() {

    }

    async prepareAssetBundle(bundleName) {
        this.assets = await PIXI.Assets.loadBundle(bundleName);
    }

    update(ticker) {

    }

    addElement(element) {
        if (element == null) return;
        if (element.container != null)
            this.container.addChild(element.container);
        else if (element.sprite != null)
            this.container.addChild(element.sprite);
    }

    destroy() {
    }
}