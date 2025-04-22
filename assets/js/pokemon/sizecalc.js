var		selectkeys = {};

function init() {
	let		ph, d;
	let		select, options;

	select = document.getElementById('pick-pokemon-container');
	options = [];
	for( d in dex ) {
		if( dex[d]["size-calc-ignore"] == false )
			options.push( dex[d]["name"] );
		selectkeys[dex[d]["name"]] = d;
	}
	accessibleAutocomplete({
		element: select,
		id: 'pick-pokemon',
		source: options,
		displayMenu: 'overlay'
	});


	document.getElementById( "input-weight" ).value = "";
	document.getElementById( "input-height" ).value = "";
	document.getElementById( "input-atk" ).value = "";
	document.getElementById( "input-def" ).value = "";
	document.getElementById( "input-hp" ).value = "";
	document.getElementById( "atk-img" ).src = getIVBarSrc( 0 );
	document.getElementById( "def-img" ).src = getIVBarSrc( 0 );
	document.getElementById( "hp-img" ).src = getIVBarSrc( 0 );

	ph = document.createElement( "div" );
	ph.id = "output-placeholder";
	ph.appendChild( document.createTextNode( "Waiting for input..." ) );
	document.getElementById("pokemon-info").appendChild( ph );
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

	if( pkmn["name"].startsWith( "Pumpkaboo" ) || pkmn["name"].startsWith( "Gourgeist" ) ) {
		if( select.includes( "Small" ) )
			pcalc["sz-i"] = "xs";
		else if( select.includes( "Average" ) )
			pcalc["sz-i"] = "m";
		else if( select.includes( "Large" ) )
			pcalc["sz-i"] = "xl";
		else if( select.includes( "Super" ) )
			pcalc["sz-i"] = "xxl";

		if( ! document.getElementById( "input-" + pcalc["sz-i"] ).checked ) {
			document.getElementById( "input-" + pcalc["sz-i"] ).checked = true;
			if( pcalc["sz-i"] == "m" )
				errorfield( "input-size", pkmn["name"] + " can only be Average. Selection Updated" );
			else
				errorfield( "input-size", pkmn["name"] + " can only be " + pcalc["sz-i"].toUpperCase() + ". Selection Updated" );
		}
	}



/*
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
*/
	pcalc["wt"][0] = pcalc["wt-i"] - 0.005;
	pcalc["wt"][1] = pcalc["wt-i"] + 0.005;
	pcalc["ht"][0] = pcalc["ht-i"] - 0.005;
	pcalc["ht"][1] = pcalc["ht-i"] + 0.005;

	if( pcalc["sz-i"] == "xxs" ) {
		if( pcalc["ht"][0] < pkmn["xxs-lower-bound"] )
			pcalc["ht"][0] = pkmn["xxs-lower-bound"];
		if( pcalc["ht"][1] > pkmn["xs-lower-bound"] )
			pcalc["ht"][1] = pkmn["xs-lower-bound"];
	}
	else if( pcalc["sz-i"] == "xs" ) {
		if( pcalc["ht"][0] < pkmn["xs-lower-bound"] )
			pcalc["ht"][0] = pkmn["xs-lower-bound"];
		if( pcalc["ht"][1] > pkmn["m-lower-bound"] )
			pcalc["ht"][1] = pkmn["m-lower-bound"];
	}
	else if( pcalc["sz-i"] == "m" ) {
		if( pcalc["ht"][0] < pkmn["m-lower-bound"] )
			pcalc["ht"][0] = pkmn["m-lower-bound"];
		if( pcalc["ht"][1] > pkmn["m-upper-bound"] )
			pcalc["ht"][1] = pkmn["m-upper-bound"];
	}
	else if( pcalc["sz-i"] == "xl" ) {
		if( pcalc["ht"][0] < pkmn["m-upper-bound"] )
			pcalc["ht"][0] = pkmn["m-upper-bound"];
		if( pcalc["ht"][1] > pkmn["xl-upper-bound"] )
			pcalc["ht"][1] = pkmn["xl-upper-bound"];
	}
	else if( pcalc["sz-i"] == "xxl" ) {
		if( pcalc["ht"][0] < pkmn["xl-upper-bound"] )
			pcalc["ht"][0] = pkmn["xl-upper-bound"];
		if( pcalc["ht"][1] > pkmn["xxl-upper-bound"] )
			pcalc["ht"][1] = pkmn["xxl-upper-bound"];
	}

	if( (!ivs[0]["val"]) && (!ivs[1]["val"]) && (!ivs[2]["val"]) ) {
		// everyones empty no issues, points just wont be calculated
		for( i = 0; i < ivs.length; i++ )
			pcalc["iv-i"][i] = 0;
		return pcalc;
	}

	// Now everyone has got something
	pcalc["iv"] = true;
	for( i = 0; i < ivs.length; i++ ) {
		if( ! ivs[i]["val"] ||
		    parseInt(ivs[i]["val"]) != parseFloat(ivs[i]["val"]) ||
		    parseInt(ivs[i]["val"]) < 0 || 15 < parseInt(ivs[i]["val"]) ) {
			errorfield( "input-" + ivs[i]["id"], "" );
			errorfield( "input-ivs-error", ivs[i]["name"] + " must be a whole number between 0 and 15" );
			pcalc["iv"] = false;
		}
		else
			pcalc["iv-i"][i] = parseInt( ivs[i]["val"] );
	}

	if( ! pcalc["iv"] ) {
		for( i = 0; i < ivs.length; i++ )
			pcalc["iv-i"][i] = 0;
		errorfield( "input-ivs-error", "IVs will be ignored in showcase predictions" );
	}
	
	for( i = 0; i < ivs.length; i++ )
		updateIVImg( i );

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

	fillShowcases( pc0 );

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
		pc1["iv"] = pc0["iv"];
		for( i = 0; i < 3; i++ )
			pc1["iv-i"][i] = pc0["iv-i"][i];
		calcNewSizes( pc0, pc1 );
		fillShowcases( pc1 );
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
			pcalc["sc"].push( {} );
			pcalc["sc"][pcalc["sc"].length-1]["name"] = pkmn["type"][t] + " Type";
			if( baseline[pkmn["type"][t]][b]["date"] )
				pcalc["sc"][pcalc["sc"].length-1]["date"] = baseline[pkmn["type"][t]][b]["date"];
			if( baseline[pkmn["type"][t]][b]["event"] )
				pcalc["sc"][pcalc["sc"].length-1]["event"] = baseline[pkmn["type"][t]][b]["event"];
			if( baseline[pkmn["type"][t]][b]["baseline-dex"] == "self" )
				pcalc["sc"][pcalc["sc"].length-1]["baseline-dex"] = pcalc["sc"][0]["baseline-dex"];
			else
				pcalc["sc"][pcalc["sc"].length-1]["baseline-dex"] = baseline[pkmn["type"][t]][b]["baseline-dex"];
		}
	}

	// Then showcases for all pokemon
	for( b = 0; b < baseline["All"].length; b++ ) {
		pcalc["sc"].push( baseline["All"][b] );
		pcalc["sc"][pcalc["sc"].length-1]["name"] = baseline["All"][b]["name"];
		if( baseline["All"][b]["date"] )
			pcalc["sc"][pcalc["sc"].length-1]["date"] = baseline["All"][b]["date"];
		if( baseline["All"][b]["event"] )
			pcalc["sc"][pcalc["sc"].length-1]["event"] = baseline["All"][b]["event"];
		if( baseline["All"][b]["baseline-dex"] == "self" )
			pcalc["sc"][pcalc["sc"].length-1]["baseline-dex"] = pcalc["sc"][0]["baseline-dex"];
		else
			pcalc["sc"][pcalc["sc"].length-1]["baseline-dex"] = baseline["All"][b]["baseline-dex"];
	}


	// Then calc all points
	for( p = 0; p < pcalc["sc"].length; p++ ) {
		if( pcalc["sc"][p]["na"] )
			continue;
		pcalc["sc"][p]["pt"] = calcShowcasePoints( dex[pcalc["sc"][p]["baseline-dex"]], pcalc );
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

	if( pcalc["iv"] == false )
		ret[1] += 50;

	return ret;
}

