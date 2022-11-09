// God I hate doing this for hex but im not in the mood to actually learn JS
const hexdigits = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F" ];
const reps = [ "un", "sm", "oc", "tc" ];

function randomHex( digits, domid ) {
	var i;

	document.getElementById(domid).value = "";

	for( i = 0; i < digits; i++)
		document.getElementById(domid).value += hexdigits[Math.floor(Math.random() * 16)];
}

function randomBase4( digits, domid ) {
	var i;

	document.getElementById(domid).value = "";

	for( i = 0; i < digits; i++)
		document.getElementById(domid).value += Math.floor(Math.random() * 4);
}

function randomBinary( bits, domid ) {
	var i;

	document.getElementById(domid).value = "";

	for( i = 0; i < bits; i++)
		document.getElementById(domid).value += Math.floor(Math.random() * 2);
}


function hextodecimal( hex ) {
	var i, dec;

	dec = 0;
	for( i = 0; i < hex.length; i++ )
		dec += (Math.pow(16, (hex.length - i - 1)) * hexdigits.indexOf(hex[i]));

	return dec;
}

function quartodecimal( quar ) {
	var i, dec;

	dec = 0;
	for( i = 0; i < quar.length; i++ )
		dec += (Math.pow(4, (quar.length - i - 1)) * Number(quar[i]));

	return dec;
}

function binarytodecimal( bin ) {
	var i, dec;

	dec = 0;
	for( i = 0; i < bin.length; i++ ) {
		if( bin[i] == '1' ) {
			dec += Math.pow(2, (bin.length - i - 1));
		}
	}

	return dec;
}
