importClass(java.lang.Class);

const mod = Vars.mods.locateMod("azimut");

mod.meta.displayName =
"[#b867ec]A[#c974dc]Z[#bb9ef3ff]I[#9a5bf6]M[#934bee]U[#8b75e1]T[#c1abd4]H";

mod.meta.author = "[#c3961f]Deer[#876409]Carbonate";

require("multiblock1");
require("multiblock2");
require("multiblock3");
require("multiblock4");
require("multiblock5");
require("multiblock6");
require("multiblock7");
require("multiblock8");
require("multiblock9");
require("multiblock10");
require("construct");

const FollowAllyAI = require("followai");

Events.on(ClientLoadEvent, () => {

    const siegeMiniDrone = Vars.content.unit("azimut-siege-mini-drone");

    siegeMiniDrone.aiController = FollowAllyAI.ai;
    siegeMiniDrone.controller = (u) => FollowAllyAI.ai();
    FollowAllyAI.excludedTypes.push(
        Vars.content.unit("azimut-adder"),
        Vars.content.unit("azimut-akarius"),
        Vars.content.unit("azimut-oscillius"),
        Vars.content.unit("azimut-oscillius-body"),
        Vars.content.unit("azimut-oscillius-end"),
        Vars.content.unit("azimut-adjuster-drone"),
        Vars.content.unit("azimut-adjuster2drone"),
        Vars.content.unit("azimut-adjuster3-drone"),
        Vars.content.unit("azimut-construction-drone"),
        Vars.content.unit("azimut-construction-mini-drone"),
        Vars.content.unit("azimut-Cthulhu-missile"),
        Vars.content.unit("azimut-EMP-missile"),
        Vars.content.unit("azimut-enchanced-cargo-drone"),
        Vars.content.unit("azimut-fire-missile"),
        Vars.content.unit("azimut-force-drone"),
        Vars.content.unit("azimut-fortification-drone"),
        Vars.content.unit("azimut-heal-drone"),
        Vars.content.unit("azimut-Innovation1"),
        Vars.content.unit("azimut-lightning-storm"),
        Vars.content.unit("azimut-orbital-regeneration-drone"),
        Vars.content.unit("azimut-retray-mine"),
        Vars.content.unit("azimut-retray-mine2"),
        Vars.content.unit("azimut-retray-mine3"),
        Vars.content.unit("azimut-siege-drone"),
        Vars.content.unit("azimut-siege-mini-drone"),
        Vars.content.unit("azimut-storm"),
        Vars.content.unit("azimut-Whale-missile")
    );

});

const librarySnake = require("library-snake");

const oscilliusSnakeEnd = librarySnake.segment("oscillius-end", {
    hitSize:9,
    offsetSegment: -2.7,
    health: 800
}, {});

const oscilliusSnakeBody = librarySnake.segment("oscillius-body", {
    hitSize:9,
    offsetSegment: -2.7,
    health: 900
}, {});

const oscilliusSnake = librarySnake.head("oscillius", {
    body: oscilliusSnakeBody,
    end: oscilliusSnakeEnd,
    lengthSnake:3,
    hitSize:9,
    speed: 4.6,
    health: 700
}, {});
Events.on(ClientLoadEvent, () => {

    const siegeMiniDrone = Vars.content.unit("azimut-siege-mini-drone");

    siegeMiniDrone.aiController = FollowAllyAI.ai;
    siegeMiniDrone.controller = (u) => FollowAllyAI.ai();

});