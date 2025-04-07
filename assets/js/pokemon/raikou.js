function rankMaxSpirit( dpkmn ) {
	let		ret = {};
	let		i, j, t;
	let		nrank, avg, skip;

	ret.ordered = [];
	ret.ordered.push( dpkmn[0] );
	for( i = 1; i < dpkmn.length; i++ ) {
		if( dpkmn[i] == dpkmn[i-1] + "-G" )
			continue;
		ret.ordered.push( dpkmn[i] );
	}

	for( i = 0; i < ret.ordered.length; i++ ) {
		for( j = i+1; j < ret.ordered.length; j++ ) {
			if( getPkmnField(ret.ordered[i],"base-stamina") < getPkmnField(ret.ordered[j],"base-stamina") ) {
				t = ret.ordered[i];
				ret.ordered[i] = ret.ordered[j];
				ret.ordered[j] = t;
			}
		}
	}

	ret[ret.ordered[ret.ordered.length-1]] = {};
	ret[ret.ordered[ret.ordered.length-1]]["n"] = 0;
	for( i = ret.ordered.length-2; i >= 0; i-- ) {
		ret[ret.ordered[i]] = {};
		if( getPkmnField(ret.ordered[i],"base-stamina") == getPkmnField(ret.ordered[i-1],"base-stamina") )
			ret[ret.ordered[i]]["n"] = ret[ret.ordered[i+1]]["n"];
		else
			ret[ret.ordered[i]]["n"] = ret[ret.ordered[i+1]]["n"] + 1;
	}
	for( i = 0; i < ret.ordered.length; i++ ) {
		ret[ret.ordered[i]]["percent"] = ret[ret.ordered[i]]["n"] / ret[ret.ordered[0]]["n"];
		ret[ret.ordered[i]]["rank"] = percentToRank( ret[ret.ordered[i]]["percent"] );
	}


	console.log( "SPIRIT" );
	console.log( ret );

	return ret;
}

function rankMaxAttack( dpkmn, gpkmn ) {
	let		ret = {};
	let		i, j, t, di, dj;
	let		field, max;
	let		stab, adv, adr;

	ret.best = [];
	ret.all = [];

	for( i = 0; i < dpkmn.length; i++ ) {
		ret[dpkmn[i]] = {};
		ret[dpkmn[i]].ordered = [];
		
		if( isGigamax( dpkmn[i] ) ) {
			ret[dpkmn[i]].best = dpkmn[i];
			ret[dpkmn[i]][dpkmn[i]] = {};
			stab = 1.2;
			adv = getTypeAdvantage( getMoveField(dpkmn[i],"type"), getPkmnField(gpkmn,"type") );
			adr = getPkmnField(dpkmn[i],"base-attack") / getPkmnField(gpkmn,"base-defense");
			ret[dpkmn[i]][dpkmn[i]].pwr = 350*stab*adv*adr;
			ret.all.push( { dpkmn: dpkmn[i], atk: dpkmn[i] } );
			continue;
		}

		field = getPkmnMoveset( dpkmn[i], "dynamax", "all" );
		t = 0;
		for( j = 0; j < field.length; j++ ) {
			stab = getSTAB( dpkmn[i], field[j] );
			adv = getTypeAdvantage( getMoveField(field[j],"type"), getPkmnField(gpkmn,"type") );
			adr = getPkmnField(dpkmn[i],"base-attack") / getPkmnField(gpkmn,"base-defense");
			ret[dpkmn[i]][field[j]] = {};
			ret[dpkmn[i]][field[j]].pwr = 250*stab*adv*adr;
			ret.all.push( { dpkmn: dpkmn[i], atk: field[j] } );

			if( 250*stab*adv*adr > t ) {
				ret[dpkmn[i]].best = field[j];
				t = 250*stab*adv*adr;
			}
		}
	}

	for( i = 0; i < ret.all.length; i++ ) {
		for( j = i+1; j < ret.all.length; j++ ) {
			di = ret.all[i];
			dj = ret.all[j];
			if( ret[di.dpkmn][di.atk].pwr < ret[dj.dpkmn][dj.atk].pwr ) {
				t = ret.all[i];
				ret.all[i] = ret.all[j];
				ret.all[j] = t;
			}
		}
	}

	i = ret.all.length-1;
	t = ret.all[i];
	ret[t.dpkmn][t.atk].n = 0;
	for( i = ret.all.length-2; i >= 0; i-- ) {
		t = ret.all[i];
		j = ret.all[i+1];
		ret[t.dpkmn][t.atk].n = ret[j.dpkmn][j.atk].n;
		if( ret[t.dpkmn][t.atk].pwr != ret[j.dpkmn][j.atk].pwr )
			ret[t.dpkmn][t.atk].n++;
	}

	j = ret.all[0];
	for( i = 0; i < ret.all.length; i++ ) {
		t = ret.all[i];
		ret[t.dpkmn][t.atk].percent = ret[t.dpkmn][t.atk].n / ret[j.dpkmn][j.atk].n;
		ret[t.dpkmn][t.atk].rank = percentToRank( ret[t.dpkmn][t.atk].percent );
		if( t.atk == ret[t.dpkmn].best )
			ret.best.push( t.dpkmn );
		ret[t.dpkmn].ordered.push( t.atk );
	}

	console.log( "ATTACK" );
	console.log( ret );
	return ret;
}

