var juego = new Phaser.Game(290, 540, Phaser.CANVAS, 'bloque_juego');


juego.state.add('PantallaInicio', PantallaInicio);
juego.state.add('Juego', Juego);
juego.state.add('GameOver', GameOver);
juego.state.add('Ganaste', Ganaste); 

juego.state.start('PantallaInicio');
