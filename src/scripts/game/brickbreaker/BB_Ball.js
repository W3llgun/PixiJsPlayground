import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from '../../system/App';

export class BB_Ball {
    velocity = { x: 0, y: 0 };

    constructor(x, y, size, texture) {
        this.container = new PIXI.Container();

        this.createSprite(x, y, size, texture);
        this.createBody(x, y, size);

        this.container.x = x;
        this.container.y = y;
        // this.container.width = size;
        // this.container.height = size;
        // this.container.pivot.x = size / 2;
        // this.container.pivot.y = size / 2;

        // App.app.ticker.add((time) => {
        //     // Continuously rotate the container!
        //     // * use delta to create frame-independent transform *
        //     this.container.rotation -= 0.1 * time.deltaTime;
        // });
    }


    createSprite(x, y, size, texture) {
        var rect = new PIXI.Graphics().circle(0, 0, size / 2).fill('blue');

        var sprite = new PIXI.Sprite(
            {
                texture: texture,
                width: size,
                height: size,
            }
        );
        this.container.addChild(rect);
    }

    createBody(x, y, size) {
        this.body = Matter.Bodies.circle(x, y, size / 2, { density: 1, inertia: Infinity, friction: 0, frictionStatic: 0, restitution: 1, frictionAir: 0, isStatic: false, render: { fillStyle: '#060a19' } });
        // ball is sensor because physic bouncing with resitution 1 is bugged and inconsistant. Not what is expected for a brickbreaker
        this.body.isSensor = true;
        this.body.ball = this;
        Matter.Composite.add(App.physics.world, this.body);
    }

    destroy() {
        this.container.destroy();
        if (this.body) {
            Matter.Composite.remove(App.physics.world, this.body);
        }
    }

    init() {
        Matter.Body.setVelocity(this.body, this.velocity);
    }

    move(dt) {
        // this.container.x += this.velocity.x * dt.deltaTime;
        // this.container.y += this.velocity.y * dt.deltaTime;

        //if (this.velocity.x > 5) this.velocity.x -= 0.1;
        //else if (this.velocity.x < -5) this.velocity.x += 0.1;
        //if (this.velocity.y > 5) this.velocity.y -= 0.1;
        //else if (this.velocity.y < -5) this.velocity.y += 0.1;

        if (this.body) {
            Matter.Body.setVelocity(this.body, this.velocity);
            this.container.x = this.body.position.x;
            this.container.y = this.body.position.y;
        }

    }

    setVelocityXNeg() {
        if (this.velocity.x > 0) this.velocity.x *= -1;
    }
    setVelocityXPos() {
        if (this.velocity.x < 0) this.velocity.x *= -1;
    }

    setVelocityYPos() {
        if (this.velocity.y < 0) this.velocity.y *= -1;
    }
    setVelocityYNeg() {
        if (this.velocity.y > 0) this.velocity.y *= -1;
    }
    pushX(forceX) {
        forceX = Math.min(Math.max(forceX, -5), 5)
        this.velocity.x *= 2;
        this.velocity.y *= 2;
        this.velocity.x += forceX;
    }
}