function rankMaxGuard( dpkmn, gpkmn ) {
	let		ret = {};
	let		i, j, t;
	let		moves, m;
	let		atk, def, dmg, hp;
	let		dpkmni, dpkmnj;

	moves = getMaxBossMoveset( gpkmn );
	atk = (getPkmnField( gpkmn, "base-attack" ) + 15) * getMaxBossCPM(getMaxBossTier(gpkmn));

	ret.overall = [];
	ret.overall.push( dpkmn[0] );
	for( m = 0; m < moves.length; m++ ) {
		ret[moves[m]] = [];
		ret[moves[m]].push( dpkmn[0] );
	}
	for( i = 1; i < dpkmn.length; i++ ) {
		if( dpkmn[i] == dpkmn[i-1] + "-G" )
			continue;
		ret.overall.push( dpkmn[i] );
		for( m = 0; m < moves.length; m++ )
			ret[moves[m]].push( dpkmn[i] );
	}


	for( i = 0; i < ret.overall.length; i++ ) {
		dpkmni = ret.overall[i];
		ret[dpkmni] = {};
		ret[dpkmni]["avg"] = 0;
		hp = pkmnHP( dpkmni, 40, [ 10, 10, 10 ] );
		ret[dpkmni]["hp"] = hp;
		def = (getPkmnField( dpkmni, "base-defense" ) + 10) * getLevelScalar( 40 );
		for( j = 0; j < moves.length; j++ ) {
			dmg = getMoveField( moves[j], "raid-power" );
			dmg *= getSTAB( gpkmn, moves[j] );
			dmg *= getTypeAdvantage( getMoveField(moves[j],"type"), getPkmnField(dpkmni,"type") );
			dmg *= ( atk / def );
			console.log( "atk: " + atk );
			console.log( "def: " + def );
			dmg = Math.floor( dmg / 2 ) + 1;
			console.log( dpkmni + " " + moves[j] + " " + dmg );
			ret[dpkmni][moves[j]] = {};
			ret[dpkmni][moves[j]].hits = Math.ceil( hp / dmg );
			ret[dpkmni]["avg"] += Math.ceil( hp / dmg );
		}
		ret[dpkmni]["avg"] /= moves.length;
	}

	for( i = 0; i < ret.overall.length; i++ ) {
		for( j = i+1; j < ret.overall.length; j++ ) {
			dpkmni = ret.overall[i];
			dpkmnj = ret.overall[j];
			if( ret[dpkmni]["avg"] < ret[dpkmnj]["avg"] ) {
				t = ret.overall[i];
				ret.overall[i] = ret.overall[j];
				ret.overall[j] = t;
			}
		}
	}
	for( m = 0; m < moves.length; m++ ) {
		for( i = 0; i < ret[moves[m]].length; i++ ) {
			for( j = i+1; j < ret[moves[m]].length; j++ ) {
				dpkmni = ret[moves[m]][i];
				dpkmnj = ret[moves[m]][j];
				if( ret[dpkmni][moves[m]].hits < ret[dpkmnj][moves[m]].hits ) {
					t = ret[moves[m]][i];
					ret[moves[m]][i] = ret[moves[m]][j];
					ret[moves[m]][j] = t;
				}
			}
		}
	}

	ret[ret.overall[ret.overall.length-1]].n = 0;
	for( i = ret.overall.length-2; i >= 0; i-- ) {
		if( ret[ret.overall[i]].avg == ret[ret.overall[i+1]].avg )
			ret[ret.overall[i]].n = ret[ret.overall[i+1]].n;
		else
			ret[ret.overall[i]].n = ret[ret.overall[i+1]].n + 1;
	}
	for( i = 0; i < ret.overall.length; i++ ) {
		ret[ret.overall[i]].percent = ret[ret.overall[i]].n / ret[ret.overall[0]].n;
		ret[ret.overall[i]].rank = percentToRank( ret[ret.overall[i]].percent );
	}

	for( m = 0; m < moves.length; m++ ) {
		ret[ret[moves[m]][ret[moves[m]].length-1]][moves[m]].n = 0;
		for( i = ret[moves[m]].length-2; i >= 0; i-- ) {
			if( ret[ret[moves[m]][i]][moves[m]].hits == ret[ret[moves[m]][i+1]][moves[m]].hits )
				ret[ret[moves[m]][i]][moves[m]].n = ret[ret[moves[m]][i+1]][moves[m]].n;
			else
				ret[ret[moves[m]][i]][moves[m]].n = ret[ret[moves[m]][i+1]][moves[m]].n + 1;
		}
		for( i = 0; i < ret[moves[m]].length; i++ ) {
			ret[ret[moves[m]][i]][moves[m]].percent = ret[ret[moves[m]][i]][moves[m]].n / ret[ret[moves[m]][0]][moves[m]].n;
			ret[ret[moves[m]][i]][moves[m]].rank = percentToRank( ret[ret[moves[m]][i]][moves[m]].percent );
		}
	}

	console.log( "GUARD" );
	console.log( ret )

	return ret;
}

