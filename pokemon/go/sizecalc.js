function init() {
	initselect();
}

function validateInput( ) {
	var		select, wtinp, htinp, atinp, dfinp, hpinp;
	var		size = [ "xxs", "xs", "m", "xl", "xxl" ];
	var		pkmn;
	var		d, s, v;
	
	select = document.getElementById("pick-pokemon").value;
	wtinp = document.getElementById( "input-weight" ).value;
	htinp = document.getElementById( "input-height" ).value;
	atinp = document.getElementById( "input-atk" ).value;
	dfinp = document.getElementById( "input-def" ).value;
	hpinp = document.getElementById( "input-hp" ).value;

	for( d in dex )
		if( dex[d]["name"] == select )
			pkmn = dex[d];

	if( ! pkmn ) {
		errorfield( "pick-pokemon", "Invalid Selection" );
		return 0;
	}

	if( ! wtinp ) {
		errorfield( "input-weight", "Weight must be a number" );
		return 0;
	}
	if( wtinp <= 0 ) {
		errorfield( "input-weight", "Weight cannot be negative" );
		return 0;
	}
	if( ! htinp ) {
		errorfield( "input-height", "Height must be a number" );
		return 0;
	}
	if( htinp <= 0 ) {
		errorfield( "input-weight", "Height cannot be negative" );
		return 0;
	}

	pkmn["wt-i"] = parseFloat(wtinp);
	pkmn["ht-i"] = parseFloat(htinp);
	pkmn["xxl-i"] = document.getElementById( "input-xxl" ).checked;

	for( s in size ) {
		if( document.getElementById( "input-" + size[s] ).checked ) {
			pkmn["sz-i"] = size[s];
			break;
		}
	}

	// TODO pumpkaboo/gourgeist
	if( pkmn["xxs-lower-bound"] <= pkmn["ht-i"] &&
	    pkmn["ht-i"] < pkmn["xs-lower-bound"] ) {
		if( !pkmn["sz-i"] )
			pkmn["sz-i"] = "xxs";
		else if( pkmn["sz-i"] != "xxs" )
			console.log( "warning not xxs" );
			// warning maybe not xxs
	}
	else if( pkmn["xs-lower-bound"] <= pkmn["ht-i"] &&
	         pkmn["ht-i"] < pkmn["m-lower-bound"] ) {
		if( !pkmn["sz-i"] )
			pkmn["sz-i"] = "xs";
		else if( pkmn["sz-i"] != "xs" )
			console.log( "warning not xs" );
			// warning maybe not xs
	}
	else if( pkmn["m-lower-bound"] <= pkmn["ht-i"] &&
	         pkmn["ht-i"] <= pkmn["m-upper-bound"] ) {
		if( !pkmn["sz-i"] )
			pkmn["sz-i"] = "m";
		else if( pkmn["sz-i"] != "m" )
			console.log( "warning not m" );
			// warning maybe not m
	}
	else if( pkmn["m-upper-bound"] < pkmn["ht-i"] &&
	         pkmn["ht-i"] <= pkmn["xl-upper-bound"] ) {
		if( !pkmn["sz-i"] )
			pkmn["sz-i"] = "xl";
		else if( pkmn["sz-i"] != "xl" )
			console.log( "warning not xl" );
			// warning maybe not xl
	}
	else if( pkmn["xl-upper-bound"] < pkmn["ht-i"] &&
	         pkmn["ht-i"] <= pkmn["xxl-upper-bound"] ) {
		if( !pkmn["sz-i"] )
			pkmn["sz-i"] = "xxl";
		else if( pkmn["sz-i"] != "xxl" )
			console.log( "warning not xxl" );
			// warning maybe not xxl
	}
	else {
		// warning maybe out of range
		if( pkmn["ht-i"] < pkmn["xxs-lower-bound"] ) {
			console.log( "warning too short" );
			// warning maybe too short
		}
		else if( pkmn["ht-i"] > pkmn["xxl-lower-bound"] ) {
			console.log( "warning too tall" );
			// warning maybe too tall
		}

	}

	pkmn["wt-a"] = pkmn["weight-avg"];
	pkmn["ht-a"] = pkmn["height-avg"];

	pkmn["wt-n"] = pkmn["wt-i"] - 0.005;
	pkmn["wt-x"] = pkmn["wt-i"] + 0.005;
	pkmn["ht-n"] = pkmn["ht-i"] - 0.005;
	pkmn["ht-x"] = pkmn["ht-i"] + 0.005;

	if( pkmn["sz-i"] == "xxs" ) {
		if( pkmn["ht-n"] < pkmn["xxs-lower-bound"] )
			pkmn["ht-n"] = pkmn["xxs-lower-bound"];
	}
	else if( pkmn["sz-i"] == "xs" ) {
		if( pkmn["ht-n"] < pkmn["xs-lower-bound"] )
			pkmn["ht-n"] = pkmn["xs-lower-bound"];
	}
	else if( pkmn["sz-i"] == "m" ) {
		if( pkmn["ht-n"] < pkmn["m-lower-bound"] )
			pkmn["ht-n"] = pkmn["m-lower-bound"];
		if( pkmn["ht-x"] > pkmn["m-upper-bound"] )
			pkmn["ht-x"] = pkmn["m-upper-bound"];
	}
	else if( pkmn["sz-i"] == "xl" ) {
		if( pkmn["ht-x"] > pkmn["xl-upper-bound"] )
			pkmn["ht-x"] = pkmn["xl-upper-bound"];
	}
	else if( pkmn["sz-i"] == "xxl" ) {
		if( pkmn["ht-x"] > pkmn["xxl-upper-bound"] )
			pkmn["ht-x"] = pkmn["xxl-upper-bound"];
	}

	if( (!atinp) && (!dfinp) && (!hpinp) ) {
		// everyones empty no issues, points just wont be calculated
		return pkmn;
	}

	// Now everyone has got something
	v = 1;
	
	if( !atinp || parseInt(atinp) != parseFloat(atinp) ||
	    parseInt(atinp) < 0 || 15 < parseInt(atinp) ) {
		errorfield( "input-atk", "" );
		errorfield( "input-ivs-error", "Attack must be a whole number between 0 and 15" );
		v = 0;
	}
	if( !dfinp || parseInt(dfinp) != parseFloat(dfinp) ||
	    parseInt(dfinp) < 0 || 15 < parseInt(dfinp) ) {
		errorfield( "input-def", "" );
		errorfield( "input-ivs-error", "Defense must be a whole number between 0 and 15" );
		v = 0;
	}
	if( !hpinp || parseInt(hpinp) != parseFloat(hpinp) ||
	    parseInt(hpinp) < 0 || 15 < parseInt(hpinp) ) {
		errorfield( "input-hp", "" );
		errorfield( "input-ivs-error", "HP must be a whole number between 0 and 15" );
		v = 0;
	}

	if( ! v )
		errorfield( "input-ivs-error", "Showcase points will not be calculated" );
	else {
		pkmn["at-i"] = parseInt( atinp );
		pkmn["df-i"] = parseInt( dfinp );
		pkmn["hp-i"] = parseInt( hpinp );
	}

	return pkmn;
}

