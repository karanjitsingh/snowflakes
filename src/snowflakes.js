var snowflakes = {
	params: {
		Flakes: {
			Count: 30,
			Size: 20,
			SizeVariation: 10,
			Velocity: 8,
			VelocityVariation: 4,
			VelocityFactor: 100
		},
		WindDirection: "alternate", //["left", "right", "alternate", "none"]
		WindVelocity: 4,
		WindSwingTime: 4000,
		FlakeImageUrl: "flake.svg"
	},

	flakes: [],
	flakeContainer: null,
	flakeImage: null,

	state: "",

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
		//Random value in [Vmin, Vmax]
		//Velocity is divided by scaling factor for smoothing/scalable units
		flake.velocity = (this.params.Flakes.Velocity -this.params.Flakes.VelocityVariation + Math.random()*(2*this.params.Flakes.VelocityVariation))/this.params.Flakes.VelocityFactor;
		flake.size = (this.params.Flakes.Size-this.params.Flakes.SizeVariation) + Math.random()*(2 * this.params.Flakes.SizeVariation);
		flake.x = document.body.clientWidth * Math.random();

		//Keep the flake above client window. Keeps flake from randomly popping on screen when randomized
		flake.y = (-1 * (this.params.Flakes.Size + this.params.Flakes.SizeVariation) - Math.random()*100);
		flake.rotate = 60 * Math.random();
	},

	init: function() {
		if(this.state != "")
			return;

		this.flakeContainer = document.getElementsByClassName("snowflakes")[0];


		//Use the same canvas if it exists in code else create a new one
		if(!this.flakeContainer || this.flakeContainer.tagName != "CANVAS") {
			this.flakeContainer = document.createElement("canvas");
			this.flakeContainer.className = "snowflakes";
			document.body.appendChild(this.flakeContainer);
		}
		
		this.flakeContainer.style.opacity = 0;
		this.flakeContainer.style.display = "none";
		this.flakeContainer.width = document.body.clientWidth;
		this.flakeContainer.height = document.body.clientHeight;

		//Just in case CSS `pointer-event: none;` doesn't work this is a fallback option so that the site remains functional 
		this.flakeContainer.onclick = snowflakes.stop;

		this.flakes = [];

		this.flakeImage = new Image();
		this.flakeImage.loaded = false; 

		this.flakeImage.onload = function() {
			snowflakes.flakeImage.loaded = true;
		}

		this.flakeImage.src = this.params.FlakeImageUrl;
		for(var i=0; i<this.params.Flakes.Count; i++)
		{
			var flake = new Object();
			this.randomizeFlake(flake);

			//Scatter flakes throughout window for more randomness. Decreases clustering on init
			flake.y = Math.random() * this.flakeContainer.height;
			this.flakes.push(flake);
		}
		this.state = "initialized";
	},


	//Canvas image draw
	drawFlake: function(flake) {
		var ctx = snowflakes.flakeContainer.getContext("2d");
		ctx.save();
		ctx.translate(flake.x,flake.y);
		ctx.translate(flake.size/2,flake.size/2);
		ctx.rotate(flake.rotate / Math.PI);
		ctx.drawImage(snowflakes.flakeImage,0,0,flake.size,flake.size);
		ctx.restore();
	},

	nextFrame: function(currentTime) {
		if(snowflakes.state != "running")
			return;

		//To update velocity according to frame rate
		var time = snowflakes.time;
		if(!time.start){time.start=currentTime;}
			if(!time.last){time.last=currentTime;}
				time.total=(currentTime-time.start);

		var delta = currentTime - time.last;

		var ctx = snowflakes.flakeContainer.getContext("2d");
		ctx.clearRect(0,0,parseInt(snowflakes.flakeContainer.width),parseInt(snowflakes.flakeContainer.height));

		for(var i =0;i<snowflakes.flakes.length;i++) {

			//pos = pos + v * delta
			var top = (parseFloat(snowflakes.flakes[i].y) + snowflakes.flakes[i].velocity * delta);
			var left = (parseFloat(snowflakes.flakes[i].x) + snowflakes.params.WindVelocity * delta / snowflakes.params.Flakes.VelocityFactor * (0.5 + 0.5 * Math.random()) * snowflakes.windDirection());

			//Check if flake has crossed the bottom, if yes re-randomize flake
			if(top<= document.body.clientHeight){
				snowflakes.flakes[i].y = top;
				snowflakes.flakes[i].x = left;
			}
			else
				snowflakes.randomizeFlake(snowflakes.flakes[i]);		//Re-randomize flake

			snowflakes.drawFlake(snowflakes.flakes[i]);
		}

		time.last = currentTime;
		window.requestAnimationFrame(snowflakes.nextFrame);
	},

	stop: function() {
		snowflakes.flakeContainer.style.opacity = 0;
		setTimeout(snowflakes.stopCallback, 500);	//Stop status is reflected after fadeOut animation is complete
	},

	stopCallback: function() {
		snowflakes.state = "stopped";
		snowflakes.flakeContainer.style.display = "none";
	},

	start: function() {
		this.init();
		this.flakeContainer.style.display = "initial";

		//If flake image has loaded then start the animation, else wait for loading to finish
		if(this.flakeImage && this.flakeImage.loaded) {
			this.flakeContainer.style.opacity = 1;
			this.state="running";
			window.requestAnimationFrame(snowflakes.nextFrame);
		}
		else if(this.flakeImage) {
			this.state = "waitingForImage";
			this.flakeImage.onload = function() {
				snowflakes.flakeImage.loaded = true;
				snowflakes.flakeContainer.style.opacity = 1;
				snowflakes.state="running";
				window.requestAnimationFrame(snowflakes.nextFrame);
			}
		}
	},

	randomizeAllFlakes: function() {
		for(var i=0;i<this.flakes.length;i++)
		{
			var flake = this.flakes[i];
			this.randomizeFlake(flake);
			var top = Math.random() * this.flakeContainer.height;
			flake.y = top;
		}
	}
}