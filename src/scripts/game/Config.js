import { Tools } from "../system/Tools";
import { BrickBreaker } from "./brickbreaker/BrickBreaker";
import { GameScene } from "./scenes/GameScene";
import { MainMenu } from "./scenes/MainMenu";
import { SideMenu } from "./scenes/SideMenu";
import { LoadingScene } from "./scenes/LoadingScene";

export const Config = {
    //loader: Tools.massiveRequire(require["context"]('./../../', true, /\.(mp3|png|jpe?g)$/)),
    bgSpeed: 2,
    score: {
        x: 10,
        y: 10,
        anchor: 0,
        style: {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 44,
            fill: ["#FF7F50"]
        }
    },
    diamonds: {
        chance: 0.4,
        offset: {
            min: 100,
            max: 200
        }
    },
    platforms: {
        moveSpeed: -1.5,
        ranges: {
            rows: {
                min: 2,
                max: 6
            },
            cols: {
                min: 3,
                max: 9
            },
            offset: {
                min: 60,
                max: 200
            }
        }
    },
    hero: {
        jumpSpeed: 15,
        maxJumps: 2,
        position: {
            x: 350,
            y: 595
        }
    },
    scenes: {
        "Game": GameScene,
        "Loading": LoadingScene,
        "MainMenu": MainMenu,
        "SideMenu": SideMenu,
        "BrickBreaker": BrickBreaker
    },
    fontNames:
    {
        "Future": "kenvector future",
        "FutureThin": "kenvector future thin",
    }
};