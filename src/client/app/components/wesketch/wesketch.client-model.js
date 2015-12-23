(function() {
'use strict';

    angular
        .module('components.wesketch')
        .factory('wesketchClientModel', wesketchClientModel);

    function wesketchClientModel() {

        var tools = ['brush', 'eraser', 'fill'];
        var colors = [
            '#000000', '#c0c0c0', '#ffffff',
            '#2c4fa5', '#007cc9', '#00acf3',
            '#00a446', '#5bb339', '#95c51f',
            '#f1b700', '#fbdd00', '#fff200',
            '#d9242a', '#de5b1f', '#e58100',
            '#c50c70', '#d9058f', '#e486b9',
            '#6c4b1f', '#a98754', '#c2ac79'
        ];

        var clientModel = {
            ctx: null,
            canvas: null,
            isDrawing: false,
            coords: {
                from: {
                    x: 0,
                    y: 0
                },
                to: {
                    x: 0,
                    y: 0
                }
            },

            player: {
                id: -1,
                email: ''
            },
            drawingPlayer: {},

            state: {},

            chat: {
                input: '',
                messages: [],
                myMessages: [],
                guessMode: false,
            },

            sounds: {},
            soundSettings: {
                muteSfx: false,
                muteMusic: false
            },

            drawSettings: {
                lineWidth: 2,
                lineJoin: 'round', // 'butt', 'round', 'square'
                lineCap: 'round', // 'bevel', 'round', 'miter',

                tools: tools,
                colors: colors,
                currentTool: tools[0],
                strokeStyle: colors[0],
            },

            /**
             * Enables admin features
             */
            isAdmin: false,
        };

        return clientModel;
    }
})();