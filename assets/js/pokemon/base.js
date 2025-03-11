var		assetsbase = "/assets/";

function getIcon( name ) {
	let		elem, path;

	path = name.toLowerCase().replaceAll(" ","");

	elem = document.createElement( "img" );
	elem.setAttribute( "class", "icon " + path + "-icon" );
	elem.setAttribute( "alt", name );
	elem.setAttribute( "src", assetsbase + "icons/pokemon/go/" + path + ".png" );

	return elem;
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


