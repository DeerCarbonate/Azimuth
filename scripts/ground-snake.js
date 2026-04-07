/**
 * ground-snake.js — наземная змея для Mindustry 156.2
 * Используется так же как library-snake, но flying: false + LegsUnit
 */

const registerClass = unit => {
    EntityMapping.nameMap.put(unit.name, unit.constructor);
    unit.classId = -1;
    for (var i in EntityMapping.idMap) {
        if (!EntityMapping.idMap[i]) {
            EntityMapping.idMap[i] = unit.constructor;
            unit.classId = i;
            return;
        }
    }
    throw new IllegalArgumentException(unit.name + " : нет свободного class ID");
};

const groundSegmentAI = () => extend(AIController, {
    updateMovement() {
        this.unloadPayloads();
        const { unit } = this;
        const target = unit.getSegment();
        if (target == null || target.dead) return;

        const angle = Angles.angle(unit.x, unit.y, target.x, target.y);
        Tmp.v1.trns(angle, -unit.getOffset());

        if (unit.getDstSegment() > unit.getOffset()) {
            Tmp.v2.trns(
                Angles.angle(unit.x, unit.y, target.x + Tmp.v1.x, target.y + Tmp.v1.y),
                unit.speed()
            );
            unit.moveAt(Tmp.v2);
        }
        unit.rotation = Angles.moveToward(unit.rotation, angle, 4 * Time.delta);
    }
});

function segment(name, type, constructor) {
    if (type == undefined) type = {};
    if (constructor == undefined) constructor = {};

    type = Object.assign({
        flying: false,
        hidden: true,
        faceTarget: false,
        omniMovement: true,
        engineSize: 0,
        offsetSegment: 14,
        getOffset() { return this.offsetSegment; }
    }, type);

    const unit = extend(UnitType, name, type);

    unit.aiController = groundSegmentAI;
    unit.logicControllable = false;
    unit.playerControllable = false;

    unit.constructor = () => extend(LegsUnit, Object.assign({
        _offset: 0,
        _parent: null,
        _segment: null,
        idParent: -1,
        idSegment: -1,

        setType(t) {
            this._offset = t.getOffset();
            this.super$setType(t);
        },
        update() {
            this.super$update();
            this._update();
        },
        _update() {
            if (this._parent == null || this._segment == null) this.findFamily();
            const parent = this.getParent();
            if (parent == null || parent.dead) { this.kill(); return; }
            if (this.team != parent.team) this.team = parent.team;
        },
        findFamily() {
            const seg = Groups.unit.getByID(this.idSegment);
            const par = Groups.unit.getByID(this.idParent);
            if (seg != null) this.setSegment(seg);
            if (par != null) {
                this.setParent(par);
                par.addChild(this.self);
                if (seg == null) par._update();
            } else {
                this.kill();
            }
        },
        getDstSegment() {
            const next = this.getSegment();
            if (next == null || next.dead) return -100;
            Tmp.v1.trns(Angles.angle(this.x, this.y, next.x, next.y), -unit.offsetSegment);
            return Mathf.dst(this.x, this.y, next.x + Tmp.v1.x, next.y + Tmp.v1.y) - (this.hitSize + 10);
        },
        speed() {
            const parent = this.getParent();
            if (parent != null) {
                return parent.speed() + (this.getDstSegment() / (unit.offsetSegment + this.hitSize));
            }
            return this.super$speed();
        },
        cap() { return this.count() + 1; },
        getOffset() { return this._offset; },
        setParent(pr) { if (pr != null) { this._parent = pr; this.idParent = pr.id; } },
        getParent() { return this._parent; },
        setSegment(seg) { if (seg != null) { this._segment = seg; this.idSegment = seg.id; } },
        getSegment() { return this._segment; },
        write(write) {
            this.super$write(write);
            write.i(this.id);
            write.i(this._segment != null ? this._segment.id : -1);
            write.i(this._parent != null ? this._parent.id : -1);
        },
        read(read) {
            this.super$read(read);
            this.id = read.i();
            this.idSegment = read.i();
            this.idParent = read.i();
        },
        classId: () => unit.classId
    }, constructor));

    registerClass(unit);
    return unit;
}

function head(name, type, constructor) {
    if (type == undefined) type = {};
    if (constructor == undefined) constructor = {};

    type = Object.assign({
        flying: false,
        faceTarget: false,
        omniMovement: true,
        circleTarget: true,
        engineSize: 0,
        lengthSnake: 3,
        body: null,
        end: null
    }, type);

    const unit = extend(UnitType, name, type);

    unit.aiController = () => new GroundAI();

    unit.constructor = () => extend(LegsUnit, Object.assign({
        _segments: [],
        totalSegments: 0,
        setSneak: false,
        timeOut: 1,
        tryFindSegment: false,

        add() {
            this.super$add();
            if (!this.setSneak) this.createSegments();
        },
        update() {
            this.super$update();
            this._update();
        },
        _update() {
            if (!this.tryFindSegment) this.timeOutSegment();
            if (!this.setSneak) this.createSegments();

            const alive = this._segments.filter(s => s != null && !s.dead);
            if (alive.length != this.totalSegments) {
                this._segments = alive;
                this.totalSegments = alive.length;
                for (let i = 0; i < this._segments.length; i++) {
                    const prev = i === 0 ? this.self : this._segments[i - 1];
                    const seg = this._segments[i];
                    if (seg && !seg.dead && prev && !prev.dead) seg.setSegment(prev);
                }
            }
            if (this.totalSegments < 1 && this.tryFindSegment) this.kill();
        },
        timeOutSegment() {
            this.timeOut -= Time.delta;
            if (this.timeOut < 0) this.tryFindSegment = true;
        },
        createSegments() {
            if (unit.body == null || unit.end == null) return;
            const toCreate = unit.lengthSnake - this.totalSegments;
            for (let i = 0; i < toCreate; i++) {
                const prev = this._segments.length > 0
                    ? this._segments[this._segments.length - 1]
                    : this.self;
                const isLast = (i + 1 === toCreate);
                const seg = isLast ? unit.end.create(this.team) : unit.body.create(this.team);

                Tmp.v1.trns(this.rotation + 180, seg.hitSize + unit.body.offsetSegment);
                seg.set(prev.x + Tmp.v1.x, prev.y + Tmp.v1.y);
                seg.rotation = this.rotation;
                seg.setParent(this.self);
                seg.setSegment(prev);

                Events.fire(new UnitCreateEvent(seg, null, this.self));
                if (!Vars.net.client()) seg.add();
                this.addChild(seg);
            }
            this.setSneak = true;
        },
        addChild(child) {
            if (child != null) {
                this._segments.push(child);
                this.totalSegments = this._segments.length;
            }
        },
        write(write) {
            this.super$write(write);
            write.i(this.id);
            write.bool(this.setSneak);
        },
        read(read) {
            this.super$read(read);
            this.id = read.i();
            this.setSneak = read.bool();
        },
        classId: () => unit.classId
    }, constructor));

    registerClass(unit);
    return unit;
}

module.exports = { segment, head };