function percentToRank( perc ) {
	let		rank;

	if( perc < 0.6 )
		return "F";
	else if( perc < 0.7 )
		rank = "D";
	else if( perc < 0.8 )
		rank = "C";
	else if( perc < 0.9 )
		rank = "B";
	else
		rank = "A";

	if( (perc*100) % 10 >= 8 || perc == 1 )
		rank += "+";
	else if( (perc*100) % 10 <= 2 )
		rank += "-";

	return rank;
}

function getToday() {
	let		date, str;

	date = new Date( Date.now() );
	str = date.getFullYear();
	str += "-";

	if( date.getMonth() < 10 )
		str += "0";
	str += date.getMonth() + 1;
	str += "-";
	
	if( date.getDate() < 10 )
		str += "0";
	str += date.getDate();

	return str;
}

function new_init( gpkmn ) {
	let		dpkmn, atk, grd, spt;
	let		atkrs, grdrs, sptrs;
	let		date;
	let		out, card;
	let		di, o;
	let		spans, s;

	date = getDynaAvailability( gpkmn );
	if( date == "DNU" ) // If a pokemon has been announced, but an exact date hasn't been given, then only use the pokemon available today
		date = getToday();
	if( Date.parse(date) < Date.now() )
		date = getToday();
	dpkmn = getAvailableDynaPkmn( date );
	
	atk = rankMaxAttack( dpkmn, gpkmn );
	grd = rankMaxGuard( dpkmn, gpkmn );
	spt = rankMaxSpirit( dpkmn );

	atkrs = [];
	grdrs = [];
	sptrs = [];

	spans = document.getElementsByClassName( "boss-name" );
	for( s = 0; s < spans.length; s++ ) {
		if( isGigamax(gpkmn) )
			spans[s].appendChild( dcTN( getPkmnDisplayName(gpkmn) ) );
		else
			spans[s].appendChild( dcTN( "Dynamax " + getPkmnDisplayName(gpkmn) ) );
	}
	output_gpkmn( gpkmn );


	out = document.getElementById( "attack-pokemon-info" );
	card = pokecard( "Attackers" );
	out.appendChild( card );

	for( d = 0; d < atk.best.length; d++ ) {
		di = atk.best[d];
		o = atk[di];
		if( o[o.best].rank.startsWith( "C" ) )
			break;
		if( ! grd[di] )
			AppendRow( card, betterBreakdown( di, atk[di], grd[di.split("-")[0]], spt[di.split("-")[0]], "atk" ) );
		else
			AppendRow( card, betterBreakdown( di, atk[di], grd[di], spt[di], "atk" ) );
		atkrs.push( di );
	}


	out = document.getElementById( "guard-pokemon-info" );
	card = pokecard( "Max Guard" );
	out.appendChild( card );
	AppendRow( card, cardRowText( "Gigantamax has no affect on Max Guard" ) );

	for( d = 0; d < grd.overall.length; d++ ) {
		di = grd.overall[d];
		o = grd[di];
		if( o.rank.startsWith( "C" ) )
			break;
		AppendRow( card, betterBreakdown( di, atk[di], grd[di], spt[di], "grd" ) );
		grdrs.push( di );
	}

	out = document.getElementById( "spirit-pokemon-info" );
	card = pokecard( "Max Spirit" );
	out.appendChild( card );
	AppendRow( card, cardRowText( "Gigantamax has no affect on Max Spirit" ) );

	for( d = 0; d < spt.ordered.length; d++ ) {
		di = spt.ordered[d];
		o = spt[di];
		if( o.rank.startsWith( "C" ) )
			break;
		AppendRow( card, betterBreakdown( di, atk[di], grd[di], spt[di], "spt" ) );
		sptrs.push( di );
	}

	out = document.getElementById( "other-pokemon-info" );
	card = pokecard( "Everyone Else" );
	out.appendChild( card );

	for( d = 0; d < dpkmn.length; d++ ) {
		if( atkrs.includes(dpkmn[d]) || grdrs.includes(dpkmn[d]) || sptrs.includes(dpkmn[d]) )
			continue;
		if( ! grd[dpkmn[d]] )
			AppendRow( card, betterBreakdown( dpkmn[d], atk[dpkmn[d]], grd[dpkmn[d].split("-")[0]], spt[dpkmn[d].split("-")[0]] ) );
		else
			AppendRow( card, betterBreakdown( dpkmn[d], atk[dpkmn[d]], grd[dpkmn[d]], spt[dpkmn[d]] ) );
	}

}

