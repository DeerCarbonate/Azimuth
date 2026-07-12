Events.on(ClientLoadEvent, () => {
    const partBlock = Vars.content.block("azimut-stator-reactor-left");
    const Layer = Packages.mindustry.graphics.Layer;

    partBlock.uiIcon  = Core.atlas.find("azimut-stator-reactor-left-full");
    partBlock.fullIcon = Core.atlas.find("azimut-stator-reactor-left-full");

    const partRegions = [
        Core.atlas.find("azimut-stator-reactor-left-0"),
        Core.atlas.find("azimut-stator-reactor-left-1"),
        Core.atlas.find("azimut-stator-reactor-left-2"),
        Core.atlas.find("azimut-stator-reactor-left-3"),
    ];

    const planDrawer = extend(Packages.mindustry.world.draw.DrawBlock, {
        draw(build){},
        drawPlan(block, plan, list){
            Draw.rect(partRegions[plan.rotation], plan.drawx(), plan.drawy());
        }
    });

    const oldDrawer = partBlock.drawer;
    partBlock.drawer = extend(Packages.mindustry.world.draw.DrawMulti, [oldDrawer, planDrawer], {});

    partBlock.buildType = () => extend(ConsumeGenerator.ConsumeGeneratorBuild, partBlock, {
        draw(){
            this.super$draw();
            Draw.z(Layer.block + 0.5);
            Draw.rect(partRegions[this.rotation], this.x, this.y);
            Draw.z(Layer.block);
        }
    });
});