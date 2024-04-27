import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from '../../system/App';

export class BBPlayerbar {
    velocityX = 25;
    constructor(x, y, width, height) {
        this.container = new PIXI.Container();
        this.createGraph(width, height);
        this.createBody(x, y, width, height)
        this.speed = 5;
        this.width = width;
        this.halfWidth = width / 2;
        this.container.x = x;
        this.container.y = y;
        this.container.width = width;
        this.container.height = height;
        this.container.pivot.x = this.halfWidth;
        this.container.pivot.y = height / 2;
    }

    createGraph(width, height) {
        var graph = new PIXI.Graphics().rect(0, 0, width, height).fill("red");
        this.container.addChild(graph);
    }

    createBody(x, y, width, height) {
        //this.body = Matter.Bodies.rectangle(this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y, this.sprite.width, this.sprite.height, { friction: 0, isStatic: true, render: { fillStyle: '#060a19' } });
        this.body = Matter.Bodies.rectangle(x, y, width, height, { friction: 0, isStatic: false, render: { fillStyle: '#060a19' } });
        this.body.isSensor = false;
        this.body.player = this;

        this.bodyLeft = Matter.Bodies.circle(0, 0, (height / 2) - 1, { friction: 0, isStatic: false, render: { fillStyle: '#060a19' } });
        this.bodyRight = Matter.Bodies.circle(0, 0, (height / 2) - 1, { friction: 0, isStatic: false, render: { fillStyle: '#060a19' } });
        this.bodyLeft.isSensor = true;
        this.bodyRight.isSensor = true;
        this.bodyLeft.isBumper = true;
        this.bodyRight.isBumper = true;
        Matter.World.add(App.physics.world, this.body);
        Matter.World.add(App.physics.world, this.bodyLeft);
        Matter.World.add(App.physics.world, this.bodyRight);
    }

    move(mousePos) {
        this.targetX = mousePos.x;

        if (this.body) {
            if (this.body.position.x > this.targetX + 5) {
                // Ensure to not go offscreen
                if (this.body.position.x < this.halfWidth) {
                    this.direction = 0;
                } else {
                    this.direction = -1;
                }
            }
            else if (this.body.position.x < this.targetX - 5) {
                // Ensure to not go offscreen
                if (this.body.position.x > App.width() - this.halfWidth) {
                    this.direction = 0;
                } else {
                    this.direction = 1;
                }
            } else {
                this.direction = 0;
            }

            Matter.Body.setVelocity(this.body, { x: this.direction * this.speed, y: 0 });
            Matter.Body.setPosition(this.bodyRight, { x: this.body.position.x + this.width / 2, y: this.body.position.y });
            Matter.Body.setPosition(this.bodyLeft, { x: this.body.position.x - this.width / 2, y: this.body.position.y });
            this.container.x = this.body.position.x;
        }
    }

    destroy() {
        Matter.World.remove(App.physics.world, this.body);
        Matter.World.remove(App.physics.world, this.bodyLeft);
        Matter.World.remove(App.physics.world, this.bodyRight);
        this.container.destroy();
        this.container = null;
    }
}