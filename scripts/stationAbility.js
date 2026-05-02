const UNIT_NAME = "Legate";
Core.app.addListener({
    update() {
        if (!Vars.state.isGame()) return;
        Groups.unit.each(unit => {
            if (unit.type.name !== UNIT_NAME) return;
            print("Found Legate unit!");
            print("Unit disarmed before: " + unit.disarmed);
            print("Unit has volatile: " + unit.hasEffect(StatusEffects.volatile));
            unit.disarmed = false;
            unit.apply(StatusEffects.volatile, 2);
            print("Unit disarmed after: " + unit.disarmed);
        });
    }
});