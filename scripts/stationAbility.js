const StatusEffects = Packages.mindustry.content.StatusEffects;
const Groups     = Packages.mindustry.Groups;
const Core       = Packages.arc.Core;
const Vars       = Packages.mindustry.Vars;
const UNIT_NAME = "Legate";
Core.app.addListener({
    update() {
        if (!Vars.state.isGame()) return;

        Groups.unit.each(unit => {
            if (unit.type.name !== UNIT_NAME) return;
            unit.disarmed = false;
            unit.apply(StatusEffects.volatile, 2); 
        });
    }
});