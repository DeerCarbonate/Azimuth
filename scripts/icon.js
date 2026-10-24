const STATUSES = ["sbc-thermal-shock", "sbc-radiated"];

function registerContentIcon(type, name) {
    const c = Vars.content.getByName(type, name);
    if (c == null) return;
    if (String(c.emoji()).length > 0) return;

    const region = c.uiIcon;
    if (region == null || !region.found()) return;

    const cls = java.lang.Class.forName("mindustry.ui.Fonts", true, Vars.mods.mainLoader());
    const f = cls.getDeclaredField("unicodeIcons");
    f.setAccessible(true);
    const map = f.get(null);

    let max = 0xE000;
    const it = map.entries();
    while (it.hasNext) {
        const e = it.next();
        if (e.value > max && e.value < 0xF8FF) max = e.value;
    }
    Fonts.registerIcon(name, name, max + 1, region);
}

Events.on(ClientLoadEvent, () => {
    STATUSES.forEach(n => {
        try {
            registerContentIcon(ContentType.status, n);
        } catch (err) {
            Log.err("content-icons failed (" + n + "): " + err);
        }
    });
});