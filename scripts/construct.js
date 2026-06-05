const AzimutUnitCommand = Packages.mindustry.game.UnitCommand;

Events.on(EventType.UnitSpawnEvent, event => {
    const unit = event.unit;
    if (unit.type !== Vars.content.unit("azimut-construction-mini-drone")) return;
    unit.command(AzimutUnitCommand.repair);
});