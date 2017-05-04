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
            game.stage.backgroundColor = '#f27d0c';
            game.load.image('bola', 'assets/bola.png');
            game.load.image('corazon', 'assets/corazon.png');
        }

        function create() {
            scoreText = game.add.text(16, 16, puntuacion, {
                fontSize: '50px',
                fill: '#757676'
            });
            var spriteCorazon = game.add.sprite(16, alto - 66, 'corazon');
            lifeText = game.add.text(0, 0, vida, {
                fontSize: '50px',
                fill: '#757676'
            });
            lifeText.alignTo(spriteCorazon, Phaser.RIGHT_CENTER, 16);

            finText = game.add.text(ancho/2, alto/2, "", {
                fontSize: '70px',
                fill: '#757676', 
                align: "center"
            });
            finText.anchor.x = 0.5;
            finText.anchor.y = 0.5;
            soltarBola();
        }

        function soltarBola() {

            var sprite = game.add.sprite(app.inicioX(), 0, 'bola');

            //sprite.animations.add('walk');
            //sprite.animations.play('walk', 20, true);

            sprite.inputEnabled = true;
            sprite.input.useHandCursor = true;
            sprite.events.onInputDown.add(app.destroySprite, this);
            game.physics.arcade.enable(sprite);
            sprite.body.collideWorldBounds = true;
            sprite.body.onWorldBounds = new Phaser.Signal();
            sprite.body.onWorldBounds.add(app.decrementaVida, this);
            game.add.tween(sprite).to({
                y: game.height + (1600 + sprite.y)
            }, velocidad + app.numeroAleatorioHasta(1000), Phaser.Easing.Linear.None, true);

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
            finText.text = "Has obtenido " + puntuacion + " puntos.\n Agita para reiniciar";
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
            velocidad -= 500;
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
