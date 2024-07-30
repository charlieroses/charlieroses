function init() {
	initselect();

	document.getElementById("pick-pokemon").value = "";
	document.getElementById( "input-weight" ).value = "";
	document.getElementById( "input-height" ).value = "";
	document.getElementById( "input-atk" ).value = "";
	document.getElementById( "input-def" ).value = "";
	document.getElementById( "input-hp" ).value = "";
	document.getElementById( "atk-img" ).src = "../../assets/icons/iv/00.svg";
	document.getElementById( "def-img" ).src = "../../assets/icons/iv/00.svg";
	document.getElementById( "hp-img" ).src = "../../assets/icons/iv/00.svg";
}

function validateInput( ) {
	var		size = [ "xxs", "xs", "m", "xl", "xxl" ];
	var		ivs = [
		{ "name": "Attack", "id": "atk" },
		{ "name": "Defense", "id": "def" },
		{ "name": "HP", "id": "hp" }];
	var		select, wtinp, htinp;
	var		pkmn, pcalc;
	var		d, i, s, v;
	
	select = document.getElementById("pick-pokemon").value;
	wtinp = document.getElementById( "input-weight" ).value;
	htinp = document.getElementById( "input-height" ).value;
	for( i = 0; i < ivs.length; i++ )
		ivs[i]["val"] = document.getElementById( "input-" + ivs[i]["id"] ).value;

	for( d in dex )
		if( dex[d]["name"] == select )
			pkmn = dex[d];

	if( ! pkmn ) {
		errorfield( "pick-pokemon", "Invalid Selection" );
		return 0;
	}

	if( pkmn["size-calc-ignore"] ) {
		errorfield( "pick-pokemon", "Invalid Selection" );
		return 0;
	}

	if( ! wtinp ) {
		errorfield( "input-weight", "Weight must be a number" );
		return 0;
	}
	if( wtinp <= 0 ) {
		errorfield( "input-weight", "Weight cannot be negative or zero" );
		return 0;
	}
	if( ! htinp ) {
		errorfield( "input-height", "Height must be a number" );
		return 0;
	}
	if( htinp <= 0 ) {
		errorfield( "input-height", "Height cannot be negative or zero" );
		return 0;
	}

	pcalc = initpcalc( pkmn["dex-index"] );
	pcalc["wt-i"] = parseFloat(wtinp);
	pcalc["ht-i"] = parseFloat(htinp);

	for( s in size ) {
		if( document.getElementById( "input-" + size[s] ).checked ) {
			pcalc["sz-i"] = size[s];
			break;
		}
	}

	// TODO pumpkaboo/gourgeist
	if( pkmn["xxs-lower-bound"] <= pcalc["ht-i"] &&
	    pcalc["ht-i"] < pkmn["xs-lower-bound"] ) {
		if( pkmn["sz-i"] != "xxs" )
			console.log( "warning not xxs" );
			// warning maybe not xxs
	}
	else if( pkmn["xs-lower-bound"] <= pcalc["ht-i"] &&
	         pcalc["ht-i"] < pkmn["m-lower-bound"] ) {
		if( pcalc["sz-i"] != "xs" )
			console.log( "warning not xs" );
			// warning maybe not xs
	}
	else if( pkmn["m-lower-bound"] <= pcalc["ht-i"] &&
	         pcalc["ht-i"] <= pkmn["m-upper-bound"] ) {
		if( pcalc["sz-i"] != "m" )
			console.log( "warning not m" );
			// warning maybe not m
	}
	else if( pkmn["m-upper-bound"] < pcalc["ht-i"] &&
	         pcalc["ht-i"] <= pkmn["xl-upper-bound"] ) {
		if( pcalc["sz-i"] != "xl" )
			console.log( "warning not xl" );
			// warning maybe not xl
	}
	else if( pkmn["xl-upper-bound"] < pcalc["ht-i"] &&
	         pcalc["ht-i"] <= pkmn["xxl-upper-bound"] ) {
		if( pcalc["sz-i"] != "xxl" )
			console.log( "warning not xxl" );
			// warning maybe not xxl
	}
	else {
		// warning maybe out of range
		if( pcalc["ht-i"] < pkmn["xxs-lower-bound"] ) {
			console.log( "warning too short" );
			// warning maybe too short
		}
		else if( pcalc["ht-i"] > pkmn["xxl-lower-bound"] ) {
			console.log( "warning too tall" );
			// warning maybe too tall
		}

	}

	pcalc["wt"][0] = pcalc["wt-i"] - 0.005;
	pcalc["wt"][1] = pcalc["wt-i"] + 0.005;
	pcalc["ht"][0] = pcalc["ht-i"] - 0.005;
	pcalc["ht"][1] = pcalc["ht-i"] + 0.005;

	if( pcalc["sz-i"] == "xxs" ) {
		if( pcalc["ht"][0] < pkmn["xxs-lower-bound"] )
			pcalc["ht"][0] = pkmn["xxs-lower-bound"];
	}
	else if( pcalc["sz-i"] == "xs" ) {
		if( pcalc["ht"][0] < pkmn["xs-lower-bound"] )
			pcalc["ht"][0] = pkmn["xs-lower-bound"];
	}
	else if( pcalc["sz-i"] == "m" ) {
		if( pcalc["ht"][0] < pkmn["m-lower-bound"] )
			pcalc["ht"][0] = pkmn["m-lower-bound"];
		if( pcalc["ht"][1] > pkmn["m-upper-bound"] )
			pcalc["ht"][1] = pkmn["m-upper-bound"];
	}
	else if( pcalc["sz-i"] == "xl" ) {
		if( pcalc["ht"][1] > pkmn["xl-upper-bound"] )
			pcalc["ht"][1] = pkmn["xl-upper-bound"];
	}
	else if( pcalc["sz-i"] == "xxl" ) {
		if( pcalc["ht"][1] > pkmn["xxl-upper-bound"] )
			pcalc["ht"][1] = pkmn["xxl-upper-bound"];
	}

	if( (!ivs[0]["val"]) && (!ivs[1]["val"]) && (!ivs[2]["val"]) ) {
		// everyones empty no issues, points just wont be calculated
		return pcalc;
	}

	// Now everyone has got something
	pcalc["sc?"] = true;
	for( i = 0; i < ivs.length; i++ ) {
		if( ! ivs[i]["val"] ||
		    parseInt(ivs[i]["val"]) != parseFloat(ivs[i]["val"]) ||
		    parseInt(ivs[i]["val"]) < 0 || 15 < parseInt(ivs[i]["val"]) ) {
			errorfield( "input-" + ivs[i]["id"], "" );
			errorfield( "input-ivs-error", ivs[i]["name"] + " must be a whole number between 0 and 15" );
			pcalc["sc?"] = false;
		}
		else
			pcalc["iv-i"][i] = parseInt( ivs[i]["val"] );
	}

	if( ! pcalc["sc?"] )
		errorfield( "input-ivs-error", "Showcase points will not be calculated" );

	return pcalc;
}