function generate( ) {
	var		output;
	var		pkmn0, pkmn1;
	var		evo, s, e, d, f;
	var		xxr;

	resetOutput();
	pkmn0 = validateInput();
	if( ! pkmn0 )
		return;

	if( pkmn0["at-i"] )
		calcShowcasePoints( pkmn0 );

	output = document.getElementById("pokemon-info");


	output.appendChild( pokemonCard( pkmn0 ) );

	if( ! pkmn0["evolves-into"] ) {
		addCardRow( output.lastChild );
		output.lastChild.lastChild.classList.add( "error-msg" );
		output.lastChild.lastChild.appendChild( document.createTextNode( pkmn0["name"] + " does not evolve" ) );
		return;
	}
	if( ! pkmn0["xx-class"] ) {
		addCardRow( output.lastChild );
		output.lastChild.lastChild.classList.add( "error-msg" );
		output.lastChild.lastChild.appendChild( document.createTextNode( "Cannot predict evolution sizes" ) );
		return;
	}

	evo = getEvolutions( pkmn0 );

	for( s = 0; s < evo.length; s++ ) {
		if( evo[s].length == 0 )
			break;

		for( e = 0; e < evo[s].length; e++ ) {
			pkmn1 = evo[s][e];
			if( ! pkmn1["xx-class"] ) {
				output.appendChild( pokemonCard( pkmn1 ) );
				continue;
			}
			calcNewSizes( pkmn0, pkmn1 );
			if( pkmn0["pt-n"] ) {
				pkmn1["at-i"] = pkmn0["at-i"];
				pkmn1["df-i"] = pkmn0["df-i"];
				pkmn1["hp-i"] = pkmn0["hp-i"];
				pkmn1["xxl-i"] = pkmn0["xxl-i"];
				calcShowcasePoints( pkmn1 );
			}
			output.appendChild( pokemonCard( pkmn1 ) );
		}
	}
}

