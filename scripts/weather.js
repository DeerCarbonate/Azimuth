Events.on(ClientLoadEvent, () => {
	if(Vars.state.planet == null || Vars.state.planet.name != "azimut-gelion") return;
	
    const db = Vars.ui.database;
    var status = new Stat("TERRAstatus", StatCat.function);
    var wind = new Stat("TERRAwind", StatCat.function);
    var liquid = new Stat("TERRAliquid", StatCat.function);
    var attrs = new Stat("TERRAattrs", StatCat.function);

    Vars.content.getBy(ContentType.weather).each(w => {
        if (!w.uiIcon || !w.uiIcon.found()) w.uiIcon = Core.atlas.find("clear");

        if (w.status && w.status != StatusEffects.none) {
            w.stats.add(status, extend(StatValue, {
                display: function(t) {
                    t.image(w.status.uiIcon).size(20).padRight(2);
                    t.add(w.status.localizedName);
                }
            }));
        }
        if (w instanceof ParticleWeather && w.force > 0) {
            w.stats.add(wind, w.force, StatUnit.tilesSecond);
        }
        
        if (w instanceof RainWeather && w.liquid != null) {
            w.stats.add(liquid, extend(StatValue, {
                display: function(t) {
                    t.image(w.liquid.uiIcon).size(20).padRight(2);
                    t.add(w.liquid.localizedName);
                }
            }));
        }
        
        var hasAttrs = false;
        for(var i = 0; i < Attribute.all.length; i++) {
            if(w.attrs.get(Attribute.all[i]) != 0) { hasAttrs = true; break; }
        }

        if(hasAttrs){
            w.stats.add(attrs, extend(StatValue, {
                display: function(t) {
                    t.row(); 
                    
                    var inner = t.table().get();
                    inner.left().defaults().left().padLeft(10); 
            
                    var allAttrs = Attribute.all;
                    for(var i = 0; i < allAttrs.length; i++){
                        var attr = allAttrs[i];
                        var val = w.attrs.get(attr);
                        if(val == 0) continue;
            
                        inner.add("[lightgray]- " + attr + ": [white]" + (val > 0 ? "+" : "") + Math.round(val * 100) + "%").row();
                    }
                }
            }));
        }
    });

    db.shown(run(() => {
        let scroll = db.cont.getChildren().get(1);
        let mainTable = scroll.getWidget();

        if(!mainTable || mainTable.find("exp-weather-section") != null) return;

        mainTable.row();
        mainTable.add(Core.bundle.get("rules.weather")).color(Pal.accent).left().padTop(0).name("exp-weather-section").row();
        mainTable.image(Tex.whiteui).color(Pal.accent).fillX().height(3).padTop(4).padBottom(10).row();

        mainTable.table(cons(list => {
            list.left();
        
            let cols = Math.floor(Math.max((Core.graphics.getWidth() - Scl.scl(30)) / Scl.scl(32 + 12), 1));
            let count = 0;
        
            Vars.content.each(cons(w => {
                if(!(w instanceof Weather)) return;

                let img = new Image(w.uiIcon);
                img.setColor(Color.lightGray);
                img.setScaling(Scaling.fit);

                let listener = new ClickListener();
                img.addListener(listener);
                img.addListener(new HandCursorListener());
                
                img.update(run(() => {
                    img.color.lerp(!listener.isOver() ? Color.lightGray : Color.white, Math.min(0.4 * Time.delta, 1));
                }));
        
                img.clicked(run(() => Vars.ui.content.show(w)));
                
                img.addListener(new Tooltip(cons(t => {
                    t.background(Tex.button).add(w.localizedName + (Core.settings.getBool("console") ? "\n[gray]" + w.name : ""));
                })));
        
                list.add(img).size(8 * 4).pad(3);
                if(++count % cols == 0) list.row();
            }));
        })).left().padBottom(30).row();
    }));
});