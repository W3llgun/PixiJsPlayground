import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from '../../system/App';

export class Button {

    constructor(x, y, width, height, buttonTexture) {
        this.container = new PIXI.Container();
        if (!buttonTexture) {
            buttonTexture = App.globalAssets.missing;
        }
        this.makeShape(x, y, width, height, buttonTexture);

        this.container.x = x;
        this.container.y = y;
        this.container.pivot.x = width / 2;
        this.container.pivot.y = height / 2;
        // App.app.ticker.add((time) => {
        //     // Continuously rotate the container!
        //     // * use delta to create frame-independent transform *
        //     this.container.rotation -= 0.01 * time.deltaTime;
        // });
    }

    makeShape(x, y, width, height, buttonTexture) {
        const buttonContext = new PIXI.GraphicsContext()
            .texture(buttonTexture, 0xffffff, 0, 0, width, height);

        this.btnBackground = new PIXI.Graphics(buttonContext);

        //this.sprite = new PIXI.Sprite(App.assets.pixel);
        this.btnShape = new PIXI.Graphics();
        this.btnShape.roundRect(0, 0, width, height)
            //.stroke({ width: 2, color: 0xff00ff })
            .fill('white');

        // Interactions
        this.container.eventMode = 'static';
        this.container.cursor = 'pointer';
        //this.container.on('pointerdown', this.onClick);

        // Add to container and masking
        this.btnBackground.mask = this.btnShape;
        this.container.addChild(this.btnBackground, this.btnShape);
        this.container.on('pointerover', this.hovered.bind(this));
    }

    hovered() {
        this.btnBackground.stroke(50, 'black');
    }

    setText(newText, style) {

        if (!this.text) {
            if (!style) {
                style = new PIXI.TextStyle({
                    fontFamily: App.config.fontNames["Future"],
                    fontSize: 36,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    //fill: { fill },
                    stroke: { color: '#4a1850', width: 5, join: 'round' },
                    dropShadow: {
                        color: '#FF0000',
                        blur: 4,
                        angle: Math.PI / 6,
                        distance: 6,
                    },
                    wordWrap: true,
                    wordWrapWidth: 440,
                });
            }

            this.text = new PIXI.Text({ text: newText, style });
            this.text.pivot.x = this.text.width / 2;
            this.text.pivot.y = this.text.height / 2;
            this.text.x = this.container.width / 2;
            this.text.y = this.container.height / 2;
            this.container.addChild(this.text);
        }
        else {
            this.text.text = newText;
            this.text.pivot.x = this.text.width / 2;
            this.text.pivot.y = this.text.height / 2;
            this.text.x = this.container.width / 2;
            this.text.y = this.container.height / 2;
        }
    }


    destroy() {
        this.container.destroy();
    }

}