function betterBreakdown( dpkmn, atk, grd, spt, hl="" ) {
	let		row, det, elem;
	let		field, i;

	det = pkmnDetailsSummary();

	elem = dcE( "div" );
	elem.setAttribute( "class", "title" );
/*
	elem.appendChild( dcE("img" ));
	elem.lastChild.setAttribute( "alt", "" );
	elem.lastChild.setAttribute( "src", getPkmnSpriteSrc(dpkmn) );
	elem.lastChild.setAttribute( "class", "pokemon-sprite" );
*/
	elem.appendChild( dcE( "h4" ) ); // h4 level good
	elem.lastChild.appendChild( dcTN( getPkmnField(dpkmn,"name") ) );
	field = getPkmnField( dpkmn, "type" );
	for( i = 0; i < field.length; i++ )
		elem.appendChild( getTypeImg(field[i]) );
	if( isGigamax( dpkmn ) )
		elem.appendChild( getIcon( "Gigantamax" ) );
	appendToPkmnSummary( det, elem );

	elem = ranks_div( atk.best, atk[atk.best].rank, grd.rank, spt.rank );
	appendToPkmnSummary( det, elem );
	if( hl == "atk" )
		elem.childNodes[0].classList.add( "atk-hl" );
	else if( hl == "grd" )
		elem.childNodes[1].classList.add( "grd-hl" );
	else if( hl == "spt" )
		elem.childNodes[2].classList.add( "spt-hl" );

	det.appendChild( stats_div(dpkmn) );


	det.appendChild( dcE( "div" ) )
	det.lastChild.setAttribute( "class", "da-div-container" );

	det.lastChild.appendChild( dcE( "div" ) );
	det.lastChild.lastChild.setAttribute( "class", "da-div" );
	elem = dcE( "h5" ); // h5 level good
	det.lastChild.lastChild.appendChild( elem );
	elem.appendChild( dcTN("Defending") );

	elem = det.lastChild.lastChild;
	field = Object.keys(grd).filter( (i) => i.startsWith("CHRG_") );
	for( i = 0; i < field.length; i++ )
		elem.appendChild( rankedDefendGrid( dpkmn, grd[field[i]], field[i] ) );

	det.lastChild.appendChild( dcE( "div" ) );
	det.lastChild.lastChild.setAttribute( "class", "da-div" );
	elem = dcE( "h5" ); // h5 level good
	det.lastChild.lastChild.appendChild( elem );
	elem.appendChild( dcTN("Attacking") );

	elem = det.lastChild.lastChild;
	for( i = 0; i < atk.ordered.length; i++ )
		elem.appendChild( rankedMaxAttackGrid( dpkmn, atk, atk.ordered[i] ) );

	det.appendChild( powerUpCostTable(getPkmnField(dpkmn,"dynamax-class")) );

	return det;



}

