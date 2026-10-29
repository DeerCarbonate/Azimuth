const BLOCK_NAME = "azimut-liquid-packager";
const DEFAULT_AMOUNT = 5;
const COBALT_PER_CRAFT = 1;
const DUMP_TIME = 5;
const DEBUG = true;
const recipeNames = {
    "isobutane": "packed-isobutane",
    "ammonia": "packed-ammonia",
    "iterin": "packed-iterin",
    "cesium": "packed-cesium",
    "nitrogen": "packed-nitrogen",
    "swartzite": "packed-swartzite",
    "power": "packed-power"
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

    const cobalt = findItem("cobalt");
    if(cobalt == null){
        Log.warn("[liquid-packager] cobalt not found");
        return;
    }

    const recipes = [];

    function addRecipe(name){
        const liquid = findLiquid(name);
        const item = findItem(recipeNames[name]);
        if(liquid == null || item == null){
            Log.warn("[liquid-packager] recipe skipped: " + name);
            return;
        }
        const amount = DEFAULT_AMOUNT;
        recipes.push({
            liquid: liquid,
            item: item,
            amount: amount
        });
    }

    const names = Object.keys(recipeNames);
    for(let i = 0; i < names.length; i++){
        addRecipe(names[i]);
    }

    if(recipes.length == 0){
        Log.warn("[liquid-packager] no recipes resolved, will retry");
        return;
    }

    logicReady = true;
    Log.info("[liquid-packager] ready, recipes: " + recipes.length);

    function recipeFor(liquid){
        for(let i = 0; i < recipes.length; i++){
            if(recipes[i].liquid == liquid){
                return recipes[i];
            }
        }
        return null;
    }
    function activeRecipe(build){
        const current = build.liquids.current();
        const recipe = recipeFor(current);
        if(recipe == null){
            return null;
        }
        if(build.liquids.get(current) < recipe.amount - 0.001){
            return null;
        }
        return recipe;
    }

    function canCraft(build){
        const recipe = activeRecipe(build);
        if(recipe == null){
            return false;
        }
        if(!build.items.has(cobalt, COBALT_PER_CRAFT)){
            return false;
        }
        return build.items.get(recipe.item) < block.itemCapacity;
    }

    function dumpPacked(build, recipe){
        if(build.items.has(recipe.item)){
            build.dump(recipe.item);
        }
    }

    block.buildType = () => {
        let dumpTimer = 0;
        let debugTimer = 0;

        return extend(
            GenericCrafter.GenericCrafterBuild,
            block,
            {
         //тока одна жижа за раз короче хаваывтается
                acceptLiquid(source, liquid){
                    if(recipeFor(liquid) == null){
                        return false;
                    }
                    if(this.liquids.currentAmount() < 0.01){
                        return true;
                    }
                    return this.liquids.current() == liquid;
                },

                shouldConsume(){
                    return canCraft(this);
                },

                updateTile(){
                    const active = canCraft(this);

                    if(DEBUG){
                        debugTimer += Time.delta;
                        if(debugTimer >= 120){
                            debugTimer = 0;
                            Log.info(
                                "[liquid-packager] active=" + active +
                                " progress=" + this.progress +
                                " items=" + this.items.total() +
                                " liquid=" + this.liquids.currentAmount()
                            );
                        }
                    }

                    if(active){
                        this.progress += this.edelta() / block.craftTime;
                    }

                    this.warmup = Mathf.approachDelta(this.warmup, active ? 1 : 0, block.warmupSpeed);
                    this.totalProgress += this.warmup * Time.delta;

                    if(this.progress >= 1){
                        this.craft();
                    }

                    dumpTimer += Time.delta;
                    if(dumpTimer >= DUMP_TIME){
                        dumpTimer = 0;
                        this.dumpOutputs();
                    }
                },

                craft(){
                    const recipe = activeRecipe(this);
                    if(recipe == null){
                        return;
                    }

                    this.consume();
                    this.liquids.remove(recipe.liquid, recipe.amount);
                    this.offload(recipe.item);

                    if(this.wasVisible){
                        block.craftEffect.at(this.x, this.y);
                    }

                    this.progress %= 1;
                },

                dumpOutputs(){
                    for(let i = 0; i < recipes.length; i++){
                        dumpPacked(this, recipes[i]);
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