//
// Created by zheka on 18/11/10.
//

#ifndef HORIZON_TYPES_H
#define HORIZON_TYPES_H

class Vec2 {
    public:
    float x,y;
    Vec2(float x,float y) : x(x), y(y) {};
    ~Vec2(){
        
    };
};

class Vec2;

class UIControl {
    public:
        void** vtable; // 4
        char filler[180]; // 184
        Vec2* getPosition() const;
};

class Vec3 {
    public:
    float x, y, z;
    Vec3(float x,float y,float z) : x(x), y(y), z(z) {};
    ~Vec3(){
        
    };

    Vec3 lerpTo(Vec3 const&, Vec3 const&,float);
};

class BlockPos {
    public:
    int x, y, z;
    BlockPos(int x,int y,int z) : x(x), y(y), z(z) {};
    ~BlockPos(){
        
    };
};

class ChunkPos {
    public:
    int x,z;

    ChunkPos(Vec3 const&);
    ChunkPos(BlockPos const&);
    ~ChunkPos(){
        
    };
    BlockPos getMiddleBlockPosition(int) const;
};

class ChunkBlockPos {
    public:
    char x,z;
    ChunkBlockPos(BlockPos const& pos, short minHeight);
};
struct AABB {
    float minX, minY, minZ, maxX, maxY, maxZ;

    AABB(float, float, float, float, float, float);
    AABB(Vec3 const&, Vec3 const&);
};

struct Color {
    static const Color RED;
    float r,g,b,a;
    
    
    Color(float r,float g,float b) : r(r),g(g),b(b) {};
    Color(float a,float r,float g,float b) : a(a),r(r),g(g),b(b) {};
    static Color fromHSB(float,float,float);
    
    int toARGB() const;
    int toABGR() const;

};


#endif //HORIZON_TYPES_H
