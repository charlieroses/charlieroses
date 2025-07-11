function getAvailableDynaPkmn( date ) {
	let		ret = [];
	let		dis, p;

	dis = dbpokemon.order;
	for( p = 0; p < dis.length; p++ ) {
		if( dis[p].endsWith("-0") )
			continue;
		if( isGigamax(dis[p]) && willBeAvailable(date,dis[p]) )
			ret.push( dis[p] );
		else if( willBeAvailable(date,dis[p],"dynamax") )
			ret.push( dis[p] );
	}

	return ret;
}

function getDynaAvailability( di ) {
	if( isGigamax(di) )
		return getAvailability( di, "in-game" );
	else
		return getAvailability( di, "dynamax" );
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
	let		rpkmn, d, di;

	rpkmn = [];

	for( d = 0; d < dbpokemon.order.length; d++ ) {
		di = dbpokemon.order[d];
		if( isGigamax(di) && getAvailability(di) != false )
			rpkmn.push( di );
		if( getAvailability(di,"dynamax") != false && getPkmnField(di,"max-battle-tier") > 0 )
			rpkmn.push( di );
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
	if( ! fd.type )
		return false;
	return fd.type == "Giga";
}

function getMaxBossMoveset( di ) {
	let		ret;
	let		i, j, k, t;

	if( isGigamax(di) || getPkmnField(di,"max-battle-tier") == 5 )
		ret = getPkmnMoveset( di, "charged", "all" );
	else
		ret = getPkmnMoveset( di, "charged", "standard" );

	for( i = 0; i < ret.length; i++ ) {
		for( j = i+1; j < ret.length; j++ ) {
			if( ret[i] > ret[j] ) {
				t = ret[i];
				ret[i] = ret[j];
				ret[j] = t;
			}
		}
	}

	for( i = 0; i < ret.length; i++ ) {
		for( j = i+1; j < ret.length; j++ ) {
			if( ret[i].substring(5,8) != ret[j].substring(5,8) )
				break;
			console.log( i + ":" + ret[i] + " " + j + ":" + ret[j] );
			if( getMoveField(ret[i],"raid-power") < getMoveField(ret[j],"raid-power") ) {
				t = ret[i];
				ret[i] = ret[j];
				ret[j] = t;
			}
		}
	}

	return ret;
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
	if( ! dbdynamax["battles"][tier] )
		return 0;
	return dbdynamax["battles"][tier]["cost"];
}

function getMaxBossTier( di ) {
	if( isGigamax( di ) )
		return 6;
	else
		return getPkmnField(di,"max-battle-tier");
}

function getMaxBossCPM( tier ) {
	if( ! dbdynamax["battles"][tier] )
		return 0;
	return dbdynamax["battles"][tier]["cpm"];
}

function getMaxBossHP( tier ) {
	if( ! dbdynamax["battles"][tier] )
		return 0;
	return dbdynamax["battles"][tier]["hp"];
}

function getPowerUpCost( clss, level ) {
	let		ret = {};

	ret["candy"] = dbdynamax["moves"]["cost"][clss]["candy"][level-1];
	ret["xl"] = dbdynamax["moves"]["cost"][clss]["xl"][level-1];
	ret["dust"] = dbdynamax["moves"]["cost"]["dust"][level-1];

	return ret;
}

function getRankText( move, letter, params={"NAME":"","BOSS":"", "MAX":""} ) {
	let		text;
	let		p;

	if( ! dbdynamax["text"][move][letter] )
		text = dbdynamax["text"][move][letter[0]];
	else
		text = dbdynamax["text"][move][letter];

	for( p in params )
		text = text.replaceAll( "{" + p + "}", params[p] );

	return text;
}


const dbdynamax= {
	"battles": {
		1: {
			"cost": 200,
			"cpm": 0.15,
			"hp": 1700
		},
		2: {
			"cost": 400,
			"cpm": 0.2968, // TODO This is an educated guess
			"hp": 5000 // according to pokechespin
		},
		3: {
			"cost": 400,
			"cpm": 0.5,
			"hp": 10000
		},
		4: {
			"cost": 800,
			"cpm": 0,
			"hp": 20000 // according to pokechespin
		},
		5: {
			"cost": 800,
			"cpm": 0.79030001, // I guessed right!!!
			"hp": 15000
		},
		6: {
			"cost": 800,
			"cpm": 0.85,
			"hp": 0
		}
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
	},
	"text": {
		"srv": {
			"A": "{NAME} is a good choice for your first party slot. In most movesets, {NAME} can survive multiple power up phases without healing or shields.",
			"B": "In many cases, {NAME} can survive a full power up phase without shields or healing, but it'll take a lot of damage.",
			"C": "{NAME} may struggle to survive an entire power up phase. Don't put it in your first party slot.",
			"D": "{NAME} is a One Hit KO. If you use {NAME}, keep it out of the power up phase.",
			"F": "Even with shields, {NAME} is a One Hit KO. If you use {NAME}, keep it out of the power up phase."
		},
		"atk": {
			"A": "{NAME} has one of the strongest {MAX} Attacks against {BOSS}.",
			"B": "{NAME}'s {MAX} Attack can do a lot of damage when it's powered up. A Max Mushroom can give {NAME} the boost it needs to be an A tier attacker.",
			"C": "{NAME}'s {MAX} Attack isn't bad, but there are much better options. A Max Mushroom could help {NAME} in small groups with no other attackers are available.",
			"D": "{NAME}'s {MAX} Attack will do very little damage during the dynamax phase. If possible, unlock Max Guard or Max Spirit to use instead, or just avoid using {NAME}. A Max Mushroom will not help {NAME}.",
			"F": "{NAME}'s {MAX} Attack will do very little damage during the dynamax phase. If possible, unlock Max Guard or Max Spirit to use instead, or just avoid using {NAME}. A Max Mushroom will not help {NAME}."
		},
		"grd": {
			"A": "{NAME}'s shields are very strong against {BOSS}'s attacks. They'll survive a lot of attacks and will deflect the most targetted attacks away from your teammates without shields.",
			"B": "{NAME}'s shields can protect itself against {BOSS}'s attacks, but they aren't strong enough to deflect many targetted attacks away from your teammates without shields.",
			"C": "{NAME}'s shields can protect against some of {BOSS}'s attacks. They could help your pokemon survive another power up phase after other supporters have fainted.",
			"D": "{NAME}'s shields are weak to {BOSS}'s attacks. They will not protect your pokemon against any extra attacks. In many cases, they will be taken out in one hit.",
			"F": "{NAME}'s shields are useless against {BOSS}'s attacks. They will not protect your pokemon against any attacks."
		},
		"spt": {
			"A": "{NAME} will always be the best at healing its teammates. It's a smart choice to level up its Max Spirit",
			"B": "{NAME} is good at healing many of its teammates.",
			"C": "{NAME} can be good at healing its teammates, but there are also better options.",
			"D": "{NAME} is very bad at healing. It's a waste of candy to unlock Max Spirit",
			"F": "{NAME} is very bad at healing. It's a waste of candy to unlock Max Spirit"
		}
	}
};
