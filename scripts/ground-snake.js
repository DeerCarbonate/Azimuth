let registerClass = unit => {
    EntityMapping.nameMap.put(unit.name, unit.constructor);
    unit.classId = -1;
    for (var i in EntityMapping.idMap) {
        if (!EntityMapping.idMap[i]) {
            EntityMapping.idMap[i] = unit.constructor;
            unit.classId = i;
            return;
        }
    }
    throw new IllegalArgumentException(unit.name + " has no class ID");
};

const groundSegmentAI = () => extend(AIController, {
    updateMovement() {
        this.unloadPayloads();
        const {unit} = this;
        const segment = unit.getSegment();
        if (segment == null || segment.dead) return;
        const {x: unitX, y: unitY} = unit;
        const {x: nextX, y: nextY} = segment;
        Tmp.v1.trns(Angles.angle(unitX, unitY, nextX, nextY), -unit.getOffset());
        if (unit.getDstSegment() > unit.getOffset()) {
            Tmp.v2.trns(
                Angles.angle(unitX, unitY, nextX + Tmp.v1.x, nextY + Tmp.v1.y),
                unit.speed()
            );
            unit.moveAt(Tmp.v2);
        }
        this.faceTarget();
    }
});

function segment(name, type, constructor) {
    if (type == undefined) type = {};
    if (constructor == undefined) constructor = {};

    type = Object.assign({
        flying: false,   // ← единственное изменение
        hidden: true,
        engineSize: 0,
        offsetSegment: 14,
        getOffset() { return this.offsetSegment; }
    }, type);

    let unit = extend(UnitType, name, type);

    unit.aiController = groundSegmentAI;
    unit.logicControllable = false;
    unit.playerControllable = false;

    unit.constructor = () => extend(UnitEntity, Object.assign({
        _offset: 0,
        _parent: null,
        _segment: null,
        idParent: -1,
        idSegment: -1,
        setType(type) {
            this._offset = type.getOffset();
            this.super$setType(type);
        },
        update() {
            this.super$update();
            this._update();
        },
        _update() {
            if (this._parent == null || this._segment == null) this.findFamily();
            let parent = this.getParent();
            if (parent == null || parent.dead) this.kill();
            if (parent != null && this.team != parent.team) this.team = parent.team;
        },
        findFamily() {
            let seg = Groups.unit.getByID(this.idSegment);
            let par = Groups.unit.getByID(this.idParent);
            if (seg != null && seg.id != null) this.setSegment(seg);
            if (par != null && par.id != null) {
                this.setParent(par);
                this.getParent().addChild(this.self);
                if (seg == null) this.getParent()._update();
            } else {
                this.kill();
            }
        },
        getDstSegment() {
            let next = this.getSegment();
            if (next == null || next.dead) return -100;
            Tmp.v1.trns(Angles.angle(this.x, this.y, next.x, next.y), -unit.offsetSegment);
            return Mathf.dst(this.x, this.y, next.x + Tmp.v1.x, next.y + Tmp.v1.y) - (this.hitSize + 10);
        },
        speed() {
            if (this._parent != null) {
                return this.getParent().speed() + ((this.getDstSegment()) / (unit.offsetSegment + this.hitSize));
            } else {
                return this.super$speed();
            }
        },
        impulseNet(vec) {},
        cap() { return this.count() + 1; },
        getOffset() { return this._offset; },
        setParent(pr) { if (pr != null) { this._parent = pr; this.idParent = pr.id; } },
        getParent() { return this._parent; },
        setSegment(seg) { if (seg != null) { this._segment = seg; this.idSegment = seg.id; } },
        getSegment() { return this._segment; },
        write(write) {
            this.super$write(write);
            write.i(this.id);
            write.i(this._segment != null && this._segment.id != null ? this._segment.id : -1);
            write.i(this._parent != null && this._parent.id != null ? this._parent.id : -1);
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
        flying: false,   // ← единственное изменение
        engineSize: 0,
        lengthSnake: 1,
        body: null,
        end: null
    }, type);

    let unit = extend(UnitType, name, type);

    unit.constructor = () => extend(UnitEntity, Object.assign({
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
            if (this._segments.filter(s => s != null && !s.dead).length != this.totalSegments) {
                this._segments = this._segments.filter(s => s != null && !s.dead);
                this.totalSegments = this._segments.length;
                for (let i = 0; i < this._segments.length; i++) {
                    let last = this._segments[i - 1] ? this._segments[i - 1] : this.self;
                    let seg = this._segments[i];
                    if ((seg != null && !seg.dead) && (last != null && !last.dead)) seg.setSegment(last);
                }
            }
            if (this.canDead(this.totalSegments) && this.tryFindSegment) this.kill();
        },
        timeOutSegment() {
            this.timeOut -= 1 * Time.delta;
            if (this.timeOut < 0) this.tryFindSegment = true;
        },
        canDead(amount) { return amount < 1; },
        createSegments() {
            if (unit.body != null && unit.end != null) {
                let total = unit.lengthSnake - this.totalSegments;
                for (let i = 0; i < total; i++) {
                    let last = this._segments[i - 1] ? this._segments[i - 1] : this.self;
                    let seg = i + 1 == total ? unit.end.create(this.team) : unit.body.create(this.team);
                    Tmp.v1.trns(this.rotation, -(seg.hitSize + 10));
                    Tmp.v1.add(last.x, last.y);
                    seg.setParent(this.self);
                    seg.set(Tmp.v1.x, Tmp.v1.y);
                    seg.rotation = Math.atan2(last.y - seg.y, last.x - seg.x) * 180 / Math.PI;
                    seg.setSegment(last);
                    Events.fire(new UnitCreateEvent(seg, null, this.self));
                    if (!Vars.net.client()) seg.add();
                    this.addChild(seg);
                }
                this.setSneak = true;
            }
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