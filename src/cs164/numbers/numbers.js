function b1q2Submit()
{
	if(document.getElementById("b2q2").value == 10001001)
	{
	    document.getElementById("b2q2Out").innerHTML = "Correct!";
	}
	else if(document.getElementById("b2q2").value == 137)
	{
	    document.getElementById("b2q2Out").innerHTML = "That is 137 in base-10. We want the value in base-2. Try again!";
	}
	else
	{
	    document.getElementById("b2q2Out").innerHTML = "Good try but not right! Try looking again at the alternating division/modulus operations above";
	}
}

function changeColor()
{
	var red = document.getElementById("redtext").value,
	    green = document.getElementById("greentext").value,
	    blue = document.getElementById("bluetext").value;

	if(!(red <= 255) || !(red >= 0) || !(green <= 255) || !(green >= 0) || !(blue <= 255) || !(blue >= 0))
	{
	    document.getElementById("colorOutput").innerHTML = "One of the values you entered is not a valid numeric value for an rgb. Try 0-255.";
	}
	else if (red == 52 && green == 86 && blue == 163)
	{
	    document.getElementById("colorOutput").innerHTML = "That's the blue I use for the buttons and tables!";
	    document.getElementById("colorBox").style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
	}
	else if (red == 200 && green == 200 && blue == 200)
	{
	    document.getElementById("colorOutput").innerHTML = "That's the gray I use as the background of this website!";
	    document.getElementById("colorBox").style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
	}
	else if (red == 160 && green == 160 && blue == 160)
	{
	    document.getElementById("colorOutput").innerHTML = "That's the gray I use for the tables!";
	    document.getElementById("colorBox").style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
	}
	else if (red == 180 && green == 180 && blue == 180)
	{
	    document.getElementById("colorOutput").innerHTML = "That's the gray I use for the background of the side bar!";
	    document.getElementById("colorBox").style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
	}
	else if (red == 7 && green == 42 && blue == 124)
	{
	    document.getElementById("colorOutput").innerHTML = "That's the blue I use for the titles!";
	    document.getElementById("colorBox").style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
	}
	else
	{
	    document.getElementById("colorOutput").innerHTML = " ";
	    document.getElementById("colorBox").style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
	}
}


function decbingenerate() {
	var dec, bits;

	bits = 1 + Math.floor(Math.random() * 15);
	dec = Math.floor(Math.random() * Math.pow(2, bits));

	document.getElementById("numbits").value = bits;
	document.getElementById("base10num").value = dec;
	document.getElementById("binaryanswer").value = "";
	document.getElementById("binaryanswer").style.backgroundColor = "#FFFFFF";
	document.getElementById("decbincorrect").innerHTML = "&nbsp;";

}

function decbincheck() {
	var dec, bits, binary;
	var i, deccheck;

	binary = document.getElementById("binaryanswer").value;
	bits = Number(document.getElementById("numbits").value);
	dec = Number(document.getElementById("base10num").value);

	if ( binary.length != bits ) {
		document.getElementById("binaryanswer").style.backgroundColor = "#FF000055";
		document.getElementById("decbincorrect").innerHTML = "&cross;";
		document.getElementById("decbincorrect").setAttribute("class", "cross");
		return;
	}

	deccheck = 0;
	for( i = 0; i < bits; i++ ) {
		if ( binary[i] == '1' ) {
			deccheck += Math.pow(2, (bits - i - 1));
		}
	}

	if( deccheck == dec ) {
		document.getElementById("binaryanswer").style.backgroundColor = "#00FF0055";
		document.getElementById("decbincorrect").innerHTML = "&check;";
		document.getElementById("decbincorrect").setAttribute("class", "check");
	}
	else {
		document.getElementById("binaryanswer").style.backgroundColor = "#FF000055";
		document.getElementById("decbincorrect").innerHTML = "&cross;";
		document.getElementById("decbincorrect").setAttribute("class", "cross");
	}
}

function bindecgenerate() {
	var bits;
	var i;

	bits = 1 + Math.floor(Math.random() * 15);
	
	document.getElementById("binarynum").value = "";

	for( i = 0; i < bits; i++)
		document.getElementById("binarynum").value += Math.floor(Math.random() * 2);

	document.getElementById("decanswer").value = "";
	document.getElementById("decanswer").style.backgroundColor = "#FFFFFF";
	document.getElementById("bindeccorrect").innerHTML = "&nbsp;";
}

function bindeccheck() {
	var binary, dec;
	var i, deccheck;

	binary = document.getElementById("binarynum").value;
	dec = Number(document.getElementById("decanswer").value);

	deccheck = 0;
	for( i = 0; i < binary.length; i++ ) {
		if ( binary[i] == '1' ) {
			deccheck += Math.pow(2, (binary.length - i - 1));
		}
	}

	if( deccheck == dec ) {
		document.getElementById("decanswer").style.backgroundColor = "#00FF0055";
		document.getElementById("bindeccorrect").innerHTML = "&check;";
		document.getElementById("bindeccorrect").setAttribute("class", "check");
	}
	else {
		document.getElementById("decanswer").style.backgroundColor = "#FF000055";
		document.getElementById("bindeccorrect").innerHTML = "&cross;";
		document.getElementById("bindeccorrect").setAttribute("class", "cross");
	}

}