function getEvolutions( pkmn ) {
	var		epkmn;
	var		e, s, ne;
	var		evo = [];

	if( ! pkmn["evolves-into"] ) {
		return evo;
	}

	evo.push( [] );
	for( e = 0; e < pkmn["evolves-into"].length; e++ ) {
		epkmn = dex[pkmn["evolves-into"][e]];
		evo[0].push( epkmn );
	}

	for( s = 0; s < 3; s++ ) {
		if( evo[s].length == 0 )
			break;
		evo.push( [] );
		for( e = 0; e < evo[s].length; e++ ) {
			if( ! evo[s][e]["evolves-into"] )
				continue;

			for( ne = 0; ne < evo[s][e]["evolves-into"].length; ne++ ) {
				epkmn = dex[evo[s][e]["evolves-into"][ne]];
				evo[s+1].push( epkmn );
			}
		}
	}

	return evo;
}

function calcShowcasePoints( pkmn ) {
	var		htns, wtns, htxs, wtxs, ivs, xxl;

	xxl = 0;
	if( pkmn["xxl-i"] )
		xxl = 178;

	htns = ( pkmn["ht-n"] / pkmn["ht-a"] ) / pkmn["xx-class"];
	htxs = ( pkmn["ht-x"] / pkmn["ht-a"] ) / pkmn["xx-class"];
	wtns = ( pkmn["wt-n"] / pkmn["wt-a"] ) / ( 1.5 + pkmn["xx-class"] - 1 );
	wtxs = ( pkmn["wt-x"] / pkmn["wt-a"] ) / ( 1.5 + pkmn["xx-class"] - 1 );
	ivs = ( pkmn["at-i"] + pkmn["df-i"] + pkmn["hp-i"] ) / 45;

	pkmn["pt-n"] = (800 * htns) + (150 * wtns) + (50 * ivs) + xxl;
	pkmn["pt-x"] = (800 * htxs) + (150 * wtxs) + (50 * ivs) + xxl;
}

function calcNewSizes( pkmn0, pkmn1 ) {
	var		xxr;

	pkmn1["wt-a"] = parseFloat(pkmn1["weight-avg"]);
	pkmn1["ht-a"] = parseFloat(pkmn1["height-avg"]);

	xxr = (pkmn1["xx-class"] - 1.5) / (pkmn0["xx-class"] - 1.5);
	pkmn1["ht-n"] = pkmn0["ht-n"] / pkmn0["ht-a"];
	pkmn1["ht-x"] = pkmn0["ht-x"] / pkmn0["ht-a"];
	pkmn1["wt-n"] = pkmn0["wt-n"] / pkmn0["wt-a"];
	pkmn1["wt-x"] = pkmn0["wt-x"] / pkmn0["wt-a"];


	if( pkmn0["xxl-i"] ) {
		pkmn1["wt-n"] -= pkmn1["ht-x"];
		pkmn1["wt-x"] -= pkmn1["ht-n"];
		pkmn1["ht-n"] = 1.5 + (( pkmn1["ht-n"] - 1.5 ) * xxr );
		pkmn1["ht-x"] = 1.5 + (( pkmn1["ht-x"] - 1.5 ) * xxr );
		pkmn1["wt-n"] += pkmn1["ht-x"];
		pkmn1["wt-x"] += pkmn1["ht-n"];
	}

	pkmn1["ht-n"] *= pkmn1["ht-a"];
	pkmn1["ht-x"] *= pkmn1["ht-a"];
	pkmn1["wt-n"] *= pkmn1["wt-a"];
	pkmn1["wt-x"] *= pkmn1["wt-a"];
}

