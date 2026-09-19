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
                u => u != unit && !u.dead
            );
            Log.info("[followai] поиск союзникафывлыфвл " + this.following);
        }

        if (this.following == null) {
            Log.info("[followai] следовать не за кем, бб блять");
            return;
        }

        this.moveTo(this.following, unit.hitSize / 2 + 15, 50);
        unit.lookAt(this.following);
    }
});
module.exports = FollowAllyAI;