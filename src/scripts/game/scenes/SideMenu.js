import { Scene } from '../../system/Scene';
import { Button } from "../ui/Button";
import { App } from '../../system/App';
import { Graphics, TilingSprite, TextStyle, Container } from 'pixi.js';
import { FontNames } from "../ui/Style";

export class SideMenu extends Scene {

    async create() {
        this.panelContainer = new Container();

        this.menuWidth = App.pwidth(32);
        this.menuHeight = App.width() + 5;
        if (this.menuWidth < 300) this.menuWidth = App.width();

        await this.prepareAssetBundle('sidepanel');
        this.createBackground();
        this.createMenuButtons();
        this.container.addChild(this.panelContainer);

        this.createMainButton();
    }

    animationTick(time) {
        if (this.isMoving) {

            if (this.isHidden) {
                this.panelContainer.x += 20 * time.deltaTime;
                if (this.panelContainer.x > 0) {
                    this.isMoving = false;
                    this.isHidden = false;
                    this.panelContainer.x = 0;
                    App.app.ticker.remove(this.animationTick, this);
                }
            } else {
                this.panelContainer.x -= 20 * time.deltaTime;
                if (this.panelContainer.x < -this.menuWidth) {
                    this.isMoving = false;
                    this.isHidden = true;
                    App.app.ticker.remove(this.animationTick, this);
                    this.panelContainer.x -= 20;
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

        const customstroke = new Graphics().rect(this.menuWidth - 20, 0, 20, this.menuHeight).fill({ color: 'black', alpha: 0.2 });
        this.menuBackground.y -= 2;
        this.panelContainer.addChild(this.menuBackground, customstroke);
        this.panelContainer.x = -this.menuWidth - 20;
    }

    createMainButton() {
        this.mainButton = new Button(40, 40, 50, 50);
        this.mainButton.container.on('pointerdown', this.switchMenuDisplay.bind(this));

        this.container.addChild(this.mainButton.container);
    }

    createMenuButtons() {
        const btnWidth = this.menuWidth - 100;
        const centerX = (this.menuWidth / 2) - 5;
        const style = new TextStyle({
            fontFamily: FontNames["Future"],
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

        this.panelContainer.addChild(this.returnButton.container);
    }

    switchMenuDisplay() {
        if (!this.isMoving) {
            this.isMoving = true;
            App.app.ticker.add(this.animationTick, this);
        }
    }

    hideMenuDisplay() {
        if (this.isMoving && this.isHidden)  // mean it is move to displaying
        {
            this.isHidden = false; // will move to hide
        } else if (!this.isHidden) {
            this.panelContainer.x = this.menuWidth - 20;
        }
    }

    returnMenu() {
        App.scenesManager.load("MainMenu");
        this.switchMenuDisplay();
    }

    destroy() {
        App.app.ticker.remove(this.animationTick, this);
        this.panelContainer.destroy();
        this.container.destroy();

        if (this.mainButton) {
            //App.scenesManager.frontContainer.removeChild(this.mainButton.container);
            this.mainButton.destroy();
            this.mainButton = null;
        }
    }
}