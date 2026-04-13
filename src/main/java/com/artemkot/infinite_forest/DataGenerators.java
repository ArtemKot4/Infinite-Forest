package com.artemkot.infinite_forest;

import java.util.Set;
import java.util.concurrent.CompletableFuture;

import com.artemkot.infinite_forest.common.block.BlockList;
import com.artemkot.infinite_forest.common.item.ancient_note.ItemList;

import net.minecraft.core.HolderLookup;
import net.minecraft.data.DataGenerator;
import net.minecraft.data.DataProvider;
import net.minecraft.data.PackOutput;
import net.minecraft.data.loot.BlockLootSubProvider;
import net.minecraft.data.loot.LootTableProvider;
import net.minecraft.tags.BlockTags;
import net.minecraft.world.flag.FeatureFlags;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.BushBlock;
import net.minecraft.world.level.storage.loot.parameters.LootContextParamSets;
import net.neoforged.neoforge.client.model.generators.ItemModelProvider;
import net.neoforged.neoforge.common.data.BlockTagsProvider;
import net.neoforged.neoforge.common.data.ExistingFileHelper;
import net.neoforged.neoforge.common.data.ParticleDescriptionProvider;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import net.neoforged.neoforge.registries.DeferredBlock;
import net.neoforged.neoforge.client.model.generators.BlockStateProvider;

import net.minecraft.world.level.block.BushBlock;
import net.neoforged.neoforge.client.model.generators.ItemModelProvider;
import java.util.ArrayList;
import java.util.function.Supplier;

import java.util.ArrayList;
import java.util.List;


public class DataGenerators {
    private final GatherDataEvent event;
    private final DataGenerator generator;
    private final ExistingFileHelper existingFileHelper;
    private final CompletableFuture<HolderLookup.Provider> lookupProvider;

    public DataGenerators(GatherDataEvent event) {
        this.event = event;
        this.generator = event.getGenerator();
        this.existingFileHelper = event.getExistingFileHelper();
        this.lookupProvider = event.getLookupProvider();

        generateAll();
    }

    public void generateAll() {
        addBlockStateProvider();
        addLootTableProvider();
        addBlockTagsProvider();
        addItemModelProvider();
        addParticleDescriptionProvider();
    }

    private void addBlockStateProvider() {
        generator.addProvider(
            event.includeClient(),
            (DataProvider.Factory<BlockStateProvider>) packOutput -> 
                new BlockStateProvider(packOutput, InfiniteForest.MOD_ID, existingFileHelper) {
                    @Override
                    protected void registerStatesAndModels() {
                        BlockList.BLOCKS.getEntries().forEach(holder -> {
                            Block block = holder.get();
                            String name = holder.getId().getPath();
                            
                            if(block instanceof BushBlock) {
                                var model = models().cross(
                                    name,
                                    modLoc("block/plants/" + name)
                                ).renderType("minecraft:cutout");
                                simpleBlock(block, model);
                            } else {
                                var model = models().cubeAll(
                                    name,
                                    modLoc("block/" + name)
                                );
                                simpleBlock(block, model);
                            }
                        });
                    }
                }
        );
    }

    private void addLootTableProvider() {
        generator.addProvider(
            event.includeServer(),
            (DataProvider.Factory<LootTableProvider>) packOutput -> {
                List<LootTableProvider.SubProviderEntry> entries = new ArrayList<>();
                entries.add(
                    new LootTableProvider.SubProviderEntry(
                        (provider) -> new BlockLootSubProvider(
                            Set.of(),
                            FeatureFlags.DEFAULT_FLAGS,
                            provider
                        ) {
                            @Override
                            protected void generate() {
                                BlockList.BLOCKS.getEntries().forEach(holder -> {
                                    this.dropSelf(holder.get());
                                });
                            }
                            
                            @Override
                            protected Iterable<Block> getKnownBlocks() {
                                List<Block> blocks = new ArrayList<>();
                                BlockList.BLOCKS.getEntries().forEach(holder -> blocks.add(holder.get()));
                                return blocks;
                            }
                        },
                        LootContextParamSets.BLOCK
                    )
                );
                
                return new LootTableProvider(packOutput, Set.of(), entries, lookupProvider);
            }
        );
    }

    private void addBlockTagsProvider() {
        generator.addProvider(
            event.includeServer(),
            (DataProvider.Factory<BlockTagsProvider>) packOutput ->
                new BlockTagsProvider(packOutput, lookupProvider, InfiniteForest.MOD_ID, existingFileHelper) {
                    @Override
                    protected void addTags(HolderLookup.Provider provider) {
                        BlockList.BLOCKS.getEntries().forEach(holder -> {
                            Block block = holder.get();
                            
                            if(block instanceof BushBlock) {
                                this.tag(BlockTags.SWORD_EFFICIENT).add(block);
                            } else {
                                this.tag(BlockTags.MINEABLE_WITH_PICKAXE).add(block);
                                this.tag(BlockTags.NEEDS_STONE_TOOL).add(block);
                            }
                        });
                    }
                }
        );
    }

    private void addItemModelProvider() {
        generator.addProvider(
            event.includeClient(),
            (DataProvider.Factory<ItemModelProvider>) packOutput ->
                new ItemModelProvider(packOutput, InfiniteForest.MOD_ID, existingFileHelper) {
                    @Override
                    protected void registerModels() {
                        BlockList.BLOCKS.getEntries().forEach(holder -> {
                            String name = holder.getId().getPath();
                            Block block = holder.get();
                            
                            if(block instanceof BushBlock) {
                                withExistingParent(name, mcLoc("item/generated"))
                                    .texture("layer0", modLoc("block/plants/" + name));
                            } else {
                                withExistingParent(name, modLoc("block/" + name));
                            }
                        });
                        
                        ItemList.ITEMS.getEntries().forEach(holder -> {
                            String name = holder.getId().getPath();
                            Item item = holder.get();

                            if(item instanceof BlockItem) {
                                return;
                            }
                            
                            withExistingParent(name, mcLoc("item/generated"))
                                .texture("layer0", modLoc("item/" + name));
                        });
                    }
                }
        );
    }

    private void addParticleDescriptionProvider() {
        // generator.addProvider(
        //     event.includeClient(),
        //     (DataProvider.Factory<ParticleDescriptionProvider>) packOutput -> 
        //         new ParticleDescriptionProvider(packOutput) {
        //             @Override
        //             protected void addDescriptions() {
        //                 // Указываем тип частицы и текстуру к ней
        //                 this.sprite(ModParticleTypes.FIRE_FLOWER_PARTICLE.get(), 
        //                     InfiniteForest.getResourceLocation("fire_flower_particle"));
        //             }
        //         }
        // );
    }

}