function ranks_div( move, atk, grd, spt ) {
	let		div, d;
	let		atkd, grdd, sptd;
	let		type, name, dg;

	div = dcE( "div" );
	div.setAttribute( "class", "ranks-div" );

	for( d = 0; d < 3; d++ ) {
		div.appendChild( dcE( "div" ) );
		div.lastChild.setAttribute( "class", "ranks-cont" );
	}

	atkd = div.childNodes[0];
	grdd = div.childNodes[1];
	sptd = div.childNodes[2];

	type = getMoveField( move, "type" );
	name = getMoveField( move, "name" );
	if( move.startsWith("DYNA") )
		dg = "max";
	else
		dg = "gigamax";

	atkd.appendChild( getTypeImg(type,dg) );
	atkd.lastChild.setAttribute( "alt", name );
	grdd.appendChild( getIcon("Max Guard") );
	sptd.appendChild( getIcon("Max Spirit") );

	atkd.appendChild( dcE( "div" ) );
	atkd.lastChild.appendChild( rank_letter_div( atk ) );
	atkd.lastChild.setAttribute( "class", "letter" );
	grdd.appendChild( dcE( "div" ) );
	grdd.lastChild.appendChild( rank_letter_div( grd ) );
	grdd.lastChild.setAttribute( "class", "letter" );
	sptd.appendChild( dcE( "div" ) );
	sptd.lastChild.appendChild( rank_letter_div( spt ) );
	sptd.lastChild.setAttribute( "class", "letter" );

	return div;
}

function rank_letter_div( letter ) {
	let		div, cls;

	cls = "rank-";
	cls += letter.toLowerCase()[0];
	if( letter.endsWith("-") )
		cls += "-m";
	if( letter.endsWith("+") )
		cls += "-p";

	div = dcE( "div" );
	div.setAttribute( "class", "rank-letter-div " + cls );
	div.appendChild( dcTN( letter ) );

	return div;
}

function rankedDefendGrid( dpkmn, grd, move ) {
	let		div;

	div = dcE( "div" );
	div.setAttribute( "class", "defend-grid" );

	div.appendChild( getTypeImg( getMoveField(move,"type") ) );
	div.lastChild.classList.add( "charge-icon" );

	div.appendChild( dcE( "div" ) );
	div.lastChild.appendChild( dcTN( getMoveField(move,"name") ) );
	div.lastChild.classList.add( "charge-attack" );

	div.appendChild( rank_letter_div(grd.rank) );
	div.lastChild.classList.add( "rank" );

	return div;
}

