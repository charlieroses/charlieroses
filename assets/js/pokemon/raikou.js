var GPKMN;

function rankSurvival( dpkmn, gpkmn ) {
	let		ret = {};
	let		moves, m;
	let		atk, def, dmg, hp, grd;

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
		ret[dpkmni]["avg_grd"] = 0;
		hp = pkmnHP( dpkmni, 40, [ 10, 10, 10 ] );
		grd = hp + 180;
		def = (getPkmnField( dpkmni, "base-defense" ) + 10) * getLevelScalar( 40 );
		ret[dpkmni].hp = hp;
		ret[dpkmni].def = def;
		ret[dpkmni].grd = grd;
		for( j = 0; j < moves.length; j++ ) {
			dmg = getMoveField( moves[j], "raid-power" );
			dmg *= getSTAB( gpkmn, moves[j] );
			dmg *= getTypeAdvantage( getMoveField(moves[j],"type"), getPkmnField(dpkmni,"type") );
			dmg *= ( atk / def );
			dmg = Math.floor( dmg / 2 ) + 1;
			ret[dpkmni][moves[j]] = {};
			ret[dpkmni][moves[j]].dmg = dmg;
			ret[dpkmni][moves[j]].hits = Math.ceil( hp / dmg );
			ret[dpkmni][moves[j]].hitsgrd = Math.ceil( grd / dmg );
			ret[dpkmni]["avg"] += Math.ceil( hp / dmg );
			ret[dpkmni]["avg_grd"] += Math.ceil( grd / dmg );

			if( ret[dpkmni][moves[j]].hits < 2 )
				ret[dpkmni][moves[j]].rank = "F";
			else if( ret[dpkmni][moves[j]].hits < 2 )
				ret[dpkmni][moves[j]].rank = "D";
			else if( ret[dpkmni][moves[j]].hits < 3 )
				ret[dpkmni][moves[j]].rank = "C";
			else if( ret[dpkmni][moves[j]].hits < 4 )
				ret[dpkmni][moves[j]].rank = "B";
			else if( ret[dpkmni][moves[j]].hits < 5 )
				ret[dpkmni][moves[j]].rank = "A";
			else
				ret[dpkmni][moves[j]].rank = "A+";
		}
		ret[dpkmni]["avg"] /= (moves.length * 1.0);
		ret[dpkmni]["avg_grd"] /= (moves.length * 1.0);

		if( ret[dpkmni]["avg_grd"] < 2 )
			ret[dpkmni].rank = "F";
		else if( ret[dpkmni]["avg"] < 2 )
			ret[dpkmni].rank = "D";
		else if( ret[dpkmni]["avg"] < 3 )
			ret[dpkmni].rank = "C";
		else if( ret[dpkmni]["avg"] < 4 )
			ret[dpkmni].rank = "B";
		else if( ret[dpkmni]["avg"] < 5 )
			ret[dpkmni].rank = "A";
		else
			ret[dpkmni].rank = "A+";
	}

	for( i = 0; i < dpkmn.length; i++ ) {
		if( ! isGigamax( dpkmn[i] ) )
			continue;
		if( ret[dpkmn[i]] )
			continue;
		ret[dpkmn[i]] = ret[dpkmn[i].split("-")[0]];
	}

	console.log( "SURVIVAL" );
	console.log( ret );

	return ret;
}

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


	for( i = 0; i < dpkmn.length; i++ ) {
		if( ! isGigamax( dpkmn[i] ) )
			continue;
		if( ret[dpkmn[i]] )
			continue;
		ret[dpkmn[i]] = ret[dpkmn[i].split("-")[0]];
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
			ret[dpkmn[i]][field[j]].fasts = [];
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
	for( i = 0; i < dpkmn.length; i++ ) {
		ret[dpkmn[i]].rank = ret[dpkmn[i]][ret[dpkmn[i]].best].rank;
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
		hp = 180;
		def = (getPkmnField( dpkmni, "base-defense" ) + 10) * getLevelScalar( 40 );
		for( j = 0; j < moves.length; j++ ) {
			dmg = getMoveField( moves[j], "raid-power" );
			dmg *= getSTAB( gpkmn, moves[j] );
			dmg *= getTypeAdvantage( getMoveField(moves[j],"type"), getPkmnField(dpkmni,"type") );
			dmg *= ( atk / def );
			dmg = Math.floor( dmg / 2 ) + 1;
			ret[dpkmni][moves[j]] = {};
			ret[dpkmni][moves[j]].hits = Math.ceil( hp / dmg );
			ret[dpkmni]["avg"] += Math.ceil( hp / dmg );
		}
		ret[dpkmni]["avg"] /= (moves.length * 1.0);
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

	for( i = 0; i < dpkmn.length; i++ ) {
		if( ! isGigamax( dpkmn[i] ) )
			continue;
		if( ret[dpkmn[i]] )
			continue;
		ret[dpkmn[i]] = ret[dpkmn[i].split("-")[0]];
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
	let		dpkmn, atk, grd, spt, srv;
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
	srv = rankSurvival( dpkmn, gpkmn );

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
	GPKMN = gpkmn;


	out = document.getElementById( "attack-pokemon-info" );
	card = pokecard( "Attackers" );
	out.appendChild( card );

	for( d = 0; d < atk.best.length; d++ ) {
		di = atk.best[d];
		o = atk[di];
		if( o[o.best].rank.startsWith( "B" ) )
			break;
		if( ! grd[di] )
			AppendRow( card, betterBreakdown( di, srv[di], atk[di], grd[di.split("-")[0]], spt[di.split("-")[0]], "atk" ) );
		else
			AppendRow( card, betterBreakdown( di, srv[di], atk[di], grd[di], spt[di], "atk" ) );
		atkrs.push( di );
	}
	AppendRow( card, cardRowBackToTop() );


	out = document.getElementById( "guard-pokemon-info" );
	card = pokecard( "Max Guard" );
	out.appendChild( card );
	AppendRow( card, cardRowText( "Note: Gigantamax has no affect on Max Guard" ) );
	card.lastChild.lastChild.classList.add( "card-row-note" );

	for( d = 0; d < grd.overall.length; d++ ) {
		di = grd.overall[d];
		o = grd[di];
		if( o.rank.startsWith( "C" ) )
			break;
		AppendRow( card, betterBreakdown( di, srv[di], atk[di], grd[di], spt[di], "grd" ) );
		grdrs.push( di );
	}
	AppendRow( card, cardRowBackToTop() );

	out = document.getElementById( "spirit-pokemon-info" );
	card = pokecard( "Max Spirit" );
	out.appendChild( card );
	AppendRow( card, cardRowText( "Note: Gigantamax has no affect on Max Spirit" ) );
	card.lastChild.lastChild.classList.add( "card-row-note" );

	for( d = 0; d < spt.ordered.length; d++ ) {
		di = spt.ordered[d];
		o = spt[di];
		if( o.rank.startsWith( "C" ) )
			break;
		AppendRow( card, betterBreakdown( di, srv[di], atk[di], grd[di], spt[di], "spt" ) );
		sptrs.push( di );
	}
	AppendRow( card, cardRowBackToTop() );

	out = document.getElementById( "other-pokemon-info" );
	card = pokecard( "Everyone Else" );
	out.appendChild( card );

	for( d = 0; d < dpkmn.length; d++ ) {
		if( atkrs.includes(dpkmn[d]) || grdrs.includes(dpkmn[d]) || sptrs.includes(dpkmn[d]) )
			continue;
		if( ! grd[dpkmn[d]] )
			AppendRow( card, betterBreakdown( dpkmn[d], srv[dpkmn[d].split("-")[0]], atk[dpkmn[d]], grd[dpkmn[d].split("-")[0]], spt[dpkmn[d].split("-")[0]] ) );
		else
			AppendRow( card, betterBreakdown( dpkmn[d], srv[dpkmn[d]], atk[dpkmn[d]], grd[dpkmn[d]], spt[dpkmn[d]] ) );
	}

	AppendRow( card, cardRowBackToTop() );

}

function sortBySpeed( moves ) {
	let		i, j, t;
	let		fn;

	if( moves[0].startsWith("CHRG") )
		fn = "raid-duration";
	else if( moves[0].startsWith("FAST") )
		fn = "raid-cooldown";
	else
		return moves;

	for( i = 0; i < moves.length; i++ ) {
		for( j = i+1; j < moves.length; j++ ) {
			if( getMoveField(moves[i],fn) > getMoveField(moves[j],fn) ) {
				t = moves[i];
				moves[i] = moves[j];
				moves[j] = t;
			}
		}
	}

	return moves;
}

function betterBreakdown( dpkmn, srv, atk, grd, spt, hl="" ) {
	let		row, det, elem, params;
	let		field, i, j;

	det = pkmnDetailsSummary();

	elem = dcE( "div" );
	elem.setAttribute( "class", "title" );


	elem.appendChild( dcE( "h4" ) ); // h4 level good
	elem.lastChild.appendChild( dcTN( getPkmnField(dpkmn,"name") ) );
	elem.appendChild( getPkmnSprite(dpkmn) );
	
	/*
	field = getPkmnField( dpkmn, "type" );
	for( i = 0; i < field.length; i++ )
		elem.appendChild( getTypeImg(field[i]) );
	*/
	if( isGigamax( dpkmn ) )
		elem.appendChild( getIcon( "Gigantamax" ) );
	appendToPkmnSummary( det, elem );

	if( hl.length ) {
		elem = dcE( "div" );
		elem.setAttribute( "class", "ranks-div" );
		elem.appendChild( rank_survival( srv.rank ) ); 
		if( hl == "atk" )
			elem.appendChild( rank_max_move( atk.best, atk[atk.best].rank ) );
		else if( hl == "grd" )
			elem.appendChild( rank_max_move( "Max Guard", grd.rank ) );
		else if( hl == "spt" )
			elem.appendChild( rank_max_move( "Max Spirit", spt.rank ) );
	}
	else {
		elem = dcE( "div" );
		elem.setAttribute( "class", "ranks-div" );
		elem.appendChild( rank_survival( srv.rank ) ); 
		elem.appendChild( rank_max_move( atk.best, atk[atk.best].rank ) );
		elem.appendChild( rank_max_move( "Max Guard", grd.rank ) );
		elem.appendChild( rank_max_move( "Max Spirit", spt.rank ) );
	}
	appendToPkmnSummary( det, elem );

	det.appendChild( stats_div(dpkmn) );

	params = {
		"NAME": getPkmnField( dpkmn, "name" ),
		"BOSS": getPkmnField( GPKMN, "name" ),
		"MAX": isGigamax(dpkmn) ? "G-Max" : "Max"
	};

	det.appendChild( dcE("div") );
	det.lastChild.setAttribute( "class", "rank-details survival-details" );
	det.lastChild.appendChild( rank_survival( srv.rank ) );
	det.lastChild.appendChild( dcE("div") );
	det.lastChild.lastChild.setAttribute( "class", "rank-explanation" );
	det.lastChild.lastChild.appendChild( dcTN( getRankText( "srv", srv.rank, params ) ) );

	det.appendChild( dcE("div") );
	det.lastChild.setAttribute( "class", "rank-details" );
	det.lastChild.appendChild( rank_max_move( atk.best, atk[atk.best].rank ) );
	det.lastChild.appendChild( dcE("div") );
	det.lastChild.lastChild.setAttribute( "class", "rank-explanation" );
	det.lastChild.lastChild.appendChild( dcTN( getRankText( "atk", atk[atk.best].rank, params) ) );

	det.appendChild( dcE("div") );
	det.lastChild.setAttribute( "class", "rank-details" );
	det.lastChild.appendChild( rank_max_move( "Max Guard", grd.rank ) );
	det.lastChild.appendChild( dcE("div") );
	det.lastChild.lastChild.setAttribute( "class", "rank-explanation" );
	det.lastChild.lastChild.appendChild( dcTN( getRankText( "grd", grd.rank, params) ) );

	det.appendChild( dcE("div") );
	det.lastChild.setAttribute( "class", "rank-details" );
	det.lastChild.appendChild( rank_max_move( "Max Spirit", spt.rank ) );
	det.lastChild.appendChild( dcE("div") );
	det.lastChild.lastChild.setAttribute( "class", "rank-explanation" );
	det.lastChild.lastChild.appendChild( dcTN( getRankText( "spt", spt.rank, params) ) );


	det.appendChild( dcE( "div" ) )
	det.lastChild.setAttribute( "class", "da-div-container" );

	det.lastChild.appendChild( dcE( "div" ) );
	det.lastChild.lastChild.setAttribute( "class", "da-div" );
	elem = dcE( "div" );
	elem.setAttribute( "class", "defending-title" );
	det.lastChild.lastChild.appendChild( elem );
	elem.appendChild( dcE("h5") ); // h5 level good
	elem.lastChild.appendChild( dcTN("Defending") );
	elem.appendChild( rank_survival_icon(srv.rank) );
	elem.lastChild.setAttribute( "alt", "" );
	elem.appendChild( getIcon("Max Guard") );
	elem.lastChild.setAttribute( "alt", "" );

	elem = det.lastChild.lastChild;
	field = Object.keys(grd).filter( (i) => i.startsWith("CHRG_") );
	for( i = 0; i < field.length; i++ )
		elem.appendChild( rankedDefendGrid( dpkmn, srv[field[i]], grd[field[i]], field[i] ) );

	det.lastChild.appendChild( dcE( "div" ) );
	det.lastChild.lastChild.setAttribute( "class", "da-div" );
	elem = dcE( "h5" ); // h5 level good
	det.lastChild.lastChild.appendChild( elem );
	elem.appendChild( dcTN("Attacking") );

	elem = det.lastChild.lastChild;
	for( i = 0; i < atk.ordered.length; i++ )
		elem.appendChild( rankedMaxAttackGrid( dpkmn, atk, atk.ordered[i] ) );

	if( isGigamax(dpkmn) ) {
		elem = dcE( "h5" ); // h5 level good
		det.lastChild.lastChild.appendChild( elem );
		elem.appendChild( dcTN("Charging") );
		field = sortBySpeed( getPkmnMoveset( dpkmn, "fast", "all" ) );
		for( i = 0; i < field.length; i++ ) {
			det.lastChild.lastChild.appendChild( fast_grid(dpkmn,field[i]) );
			det.lastChild.lastChild.lastChild.setAttribute( "class", "fast-grid charge-fast-grid" );
		}
	}

	det.appendChild( powerUpCostTable(getPkmnField(dpkmn,"dynamax-class")) );

	return det;
}

function ranks_div( move, atk, grd, spt ) {
	let		div;

	div = dcE( "div" );
	div.setAttribute( "class", "ranks-div" );

	div.appendChild( rank_max_move( move, atk ) );
	div.appendChild( rank_max_move( "Max Guard", grd ) );
	div.appendChild( rank_max_move( "Max Spirit", spt ) );

	return div;
}

function rank_survival( letter ) {
	let		div;

	div = dcE( "div" );
	div.setAttribute( "class", "ranks-cont survival-cont" );
	div.appendChild( rank_survival_icon(letter) );
	div.appendChild( dcE("div") );
	div.lastChild.appendChild( rank_letter_div(letter) );
	div.lastChild.setAttribute( "class", "letter" );

	return div;
}

function rank_survival_icon( letter ) {
	let		src, icon;

	src = assetsbase + "icons/pokemon/go/maxmeter/" + letter[0].toLowerCase();
	if( letter.length > 1 ) {
		if( letter.endsWith("+") )
			src += "p";
		else
			src += "m";
	}
	src += ".png"

	icon = dcE( "img" );
	icon.setAttribute( "src", src );
	icon.setAttribute( "alt", "Power Up Phase Strength" );
	icon.setAttribute( "class", "power-up-icon" );

	return icon;
}

function rank_max_move( move, letter ) {
	let		div;
	let		icon;

	if( move.startsWith("Max ") )
		icon = getIcon( move );
	else {
		if( move.startsWith("DYNA") )
			icon = getTypeImg(getMoveField(move,"type"),"max");
		else
			icon = getTypeImg(getMoveField(move,"type"),"gigamax");
		icon.setAttribute( "alt", getMoveField(move,"name") );
	}

	div = dcE( "div" );
	div.setAttribute( "class", "ranks-cont" );
	div.appendChild( icon );
	div.appendChild( dcE("div") );
	div.lastChild.appendChild( rank_letter_div(letter) );
	div.lastChild.setAttribute( "class", "letter" );

	return div;
}

function rank_letter_div( letter ) {
	let		div, cls;
	let		txt;

	txt = "";
	cls = "rank-";
	cls += letter.toLowerCase()[0];
	if( letter.endsWith("-") )
		cls += "-m";
	if( letter.endsWith("+") ) {
		cls += "-p";
		txt = letter[0];
	}

	div = dcE( "div" );
	div.setAttribute( "class", "rank-letter-div " + cls );
	if( !txt ) {
		div.appendChild( dcTN( letter ) );
		return div;
	}

	div.appendChild( dcTN( txt ) );
	div.appendChild( dcE("span") );
	div.lastChild.setAttribute( "class", "plus" );
	div.lastChild.appendChild( dcTN("+") );

	return div;
}

function rankedDefendGrid( dpkmn, srv, grd, move ) {
	let		div;

	div = dcE( "div" );
	div.setAttribute( "class", "defend-grid" );

	div.appendChild( getTypeImg( getMoveField(move,"type") ) );
	div.lastChild.classList.add( "charge-icon" );

	div.appendChild( dcE( "div" ) );
	div.lastChild.appendChild( dcTN( getMoveField(move,"name") ) );
	div.lastChild.classList.add( "charge-attack" );

	div.appendChild( dcE( "div" ) );
	div.lastChild.appendChild( dcE("div") );
	div.lastChild.lastChild.setAttribute( "class", "sr-only" );
	div.lastChild.lastChild.appendChild( dcTN("Power Up Phase Survival") );
	div.lastChild.appendChild( rank_letter_div(srv.rank) );
	div.lastChild.classList.add( "rank" );
	div.lastChild.classList.add( "rank-srv" );

	div.appendChild( dcE( "div" ) );
	div.lastChild.appendChild( dcE("div") );
	div.lastChild.lastChild.setAttribute( "class", "sr-only" );
	div.lastChild.lastChild.appendChild( dcTN("Max Guard strength") );
	div.lastChild.appendChild( rank_letter_div(grd.rank) );
	div.lastChild.classList.add( "rank" );
	div.lastChild.classList.add( "rank-grd" );

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

	if( isGigamax(dpkmn) )
		return elem;

	fast = getPkmnMoveset( dpkmn, "fast", "all" );
	fast = fast.filter( (f) => getMaxMoveFromFast(f) == move );
	fast = sortBySpeed( fast );

	for( f = 0; f < fast.length; f++ )
		elem.appendChild( fast_grid(dpkmn,fast[f]) );

	return elem;
}

function fast_grid( dpkmn, move ) {
	let		div;

	div = dcE( "div" );
	div.setAttribute( "class", "fast-grid" );

	div.appendChild( getTypeImg(getMoveField(move,"type")) );
	div.lastChild.classList.add( "fast-icon" );

	div.appendChild( dcE( "div" ) );
	div.lastChild.classList.add( "fast-attack" );
	div.lastChild.appendChild( dcTN( getMoveField(move,"name" )) );

	if(( isGigamax(dpkmn) && pkmnNeedsETM(dpkmn.split("-")[0],move) ) || pkmnNeedsETM(dpkmn,move) ) {
		div.lastChild.appendChild( getIcon("TM") );
		div.lastChild.lastChild.setAttribute( "alt", "Requires Elite TM" );
		div.lastChild.lastChild.setAttribute( "title", "Requires Elite TM" );
	}

	div.appendChild( dcE( "div" ) );
	div.lastChild.classList.add( "sec" );
	div.lastChild.appendChild( dcE( "span" ) );
	div.lastChild.lastChild.classList.add( "value" );
	div.lastChild.lastChild.appendChild( dcTN( getMoveField(move,"raid-cooldown")) );
	div.lastChild.appendChild( dcE( "span" ) );
	div.lastChild.lastChild.classList.add( "unit" );
	div.lastChild.lastChild.appendChild( dcTN( "SEC" ) );

	return div;
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
