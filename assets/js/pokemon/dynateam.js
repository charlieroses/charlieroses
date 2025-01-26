const	hardcode = {
	"144": {
		"satk": [ "376" ],
		"watk": [ "6", "849", "99", "815", "530", "68" ],
		"sdef": [ "144", "131", "615", "9", "832", "820" ],
		"wdef": [ "870", "94", "818" ]
	},
	"145": {
		"satk": [ ],
		"watk": [ "131", "94", "144", "615" ],
		"sdef": [ "530" ],
		"wdef": [ "376", "812", "3" ]
	},
	"146": {
		"satk": [ ],
		"watk": [ "99", "849", "94", "9", "818", "145", "131" ],
		"sdef": [ ],
		"wdef": [ "376", "820", "815", "530", "68", "6" ]
	},
	"99-G": {
		"satk": [ "3", "812" ],
		"watk": [ "849", "145", "820" ],
		"sdef": [ "131", "9", "376", "144", ],
		"wdef": [ "68", "94", "870", "832" ]
	}
};

function init_basic( gpkmni ) {
	let		spans, s;

	spans = document.getElementsByClassName( "boss-name" );
	for( s = 0; s < spans.length; s++ ) {
		if( isGigamax(gpkmni) )
			spans[s].appendChild( document.createTextNode( getPkmnDisplayName(gpkmni) ) );
		else
			spans[s].appendChild( document.createTextNode( "Dynamax " + getPkmnDisplayName(gpkmni) ) );
	}
	output_gpkmn( gpkmni );

	output_pkmnlist_HC( gpkmni, "Attackers" );
	output_pkmnlist_HC( gpkmni, "Strong Supporters" );
	output_pkmnlist_HC( gpkmni, "Weak Supporters" );
}

function init() {
	let		gigaselect, opts;
	let		gpkmn, g;

	gigaselect = document.getElementById( "pick-giga-pokemon-container" );
	opts = [];

	gpkmn = getAllMaxBattles();
	for( g = 0; g < gpkmn.length; g++ ) {
		if( isGigamax( gpkmn[g] ) )
			opts.push( getPkmnDisplayName( gpkmn[g] ) );
		else
			opts.push( "Dynamax " + getPkmnDisplayName( gpkmn[g] ) );
	}

	accessibleAutocomplete({
		element: gigaselect,
		id: 'pick-giga-pokemon',
		source: opts,
		displayMenu: 'overlay',
		showAllValues: true
	});
}

