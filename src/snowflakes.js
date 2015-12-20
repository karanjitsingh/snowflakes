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
		this.flakeContainer = document.createElement("canvas");
		this.flakeContainer.className = "snowflakes";

		document.body.appendChild(this.flakeContainer);
		this.flakeContainer.width = document.body.clientWidth;
		this.flakeContainer.height = document.body.clientHeight;

		this.flakes = [];

		this.flakeImage = new Image();
		this.flakeImage.src = "flake.svg";

		for(var i=0;i<this.params.FlakeNumber;i++)
		{
			var flake = new Object();
			this.randomizeFlake(flake);
			flake.y = Math.random() * this.flakeContainer.clientHeight;
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

		var log = document.getElementById("log");
		if(parseInt(delta)!=0){
			log.innerHTML = parseInt(1000/parseInt(delta)) + " FPS<br/>";
		}

		for(var i =0;i<snowflakes.flakes.length;i++) {
			var top = (parseFloat(snowflakes.flakes[i].y) + snowflakes.flakes[i].velocity * delta);
			var left = (parseFloat(snowflakes.flakes[i].x) + snowflakes.params.WindVelocity * delta / snowflakes.params.VelocityFactor * (0.5 + 0.5 * Math.random()) * snowflakes.windDirection());


			if(top<= document.body.clientHeight){
				snowflakes.flakes[i].y = top;
				snowflakes.flakes[i].x = left;
			}
			else{
				snowflakes.randomizeFlake(snowflakes.flakes[i]);
			}


			snowflakes.drawFlake(snowflakes.flakes[i]);
		}


		time.last = currentTime;

		window.requestAnimationFrame(snowflakes.nextFrame);
	},

	stop: function() {
		this.flakeContainer.style.opacity = 0;
		setTimeout('snowflakes.state = "stopped"', 500);
	},

	start: function() {
		this.init();
		this.flakeContainer.style.opacity = 1;
		window.requestAnimationFrame(snowflakes.nextFrame);
		this.state="running";
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