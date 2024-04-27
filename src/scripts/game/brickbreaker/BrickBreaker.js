import * as Matter from 'matter-js';
import { Scene } from '../../system/Scene';
import { Background } from "../entities/Background";
import { Explosion } from "../entities/Explosion";
import { BBPlayerbar } from "../brickbreaker/BBPlayerbar";
import { App } from '../../system/App';
import { TextUI } from '../ui/TextUI';
import { BB_Ball } from './BB_Ball';
import { BB_Block } from './BB_Block';

export class BrickBreaker extends Scene {


    async create() {
        await this.prepareAssetBundle('brickbreaker');

        // Settings
        this.score = 0;
        this.combo = 1;
        this.ballLeft = 4;
        this.maxCombo = 15;
        this.balls = [];

        this.ballSize = App.pwidth(1);
        this.maxX = App.width() - (this.ballSize / 2);
        this.maxY = App.height() + this.ballSize;
        this.minX = this.ballSize / 2;
        this.minY = this.ballSize / 2;

        // Create entities
        this.createBackground();
        this.createPlayer();
        this.createUI()
        this.createBall();
        this.borderWalls();
        this.createBlocks();

        // Physics event
        this.setEvents();
    }
    //[13]
    createUI() {
        this.scoringCount = 0;
        this.scoringLabel = new TextUI("Score ");
        this.scoringLabel.setSize(App.pwidth(1.5));
        this.scoringLabel.setPosition(App.pwidth(5), App.pheight(96));
        this.addElement(this.scoringLabel);

        this.ballLabel = new TextUI("Ball " + this.ballLeft);
        this.ballLabel.setSize(App.pwidth(1.5));
        this.ballLabel.setPosition(App.pwidth(80), App.pheight(96));
        this.addElement(this.ballLabel);
    }

    setEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }

    createBlocks() {
        const size = App.pwidth(2);
        const startWidth = App.pwidth(9);
        const widthStep = App.pwidth(2.11);
        const targetWidth = App.width() - startWidth;

        const heightOffset = App.pheight(5);

        for (let index = 0; index < 5; index++) {

            let width = startWidth;
            let columnIndex = 0;
            const height = heightOffset + (widthStep * index);

            while (width < targetWidth) {
                width += (widthStep);
                const block = new BB_Block(startWidth + (widthStep * columnIndex), height, size, this.assets.block);
                columnIndex++;
                this.addElement(block);
            }
        }
    }

    createPlayer() {
        this.player = new BBPlayerbar(App.pwidth(50), App.height() - 100, App.pwidth(16), App.pwidth(1));
        this.addElement(this.player);
    }

    createBall() {
        this.ballLeft--;
        this.ballLabel.setText("Ball " + this.ballLeft);
        var ball = new BB_Ball(App.pwidth(50), App.pheight(80), this.ballSize, this.assets.ball);

        ball.init((Math.random() * 2) - 1, -2);
        this.addElement(ball);
        this.balls.push(ball);
    }

    createBackground() {
        this.bg = new Background(this.assets.background);
        this.addElement(this.bg);
    }

    borderWalls() {
        // for now walls are hard coded as screen border

        //this.wallLeft = Matter.Bodies.rectangle(0, App.pwidth(50), 20, App.height(), { friction: 0, frictionStatic: 0, restitution: 1, frictionAir: 0, isStatic: true, render: { fillStyle: '#060a19' } });
        //this.wallRight = Matter.Bodies.rectangle(App.width(), App.pwidth(50), 20, App.app.screen.height, { friction: 0, frictionStatic: 0, restitution: 1, frictionAir: 0, isStatic: true, render: { fillStyle: '#060a19' } });
        //this.wallTop = Matter.Bodies.rectangle(App.pwidth(50), 0, App.app.screen.width, 20, { friction: 0, frictionStatic: 0, restitution: 1, frictionAir: 0, isStatic: true, render: { fillStyle: '#060a19' } });
        //this.wallLeft.restitution = 1;
        //this.wallRight.restitution = 1;
        //this.wallTop.restitution = 1;
        //Matter.Composite.add(App.physics.world, this.wallLeft);
        //Matter.Composite.add(App.physics.world, this.wallRight);
        //Matter.Composite.add(App.physics.world, this.wallTop);
    }

    onCollisionStart(event) {
        event.pairs.forEach(pair => {
            const colliders = [pair.bodyA, pair.bodyB];
            const ballBody = colliders.find(body => body.ball);
            if (!ballBody) return;
            const playerBody = colliders.find(body => body.player);
            const bumperBody = colliders.find(body => body.isBumper);
            const blockBody = colliders.find(body => body.block);

            if (bumperBody) {
                ballBody.ball.bumpFromAny(bumperBody);
            }
            else if (playerBody) {
                ballBody.ball.bumpFromPlayer(playerBody);

            } else if (blockBody) {
                this.addScore(blockBody.block.scoreValue)
                blockBody.block.destroy();
                ballBody.ball.bumpFromAny(blockBody);
            }
        });
    }

    addScore(value) {
        this.scoringCount += value * this.combo;
        if (this.combo > 1) {
            this.scoringLabel.setText("Score " + this.scoringCount + " COMBO x" + this.combo + " !")
        }
        else this.scoringLabel.setText("Score " + this.scoringCount);
        if (this.combo < this.maxCombo) this.combo++;
    }

    Clicked() {
        var explosion = new Explosion(Math.random() * App.app.screen.width, Math.random() * App.app.screen.height, 80);
        App.app.stage.addChild(explosion.container);
    }

    update(dt) {
        this.player.move(App.mousePosition);
        this.balls.forEach(b => {
            this.moveBall(b, dt);
        });
    }

    moveBall(b, dt) {

        b.move(dt);

        // Check screen borders
        if (b.container.x > this.maxX) {
            b.setVelocityXNeg();
        } else if (b.container.x < this.minX) {
            b.setVelocityXPos();
        }
        else if (b.container.y < this.minY) {
            b.setVelocityYPos();
        }
        else if (b.container.y > this.maxY) {
            this.destroyBall(b);
            if (this.ballLeft > 0) {
                this.createBall();
            }
            else {
                this.endGame();
            }
        }
    }

    endGame() {
        this.ballLabel.setText("Game Finished !");
    }

    destroyBall(b) {
        this.combo = 1;
        b.destroy();
        this.balls = this.balls.filter(x => x != b);
    }

    destroy() {
        Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
        this.bg.destroy();
        this.player.destroy();
        this.balls.forEach(b => {
            b.destroy();
        });

        //Matter.Composite.remove(App.physics.world, this.wallLeft);
        //Matter.Composite.remove(App.physics.world, this.wallRight);
        //Matter.Composite.remove(App.physics.world, this.wallTop);
    }
}