function calcNewSizes( pc0, pc1 ) {
	var		pkmn0, pkmn1;
	var		hf0 = [], hf1 = [], wf = [];
	var		i, o, xxp;

	pkmn0 = dex[pc0["dex"]];
	pkmn1 = dex[pc1["dex"]];

	if( pkmn0["name"].startsWith( "Pumpkaboo" ) ) {
		pumpkaboo( pc0, pc1 );
		return;
	}

	xxp = 1;
	if( pc0["sz-i"] != "xxl" )
		xxp += 1;

	for( i = 0; i < 2; i++ ) {
		hf0[i] = pc0["ht"][i] / pkmn0["height-avg"];
		if(( pc0["sz-i"] == "xxl" ) && ( pkmn0["xx-class"] != pkmn1["xx-class"] ))
			hf1[i] = 1.5 + ((hf0[i] - 1.5) * ((pkmn1["xx-class"] - 1.5) / (pkmn0["xx-class"] - 1.5)));
		else
			hf1[i] = hf0[i];

		pc1["ht"][i] = hf1[i] * pkmn1["height-avg"];
		pc1["ht-d"][i] = roundTo( pc1["ht"][i], 2 );
	}

	for( i = 0; i < 2; i++ ) {
		o = (i + 1) % 2;

		wf[i] = pc0["wt"][i] / pkmn0["weight-avg"];
		wf[i] -= Math.pow( hf0[o], xxp );
		wf[i] += Math.pow( hf1[o], xxp );

		pc1["wt"][i] = wf[i] * pkmn1["weight-avg"];
		pc1["wt-d"][i] = roundTo( pc1["wt"][i], 2 );
	}

	if( pc1["ht"][0] > pc1["ht"][1] ) {
		i = pc1["ht"][0];
		pc1["ht"][0] = pc1["ht"][1];
		pc1["ht"][1] = i;
	}
	if( pc1["wt"][0] > pc1["wt"][1] ) {
		i = pc1["wt"][0];
		pc1["wt"][0] = pc1["wt"][1];
		pc1["wt"][1] = i;
	}

}

