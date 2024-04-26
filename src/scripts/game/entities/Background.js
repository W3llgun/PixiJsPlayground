import * as PIXI from "pixi.js";
import { App } from "../../system/App";

export class Background {
    constructor(texture) {
        this.texture = texture;
        this.speed = App.config.bgSpeed;
        this.container = new PIXI.Container();
        this.createSprite();
    }


    createSprite() {
        const sprite = new PIXI.TilingSprite(
            {
                texture: this.texture,
                width: App.app.screen.width,
                height: App.app.screen.height,
                tileScale: { x: 0.5, y: 0.5 }
            }
        );
        sprite.x = 0;
        sprite.y = 0;
        this.container.addChild(sprite);
    }

    destroy() {
        this.container.destroy();
    }
}