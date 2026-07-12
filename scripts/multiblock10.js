Events.on(ClientLoadEvent, () => {
    const partBlock = Vars.content.block("azimut-stator-reactor-right");
    const Layer = Packages.mindustry.graphics.Layer;

    partBlock.uiIcon  = Core.atlas.find("azimut-stator-reactor-right-full");
    partBlock.fullIcon = Core.atlas.find("azimut-stator-reactor-right-full");

    const partRegions = [
        Core.atlas.find("azimut-stator-reactor-right-2"),
        Core.atlas.find("azimut-stator-reactor-right-3"),
        Core.atlas.find("azimut-stator-reactor-right-0"),
        Core.atlas.find("azimut-stator-reactor-right-1"),
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