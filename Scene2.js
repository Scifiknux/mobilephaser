class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.background = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,"background");
        this.background.scale = 8;
        this.background.setOrigin(0,0);

        this.ship1 = this.add.sprite(this.game.config.width/2 - 50, this.game.config.height/2, "ship");
        this.ship2 = this.add.sprite(this.game.config.width/2, this.game.config.height/2, "ship2");
        this.ship3 = this.add.sprite(this.game.config.width/2 + 50, this.game.config.height/2, "ship3");

        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship"),
            frameRate: 20,
            repeat: -1
        });

        this.add.text(20,20, "Playing game", {
            font: "25px Arial",
            fill: "black"
        });
    }

    moveShip(ship, speed){
        ship.y += speed;
        if (ship.y > this.game.config.height) {
            this.resetShipPos(ship);
        }
    }

    resetShipPos(ship){
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, this.game.config.width);
        ship.x = randomX;
    }

    update () {
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);
        this.background.tilePositionY -= 0.2;
    }
}