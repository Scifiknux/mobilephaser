class Beam extends Phaser.GameObjects.Sprite{
    constructor(scene){

        var x = scene.player.x;
        var y = scene.player.y - 16;

        super(scene, x, y, "beam");

        scene.add.existing(this);

        this.play("beam_anim");
        this.setScale(.25);
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -250;
        scene.projectiles.add(this);

    }

    update() {
        //console.log("Beam has been updated. Y = " + this.y);
        if (this.y < -16){
            this.destroy();
        }
    }
}