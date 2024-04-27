import { Graphics, Texture, Container, Text } from "pixi.js";
import { App } from '../../system/App';
import { FontNames, AppTextStyle, ButtonStyle } from '../ui/Style';
export class Button {

    constructor(x, y, width, height, style) {
        this.container = new Container();
        if (!style) {
            style = ButtonStyle;
        }
        this.style = style;
        this.makeShapeNew(x, y, width, height);

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

    makeShapeNew(x, y, width, height, buttonTexture) {
        this.height = height;

        this.btnBackground = new Graphics().rect(0, 0, width, height,).fill(this.style.normalColor);
        this.hoverTexture = new Graphics().rect(0, 0, width, height).fill(this.style.hoverColor);

        this.btnShape = new Graphics().roundRect(0, 0, width, height).fill('#ffffff');

        // Interactions
        this.container.eventMode = 'static';
        this.container.cursor = 'pointer';

        // Add to container and masking
        this.btnBackground.mask = this.btnShape;
        this.hoverTexture.mask = this.btnShape;

        this.hoverTexture.height = 0;

        this.container.addChild(this.btnBackground, this.hoverTexture, this.btnShape);
        this.container.on('pointerover', this.hovered.bind(this));
        this.container.on('pointerout', this.exited.bind(this));
    }

    makeShape(x, y, width, height, buttonTexture) {
        this.height = height;
        this.btnBackground = new PIXI.Graphics()
            .texture(PIXI.Texture.WHITE, 0xffffff, 0, 0, width, height);
        this.btnBackground.tint = 0xFF0000;

        this.hoverTexture = new PIXI.Graphics()
            .texture(PIXI.Texture.WHITE, 0xffffff, 0, 0, width, height);

        this.btnShape = new Graphics();
        this.btnShape.roundRect(0, 0, width, height)
            .fill('white');

        // Interactions
        this.container.eventMode = 'static';
        this.container.cursor = 'pointer';

        // Add to container and masking
        this.btnBackground.mask = this.btnShape;
        this.hoverTexture.mask = this.btnShape;

        this.hoverTexture.height = 0;

        this.container.addChild(this.btnBackground, this.hoverTexture, this.btnShape);
        this.container.on('pointerover', this.hovered.bind(this));
        this.container.on('pointerout', this.exited.bind(this));
    }

    hovered() {
        //this.btnBackground.tint = "#FF0000";
        if (this.text) {
            this.text.tint = "#05FF05";
            this.tick = 0;
            this.textPosY = this.text.position.y;

        }
        App.app.ticker.add(this.hoverTick, this);
        App.app.ticker.remove(this.unhoverTick, this);
    }

    exited() {
        this.btnBackground.tint = "#FFFFFF";
        App.app.ticker.add(this.unhoverTick, this);
        if (this.text) {
            this.text.tint = "#FFFFFF";
            App.app.ticker.remove(this.hoverTick, this);
            this.text.rotation = 0;
        }
    }


    hoverTick(dt) {
        this.tick += dt.deltaTime;
        if (this.text) this.text.rotation = Math.sin(this.tick / 10) / 25;
        if (this.hoverTexture.height < this.height) {
            this.hoverTexture.height += 15 * dt.deltaTime;
        }
    }

    unhoverTick(dt) {
        if (this.hoverTexture.height > 1) {
            this.hoverTexture.height -= 15 * dt.deltaTime;
        }
        else {
            this.hoverTexture.height = 0;
            App.app.ticker.remove(this.unhoverTick, this);
        }
    }

    setText(newText) {

        if (!this.text) {
            let style;
            if (!this.style.textStyle) {
                style = AppTextStyle.smallWhite;
            }
            else style = this.style.textStyle;

            this.text = new Text({ text: newText, style });
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