window.onload = function() {
    var config = {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x507D2A,
        scene: [Scene1, Scene2],
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        }
    }
    var game = new Phaser.Game(config);
}