function generate( ) {
	var		output;
	var		pc0, pc1;
	var		evo, s, e, d, f;
	var		xxr;

	resetOutput();
	pc0 = validateInput();
	if( ! pc0 )
		return;

	if( pc0["sc?"] )
		fillShowcases( pc0 );
		//calcShowcaseScores( pc0 );

	output = document.getElementById("pokemon-info");

	output.appendChild( pokemonCard( pc0 ) );

	if( ! dex[pc0["dex"]]["evolves-into"] ) {
		addCardRow( output.lastChild );
		output.lastChild.lastChild.classList.add( "error-msg" );
		output.lastChild.lastChild.appendChild( document.createTextNode( dex[pc0["dex"]]["name"] + " does not evolve" ) );
		return;
	}
	if( ! dex[pc0["dex"]]["xx-class"] ) {
		addCardRow( output.lastChild );
		output.lastChild.lastChild.classList.add( "error-msg" );
		output.lastChild.lastChild.appendChild( document.createTextNode( "Cannot predict evolution sizes" ) );
		return;
	}

	evo = getEvolutions( dex[pc0["dex"]] );

	for( s = 0; s < evo.length; s++ ) {
		pc1 = evo[s];
		if( ! dex[pc1["dex"]]["xx-class"] ) {
			output.appendChild( pokemonCard( pc1 ) );
			continue;
		}
		pc1["sz-i"] = pc0["sz-i"];
		pc1["sc?"] = pc0["sc?"];
		for( i = 0; i < 3; i++ )
			pc1["iv-i"][i] = pc0["iv-i"][i];
		calcNewSizes( pc0, pc1 );
		if( pc1["sc?"] )
			fillShowcases( pc1 );
			//calcShowcaseScores( pc1 );
		output.appendChild( pokemonCard( pc1 ) );
	}

	delete pc0;
	for( s = 0; s < evo.length; s++ )
		delete evo[s];
}

