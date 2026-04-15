package com.artemkot.infinite_forest.common.block.plant;

import com.artemkot.infinite_forest.api.curse.CurseStorage;
import com.artemkot.infinite_forest.common.block.ForestFlower;
import com.artemkot.infinite_forest.common.world.curse.ColdCurse;

public class MoonFlower extends ForestFlower {
    public MoonFlower() {
        CurseStorage.<ColdCurse>getCurse("cold").addFrozenBlock(this);
    }
}
