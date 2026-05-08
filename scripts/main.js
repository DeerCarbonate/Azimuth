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
require("weather");
const BulletHitBuildingEvent = mindustry.game.EventType.BulletHitBuildingEvent;
const ClientLoadEvent = mindustry.game.EventType.ClientLoadEvent;

let legateBullet = null;

Log.info("[AZIMUTH] script loaded"); // это должно появиться сразу при старте

Events.on(ClientLoadEvent, () => {
    const legate = Vars.content.unit("legate");
    if(legate && legate.weapons.size > 0){
        legateBullet = legate.weapons.get(0).bullet;
        Log.info("[AZIMUTH] legateBullet loaded: " + legateBullet);
    } else {
        Log.warn("[AZIMUTH] legate unit NOT found!");
    }
});

Events.on(BulletHitBuildingEvent, (e) => {
    if(legateBullet && e.bullet.type === legateBullet){
        Log.info("[AZIMUTH] hit event fired, spawning fire-missile");
        Vars.content.unit("fire-missile").spawn(e.bullet.team, e.bullet.x, e.bullet.y);
    }
});