function generate() {
	let		etm, wb, wbboxes;
	let		gpkmni, gchrg, c, gtype;
	let		dpkmn, d, dpkmndet, dfast;
	let		avoid, fattack, attack, defend, meh;
	let		i, a;
	let		attackers;

	avoid = [];
	fattack = [];
	attack = [];
	defend = [];
	meh = [];
	resetError( "pick-giga-pokemon" );

	etm = document.getElementById("etm-checkbox").checked;
	if( etm )
		etm = "all";
	else
		etm = "standard";

	gpkmni = document.getElementById("pick-giga-pokemon").value;

	wb = "ignore";
	wbboxes = document.getElementsByName("weather-option");
	for( i = 0; i < wbboxes.length; i++ ) {
		if( wbboxes[i].checked ) {
			wb = wbboxes[i].value;
			break;
		}
	}
	
	if( ! gpkmni ) {
		errorfield( "pick-giga-pokemon", "Invalid Selection" );
		return 0;
	}
	gpkmni = searchPkmn( gpkmni );
	if( ! gpkmni ) {
		errorfield( "pick-giga-pokemon", "Invalid Selection" );
		return 0;
	}

	gchrg = getMaxBossMoveset( gpkmni );

	gtype = getPkmnField( gpkmni, "type" );

	if( document.getElementById("evolution-checkbox").checked )
		dpkmn = getEvolvedDynaPkmn();
	else
		dpkmn = getAvailableDynaPkmn();
	attackers = [];

	for( d = 0; d < dpkmn.length; d++ ) {
		dfast = getPkmnMoveset( dpkmn[d], "fast", etm );
		for( c = 0; c < dfast.length; c++ ) {
			a = getTypeAdvantage( getMoveField(dfast[c],"type"), gtype );
			if( a > 100 )
				attackers.push( dpkmn[d] );
		}

		if( isGigamax( dpkmn[d] ) ) {
			a = getTypeAdvantage( getMoveField(dpkmn[d],"field"), gtype );
			if( a > 100 )
				attackers.push( dpkmn[d] );
		}

		for( c = 0; c < gchrg.length; c++ ) {
			calcMoveDurability( gpkmni, dpkmn[d], gchrg[c] );
		}

	}

	attackers = [...new Set(attackers)];

	console.log( attackers );

	console.log( getMaxBossScenarios(gpkmni) );

	// Risk = number of scenarios with weak to moves
	// Risk = (nmoves * (nmoves-1)) - ((nmoves - nweak)*(nmoves - nweak - 1))






	///////////////// OLD


	dpkmndet = {};

	for( d = 0; d < dpkmn.length; d++ ) {
		dpkmndet[dpkmn[d]] = {};
		dpkmndet[dpkmn[d]].clss = "";
		dpkmndet[dpkmn[d]].nweak = 0;
		dpkmndet[dpkmn[d]].nres = 0;
		dpkmndet[dpkmn[d]].nsuper = 0;
		dpkmndet[dpkmn[d]].nnotvery = 0;
		dpkmndet[dpkmn[d]].giga = 0;

		// type advantage from boss attacks
		for( c = 0; c < gchrg.length; c++ ) {
			console.log( "attacking " + dpkmn[d] );
			dpkmndet[dpkmn[d]][gchrg[c]] = advToPercent( getTypeAdvantage( getMoveField(gchrg[c],"type"), getPkmnField(dpkmn[d],"type") ) );
			if( checkSTAB( gpkmni, gchrg[c] ) )
				dpkmndet[dpkmn[d]][gchrg[c]] = applySTAB( dpkmndet[dpkmn[d]][gchrg[c]] );

			if( wb != "ignore" && isWeatherBoosted( getMoveField(gchrg[c],"type"), wb ) )
				dpkmndet[dpkmn[d]][gchrg[c]] = applyWeatherBoost( dpkmndet[dpkmn[d]][gchrg[c]] );

			if( dpkmndet[dpkmn[d]][gchrg[c]] > 120 )
				dpkmndet[dpkmn[d]].nweak++;
			if( dpkmndet[dpkmn[d]][gchrg[c]] < 100 )
				dpkmndet[dpkmn[d]].nres++;
		}

		dfast = getPkmnMoveset( dpkmn[d], "fast", "standard" );
		for( c = 0; c < dfast.length; c++ ) {
			dpkmndet[dpkmn[d]][dfast[c]] = getTypeAdvantage( getMoveField(dfast[c],"type"), gtype );

			if( checkSTAB( dpkmn[d], dfast[c] ) )
				dpkmndet[dpkmn[d]][dfast[c]] = applySTAB( dpkmndet[dpkmn[d]][dfast[c]] );

			if( wb != "ignore" && isWeatherBoosted( getMoveField(dfast[c],"type"), wb ) )
				dpkmndet[dpkmn[d]][dfast[c]] = applyWeatherBoost( dpkmndet[dpkmn[d]][dfast[c]] );

			if( dpkmndet[dpkmn[d]][dfast[c]] > 120 )
				dpkmndet[dpkmn[d]].nsuper++;
			if( dpkmndet[dpkmn[d]][dfast[c]] < 100 )
				dpkmndet[dpkmn[d]].nnotvery++;
		}

		if( etm ) {
			dfast = getPkmnMoveset( dpkmn[d], "fast", "etm" );
			for( c = 0; c < dfast.length; c++ ) {
				dpkmndet[dpkmn[d]][dfast[c]] = getTypeAdvantage( getMoveField(dfast[c],"type"), gtype );

				if( checkSTAB( dpkmn[d], dfast[c] ) )
					dpkmndet[dpkmn[d]][dfast[c]] = applySTAB( dpkmndet[dpkmn[d]][dfast[c]] );

				if( wb != "ignore" && isWeatherBoosted( getMoveField(dfast[c],"type"), wb ) )
					dpkmndet[dpkmn[d]][dfast[c]] = applyWeatherBoost( dpkmndet[dpkmn[d]][dfast[c]] );

				if( dpkmndet[dpkmn[d]][dfast[c]] > 120 )
					dpkmndet[dpkmn[d]].nsuper++;
				if( dpkmndet[dpkmn[d]][dfast[c]] < 100 )
					dpkmndet[dpkmn[d]].nnotvery++;
			}
		}

		if( hasGigamax(dpkmn[d]) )
			dpkmndet[dpkmn[d]].giga = getTypeAdvantage( getMoveField(dpkmn[d],"type"), gtype );

		if( dpkmndet[dpkmn[d]].nweak > 0 ) {
			if( dpkmndet[dpkmn[d]].nsuper > 1 || dpkmndet[dpkmn[d]].giga > 120 )
				fattack.push( dpkmn[d] );
			else
				avoid.push( dpkmn[d] );
		}
		else if( dpkmndet[dpkmn[d]].nsuper > 1 || dpkmndet[dpkmn[d]].giga > 120 )
			attack.push( dpkmn[d] );
		else if( dpkmndet[dpkmn[d]].nres > 0 )
			defend.push( dpkmn[d] );
		else
			meh.push( dpkmn[d] );

	}

	output_gpkmn( gpkmni );
}

