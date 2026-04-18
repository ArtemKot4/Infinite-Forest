package com.artemkot.infinite_forest.network.packets;

import java.util.HashSet;
import java.util.Set;

import com.artemkot.infinite_forest.ModResources;
import com.artemkot.infinite_forest.api.curse.ClientForestDataManager;
import com.artemkot.infinite_forest.common.DataComponentList;
import com.artemkot.infinite_forest.common.item.ancient_note.ItemList;
import com.artemkot.infinite_forest.common.world.ForestDataManager;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import net.neoforged.neoforge.network.PacketDistributor;
import net.neoforged.neoforge.network.handling.IPayloadContext;

public record AddFoundAncientNotePacket(String ancientNoteId) implements CustomPacketPayload {
    public static final Type<AddFoundAncientNotePacket> TYPE = new Type<>(
        ModResources.getResourceLocation("add_found_ancient_note")
    );
    
    public static final StreamCodec<ByteBuf, AddFoundAncientNotePacket> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8, AddFoundAncientNotePacket::ancientNoteId,
        AddFoundAncientNotePacket::new
    );
    
    @Override
    public Type<AddFoundAncientNotePacket> type() {
        return TYPE;
    }
    
    public static void handle(AddFoundAncientNotePacket packet, IPayloadContext ctx) {
        ctx.enqueueWork(() -> {
            Player player = ctx.player();
            if(player == null) {
                return;
            }
            ItemStack holdItem = player.getMainHandItem();
            if(holdItem.getItem() != ItemList.ANCIENT_NOTE.get()) {
                return;
            } 
            if(!holdItem.get(DataComponentList.ANCIENT_NOTE_DATA).stringId().equals(packet.ancientNoteId)) {
                return;
            } 
            ForestDataManager.addFoundAncientNote(packet.ancientNoteId);
            PacketDistributor.sendToPlayer((ServerPlayer) player, new SyncFoundAncientNotesPacket(ForestDataManager.getFoundAncientNotes(player.level())));
        });
    }
}