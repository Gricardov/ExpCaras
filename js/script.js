$(document).ready(function () {

	$("#btnIniciar").click(function () {

		// Primero lo primero. Debe mostrarse el marco y ocultarse la pantalla de inicio	
		$("#inicio").hide();
		$("#marco").show();

		// El número de ensayos totales
		const numEnsayos = 20;

		// Constantes que definen el orden en que se encuentran los valores en el arreglo muestraIntervalo. NO TOCAR
		const MUESTRA = 0;
		const OCULTA = 1;

		// Constantes que definen los colores de fondo correctos
		const VERDE = 0;
		const ROJO = 1;

		// Constantes que guardan los resultados si fueron correctos o incorrectos
		const INCORRECTO = 0;
		const CORRECTO = 1;
		const NORESPUESTA = 2;

		// Arreglo que contiene las respuestas del usuario
		var resultadosSujeto = [];

		// Arreglo que contiene la información sobre muestras e intervalos por imágenes (ms). Formato: [MUESTRA, OCULTA]
		const muestraIntervalo = [[1500, 150], [1500, 900], [7500, 1400]];

		// Arreglo que contiene las respuestas correctas para compararlas
		const respuestas = ["E", "A", "D", "B", "B", "C", "E", "A", "B", "E", "B", "C", "D", "E", "E", "B", "A", "C", "D", "D"];

		// Arreglo que contiene los fondos de las imágenes correctas
		const fondosRespuestas = [VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE, VERDE];

		// Para obtener el ensayo actual
		var ensayoActual = 1;

		var resolvedor;

		// Inicia el experimento
		// Mila hermosa <3
		iniciar();

		async function iniciar() {

			while (ensayoActual <= numEnsayos) {

				// Elijo, por medio de azar, qué imágen se mostrará primero
				var orden;

				switch (obtenerAleatorio(1, 2)) {

					case 1:
						orden = [1, 2, 3];
						break;
					default:
						orden = [2, 1, 3];
				}

				// Itero el arreglo de órdenes (el tercero nunca cambiará de órden)		
				for (var i = 0; i < orden.length; i++) {

					// Envío el órden y el índice. El primero servirá como indicador de qué imágen debe mostrar y el segundo, será usado para hallar los tiempos correspondientes según muestraIntervalo
					await mostrar(orden[i], i);
					//pausar por cierto tiempo
					await ocultar(orden[i], i);

				}



				ensayoActual++;
			}

			// Cuando termina el bucle, muestra la ventana final
			$("#marco").hide();
			$("#fin").show();

		}

		function ocultar(orden, indice) {

			var tiempoMs = muestraIntervalo[indice][OCULTA];

			switch (indice + 1) {

				case 3:
					document.getElementById("resumen").style.display = "none";
					break;

				default:
					document.getElementById("imgprincipal").style.display = "none";


			}

			return new Promise(resolve => setTimeout(resolve, tiempoMs));
		}

		function mostrar(orden, indice) {

			var tiempoMs = muestraIntervalo[indice][MUESTRA];

			switch (indice + 1) {

				case 3:

					// En el caso de que sea la ventana de resumen, que muestre las caras de acuerdo al ensayo
					document.getElementById("A").src = "img/" + ensayoActual + "A.png";
					document.getElementById("B").src = "img/" + ensayoActual + "B.png";
					document.getElementById("C").src = "img/" + ensayoActual + "C.png";
					document.getElementById("D").src = "img/" + ensayoActual + "D.png";
					document.getElementById("E").src = "img/" + ensayoActual + "E.png";

					// Y este es el fondo
					var fondo = fondosRespuestas[ensayoActual - 1];

					switch (fondo) {

						case VERDE:
							document.getElementById("FONDO").src = "img/VERDE.png";
							break;
						default:
							document.getElementById("FONDO").src = "img/ROJO.png";

					}

					document.getElementById("resumen").style.display = "block";
					break;

				default:
					document.getElementById("imgprincipal").src = "img/" + ensayoActual + orden + ".png";
					document.getElementById("imgprincipal").style.display = "block";


			}

			//return new Promise(resolve => timeout=setTimeout(resolve, tiempoMs));
			return new Promise(function (resolve, reject) {
				// the function is executed automatically when the promise is constructed
				//$(".ruleta").click(function(){

				//	resolve("done");
				//});
				resolvedor = resolve;
				// after 1 second signal that the job is done with the result "done!"
				setTimeout(() => resolve("listo"), tiempoMs);
			});
		}

		function obtenerAleatorio(min, max) {
			max++;
			return Math.floor(Math.random() * (max - min)) + min;
		}

		function generarArchivo() {
			//alert(arregloInfoSujeto);

			var descripcion = "Datos: \r\n \r\n";

			for (i = 0; i < resultadosSujeto.length; i++) {

				var resultado;

				if (resultadosSujeto[i] == CORRECTO) {

					resultado = "Correcto";

				} else if (resultadosSujeto[i] == INCORRECTO) {

					resultado = "Incorrecto";

				} else {

					resultado = "No respondió";

				}

				descripcion += "Ensayo " + (i + 1) + " -> " + resultado + " \r\n";

			}

			var blob = new Blob([descripcion], { type: "text/plain;charset=utf-8" });
			saveAs(blob, "sujeto.txt");


		}

		$(".ruleta").mouseenter(function () {


			if ($(this).attr("id") != "FONDO") {

				document.getElementById("caramostrada").src = "img/" + ensayoActual + $(this).attr("id") + ".png";
				document.getElementById("caramostrada").style.display = "block";
			} else {

				document.getElementById("caramostrada").style.display = "none";

			}
		});

		$(".ruleta").mouseleave(function () {
			document.getElementById("caramostrada").style.display = "none";

		});

		$(".ruleta").click(function () {

			if ($(this).attr("id") == respuestas[ensayoActual - 1]) {

				resultadosSujeto[ensayoActual - 1] = CORRECTO;

			} else {

				resultadosSujeto[ensayoActual - 1] = INCORRECTO;


				//resultadosSujeto[ensayoActual-1]
				//document.getElementById("caramostrada").style.display = "none";
			}

			// Aquí pregunto si ha hecho clic sobre un lugar diferente del fondo. Si es así, que devuelva al promesa instantáneamente y pase al siguiente ensayo
			if ($(this).attr("id") != "FONDO") {

				resolvedor("listo");
				resolvedor("listo");
				resolvedor("listo");
			}

		});

		// Detecta cuando se pulsa el botón de descarga para generar el archivo
		$("#descarga").click(function (e) {

			generarArchivo();

		});

	});
});