function rankedMaxAttackGrid( dpkmn, atk, move ) {
	let		elem, div;
	let		type;
	let		fast, f, g, t;

	elem = dcE( "div" ); // TODO li?
	elem.setAttribute( "class", "max-cont" );

	div = dcE( "div" );
	div.setAttribute( "class", "max-grid" );
	elem.appendChild( div );

	g = "max";
	if( move.endsWith("-G") )
		g = "gigamax";
	div.appendChild( getTypeImg(getMoveField(move,"type"),g) );
	div.lastChild.classList.add( "max-icon" );

	div.appendChild( dcE( "div" ) );
	div.lastChild.classList.add( "max-attack" );
	div.lastChild.appendChild( dcTN(getMoveField(move,"name")) );

	div.appendChild( rank_letter_div( atk[move].rank ) );

	fast = getPkmnMoveset( dpkmn, "fast", "all" );
	fast = fast.filter( (f) => getMaxMoveFromFast(f) == move );

	for( f = 0; f < fast.length; f++ ) {
		for( g = f+1; g < fast.length; g++ ) {
			if( getMoveField(fast[f],"raid-cooldown") > getMoveField(fast[g],"raid-cooldown") ) {
				t = fast[f];
				fast[f] = fast[g];
				fast[g] = t;
			}
		}
	}

	for( f = 0; f < fast.length; f++ ) {
		div = dcE( "div" );
		div.setAttribute( "class", "fast-grid" );
		elem.appendChild( div );

		div.appendChild( getTypeImg(getMoveField(fast[f],"type")) );
		div.lastChild.classList.add( "fast-icon" );

		div.appendChild( dcE( "div" ) );
		div.lastChild.classList.add( "fast-attack" );
		div.lastChild.appendChild( dcTN( getMoveField(fast[f],"name" )) );

		if( pkmnNeedsETM( dpkmn, fast[f] ) ) {
			div.lastChild.appendChild( getIcon("TM") );
			div.lastChild.lastChild.setAttribute( "alt", "Requires Elite TM" );
			div.lastChild.lastChild.setAttribute( "title", "Requires Elite TM" );
		}

		div.appendChild( dcE( "div" ) );
		div.lastChild.classList.add( "sec" );
		div.lastChild.appendChild( dcE( "span" ) );
		div.lastChild.lastChild.classList.add( "value" );
		div.lastChild.lastChild.appendChild( dcTN( getMoveField(fast[f],"raid-cooldown")) );
		div.lastChild.appendChild( dcE( "span" ) );
		div.lastChild.lastChild.classList.add( "unit" );
		div.lastChild.lastChild.appendChild( dcTN( "SEC" ) );
	}

	return elem;
}

function dcE( val ) {
	return document.createElement( val );
}
function dcTN( val ) {
	return document.createTextNode( val );
}

function init() {
	let		alltypes;
	let		gpkmn, tier;
	let		dpkmn, d;
	let		field, f;
	let		types, t;
	let		gCPM, dCPM;
	let		atk, def, adr;
	let		pwr, adv, stab;
	let		hp;
	let		gattacks, attacks, a;
	let		spirits;
	let		min, max, mid, avg;

	gpkmn = "892-RG";
	gpkmn = "892-SG";
	gpkmn = "243";
	gpkmn = "3-G";
	tier = getPkmnMaxBattleTier(gpkmn);
	gCPM = getMaxBossCPM( tier );
	dCPM = getLevelScalar( 40 );
	def = getPkmnField( gpkmn, "base-defense" ) + 15;

	attacks = [];
	spirits = [];
	alltypes = new Set();
	dpkmn = getAvailableDynaPkmn("2025-03-08");

	outputgpkmn( gpkmn );
	//output_tsv_attacks( gpkmn );

	output_tsv_all( rankMaxAttack(dpkmn,gpkmn), rankMaxGuard(dpkmn,gpkmn), rankMaxSpirit(dpkmn) );

}

