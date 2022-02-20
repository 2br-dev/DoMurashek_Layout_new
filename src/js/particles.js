var p;

// Необходимые математические функции
var Math2 = {
	random: (t, n) => {
		return Math.random() * (n - t) + t
	},
	map: (t, n, r, a, o) => {
		return (o - a) * ((t - n) / (r - n)) + a
	},
	randomPlusMinus: t => {
		return t = t ? t : .5, Math.random() > t ? -1 : 1
	},
	randomInt: (t, n) => {
		return n += 1, Math.floor(Math.random() * (n - t) + t)
	},
	randomBool: t => {
		return t = t ? t : .5, Math.random() < t ? !0 : !1
	},
	degToRad: t => {
		return rad = t * Math.PI / 180, rad
	},
	radToDeg: t => {
		return rad = t * Math.PI / 180, rad
	},
	rgbToHex: t => {
		function n(t) {
			return ("0" + parseInt(t).toString(16)).slice(-2)
		}
		t = t.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		var r = n(t[1]) + n(t[2]) + n(t[3]);
		return parseInt('0X' + r.toUpperCase())
	},
	distance: (t, n, r, a) => {
		return Math.sqrt((r - t) * (r - t) + (a - n) * (a - n))
	}
}

class ParticlesApp{

	// Параметры, задаваемые настройками
	canvasWidth; //Ширина холста
	canvasHeight; //Высота холста
	container; //Контейнер
	stageTransparent = true; //Прозрачность сцены
	stageColor = 0XCCCCCC; //Цвет сцены (если не прозрачная)
	particleData = []; //Данные картинок (массив экземпляров класса ParticleData)
	interactionRadius = 120; //Радиус взаимодействия (px)
	waveSpeedMultiplier; // Умножитель скорости волны
	
	// Внутренние переменные
	canvasEl; //HTMLCanvasElement
	renderer; //PIXIRenderer
	stage; //PIXIStage
	waveX = -400; // Позиция "волны"
	
	// Расположение курсора
	mousePos = {
		x: 0,
		y: 0
	}

	// Масштаб
	scale = 1

	isplaying = true;

	/**
	 * 
	 * @param {*} canvasWidth Ширина холста
	 * @param {*} canvasHeight Высота холста
	 * @param {*} canvasID ID холста
	 * @param {*} container селектор контейнера холста
	 * @param {*} stageColor цвет сцены
	 * @param {*} stageTransparent прозрачность сцены
	 * @param {*} particleData данные картинок
	 */
	constructor(
		canvasWidth, 
		canvasHeight, 
		canvasID,
		container,
		particleData,
		stageColor = null,
		stageTransparent = null,
		interactionRadius = 120,
		waveSpeedMultiplier = 5
	){

		// Инициализация свойств
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.canvasID = canvasID;
		this.container = document.querySelector(container);
		this.stageTransparent = !stageTransparent ? this.stageTransparent : stageTransparent;
		this.stageColor = !stageColor ? this.stageColor : stageColor;
		this.particleData = !particleData ? this.particleData : particleData;
		this.interactionRadius = !interactionRadius ? this.interactionRadius : interactionRadius;
		this.waveSpeedMultiplier = waveSpeedMultiplier;
		
		// Запуск инициализации холста
		this.canvas_init();

		var canvasElement = document.querySelector('#' + this.canvasID);
		this.scale = canvasElement.clientWidth / this.canvasWidth

		window.onmousemove = this.updateCursor;

		window.onresize = () => {
			this.particleData.forEach(data => {
				while(this.stage.children[0]){
					this.stage.removeChild(this.stage.children[0])
				}
				data.particles = [];

				var canvasElement = document.querySelector('#' + this.canvasID);
				this.scale = canvasElement.clientWidth / this.canvasWidth

				this.placeParticles(data);
			});
		};

		// Размещение изображения и частиц на нём
		this.particleData.forEach(data => {
			this.placeParticles(data);
		});

		this.update();
	}

	// Инициализация холста
	canvas_init = () => {

		this.canvasEl = document.createElement('canvas'),{
			width: this.canvasWidth,
			height: this.canvasHeight,
		}
		this.renderer = new PIXI.autoDetectRenderer(
			this.canvasWidth,
			this.canvasHeight,
			{
				transparent: true,
			}
		);
		this.container.appendChild(this.renderer.view).id=this.canvasID;
		this.stage = new PIXI.Stage(this.stageColor);
		
	}

	// Обновление положения курсора
	updateCursor = e => {
		e = e || window.event;

		var canvas = document.querySelector('#' + this.canvasID);
		var rect = canvas.getBoundingClientRect();

		var percentX = (e.pageX / (window.innerWidth - (rect.left / 2)))
		var percentY = (e.pageY / (window.innerHeight - (rect.top / 2)))

		this.mousePos = {
			x: this.canvasWidth * percentX,
			y: this.canvasHeight * percentY 
		}
	}

