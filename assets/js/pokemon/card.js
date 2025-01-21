function pokecard( title="", cols=1 ) {
	var		card, c;

	card = document.createElement( "div" );
	card.classList.add( "pokemon-card" );

	if( title.length ) {
		card.appendChild( document.createElement( "h2" ) );
		card.lastChild.classList.add( "card-title" );
		card.lastChild.classList.add( "pkmn-name" );

		if( title.endsWith( ")" ) ) {
			card.lastChild.appendChild( document.createTextNode( title.split(" (")[0] ) );
			card.lastChild.appendChild( document.createElement( "br" ) );
			card.lastChild.appendChild( document.createElement( "span" ) );
			card.lastChild.lastChild.appendChild( document.createTextNode( title.split(" (")[1].slice(0,-1) ) );
			card.lastChild.lastChild.classList.add("form");
		}
		else {
			card.lastChild.appendChild( document.createTextNode( title ) );
		}
	}
	else {
		card.appendChild( document.createElement( "div" ) );
		card.lastChild.classList.add( "card-blank-title" );
	}

	card.appendChild( document.createElement( "div" ) );
	card.lastChild.classList.add( "card-dot" );

	card.appendChild( document.createElement( "div" ) );
	card.lastChild.classList.add( "card-body" );
	card.lastChild.classList.add( "card-cols-" + cols.toString() );

	for( c = 0; c < cols; c++ ) {
		card.lastChild.appendChild( cardColumn() );
		card.lastChild.lastChild.classList.add( "card-col-" + c );
	}

	return card;
}

function cardColumn( ) {
	var		col;

	col = document.createElement( "div" );
	col.classList.add( "card-column" );

	return col;
}

function cardRow( ) {
	var		row;

	row = document.createElement( "div" );
	row.classList.add( "card-row" );

	return row;
}

function AppendRow( card, row, c=0 ) {
	card.childNodes[2].childNodes[c].appendChild( row );

	return row;
}

function appendRow( card, c, row ) {
	card.childNodes[2].childNodes[c].appendChild( row );

	return row;
}

function cardRowHeader( text, cl="" ) {
	var		elem;

	elem = document.createElement( "h3" );
	elem.classList.add( "card-row-header" );
	elem.appendChild( document.createTextNode( text ) );
	if( cl )
		elem.classList.add( cl );

	return elem;
}

function cardRowSubHeader( text, cl="" ) {
	var elem;

	elem = document.createElement( "h5" );
	elem.classList.add( "card-row-subheader" );
	elem.appendChild( document.createTextNode( text ) );
	if( cl )
		elem.classList.add( cl );

	return elem;
}

function cardRowRange( vals, unit ) {
	var		row;

	row = document.createElement( "div" );
	row.classList.add( "card-row" );
	row.classList.add( "card-row-range" );
	row.appendChild( document.createTextNode(vals[0]) );
	row.appendChild( document.createTextNode(unit) );
	row.appendChild( document.createTextNode(" - ") );
	row.appendChild( document.createTextNode(vals[1]) );
	row.appendChild( document.createTextNode(unit) );

	return row;
}

function cardRowText( text, cl="" ) {
	var		row;

	row = document.createElement( "div" );
	row.classList.add( "card-row" );
	row.appendChild( document.createTextNode(text) );
	if( cl )
		row.classList.add( cl );

	return row;
}

function cardRowError( text ) {
	var		row;

	row = cardRowText( text );
	row.classList.add( "card-row-error" );

	return row;
}

function cardRowSpacer( ) {
	var		row;

	row = document.createElement( "br" );
	row.classList.add( "card-row-spacer" );

	return row;
}

function pokemonImgSrc( pkmn ) {
	var		dir, img;

	dir = pkmn["dex-num"].toString();
	img = pkmn["dex-index"];

	while( dir.length < 4 )
		dir = "0" + dir;

	return dir + "/" + img + ".png";
}