function calcMoveDurability( atkdi, defdi, move ) {
	let		atka, defd, stad
	let		dmg, pwr, adv, stab, adr;

	atka = getPkmnField( atkdi, "base-attack" );
	defd = getPkmnField( defdi, "base-defense" );
	defd = getPkmnField( defdi, "base-stamina" );

	pwr = getMoveField( move, "raid-power" );
	adv = getTypeAdvantage( getMoveField(move,"type"), getPkmnField(defdi,"type") );
	stab = getSTAB( atkdi, move );
	adr = atka / defd;

	dmg = pwr * stab * adv * adr;

	console.log( getPkmnField(defdi,"name") + " " + getMoveField(move,"name") + " " + dmg );
}

function output_gpkmn( di ) {
	let		out;
	let		card, row;
	let		name, tier, field;
	let		i;

	out = document.getElementById( "boss-pokemon-info" );

	name = getPkmnDisplayName( di );
	if( isGigamax( di ) ) {
		tier = 6;
	}
	else {
		name = "Dynamax " + name;
		tier = getPkmnField( di, "max-battle-tier" );
	}

	card = pokecard( name, 2 );
	out.appendChild( card );

	row = AppendRow( card, cardRow(), 0 );
	row.appendChild( document.createElement( "img" ) );
	row.lastChild.classList.add( "boss-img" );
	row.lastChild.src = getPkmnImageSrc( di );
	row.lastChild.alt = getPkmnField( di, "name" );

	row = AppendRow( card, cardRow(), 0 );
	row.classList.add( "battle-tier" );
	if( tier == 6 )
		row.appendChild( getIcon("Gigantamax") );
	else
		row.appendChild( getIcon("Dynamax") );
	row.lastChild.alt = "Tier " + tier + " Max Battle";
	for( i = 1; i < tier; i++ ) {
		if( tier == 6 )
			row.appendChild( getIcon("Gigantamax") );
		else
			row.appendChild( getIcon("Dynamax") );
		row.lastChild.alt = "";
	}

	row = AppendRow( card, cardRow() );
	row.classList.add( "battle-cost" );
	row.appendChild( getIcon("Max Particles") );
	row.lastChild.setAttribute( "alt", "" );
	row.appendChild( document.createElement("div") );
	row.lastChild.appendChild( document.createTextNode(getMaxBattleCost(tier)+" Max Particles") );

	// CP range
	row = AppendRow( card, cardRow(), 0 );
	row.classList.add( "catch-cp-row" );
	row.appendChild( document.createElement( "div" ) );
	row.lastChild.classList.add( "cp-label" );
	row.lastChild.appendChild( document.createTextNode( "Catch CP" ) );
	row.appendChild( document.createElement( "div" ) );
	row.lastChild.classList.add( "cp-value" );
	row.lastChild.appendChild( document.createTextNode( pkmnCP(di,20,[0,0,0]) + " - " + pkmnCP(di,20,[15,15,15]) ) );

	row = AppendRow( card, cardRow(), 0 );
	row.classList.add( "catch-cp-row" );
	field = getPkmnWeatherBoost( di );
	for( i = 0; i < field.length; i++ )
		row.appendChild( getWeatherImg(field[i]) );
	row.appendChild( document.createElement( "div" ) );
	row.lastChild.classList.add( "cp-label" );
	row.lastChild.appendChild( document.createTextNode("Boosted") );
	row.appendChild( document.createElement( "div" ) );
	row.lastChild.classList.add( "cp-value" );
	row.lastChild.appendChild( document.createTextNode( pkmnCP(di,25,[0,0,0]) + " - " + pkmnCP(di,25,[15,15,15]) ) );

	if(( isGigamax(di) && willBeAvailable( getAvailability(di), di, "shiny" ) ) ||
	   ( willBeAvailable( getAvailability(di,"dynamax"),di,"shiny")) ) {
		row = AppendRow( card, cardRow() );
		row.classList.add( "shiny-available-message" );
		row.appendChild( getIcon("Shiny") );
		row.lastChild.setAttribute( "alt", "" );
		row.appendChild( document.createElement("div") );
		row.lastChild.appendChild( document.createTextNode( "Shiny Available" ) );
	}

	row = AppendRow( card, cardRow(), 1 );
	row.appendChild( stats_div(di) );

	row = AppendRow( card, cardRowHeader(""), 1 );
	row.appendChild( document.createElement("span") );
	row.lastChild.appendChild( document.createTextNode( "Type Advantage" ) );

	field = getPkmnField( di, "type" );
	for( i = 0; i < field.length; i++ )
		row.appendChild( getTypeImg( field[i] ) );

	field = getPkmnDoubleWeakness( di );
	if( field.length ) {
		row = AppendRow( card, cardRow(), 1 );
		row.classList.add( "type-details-row" );
		row.appendChild( document.createElement( "div" ) );
		row.lastChild.appendChild( document.createTextNode( "Double Weak To:" ) );
		for( i = 0; i < field.length; i++ )
			row.appendChild( getTypeImg( field[i] ) );
	}

	field = getPkmnWeakness( di );
	row = AppendRow( card, cardRow(), 1 );
	row.classList.add( "type-details-row" );
	row.appendChild( document.createElement( "div" ) );
	if( field.length ) {
		row.lastChild.appendChild( document.createTextNode( "Weak To:" ) );
		for( i = 0; i < field.length; i++ )
			row.appendChild( getTypeImg( field[i] ) );
	}
	else {
		row.appendChild( document.createElement( "div" ) );
		row.lastChild.appendChild( document.createTextNode( "No Weaknesses" ) );
	}

	field = getPkmnResistance( di );
	row = AppendRow( card, cardRow(), 1 );
	row.classList.add( "type-details-row" );
	row.appendChild( document.createElement( "div" ) );
	if( field.length ) {
		row.lastChild.appendChild( document.createTextNode( "Resists:" ) );
		for( i = 0; i < field.length; i++ )
			row.appendChild( getTypeImg( field[i] ) );
	}
	else {
		row.appendChild( document.createElement( "div" ) );
		row.lastChild.appendChild( document.createTextNode( "No Resistances" ) );
	}

	field = getPkmnDoubleResistance( di );
	if( field.length ) {
		row = AppendRow( card, cardRow(), 1 );
		row.classList.add( "type-details-row" );
		row.appendChild( document.createElement( "div" ) );
		row.lastChild.appendChild( document.createTextNode( "Immune:" ) );
		for( i = 0; i < field.length; i++ )
			row.appendChild( getTypeImg( field[i] ) );
	}

	AppendRow( card, cardRowHeader("Moveset"), 1 );
	field = getMaxBossMoveset( di );

	for( i = 0; i < field.length; i++ )
		AppendRow( card, attack_row( field[i], applySTAB(di,field[i],"raid-power") ), 1 );

}

