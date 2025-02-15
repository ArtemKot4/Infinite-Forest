

namespace EForestParticle {
    export const glowwormColors = [
        [255, 255, 0], //yellow
        [185, 210, 255], //light blue
        [255, 165, 0], //golden  <- yellow  & [255, 185, 0]
        [0, 255, 70], //green
        [255, 0, 0], //red
        [0, 109, 56], //dark_green
    ].map((v) =>
        Particles.registerParticleType({
            texture: "part_color",
            render: 2,
            color: v.map((v) => v / 256).concat(1) as [number, number, number, number],
            size: [1, 3],
            lifetime: [40, 100],
            animators: {
                alpha: { fadeIn: 0.4, fadeOut: 0.4 },
                size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 }
            }
        })
    );

    export const GLOWWORM_1 = glowwormColors[0];
    export const GLOWWORM_2 = glowwormColors[1];
    export const GLOWWORM_3 = glowwormColors[2];
    export const GLOWWORM_4 = glowwormColors[3];
    export const GLOWWORM_5 = glowwormColors[4];

    export const CLOUD = Particles.registerParticleType({
        texture: "flame",
        render: 2,
        color: [125 / 256, 125 / 256, 125 / 256, 1],
        size: [6, 9],
        lifetime: [30, 40],
    
        animators: {
            alpha: { fadeIn: 0.4, fadeOut: 0.4 },
            size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 }
        }
    });
    
    export const STAR = Particles.registerParticleType({
        texture: "flame",
        render: 0,
        size: [8, 9],
        lifetime: [80, 100],
    
        animators: {
            //  alpha: { fadeIn: 0.4, fadeOut: 0.4 },
            size: { fadeOut: 0, fadeIn: 0, start: 1, end: 0 },
        },
    });

    export const SMOKE = Particles.registerParticleType({
        texture: "smoke",
        render: 1,
        size: [0.5, 1],
        lifetime: [80, 100],
    
        animators: {
            //  alpha: { fadeIn: 0.4, fadeOut: 0.4 },
            size: { fadeOut: 0, fadeIn: 0, start: 1, end: 0 },
        },
    });

    export const GREEN_RAIN = Particles.registerParticleType({
        texture: "weather",
        render: 2,
        size: [3, 4],
        lifetime: [80, 100],
    
        animators: {
            size: { fadeOut: 0, fadeIn: 0, start: 1, end: 0 },
        },
    });

    export const CAULDRON_BUBBLE = Particles.registerParticleType({
        texture: "bubble_cauldron",
        render: 2,
        size: [0.7, 1.2],
        lifetime: [5, 10],
    
        animators: {
            size: { fadeOut: 0, fadeIn: 0, start: 0.6, end: 0 },
        },
    });

    export const CAULDRON_SMOKE = null;

    export const ELECTRIC = Particles.registerParticleType({
        texture: "electric",
        render: 0,
        size: [0.1, 0.2],
        lifetime: [5, 10],
    
        animators: {
            size: { fadeOut: 0, fadeIn: 0, start: 0.6, end: 0 }
        }
    });

    export const POISON = Particles.registerParticleType({
        texture: "poison",
        render: 0,
        size: [0.1, 0.2],
        lifetime: [5, 10],
    
        animators: {
            size: { fadeOut: 0, fadeIn: 0, start: 0.6, end: 0 }
        }
    });

    export const SNOWFALL = Particles.registerParticleType({
        texture: "snowfall",
        render: 1,
        size: [0.5, 1],
        lifetime: [120, 180],
    
        animators: {
            alpha: {
                start: 0.5,
                fadeIn: 1,
                fadeOut: 0.5,
                end: 0.1,
            },
            size: { fadeOut: 0, fadeIn: 0, start: 0.6, end: 0 }
        }
    });

    export const INSIGHT_VIEW = Particles.registerParticleType({
        texture: "insight_view",
        render: 2,
        size: [0.15, 0.2],
        lifetime: [5, 10],
    
        animators: {
            size: { fadeOut: 0, fadeIn: 0, start: 0.6, end: 0 }
        }
    });
};

