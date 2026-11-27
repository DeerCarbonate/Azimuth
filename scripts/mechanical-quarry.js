const BLOCK_NAME = "azimut-mechanical-quarry";
const NEIGHBOR_RANGE = 2;
const BONUS_PER_NEIGHBOR = 0.02;
const MAX_BONUS = 0.10;
const SCAN_INTERVAL = 30;
// ок я закончил с дебагом но мне слишком впааадлу его удаялятяь
const DEBUG = false;
let logicReady = false;
function setupLogic(){
    if(logicReady){
        return;
    }

    const block = Vars.content.block(BLOCK_NAME);
    if(block == null){
        return;
    }
    logicReady = true;
    function countNeighbors(build){
        var cx = build.tileX();
        var cy = build.tileY();
        var reach = Math.floor(block.size / 2) + NEIGHBOR_RANGE;
        var selfPos = build.pos();
        var found = [];

        for(var dx = -reach; dx <= reach; dx++){
            for(var dy = -reach; dy <= reach; dy++){
                var other = Vars.world.build(cx + dx, cy + dy);

                if(other != null && other.block == block && other.team == build.team && other.pos() != selfPos){
                    var p = other.pos();
                    if(found.indexOf(p) == -1){
                        found.push(p);
                    }
                }
            }
        }
        return found.length;
    }
        const Bar = Packages.mindustry.ui.Bar;
    const Pal = Packages.mindustry.graphics.Pal;

    function bonusFor(count){
        return Math.min(count * BONUS_PER_NEIGHBOR, MAX_BONUS);
    }

    if(!Vars.headless){
        block.addBar(
            "azimut-quarry-neighbors",
            func(
                build => {
                    return new Bar(
                        prov(
                            () => {
                                const count = countNeighbors(build);
                                const percent = Math.round(bonusFor(count) * 100);
                                return Core.bundle.format(
                                    "azimut.quarry-neighbors",
                                    "" + count,
                                    "" + percent
                                );
                            }
                        ),
                        prov(
                            () => {
                                return Pal.accent;
                            }
                        ),
                        floatp(
                            () => {
                                return bonusFor(countNeighbors(build)) / MAX_BONUS;
                            }
                        )
                    );
                }
            )
        );
    }
    block.buildType = () => {
        let scanTimer = 0;
        let bonus = 0;

        return extend(
            Drill.DrillBuild,
            block,
            {
                updateTile(){
                    this.super$updateTile();

                    scanTimer -= Time.delta;
                    if(scanTimer <= 0){
                        scanTimer = SCAN_INTERVAL;
                        const count = countNeighbors(this);
                        bonus = bonusFor(count);
                        if(DEBUG){
                            Log.info(
                                "[mechanical-quarry] pos=" + this.tileX() + "," + this.tileY() +
                                " neighbors=" + count +
                                " bonus=" + bonus +
                                " ore=" + this.dominantItems +
                                " items=" + this.items.total() +
                                " eff=" + this.efficiency +
                                " speed=" + this.lastDrillSpeed
                            );
                        }
                    }

                    if(bonus <= 0){
                        return;
                    }

                    // чтобы в UI показывалась реальная скорость
                    this.lastDrillSpeed *= (1 + bonus);

                    if(this.dominantItems > 0 && this.items.total() < block.itemCapacity && this.efficiency > 0){
                        const speed = Mathf.lerp(
                            1,
                            block.liquidBoostIntensity,
                            this.optionalEfficiency
                        ) * this.efficiency;

                        this.progress += this.delta() * this.dominantItems * speed * this.warmup * bonus;
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