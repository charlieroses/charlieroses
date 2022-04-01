function bq1Submit()
{
	answer = document.getElementById("bq1").value;

	if(answer == "1" || answer.toLowerCase() == "true" || answer.toLowerCase() == "on")
	{
	    document.getElementById("bq1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("bq1Out").innerHTML = "Nope";
	}
}

function bq2Submit()
{
	answer = document.getElementById("bq2").value;

	if(answer == "0" || answer.toLowerCase() == "false" || answer.toLowerCase() == "off")
	{
	    document.getElementById("bq2Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("bq2Out").innerHTML = "Nope";
	}
}

function notq1Submit()
{
	answer = document.getElementById("notq1").value;

	if(answer == "0" || answer.toLowerCase() == "false" || answer.toLowerCase() == "off")
	{
	    document.getElementById("notq1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("notq1Out").innerHTML = "That is NOT the answer. (Pun intended)";
	}
}

function notq2Submit()
{
	answer = document.getElementById("notq2").value;

	if(answer == "0" || answer.toLowerCase() == "false" || answer.toLowerCase() == "off")
	{
	    document.getElementById("notq2Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("notq2Out").innerHTML = "That is NOT the answer. (Pun intended)";
	}
}

function orq1Submit()
{
	answer = document.getElementById("orq1").value;

	if(answer == "1" || answer.toLowerCase() == "true" || answer.toLowerCase() == "on")
	{
	    document.getElementById("orq1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("orq1Out").innerHTML = "Nope";
	}
}

function andq1Submit()
{
	answer = document.getElementById("andq1").value;

	if(answer == "1" || answer.toLowerCase() == "true" || answer.toLowerCase() == "on")
	{
	    document.getElementById("andq1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("andq1Out").innerHTML = "No. Take a closer look at the operators on x and y";
	}
}

function norq1Submit()
{
	answer = document.getElementById("norq1").value;

	if(answer == "0" || answer.toLowerCase() == "false" || answer.toLowerCase() == "off")
	{
	    document.getElementById("norq1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("norq1Out").innerHTML = "That is NOT the answer. (Pun intended)";
	}
}

function nandq1Submit()
{
	answer = document.getElementById("nandq1").value;

	if(answer == "0" || answer.toLowerCase() == "false" || answer.toLowerCase() == "off")
	{
	    document.getElementById("nandq1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("nandq1Out").innerHTML = "That is NOT the answer. (Pun intended) Remember, NAND is the inverse of AND";
	}
}

function xorq1Submit()
{
	answer = document.getElementById("xorq1").value;

	if(answer == "0" || answer.toLowerCase() == "false" || answer.toLowerCase() == "off" || answer.toLowerCase() == "no")
	{
	    document.getElementById("xorq1Out").innerHTML = "Correct! Since x has the same value as x and XOR is false for x &#8853; x";
	}
	else
	{
	    document.getElementById("xorq1Out").innerHTML = "Remember, XOR requires only one value to be true. If both values are true, will XOR be true or false? Look back to the truth table";
	}
}
function aq1Submit()
{
	answer = document.getElementById("aq1").value;

	if(answer.toLowerCase() == "and")
	{
	    document.getElementById("aq1Out").innerHTML = "Correct! If we apply the AND operator to X and Y, we would get the Carry column!";
	}
	else
	{
	    document.getElementById("aq1Out").innerHTML = "Not quite. Look though the other tutorials on true/false boolean algebra statements.";
	}
}

function aq2Submit()
{
	answer = document.getElementById("aq2").value;

	if(answer.toLowerCase() == "xor" || answer.toLowerCase() == "eor")
	{
	    document.getElementById("aq2Out").innerHTML = "Correct! If we apply the XOR operator to X and Y, we would get the Sum column!";
	}
	else
	{
	    document.getElementById("aq2Out").innerHTML = "Not quite. Look though the other tutorials on true/false boolean algebra statements.";
	}
}

function aq3Submit()
{
	answer = document.getElementById("aq3").value;

	if(answer.toLowerCase() == "or")
	{
	    document.getElementById("aq3Out").innerHTML = "Correct! If we apply OR to both the carries we can combine the carries without losing any information";
	}
	else if(answer.toLowerCase() == "xor" || answer.toLowerCase() == "eor")
	{
	    document.getElementById("aq3Out").innerHTML = "Almost! Xor would work, but it's a very complex gate, and we don't need something that complicated.";
	}
	else
	{
	    document.getElementById("aq3Out").innerHTML = "Not quite. Look though the other tutorials on true/false boolean algebra statements.";
	}
}
