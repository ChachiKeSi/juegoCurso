var app = {
    inicio: function () {
        DIAMETRO_BOLA = 50;
        velocidad = 20000;
        puntuacion = 0;
        vida = 100;
        total = 0;
        timer = 0;

        alto = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;

        var estados = {
            preload: preload,
            create: create,
            update: update
        };
        var game = new Phaser.Game(ancho, alto, Phaser.AUTO, 'juego-jgb', estados);

        function preload() {
            //game.stage.backgroundColor = '#f27d0c';
            game.load.image('bola', 'assets/echando50.png');
            game.load.image('corazon', 'assets/corazon.png');
            game.load.image('cesped', 'assets/cesped.jpg');
            game.load.image('piscina', 'assets/piscina100.jpg');
            var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
    admobid = {
      banner: 'ID del bloque de anuncios: ca-app-pub-9210522881944532/3939737649', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9210522881944532~2463004443'
    };
  }
        }

        function create() {
            game.add.tileSprite(0, 0, ancho, alto, 'cesped');
            game.add.tileSprite(0, alto-75, ancho, 100, 'piscina');
            scoreText = game.add.text(16, 16, puntuacion, {
                fontSize: '50px',
                fill: '#fff'
            });
            scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            var spriteCorazon = game.add.sprite(16, alto - 66, 'corazon');
            lifeText = game.add.text(0, 0, vida, {
                fontSize: '50px',
                fill: '#000'
            });
            lifeText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            lifeText.alignTo(spriteCorazon, Phaser.RIGHT_CENTER, 16);

            finText = game.add.text(ancho/2, alto/2, "", {
                fontSize: '20px',
                fill: '#fff', 
                align: "center"
            });
            finText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            finText.anchor.x = 0.5;
            finText.anchor.y = 0.5;
            soltarBola();
        }

        function soltarBola() {

            var sprite = game.add.sprite(app.inicioX(), 0, 'bola');

            //sprite.animations.add('walk');
            //sprite.animations.play('walk', 20, true);

            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(app.destroySprite, this);
            game.physics.arcade.enable(sprite);
            sprite.body.collideWorldBounds = true;
            sprite.body.onWorldBounds = new Phaser.Signal();
            sprite.body.onWorldBounds.add(app.decrementaVida, this);
            game.add.tween(sprite).to({
                y: game.height + (1600 + sprite.y)
            }, velocidad + app.numeroAleatorioHasta(10000), Phaser.Easing.Linear.None, true);

            total++;
            timer = game.time.now + 100;
        }

        function update() {
            if (vida > 0 && total < 6 && game.time.now > timer) {
                soltarBola();
            }
        }
    },

    destroySprite: function (sprite) {
        sprite.destroy();
        app.sumaPuntos();
        total--;
    },

    decrementaVida: function (sprite) {
        if (vida > 0)
            vida = vida - 5;
        if (vida <= 0) {
            // preppare and load ad resource in background, e.g. at begining of game level
if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );

// show the interstitial later, e.g. at end of game level
if(AdMob) AdMob.showInterstitial();
            finText.text = "La has liado parda.\nHas obtenido " + puntuacion + " puntos.\n Pulsa aquí para reiniciar";
            finText.inputEnabled = true;
            finText.events.onInputDown.add(app.recomienza, this);
            //app.vigilaSensores();
        }
        lifeText.text = vida;
        total--;
        sprite.destroy();
    },

    sumaPuntos: function () {
        if (vida > 0) {
            puntuacion++;
            scoreText.text = puntuacion;
            velocidad -= 100;
        }
    },

    inicioX: function () {
        return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
    },

    inicioY: function () {
        return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
    },

    numeroAleatorioHasta: function (limite) {
        return Math.floor(Math.random() * limite);
    },

    vigilaSensores: function () {

        function onError() {
            console.log('onError!');
        }

        function onSuccess(datosAceleracion) {
            app.detectaAgitacion(datosAceleracion);
        }

        navigator.accelerometer.watchAcceleration(onSuccess, onError, {
            frequency: 10
        });
    },

    detectaAgitacion: function (datosAceleracion) {
        var agitacionX = datosAceleracion.x < -10;
        var agitacionY = datosAceleracion.y < -10;

        if (agitacionX || agitacionY) {
            setTimeout(app.recomienza, 1000);
        }
    },

    recomienza: function () {
        document.location.reload(true);
    },
};

/*if ('addEventListener' in document) {
    document.addEventListener('deviceready', function () {
        app.inicio();
    }, false);
}*/
app.inicio();
