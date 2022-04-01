function b2q1Submit()
{
	if(document.getElementById("b2q1").value == 179)
	{
	    document.getElementById("b2q1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("b2q1Out").innerHTML = "Good try but not right! Try looking again at the table.";
	}
}

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

function b16q2Submit()
{
	if(document.getElementById("b16q2").value == "#FFEFD5")
	{
	    document.getElementById("b16q2Out").innerHTML = "Correct!";
	}
	else if(document.getElementById("b16q2").value == "FFEFD5")
	{
	    document.getElementById("b16q2Out").innerHTML = "Very Close! Remember that color codes start with a '#'";
	}
	else if(document.getElementById("b16q2").value == "255,239,213")
	{
	    document.getElementById("b16q2Out").innerHTML = "Close! That's the RGB code. We want the hexadecimal code!";
	}
	else
	{
	    document.getElementById("b16q2Out").innerHTML = "Nope that's not it!";
	}
}

function b16q1Submit()
{
	if(document.getElementById("b16q1").value == 213)
	{
	    document.getElementById("b16q1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("b16q1Out").innerHTML = "Good try but not right! Try looking again at the table.";
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
