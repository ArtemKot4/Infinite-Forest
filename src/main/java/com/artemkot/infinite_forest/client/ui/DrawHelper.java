package com.artemkot.infinite_forest.client.ui;

import java.util.ArrayList;

import org.checkerframework.checker.nullness.qual.NonNull;

public class DrawHelper {
    public static ArrayList<String> getArrayOfLines(@NonNull String text, @NonNull int lineSize) {
        ArrayList<String> result = new ArrayList<>();
        String line = "";
        String[] words = text.split(" ");
    
        for(String word : words) {
            if(line.length() + word.length() <= lineSize) {
                line += word + " ";
            } else {
                result.add(line.toString());
                line = word + " ";
            }
        }
        result.add(line);
        return result;
    }
}
