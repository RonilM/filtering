var Painter = function(canvasID) {

	var xmlns = "http://www.w3.org/2000/svg";

	Painter.prototype.drawCanvas = function(data,cellWidth,cellHeight,actual) {

		var canvasWidth = data[0].length*cellWidth;
		var canvasHeight = data.length*cellHeight;

		var canvas = document.getElementById(canvasID);
		canvas.innerHTML = "";
		canvas.style.width = canvasWidth*1.2;
		canvas.style.height = canvasHeight*1.2;

		var svg = document.createElementNS(xmlns,'svg');
		svg.setAttribute("id",'painter-svg');
		svg.setAttribute("width",canvasWidth*1.2);
		svg.setAttribute("height", canvasHeight*1.2);
		canvas.appendChild(svg);
		

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {

				var y = i*cellHeight;
				var x = j*cellWidth;
				var _color;
				var prob = data[i][j].prob;
				if(i == actual.x && j == actual.y) {
					//console.log(actual);
					_color = "0000ff";
				}
				else if(prob > 0.5) {
					_color = "ff0000";
				}
				else if(prob > 0.05) {
					_color = "ff1919";
				}
				else if(prob > 0.0125) {
					_color = "ff3232";
				}
				else if(prob > 0.00625) {
					_color = "ff4c4c";
				}
				else if(prob > 0.00225) {
					_color = "ff6666";
				}
				else if(prob > 0.000225) {
					_color = "ff7f7f";	
				}
				else if(prob > 0.00001) {
					_color = "ffb2b2";
				}
				else {
					_color = "ffffff";
				}

				var grp = document.createElementNS(xmlns,'g');
				var text = document.createElementNS(xmlns,'text');
				text.textContent = Math.round(data[i][j].prob*10000)/10000;
				text.setAttributeNS(null, 'x', x+5.5);
				text.setAttributeNS(null, 'y', y+24);
		        text.setAttributeNS(null, 'width', cellWidth/3);
		        text.setAttributeNS(null, 'height', cellHeight/3);
		        text.setAttributeNS(null, 'font-size', '12px');

				var rect = document.createElementNS(xmlns,'rect');
				
				rect.setAttributeNS(null, 'x', x);
				rect.setAttributeNS(null, 'y', y);
		        rect.setAttributeNS(null, 'width', cellWidth);
		        rect.setAttributeNS(null, 'height', cellHeight);
		        rect.setAttributeNS(null, 'style', 'fill:#'+_color+';stroke-width:1;stroke:#CCC');
		        //rect.innerHTML = data[i][j].prob;
		        grp.appendChild(rect);
		        //grp.appendChild(text);
		        svg.appendChild(grp);

			}
		}

	}


}