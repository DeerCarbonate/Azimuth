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
require("blocks");
require("construct");

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
require("blocks");