function getEvolutions( pkmn ) {
	var		epkmn;
	var		e, s, ne;
	var		evo = [];

	if( ! pkmn["evolves-into"] )
		return evo;

	for( e = 0; e < pkmn["evolves-into"].length; e++ ) {
		if( dex[pkmn["evolves-into"][e]]["size-calc-ignore"] )
			continue;
		evo.push( initpcalc(pkmn["evolves-into"][e]) );
	}

	for( s = 0; s < evo.length; s++ ) {
		epkmn = dex[evo[s]["dex"]];
		if( ! epkmn["evolves-into"] )
			continue;
		for( e = 0; e < epkmn["evolves-into"].length; e++ ) {
			if( dex[epkmn["evolves-into"][e]]["size-calc-ignore"] )
				continue;
			evo.push( initpcalc( epkmn["evolves-into"][e] ) );
		}
	}

	return evo;
}

function fillShowcases( pcalc ) {
	var		b, t;
	var		pkmn;
	pkmn = dex[pcalc["dex"]];

	// Showcase 0 is the species specific
	if( pcalc["dex"].includes("-") ) {
		if( dex[pcalc["dex"].split("-")[0]] )
			pcalc["sc"][0]["baseline-dex"] = pcalc["dex"].split("-")[0];
		else if( dex[pcalc["dex"].split("-")[0]+"-0"] )
			pcalc["sc"][0]["baseline-dex"] = pcalc["dex"].split("-")[0] + "-0";
	}
	pcalc["sc"][0]["name"] = dex[pcalc["sc"][0]["baseline-dex"]]["name"];

	// Next Showcases are type specific
	for( t = 0; t < pkmn["type"].length; t++ ) {
		if( baseline[pkmn["type"][t]] == "NA" ) {
			pcalc["sc"].push( { "name": pkmn["type"][t] + " Type", "na": true } );
			continue;
		}
		for( b = 0; b < baseline[pkmn["type"][t]].length; b++ ) {
			pcalc["sc"].push( baseline[pkmn["type"][t]][b] );
			pcalc["sc"][pcalc["sc"].length-1]["name"] = pkmn["type"][t] + " Type";
		}
	}

	// Then showcases for all pokemon
	for( b = 0; b < baseline["All"].length; b++ ) {
		pcalc["sc"].push( baseline["All"][b] );
		pcalc["sc"][pcalc["sc"].length-1]["name"] = baseline["All"][b]["name"];
	}


	// Then calc all points
	for( p = 0; p < pcalc["sc"].length; p++ ) {
		if( pcalc["sc"][p]["na"] )
			continue;
		pcalc["sc"][p]["pt"] = calcShowcasePoints( dex[pcalc["sc"][p]["baseline-dex"]], pcalc );
	}
}

function calcShowcaseScores( pcalc ) {
	var		b, t, pkmn;
	pkmn = dex[pcalc["dex"]];

	pcalc["sc"][0]["pt"] = calcShowcasePoints( dex[pcalc["sc"][0]["bl"]], pcalc );

	for( t = 0; t < pkmn["type"].length; t++ ) {
		if( baseline[pkmn["type"][t]] == "NA" ) {
			pcalc["sc"].push( { "name": pkmn["type"][t], "na": true } );
			continue;
		}
		for( b = 0; b < baseline[pkmn["type"][t]].length; b++ ) {
			pcalc["sc"].push( { "name": pkmn["type"][t], "i": b } );
			pcalc["sc"][pcalc["sc"].length-1]["pt"] = calcShowcasePoints( dex[baseline[pkmn["type"][t]][b]["baseline-dex"]], pcalc );
		}
	}

	for( b = 0; b < baseline["Great-Buddy"].length; b++ ) {
		pcalc["sc"].push( { "name": "Great-Buddy", "i": b } );
		pcalc["sc"][pcalc["sc"].length-1]["pt"] = calcShowcasePoints( dex[baseline["Great-Buddy"][b]["baseline-dex"]], pcalc );
	}
	for( b = 0; b < baseline["Super-Buddy"].length; b++ ) {
		pcalc["sc"].push( { "name": "Super-Buddy", "i": b } );
		pcalc["sc"][pcalc["sc"].length-1]["pt"] = calcShowcasePoints( dex[baseline["Super-Buddy"][b]["baseline-dex"]], pcalc );
	}
}