function stats_div( di ) {
	let		div;
	let		labels = [ "ATK", "DEF", "STA" ];
	let		fields = [ "base-attack", "base-defense", "base-stamina" ];
	let		i;

	div = document.createElement( "div" );
	div.classList.add( "stats-div" );

	for( i = 0; i < fields.length; i++ ) {
		div.appendChild( document.createElement( "div" ) );
		div.lastChild.classList.add( "stats-cont" );
		div.lastChild.appendChild( document.createElement( "div" ) );
		div.lastChild.lastChild.classList.add( "stats-label" );
		div.lastChild.lastChild.appendChild( document.createTextNode( labels[i] ) );
		div.lastChild.appendChild( document.createElement( "div" ) );
		div.lastChild.lastChild.classList.add( "stats-value" );
		div.lastChild.lastChild.appendChild( document.createTextNode( getPkmnField(di,fields[i]) ) );
	}

	return div;
}

function attack_row( move, boost ) {
	let		row, elem, diva, divb, pow;

	row = cardRow();

	pow = getMoveField( move, "raid-power" );
	applySTAB( "99-G", move, "raid-power" );
	if( boost > pow )
		row.classList.add( "boosted-attack-row-grid" );
	else
		row.classList.add( "attack-row-grid" );

	elem= getTypeImg( getMoveField(move,"type") );
	elem.classList.add( "attack-type" );
	row.appendChild( elem );

	elem = document.createElement( "div" );
	elem.classList.add( "attack-name" );
	elem.appendChild( document.createTextNode( getMoveField( move, "name" ) ) );
	row.appendChild( elem );
	
	diva= document.createElement( "div" );
	diva.classList.add( "attack-power" );
	row.appendChild( diva );
	divb= document.createElement( "div" );
	divb.classList.add( "boost-power" );
	row.appendChild( divb );

	if( boost > pow ) {
		diva.appendChild( getSTABIcon( getMoveField(move,"type") ) );
		diva.appendChild( document.createElement( "s" ) );
		diva.lastChild.appendChild( document.createTextNode( pow ) );
		diva.appendChild( document.createTextNode( "\u2799" ) );
		divb.appendChild( document.createTextNode( boost ) );
	}
	else
		divb.appendChild( document.createTextNode( pow ) );

	return row;
}

