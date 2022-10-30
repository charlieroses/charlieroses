function init() {
	var i, j;
	var tr, td;

	for( i = 9; i >= 0; i--) {
		tr = document.createElement("tr");
		td = document.createElement("td");
		td.setAttribute("class", "unit");
		td.innerHTML = i;
		tr.appendChild( td );
		for( j = 0; j < 10; j++ ) {
			td = document.createElement("td");
			td.setAttribute("class", "grid");
			td.setAttribute("id", "x" + j + "y" + i);
			td.setAttribute("onclick", "select("+j+","+i+")");
			tr.appendChild( td );
		}
		document.getElementById("bresenhamgrid").appendChild( tr );
	}

	tr = document.createElement("tr");
	td = document.createElement("td");
	td.setAttribute("class", "unit");
	tr.appendChild( td );
	for( i = 0; i < 10; i++ ) {
		td = document.createElement("td");
		td.setAttribute("class", "unit");
		td.innerHTML = i;
		tr.appendChild( td );
	}
	document.getElementById("bresenhamgrid").appendChild( tr );

	cleargrid();
	generate();
}

function generate() {
	document.getElementById("x0").value = Math.floor(Math.random() * 10);
	document.getElementById("y0").value = Math.floor(Math.random() * 10);
	document.getElementById("x1").value = Math.floor(Math.random() * 10);
	document.getElementById("y1").value = Math.floor(Math.random() * 10);
}

function verify() {
	var points;
	var pLen;
	var i, j, k, x, y, s, c;

	points = generatepoints();
	pLen = points.length / 2;

	for( i = 0; i < 10; i++ ) {
		for( j = 0; j < 10; j++) {
			c = document.getElementById("x" + i + "y" + j).style.backgroundColor;
			if ( c == "rgb(238, 238, 238)" )
				continue;

			s = 0;
			for( k = 0; k < pLen; k++ ) {
				x = k * 2;
				y = x + 1;
				if( i == points[x] && j == points[y] ) {
					s = 1;
					break;
				}
			}

			if( s == 1 ) {
				document.getElementById("x" + i + "y" + j).innerHTML = "<span class=\"check\">&check;</span>";
			}
			else {
				document.getElementById("x" + i + "y" + j).innerHTML = "<span class=\"cross\">&cross;</span>";
			}
		}
	}
}

function solution() {
	var points;
	var i, j, x, y, pLen;

	points = generatepoints();
	pLen = points.length / 2;

	for( i = 0; i < 10; i++ ) {
		for( j = 0; j < 10; j++ ) {
			if( document.getElementById("x" + i + "y" + j).style.backgroundColor == "rgba(0, 255, 0, 0.333)" ) {
				document.getElementById("x" + i + "y" + j).style.backgroundColor = "#EEEEEE";
				document.getElementById("x" + i + "y" + j).innerHTML = "";
			}
		}
	}

	for( i = 0; i < pLen; i++ ) {
		x = i * 2;
		y = x + 1;
		document.getElementById("x" + points[x] + "y" + points[y]).style.backgroundColor = "#00FF0055";
	}
}

function generatepoints( ) {
	var x0, y0, x1, y1;
	var x0t, y0t, x1t, y1t, t;
	var dx, dy, x, y, e;
	const points = [];

	x0 = Number(document.getElementById("x0").value);
	y0 = Number(document.getElementById("y0").value);
	x1 = Number(document.getElementById("x1").value);
	y1 = Number(document.getElementById("y1").value);
	
	x0t = x0;
	y0t = y0;
	x1t = x1;
	y1t = y1;

	if( x0 > x1 ) {
		x0t = -x0t;
		x1t = -x1t;
	}
	if( y0 > y1 ) {
		y0t = -y0t;
		y1t = -y1t;
	}

	dx = x1t - x0t;
	dy = y1t - y0t;
	t = 0;

	if( dy > dx ) {
		t = x0t;
		x0t = y0t;
		y0t = t;
		t = x1t;
		x1t = y1t;
		y1t = t;
		t = dx;
		dx = dy;
		dy = t;
		t = 1;
	}

	y = y0t;
	e = 0;
	for( x = x0t; x <= x1t; x++ ) {
		if( t ) {
			points.push( Math.abs(y) );
			points.push( Math.abs(x) );
		}
		else {
			points.push( Math.abs(x) );
			points.push( Math.abs(y) );
		}
		e = e + dy;
		if ( e + e > dx ) {
			y = y + 1;
			e = e - dx;
		}
	}

	return points;
}

function cleargrid() {
	var i, j;

	for( i=0; i < 10; i++ ) {
		for( j=0; j < 10; j++ ) {
			document.getElementById("x" + i + "y" + j).style.backgroundColor = "#EEEEEE";
			document.getElementById("x" + i + "y" + j).innerHTML = "";
		}
	}
}

function select( x, y ) {
	document.getElementById("x" + x + "y" + y).innerHTML = "";
	if ( document.getElementById("x" + x + "y" + y).style.backgroundColor == "rgb(238, 238, 238)" ) {
		document.getElementById("x" + x + "y" + y).style.backgroundColor = "#FFFF0055";
	}
	else {
		document.getElementById("x" + x + "y" + y).style.backgroundColor = "#EEEEEE";
	}
}