function calcShowcasePoints( bpkmn, pcalc ) {
	var		i, j;
	var		hc, wc, ic;
	var		ret = [ 0, 0 ];

	for( i = 0; i < 2; i++ ) {
		hc = ( pcalc["ht"][i] / bpkmn["height-avg"] ) / bpkmn["xx-class"];
		wc = ( pcalc["wt"][i] / bpkmn["weight-avg"] ) / ( 0.5 + bpkmn["xx-class"] );
		ic = 0;
		for( j = 0; j < 3; j++ )
			ic += pcalc["iv-i"][j];
		ic /= 45;

		ret[i] = (800 * hc) + (150 * wc) + (50 * ic );
		if( pcalc["sz-i"] == "xxl" )
			ret[i] += 178;

		ret[i] = Math.trunc( ret[i] );
	}

	if( ret[0] > ret[1] ) {
		i = ret[0];
		ret[0] = ret[1];
		ret[1] = i;
	}

	return ret;
}

function calcNewSizes( pc0, pc1 ) {
	var		pkmn0, pkmn1;
	var		xxr;
	var		i;

	pkmn0 = dex[pc0["dex"]];
	pkmn1 = dex[pc1["dex"]];

	xxr = (pkmn1["xx-class"] - 1.5) / (pkmn0["xx-class"] - 1.5);
	for( i = 0; i < 2; i++ ) {
		pc1["ht"][i] = pc0["ht"][i] / pkmn0["height-avg"];
		pc1["wt"][i] = pc0["wt"][i] / pkmn0["weight-avg"];
	}

	if( pc0["sz-i"] == "xxl" ) {
		pc1["wt"][0] -= pc1["ht"][1];
		pc1["wt"][1] -= pc1["ht"][0];
		pc1["ht"][0] = 1.5 + (( pc1["ht"][0] - 1.5 ) * xxr );
		pc1["ht"][1] = 1.5 + (( pc1["ht"][1] - 1.5 ) * xxr );
		pc1["wt"][0] += pc1["ht"][1];
		pc1["wt"][1] += pc1["ht"][0];
	}

	for( i = 0; i < 2; i++ ) {
		pc1["ht"][i] *= pkmn1["height-avg"];
		pc1["wt"][i] *= pkmn1["weight-avg"];

		pc1["ht-d"][i] = Math.trunc( pc1["ht"][i] * 100 ) / 100;
		pc1["wt-d"][i] = Math.trunc( pc1["wt"][i] * 100 ) / 100;
	}
}