function output_pkmnlist_HC( gpkmni, title ) {
	let		out;
	let		card, row;
	let		p;
	let		all;

	// TODO dear god fix me
	if( title == "Attackers" )
		out = document.getElementById( "attack-pokemon-info" );
	else if( title == "Strong Supporters" )
		out = document.getElementById( "support-pokemon-info" );
	else
		out = document.getElementById( "other-pokemon-info" );

	card = pokecard( title );
	out.appendChild( card );


	if( title == "Attackers" ) {
		AppendRow( card, cardRowHeader( "Safe Defense" ) );
		if( hardcode[gpkmni]["satk"].length ) {
			for( p = 0; p < hardcode[gpkmni]["satk"].length; p++ )
				AppendRow( card, cardRowPkmnBreakdown( hardcode[gpkmni]["satk"][p], gpkmni ) );
		}
		else
			AppendRow( card, cardRowText( "There are no Attackers with a safe defense" ) );

		if( hardcode[gpkmni]["watk"] ) {
			AppendRow( card, cardRowHeader( "Fragile Defense" ) );
			for( p = 0; p < hardcode[gpkmni]["watk"].length; p++ )
				AppendRow( card, cardRowPkmnBreakdown( hardcode[gpkmni]["watk"][p], gpkmni ) );
		}
	}
	else if( title == "Strong Supporters" ) {
		AppendRow( card, cardRowHeader( "Safe Defense" ) );
		if( hardcode[gpkmni]["sdef"].length ) {
			for( p = 0; p < hardcode[gpkmni]["sdef"].length; p++ )
				AppendRow( card, cardRowPkmnBreakdown( hardcode[gpkmni]["sdef"][p], gpkmni ) );
		}
		else
			AppendRow( card, cardRowText( "There are no Supporters with a safe defense" ) );
		if( hardcode[gpkmni]["wdef"] ) {
			AppendRow( card, cardRowHeader( "Fragile Defense" ) );
			for( p = 0; p < hardcode[gpkmni]["wdef"].length; p++ )
				AppendRow( card, cardRowPkmnBreakdown( hardcode[gpkmni]["wdef"][p], gpkmni ) );
		}
	}
	else {
		if( isGigamax(gpkmni) )
			all = getAvailableDynaPkmn( getAvailability(gpkmni) );
		else
			all = getAvailableDynaPkmn( getAvailability(gpkmni,"dynamax") );
		for( p = 0; p < all.length; p++ ) {
			if( hardcode[gpkmni]["satk"].includes(all[p]) )
				continue;
			if( hardcode[gpkmni]["watk"].includes(all[p]) )
				continue;
			if( hardcode[gpkmni]["sdef"].includes(all[p]) )
				continue;
			if( hardcode[gpkmni]["wdef"].includes(all[p]) )
				continue;
			if( all[p] == "145" && ( gpkmni == "144" ) )
				continue;
			if( all[p] == "146" && ( gpkmni == "144" || gpkmni == "145" || gpkmni == "99-G" ) )
				continue;
			AppendRow( card, cardRowPkmnBreakdown( all[p], gpkmni ) );
		}
	}

	AppendRow( card, cardRowBackToTop() );
}

function cardRowBackToTop() { // TODO this should got in card.js
	let		row;

	row = cardRow();
	row.classList.add( "back-to-top-row" );
	row.appendChild( document.createElement("a") );
	row.lastChild.setAttribute( "href", "#top" );
	row.lastChild.appendChild( document.createTextNode( "Back to Top" ) );

	return row;
}

