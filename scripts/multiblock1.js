Events.on(ClientLoadEvent, () => {
const block = Vars.content.block("azimut-mixing-chamber-base");
block.buildType = () => extend(GenericCrafter.GenericCrafterBuild, block, {
    draw(){
        if(this.rotation == 0){
            Draw.rect(Core.atlas.find("azimut-mixing-chamber-base-0"), this.x, this.y);
        }
        if(this.rotation == 1){
            Draw.rect(Core.atlas.find("azimut-mixing-chamber-base-1"), this.x, this.y);
        }
        if(this.rotation == 2){
            Draw.rect(Core.atlas.find("azimut-mixing-chamber-base-2"), this.x, this.y);
        }
        if(this.rotation == 3){
            Draw.rect(Core.atlas.find("azimut-mixing-chamber-base-3"), this.x, this.y);
        }
    }
}); 
});