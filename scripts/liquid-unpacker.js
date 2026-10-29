const BLOCK_NAME = "azimut-liquid-unpacker";
const DEFAULT_AMOUNT = 10;
const ITEMS_PER_CRAFT = 1;
const DEBUG = true;
const recipeNames = {
    "packed-isobutane": "isobutane",
    "packed-ammonia": "ammonia",
    "packed-iterin": "iterin",
    "packed-cesium": "cesium",
    "packed-nitrogen": "nitrogen",
    "packed-swartzite": "swartzite",
    "packed-power": "power"
};
function findLiquid(name){
    const modded = Vars.content.liquid("azimut-" + name);
    if(modded != null){
        return modded;
    }
    return Vars.content.liquid(name);
}

function findItem(name){
    const modded = Vars.content.item("azimut-" + name);
    if(modded != null){
        return modded;
    }
    return Vars.content.item(name);
}

let logicReady = false;

function setupLogic(){
    if(logicReady){
        return;
    }

    const block = Vars.content.block(BLOCK_NAME);
    if(block == null){
        return;
    }

    const recipes = [];

    function addRecipe(name){
        const item = findItem(name);
        const liquid = findLiquid(recipeNames[name]);
        if(liquid == null || item == null){
            Log.warn("[liquid-unpacker] recipe skipped: " + name);
            return;
        }
        const amount = DEFAULT_AMOUNT;
        recipes.push({
            item: item,
            liquid: liquid,
            amount: amount
        });
    }

    const names = Object.keys(recipeNames);
    for(let i = 0; i < names.length; i++){
        addRecipe(names[i]);
    }

    if(recipes.length == 0){
        Log.warn("[liquid-unpacker] no recipes resolved, will retry");
        return;
    }

    logicReady = true;
    Log.info("[liquid-unpacker] ready, recipes: " + recipes.length);

    function recipeForItem(item){
        for(let i = 0; i < recipes.length; i++){
            if(recipes[i].item == item){
                return recipes[i];
            }
        }
        return null;
    }
    function tankFits(build, recipe){
        const amount = build.liquids.currentAmount();
        if(amount >= 0.01 && build.liquids.current() != recipe.liquid){
            return false;
        }
        return amount + recipe.amount <= block.liquidCapacity;
    }

    function recipeUsable(build, recipe){
        return build.items.has(recipe.item, ITEMS_PER_CRAFT) && tankFits(build, recipe);
    }

    function activeRecipe(build){
        for(let i = 0; i < recipes.length; i++){
            if(recipeUsable(build, recipes[i])){
                return recipes[i];
            }
        }
        return null;
    }

    block.buildType = () => {
        let debugTimer = 0;

        return extend(
            GenericCrafter.GenericCrafterBuild,
            block,
            {
                acceptItem(source, item){
                    if(recipeForItem(item) == null){
                        return false;
                    }
                    return this.items.get(item) < block.itemCapacity;
                },

                shouldConsume(){
                    return activeRecipe(this) != null;
                },

                updateTile(){
                    const active = activeRecipe(this) != null;

                    if(DEBUG){
                        debugTimer += Time.delta;
                        if(debugTimer >= 120){
                            debugTimer = 0;
                            Log.info(
                                "[liquid-unpacker] active=" + active +
                                " progress=" + this.progress +
                                " items=" + this.items.total() +
                                " liquid=" + this.liquids.currentAmount()
                            );
                        }
                    }

                    if(active && this.enabled){
                        this.progress += this.delta() / block.craftTime;
                    }

                    this.warmup = Mathf.approachDelta(this.warmup, active ? 1 : 0, block.warmupSpeed);
                    this.totalProgress += this.warmup * Time.delta;

                    if(this.progress >= 1){
                        this.craft();
                    }

                    this.dumpOutputs();
                },

                craft(){
                    const recipe = activeRecipe(this);
                    if(recipe == null){
                        return;
                    }

                    this.items.remove(recipe.item, ITEMS_PER_CRAFT);
                    if(this.liquids.currentAmount() < 0.01 && this.liquids.current() != recipe.liquid){
                        this.liquids.clear();
                    }
                    this.liquids.add(recipe.liquid, recipe.amount);

                    if(this.wasVisible){
                        block.craftEffect.at(this.x, this.y);
                    }

                    this.progress %= 1;
                },

                dumpOutputs(){
                    if(this.liquids.currentAmount() > 0.01){
                        this.dumpLiquid(this.liquids.current());
                    }
                }
            }
        );
    };
}
setupLogic();

Events.on(
    Packages.mindustry.game.EventType.ContentInitEvent,
    () => {
        setupLogic();
    }
);