function cardRowPkmnBreakdown( dpkmn, gpkmn ) {
	let		row, det, sum, elem;
	let		field, i;


	det = document.createElement( "details" );
	sum = document.createElement( "summary" );
	det.appendChild( sum );
	elem = document.createElement( "img" );
	sum.appendChild( elem );
	elem.setAttribute( "class", "pokeball-marker" );
	elem.setAttribute( "src", "/assets/icons/pokemon/pokeball.svg" );
	elem.setAttribute( "alt", "" );
	elem = document.createElement( "div" );
	sum.appendChild( elem );
	elem.setAttribute( "class", "title" );
	elem.appendChild( document.createElement( "h4" ) ); // h4 level good
	elem.lastChild.appendChild( document.createTextNode( getPkmnField(dpkmn,"name") ) );
	field = getPkmnField( dpkmn, "type" );
	for( i = 0; i < field.length; i++ )
		elem.appendChild( getTypeImg(field[i]) );
	if( isGigamax( dpkmn+"-G" ) && getTypeAdvantage(getMoveField(dpkmn+"-G","type"),getPkmnField(gpkmn,"type")) >= 1 &&
	  ( (isGigamax(gpkmn) &&  willBeAvailable(getAvailability(gpkmn),dpkmn+"-G")) ||
	     willBeAvailable(getAvailability(gpkmn,"dynamax"),dpkmn+"-G") ) ) {
		elem.appendChild( getIcon( "Gigantamax" ) );
		elem.lastChild.setAttribute( "alt", "Effective G-Max Attack available" );
	}
	sum.appendChild( stats_div(dpkmn) );

	det.appendChild( document.createElement( "div" ) )
	det.lastChild.setAttribute( "class", "da-div-container" );

	det.lastChild.appendChild( document.createElement( "div" ) );
	det.lastChild.lastChild.setAttribute( "class", "da-div" );
	elem = document.createElement( "h5" ); // h5 level good
	det.lastChild.lastChild.appendChild( elem );
	elem.appendChild( document.createTextNode("Defending") );

	elem = det.lastChild.lastChild;
	field = getMaxBossMoveset( gpkmn );
	for( i = 0; i < field.length; i++ )
		elem.appendChild( defendGrid( field[i], dpkmn ) );

	det.lastChild.appendChild( document.createElement( "div" ) );
	det.lastChild.lastChild.setAttribute( "class", "da-div" );
	elem = document.createElement( "h5" ); // h5 level good
	det.lastChild.lastChild.appendChild( elem );
	elem.appendChild( document.createTextNode("Attacking") );

	elem = det.lastChild.lastChild;
	field = sortedFastMoves( dpkmn, gpkmn );
	
	if( isGigamax( dpkmn+"-G" ) &&
	  ( (isGigamax(gpkmn) &&  willBeAvailable(getAvailability(gpkmn),dpkmn+"-G")) ||
	     willBeAvailable(getAvailability(gpkmn,"dynamax"),dpkmn+"-G") ) )
		elem.appendChild( gmaxAttackGrid( dpkmn+"-G", dpkmn, gpkmn ) );
	for( i = 0; i < field.length; i++ )
		elem.appendChild( maxAttackGrid( field[i], dpkmn, gpkmn ) );

	det.appendChild( powerUpCostTable(getPkmnField(dpkmn,"dynamax-class")) );

	return det;
}

function powerUpCostTable( clss ) {
	let		tbl, tbody;
	let		i, j, cost;

	tbl = document.createElement( "table" );
	tbl.classList.add( "power-up-costs" );

	tbl.appendChild( document.createElement( "caption" ) );
	tbl.lastChild.appendChild( document.createElement( "h5" ) );
	tbl.lastChild.lastChild.appendChild( document.createTextNode("Max Move Power Up Costs") );

	tbl.appendChild( document.createElement( "tbody" ) );
	thead = document.createElement( "tr" );
	tbl.lastChild.appendChild( thead );
	tbody = document.createElement( "tr" );
	tbl.lastChild.appendChild( tbody );

	for( i = 1; i < 4; i++ ) {
		thead.appendChild( document.createElement( "th" ) );
		thead.lastChild.setAttribute( "scope", "col" );
		thead.lastChild.appendChild( document.createTextNode( "Level " + i ) );

		cost = getPowerUpCost( clss, i );
		tbody.appendChild( document.createElement( "td" ) );

		if( cost["candy"] ) {
			tbody.lastChild.appendChild( document.createElement( "div" ) );
			tbody.lastChild.lastChild.appendChild( document.createTextNode( cost["candy"] ) );
			tbody.lastChild.lastChild.appendChild( getIcon("Candy") );
		}
		if( cost["xl"] ) {
			tbody.lastChild.appendChild( document.createElement( "div" ) );
			tbody.lastChild.lastChild.appendChild( document.createTextNode( cost["xl"] ) );
			tbody.lastChild.lastChild.appendChild( getIcon("XL Candy") );
		}
		if( cost["dust"] ) {
			tbody.lastChild.appendChild( document.createElement( "div" ) );
			tbody.lastChild.lastChild.appendChild( document.createTextNode( cost["dust"] ) );
			tbody.lastChild.lastChild.appendChild( getIcon("Max Particles") );
		}
	}

	return tbl;
}

