import * as Matter from 'matter-js';
import { App } from '../../system/App';
import { AnimatedSprite, Texture } from 'pixi.js';

export class Explosion {
    constructor(x, y, size) {

        // ensure texture is loaded
        //const t = App.assets.explosion;

        this.size = size;
        this.createSprite(x, y);
        this.createBody();
    }

    createSprite(x, y) {


        const explosionTextures = []
        let i;
        for (i = 0; i < 26; i++) {
            const texture = Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
            explosionTextures.push(texture);
        }
        this.container = new AnimatedSprite(explosionTextures);
        this.container.anchor.set(0.5);
        this.container.rotation = Math.random() * Math.PI;
        this.container.x = x;
        this.container.y = y;
        this.container.loop = false;
        this.container.gotoAndPlay(1);
        this.container.onComplete = this.completed.bind(this);
    }

    createBody() {
        this.body = Matter.Bodies.circle(this.container.x, this.container.y, this.size);
        console.log(this.body);
        this.body.isSensor = true;
        this.body.isExplosion = true;
        Matter.Composite.add(App.physics.world, this.body);
    }

    completed() {
        console.log(this.body);
        Matter.Composite.remove(App.physics.world, this.body);
        this.destroy();
    }

    destroy() {
        console.log("remove explosion");
        if (this.body) {
            console.log("remove explosion body");
            Matter.Composite.remove(App.physics.world, this.body);
            this.body = null;
        }
        if (this.container) {

            this.container.destroy();
            this.container = null;
        }
        return;
    }
}