var		assetsbase = "/assets/";
var		months = {
	"01": "January",
	"02": "February",
	"03": "March",
	"04": "April",
	"05": "May",
	"06": "June",
	"07": "July",
	"08": "August",
	"09": "September",
	"10": "October",
	"11": "November",
	"12": "December"
};

function dCE( elem ) {
	return document.createElement( elem );
}
function dcTN( text ) {
	return document.createTextNode( text );
}

function getYear( date ) {
	return date.substring(0,4);
}
function getMonth( date ) {
	return date.substring(5,7);
}
function getDay( date ) {
	return date.substring(8);
}
function prettyDate( date ) {
	return months[getMonth(date)].substring(0,3) + " " + getDay(date) + ", " + getYear(date);
}

function getIcon( name ) {
	let		elem, path;

	path = name.toLowerCase().replaceAll(" ","");

	elem = document.createElement( "img" );
	elem.setAttribute( "class", "icon " + path + "-icon" );
	elem.setAttribute( "alt", name );
	elem.setAttribute( "src", assetsbase + "icons/pokemon/go/" + path + ".png" );

	return elem;
}

function getIVBarSrc( n ) {
	let		src;
	src = n;
	if( n < 10 )
		src = "0" + src;
	return assetsbase + "icons/pokemon/go/iv/" + src + ".svg";
}

function pkmnDetailsSummary() {
	let		det, sum, img, div;

	det = document.createElement( "details" );
	det.setAttribute( "class", "pkmn-details" );

	sum = document.createElement( "summary" );

	img = document.createElement( "img" );
	img.setAttribute( "class", "pokeball-marker" );
	img.setAttribute( "src", assetsbase + "icons/pokemon/pokeball.svg" );
	img.setAttribute( "alt", "" );

	div = document.createElement( "div" );
	div.setAttribute( "class", "pkmn-summary" );

	det.appendChild( sum );
	sum.appendChild( img );
	sum.appendChild( div );

	return det;
}

function appendToPkmnSummary( det, elem ) {
	det.childNodes[0].childNodes[1].appendChild( elem );
}

function appendToPkmnDetails( det, elem ) {
	det.appendChild( elem );
}