function pokemonCard( pcalc ) {
	var		card, cardp, elem, err, name;
	var		pkmn, p;

	pkmn = dex[pcalc["dex"]];

	card = document.createElement( "div" );
	card.classList.add( "pokemon-card" );

	if( ! pkmn["available"] )
		card.classList.add( "unavailable" );

	card.appendChild( document.createElement( "h2" ) );
	card.lastChild.classList.add( "card-title" );
	card.lastChild.classList.add( "pkmn-name" );
	name = pkmn["name"];
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
	card.appendChild( document.createElement( "div" ) );
	card.lastChild.classList.add( "card-dot" );

	if( pcalc["sc?"] ) {
		card.classList.add( "has-showcase" );
		card.appendChild( document.createElement( "div" ) );
		card.lastChild.classList.add( "card-columns" );
		cardp = card;
		card = document.createElement( "div" );
		card.classList.add( "card-column" );
		cardp.lastChild.appendChild( card );
	}

	card.appendChild( cardRow() );
	card.lastChild.classList.add( "pokemon-img" );
	card.lastChild.appendChild( document.createElement( "img" ) );
	card.lastChild.lastChild.src = "../../assets/images/dex/" + pokemonImgSrc( pkmn );
	card.lastChild.lastChild.alt = pkmn["plain-text"];

	if( ! pkmn["available"] )
		card.appendChild( cardRowError( "Not yet added to game" ));

	card.appendChild( cardRowHeader("Average Size") );

	card.appendChild( cardRow( ) );
	elem = document.createElement( "div" );
	elem.classList.add( "avg-weight" );
	elem.appendChild(document.createTextNode(pkmn["weight-avg"] + "kg"));
	card.lastChild.appendChild( elem );
	elem = document.createElement( "div" );
	elem.classList.add( "avg-height" );
	elem.appendChild(document.createTextNode(pkmn["height-avg"] + "m"));
	card.lastChild.appendChild( elem );
	card.appendChild( cardRowSpacer() );


	if( pcalc["ht-i"] ) {
		card.appendChild( cardRowHeader("Input Size") );

		card.appendChild( cardRow( ) );
		elem = document.createElement( "div" );
		elem.classList.add( "inp-weight" );
		elem.appendChild(document.createTextNode(pcalc["wt-i"] + "kg"));
		card.lastChild.appendChild( elem );
		elem = document.createElement( "div" );
		elem.classList.add( "inp-height" );
		elem.appendChild(document.createTextNode(pcalc["ht-i"] + "m"));
		card.lastChild.appendChild( elem );
	}
	else {
		card.appendChild( cardRowHeader("Size Range") );
		card.appendChild( cardRowRange( pcalc["wt-d"], "kg" ) );
		card.appendChild( cardRowRange( pcalc["ht-d"], "m" ) );
	}


	if( !pcalc["sc?"] )
		return card;


	card = document.createElement( "div" );
	card.classList.add( "card-column" );
	cardp.lastChild.appendChild( card );
	for( p = 0; p < pcalc["sc"].length; p++ ) {
		if( p )
			card.appendChild( cardRowSpacer() );

		card.appendChild( cardRowHeader( pcalc["sc"][p]["name"] + " Showcase", "showcase-header" ) );
		if( pcalc["sc"][p]["na"] ) {
			card.appendChild( cardRowText( "No " + pcalc["sc"][p]["name"] + " Showcases have occured yet", "showcase-msg" ) );
			continue;
		}

		card.appendChild( cardRowRange( pcalc["sc"][p]["pt"], "pts" ) );
		if( p ) {
			card.appendChild( cardRowText( "Based on " + pcalc["sc"][p]["date"] + " " + pcalc["sc"][p]["event"] + " event", "showcase-msg" ) );
		}
	}

	return cardp;
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

function cardRow( ) {
	var		row;

	row = document.createElement( "div" );
	row.classList.add( "card-row" );

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

function updateIVImg( f ) {
	var		fields = [ "atk", "def", "hp" ];
	var		val, img;

	val = document.getElementById( "input-" + fields[f] ).value;
	
	if( ! val )
		img = "00";
	else if( parseInt(val) != parseFloat(val) )
		img = "00";
	else if( 0 < val && val <= 9 )
		img = "0" + val.toString();
	else if( 10 <= val && val <= 15 )
		img = val.toString();
	else
		img = "00";

	document.getElementById( fields[f] + "-img" ).src = "../../assets/icons/iv/" + img + ".svg";
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

function initpcalc( d ) {
	var pcalc = {
		"dex": d,
		"ht-i": 0.0,
		"wt-i": 0.0,
		"sz-i": "",
		"ht-d": [ 0.0, 0.0 ],
		"wt-d": [ 0.0, 0.0 ],
		"ht": [ 0.0, 0.0 ],
		"wt": [ 0.0, 0.0 ],
		"sc?": false,
		"iv-i": [ 0, 0, 0 ],
		"sc": [
			{ "name": "Species", "baseline-dex": d, "pt": [ 0, 0 ] }
		]
	};

	return pcalc;
}

