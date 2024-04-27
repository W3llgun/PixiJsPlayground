import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ScenesManager } from "./ScenesManager";
import { Localisation } from "./Localisation";

/*
    Contain page scaling code from https://coderevue.net/posts/scale-to-fit-screen-pixijs/
*/


class Application {

    async run(config) {

        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);
        this.config = config;
        this.app = new PIXI.Application();

        // Adjust the resolution for retina screens; along with
        // the autoDensity this transparently handles high resolutions
        //PIXI.settin= window.devicePixelRatio || 1;

        await this.app.init({
            background: '#1099bb',
            antialias: true,
            resizeTo: window,
            hello: true,
            autoDensity: true
        });
        document.body.appendChild(this.app.canvas);

        await PIXI.Assets.init({ manifest: "./assets/manifest.json" });


        this.fonts = await PIXI.Assets.loadBundle('fonts');
        this.globalAssets = await PIXI.Assets.loadBundle('global');


        //this.loader = new Loader(PIXI.Assets,this.config);
        //this.loader.preload().then(() => this.start());

        //const texture = await PIXI.Assets.load('/sprites/bg.png');
        //console.log(texture);
        this.scenesManager = new ScenesManager();
        this.scenesManager.startLoading();

        this.app.stage.interactive = true;
        this.app.stage.addChild(this.scenesManager.container);

        this.loca = new Localisation();
        await this.loca.loadFrench();


        // [06]
        this.createPhysics();

        await this.scenesManager.load("MainMenu");

        App.app.stage.addEventListener('pointermove', (e) => {
            this.mousePosition = e.global;
        });
    }

    createPhysics() {

        this.physics = Matter.Engine.create();
        this.physics.gravity.x = 0;
        this.physics.gravity.y = 0;
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, this.physics);


        if (this.debugRenderMatter) {
            this.showPhysicsDebugRenderer();
        }

        document.body.onclick = function (e) {
            e = e || window.event;

            if (!e.shiftKey) return;
            if (App.debugRenderMatter) App.removePhysicsDebugRenderer();
            else App.showPhysicsDebugRenderer();
        }
    }

    removePhysicsDebugRenderer() {
        this.debugRenderMatter = false;
        Matter.Render.stop(this.render);
        this.render.canvas.remove();
        this.render.canvas = null;
        this.render.context = null;
        this.render.engine = null;
        this.render.textures = {};
        this.render = null;
    }

    showPhysicsDebugRenderer() {
        this.debugRenderMatter = true;
        this.render = Matter.Render.create({
            element: document.body,
            canvas: document.getElementById('canvas'),
            engine: undefined,
            options: {
                showDebug: true,
                width: innerWidth,
                height: innerHeight,
                showAngleIndicator: false,
                wireframes: true
            }
        });
        this.render.engine = this.physics;

        Matter.Render.run(this.render);
    }

    screen() { return this.app.screen };

    width() {
        return this.app.screen.width;
    }
    height() {
        return this.app.screen.height;
    }

    // percentage of width
    pwidth(p) {
        return this.width() * (p / 100);
    }
    // percentage of height
    pheight(p) {
        return this.height() * (p / 100);
    }
}

export const App = new Application();
