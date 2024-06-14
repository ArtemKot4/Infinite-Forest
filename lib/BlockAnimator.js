LIBRARY({
    name: "BlockAnimator",
    version: 1,
    shared: true,
    api: "CoreEngine",
});
var LIB = { name: "BlockAnimator", version: 1 };
alert("".concat(LIB.name, " of version ").concat(LIB.version, " has been initialized!"));
var ObjectValues = function (obj) {
    return Object.keys(obj).map(function (v) { return obj[v]; });
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var BlockAnimator = /** @class */ (function () {
    function BlockAnimator(coords, tile) {
        this.coords = coords;
        this.tile = tile;
        this.animation = new Animation.Base(coords.x, coords.y, coords.z);
        this.animation.setBlocklightMode();
    }
    BlockAnimator.prototype.load = function () {
        this.animation.load();
    };
    ;
    BlockAnimator.prototype.describe = function (mesh, texture, scale, material) {
        if (scale === void 0) { scale = 1; }
        this.animation.describe(__assign({ mesh: mesh instanceof RenderSide ? mesh.getRenderMesh(this.tile) : mesh, skin: "models/" + texture + ".png", scale: scale }, (material && { material: material })));
    };
    BlockAnimator.prototype.rotate = function (x, y, z) {
        this.animation.transform().rotate(x, y, z);
    };
    BlockAnimator.prototype.scale = function (x, y, z) {
        this.animation.transform().scale(x, y, z);
    };
    ;
    BlockAnimator.prototype.setPos = function (x, y, z) {
        this.animation.setPos(x, y, z);
    };
    ;
    BlockAnimator.prototype.refresh = function () {
        this.animation.refresh();
    };
    BlockAnimator.prototype.destroy = function () {
        this.animation && this.animation.destroy();
    };
    BlockAnimator.generateMesh = function (model, params, rotate) {
        if (params === void 0) { params = {
            translate: [0.5, 0.5, 0.5],
            invertV: false,
            noRebuild: false,
        }; }
        var mesh = new RenderMesh(__dir__ + "/resources/assets/models/" + model + ".obj", "obj", params);
        if (rotate) {
            mesh.rotate(rotate[0], rotate[1], rotate[2]);
        }
        return mesh;
    };
    return BlockAnimator;
}());
;
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var RenderSide = /** @class */ (function () {
    function RenderSide(model, importParams) {
        if (importParams === void 0) { importParams = null; }
        var _this = this;
        this.model = model;
        this.importParams = importParams;
        var rotations = [
            [0, 0, 0],
            [0, -Math.PI, 0],
            [0, -Math.PI / 2, 0],
            [0, Math.PI / 2, 0],
        ];
        if (model instanceof RenderMesh) {
            this.list = rotations.map(function (value) {
                var copy = model.clone();
                copy.rotate.apply(copy, __spreadArray([], __read(value), false));
                return copy;
            });
            return;
        }
        this.list = rotations.map(function (value) {
            return BlockAnimator.generateMesh(model, _this.importParams, value);
        });
    }
    RenderSide.prototype.getRenderMesh = function (tile) {
        var data = BlockSource.getCurrentWorldGenRegion().getBlockData(tile.x, tile.y, tile.z);
        return this.list[data];
    };
    return RenderSide;
}());
var BlockModel = /** @class */ (function () {
    function BlockModel(model, importParams) {
        if (importParams === void 0) { importParams = {
            invertV: false,
            noRebuild: false,
            translate: [0.5, 0, 0.5],
        }; }
        if (typeof model === "string") {
            this.mesh = new RenderSide(model, importParams);
        }
        if (model instanceof RenderMesh) {
            this.mesh = new RenderSide(model);
        }
        if (model instanceof RenderSide) {
            this.mesh = model;
        }
    }
    BlockModel.prototype.setBlock = function (id, texture) {
        var meshes = this.mesh.list;
        for (var i = 0; i < meshes.length; i++) {
            var render = new ICRender.Model();
            meshes[i].setBlockTexture(texture, 0);
            render.addEntry(new BlockRenderer.Model(meshes[i]));
            BlockRenderer.setStaticICRender(id, i, render);
        }
    };
    return BlockModel;
}());
EXPORT("BlockAnimator", BlockAnimator);
EXPORT("RenderSide", RenderSide);
EXPORT("BlockModel", BlockModel);