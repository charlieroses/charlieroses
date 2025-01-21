function getAvailableDynaPkmn( date ) {
	let		ret = [];
	let		p;
	
	for( p = 0; p < dbpokemon.dynadex.length; p++ ) {
		if( willBeAvailable( date, dbpokemon.dynadex[p], "dynamax" ) ||
		    willBeAvailable( date, dbpokemon.dynadex[p]+"-G" ) )
			ret.push( dbpokemon.dynadex[p] );
	}

	return ret;
}

function getEvolvedDynaPkmn() {
	let		dpkmn, d;
	let		rpkmn;

	rpkmn = [];
	dpkmn = getAvailableDynaPkmn();
	for( d = 0; d < dpkmn.length; d++ ) {
		if( getPkmnEvolvesInto(dpkmn[d]).length == 0 )
			rpkmn.push( dpkmn[d] );
	}

	return rpkmn;
}

function getAvailableGigaPkmn() {
	return dbpokemon.gigadex;
}

function getAllMaxBattles() {
	let		dpkmn, d;
	let		gpkmn, g;
	let		rpkmn, r, rl;

	rpkmn = [];
	gpkmn = getAvailableGigaPkmn();
	dpkmn = getAvailableDynaPkmn();
	dpkmn = dpkmn.filter( d => getPkmnField( d, "max-battle-tier" ) != 0 );

	rl = dpkmn.length + gpkmn.length;

	d = 0;
	g = 0;
	for( r = 0; r < rl; r++ ) {
		if( g == gpkmn.length ) {
			rpkmn.push( dpkmn[d] );
			d++;
		}
		else if( d == dpkmn.length ) {
			rpkmn.push( gpkmn[g] );
			g++;
		}
		else if( compareDexOrder(dpkmn[d], gpkmn[g]) < 0 ) {
			rpkmn.push( dpkmn[d] );
			d++;
		}
		else {
			rpkmn.push( gpkmn[g] );
			g++;
		}
	}

	return rpkmn;
}

function getAllGigaPkmn() {
	return Object.keys(dbmoves["giga-moves"]);
}

function hasGigamax( di ) {
	return dbpokemon.gigadex.includes( di );
}

function isGigamax( di ) {
	let		fd;

	fd = getPkmnField( di, "form-data" );

	if( ! fd )
		return false;
	return fd.type == "Giga";
}

function getMaxBossMoveset( di ) {
	if( isGigamax(di) )
		return getPkmnMoveset( di, "charged", "all" );
	else
		return getPkmnMoveset( di, "charged", "standard" );
}

function getMaxBossScenarios( di ) {
	let		moves;
	let		scens, s, t;

	moves = getMaxBossMoveset( di );
	scens = [];

	if( moves.length == 1 ) {
		scens.push({
			"spread": moves[0],
			"target": moves[0]
		});

		return scens;
	}

	for( s = 0; s < moves.length; s++ ) {
		for( t = 0; t < moves.length; t++ ) {
			if( s == t )
				continue;
			scens.push({
				"spread": moves[s],
				"target": moves[t]
			});
		}
	}

	return scens;
}

function getMaxMoveFromFast( move ) {
	return "DYNA_" + move.split("_")[1];
}

function getMaxBattleCost( tier ) {
	return dbdynamax["battles"][tier]["cost"];
}

function getMaxBossCPM( tier ) {
	return dbdynamax["battles"][tier]["cpm"];
}

function getPowerUpCost( clss, level ) {
	let		ret = {};

	ret["candy"] = dbdynamax["moves"]["cost"][clss]["candy"][level-1];
	ret["xl"] = dbdynamax["moves"]["cost"][clss]["xl"][level-1];
	ret["dust"] = dbdynamax["moves"]["cost"]["dust"][level-1];

	return ret;
}

const dbdynamax= {
	"battles": {
		1: { "cost": 200, "cpm": 0.15 },
		2: { "cost": 400, "cpm": 0.2968 }, // TODO This is an educated guess
		3: { "cost": 400, "cpm": 0.5 },
		4: { "cost": 800, "cpm": 0 },
		5: { "cost": 800, "cpm": 0.79030001 }, // I guessed right!!!
		6: { "cost": 800, "cpm": 0.85 }
	},
	"moves": {
		"cost": {
			"dust": [ 400, 600, 800 ],
			1: {
				"candy": [ 50, 100, 0 ],
				"xl": [ 0, 0, 40 ]
			},
			2: {
				"candy": [ 60, 110, 0 ],
				"xl": [ 0, 0, 45 ]
			},
			3: {
				"candy": [ 70, 120, 0 ],
				"xl": [ 0, 0, 50 ]
			},
			4: {
				"candy": [ 80, 130, 0 ],
				"xl": [ 0, 0, 55 ]
			}
		},
		"max-attack": [ 250, 300, 350 ],
		"gmax-attack": [ 350, 400, 450 ],
		"guard": [ 20, 40, 60 ],
		"spirit": [ 8, 12, 16 ]
	}
};
