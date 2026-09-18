const FollowAllyAI = () => extend(AIController, {
    following: null,
    updateMovement() {
        this.unloadPayloads();
        const unit = this.unit;
        if (unit == null || unit.dead) return;
        if (
            this.following == null ||
            this.following.dead ||
            !this.following.isValid() ||
            this.following.team != unit.team
        ) {
            this.following = Units.closest(
                unit.team,
                unit.x,
                unit.y,
                2000,
                u => u != unit &&
                     u.isValid() &&
                     !u.dead
            );
        }
        if (this.following == null) return;
        const angle = Angles.angle(
            unit.x,
            unit.y,
            this.following.x,
            this.following.y
        );

        const distance = Mathf.dst(
            unit.x,
            unit.y,
            this.following.x,
            this.following.y
        );
        if (distance > 40) {

            Tmp.v1.trns(
                angle,
                unit.speed
            );

            unit.moveAt(Tmp.v1);
        }
        unit.lookAt(this.following);
    }
});
module.exports = FollowAllyAI;