	// Размещение частиц по поверхности изображений,
	// расположенных на холсте
	placeParticles = particleData => {

		var imageObj = new Image();

		// Корректировка с учётом масштаба;
		var canvas = document.querySelector('#' + this.canvasID);

		imageObj.onload = function() {

			var canvas = document.createElement("canvas");
			canvas.width = this.base.canvasWidth;
			canvas.height = this.base.canvasHeight;

			var context = canvas.getContext("2d");
			context.clearRect(0,0,canvas.width, canvas.height);
			
			// Отрисовка изображения
			context.drawImage(
				this.image, 
				0, 
				0, 
				canvas.width,
				canvas.height,
			);

			// Считывание данных холста
			var imageData = context.getImageData(
				0,
				0,
				canvas.width,
				canvas.width,
			);

			var data = imageData.data;

			// Цикл по точкам
			for (var i = 0; i < imageData.height; i += this.particleInfo.particleDensity) {

				for (var j = 0; j < imageData.width; j += this.particleInfo.particleDensity) {

					// Получение цвета пикселя
					var color = data[((j * (imageData.width * 4)) + (i * 4)) - 1];

					if(color === 255){

						var p = this.base.particle(
							this.particleInfo.particleColor,
							this.particleInfo.particleAlphaAmplitude,
							this.particleInfo.particleRadiusAmplitude,
							this.particleInfo.movementRadius,
							this.particleInfo.movementSpeed
						)

						p.setPosition(i, j);
						this.particleInfo.particles.push(p);
						this.base.stage.addChild(p);
					}
				}
			}
		}.bind({
			base: this, 
			image: imageObj, 
			particleInfo: particleData
		});

		imageObj.src = particleData.imageUrl
	}

	// Описание частицы
	/**
	 * @particleColor Цвет частицы
	 * @particleAlphaAmplitude Амплитуда прозрачности (0…50…100)
	 * @particleRadiusAmplitude Амплитуда радиуса (0….5…1)
	 * @movementRadius Радиус окружности по которой происходит движение
	 * @movementSpeed Скорость движения
	 */
	particle = (
		particleColor,
		particleAlphaAmplitude, 
		particleRadiusAmplitude,
		movementRadius,
		movementSpeed
	) => {

		var $this = new PIXI.Graphics()

		$this.beginFill(particleColor);

		var radius;
		$this.radius = radius = Math.random() * 3;
	
		$this.drawCircle(0, 0, radius);
	
		$this.size = radius;
		$this.movementRadius = movementRadius;
		$this.movementSpeed = movementSpeed;
		$this.x = -$this.width;
		$this.y = -$this.height;
		$this.free = false;
	
		$this.timer = Math2.randomInt(0, 100);
		$this.v = Math2.random(particleRadiusAmplitude, 1) * Math2.randomPlusMinus();
		$this.hovered = false
	
		$this.alpha = Math2.randomInt(particleAlphaAmplitude, 100) / 100;
	
		$this.setPosition = function (x, y) {
			$this.x = x;
			$this.y = y;
		};
	
		return $this;
	}

	// Анимация
	update = () => {

		if(!this.isplaying){
			return;
		}
		
		this.renderer.render(this.stage);
		this.waveX += this.waveSpeedMultiplier;

		if(this.waveX >= 5000){
			this.waveX = -400;
		}

		this.particleData.forEach(data => {

			data.particles.forEach(p => {

				let m = this.mousePos;
				let ir = this.interactionRadius;
				let coords;

				let fixedPos = {
					x: this.waveX,
					y: this.canvasHeight / 2
				}

				if(data.isInteractive){
					coords = m;
				}else{
					coords = fixedPos;
				}

				p.scale.x = p.scale.y = Math.max(Math.min(4 - (Math2.distance(p.x, p.y, coords.x, coords.y) / ir), ir), 1);
				p.x += Math.sin(p.timer * (1 * p.movementSpeed)) * (p.movementRadius * p.movementSpeed)
				p.y += Math.cos(p.timer * (1 * p.movementSpeed)) * (p.movementRadius * p.movementSpeed)
				p.timer += p.v;
			});
		});

		window.requestAnimationFrame(this.update);
	}

	stop(){
		this.isplaying = false;
	}

	start(){
		this.isplaying = true;
		this.update();
	}

}

class ParticleData{

	imageUrl;
	particleDensity;
	particleRadiusAmplitude = .5; // Амплитуда радиуса (0….5…1)
	particleColor = 0XFFFFFF; //Цвет частиц
	particleAlphaAmplitude = 0; //Амплитуда прозрачности частиц (0…50…100)
	imageData;
	particles = [];
	movementRadius;
	movementSpeed;
	isInteractive;

	/**
	 * 
	 * @imageUrl URL картинки
	 * @particleDensity плотность частиц
	 * @particleRadiusAmplitude амплитуда радиуса частиц
	 * @particleAlphaAmplitude амплитуда прозрачности частиц
	 * @particleColor цвет частиц
	 * @movementRadius радиус окружности по которой идёт движение частиц
	 * @movementSpeed скорость движения частиц
	 * @isInteractive Интерактивность системы частиц
	 */
	constructor(
		imageUrl,
		particleDensity,
		particleRadiusAmplitude,
		particleAlphaAmplitude,
		particleColor,
		movementRadius,
		movementSpeed,
		isInteractive = false
	){
		this.imageUrl = imageUrl ? imageUrl : this.imageUrl;
		this.particleDensity = particleDensity ? particleDensity : this.particleDensity;
		this.particleRadiusAmplitude = particleRadiusAmplitude ? particleRadiusAmplitude : this.particleRadiusAmplitude;
		this.particleAlphaAmplitude = particleAlphaAmplitude ? particleAlphaAmplitude : this.particleAlphaAmplitude;
		this.particleColor = particleColor ? particleColor : this.particleColor;
		this.movementRadius = movementRadius ? movementRadius : this.movementRadius;
		this.movementSpeed = movementSpeed ? movementSpeed : this.movementSpeed;
		this.isInteractive = isInteractive;
	}
}