function sortedFastMoves( dpkmn, gpkmn ) {
	let		moves, gtype, mtypes, temp;
	let		i, j, t;

	moves = getPkmnMoveset( dpkmn, "fast", "all" );
	mtypes = moves.map( (i) => getMoveField(i,"type") );
	mtypes = new Set(mtypes);
	mtypes = Array.from(mtypes);
	gtype = getPkmnField(gpkmn,"type");

	for( i = 0; i < mtypes.length; i++ ) {
		for( j = i+1; j < mtypes.length; j++ ) {
			if( getTypeAdvantage(mtypes[i],gtype) < getTypeAdvantage(mtypes[j],gtype) ) {
				temp = mtypes[i];
				mtypes[i] = mtypes[j];
				mtypes[j] = temp;
			}
		}
	}
	mtypes = mtypes.map( (i) => [i] );
	for( i = 0; i < moves.length; i++ ) {
		for( j = 0; j < mtypes.length; j++ ) {
			if( getMoveField(moves[i],"type") == mtypes[j][0] ) {
				mtypes[j].push( moves[i] );
				continue;
			}
		}
	}

	for( t = 0; t < mtypes.length; t++ ) {
		for( i = 1; i < mtypes[t].length; i++ ) {
			for( j = i+1; j < mtypes[t].length; j++ ) {
				if( getRaidCooldown(mtypes[t][i]) > getRaidCooldown(mtypes[t][j]) ) {
					temp = mtypes[t][i];
					mtypes[t][i] = mtypes[t][j];
					mtypes[t][j] = temp;
				}
			}
		}
	}
	for( i = 0; i < mtypes.length; i++ ) {
		for( j = i+1; j < mtypes.length; j++ ) {
			if( getTypeAdvantage(mtypes[i][0],gtype) == getTypeAdvantage(mtypes[j][0],gtype) &&
			    getRaidCooldown(mtypes[i][1]) > getRaidCooldown(mtypes[j][1]) ) {
				temp = mtypes[i];
				mtypes[i] = mtypes[j];
				mtypes[j] = temp;
			}
		}
	}

	return mtypes;
}

function defendGrid( move, dpkmn, weather="", stab="" ) {
	let		div;
	let		type, name;

	type = getMoveField( move, "type" );
	name = getMoveField( move, "name" );

	div = document.createElement( "div" ); // TODO li?
	div.setAttribute( "class", "defend-grid" );

	div.appendChild( getTypeImg(type) );
	div.lastChild.classList.add( "charge-icon" );

	div.appendChild( document.createElement( "div" ) );
	div.lastChild.appendChild( document.createTextNode(name) );
	div.lastChild.classList.add( "charge-attack" );

	div.appendChild( defendAdvDiv( getTypeAdvantage( type, getPkmnField(dpkmn,"type") ) ) );
	div.lastChild.classList.add( "adv" );

	return div;
}

function gmaxAttackGrid( move, dpkmn, gpkmn, weather="", stab="" ) {
	let		div;
	let		type, name;

	type = getMoveField( move, "type" );
	name = getMoveField( move, "name" );

	div = document.createElement( "div" ); // TODO li?
	div.setAttribute( "class", "max-grid" );

	div.appendChild( getTypeImg(type,"gigamax") );
	div.lastChild.classList.add( "max-icon" );

	div.appendChild( document.createElement( "div" ) );
	div.lastChild.classList.add( "max-attack" );
	div.lastChild.classList.add( "gmax-attack" );
	div.lastChild.appendChild( document.createTextNode(name) );

	div.appendChild( attackAdvDiv( getTypeAdvantage( type, getPkmnField(gpkmn,"type") ) ) );
	div.lastChild.classList.add( "adv" );

	return div;
}

