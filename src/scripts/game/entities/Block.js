import * as Matter from 'matter-js';
import { App } from '../../system/App';
import { Sprite, Texture } from 'pixi.js';

export class Block {
    constructor(x, y, texture) {
        this.createSprite(x, y, texture);
        //App.app.ticker.add(this.update, this);
    }

    createSprite(x, y, texture) {
        this.sprite = new Sprite(texture);
        this.sprite.x = x;
        this.sprite.y = y;
    }

    update() {
        if (this.sprite) {
            Matter.Body.setPosition(this.body, { x: this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, y: this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y });
        }
    }

    createBody() {
        //this.body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, { friction: 0, isStatic: true, render: { fillStyle: '#060a19' } });
        this.body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, { friction: 0, isStatic: true, render: { fillStyle: '#060a19' } });
        this.body.isSensor = true;
        this.body.block = this;
        Matter.World.add(App.physics.world, this.body);
    }

    // [14]
    destroy() {
        console.log("remove block");
        if (this.sprite) {
            //App.app.ticker.remove(this.update, this);
            Matter.World.remove(App.physics.world, this.body);
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}