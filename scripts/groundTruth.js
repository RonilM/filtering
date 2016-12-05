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


	GroundTruth.prototype.getTransitionX = function() {
		return transitionX;
	}

	GroundTruth.prototype.getTransitionY = function() {
		return transitionY;
	}

	GroundTruth.prototype.getAction = function() {
		return action;
	}

	GroundTruth.prototype.getSensor = function() {
		return terrainObservations;
	}

	function init() {
		var actions = ['Up','Left','Down','Right'];
		while (i < 100) {
			num[i] = getRandomArbitrary(minimum,maximum);
			action[i] = actions[num[i] - 1];
			i++;
		}

		//console.log(num);
		//console.log(action);

		// transition model		
		for(var j = 0; j < 100; j++){
			var rand = Math.random();
			if (rand < 0.9){
				var direction = action[j];
			}
			//console.log('direction' + direction);
			xyval = transitionModel(x,y,direction); 
			x = xyval[0];
			y = xyval[1];
			transitionX[j] = xyval[0];
			transitionY[j] = xyval[1];
		}

		// observation model

		for (var j = 0; j < 100; j++){
			terrainObservations[j] = getObservation(transitionX[j],transitionY[j]);
			//grid[transitionX[j]][transitionY[j]].Type = getObservation(transitionX[j],transitionY[j]);
			//console.log(grid[transitionX[j]][transitionY[j]]);
		}

		//console.log(terrainObservations);
	}

	function transitionModel(x,y,direction) { 
		xy = [];
		xy[0] = x;
		xy[1] = y;

		switch(direction) {
			case 'Down':
				if (x != 79 ){
					x = x + 1;
				}
				if(grid[x][y].isBlocked == true){
					x = x - 1;
				}
				xy[0] = x;
				xy[1] = y;
				break;
			case 'Up':
				if(x != 0 ){
					x = x - 1;
				}
				if(grid[x][y].isBlocked == true){
					x = x + 1;
				}
				xy[0] = x;
				xy[1] = y;
				break;
			case 'Right':
				if(y != 59 ){
					y = y + 1;
				}
				if(grid[x][y].isBlocked == true){
					y = y - 1;
				}
				xy[0] = x;
				xy[1] = y;
				break;
			case 'Left':
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
		//console.log(xy);
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