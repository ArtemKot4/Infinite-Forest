interface IRotatingRenderParams extends Vector {
    skin: string;
    x2?: number;
    z2?: number;
    speed?: number;
    velocitySpeed?: number;
    startHeight?: number;
    readonly render?: Render;
}

class RotatingRenderFX extends RenderObject {
    protected readonly render: Render;
    protected offset: number = 0;
    protected maxHeight: number;
    protected speed: number;
    protected velocitySpeed: number;
    x2?: number;
    y2?: number;
    z2?: number;

    public constructor(description: IRotatingRenderParams) {
        description.y -= 0.2;
        super(description.x, description.y - (description.startHeight || 0) - 0.4, description.z);
        
        this.speed = description.speed || 0.006;
        this.velocitySpeed = description.velocitySpeed || 0.0008;
        this.skin = description.skin;
        this.x2 = description.x2 || description.x;
        this.z2 = description.z2 || description.z;
        this.maxHeight = description.y;
        this.render = description.render || (() => {
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
    }

    public override getSkin(): string {
        return this.skin;
    }

    public override getRender(): Render {
        return this.render;
    }

    public override getStringID(): string {
        return "curse_fx";
    }
    
    public calculatePositions(): void {
        if(this.y < this.maxHeight) {
            this.speed += this.velocitySpeed;
            this.y = Math.min(this.y + this.speed, this.maxHeight);
            this.translateBy(0, -this.speed, 0);
        }
        // if(this.x != this.x2) {
        //     if(this.x < this.x2) {
        //         this.x = Math.min(this.x, this.x + this.speed);
        //         transform.translate(-this.speed, 0, 0);
        //     }
        //     if(this.x > this.x2) {
        //         this.x = Math.max(this.x, this.x - this.speed);
        //         transform.translate(-this.speed, 0, 0);
        //     }
        // }
        // if(this.z != this.z2) {
        //     if(this.z < this.z2) {
        //         this.z = Math.min(this.z, this.z + this.speed);
        //         transform.translate(0, 0, -this.speed);
        //     }
        //     if(this.z > this.z2) {
        //         this.z = Math.max(this.z, this.z - this.speed);
        //         transform.translate(0, 0, -this.speed);
        //     }
        // }
    }

    public override run(): void {
        const playerPos = Entity.getPosition(Player.getLocal());
        const targetAngle = Math.atan2(playerPos.z - this.z, playerPos.x - this.x);
        
        this.offset += (targetAngle - this.offset) * 0.4;
        this.calculatePositions();
        this.render.getPart("board")
        .setRotation(0, this.offset - Math.PI / 2, 0);
    }
}

Callback.addCallback("ItemUse", (c, i) => {
    if(i.id == VanillaItemID.bone) {
        return new RotatingRenderFX({
            x: c.x + 0, 
            y: c.y + 0.85,
            z: c.z + 0.5, 
            x2: c.x + 0.5,
            skin: "sign/fire.png"
        }).start();
    }
});