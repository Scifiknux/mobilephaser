class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.background = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,"background");
        this.background.scale = 8;
        this.background.setOrigin(0,0);
        this.backgroundClouds = this.add.tileSprite(0,0,this.game.config.width,this.game.config.height,"backgroundClouds");
        this.backgroundClouds.scale = 8;
        this.backgroundClouds.setOrigin(0,0);
        this.backgroundClouds.blendMode = Phaser.BlendModes.SCREEN;

        this.ship1 = this.add.sprite(this.game.config.width/2 - 50, this.game.config.height/2, "ship");
        this.ship2 = this.add.sprite(this.game.config.width/2, this.game.config.height/2, "ship2");
        this.ship3 = this.add.sprite(this.game.config.width/2 + 50, this.game.config.height/2, "ship3");

        this.enemies = this.physics.add.group();
        this.enemies.add(this.ship1);
        this.enemies.add(this.ship2);
        this.enemies.add(this.ship3);

        this.ship1.setScale(3);
        this.ship2.setScale(3);
        this.ship3.setScale(3);

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");

        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.input.on('gameobjectdown', this.destroyShip, this);

        var graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(0,0);
        graphics.lineTo(this.game.config.width, 0);
        graphics.lineTo(this.game.config.width, 20);
        graphics.lineTo(0, 20);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();

        this.score = 0;

        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);

        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 0,
                end: 1
            }),
            framerate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "gray",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 2,
                end: 3
            }),
            framerate: 20,
            repeat: -1
        });
        this.powerUps = this.physics.add.group();

        var maxObjects = 4;
        for (var i = 0; i <= maxObjects; i++) {
            var powerUp = this.physics.add.sprite(16,16, "power-up");
            this.powerUps.add(powerUp)
            powerUp.setRandomPosition(0,0, this.game.config.width, this.game.config.height);

            if (Math.random() > 0.5) {
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }

            powerUp.setVelocity(100,100);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(true)
        }

        this.player = this.physics.add.sprite(this.game.config.width / 2 - 8, this.game.config.height - 64, "player");
        this.player.play("thrust");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = this.add.group();

        this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp){
            projectile.destroy();
        });        

        //first two parameters are the two colliding objects, the third is the callback function, and the last two are the scope
        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

    }

    zeroPad(number, size){
        var stringNumber = String(number);
        while(stringNumber.length < (size || 1)) {
            console.log("Stringnumber: " + stringNumber);
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }

    hitEnemy(projectile, enemy){
        projectile.destroy();
        this.resetShipPos(enemy);
        this.score += 1;
        var scoreFormatted = this.zeroPad(this.score, 6);
        this.scoreLabel.text = "SCORE " + scoreFormatted;
    }

    hurtPlayer(player, enemy){
        this.resetShipPos(enemy);
        player.x = this.game.config.width / 2 - 8;
        player.y = this.game.config.height - 64;
        this.score -= 30;
        var scoreFormatted = this.zeroPad(this.score, 6);
        this.scoreLabel.text = "SCORE " + scoreFormatted;
    }

    pickPowerUp(player, powerUp){
        powerUp.disableBody(true, true);
        if (score <= 1){
            score = 0;
        }
        else {
            score = score * 2;
        }
    };

    moveShip(ship, speed){
        ship.y += speed;
        if (ship.y > this.game.config.height) {
            this.resetShipPos(ship);
            this.score -= 3;
            var scoreFormatted = this.zeroPad(this.score, 6);
            this.scoreLabel.text = "SCORE " + scoreFormatted;
        }
    }

    resetShipPos(ship){
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, this.game.config.width);
        var speed = Phaser.Math.Between(3,10);
        var scale = Phaser.Math.Between(2,8);
        this.moveShip(ship, speed);
        ship.setScale(scale);
        ship.x = randomX;
    }

    destroyShip(pointer, gameObject){
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }

    update () {
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);
        this.background.tilePositionY -= 0.2;
        this.backgroundClouds.tilePositionY -=.3;
        this.movePlayerManager();

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shootBeam();
        }
        
        this.projectiles.children.each(function(projectile){
            projectile.update();
        });

        //console.log("Number of beams: " + this.projectiles.countActive());
        //console.log("Score: " + this.score);

    }

    shootBeam() {
        var beam = new Beam(this);
        //var beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
    }

    movePlayerManager() {
        //console.log(this.game.config.playerSpeed)
        if(this.cursorKeys.left.isDown){
            this.player.setVelocityX(-this.game.config.playerSpeed);
        } else if (this.cursorKeys.right.isDown){
            this.player.setVelocityX(this.game.config.playerSpeed);
        } else {this.player.setVelocityX(0)} 
        
        if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-this.game.config.playerSpeed);
        } else if (this.cursorKeys.down.isDown) {
            this.player.setVelocityY(this.game.config.playerSpeed);
        } else {
            this.player.setVelocityY(0);
        }
    }

    cameraUpdate() {
        app.update()
        const camera = this.cameras.main
        camera.setZoom(app.zoom)
        camera.centerOn(app.centerX, app.centerY)
    }

    resize() {
        this.cameraUpdate()
        // all sprite update
        for (let index = 0; index < this.imageList.length; index++) {
            this.imageList[index].update()
        }
    }
}