import { TextStyle } from 'pixi.js';

export const FontNames =
{
    "Future": "kenvector future",
    "FutureThin": "kenvector future thin",
};
export const AppTextStyle = {
    smallWhite: new TextStyle({
        fontFamily: FontNames["Future"],
        fontSize: 20,
        fill: { color: "#FFFFFF" },
        stroke: { color: '#050c14', width: 5, join: 'round' },
        wordWrap: true,
        wordWrapWidth: 440,
    }),
    bottomText: new TextStyle({
        fontFamily: "Arial",
        fontSize: 18,
        fill: { color: "#FFFFFF" },
        wordWrap: true,
        wordWrapWidth: 999,
        letterSpacing: 2,
        align: 'center',
    }),
    ultraAdvanced: new TextStyle({
        fontFamily: FontNames["Future"],
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: { color: 'white' },
        stroke: { color: '#4a1850', width: 5, join: 'round' },
        dropShadow: {
            color: '#FF0000',
            blur: 4,
            angle: Math.PI / 6,
            distance: 6,
        },
        wordWrap: true,
        wordWrapWidth: 440,
    }),
    mainTitle: new TextStyle({
        fontFamily: FontNames["Future"],
        fontSize: 55,
        fontWeight: 'bold',
        fill: { color: '#7342f0' },
        stroke: { color: '#bdef1a', width: 8, join: 'round' },
        letterSpacing: 12,
        dropShadow: {
            color: '#0a1d33',
            blur: 4,
            angle: Math.PI / 6,
            distance: 6,
        },
        wordWrap: true,
        wordWrapWidth: 1200,
    }),
};


export const ButtonStyle = {
    texture: undefined,
    normalColor: 'white',
    hoverColor: 'blue',
    textStyle: AppTextStyle.smallWhite,



}