function maxAttackGrid( movedata, dpkmn, gpkmn, weather="", stab="" ) {
	let		div, elem;
	let		type, maxn;
	let		m, name, sec;

	type = movedata[0];
	maxn = getMoveField( getMaxMoveFromFast(movedata[1]), "name" );

	elem = document.createElement( "div" ); // TODO li?
	elem.setAttribute( "class", "max-cont" );

	div = document.createElement( "div" );
	div.setAttribute( "class", "max-grid" );
	elem.appendChild( div );

	div.appendChild( getTypeImg(type,"max") );
	div.lastChild.classList.add( "max-icon" );

	div.appendChild( document.createElement( "div" ) );
	div.lastChild.classList.add( "max-attack" );
	div.lastChild.appendChild( document.createTextNode(maxn) );

	div.appendChild( attackAdvDiv( getTypeAdvantage( type, getPkmnField(gpkmn,"type") ) ) );
	div.lastChild.classList.add( "adv" );

	for( m = 1; m < movedata.length; m++ ) {
		div = document.createElement( "div" );
		div.setAttribute( "class", "fast-grid" );
		elem.appendChild( div );

		name = getMoveField(movedata[m],"name");
		sec = getMoveField(movedata[m],"raid-cooldown");

		div.appendChild( getTypeImg(type) );
		div.lastChild.classList.add( "fast-icon" );

		div.appendChild( document.createElement( "div" ) );
		div.lastChild.classList.add( "fast-attack" );
		div.lastChild.appendChild( document.createTextNode(name) );

		if( pkmnNeedsETM(dpkmn,movedata[m]) ) {
			div.lastChild.appendChild( getIcon("TM") );
			div.lastChild.lastChild.setAttribute( "alt", "Requires Elite TM" );
			div.lastChild.lastChild.setAttribute( "title", "Requires Elite TM" );
		}

		div.appendChild( document.createElement( "div" ) );
		div.lastChild.classList.add( "sec" );
		div.lastChild.appendChild( document.createElement( "span" ) );
		div.lastChild.lastChild.classList.add( "value" );
		div.lastChild.lastChild.appendChild( document.createTextNode(sec) );
		div.lastChild.appendChild( document.createElement( "span" ) );
		div.lastChild.lastChild.classList.add( "unit" );
		div.lastChild.lastChild.appendChild( document.createTextNode( "SEC" ) );
	}

	return elem;
}

function attackAdvDiv( adv ) {
	let		div, t, c;

	adv = advToPercent( adv );
	t = adv + "%";
	c = "typeadv-div ";

	if( adv < 30 )
		c += "typeadv-red-drk-drk";
	if( 30 < adv && adv < 50 )
		c += "typeadv-red-drk";
	if( 50 < adv && adv < 80 )
		c += "typeadv-red";
	if( 80 < adv && adv < 100 )
		c += "typeadv-red-gray";
	if( adv == 100 )
		c += "typeadv-gray";
	if( 100 < adv && adv < 130 )
		c += "typeadv-green-gray";
	if( 130 < adv && adv < 250 )
		c += "typeadv-green";
	if( 250 < adv && adv < 300 )
		c += "typeadv-green-drk";
	if( 300 < adv )
		c += "typeadv-green-drk-drk";

	div = document.createElement( "div" );
	div.appendChild( document.createTextNode(t) );
	div.setAttribute( "class", c );

	return div;
}

function defendAdvDiv( adv ) {
	let		div, t, c;

	adv = advToPercent( adv );
	t = adv + "%";
	c = "typeadv-div ";

	if( adv < 30 )
		c += "typeadv-green-drk-drk";
	if( 30 < adv && adv < 50 )
		c += "typeadv-green-drk";
	if( 50 < adv && adv < 80 )
		c += "typeadv-green";
	if( 80 < adv && adv < 100 )
		c += "typeadv-green-gray";
	if( adv == 100 )
		c += "typeadv-gray";
	if( 100 < adv && adv < 130 )
		c += "typeadv-red-gray";
	if( 130 < adv && adv < 250 )
		c += "typeadv-red";
	if( 250 < adv && adv < 300 )
		c += "typeadv-red-drk";
	if( 300 < adv )
		c += "typeadv-red-drk-drk";

	div = document.createElement( "div" );
	div.appendChild( document.createTextNode(t) );
	div.setAttribute( "class", c );

	return div;
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

function resetError( fid ) {
	let		f;
	let		em, emid;

	emid = fid + "-error";
	em = document.getElementById( emid );
	while( em.childNodes.length > 0 )
		em.removeChild( em.childNodes[0] );

	f = document.getElementById( fid ); //"has-error" );
	if( f.getAttribute( "aria-invalid" ) == "true" )
		f.setAttribute( "aria-invalid", "false" );
	if( f.getAttribute( "role" ) == "alert" )
		f.removeAttribute( "role" );
	f.classList.remove( "has-error" );
}


