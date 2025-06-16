IMPORT("LangFile");
LangFile.registerTranslationsFrom(__dir__ + "resources/assets/lang/en.lang", {
    parseAdvanced: true,
    concatMultiline: false,
    lang: "en"
});

LangFile.registerTranslationsFrom(__dir__ + "resources/assets/lang/ru.lang", {
    parseAdvanced: true,
    concatMultiline: false,
    lang: "ru"
});


Translation.addTranslation("message.infinite_forest.electric_danger", {
    en: Native.Color.RED + "Electricity is danger",
    ru: Native.Color.RED + "Электричество опасно",
});

Translation.addTranslation("Its hot!", {
    ru: "Горячо!",
});

Translation.addTranslation("main_subtitle", {
    ru: "Странное чувство",
    en: "Strange feeling",
});
Translation.addTranslation("main_text", {
    ru: "Сейчас день, и... В очередной раз я пытаюсь убежать от странного сна, что давно меня беспокоит. В нём я брёл по загадочному лесу. Высочайшие деревья, чьи кроны углублялись и теснились глубоко в небе, не дают мне покоя. Тихий шёпот листьев, прохладная земля, на которой были броско разбросаны листья и цветы, бросают меня в дрожь. Пора разобраться со своими проблемами. С этого дня начинаю вести дневник...",
    en: "«In front of you there will be an enormous forest, hiding many unknown things within itself, and above your head there will be the tallest trees». That was the thought that started my day.",
});

Translation.addTranslation("main_title_info", {
    ru: "Новая цель",
    en: "First remember",
});

Translation.addTranslation("main_subtitle_info", {
    ru: "Голубой кристалл",
    en: "Blue crystal",
});

Translation.addTranslation("main_text_info", {
    ru: "Что-то мне подсказывает, что я что-то упускаю. Думаю, не помешало бы покопаться в шахте",
    en: "Something tells me I'm missing something. I think it wouldn't hurt to dig in the mine.",
});

Translation.addTranslation("temperature_flowers_title", {
    ru: "Лесные растения",
    en: "Forest plants",
});

Translation.addTranslation("temperature_flowers_subtitle", {
    ru: "Обжигают",
    en: "Burn",
});

Translation.addTranslation("temperature_flowers_text", {
    ru: "Я встретил их случайно, и все они очень непросты...",
    en: "I meet with there by random, and all there is a smart",
});

Translation.addTranslation("forest_title", {
    ru: "Место из сна",
    en: "Place from a dream",
});

Translation.addTranslation("forest_subtitle", {
    ru: "Прохладное",
    en: "So cold",
});

Translation.addTranslation("forest_text", {
    ru: "Не знаю, сколько времени прошло, помню лишь то, что разбил какой-то кристалл о землю, и очнулся уже здесь. Странное чувство... Это место очень похоже на место из сна. Надеюсь, я не совершил ошибку, надеюсь, мои кошмары меня отпустят... Тут так холодно: нужно найти, где можно согреться",
    en: "I meet with there by random, and all there is a smart",
});

