var snowflakes = {
	params: {
		FlakeNumber: 10,
		Size: 20,
		SizeVariation: 10,
		Velocity: 8,
		VelocityVariation: 4,
		VelocityFactor: 100,
		WindDirection: "alternate", //["left", "right", "alternate", "none"]
		WindVelocity: 4,
		WindSwingTime: 4000,
		FlakeStyle: 0
	},

	flakeStyles: [
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><polygon id="christmas-snowflake-icon" points="441.535,346.644 373.955,307.624 438.697,290.354 431.342,262.782 338.967,287.424   284.535,255.999 339.49,224.271 431.299,249.242 438.787,221.705 374.311,204.168 441.535,165.356 427.266,140.644 359.686,179.66   377.1,114.956 349.545,107.541 324.697,199.861 270.27,231.285 270.27,167.831 337.797,100.809 317.695,80.554 270.27,127.624   270.27,50 241.732,50 241.732,128.036 194.404,80.604 174.203,100.76 241.732,168.438 241.732,231.286 186.779,199.558   162.498,107.565 134.906,114.847 151.957,179.455 84.732,140.644 70.465,165.356 138.045,204.373 73.303,221.645 80.66,249.218   173.035,224.574 227.465,255.999 172.51,287.727 80.701,262.758 73.211,290.293 137.688,307.832 70.465,346.644 84.732,371.356   152.312,332.337 134.898,397.042 162.457,404.459 187.303,312.137 241.732,280.711 241.732,344.169 174.203,411.191   194.307,431.446 241.732,384.376 241.732,462 270.27,462 270.27,383.964 317.598,431.396 337.797,411.24 270.27,343.562   270.27,280.712 325.223,312.439 349.502,404.435 377.094,397.15 360.043,332.545 427.268,371.356 "/></svg>',
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><path id="christmas-snowflake-2-icon" d="M440.161,349.025l-31.736-18.323l31.188-8.562l-5.863-21.56l-52.587,14.38l-20.951-12.096  l67.591-18.314l-5.865-21.559l-88.987,24.133c-23.614-13.633-23.624-48.611-0.001-62.25l88.988,24.134l5.863-21.56l-67.59-18.314  l20.951-12.096l52.587,14.38l5.864-21.56l-31.188-8.561l31.735-18.323l-11.519-19.95l-31.735,18.322l8.179-31.29l-21.604-5.702  l-13.839,52.731l-20.951,12.097l17.935-67.692l-21.604-5.701l-23.592,89.133c-25.807,14.898-53.911-2.8-53.911-31.125l65.396-64.999  L317.175,92.94l-49.656,49.379v-24.193l38.747-38.351l-15.739-15.858l-23.008,22.729V50h-23.037v36.646l-23.008-22.729  l-15.739,15.858l38.747,38.351v24.193L194.825,92.94l-15.739,15.858l65.396,64.999c0,28.651-28.235,45.949-53.911,31.125  l-23.592-89.133l-21.604,5.701l17.935,67.692l-20.951-12.097l-13.839-52.731l-21.604,5.702l8.179,31.29l-31.735-18.322  l-11.519,19.95l31.735,18.323l-31.188,8.561l5.864,21.56l52.587-14.38l20.951,12.096L84.2,227.449l5.863,21.56l88.988-24.134  c23.207,13.398,26.575,46.906-0.001,62.25l-88.987-24.133l-5.865,21.559l67.591,18.314l-20.951,12.096l-52.587-14.38l-5.863,21.56  l31.188,8.562l-31.736,18.323l11.519,19.95l31.736-18.322l-8.179,31.289l21.603,5.702l13.839-52.732l20.952-12.096l-17.935,67.692  l21.603,5.701l23.594-89.133c25.531-14.74,53.911,2.38,53.911,31.125l-65.396,64.999l15.739,15.858l49.656-49.379v24.193  l-38.747,38.351l15.739,15.858l23.008-22.729V462h23.037v-36.646l23.008,22.729l15.739-15.858l-38.747-38.351v-24.193l49.656,49.379  l15.739-15.858l-65.396-64.999c0-29.077,28.508-45.792,53.911-31.125l23.594,89.133l21.603-5.701l-17.935-67.692l20.952,12.096  l13.839,52.732l21.603-5.702l-8.179-31.289l31.736,18.322L440.161,349.025z M292.796,277.244L256,298.488l-36.796-21.244v-42.488  L256,213.512l36.796,21.244V277.244z"/></svg>'
	],

	flakes: [],
	flakeContainer: null,

	time: {
		start: null,
		last: null,
		total: 0
	},

	windDirection: function() {
		switch(this.params.WindDirection) {
			case "left":
				return -1;
			case "right":
				return 1;
			case "alternate":
				return Math.cos(Math.PI / this.params.WindSwingTime * (this.time.last - this.time.start));
			default:
				return 0;
		}
	},

	randomizeFlake: function(flake) {
		flake.velocity = (this.params.Velocity -this.params.VelocityVariation + Math.random()*(2*this.params.VelocityVariation))/this.params.VelocityFactor;
		flake.size = (this.params.Size-this.params.SizeVariation) + Math.random()*(2 * this.params.SizeVariation);
		flake.style.width = flake.size + "px";
		flake.style.height = flake.size + "px";
		flake.style.left = this.flakeContainer.clientWidth * Math.random() + "px";
		flake.style.top = (-1 * (this.params.Size + this.params.SizeVariation) - Math.random()*100) + "px";
		console.log(flake.style.top);
		flake.style.transform = "rotate(" + (60 * Math.random()) + "deg)";
	},

	init: function() {
		this.flakeContainer = document.createElement("div");
		this.flakeContainer.className = "snowflakes";

		document.body.appendChild(this.flakeContainer);

		this.flakes = [];

		for(var i=0;i<this.params.FlakeNumber;i++)
		{
			var flake = document.createElement("div");

			this.randomizeFlake(flake);

			var top = Math.random() * this.flakeContainer.clientHeight;//(-1 * this.params.SizeMax - Math.random() * this.flakeContainer.clientHeight);

			flake.style.top = top + "px";

			flake.innerHTML = this.flakeStyles[this.params.FlakeStyle];
			this.flakes.push(flake);
			this.flakeContainer.appendChild(flake);
		}

		this.flakeContainer.style.opacity = 1;

		window.requestAnimationFrame(snowflakes.nextFrame);
	},

	nextFrame: function(currentTime) {
		var time = snowflakes.time;
		if(!time.start){time.start=currentTime;}
  			if(!time.last){time.last=currentTime;}
  				time.total=(currentTime-time.start);

  		var delta = currentTime - time.last;


  		var log = document.getElementById("log");
  		if(parseInt(delta)!=0){
			log.innerHTML = parseInt(1000/parseInt(delta)) + " FPS<br/>";
  		}

  		for(var i =0;i<snowflakes.flakes.length;i++) {
  			//log.innerHTML +=  i + " " + snowflakes.flakes[i].velocity + " " + (parseInt(snowflakes.flakes[i].style.top) + snowflakes.flakes[i].velocity * delta) + "<br/>";
  			var top = (parseFloat(snowflakes.flakes[i].style.top) + snowflakes.flakes[i].velocity * delta);
  			//console.log( snowflakes.windDirection());
  			var left = (parseFloat(snowflakes.flakes[i].style.left) + snowflakes.params.WindVelocity * delta / snowflakes.params.VelocityFactor * (0.5 + 0.5 * Math.random()) * snowflakes.windDirection());

  			if(top<= snowflakes.flakeContainer.clientHeight){
	  			snowflakes.flakes[i].style.top = top + "px";
	  			snowflakes.flakes[i].style.left = left + "px";
  			}
	  		else{
	  			snowflakes.randomizeFlake(snowflakes.flakes[i]);
	  		}
  		}

1
  		time.last = currentTime;

		window.requestAnimationFrame(snowflakes.nextFrame);
	},

	stop: function() {

	},

	start: function() {
		this.init();
	}



}