interface IParticleSender {
    type: number,
    x: number,
    y: number,
    z: number,
    vx: number,
    vy: number,
    vz: number
};

namespace ParticleHelper {
    export function getSign(n: number) {
        if(n > 0) return 1;
        if(n == 0) return 0;
        if(n < 0) return -1;
    };

    export function random(min: number, max: number) {
        const random = Math.random();
        const dot = getSign(Math.random() * 2 - 1);
    
        return Math.floor(random * (max - min) * dot + min * dot);
    };

    export function getMinDistance(min, max) {
        const x = random(0, max);
        const z = random(0, max);
    
        if(x * x + z * z > min * min) {
            return { x: x, z: z };
        } else {
            return getMinDistance(min, max);
        };
    };

    export function sendWithRadius(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, region: BlockSource, particle: IParticleSender) {
        const playerList = region.listEntitiesInAABB(x1, y1, z1, x2, y2, z2, EEntityType.PLAYER, false);

        for(const player of playerList) {
            if(Entity.getType(player) !== Native.EntityType.PLAYER) continue;

            const client = Network.getClientForPlayer(player);
            
            if(client) {
                client.send("packet.infinite_forest.send_particle", particle)
            };
        };
    };

    export function send(type: typeof EForestParticle | EParticleType, x: number, y: number, z: number, vx: number, vy: number, vz: number, player: number) {
        const client = Network.getClientForPlayer(player);
        
        if(client) {
            client.send("packet.infinite_forest.send_particle", {
                type: type,
                x: x,
                y: y,
                z: z,
                vx: vx,
                vy: vy,
                vz: vz
            });
        };
    };

    export function spawnFire(coords: Vector): void {
        const xz = ParticleHelper.getMinDistance(3, 10);
        const x = xz.x;
        const y = ParticleHelper.random(0, 1);
        const z = xz.z;
    
        return Particles.addParticle(
            EParticleType.FLAME,
            coords.x + x,
            coords.y + y,
            coords.z + z,
            0.03,
            0.03,
            0
        );
    };

    export function spawnGlowworm(coords: Vector, color: number) {
        let xz = ParticleHelper.getMinDistance(30, 80);
        const x = xz.x;
        const y = ParticleHelper.random(0, 1);
        const z = xz.z;
        
        xz = ParticleHelper.getMinDistance(3, 5);
        const xV = xz.x / 80;
        const yV = ParticleHelper.random(3, 5) / 600;
        const zV = xz.z / 80;
    
        return Particles.addParticle(
            color,
            coords.x + x,
            coords.y + y,
            coords.z + z,
            xV,
            yV,
            zV
        );
    };

    export function spawnElectric(x: number, y: number, z: number) {
        for(let i = 0; i <= 5; i++) {
            Particles.addParticle(
                EForestParticle.ELECTRIC,
                x,
                y,
                z,
                Math.random() / 20,
                Math.random() / 20,
                Math.random() / 20
            );
        };
    };

    export function registerGlowworm(r: number, g: number, b: number) {
        const newGlowworm = Particles.registerParticleType({
            texture: "part_color",
            render: 2,
            color: [r/256, g/256, b/256, 1],
            size: [1, 3],
            lifetime: [40, 100],
            animators: {
                alpha: { fadeIn: 0.4, fadeOut: 0.4 },
                size: { fadeOut: 0.5, fadeIn: 0.4, start: 0, end: 0 }
            }
        });

        EForestParticle.glowwormColors.push(newGlowworm);
    };

    export function getRandomGlowworm(): number {
        return MathHelper.randomFromArray(EForestParticle.glowwormColors);
    }
};

Network.addClientPacket("packet.infinite_forest.send_particle", (data: IParticleSender) => {
    return Particles.addParticle(data.type, data.x, data.y, data.z, data.vx, data.vy, data.vz);
});
  


