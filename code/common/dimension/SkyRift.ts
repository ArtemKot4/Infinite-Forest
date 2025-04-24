namespace SkyRift {
    export const entities: Partial<SkyRift.UpdatableEntity>[] = [];

    function loadAnimation(player: number, packet: UpdatableEntity): UpdatableEntity {
        if(packet == null) {
            return packet;
        };

        const entity = entities[packet.index] ??= {};
        entity.animation = entity.animation || new Animation.Base(packet.x + 0.5, packet.y, packet.z + 0.5);
    
        entity.animation.describe({
            mesh: UpdatableEntity.mesh,
            scale: packet.scale || 2
        });

        entity.animation.setIgnoreLightMode();
        entity.animation.setPos(packet.x + 0.5, packet.y, packet.z + 0.5);
        entity.animation.load();
        entity.animation.transform().lock().rotate(0.0005, 0, 0).unlock();
        return packet;
    }

    const networkEntityType = new NetworkEntityType("skyrift");
    networkEntityType.addClientPacketListener("update", (target, player, data) => {
        return loadAnimation(player, data);
    });

    networkEntityType.setClientEntityAddedListener((player, data: UpdatableEntity) => {
        return loadAnimation(player, data);
    });

    networkEntityType.setClientListSetupListener((list, target: UpdatableEntity, entity) => {
        list.setupDistancePolicy(target.x, target.y, target.z, target.dimension, 64);
    });

    networkEntityType.setClientEntityRemovedListener((target: UpdatableEntity, player) => {
        target && target.animation && target.animation.destroy();
    });

    export class UpdatableEntity implements Updatable {
        public static mesh: RenderMesh = (() => {
            const mesh = new RenderMesh();
            mesh.setColor(0, 0, 0);
            mesh.importFromFile(modelsdir + "rift.obj", "obj", {
                invertV: false,
                noRebuild: false,
                translate: [0.5, 0, 0.5]
            });
            return mesh;
        })();

        public update: () => void;
        public remove?: boolean; 
        public blockSource: BlockSource;
        public index: number;   
        public snowSpeed: number;
        public snowSpeedMax: number;
        public snowDensity: number;
        public networkEntity: NetworkEntity;
        public scale: number;
        public animation: Animation.Base;

        public constructor(public dimension: number, public x: number, public y: number, public z: number) {
            this.index = SkyRift.entities.length;
            this.scale = MathHelper.randomFrom(0.2, 0.3, 0.4, 0.5, 0.6, 0.7, MathHelper.randomInt(1, 2));
            this.snowSpeed = MathHelper.randomFrom( 0.2, 0.3, 0.4, 0.5);
            this.snowSpeedMax = this.snowSpeed * 2;
            this.snowDensity = MathHelper.randomInt(1, 3);
            this.networkEntity = new NetworkEntity(networkEntityType, this);
            this.blockSource = BlockSource.getDefaultForDimension(this.dimension);
            this.update = () => this.tick();
            this.updateToAllClients();
            SkyRift.entities.push(this);
        }

        public getScaleMax(): number {
            return 10;
        }

        public spawnSnow(): void {
            const clients = Network.getConnectedClients();
            for(const i in clients) {
                const client = clients[i]; 
                if(client && Entity.getDimension(client.getPlayerUid()) === this.dimension) {
                    client.send("packet.infinite_forest.rift_snow", this);
                }
            }
        }

        public tickValues(): void {
            if(this.scale < this.getScaleMax()) {
                this.scale += 0.01;
            }
            this.y += 0.01;
        }

        public tickSnow(): void {
            if(this.snowSpeed > 0.1 && this.snowSpeed < this.snowSpeedMax) {
                if(Math.random() < 0.5) {
                    this.snowSpeed += 0.005;
                } else {
                    this.snowSpeed -= 0.005;
                }
            }
        }

        public getPlayers(): number[] {
            return this.blockSource.listEntitiesInAABB(
                this.x - this.scale,
                this.y - 5 - this.scale,
                this.z - this.scale,
                this.x + this.scale,
                this.y + this.scale,
                this.z + this.scale,
                EEntityType.PLAYER,
                false
            );
        }

        public usePlayers(threadTime: number): void {
            const playersUid = this.getPlayers();
            for(const i in playersUid) {
                const playerUid = playersUid[i];
                
                if(Entity.getDimension(playerUid) !== this.dimension) return;
                if(threadTime % 20 === 0) {
                    EffectList.WINTER.init(playerUid, 200);
                    if(Entity.getPosition(playerUid).y >= this.y) {
                        Dimensions.transfer(playerUid, EDimension.INFINITE_FOREST.id);
                    }
                }
            }
            return;
        }

        public tick(): void {
            const threadTime = World.getThreadTime();
            
            this.spawnSnow();
            this.usePlayers(threadTime);

            if(threadTime % 20 === 0) {
                this.tickSnow();
                this.updateToAllClients();
                this.tickValues();
            }

            if(!this.blockSource.canSeeSky(this.x, this.y, this.z) || this.blockSource.getLightningLevel() > 0 || this.scale >= this.getScaleMax()) {
                this.destroy();
            }
        }

        public destroy(): void {
            this.blockSource.explode(this.x, this.y, this.z, this.scale, false);
            this.networkEntity.remove();
            this.remove = true;
        }

        public updateToAllClients(): void {
            const iterator = this.networkEntity.getClients().iterator();
            while(iterator.hasNext()) {
                const client = iterator.next();
                this.networkEntity.send(client, "update", this);
            }
        }
    }

    Network.addClientPacket("packet.infinite_forest.rift_snow", (data: UpdatableEntity) => {
        for(let i = 0; i < data.snowDensity; i++) {
            Particles.addParticle(
                EForestParticle.SNOWFALL, 
                (data.x - data.scale + MathHelper.randomInt(-data.scale * 0.5, data.scale * 1.5)) + 0.5,
                data.y - 0.25,
                (data.z - data.scale + MathHelper.randomInt(-data.scale * 0.5, data.scale * 1.5)) + 0.5,
                0.01,
                -data.snowSpeed,
                0.01
            );
        }
    });
}