Events.on(ClientLoadEvent, () => {
    const block = Vars.content.block("azimut-radioisotope-thermoetheric-generator-base");
    const Layer = Packages.mindustry.graphics.Layer;

    block.uiIcon  = Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-full");
    block.fullIcon = Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-full");

    const baseRegions = [
        Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-0"),
        Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-1"),
        Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-2"),
        Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-3"),
    ];
    const overlayRegions = [
        Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-overlay-0"),
        Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-overlay-1"),
        Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-overlay-2"),
        Core.atlas.find("azimut-radioisotope-thermoetheric-generator-base-overlay-3"),
    ];

    const planDrawer = extend(Packages.mindustry.world.draw.DrawBlock, {
        draw(build){},
        drawPlan(block, plan, list){
            Draw.rect(baseRegions[plan.rotation], plan.drawx(), plan.drawy());
        }
    });

    const oldDrawer = block.drawer;
    block.drawer = extend(Packages.mindustry.world.draw.DrawMulti, [oldDrawer, planDrawer], {});

    block.buildType = () => extend(GenericCrafter.GenericCrafterBuild, block, {
        draw(){
            this.super$draw();
            Draw.z(Layer.block + 0.5);
            Draw.rect(baseRegions[this.rotation], this.x, this.y);
            Draw.z(Layer.block - 0.5);
            Draw.rect(overlayRegions[this.rotation], this.x, this.y);
            Draw.z(Layer.block);
        }
    });
});