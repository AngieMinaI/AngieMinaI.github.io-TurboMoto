var juego; 
var vidas = 3; 
var contadorMotos = 0; 
var velocidadEnemigos = 200;

var PantallaInicio = {
    preload: function() {
        juego.load.image('bg', 'img/bg.png');
    },
    create: function() {
        juego.add.sprite(0, 0, 'bg');

        var titulo = juego.add.text(juego.world.centerX, 150, 'Turbo Moto', {
            font: '40px Arial',
            fill: '#ff0000'
        });
        titulo.anchor.setTo(0.5);

        var botonJugar = juego.add.text(juego.world.centerX, 350, 'Jugar', {
            font: '25px Arial',
            fill: '#ff0000',
            backgroundColor: '#007bff',
            padding: { x: 18, y: 7 }
        });
        botonJugar.anchor.setTo(0.5);
        botonJugar.inputEnabled = true;
        botonJugar.input.useHandCursor = true;
        botonJugar.events.onInputDown.add(this.iniciarJuego, this);
    },
    iniciarJuego: function() {
        juego.state.start('Juego');
    }
};

var Juego = {
    preload: function() {
        juego.load.image('fondocar1', 'img/fondocar1.png');
        juego.load.image('fondocar2', 'img/fondocar2.png');
        juego.load.image('moto', 'img/moto.png');
        juego.load.image('motomalo', 'img/motomalo.png');
        juego.load.image('barril', 'img/barril.png');
        
        // Cargar el audio de fondo
        juego.load.audio('musicaFondo', 'sound/audio2.mp3'); 
        // Cargar el efecto de sonido para colisiones
        juego.load.audio('sonidoColision', 'sound/colision2.mp3'); 
    },
    create: function() {
        fondo = juego.add.tileSprite(0, 0, 290, 540, 'fondocar1');
        moto = juego.add.sprite(juego.width / 2, 496, 'moto');
        moto.anchor.setTo(0.5);
        juego.physics.arcade.enable(moto);

        enemigos = juego.add.group();
        juego.physics.arcade.enable(enemigos, true);
        enemigos.enableBody = true;
        enemigos.createMultiple(20, 'motomalo');
        enemigos.setAll('anchor.x', 0.5);
        enemigos.setAll('anchor.y', 0.5);
        enemigos.setAll('outOfBoundsKill', true);
        enemigos.setAll('checkWorldBounds', true);

        enemigos.forEach(function(enemigo) {
            enemigo.haSalido = false;
            enemigo.events.onOutOfBounds.add(this.incrementarContadorMotos, this);
        }, this);

        barriles = juego.add.group();
        juego.physics.arcade.enable(barriles, true);
        barriles.enableBody = true;
        barriles.createMultiple(20, 'barril');
        barriles.setAll('anchor.x', 0.5);
        barriles.setAll('anchor.y', 0.5);
        barriles.setAll('outOfBoundsKill', true);
        barriles.setAll('checkWorldBounds', true);

        timer = juego.time.events.loop(1500, this.crearMotoMalo, this);
        timerBarriles = juego.time.events.loop(2000, this.crearBarril, this);
        cursores = juego.input.keyboard.createCursorKeys();

        vidasTexto = juego.add.text(10, 10, 'Vida: ' + vidas, {
            font: '20px Arial',
            fill: '#000080'
        });

        contadorTexto = juego.add.text(10, 40, 'Score: ' + contadorMotos, {
            font: '20px Arial',
            fill: '#000080'
        });

        // Reproducir audio de fondo
        this.musicaFondo = juego.add.audio('musicaFondo');
        this.musicaFondo.loop = true; // Habilitar bucle
        this.musicaFondo.play();

        // Almacenar el efecto de sonido de colisión
        this.sonidoColision = juego.add.audio('sonidoColision');
    },
    update: function() {
        fondo.tilePosition.y += 3;

        if (cursores.right.isDown && moto.position.x < 245) {
            moto.position.x += 5;
        } else if (cursores.left.isDown && moto.position.x > 45) {
            moto.position.x -= 5;
        }

        juego.physics.arcade.overlap(moto, enemigos, this.colision, null, this);
        juego.physics.arcade.overlap(moto, barriles, this.colision, null, this);
    },
    crearMotoMalo: function() {
        var posicion = Math.floor(Math.random() * 3) + 1;
        var enemigo = enemigos.getFirstDead();
        enemigo.physicsBodyType = Phaser.Physics.ARCADE;
        enemigo.reset(posicion * 73, 0);
        enemigo.body.velocity.y = velocidadEnemigos;
        enemigo.anchor.setTo(0.5);
    },
    crearBarril: function() {
        var posicion = Math.floor(Math.random() * 3) + 1;
        var barril = barriles.getFirstDead();
        barril.physicsBodyType = Phaser.Physics.ARCADE;
        barril.reset(posicion * 73, 0);
        barril.body.velocity.y = velocidadEnemigos;
        barril.anchor.setTo(0.5);
    },
    incrementarContadorMotos: function(enemigo) {
        if (enemigo.y > juego.world.height) { 
            contadorMotos++;
            contadorTexto.text = 'Score: ' + contadorMotos; 
            
            if (contadorMotos >= 3 && contadorMotos < 6) {
                fondo.loadTexture('fondocar2');
                velocidadEnemigos = 400;
            }

            if (contadorMotos >= 6) {
                juego.state.start('Ganaste');
            }
        }
        enemigo.kill();
    },
    colision: function(moto, objeto) {
        vidas--;
        vidasTexto.text = 'Vidas: ' + vidas;
        objeto.kill();

        // Reproducir sonido de colisión
        this.sonidoColision.play();

        if (vidas <= 0) {
            juego.state.start('GameOver');
            alert('Vuelva a intentarlo');
        }
    }
};

