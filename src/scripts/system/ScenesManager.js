import * as PIXI from "pixi.js";
import { App } from "./App";

export class ScenesManager {

    constructor() {
        this.container = new PIXI.Container();

        this.sceneContainer = new PIXI.Container();
        this.sceneContainer.interactive = true;

        this.frontContainer = new PIXI.Container();
        this.frontContainer.interactive = true;

        this.container.addChild(this.sceneContainer);
        this.container.addChild(this.frontContainer);
        this.scene = null;
        App.app.ticker.add(this.update, this);
    }

    async load(scene) {
        await this.startLoading();

        if (this.scene) {
            this.sceneContainer.removeChild(this.scene.container);
            this.scene.destroy();
        }

        this.scene = new App.config.scenes[scene]();
        this.sceneContainer.addChild(this.scene.container);
        await this.scene.create();
        if (this.scene.noSidePanel) {
            this.removeSideMenu();
        } else {
            this.createSideMenu();
        }

        await this.endLoading();
    }

    createSideMenu() {
        if (!this.sideMenu) {
            this.sideMenu = new App.config.scenes['SideMenu']();
            this.sideMenu.create();
            this.frontContainer.addChild(this.sideMenu.container);
        }
    }

    hideShideMenu() {

    }

    removeSideMenu() {
        if (this.sideMenu) {
            this.sideMenu.destroy();
            this.frontContainer.removeChild(this.sideMenu.container);
            this.sideMenu = null;
        }
    }

    async startLoading() {
        if (!this.loadingScene) {
            this.loadingScene = new App.config.scenes['Loading']();
            await this.loadingScene.create();
        }
        this.frontContainer.addChild(this.loadingScene.container);
        this.loadingSceneActive = true;
        await this.loadingScene.show();

    }

    async endLoading() {
        if (this.loadingScene) {
            await this.loadingScene.hide();
            this.frontContainer.removeChild(this.loadingScene.container);
            this.loadingSceneActive = false;
        }
    }

    destroy() {
        App.app.ticker.remove(this.update, this);
    }

    update(dt) {
        if (this.loadingSceneActive) {
            this.loadingScene.update(dt);
        } else if (this.scene && this.scene.update) {
            this.scene.update(dt);
        }
    }
}