var GroundTruth = function(minimum,maximum,grid,start) {
	var num = [];
	var action = [];
	var i = 0;
	var x = start.x;
	var y = start.y;
	var xyval = [];
	var transitionX = [];
	var transitionY = [];
	var direction;
	var terrainObservations = []
	init();

	GroundTruth.Prototype.getTransitionX = function() {
		return transitionX;
	}

	GroundTruth.Prototype.getTransitionY = function() {
		return transitionY;
	}

	GroundTruth.Prototype.getAcion = function() {
		return action;
	}

	GroundTruth.Prototype.getSensor = function() {
		return terrainObservations;
	}

	function init() {
		var actions = ['U','L','D','R'];
		while (i < 100) {
			num[i] = getRandomArbitrary(minimum,maximum);
			action[i] = actions[num[i] - 1];
			i++;
		}

		console.log(num);
		console.log(action);

		// transition model		
		for(var j = 0; j < 100; j++){
			var rand = Math.random();
			if (rand < 0.9){
				var direction = action[j];
			}
			console.log('direction' + direction);
			xyval = transitionModel(x,y,direction); 
			x = xyval[0];
			y = xyval[1];
			transitionX[j] = xyval[0];
			transitionY[j] = xyval[1];
		}

		// observation model

		for (var j = 0; j < 100; j++){
			terrainObservations[j] = getObservation(transitionX[j],transitionY[j]);
		}

		console.log(terrainObservations);
	}

	function transitionModel(x,y,direction) { 
		xy = [];
		xy[0] = x;
		xy[1] = y;

		switch(direction) {
			case 'D':
				if (x != 119 ){
					x = x + 1;
				}
				if(grid[x][y].isBlocked == true){
					x = x - 1;
				}
				xy[0] = x;
				xy[1] = y;
				break;
			case 'U':
				if(x != 0 ){
					x = x - 1;
				}
				if(grid[x][y].isBlocked == true){
					x = x + 1;
				}
				xy[0] = x;
				xy[1] = y;
				break;
			case 'R':
				if(y != 159 ){
					y = y + 1;
				}
				if(grid[x][y].isBlocked == true){
					y = y - 1;
				}
				xy[0] = x;
				xy[1] = y;
				break;
			case 'L':
				if(y != 0 ){
					y = y - 1;
				}
				if(grid[x][y].isBlocked == true){
					y = y + 1;
				}
				xy[0] = x;
				xy[1] = y;
				break;
			default:
				break;
		}
		console.log(xy);
		return xy;
	}

	function getObservation(x,y){
		var observeValue;
		var trueValue;
		var value1;
		var value2;
		if(grid[x][y].isPartialObstacle == true){
			trueValue = 'PB';
			value1 = 'H';
			value2 = 'N';
			observeValue = getRandomGenerator(trueValue,value1,value2);
		}
		else if(grid[x][y].isHighway == true){
			trueValue = 'H';
			value1 = 'PB';
			value2 = 'N';
			observeValue = getRandomGenerator(trueValue,value1,value2);
		}
		else{
			trueValue = 'N';
			value1 = 'PB';
			value2 = 'H';
			observeValue = getRandomGenerator(trueValue,value1,value2);
		}
		return observeValue;
	}

	function getRandomGenerator(trueValue,value1,value2){
		var rand = Math.random();
		if (rand < 0.9) {
			return trueValue;
		}
		else if (rand > 0.9 && rand < 0.95){
			return value1;
		}
		else {
			return value2;
		}
	}

	function getRandomArbitrary(min, max) {
    	return Math.floor(Math.random() * (max - min) + min);
	}	
}