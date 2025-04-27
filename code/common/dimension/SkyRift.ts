namespace SkyRift {
    export const entities: Partial<SkyRift.UpdatableEntity>[] = [];
    export const commonMesh = new RenderMesh(modelsdir + "rift.obj", "obj", {
        noRebuild: false,
        invertV: false,
        translate: [0.5, 0, 0.5]
    });
    commonMesh.setNormal(0, 1, 0);
    commonMesh.setColor(0, 0, 0);

    export function createMesh(vertexesCount: number): RenderMesh {
        const mesh = new RenderMesh();//commonMesh.clone();
        //mesh.setColor(0, 0, 0);
        let shift = 0;
        let line = 0;
        for(let i = -vertexesCount/2; i < vertexesCount/2; i++) {
            let distance = MathHelper.randomInt(1, 3);
            mesh.addVertex(i, 0,0, 0, 0); //первая точка с учётом индекса
            mesh.addVertex(shift, 0, 0); //вторая точка, но теперь с учётом смещения
            mesh.addVertex(shift, 0, distance); //завершаем треугольник отдалённой точкой

            mesh.addVertex(i, 0, distance);
            
            shift += MathHelper.randomInt(1, 3);
            line += MathHelper.randomInt(1, 3);
        }
        return mesh;
    }

    export function loadAnimation(player: number, packet: UpdatableEntity): UpdatableEntity {
        if(packet == null) {
            return packet;
        };

        const entity = (entities[packet.index] = entities[packet.index] || {});
        const animation = entity.animation = (entity.animation || new Animation.Base(packet.x + 0.5, packet.y, packet.z + 0.5));
    
        animation.describe({
            mesh: createMesh(packet.vertexes || 8),
            scale: packet.scale || 2
        });

        animation.setIgnoreLightMode();
        animation.setPos(packet.x + 0.5, packet.y, packet.z + 0.5);
        animation.load();
        animation.transform()
        .rotate(0.005, 0, 0)
        //.scale(0.05, 0.05, 0.05);
        return packet;
    }

    export const networkType = new NetworkEntityType("if.skyrift")
    .addClientPacketListener("update", (target, player, packet) => {
        return loadAnimation(player, packet);
    })
    .addClientPacketListener("destroy", (target: UpdatableEntity, player, packet: UpdatableEntity) => {
        const animation = entities[packet.index]?.animation;
        if(animation) {
            animation.destroy();
        }
        return packet;
    })
    .setClientEntityAddedListener((player, data: UpdatableEntity) => {
        return loadAnimation(player, data);
    })
    .setClientListSetupListener((list, target: UpdatableEntity, player) => {
        list.setupDistancePolicy(target.x, target.y, target.z, target.dimension, 64);
    })
    .setClientEntityRemovedListener((target: UpdatableEntity, player) => {
        const animation = entities[target.index]?.animation;
        if(animation) {
            animation.destroy();
        }
        return target;
    });

    export class UpdatableEntity implements Updatable {
        public update: () => void;
        public remove?: boolean; 
        public blockSource: BlockSource;
        public index: number;   
        public snowSpeed: number;
        public snowSpeedMax: number;
        public snowDensity: number;
        public networkEntity: NetworkEntity;
        public scale: number;
        public scaleMax: number = 5;
        public vertexes: number;
        public animation: Animation.Base;

        public constructor(public x: number, public y: number, public z: number, public dimension: number) {
            this.index = SkyRift.entities.length;
            this.scale = 0.1;
            this.vertexes = MathHelper.randomInt(8, 64);
            this.snowSpeed = MathHelper.randomFrom( 0.2, 0.3, 0.4, 0.5);
            this.snowSpeedMax = this.snowSpeed * 2;
            this.snowDensity = MathHelper.randomInt(1, 3);
            this.networkEntity = new NetworkEntity(networkType, this);
            this.blockSource = BlockSource.getDefaultForDimension(dimension);
            this.update = () => this.tick();
            SkyRift.entities.push(this);
        }

        public getDimensionID(): number {
            return EDimension.INFINITE_FOREST.id;
        }

        public getScaleMax(): number {
            return this.scaleMax;
        }

        public getDrop(): ItemStack {
            return new ItemStack(ItemList.BLUE_CRYSTAL.id, 1, 0);
        }

        // public spawnSnow(): void {
        //     const clients = Network.getConnectedClients();
        //     for(const i in clients) {
        //         const client = clients[i]; 
        //         if(client && Entity.getDimension(client.getPlayerUid()) === this.dimension) {
        //             client.send("packet.infinite_forest.rift_snow", this);
        //         }
        //     }
        // }

        public tickValues(): void {
            if(this.scale < this.getScaleMax()) {
                this.scale += 0.05;
            }
            this.y += 0.01;
        }

        // public tickSnow(): void {
        //     if(this.snowSpeed > 0.1 && this.snowSpeed < this.snowSpeedMax) {
        //         if(Math.random() < 0.5) {
        //             this.snowSpeed += 0.005;
        //         } else {
        //             this.snowSpeed -= 0.005;
        //         }
        //     }
        // }

        public getPlayers(): number[] {
            return this.blockSource.listEntitiesInAABB(
                this.x - (5 + this.scale),
                this.y - (5 + this.scale),
                this.z - (5 + this.scale),
                this.x + 5 + this.scale,
                this.y + 5 + this.scale,
                this.z + 5 + this.scale,
                EEntityType.PLAYER,
                false
            );
        }

        public hasTarget(pos: Vector): boolean {
            return Math.floor(pos.x) == Math.ceil(this.x) && Math.floor(pos.z) == Math.ceil(this.z) && pos.y >= this.y;
        }

        public usePlayers(threadTime: number): void {
            const playersUid = this.getPlayers();
            for(const i in playersUid) {
                const playerUid = playersUid[i];
                
                if(Entity.getDimension(playerUid) != this.dimension) {
                    return;
                };

                if(threadTime % 20 === 0) {
                    Effect.get("winter").init(playerUid, 200);
                    Effect.get("fear").init(playerUid, 200);
                    const pos = Entity.getPosition(playerUid);
                    if(this.hasTarget(pos)) {
                        Dimensions.transfer(playerUid, this.getDimensionID());
                    }
                }
            }
            return;
        }

        public tick(): void {
            const threadTime = World.getThreadTime();
            
            // this.spawnSnow(); концепт изменился
            this.usePlayers(threadTime);

            if(threadTime % 20 === 0) {
                //this.tickSnow();
                this.updateToAllClients("update");
                this.tickValues();
            }

            if(this.blockSource.getLightningLevel() > 0 || this.scale >= this.getScaleMax() || this.blockSource.getBlockID(this.x, this.y, this.z) != 0) {
                this.destroy();
            }
        }

        public destroy(): void {
            const drop = this.getDrop();
            alert('destroyed')
            this.blockSource.explode(this.x, this.y, this.z, Math.ceil(this.scale), false);
            this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, drop.id, drop.count, drop.data, drop.extra || null);
            this.updateToAllClients("remove");
            this.networkEntity.remove();
            this.remove = true;
        }

        public updateToAllClients(packetName: string): void {
            const iterator = this.networkEntity.getClients().iterator();
            while(iterator.hasNext()) {
                const client = iterator.next();
                this.networkEntity.send(client, packetName, this);
            }
        }
    }

    export function create(entity: UpdatableEntity): UpdatableEntity;
    export function create(x: number, y: number, z: number, dimension: number): UpdatableEntity;
    export function create(x: number | UpdatableEntity, y?: number, z?: number, dimension?: number): UpdatableEntity {
        let object = x instanceof UpdatableEntity ? x : new UpdatableEntity(x, y, z, dimension);
        Updatable.addUpdatable(object);
        return object;
    }

    // Network.addClientPacket("packet.infinite_forest.rift_snow", (data: UpdatableEntity) => {
    //     for(let i = 0; i < data.snowDensity; i++) {
    //         Particles.addParticle(
    //             EForestParticle.SNOWFALL, 
    //             (data.x - data.scale + MathHelper.randomInt(-data.scale * 0.5, data.scale * 1.5)) + 0.5,
    //             data.y - 0.25,
    //             (data.z - data.scale + MathHelper.randomInt(-data.scale * 0.5, data.scale * 1.5)) + 0.5,
    //             0.01,
    //             -data.snowSpeed,
    //             0.01
    //         );
    //     }
    // });
}