function numDisplay( val ) {
	return ( Math.floor( val * 100 ) / 100 );
}

function pokemonCard( pkmn ) {
	var		card, elem, err, name;

	card = document.createElement( "div" );
	card.classList.add( "pokemon-card" );

	card.appendChild( document.createElement( "h3" ) );
	card.lastChild.classList.add( "card-title" );
	card.lastChild.classList.add( "pkmn-name" );
	name = pkmn["name"];
	if( pkmn["special-char"] )
		name = pkmn["special-char"];
	if( name.endsWith( ")" ) ) {
		card.lastChild.appendChild( document.createTextNode( name.split(" (")[0] ) );
		card.lastChild.appendChild( document.createElement( "br" ) );
		card.lastChild.appendChild( document.createElement( "span" ) );
		card.lastChild.lastChild.appendChild( document.createTextNode( name.split(" (")[1].slice(0,-1) ) );
		card.lastChild.lastChild.classList.add("form");
	}
	else {
		card.lastChild.appendChild( document.createTextNode( name ) );
	}

	if( ! pkmn["available"] ) {
		addCardRow( card );
		elem = document.createElement( "div" );
		elem.classList.add( "error-msg" );
		elem.appendChild(document.createTextNode("Not yet added to game"));
		card.classList.add( "unavailable" );
		card.lastChild.appendChild( elem );
	}

	addCardRow( card );
	card.lastChild.classList.add( "pokemon-img" );
	card.lastChild.appendChild( document.createElement( "img" ) );
	card.lastChild.lastChild.src = "./dex/" + pokemonImgSrc( pkmn );
	card.lastChild.lastChild.alt = pkmn["name"];
	if( pkmn["special-char"] )
		card.lastChild.lastChild.alt = pkmn["name"];

	elem = document.createElement( "h4" );
	elem.classList.add( "card-row-header" );
	elem.appendChild(document.createTextNode("Average Size"));
	card.appendChild( elem );

	addCardRow( card );
	elem = document.createElement( "div" );
	elem.classList.add( "avg-weight" );
	elem.appendChild(document.createTextNode(pkmn["weight-avg"] + "kg"));
	card.lastChild.appendChild( elem );
	elem = document.createElement( "div" );
	elem.classList.add( "avg-height" );
	elem.appendChild(document.createTextNode(pkmn["height-avg"] + "m"));
	card.lastChild.appendChild( elem );

	if( pkmn["ht-i"] ) {
		elem = document.createElement( "h4" );
		elem.classList.add( "card-row-header" );
		elem.appendChild(document.createTextNode("Input Size"));
		card.appendChild( elem );

		addCardRow( card );
		elem = document.createElement( "div" );
		elem.classList.add( "inp-weight" );
		elem.appendChild(document.createTextNode(pkmn["wt-i"] + "kg"));
		card.lastChild.appendChild( elem );
		elem = document.createElement( "div" );
		elem.classList.add( "inp-height" );
		elem.appendChild(document.createTextNode(pkmn["ht-i"] + "m"));
		card.lastChild.appendChild( elem );
	}
	else {
		elem = document.createElement( "h4" );
		elem.classList.add( "card-row-header" );
		elem.appendChild(document.createTextNode("Size Range"));
		card.appendChild( elem );

		addCardRow( card );
		elem = document.createElement( "div" );
		elem.classList.add( "weight-range" );
		elem.appendChild(document.createTextNode(numDisplay(pkmn["wt-n"]) + "kg - " + numDisplay(pkmn["wt-x"]) + "kg"));
		card.lastChild.appendChild( elem );

		addCardRow( card );
		elem = document.createElement( "div" );
		elem.classList.add( "height-range" );
		elem.appendChild(document.createTextNode(numDisplay(pkmn["ht-n"]) + "m - " + numDisplay(pkmn["ht-x"]) + "m"));
		card.lastChild.appendChild( elem );
	}

	if( pkmn["pt-n"] ) {
		elem = document.createElement( "h4" );
		elem.classList.add( "card-row-header" );
		elem.appendChild(document.createTextNode("Showcase Score"));
		card.appendChild( elem );

		addCardRow( card );
		elem = document.createElement( "div" );
		elem.classList.add( "point-range" );
		elem.appendChild(document.createTextNode(Math.trunc(pkmn["pt-n"]) + "pts - " + Math.trunc(pkmn["pt-x"]) + "pts"));
		card.lastChild.appendChild( elem );
	}

	return card;
}