// Estado de Game Over
var GameOver = {
    create: function() {
        var mensaje = juego.add.text(juego.world.centerX, juego.world.centerY, 'Vuelva a intentarlo!', {
            font: '30px Arial',
            fill: '#fff'
        });
        mensaje.anchor.setTo(0.5);

        var reiniciarTexto = juego.add.text(juego.world.centerX, juego.world.centerY + 50, 'Presione "R" para reiniciar', {
            font: '20px Arial',
            fill: '#fff'
        });
        reiniciarTexto.anchor.setTo(0.5);

        var teclaR = juego.input.keyboard.addKey(Phaser.Keyboard.R);
        teclaR.onDown.add(this.reiniciarJuego, this);
    },
    reiniciarJuego: function() {
        vidas = 3;
        contadorMotos = 0;
        juego.state.start('PantallaInicio');
    }
};

// Estado de Ganaste
var Ganaste = {
    create: function() {
        var mensaje = juego.add.text(juego.world.centerX, juego.world.centerY, '¡Ganaste!', {
            font: '30px Arial',
            fill: '#fff'
        });
        mensaje.anchor.setTo(0.5);

        var reiniciarTexto = juego.add.text(juego.world.centerX, juego.world.centerY + 50, 'Presione "R" para reiniciar', {
            font: '20px Arial',
            fill: '#fff'
        });
        reiniciarTexto.anchor.setTo(0.5);

        var teclaR = juego.input.keyboard.addKey(Phaser.Keyboard.R);
        teclaR.onDown.add(this.reiniciarJuego, this);
    },
    reiniciarJuego: function() {
        vidas = 3;
        contadorMotos = 0;
        juego.state.start('PantallaInicio');
    }
};

// Inicializar los estados del juego
juego.state.add('PantallaInicio', PantallaInicio);
juego.state.add('Juego', Juego);
juego.state.add('GameOver', GameOver);
juego.state.add('Ganaste', Ganaste);

juego.state.start('PantallaInicio');
