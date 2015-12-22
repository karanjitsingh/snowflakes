var snowflakes = {
	params: {
		FlakeNumber: 30,
		Size: 20,
		SizeVariation: 10,
		Velocity: 8,
		VelocityVariation: 4,
		VelocityFactor: 100,
		WindDirection: "alternate", //["left", "right", "alternate", "none"]
		WindVelocity: 4,
		WindSwingTime: 4000,
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
		flake.velocity = (this.params.Velocity -this.params.VelocityVariation + Math.random()*(2*this.params.VelocityVariation))/this.params.VelocityFactor;
		flake.size = (this.params.Size-this.params.SizeVariation) + Math.random()*(2 * this.params.SizeVariation);
		flake.x = document.body.clientWidth * Math.random();
		flake.y = (-1 * (this.params.Size + this.params.SizeVariation) - Math.random()*100);
		flake.rotate = 60 * Math.random();
	},

	init: function() {
		if(this.state != "")
			return;

		this.flakeContainer = document.getElementsByClassName("snowflakes")[0];

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

		this.flakeImage.src = "flake.svg";
		for(var i=0; i<this.params.FlakeNumber; i++)
		{
			var flake = new Object();
			this.randomizeFlake(flake);
			flake.y = Math.random() * this.flakeContainer.height;
			this.flakes.push(flake);
		}
		this.state = "initialized";
	},

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

		var time = snowflakes.time;
		if(!time.start){time.start=currentTime;}
			if(!time.last){time.last=currentTime;}
				time.total=(currentTime-time.start);

		var delta = currentTime - time.last;

		var ctx = snowflakes.flakeContainer.getContext("2d");
		ctx.clearRect(0,0,parseInt(snowflakes.flakeContainer.width),parseInt(snowflakes.flakeContainer.height));

		for(var i =0;i<snowflakes.flakes.length;i++) {
			var top = (parseFloat(snowflakes.flakes[i].y) + snowflakes.flakes[i].velocity * delta);
			var left = (parseFloat(snowflakes.flakes[i].x) + snowflakes.params.WindVelocity * delta / snowflakes.params.VelocityFactor * (0.5 + 0.5 * Math.random()) * snowflakes.windDirection());

			if(top<= document.body.clientHeight){
				snowflakes.flakes[i].y = top;
				snowflakes.flakes[i].x = left;
			}
			else
				snowflakes.randomizeFlake(snowflakes.flakes[i]);

			snowflakes.drawFlake(snowflakes.flakes[i]);
		}

		time.last = currentTime;
		window.requestAnimationFrame(snowflakes.nextFrame);
	},

	stop: function() {
		snowflakes.flakeContainer.style.opacity = 0;
		setTimeout(snowflakes.stopCallback, 500);
	},

	stopCallback: function() {
		snowflakes.state = "stopped";
		snowflakes.flakeContainer.style.display = "none";
	},

	start: function() {
		this.init();
		this.flakeContainer.style.display = "initial";
		if(this.flakeImage && this.flakeImage.loaded) {
			this.flakeContainer.style.opacity = 1;
			this.state="running";
			window.requestAnimationFrame(snowflakes.nextFrame);
		}
		else if(this.flakeImage) {
			this.state = "waitingForSvg";
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
			var top = Math.random() * this.flakeContainer.clientHeight;
			flake.y = top;
		}
	}
}