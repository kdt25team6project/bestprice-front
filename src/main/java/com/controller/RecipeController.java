package com.bestprice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecipeController {

    @GetMapping("/api/recipes/csv/load")
    public String loadRecipesFromCSV() {
        // CSV 파일을 불러와 데이터베이스에 저장하는 로직
        return "CSV data loaded";
    }
}
