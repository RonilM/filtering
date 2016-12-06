var ApproxParticleFilter = function(data,nParticles,start) {

	//var data = [];
	var particles = [];
	var actual = {};
	var actualList = [];
	var maxCell = {'prob':-1};
	init();

	ApproxParticleFilter.prototype.nextIteration = function(action,observation,actual) {
		
		this.createSamples();
		this.transitionSamples(action);
		this.moveActual(actual);
		this.weighSamplesUsingObservation(observation);
		this.updateProbabilitiesUsingParticles();

	}	

	ApproxParticleFilter.prototype.getMaxCell = function() {
		return maxCell;
	}

	ApproxParticleFilter.prototype.getData = function() {
		return data;
	}

	ApproxParticleFilter.prototype.moveActual = function(_actual) {

		//_actual = getNextCell(action,actual.x,actual.y);
		//if(Math.random() < 0.9)
		actual = {'x':_actual[0],'y':_actual[1]};
		actualList.push(actual);

	}
	
	ApproxParticleFilter.prototype.getActual = function() {
		return actualList[actualList.length-1];
	}


	ApproxParticleFilter.prototype.createSamples = function () {
		particles = [];
		for(var i = 0; i < nParticles ; i++) {
			var rand = Math.random();
			var particle = {};
			particle.cell = getCellFromProbability(rand);
			particles.push(particle);
		}

		//updateProbabilitiesUsingParticles();

	}

	ApproxParticleFilter.prototype.transitionSamples = function (action) {
		for(var i = 0; i  < nParticles ; i++) {
			var particle = particles[i];
			var nxtCell = getNextCell(action,particle.cell.x,particle.cell.y);
			var rand = Math.random();
			if(rand < 0.9) {
				particle.cell = nxtCell;
			}
		}
	}	
	
	ApproxParticleFilter.prototype.weighSamplesUsingObservation = function (observation) {
		//console.log(observation);
		var observed = observation;
		for(var i = 0; i  < nParticles ; i++) {
			var particle = particles[i];
			//console.log(particle);
			var type = data[particle.cell.x][particle.cell.y].type;
			//alert(type+"!!")
			if(type == observed) {
				particle.weight = 0.9;
				//console.log("@#@$#@$#$");
			}
			else {
				particle.weight = 0.05;	
			}
		}
	}

	ApproxParticleFilter.prototype.updateProbabilitiesUsingParticles = function() {

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				data[i][j].prob = 0;
			}
		}

		var totWeight = 0;
		for(var i = 0 ;  i  < particles.length ; i++) {
			totWeight += particles[i].weight;
		}

		for(var i = 0 ;  i  < particles.length ; i++) {
			var particle = particles[i];
			data[particle.cell.x][particle.cell.y].prob += particle.weight;
		}	

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				data[i][j].prob = data[i][j].prob/totWeight;
				if(data[i][j].prob > maxCell.prob) {
					maxCell = data[i][j]; 
				}
			}
		}	

		updateProbabilityRanges(data);		

	}

	ApproxParticleFilter.prototype.getActualList = function() {
		return actualList;
	}

	function init() {



		var totalSpots = 0;

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {

				//if(!data[i]){
				//	data[i] = [];
				//}

				//data[i][j] = {};

				
				//data[i][j].color = getCellcolor(gridData[i][j]);
				if(data[i][j] == null) {
					data[i][j] = {};
					data[i][j].type = 'B';

				}

				data[i][j].prob = 0;
				if(data[i][j].type != 'B'){
					totalSpots++;
				}

			}
		}

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				if(data[i][j].type != 'B')
					data[i][j].prob = 1/totalSpots;
			}
		}

		updateProbabilityRanges(data);

		actual = {'x': start.x, 'y': start.y};//getCellFromProbability(Math.random());
		//actual = {'x':0,'y':0}
		actualList.push(actual);

	}



	function updateProbabilityRanges(data) {

		//var start = 0;
		var end = 0;

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {

				//thres .000004
				if(data[i][j].prob < 0.00004 && data[i][j].prob > 0) {
					data[i][j].prob = 0;
					nParticles -= nParticles/(data.length*data[0].length);
				}

				

			}
		}

		var _tot = 0;

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				_tot += data[i][j].prob;
			}
		}

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				data[i][j].prob = data[i][j].prob/_tot;
			}
		}

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				data[i][j].probStart = end;
				data[i][j].probEnd = data[i][j].prob + end;
				end = data[i][j].probEnd;
			}
		}

	}


	function getCellType(str) {
		return str;
	}

	function getCellcolor(str) {

		switch(str) {
			case "H":
				return "00ff00";
			case "N":
				return "0000ff";
			case "T":
				return "ff0000";
			case "B":
				return "000000";
		}

		//return str;
	}

	function getCellFromProbability(probability) {
		//console.log("********");
		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0 ; j < data[0].length ; j++) {
				var start = data[i][j].probStart;
				var end  = data[i][j].probEnd;
				//console.log(start+","+end);
				if(start <= probability && end > probability && data[i][j].type != 'B') {
					return {'x': i, 'y': j};
				}
			}
		}

		return null;
	}

	function updateProbabilitiesUsingParticles() {

	}

	function getNextCell(action,i,j) {
		var iLimit = data.length;
		var jLimit = data[0].length;
		var iRet = i
			jRet = j;
		switch(action.toLowerCase()) {
			case 'up':
				iRet = i-1;
				break;
			case 'down':
				iRet = i+1;
				break;
			case 'left':
				jRet = j-1;
				break;
			case 'right':
				jRet = j+1;
				break;

		}
		//console.log(iRet+","+jRet);
		//console.log(iLimit+","+jLimit);
		if(iRet < 0 || jRet < 0 || iRet >= iLimit || jRet >= jLimit || data[iRet][jRet].type == "B") {

			return {'x': i,'y': j};
		}
		return {'x': iRet,'y': jRet};
	}

	function getActualObservation(idx) {

		var str = ["N","N","H","H"];
		return str[idx];
		/*var actData = data[actual.x][actual.y];
		var rand = Math.random();
		var str = ["N","H","T"];
		var search_term = actData.type;
		for (var i=str.length-1; i>=0; i--) {
		    if (str[i] === search_term) {
		        str.splice(i, 1);
		        break;
		    }
		}

		if(rand < 0.9) {
			return actData.type;
		}
		else if (rand < 0.95) {
			return str[0];
		}
		else {
			return str[1];
		}*/

	}


}