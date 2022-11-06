const reps = [ "un", "sm", "oc", "tc" ];

function randomBinary( bits, domid ) {
	var i;

	document.getElementById(domid).value = "";

	for( i = 0; i < bits; i++)
		document.getElementById(domid).value += Math.floor(Math.random() * 2);
}

function decabsvalue( binary, rep ) {
	var dec, bin2, bits;
	var i, carry;

	bits = binary.length;

	bin2 = [];
	for( i = 0; i < bits; i++ )
		bin2[i] = binary[i];


	if(( binary[0] == '1' ) && ( rep != "un" )) {
		if( rep == "sm" ) {
			bin2[0] = '0';
		}
		else {
			for( i = 0; i < bits; i++ ) {
				if( binary[i] == '1' )
					bin2[i] = '0';
				else
					bin2[i] = '1';
			}

			if( rep == "tc" ) {
				carry = 1;
				for( i = (bits - 1); carry && i >= 0; i-- ) {
					if( bin2[i] == '0' ) {
						bin2[i] = '1';
						carry = 0;
					}
					else {
						bin2[i] = '0';
					}
				}
			}
		}
	}

	dec = 0;
	for( i = 0; i < bin2.length; i++ ) {
		if ( bin2[i] == '1' ) {
			dec += Math.pow(2, (bin2.length - i - 1));
		}
	}

	return dec;
}

function decbincompare( dec, binary, rep ) {
	var i;

	if( isNaN(dec) )
		return 0;

	// Get those wierd, sign mag, ones comp two zeros
	if(( dec == 0 ) && ( rep == "sm" )) {
		if(( binary[0] != '0' ) && ( binary[0] != '1' ))
			return 0;

		for( i = 1; i < binary.length; i++ )
			if( binary[i] != '0' )
				return 0;

		return 1;
	}

	if(( dec == 0 ) && ( rep == "oc" )) {
		for( i = 1; i < binary.length; i++ )
			if( binary[i] != binary[i-1] )
				return 0;
		return 1;
	}

	if( Math.abs(dec) != decabsvalue(binary, rep) )
		return 0;

	if(( rep != "un" ) && ( binary[0] == '1' ) && ( dec >= 0 ))
		return 0;

	if(( rep == "un" ) && ( binary[0] == '1' ) && ( dec < 0 ))
		return 0;

	if(( binary[0] == '0' ) && ( dec < 0 ))
		return 0;

	return 1;
}

function pnreset() {
	// rep, binary, pos, neg, response
	var bits, rep;

	rep = Math.floor(Math.random() * 4);
	document.getElementById("pnrep").value = reps[rep];

	bits = 1 + Math.floor(Math.random() * 15);
	randomBinary( bits, "pnbinary" );

	document.getElementById("pnpos").style.backgroundColor = "#3456a3";
	document.getElementById("pnneg").style.backgroundColor = "#3456a3";
	document.getElementById("pnresponse").innerHTML = "<i>Waiting for input</i>";
}

function pncheck( ui ) {
	var rep, binary, msb;

	rep = document.getElementById("pnrep").value;
	binary = document.getElementById("pnbinary").value;
	msb = binary[0];

	if( rep == "un" ) {
		if( ui == 0 ) {
			// correct
			document.getElementById("pnpos").style.backgroundColor = "#00FF0055";
			document.getElementById("pnresponse").innerHTML = "<span class=\"check\">&check; Correct</span>";
		}
		else {
			// incorrect
			document.getElementById("pnneg").style.backgroundColor = "#FF000055";
			document.getElementById("pnresponse").innerHTML = "<span class=\"cross\">&cross; Incorrect</span>. All unsigned binary numbers are positive regardless of the MSB.";
		}
	}
	else {
		if (( ui == 0 ) && ( msb == "0" )) {
			// correct positive
			document.getElementById("pnpos").style.backgroundColor = "#00FF0055";
			document.getElementById("pnresponse").innerHTML = "<span class=\"check\">&check; Correct</span>";
		}
		else if (( ui == 1 ) && ( msb == "1" )) {
			// correct negative
			document.getElementById("pnneg").style.backgroundColor = "#00FF0055";
			document.getElementById("pnresponse").innerHTML = "<span class=\"check\">&check; Correct</span>";
		}
		else if ( ui == 0 ) {
			// incorrect positive
			document.getElementById("pnpos").style.backgroundColor = "#FF000055";
			document.getElementById("pnresponse").innerHTML = "<span class=\"cross\">&cross; Incorrect</span>. An MSB of 1 indicates a negative number in all representations.";

		}
		else {
			// incorrect negative
			document.getElementById("pnneg").style.backgroundColor = "#FF000055";
			document.getElementById("pnresponse").innerHTML = "<span class=\"cross\">&cross; Incorrect</span>. An MSB of 0 indicates a positive number in all representations.";
		}
	}
}


