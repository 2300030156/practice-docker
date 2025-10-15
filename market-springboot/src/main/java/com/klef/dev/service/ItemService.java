package com.klef.dev.service;

import java.util.List;
import com.klef.dev.entity.Item;

public interface ItemService {
    Item addItem(Item item);
    List<Item> getAllItems();
    Item getItemById(int id);
    Item updateItem(Item item);
    void deleteItemById(int id);
}
