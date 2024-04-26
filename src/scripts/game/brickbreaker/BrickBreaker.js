import * as Matter from 'matter-js';
import { Scene } from '../../system/Scene';
import { Background } from "../entities/Background";
import { Explosion } from "../entities/Explosion";
import { Block } from "../entities/Block";
import { BBPlayerbar } from "../brickbreaker/BBPlayerbar";
import { App } from '../../system/App';
import { BB_Ball } from './BB_Ball';

export class BrickBreaker extends Scene {
    ballSize = 35;

    async create() {
        await this.prepareAssetBundle('brickbreaker');
        this.score = 0;
        this.combo = 0;
        this.balls = [];
        this.maxX = App.app.screen.width - (this.ballSize / 2);
        this.maxY = App.app.screen.height + this.ballSize;
        this.minX = (this.ballSize);
        this.minY = (this.ballSize);
        this.container.order = 1;
        this.createBackground();
        this.createPlayer();
        this.createBall();
        //his.createBlocks();
        this.setEvents();
        this.borderWalls();
    }
    //[13]
    createUI() {

    }

    setEvents() {
        Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
    }

    createPlayer() {
        this.player = new BBPlayerbar(850, App.app.screen.height - 100, 300, 25);
        this.addElement(this.player);
    }

    createBall() {
        var ball = new BB_Ball(App.app.screen.width / 2, App.app.screen.height / 2, 55, this.assets.ball);
        ball.velocity.x = 2;
        ball.velocity.y = (Math.random() * 4) - 2;
        ball.init();
        this.addElement(ball);
        this.balls.push(ball);
    }

    createBackground() {
        this.bg = new Background(this.assets.background);
        this.addElement(this.bg);
    }

    createBlocks() {
        for (let index = 0; index < 35; index++) {
            const block = new Block(Math.random() * App.app.screen.width, Math.random() * App.app.screen.height);
            this.addElement(block);
            block.createBody();
        }
    }

    borderWalls() {
        this.wallLeft = Matter.Bodies.rectangle(0, App.app.screen.height / 2, 20, App.app.screen.height, { friction: 0, frictionStatic: 0, restitution: 1, frictionAir: 0, isStatic: true, render: { fillStyle: '#060a19' } });
        this.wallRight = Matter.Bodies.rectangle(App.app.screen.width, App.app.screen.height / 2, 20, App.app.screen.height, { friction: 0, frictionStatic: 0, restitution: 1, frictionAir: 0, isStatic: true, render: { fillStyle: '#060a19' } });
        this.wallTop = Matter.Bodies.rectangle(App.app.screen.width / 2, 0, App.app.screen.width, 20, { friction: 0, frictionStatic: 0, restitution: 1, frictionAir: 0, isStatic: true, render: { fillStyle: '#060a19' } });
        this.wallLeft.restitution = 1;
        this.wallRight.restitution = 1;
        this.wallTop.restitution = 1;
        Matter.Composite.add(App.physics.world, this.wallLeft);
        Matter.Composite.add(App.physics.world, this.wallRight);
        Matter.Composite.add(App.physics.world, this.wallTop);
    }

    onCollisionStart(event) {
        event.pairs.forEach(pair => {
            const colliders = [pair.bodyA, pair.bodyB];
            const playerBody = colliders.find(body => body.player);
            const ballBody = colliders.find(body => body.ball);

            if (playerBody && ballBody) {
                //ballBody.position.y
                ballBody.ball.setVelocityYNeg();
                //ballBody.ball.pushX(playerBody.player.velocityX);
            }
        });

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
        if (b.container.x > this.maxX) {
            b.setVelocityXNeg();
        } else if (b.container.x < this.minX) {
            b.setVelocityXPos();
        }
        else if (b.container.y < this.minY) {
            b.setVelocityYPos();
        }
        else if (b.container.y > this.maxY) {
            this.combo = 0;
            this.destroyBall(b);
        }
    }

    destroyBall(b) {
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

        Matter.Composite.remove(App.physics.world, this.wallLeft);
        Matter.Composite.remove(App.physics.world, this.wallRight);
        Matter.Composite.remove(App.physics.world, this.wallTop);
    }
}