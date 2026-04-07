importClass(java.lang.Class);

const mod = Vars.mods.locateMod("azimut");

mod.meta.displayName =
"[#b867ec]A[#c974dc]Z[#bb9ef3ff]I[#9a5bf6]M[#934bee]U[#8b75e1]T[#c1abd4]H";

mod.meta.description =
"A [#c5faf6]hybrid mod[] primarily built around [#bbc4f4]Erekir[] and its linear progression system.\n" +

"The mod introduces new gameplay mechanics that are tightly integrated into the campaign and accompany you throughout the entire playthrough.\n\n" +

"The mod also has a [#768bff]Discord server[] — you can find the link in the README file on the GitHub page.\n\n" +

"[red]THIS MOD IS STILL IN DEVELOPMENT![]\n" +
"At the moment, development is approximately [accent]52%[] complete and features [accent]12 fully polished sectors[].\n\n" +

"////////////////////////////////\n\n" +

"Land on a [#c9c1eb]subcryogenic terra[], gradually warming under its star, known as [#768bff]Gelion[].\n" +
"Your objective is to eliminate enemy forces on the planet, secure rare resources, and continue your expansion across the galaxy.\n\n" +

"Limited space and complex logistics present a serious challenge.\n" +
"[#fac5d3]Plan your production wisely![]\n\n" +

"If you enjoy the mod, consider giving it a star! >~<\n" +
"Thanks for playing!\n\n" +

"Special thanks to: [#bf92f9]ace1020spawn[white], [#ce7e5c]Kivet[#9b5e45]/БОБ[white], [#84f490]Alpotat[white], KO[#A4A4A4]STO[#6D6D6D]LOM [white], [#c1abd4]Fate of Adrastus[white], [#f7ba4c]garretski[white]";

mod.meta.author = "[#c3961f]Deer[#876409]Carbonate";

require("blocks");

const groundSnake = require("ground-snake");

const groundSnake = require("ground-snake");

const flagellantEnd = groundSnake.segment("flagellant-end", {
    health: 3000,
    armor: 20,
    hitSize: 9,
    speed: 1.6,
    legCount: 4,
    legLength: 9,
    legBaseOffset: 3,
    legSpeed: 0.25,
    legGroupSize: 2,
    allowLegStep: true,
    offsetSegment: 16
}, {});

const flagellantBody = groundSnake.segment("flagellant-body", {
    health: 1500,
    armor: 15,
    hitSize: 11,
    speed: 1.6,
    legCount: 6,
    legLength: 11,
    legBaseOffset: 4,
    legSpeed: 0.28,
    legGroupSize: 2,
    allowLegStep: true,
    offsetSegment: 16
}, {});

const flagellant = groundSnake.head("flagellant", {
    health: 5000,
    armor: 25,
    hitSize: 14,
    speed: 1.4,
    legCount: 4,
    legLength: 13,
    legBaseOffset: 5,
    legSpeed: 0.32,
    legGroupSize: 2,
    allowLegStep: true,
    body: flagellantBody,
    end: flagellantEnd,
    lengthSnake: 5
}, {});