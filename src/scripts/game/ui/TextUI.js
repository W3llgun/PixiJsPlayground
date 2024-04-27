import { Text, TextStyle, Container } from "pixi.js";
import { App } from '../../system/App';
import { FontNames } from '../ui/Style';

export class TextUI {
    constructor(value, style) {
        this.container = new Container();
        if (!this.text) {
            if (!style) {
                style = new TextStyle({
                    fontSize: 36,
                    wordWrapWidth: 100,
                });
            }

            this.text = new Text({ text: value, style });
            this.text.pivot.x = this.text.width / 2;
            this.text.pivot.y = this.text.height / 2;
            this.text.x = this.container.width / 2;
            this.text.y = this.container.height / 2;
            this.container.addChild(this.text);
        }
        else {
            this.text.text = value;
            this.text.pivot.x = this.text.width / 2;
            this.text.pivot.y = this.text.height / 2;
            this.text.x = this.container.width / 2;
            this.text.y = this.container.height / 2;
        }
    }

    setPosition(x, y) {
        this.container.x = x;
        this.container.y = y;
    }

    setText(txt) {
        this.text.text = txt;
    }

    setSize(size) {
        this.text.style.fontSize = size;
    }
}