function bdreset() {
	// rep, binary, dec, response
	var bits, rep;

	rep = Math.floor(Math.random() * 4);
	document.getElementById("bdrep").value = reps[rep];

	bits = 1 + Math.floor(Math.random() * 15);
	randomBinary( bits, "bdbinary" );

	document.getElementById("bddec").value = "";
	document.getElementById("bddec").style.backgroundColor = "#FFFFFF";
	document.getElementById("bdresponse").innerHTML = "<i>Waiting for input</i>";
}

function bdcheck() {
	var rep, dec, binary;
	var absdec;

	rep = document.getElementById("bdrep").value;
	binary = document.getElementById("bdbinary").value;
	dec = Number(document.getElementById("bddec").value);

	if( decbincompare( dec, binary, rep ) ) {
		document.getElementById("bddec").style.backgroundColor = "#00FF0055";
		document.getElementById("bdresponse").innerHTML = "<span class=\"check\">&check; Correct</span>";
	}
	else {
		document.getElementById("bddec").style.backgroundColor = "#FF000055";
		document.getElementById("bdresponse").innerHTML = "<span class=\"cross\">&cross; Incorrect</span>";
	}
}

function dbreset() {
	// dec, bit, rep, binary, response
	var bits, dec, rep;

	rep = Math.floor(Math.random() * 4);
	bits = 1 + Math.floor(Math.random() * 15);

	switch( rep ) {
		case 0: //un
			dec = Math.floor(Math.random() * Math.pow(2, bits));
			break;
		case 1: //sm
		case 2: //oc
			dec = Math.floor(Math.random() * (Math.pow(2, bits)-1)) - (Math.pow(2, bits-1)-1);
			break;
		case 3: //tc
			dec = Math.floor(Math.random() * (Math.pow(2, bits))) - Math.pow(2, bits-1);
			break;
	}

	document.getElementById("dbrep").value = reps[rep];
	document.getElementById("dbbit").value = bits;
	document.getElementById("dbdec").value = dec;
	document.getElementById("dbbinary").value = "";
	document.getElementById("dbbinary").style.backgroundColor = "#FFFFFF";
	document.getElementById("dbresponse").innerHTML = "<i>Waiting for input</i>";
}

function dbcheck() {
	var rep, dec, binary, bits;

	rep = document.getElementById("dbrep").value;
	dec = Number(document.getElementById("dbdec").value);
	bits = Number(document.getElementById("dbbit").value);
	binary = document.getElementById("dbbinary").value;

	if(( binary[0] == '+' ) || ( binary[0] == '-' )) {
		document.getElementById("dbbinary").style.backgroundColor = "#FF000055";
		document.getElementById("dbresponse").innerHTML = "<span class=\"cross\">&cross; Incorrect</span>. We don't use + or - when <br> representing numbers in binary";
		return;
	}

	if( binary.length != bits ) {
		document.getElementById("dbbinary").style.backgroundColor = "#FF000055";
		document.getElementById("dbresponse").innerHTML = "<span class=\"cross\">&cross; Incorrect</span>. Wrong number of bits";
		return;
	}

	if( decbincompare( dec, binary, rep ) ) {
		document.getElementById("dbbinary").style.backgroundColor = "#00FF0055";
		document.getElementById("dbresponse").innerHTML = "<span class=\"check\">&check; Correct</span>";
	}
	else {
		document.getElementById("dbbinary").style.backgroundColor = "#FF000055";
		document.getElementById("dbresponse").innerHTML = "<span class=\"cross\">&cross; Incorrect</span>";
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
