import * as Matter from 'matter-js';
import { Scene } from '../../system/Scene';
import { Background } from "../entities/Background";
import { Explosion } from "../entities/Explosion";
import { Block } from "../entities/Block";
import { Button } from "../ui/Button";
import { App } from '../../system/App';

export class MainMenu extends Scene {
    create() {
        this.container.order = 1;
        this.prepareAssetBundle('mainmenu').then(() => {
            this.createBackground();
            this.createMenu();
            //this.createBlocks();
            this.setEvents();
        });
    }
    //[13]
    createUI() {

    }

    setEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }

    onCollisionStart(event) {

        event.pairs.forEach(pair => {
            const colliders = [pair.bodyA, pair.bodyB];
            const explosionBody = colliders.find(body => body.isExplosion);
            const blockBody = colliders.find(body => body.block);

            if (explosionBody && blockBody) {
                blockBody.block.destroy();
            }

        });
    }

    createBackground() {
        this.bg = new Background(this.assets.background);
        this.addElement(this.bg);
    }

    createBlocks() {
        for (let index = 0; index < 35; index++) {
            const block = new Block(Math.random() * App.app.screen.width, Math.random() * App.app.screen.height, this.assets.block);
            this.addElement(block);
            block.createBody();
        }
    }

    createMenu() {
        this.startButton = new Button(App.app.screen.width / 2, App.app.screen.height - 400, 400, 100, this.assets.mainbutton);
        this.startButton.setText(App.loca.getText('btn_play'));
        this.startButton.container.on('pointerdown', this.mainClicked.bind(this));
        this.addElement(this.startButton);

        this.returnButton = new Button(App.app.screen.width / 2, App.app.screen.height - 200, 400, 100, this.assets.mainbutton);
        this.returnButton.setText(App.loca.getText('btn_return'));
        this.returnButton.container.on('pointerdown', this.portfolioClicked.bind(this));
        this.addElement(this.returnButton);
    }

    mainClicked() {
        console.log("clicked");
        //var explosion = new Explosion(Math.random() * App.app.screen.width, Math.random() * App.app.screen.height, 80);
        //App.app.stage.addChild(explosion.container);
        App.scenesManager.load("BrickBreaker");
    }

    portfolioClicked() {
        window.location.href = "https://wpatruno.mira-ceti.ovh";
    }

    destroy() {
        Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
        //App.app.ticker.remove(this.update, this);
        this.container.destroy();
    }
}