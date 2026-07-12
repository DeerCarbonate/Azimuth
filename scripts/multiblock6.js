Events.on(ClientLoadEvent, () => {
    const partBlock = Vars.content.block("azimut-atmospheric-extractor-collector");
    const Layer = Packages.mindustry.graphics.Layer;

    partBlock.uiIcon  = Core.atlas.find("azimut-atmospheric-extractor-collector-full");
    partBlock.fullIcon = Core.atlas.find("azimut-atmospheric-extractor-collector-full");

    const partRegions = [
        Core.atlas.find("azimut-atmospheric-extractor-collector-0"),
        Core.atlas.find("azimut-atmospheric-extractor-collector-1"),
        Core.atlas.find("azimut-atmospheric-extractor-collector-2"),
        Core.atlas.find("azimut-atmospheric-extractor-collector-3"),
    ];

    const planDrawer = extend(Packages.mindustry.world.draw.DrawBlock, {
        draw(build){},
        drawPlan(block, plan, list){
            Draw.rect(partRegions[plan.rotation], plan.drawx(), plan.drawy());
        }
    });

    const oldDrawer = partBlock.drawer;
    partBlock.drawer = extend(Packages.mindustry.world.draw.DrawMulti, [oldDrawer, planDrawer], {});

    partBlock.buildType = () => extend(GenericCrafter.GenericCrafterBuild, partBlock, {
        draw(){
            this.super$draw();
            Draw.z(Layer.block + 0.5);
            Draw.rect(partRegions[this.rotation], this.x, this.y);
            Draw.z(Layer.block);
        }
    });
});