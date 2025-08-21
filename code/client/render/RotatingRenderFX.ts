class RotatingRenderFX {
    protected render: Render;
    protected animation: Animation.Base;
    protected thread!: java.lang.Thread;
    protected inited: boolean = false;
    protected offset: number = 0;
    protected maxY: number;

    public constructor(public x: number, public y: number, public z: number, public skin: string, render?: Render) {
        this.y -= 0.2;
        this.maxY = this.y;
        this.y -= 0.4;

        this.render = render || (() => {
            const render = new Render();
            render.getPart("head").addPart("board");
            render.setPart("board", [{
                coords: { x: 0, y: 0, z: 0 }, size: { x: 5, y: 5, z: 0.1 }, uv: { x: 0, y: 1 }
            }], {
                width: 5,
                height: 5
            });
            return render;
        })();
        this.animation = new Animation.Base(this.x, this.y, this.z);
        this.animation.setIgnoreLightMode();
    }

    public load(): void {
        if(this.animation) {
            this.animation.destroy();
        }
        this.setSkin(this.skin);
        this.animation.load();
        return;
    }

    public setSkin(skin: string): void {
        this.animation.describe({
            render: this.render.getId(),
            skin: skin
        });
        this.animation.refresh();
    }

    public start(): void {
        if(this.inited == true) {
            return;
        }
        this.inited = true;
        this.load();
        this.thread = Threading.initThread("thread.infinite_forest.curse_fx", () => {
            const transform = this.animation.transform();
            let speed = 0.005;
            //let rotateSpeed = 0.3;

            while(this.inited == true) {
                java.lang.Thread.sleep(20);
                const playerPos = Entity.getPosition(Player.getLocal());
                const targetAngle = Math.atan2(playerPos.z - this.z, playerPos.x - this.x);
                this.offset += (targetAngle - this.offset) * 0.4;

                if(this.y < this.maxY) {
                    speed += 0.0006;
                    this.y = Math.min(this.y + speed, this.maxY);
                    
                    transform.translate(0, -speed, 0);
                }
                // if(rotateSpeed > 0) {
                //     rotateSpeed = Math.max(0, rotateSpeed - 0.001); 
                //     transform.rotate(0, rotateSpeed, 0);
                //     if(rotateSpeed <= 0) {
                //         Particles.addParticle(EForestParticle.SPARK, this.x, this.y, this.z, 0, 0,  0, 0);
                //     }
                // }
                // else {
                    this.render.getPart("board")
                    .setRotation(0, this.offset - Math.PI / 2, 0);
                //}   
            }
        });
    }

    public destroy(): void {
        this.inited = false;
        this.animation.destroy();
    }
}

Callback.addCallback("ItemUse", (c, i) => {
    if(i.id == VanillaItemID.bone) {
        return new RotatingRenderFX(c.x + 0.5, c.y + 0.85, c.z + 0.5, "gui/sign/fire.png").start();
    }
});