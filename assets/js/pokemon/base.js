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
	elem.setAttribute( "src", getIconSrc( name ) );

	return elem;
}

function getIconSrc( name ) { 
	let		path;
	path = name.toLowerCase().replaceAll(" ","");
	return assetsbase + "icons/pokemon/go/" + path + ".png";
}

function getPokeballIcon( color="yellow" ) {
	let		img;

	img = dcE( "img" );
	img.setAttribute( "alt", "" );
	img.setAttribute( "src", assetsbase + "icons/pokemon/pokeball.svg" );
	img.setAttribute( "class", "pokeball-" + color );

	return img;
}

function pokeballdivider( ) {
	let		div, i;

	div = dcE( "div" );
	div.setAttribute( "class", "pokeball-divider" );

	for( i = 0; i < 3; i++ )
		div.appendChild( getPokeballIcon() );

	return div;
}

function getPkmnSprite( dpkmn ) {
	let		img;

	img = dcE( "img" );
	img.setAttribute( "alt", getPkmnField(dpkmn,"name") );
	img.setAttribute( "src", getPkmnSpriteSrc(dpkmn) );
	img.setAttribute( "class", "sprite" );

	return img;
}

function getIVBarSrc( n ) {
	let		src;
	src = n;
	if( n < 10 )
		src = "0" + src;
	return assetsbase + "icons/pokemon/go/iv/" + src + ".svg";
}

function pokeballMarker( ) {
	let		img;

	img = document.createElement( "img" );
	img.setAttribute( "class", "pokeball-marker" );
	img.setAttribute( "src", assetsbase + "icons/pokemon/pokeball.svg" );
	img.setAttribute( "alt", "" );

	return img;
}

function pkmnDetailsSummary() {
	let		det, sum, img, div;

	det = document.createElement( "details" );
	det.setAttribute( "class", "pkmn-details" );

	sum = document.createElement( "summary" );

	img = pokeballMarker();

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


function newPkmn( di, ivs=[0,0,0], l=0, h=0, w=0 ) {
	let		pkmn;

	pkmn = {
		"di": di,
		"atk": ivs[0],
		"def": ivs[1],
		"sta": ivs[2],
		"lvl": l,
		"ht": h,
		"wt": w
	};

	return pkmn;
}
