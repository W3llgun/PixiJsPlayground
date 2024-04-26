import * as Matter from 'matter-js';
import { App } from '../../system/App';
import { Background } from "../entities/Background";
import { Scene } from '../../system/Scene';

export class LoadingScene extends Scene {
    inSpeed = 20;
    outSpeed = 45;
    async create() {

        await this.prepareAssetBundle("loading");
        this.bg = new Background(this.assets.background);
        this.addElement(this.bg);
        this.container.y = 0;
    }


    async show() {
        while (this.container.y < 0) {
            this.container.y += this.inSpeed;
            await new Promise(res => setTimeout(res, 10));
        }
    }

    async hide() {
        while (this.container.y > -App.app.screen.height) {
            this.container.y -= this.outSpeed;
            await new Promise(res => setTimeout(res, 10));
        }
    }

    destroy() {

    }
}