function pumpkaboo( pc, gc ) {
	var		pkmn, gkmn;
	var		hfp = [], hfg = [], wf = [];
	var		pl, pu, gl, gu, i, o, xxp;

	pkmn = dex[pc["dex"]];
	gkmn = dex[gc["dex"]];

	pl = pkmn["xxs-lower-bound"];
	pu = pkmn["xxl-upper-bound"];
	gl = gkmn["xxs-lower-bound"];
	gu = gkmn["xxl-upper-bound"];

	xxp = 1;
	if( pc["sz-i"] != "xxl" )
		xxp += 1;

	for( i = 0; i < 2; i++ ) {
		hfp[i] = pc["ht"][i] / pkmn["height-avg"];

		gc["ht"][i] = gl + ((gu - gl) * ((pc["ht"][i] - pl) / (pu - pl)));
		gc["ht-d"][i] = roundTo( gc["ht"][i], 2 );

		hfg[i] = gc["ht"][i] / gkmn["height-avg"];
	}
	

	for( i = 0; i < 2; i++ ) {
		o = (i + 1) % 2;

		wf[i] = pc["wt"][i] / pkmn["weight-avg"];
		wf[i] -= Math.pow( hfp[o], xxp );
		wf[i] += Math.pow( hfg[o], xxp );

		gc["wt"][i] = wf[i] * gkmn["weight-avg"];
		gc["wt-d"][i] = roundTo( gc["wt"][i], 2 );
	}

	if( gc["ht"][0] > gc["ht"][1] ) {
		i = gc["ht"][0];
		gc["ht"][0] = gc["ht"][1];
		gc["ht"][1] = i;
	}
	if( gc["wt"][0] > gc["wt"][1] ) {
		i = gc["wt"][0];
		gc["wt"][0] = gc["wt"][1];
		gc["wt"][1] = i;
	}
}

function roundTo( num, p ) {
	var		i, t;

	t = 1;
	for( i = 0; i < p; i++ )
		t *= 10;

	return Math.round( num * t ) / t;
}

