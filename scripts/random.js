var Random = function(rowCount, columnCount) {
	var blocks = [];
	var partiallyBlockedX = [];
	var partiallyBlockedY = [];
	var highwayNumber = 0;
	var start = {"x" : 0, "y" : 0};
	var end = {"x" : 0, "y" : 0};

	init();

	Random.prototype.getMap = function() {
		return blocks;
	}

	Random.prototype.getStartPoint = function() {
		return start;
	}

	Random.prototype.getEndPoint = function() {
		return end;
	}

	Random.prototype.getRandomEndPoints = function() {
		do {
			start.x = getX();
			start.y = getY();

			end.x = getX();
			end.y = getY();

			var dist = getDistance(start.x,start.y,end.x,end.y);
		}
		while (dist < 5);

		return [start,end];

	}

	function init() {
		for (var i = 0; i < rowCount; i++) {
			for (var j = 0; j < columnCount; j++) {
				if (!blocks[i]) {
					blocks[i] = [];
				}
				blocks[i][j] = 1;
			}
		}
		//console.log(blocks);
		// JSON object for partially blocked 
		/*var coordinates = { "xcoordinate" : 
					{ "x" : [] },
					"ycoordinate" :
					{"y" : [] }
		}*/
		var coordinates = { "x" : [] ,"y" : [] };
		

		for (var i = 0; i < 8; i++) {
			var xrand = getRandomX();
			var yrand = getRandomY();
			partiallyBlockedX.push(xrand);
			partiallyBlockedY.push(yrand);	
		}

		var val = 0;
		var count = 0;

		while(val < 8) {
			var startX = partiallyBlockedX[val] - 15;
			var startY = partiallyBlockedY[val] - 15;
			var endX = partiallyBlockedX[val] + 15;
			var endY = partiallyBlockedY[val] + 15;
			
			for(var i = startX; i <= endX; i++) {
				for (var j = startY; j <= endY; j++) {
					var an = coinFlip();
					if (an == 1) {
						//json(i,j,count);
						count++;
						convertToPartiallyBlocked(i,j,blocks);
					}
				}
			}
			val++;
		}

		// Start and end goal
		do {
			start.x = getX();
			start.y = getY();

			end.x = getX();
			end.y = getY();

			var dist = getDistance(start.x,start.y,end.x,end.y);
		}
		while (dist < 5);

		var tries = 0;
		while(highwayNumber < 4 && tries < 200) {
			var h = generateHighway(blocks);
			if(h == null) {
				continue;
			}
			else {
				highwayNumber++;
				for(var crd in h) {
					if(h[crd].isPB == true)
						blocks[h[crd].x][h[crd].y] = "b"+highwayNumber;
					else
						blocks[h[crd].x][h[crd].y] = "a"+highwayNumber;
				}
			}
			tries++;
		}
		if(tries >= 200) {
			console.log("Tries over!");
		}
		
		var blockedI = 0;
		while(blockedI < rowCount*columnCount*0.2) {

			var randX = Math.floor(Math.random()*rowCount);	
			var randY = Math.floor(Math.random()*columnCount);

			if(!blocks[randX]) {
			blocks[randX] = [];
			}

			if(blocks[randX][randY] == 1) {
			blocks[randX][randY] = 0;
			blockedI++;
			}

}

		/*function json (x,y,index) {
			coordinates.x[index] = x;
			coordinates.y[index] = y;
		}*/
		var tmp = 0;
		var str = "";
		for (var i = 0; i < blocks.length; i++) {
			for (var j = 0; j < blocks[i].length; j++) {
				 str = str + blocks[i][j] + ", ";
				 tmp++;
			}
			str = str + "\n";
		}
		//console.log(str);
		//console.log(tmp);

	}

	function getRandomX() {
		return  Math.floor(Math.random() * (rowCount - 0 + 1)) + 0;
	}	


	function getRandomY() {
			return Math.floor(Math.random() * (columnCount - 0 + 1)) + 0;
		}

	function coinFlip() {
		return Math.floor(Math.random() * 2);
	}

	function convertToPartiallyBlocked(x,y,blocks) {
		if (blocks[x] == null || blocks[x][y] == null) {
			return;
		}
		blocks[x][y] = 2;
	}

	function getX() {
		var rand1 = Math.floor(Math.random() * (20 - 0 + 1)) + 0;
		var rand2 = Math.floor(Math.random() * (rowCount - (rowCount - 20) + 1)) + (rowCount - 20);
		var choice = coinFlip();
		if(choice == 1) {
			return rand1;
		}
		else {
			return rand2;
		}
	}

	function getY() {
		var rand1 = Math.floor(Math.random() * (20 - 0 + 1)) + 0;
		var rand2 = Math.floor(Math.random() * (columnCount - (columnCount - 20) + 1)) + (columnCount - 20);
		var choice = coinFlip();
		if(choice == 1) {
			return rand1;
		}
		else {
			return rand2;
		}
	}

	function getDistance(sx,sy,ex,ey) {
		return Math.sqrt( (sx-ex)*(sx-ex) + (sy-ey)*(sy-ey) );
	}

	function generateHighway(blocks) {

		if(blocks == null) {
			return null;
		}
		var boolMap = {};
		var _blocks = [];

		var borderCell = {};
		var a = 0, b = 0;
		var direction;

		/*if(Math.random() > 0.5) {
			a = 1;
		}
		else {
			b = 1;
		}*/
		var rand = Math.random();
		if(rand < 0.25) {
			borderCell.x = 0;
			borderCell.y = Math.floor(Math.random()*columnCount);	
			direction = "right";
		}	
		else if(rand >= 0.25 && rand < 0.5) {
			borderCell.x = rowCount - 1;	
			borderCell.y = Math.floor(Math.random()*columnCount);	
			direction = "left";
		}
		else if(rand >= 0.5 && rand < 0.75) {
			borderCell.x = Math.floor(Math.random()*rowCount);	
			borderCell.y = 0;	
			direction = "down";
		}
		else {
			borderCell.x = Math.floor(Math.random()*rowCount);	
			borderCell.y = columnCount - 1;
			direction = "up";
		}	
		var x = borderCell.x;
		var y = borderCell.y;
		var highwayCnt = 0;
		//if(Math.random() > 0.5) {
		while(true) {

			switch(direction) {
				case "right":
					a = 1;
					b = 0;
					break;
				case "left":
					a = -1;
					b = 0;
					break;
				case "down":
					a = 0;
					b = 1;
					break;
				case "up":
					a = 0;
					b = -1;
					break;
				default:
					break;
			}

			for(var i = 0; i < 20 ; i++) {

				if(!(blocks[x][y] == 1 || blocks[x][y] == 2)) {
					return null;
				}

				//blocks[x][y] = "H"+;
				if(blocks[x][y] == 2)
					_blocks.push({'x':x,'y':y,'isPB':true});
				else
					_blocks.push({'x':x,'y':y,'isPB':false});

				if(boolMap[x] == null) {
					boolMap[x] = {};
				}
				else if(boolMap[x][y] == true) {
					return null;
				}
				boolMap[x][y] = true;
				highwayCnt++;
				x += a;
				y += b;

				if(!blocks[x] || !blocks[x][y]) {
					if(highwayCnt < 5) {
						return null;
					}
					else {
						return _blocks;
					}
				}
			}

			rand = Math.random();
			if(rand < 0.6) {

			}
			else if(rand >= 0.6 && rand < 0.8) {
				if(direction == "left" || direction == "right") {
					direction = "up";
				}
				else {
					direction = "left";
				}
			}
			else {
				if(direction == "left" || direction == "right") {
					direction = "down";
				}
				else {
					direction = "right";
				}
			}


		}

		return null;
		//}		

	}


}