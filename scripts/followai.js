const excludedTypes = [];
const FollowAllyAI = () => extend(AIController, {
    following: null,
    updateMovement() {
        this.unloadPayloads();
        const unit = this.unit;
        if (unit == null || unit.dead) return;

        if (
            this.following == null ||
            this.following.dead ||
            this.following.team != unit.team
        ) {
            this.following = Units.closest(
                unit.team,
                unit.x,
                unit.y,
                2000,
                u => u != unit &&
                     !u.dead &&
                     u.type != unit.type &&
                     excludedTypes.indexOf(u.type) === -1
            );
        }

        if (this.following == null) return;
        this.moveTo(this.following, unit.hitSize / 2 + 15, 50);
        unit.lookAt(this.following);
    }
});
module.exports = {
    ai: FollowAllyAI,
    excludedTypes: excludedTypes
};
//я ебал JS - DeerC