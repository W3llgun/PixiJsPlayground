import { Scene } from '../../system/Scene';
import { Button } from "../ui/Button";
import { App } from '../../system/App';
import { Graphics, TilingSprite, TextStyle } from 'pixi.js';

export class SideMenu extends Scene {

    async create() {
        this.menuWidth = App.app.screen.width / 3;
        this.menuHeight = App.app.screen.height + 5;
        if (this.menuWidth < 500) this.menuWidth = App.app.screen.width;
        await this.prepareAssetBundle('sidepanel');
        this.createBackground();
        this.createMenuButtons();
        this.createMainButton();
    }

    animationTick(time) {
        if (this.isMoving) {

            if (this.isHidden) {
                this.container.x += 20 * time.deltaTime;
                if (this.container.x > 0) {
                    this.isMoving = false;
                    this.isHidden = false;
                    this.container.x = 0;
                    App.app.ticker.remove(this.animationTick, this);
                }
            } else {
                this.container.x -= 20 * time.deltaTime;
                if (this.container.x < -this.menuWidth) {
                    this.isMoving = false;
                    this.isHidden = true;
                    App.app.ticker.remove(this.animationTick, this);
                    this.container.x -= 20;
                }
            }
        }
    }

    createBackground() {

        this.menuBackground = new TilingSprite(
            {
                texture: this.assets.background,
                width: this.menuWidth,
                height: this.menuHeight,
                tileScale: { x: 0.5, y: 0.5 }
            }
        )

        const customstroke = new Graphics().rect(this.menuWidth - 20, 0, 20, App.app.screen.height).fill({ color: 'black', alpha: 0.2 });
        this.menuBackground.y -= 2;
        this.container.addChild(this.menuBackground, customstroke);
        this.container.x = -this.menuWidth - 20;
    }

    createMainButton() {
        this.mainButton = new Button(45, 45, 50, 50);
        this.mainButton.container.on('pointerdown', this.switchMenuDisplay.bind(this));

        App.scenesManager.frontContainer.addChild(this.mainButton.container);
    }

    createMenuButtons() {
        const btnWidth = this.menuWidth - 100;
        const centerX = (this.menuWidth / 2) - 5;
        const style = new TextStyle({
            fontFamily: App.config.fontNames["Future"],
            fontSize: this.menuWidth / 20,
            //fontStyle: 'italic',
            //fontWeight: 'bold',
            fill: 'white',
            //stroke: { color: '#4a1850', width: 5, join: 'round' },
            //dropShadow: {
            //    color: '#FF0000',
            //    blur: 4,
            //    angle: Math.PI / 6,
            //    distance: 6,
            //},
            wordWrap: true,
            wordWrapWidth: btnWidth,
        });

        this.returnButton = new Button(centerX, 180, btnWidth, 50);
        this.returnButton.container.on('pointerdown', this.returnMenu.bind(this));
        this.returnButton.setText(App.loca.getText("btn_menu"), style);
        this.isMoving = false;
        this.isHidden = true;

        this.container.addChild(this.returnButton.container);
    }



    switchMenuDisplay() {
        if (!this.isMoving) {
            this.isMoving = true;
            App.app.ticker.add(this.animationTick, this);
        }
    }

    returnMenu() {
        App.scenesManager.load("MainMenu");
        this.switchMenuDisplay();
    }

    destroy() {
        App.app.ticker.remove(this.animationTick, this);
        this.container.destroy();

        if (this.mainButton) {
            App.scenesManager.frontContainer.removeChild(this.mainButton.container);
            this.mainButton.destroy();
            this.mainButton = null;
        }
    }
}