function pokemonCard( pcalc ) {
	var		card, elem, div, err, row;
	var		pkmn, p;

	pkmn = dex[pcalc["dex"]];


	card = pokecard( pkmn["name"], 2 );
	card.classList.add( "has-showcase" );

	if( ! pkmn["available"] )
		card.classList.add( "unavailable" );

	row = appendRow( card, 0, cardRow() );
	row.classList.add( "pokemon-img" );
	row.appendChild( document.createElement( "img" ) );
	row.lastChild.src = "/assets/images/dex/" + pokemonImgSrc( pkmn );
	row.lastChild.alt = pkmn["plain-text"];

	if( ! pkmn["available"] )
		appendRow( card, 0, cardRowError( "Not yet added to game" ));

	if( pkmn["dex-num"] == 710 || pkmn["dex-num"] == 711 ) {
		p = pkmn["dex-index"].split("-");
		if( p.length == 1 )
			p = "2";
		else
			p = p[1];

		row = appendRow( card, 0, cardRow( ) );
		row.classList.add( "card-row-pg-size" )

		div = document.createElement( "div" );
		div.classList.add( "pg-weight" );
		div.appendChild( cardRowHeader( "Average Weight" ) );
		elem = document.createElement( "div" );
		elem.classList.add( "avg-weight" );
		elem.appendChild(document.createTextNode(pkmn["weight-avg"] + "kg"));
		div.appendChild( elem );
		row.appendChild( div );

		div = document.createElement( "div" );
		div.classList.add( "pg-height" );
		if( p == "4" )
			div.appendChild( cardRowHeader( "Maximum Height" ) );
		else
			div.appendChild( cardRowHeader( "Minimum Height" ) );
		elem = document.createElement( "div" );
		elem.classList.add( "avg-height" );
		elem.appendChild(document.createTextNode(pkmn["height-avg"] + "m"));
		div.appendChild( elem );
		row.appendChild( div );
	}
	else {
		appendRow( card, 0, cardRowHeader("Average Size") );
		row = appendRow( card, 0, cardRow( ) );
		elem = document.createElement( "div" );
		elem.classList.add( "avg-weight" );
		elem.appendChild(document.createTextNode(pkmn["weight-avg"] + "kg"));
		row.appendChild( elem );
		elem = document.createElement( "div" );
		elem.classList.add( "avg-height" );
		elem.appendChild(document.createTextNode(pkmn["height-avg"] + "m"));
		row.appendChild( elem );
	}
	appendRow( card, 0, cardRowSpacer() );


	if( pcalc["ht-i"] ) {
		appendRow( card, 0, cardRowHeader("Input Size") );

		row = appendRow( card, 0, cardRow( ) );
		elem = document.createElement( "div" );
		elem.classList.add( "inp-weight" );
		elem.appendChild(document.createTextNode(pcalc["wt-i"] + "kg"));
		row.appendChild( elem );
		elem = document.createElement( "div" );
		elem.classList.add( "inp-height" );
		elem.appendChild(document.createTextNode(pcalc["ht-i"] + "m"));
		row.appendChild( elem );
	}
	else {
		appendRow( card, 0, cardRowHeader("Size Range") );
		appendRow( card, 0, cardRowRange( pcalc["wt-d"], "kg" ) );
		appendRow( card, 0, cardRowRange( pcalc["ht-d"], "m" ) );
	}

	if( pkmn["plain-text"].startsWith("Mega") || pkmn["plain-text"].startsWith("Primal") )
		appendRow( card, 0, cardRowError( "Note: Mega-evolved Pokemon can be entered in showcases, but their showcase score is based on their unevolved stats." ) );

	for( p = 0; p < pcalc["sc"].length; p++ ) {
		if( p )
			appendRow( card, 1, cardRowSpacer() );

		appendRow( card, 1, cardRowHeader( pcalc["sc"][p]["name"] + " Showcase", "showcase-header" ) );
		if( pcalc["sc"][p]["na"] ) {
			appendRow( card, 1, cardRowText( "No " + pcalc["sc"][p]["name"] + " Showcases have occured yet", "showcase-msg" ) );
			continue;
		}

		appendRow( card, 1, cardRowRange( pcalc["sc"][p]["pt"], "pts" ) );
		if( p ) {
			if( pcalc["sc"][p]["event"] )
				appendRow( card, 1, cardRowText( "Based on " + pcalc["sc"][p]["date"] + " " + pcalc["sc"][p]["event"] + " event", "showcase-msg" ) );
			else
				appendRow( card, 1, cardRowText( "Based on " + pcalc["sc"][p]["date"] + " showcases", "showcase-msg" ) );
		}
	}

	return card;
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

	document.getElementById( fields[f] + "-img" ).src = "/assets/icons/iv/" + img + ".svg";
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
		"iv": false,
		"iv-i": [ 0, 0, 0 ],
		"sc": [
			{ "name": "Species", "baseline-dex": d, "pt": [ 0, 0 ] }
		]
	};

	return pcalc;
}


