    Window.Game.framesPerSecond = framesPerSecond;
    Window.Game.eatApple = eatApple;
    Window.Game.pauze = new Proxy(this, {
        get: function() {
            return pauze;
        }
    })
    Window.Game.score = new Proxy(this, {
        get: function(){
            return score;
        }
    });
