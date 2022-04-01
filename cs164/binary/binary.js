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

function smq1Submit()
{
	if(document.getElementById("smq1").value == "-25")
	{
	    document.getElementById("smq1Out").innerHTML = "Correct!";
	}
	else if(document.getElementById("smq1").value == "25")
	{
	    document.getElementById("smq1Out").innerHTML = "Not quite. You have the magnitude of the value correct. Check the MSB.";
	}
	else
	{
	    document.getElementById("smq1Out").innerHTML = "Good try but not right! Try looking again at the table.";
	}
}

function ocq1Submit()
{
	if(document.getElementById("ocq1").value == "10111111")
	{
	    document.getElementById("ocq1Out").innerHTML = "Correct!";
	}
	else if(document.getElementById("ocq1").value == "01000000")
	{
	    document.getElementById("ocq1Out").innerHTML = "Not quite. You have converted 64 to binary correctly, however I want -64 in one's complement.";
	}
	else if(document.getElementById("ocq1").value == "11000000")
	{
	    document.getElementById("ocq1Out").innerHTML = "Not quite. If we were looking for sign magnitude, you would be correct. However, we want to do one's complement.";
	}
	else
	{
	    document.getElementById("ocq1Out").innerHTML = "Good try but not right! Try looking through the method above.";
	}
}

function tcq1Submit()
{
	if(document.getElementById("tcq1").value == "10000110")
	{
	    document.getElementById("tcq1Out").innerHTML = "Correct!";
	}
	else if(document.getElementById("tcq1").value == "10000101")
	{
	    document.getElementById("tcq1Out").innerHTML = "Not quite. You have converted -122 to one's complement. However, we want two's complement. What is the difference between one's complement and two's complement?";
	}
	else if(document.getElementById("tcq1").value == "10000100")
	{
	    document.getElementById("tcq1Out").innerHTML = "Not quite. You converted the value to binary, inverted the bits and added one. Remember to carry the one over to the next place value.";
	}
	else if(document.getElementById("tcq1").value == "11111010")
	{
	    document.getElementById("tcq1Out").innerHTML = "Not quite. If we were doing sign magnitude, you would be correct. However, we want to do two's complement.";
	}
	else
	{
	    document.getElementById("tcq1Out").innerHTML = "Good try but not right! Try looking through the method above.";
	}
}

function fq1Submit()
{
	if(document.getElementById("fq1").value == "8.1875")
	{
	    document.getElementById("fq1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("fq1Out").innerHTML = "Not quite. Look again at the table";
	}
}

function fq2Submit()
{
	if(document.getElementById("fq2").value == 0.1001)
	{
	    document.getElementById("fq2Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("fq2Out").innerHTML = "Not quite. Look again at the table";
	}
}

function aq1Submit()
{
	if(document.getElementById("aq1").value == 1101)
	{
	    document.getElementById("aq1Out").innerHTML = "Correct!";
	}
	else if(document.getElementById("aq1").value == 13)
	{
	    document.getElementById("aq1Out").innerHTML = "That's the answer in base-10. I want the 4 bit binary answer.";
	}
	else
	{
	    document.getElementById("aq1Out").innerHTML = "Not quite. Look again at the table";
	}
}

function sq1Submit()
{
	if(document.getElementById("sq1").value == "0111")
	{
	    document.getElementById("sq1Out").innerHTML = "Correct!";
	}
	else
	{
	    document.getElementById("sq1Out").innerHTML = "Not quite. Look again through the process";
	}
}