function addCardRow( card ) {
	var		row;

	row = document.createElement( "div" );
	row.classList.add( "card-row" );
	card.appendChild( row );

	return row;
}

function pokemonImgSrc( pkmn ) {
	var		dir, img;

	dir = pkmn["dex-num"].toString();
	img = pkmn["dex-index"].replace( "-", "_" );

	while( dir.length < 4 )
		dir = "0" + dir;

	return dir + "/" + img + ".png";
}

function errorfield( fid, errmsg ) {
	var		field, errfd;

	if( fid.endsWith( "-error" ) )
		errfd = document.getElementById( fid );
	else {
		field = document.getElementById( fid );
		errfd = document.getElementById( fid + "-error" );
	}

	if( field ) {
		field.setAttribute( "aria-invalid", "true" );
		field.classList.add("has-error");
	}
	if( errfd ) {
		errfd.setAttribute( "role", "alert" );
		errfd.classList.add("has-error");
		if( errfd.childNodes.length )
			errfd.appendChild( document.createElement( "br" ) );
		errfd.appendChild( document.createTextNode( errmsg ) );
	}
}

function resetOutput( ) {
	var		removechildren = [
		"pokemon-info",
		"pick-pokemon-error",
		"input-weight-error",
		"input-height-error",
		"input-size-error",
		"input-ivs-error"
	];
	var		removeclass;
	var		i, rc;


	for( i = 0; i < removechildren.length; i++ ) {
		rc = document.getElementById( removechildren[i] );
		while( rc.childNodes.length > 0 )
			rc.removeChild( rc.childNodes[0] );
	}

	removeclass = document.getElementsByClassName( "has-error" );
	for( i = 0; i < removeclass.length; i++ ) {
		if( removeclass[i].getAttribute( "aria-invalid" ) == "true" )
			removeclass[i].setAttribute( "aria-invalid", "false" );
		if( removeclass[i].getAttribute( "role" ) == "alert" )
			removeclass[i].removeAttribute( "role" );
		removeclass[i].classList.remove( "has-error" );
	}
}

function resetPokemon( pkmn ) {
	if( pkmn["ht-i"] )
		delete pkmn["ht-i"];
	if( pkmn["wt-i"] )
		delete pkmn["wt-i"];
	if( pkmn["sz-i"] )
		delete pkmn["sz-i"];
	if( pkmn["xxl-i"] )
		delete pkmn["xxl-i"];
	if( pkmn["at-i"] )
		delete pkmn["at-i"];
	if( pkmn["df-i"] )
		delete pkmn["df-i"];
	if( pkmn["hp-i"] )
		delete pkmn["hp-i"];
	if( pkmn["ht-n"] )
		delete pkmn["ht-n"];
	if( pkmn["wt-n"] )
		delete pkmn["wt-n"];
	if( pkmn["ht-x"] )
		delete pkmn["ht-x"];
	if( pkmn["wt-x"] )
		delete pkmn["wt-x"];
	if( pkmn["pt-n"] )
		delete pkmn["pt-n"];
	if( pkmn["pt-x"] )
		delete pkmn["pt-x"];
}