function outputgpkmn( gpkmn ) {
	let		out;
	let		tier;

	tier = getPkmnMaxBattleTier(gpkmn);

	out = document.getElementById( "body" );
	out.appendChild( dcE( "div" ) );
	out.lastChild.appendChild( dcTN( gpkmn + " " ));
	out.lastChild.appendChild( dcTN( getPkmnField(gpkmn,"name") ));
	out.lastChild.appendChild( dcE( "br" ) );
	out.lastChild.appendChild( dcTN( "Attack:" + getPkmnField(gpkmn,"base-attack") ));
	out.lastChild.appendChild( dcE( "br" ) );
	out.lastChild.appendChild( dcTN( "Defense:" + getPkmnField(gpkmn,"base-defense") ));
	out.lastChild.appendChild( dcE( "br" ) );
	out.lastChild.appendChild( dcTN( "Stamina:" + getPkmnField(gpkmn,"base-stamina") ));
	out.lastChild.appendChild( dcE( "br" ) );
	out.lastChild.appendChild( dcTN( "Tier: " + tier ) );
	out.lastChild.appendChild( dcE( "br" ) );
	out.lastChild.appendChild( dcTN( "CPM: " + getMaxBossCPM(tier) ) );
	out.lastChild.appendChild( dcE( "br" ) );
	out.lastChild.appendChild( dcTN( "HP: " + getMaxBossHP(tier) ) );
	out.lastChild.appendChild( dcE( "br" ) );
}

function output_tsv_rankedattacks( ranks ) {
	let		out;
	let		d;

	out = document.getElementById( "body" );
	out.appendChild( dcE( "pre" ) );
	out.lastChild.innerHTML += "Dex Index\tPokemon";
	out.lastChild.innerHTML += "Power\tGrade\tAttack\n";

	for( d = 0; d < ranks.best.length; d++ ) {
		out.lastChild.innerHTML += ranks.best[d] + "\t";
		out.lastChild.innerHTML += getPkmnField(ranks.best[d],"name") + "\t";
		if( getPkmnField(ranks.best[d],"name").length < 8 )
			out.lastChild.innerHTML += "\t";
//		out.lastChild.innerHTML += getPkmnField(ranks.ordered[d],"base-attack") + "\t";
//		out.lastChild.innerHTML += getPkmnField(ranks.ordered[d],"base-defense") + "\t";
//		out.lastChild.innerHTML += getPkmnField(ranks.ordered[d],"base-stamina") + "\t";
		out.lastChild.innerHTML += Math.floor(ranks[ranks.ordered[d]]["pwr"]) + "\t";
		out.lastChild.innerHTML += ranks[ranks.ordered[d]]["rank"] + "\t";
		out.lastChild.innerHTML += ranks[ranks.ordered[d]]["move"] + "\n";
	}

}

function output_tsv_all( atk, grd, spt ) {
	let		out;
	let		d;
	let		pkmn;

	out = document.getElementById( "body" );
	out.appendChild( dcE( "pre" ) );
	out.lastChild.innerHTML += "Index\tPokemon\t\t";
	out.lastChild.innerHTML += "| Atk\tPower\t| Guard\tAvg\t| Sprt\tSTA\n";

	for( d = 0; d < atk.best.length; d++ ) {
		out.lastChild.innerHTML += atk.best[d] + "\t";
		out.lastChild.innerHTML += getPkmnField(atk.best[d],"name") + "\t";
		if( getPkmnField(atk.best[d],"name").length < 8 )
			out.lastChild.innerHTML += "\t";
		out.lastChild.innerHTML += "| " + atk[atk.best[d]][atk[atk.best[d]].best].rank + "\t";
		out.lastChild.innerHTML += Math.floor(atk[atk.best[d]][atk[atk.best[d]].best].pwr) + "\t";
		pkmn = atk.best[d];
		if( ! grd[pkmn] )
			pkmn = pkmn.split("-")[0];
		out.lastChild.innerHTML += "| " + grd[pkmn]["rank"] + "\t";
		out.lastChild.innerHTML += grd[pkmn]["avg"] + "\t";
		out.lastChild.innerHTML += "| " + spt[pkmn]["rank"] + "\t";
		out.lastChild.innerHTML += getPkmnField( pkmn,"base-stamina" ) + "\n";
	}


}