function hdcheck() {
	// hdhex, hddec, hdresponse
	var hex, dec;
	var i;

	hex = document.getElementById("hdhex").value;
	dec = Number(document.getElementById("hddec").value);

	if( hextodecimal(hex) == dec ) {
		document.getElementById("hddec").style.backgroundColor = "#00FF0055";
		document.getElementById("hdresponse").innerHTML = "<span class=\"check\">&check;</span> Correct";
	}
	else {
		document.getElementById("hddec").style.backgroundColor = "#FF000055";
		document.getElementById("hdresponse").innerHTML = "<span class=\"cross\">&cross;</span> Incorrect";
	}
}
function hdreset() {
	// hdhex, hddec, hdresponse

	randomHex( Math.floor( 1 + (Math.random()*4) ), "hdhex" );
	document.getElementById("hddec").value = "";
	document.getElementById("hddec").style.backgroundColor = "#FFFFFF";
	document.getElementById("hdresponse").innerHTML = "<i>Waiting for input</i>";
}

function hbcheck() {
	// hbhex, hbbinary, hbresponse
	var hex, bin;

	hex = document.getElementById("hbhex").value;
	bin = document.getElementById("hbbinary").value;

	if( bin.length != (hex.length * 4) ) {
		document.getElementById("hbbinary").style.backgroundColor = "#FF000055";
		document.getElementById("hbresponse").innerHTML = "<span class=\"cross\">&cross;</span> Incorrect. Check how many bits you've used.";
		return;
	}

	if( hextodecimal(hex) == binarytodecimal(bin) ) {
		document.getElementById("hbbinary").style.backgroundColor = "#00FF0055";
		document.getElementById("hbresponse").innerHTML = "<span class=\"check\">&check;</span> Correct";
	}
	else {
		document.getElementById("hbbinary").style.backgroundColor = "#FF000055";
		document.getElementById("hbresponse").innerHTML = "<span class=\"cross\">&cross;</span> Incorrect";
	}
}
function hbreset() {
	// hbhex, hbbinary, hbresponse

	randomHex( Math.floor( 1 + (Math.random()*4) ), "hbhex" );
	document.getElementById("hbbinary").value = "";
	document.getElementById("hbbinary").style.backgroundColor = "#FFFFFF";
	document.getElementById("hbresponse").innerHTML = "<i>Waiting for input</i>";
}

function hqcheck() {
	// hqhex, hqquar, hqresponse
	var hex, quar;

	hex = document.getElementById("hqhex").value;
	quar = document.getElementById("hqquar").value;

	if( quar.length != (hex.length * 2) ) {
		document.getElementById("hqquar").style.backgroundColor = "#FF000055";
		document.getElementById("hqresponse").innerHTML = "<span class=\"cross\">&cross;</span> Incorrect. Check how many hex digits you've used.";
		return;
	}

	if( hextodecimal(hex) == quartodecimal(quar) ) {
		document.getElementById("hqquar").style.backgroundColor = "#00FF0055";
		document.getElementById("hqresponse").innerHTML = "<span class=\"check\">&check;</span> Correct";
	}
	else {
		document.getElementById("hqquar").style.backgroundColor = "#FF000055";
		document.getElementById("hqresponse").innerHTML = "<span class=\"cross\">&cross;</span> Incorrect";
	}
}
function hqreset() {
	// hqhex, hqquar, hqresponse

	randomHex( Math.floor( 1 + (Math.random()*4) ), "hqhex" );
	document.getElementById("hqquar").value = "";
	document.getElementById("hqquar").style.backgroundColor = "#FFFFFF";
	document.getElementById("hqresponse").innerHTML = "<i>Waiting for input</i>";
}

function bhcheck() {
	// bhbinary, bhhex, bhresponse
	var hex, bin;

	hex = document.getElementById("bhhex").value;
	bin = document.getElementById("bhbinary").value;

	if( bin.length != (hex.length * 4) ) {
		document.getElementById("bhbinary").style.backgroundColor = "#FF000055";
		document.getElementById("bhresponse").innerHTML = "<span class=\"cross\">&cross;</span> Incorrect. Check how many hex digits you've used.";
		return;
	}

	if( hextodecimal(hex) == binarytodecimal(bin) ) {
		document.getElementById("bhbinary").style.backgroundColor = "#00FF0055";
		document.getElementById("bhresponse").innerHTML = "<span class=\"check\">&check;</span> Correct";
	}
	else {
		document.getElementById("bhbinary").style.backgroundColor = "#FF000055";
		document.getElementById("bhresponse").innerHTML = "<span class=\"cross\">&cross;</span> Incorrect";
	}
}
function bhreset() {
	// bhbinary, bhhex, bhresponse
	var bits;

	bits = 4 * ( Math.floor( 1 + Math.random()*4) );

	randomBinary( bits, "bhbinary" );
	document.getElementById("bhhex").value = "";
	document.getElementById("bhhex").style.backgroundColor = "#FFFFFF";
	document.getElementById("bhresponse").innerHTML = "<i>Waiting for input</i>";
}
