import * as Matter from 'matter-js';
import { LabelScore } from "../entities/old/LabelScore";
import { App } from '../../system/App';
import { Background } from "../entities/Background";
import { Scene } from '../../system/Scene';
import { Platforms } from "../entities/old/Platforms";

export class GameScene extends Scene {
    create() {
        this.container.order = 1;
        this.createBackground();
        //this.createPlatforms();
        //this.setEvents();
        //[13]
        //this.createUI();
        //[/13]
    }
    //[13]
    createUI() {
        this.labelScore = new LabelScore();
        this.container.addChild(this.labelScore);
    }
    //[13]

    setEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }

    onCollisionStart(event) {
        const colliders = [event.pairs[0].bodyA, event.pairs[0].bodyB];
        const hero = colliders.find(body => body.gameHero);
        const platform = colliders.find(body => body.gamePlatform);

        if (hero && platform) {
            this.hero.stayOnPlatform(platform.gamePlatform);
        }

        const diamond = colliders.find(body => body.gameDiamond);

        if (hero && diamond) {
            this.hero.collectDiamond(diamond.gameDiamond);
        }
    }


    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    createPlatforms() {
        this.platfroms = new Platforms();
        this.container.addChild(this.platfroms.container);
    }

    update(dt) {
        this.bg.update(dt);
        this.platfroms.update(dt);
    }

    destroy() {
        Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
        App.app.ticker.remove(this.update, this);
        this.bg.destroy();
        this.platfroms.destroy();
        this.labelScore.destroy();
    }
}