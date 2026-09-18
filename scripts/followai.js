const FollowAllyAI = () => extend(AIController, {
    target: null,
    updateMovement() {
        const unit = this.unit;
        if (unit == null) return;
        if (
            this.target == null ||
            this.target.dead ||
            !this.target.isValid() ||
            this.target.team != unit.team
        ) {
            this.target = Units.closest(
                unit.team,
                unit.x,
                unit.y,
                2000,
                u => u != unit &&
                     u.isValid() &&
                     !u.dead
            );
        }
        if (this.target == null) return;
        this.moveTo(this.target, 40);
        this.faceTarget();
    }
});
module.exports = FollowAllyAI;