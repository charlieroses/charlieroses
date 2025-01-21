// Truncated Pokedex of Dynavailability?
function searchPkmn( name ) {
	let		dg, res;

	if( name.startsWith( "Dynamax " ) ) {
		dg = "D";
		name = name.substring( "Dynamax ".length );
	}
	else if( name.startsWith( "Gigamax " ) ) {
		dg = "G";
		name = name.substring( "Gigamax ".length );
	}
	else if( name.startsWith( "Gigantamax " ) ) {
		dg = "G";
		name = name.substring( "Gigantamax ".length );
	}

	// TODO check for & for display name search

	res = Object.keys(dbpokemon.entries).filter( di => dbpokemon.entries[di].name == name );
	if( res.length != 1 )
		return 0;

	if( dg == "G" )
		return res[0] + "-G";

	return res[0];
}

function getPkmn( di ) {
	if( ! dbpokemon.entries[di] )
		return 0;
	return dbpokemon.entries[di];
}

function getPkmnField( di, f ) {
	if( ! dbpokemon.entries[di] )
		return 0;
	if( ! dbpokemon.entries[di][f] ) {
		if( ! dbpokemon.entries[di]["form-data"] )
			return 0;
		else
			return getPkmnField( dbpokemon.entries[di]["form-data"]["base"], f );
	}
	return dbpokemon.entries[di][f];
}

function getAvailability( di, field="" ) {
	let		av;

	av = getPkmnField( di, "availability" );
	if( ! av )
		return false;

	if( ! av["in-game"] )
		return false;

	if( field.length == 0 )
		field = "in-game";

	if( ! av[field] )
		return false;

	return av[field];
}

function isAvailable( di, field="" ) {
	let		av;

	av = getAvailability( di, field );
	if( ! av )
		return false;
	if( Date.now() < Date.parse(av) )
		return false;
	return true;
}

function willBeAvailable( date, di, field="" ) {
	let		av;

	av = getAvailability( di, field );
	if( ! av )
		return false;
	if( Date.parse(date) < Date.parse(av) )
		return false;
	return true;
}

function getPkmnImageSrc( di ) {
	let		imgdi, dir;

	imgdi = getPkmnField( di, "image" );
	if( ! imgdi )
		imgdi = di;

	dir = di.split("-")[0];

	while( dir.length < 4 )
		dir = "0" + dir;

	return "/assets/images/pokemon/dex/" + dir + "/" + imgdi + ".png";
}

function getPkmnDisplayName( di ) {
	let		name;

	name = getPkmnField( di, "display-name" );
	if( ! name )
		name = getPkmnField( di, "name" );
	if( ! name )
		return 0;

	if( isGigamax( di ) )
		return "Gigantamax " + name;
	return name;
}

function getPkmnWeatherBoost( di ) {
	let		type, t, wb;

	wb = [];
	type = getPkmnField( di, "type" );
	for( t = 0; t < type.length; t++ )
		wb.push( getTypeWeatherBoost(type[t]));

	if( wb.length == 2 && wb[0] == wb[1] )
		wb.pop();

	return wb;
}

function getPkmnDoubleWeakness( di ) {
	let		type, types, t;
	let		weak;

	weak = [];
	type = getPkmnField( di, "type" );
	if( type.length == 1 )
		return weak;

	types = getAllTypes();
	for( t = 0; t < types.length; t++ ) {
		if( getTypeAdvantage( types[t], type[0], type[1] ) > 2 )
			weak.push( types[t] );
	}

	return weak;
}

function getPkmnWeakness( di ) {
	let		type, types, t;
	let		adv;
	let		weak;

	type = getPkmnField( di, "type" );
	if( type.length == 1 )
		return getTypeWeakness( type[0] );

	weak = [];

	types = getAllTypes();
	for( t = 0; t < types.length; t++ ) {
		adv = getTypeAdvantage( types[t], type[0], type[1] );
		if( 1 < adv && adv < 2 )
			weak.push( types[t] );
	}

	return weak;
}
function getPkmnResistance( di ) {
	let		type, types, t;
	let		adv;
	let		res;

	type = getPkmnField( di, "type" );
	if( type.length == 1 )
		return getTypeResistance( type[0] );

	res = [];

	types = getAllTypes();
	for( t = 0; t < types.length; t++ ) {
		adv = getTypeAdvantage( types[t], type[0], type[1] );
		if( 0.4 < adv && adv < 1 )
			res.push( types[t] );
	}

	return res;
}

function getPkmnDoubleResistance( di ) {
	let		type, types, t;
	let		res;

	type = getPkmnField( di, "type" );
	if( type.length == 1 )
		return getTypeImmunity( type[0] );

	res = [];

	types = getAllTypes();
	for( t = 0; t < types.length; t++ ) {
		if( getTypeAdvantage( types[t], type[0], type[1] ) < 0.6 )
			res.push( types[t] );
	}

	return res;
}

function getPkmnEvolvesInto( di ) {
	let		pkmn;
	pkmn = getPkmn( di );
	if( ! pkmn )
		return [];
	if( ! pkmn["evolves-into"] )
		return [];
	return pkmn["evolves-into"];
}

function getPkmnMoveset( di, fc, sea ) {
	let		set, moves, movesa;

	if( fc != "fast" && fc != "charged" )
		return [];
	if( sea != "standard" && sea != "etm" && sea != "all" )
		return [];
	
	set = fc + "-moves";
	movesa = [];
	
	if( sea == "standard" || sea == "all" ) {
		moves = getPkmnField( di, set );
		if( moves )
			movesa = movesa.concat( moves );
	}

	if( sea == "etm" || sea == "all" ) {
		moves = getPkmnField( di, "special-" + set );
		if( moves )
			movesa = movesa.concat( moves );
	}

	if( sea == "etm" || sea == "all" ) {
		moves = getPkmnField( di, "unobtainable-" + set );
		if( moves )
			movesa = movesa.concat( moves );
	}

	return movesa;
}

function checkSTAB( di, move ) {
	let		ts, t;

	ts = getPkmnField( di, "type" );
	for( t = 0; t < ts.length; t++ )
		if( ts[t] == getMoveField(move,"type") )
			return true;
	return false;
}

function applySTAB( di, move, field ) {
	if( checkSTAB( di, move ) )
		return Math.trunc(getMoveField( move, field ) * 1.2);
	else
		return getMoveField( move, field );
}

function getSTAB( di, move ) {
	let		ts, t;

	ts = getPkmnField( di, "type" );
	for( t = 0; t < ts.length; t++ )
		if( ts[t] == getMoveField(move,"type") )
			return 1.2;
	return 1.0;
}

function pkmnNeedsETM( di, move ) {
	let		pkmn, set;
	pkmn = getPkmn( di );
	if( ! pkmn )
		return false;
	if( move.startsWith( "FAST_" ) )
		set = "fast";
	else if( move.startsWith( "CHRG_" ) )
		set = "charged";
	else
		return false;
	set = "special-" + set + "-moves";
	if( ! pkmn[set] )
		return false;
	return pkmn[set].includes(move);
}

// TODO since we're using letters instead of numebrs, how to handle the forms
function compareDexOrder( di, dj ) {
	let		dib, dif;
	let		djb, djf;

	if( di == dj )
		return 0;

	dib = parseInt(di.split("-")[0]);
	djb = parseInt(dj.split("-")[0]);

	if( dib < djb )
		return -1;
	else if( dib > djb )
		return 1;
	
	if( di.split("-").length == 2 )
		dif = di.split("-")[1];
	else
		dif = 0;
	if( dj.split("-").length == 2 )
		djf = dj.split("-")[1];
	else
		djf = 0;

	if( dif == 0 || dif == "0" )
		return -1;
	if( djf == 0 || djf == "0" )
		return 1;

	return 0; // TODO forms

}

function pkmnCP( di, lvl, ivs ) {
	let		cp, baseatk, basedef, basehp, scalar;

	baseatk = getPkmnField( di, "base-attack" );
	basedef = getPkmnField( di, "base-defense" );
	basehp  = getPkmnField( di, "base-stamina" );
	scalar  = getLevelScalar( lvl );

	cp  = baseatk + ivs[0] ;
	cp *= Math.sqrt( basedef + ivs[1] );
	cp *= Math.sqrt( basehp + ivs[2] );
	cp *= scalar * scalar;
	cp /= 10;

	if( cp < 10 )
		return 10;
	
	cp = Math.floor( cp );

	return cp;
}

function pkmnHP( di, lvl, ivs ) {
	let		hp, basesta;

	basehp  = getPkmnField( di, "base-stamina" );
	scalar  = getLevelScalar( lvl );

	hp = ( basehp + ivs[2] ) * scalar;
	hp = Math.floor( hp );

	return hp;
}

const	dbpokemon = {
	"size-calc-blacklist": [ ], // TODO
	// TODO finish filling in availability
	//		getAvailability( dexindex, field )
	//		getDynaDex based on availabiltiy (filter)
	"dynadex": [
		"1",	"2",	"3",
		"4",	"5",	"6",
		"7",	"8",	"9",
		"66",	"67",	"68",
		"92",	"93",	"94",
		"98",	"99",
		"131",
		"144",	"145",	"146",
		"374",	"375",	"376",
		"529",	"530",
		"615",
		"810",	"811",	"812",
		"813",	"814",	"815",
		"816",	"817",	"818",
		"819",	"820",
		"831",	"832",
		"849",
		"870"
	],
	"gigadex": [ "3-G", "6-G", "9-G", "94-G", "99-G", "131-G", "849-G" ],
	"entries": {
		"1": {
			"dex-index": "1",
			"name": "Bulbasaur",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-03-25",
				"shadow": "2019-07-22",
				"shiny-shadow": "2022-07-09",
				"dynamax": "2024-09-10"
			},
			"category": "Seed",
			"type": [ "Grass", "Poison" ],
			"evolves-into": [ "2" ],
			"base-stamina": 128,
			"base-attack": 118,
			"base-defense": 111,
			"dynamax-class": 1,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_GRA_POWERWHIP",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.7,
			"weight-avg": 6.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 0.8625,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"2": {
			"dex-index": "2",
			"name": "Ivysaur",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-03-25",
				"shadow": "2019-07-22",
				"shiny-shadow": "2022-07-09",
				"dynamax": "2024-09-10"
			},
			"category": "Seed",
			"type": [ "Grass", "Poison" ],
			"evolves-from": "1",
			"evolves-into": [ "3" ],
			"base-stamina": 155,
			"base-attack": 151,
			"base-defense": 143,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_POWERWHIP",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 1,
			"weight-avg": 13,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 1.625,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"3": {
			"dex-index": "3",
			"name": "Venusaur",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-03-25",
				"shadow": "2019-07-22",
				"shiny-shadow": "2022-07-09",
				"dynamax": "2024-09-10"
			},
			"category": "Seed",
			"type": [ "Grass", "Poison" ],
			"evolves-from": "2",
			"base-stamina": 190,
			"base-attack": 198,
			"base-defense": 189,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_POI_SLUDGEBOMB"
			],
			"special-charged-moves": [
				"CHRG_GRA_FRENZYPLANT"
			],
			"height-avg": 2,
			"weight-avg": 100,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.25,
				"wt-std-dev": 12.5,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.5 ]
			}
		},
		"3-M": {
			"dex-index": "3-M",
			"form-data": {
				"base": "3",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2020-08-27",
				"shiny": "2020-08-27",
				"shadow": false
			},
			"height-avg": 2.4,
			"weight-avg": 155.5,
			"base-stamina": 190,
			"base-attack": 241,
			"base-defense": 246,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 12.5,
				"xxs": [ 1.176, 1.2 ],
				"xs": [ 1.2, 1.8 ],
				"m": [ 1.8, 3 ],
				"xl": [ 3, 3.6 ],
				"xxl": [ 3.6, 3.72 ]
			}
		},
		"3-G": {
			"dex-index": "3-G",
			"form-data": {
				"base": "3",
				"type": "Giga"
			},
			"availability": {
				"in-game": "2024-10-26",
				"shiny": "2024-10-26",
				"shadow": false
			},
			"height-avg": 24
		},
		"4": {
			"dex-index": "4",
			"name": "Charmander",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-05-19",
				"shadow": "2019-07-22",
				"shiny-shadow": "2022-07-09",
				"dynamax": "2024-09-10"
			},
			"category": "Lizard",
			"type": [ "Fire" ],
			"evolves-into": [ "5" ],
			"base-stamina": 118,
			"base-attack": 116,
			"base-defense": 93,
			"dynamax-class": 1,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMEBURST",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER",
			],
			"height-avg": 0.6,
			"weight-avg": 8.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.0625,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"5": {
			"dex-index": "5",
			"name": "Charmeleon",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-05-19",
				"shadow": "2019-07-22",
				"shiny-shadow": "2022-07-09",
				"dynamax": "2024-09-10"
			},
			"category": "Flame",
			"type": [ "Fire" ],
			"evolves-from": "4",
			"evolves-into": [ "6" ],
			"base-attack": 158,
			"base-defense": 126,
			"base-stamina": 151,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIR_FIREFANG",
			],
			"special-fast-moves": [
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_FIR_FIREPUNCH",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER",
			],
			"height-avg": 1.1,
			"weight-avg": 19,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 2.375,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"6": {
			"dex-index": "6",
			"name": "Charizard",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-05-19",
				"shadow": "2019-07-22",
				"shiny-shadow": "2022-07-09",
				"dynamax": "2024-09-10"
			},
			"category": "Flame",
			"type": [ "Fire", "Flying" ],
			"evolves-from": "5",
			"base-stamina": 186,
			"base-attack": 223,
			"base-defense": 173,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_FLY_AIRSLASH",
			],
			"special-fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FLY_WINGATTACK",
				"FAST_DRA_DRAGONBREATH",
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_OVERHEAT",
				"CHRG_DRA_DRAGONCLAW",
			],
			"special-charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_BLASTBURN",
			],
			"height-avg": 1.7,
			"weight-avg": 90.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 11.3125,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"6-X": {
			"dex-index": "6-X",
			"name": "Mega Charizard X",
			"form-data": {
				"base": "6",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2020-08-27",
				"shiny": "2020-08-27",
				"shadow": false
			},
			"base-stamina": 186,
			"base-attack": 273,
			"base-defense": 213,
			"height-avg": 1.7,
			"weight-avg": 110.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 11.3125,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"6-Y": {
			"dex-index": "6-Y",
			"name": "Mega Charizard Y",
			"form-data": {
				"base": "6",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2020-08-27",
				"shiny": "2020-08-27",
				"shadow": false
			},
			"base-stamina": 186,
			"base-attack": 319,
			"base-defense": 212,
			"height-avg": 1.7,
			"weight-avg": 100.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 11.3125,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"6-G": {
			"dex-index": "6-G",
			"form-data": {
				"base": "6",
				"type": "Giga"
			},
			"availability": {
				"in-game": "2024-10-26",
				"shiny": "2024-10-26",
				"shadow": false
			},
			"height-avg": 28
		},
		"7": {
			"dex-index": "7",
			"name": "Squirtle",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-07-08",
				"shadow": "2019-07-22",
				"shiny-shadow": "2022-07-09",
				"dynamax": "2024-09-10"
			},
			"category": "Tiny Turtle",
			"type": [ "Water" ],
			"evolves-into": [ "8" ],
			"base-stamina": 127,
			"base-attack": 94,
			"base-defense": 121,
			"dynamax-class": 1,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_AQUATAIL",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 0.5,
			"weight-avg": 9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"8": {
			"dex-index": "8",
			"name": "Wartortle",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-07-08",
				"shadow": "2019-07-22",
				"shiny-shadow": "2022-07-09",
				"dynamax": "2024-09-10"
			},
			"category": "Turtle",
			"type": [ "Water" ],
			"evolves-from": "7",
			"evolves-into": [ "9" ],
			"base-stamina": 153,
			"base-attack": 126,
			"base-defense": 155,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_ICEBEAM"
			],
			"height-avg": 1,
			"weight-avg": 22.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 2.8125,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"9": {
			"dex-index": "9",
			"name": "Blastoise",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-07-08",
				"shadow": "2019-07-22",
				"shiny-shadow": "2022-07-09",
				"dynamax": "2024-09-10"
			},
			"category": "Shellfish",
			"type": [ "Water" ],
			"evolves-from": "8",
			"base-stamina": 188,
			"base-attack": 171,
			"base-defense": 207,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_ICEBEAM",
				"CHRG_STE_FLASHCANNON",
				"CHRG_NOR_SKULLBASH"
			],
			"special-charged-moves": [
				"CHRG_WAT_HYDROCANNON"
			],
			"height-avg": 1.6,
			"weight-avg": 85.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 10.6875,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"9-M": {
			"dex-index": "9-M",
			"form-data": {
				"base": "9",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2020-08-27",
				"shiny": "2020-08-27",
				"shadow": false
			},
			"base-stamina": 188,
			"base-attack": 264,
			"base-defense": 237,
			"height-avg": 1.6,
			"weight-avg": 101.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 10.6875,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"9-G": {
			"dex-index": "9-G",
			"form-data": {
				"base": "9",
				"type": "Giga"
			},
			"availability": {
				"in-game": "2024-10-26",
				"shiny": "2024-10-26",
				"shadow": false
			},
			"height-avg": 25
		},
		"10": {
			"dex-index": "10",
			"name": "Caterpie",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-01",
				"shadow": "2024-10-08"
			},
			"category": "Worm",
			"type": [ "Bug" ],
			"evolves-into": [ "11" ],
			"base-stamina": 128,
			"base-attack": 55,
			"base-defense": 55,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.3,
			"weight-avg": 2.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.3625,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"11": {
			"dex-index": "11",
			"name": "Metapod",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-01",
				"shadow": "2024-10-08"
			},
			"category": "Cocoon",
			"type": [ "Bug" ],
			"evolves-from": "10",
			"evolves-into": [ "12" ],
			"base-stamina": 137,
			"base-attack": 45,
			"base-defense": 80,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.7,
			"weight-avg": 9.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.2375,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"12": {
			"dex-index": "12",
			"name": "Butterfree",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-01",
				"shadow": "2024-10-08"
			},
			"category": "Butterfly",
			"type": [ "Bug", "Flying" ],
			"evolves-from": "11",
			"base-stamina": 155,
			"base-attack": 167,
			"base-defense": 137,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_PSY_CONFUSION"
			],
			"special-fast-moves": [
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.1,
			"weight-avg": 32,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 4,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"12-G": {
			"dex-index": "12-G",
			"form-data": {
				"base": "12",
				"type": "Giga"
			},
			"available": {
				"in-game": false
			}
		},
		"13": {
			"dex-index": "13",
			"name": "Weedle",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-06-20",
				"shadow": "2019-10-17"
			},
			"category": "Hairy Bug",
			"type": [ "Bug", "Poison" ],
			"evolves-into": [ "14" ],
			"base-stamina": 120,
			"base-attack": 63,
			"base-defense": 50,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_POI_POISONSTING"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.3,
			"weight-avg": 3.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.4,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"14": {
			"dex-index": "14",
			"name": "Kakuna",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-06-20",
				"shadow": "2019-10-17"
			},
			"category": "Cocoon",
			"type": [ "Bug", "Poison" ],
			"evolves-from": "13",
			"evolves-into": [ "15" ],
			"base-stamina": 128,
			"base-attack": 46,
			"base-defense": 75,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_POI_POISONSTING"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.6,
			"weight-avg": 10,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.25,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"15": {
			"dex-index": "15",
			"name": "Beedrill",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-06-20",
				"shadow": "2019-10-17"
			},
			"category": "Poison Bee",
			"type": [ "Bug", "Poison" ],
			"evolves-from": "14",
			"base-stamina": 163,
			"base-attack": 169,
			"base-defense": 130,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_INFESTATION",
				"FAST_POI_POISONJAB"
			],
			"special-fast-moves": [
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_FLY_AERIALACE",
				"CHRG_BUG_XSCISSOR",
				"CHRG_BUG_FELLSTINGER"
			],
			"special-charged-moves": [
				"CHRG_GRO_DRILLRUN"
			],
			"height-avg": 1,
			"weight-avg": 29.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.6875,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"15-M": {
			"dex-index": "15-M",
			"name": "Mega Beedrill",
			"form-data": {
				"base": "15",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2020-08-27",
				"shiny": "2020-08-27",
				"shadow": false
			},
			"height-avg": 1.4,
			"weight-avg": 40.5,
			"base-stamina": 163,
			"base-attack": 303,
			"base-defense": 148,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.6875,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"16": {
			"dex-index": "16",
			"name": "Pidgey",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-02-27",
				"shadow": "2024-03-27"
			},
			"category": "Tiny Bird",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "17" ],
			"base-stamina": 120,
			"base-attack": 85,
			"base-defense": 73,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_DRA_TWISTER",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_AIRCUTTER"
			],
			"height-avg": 0.3,
			"weight-avg": 1.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.225,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"17": {
			"dex-index": "17",
			"name": "Pidgeotto",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-02-27",
				"shadow": "2024-03-27"
			},
			"category": "Bird",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "16",
			"evolves-into": [ "18" ],
			"base-stamina": 160,
			"base-attack": 117,
			"base-defense": 105,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_DRA_TWISTER",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_AIRCUTTER"
			],
			"height-avg": 1.1,
			"weight-avg": 30,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 3.75,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"18": {
			"dex-index": "18",
			"name": "Pidgeot",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-02-27",
				"shadow": "2024-03-27"
			},
			"category": "Bird",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "17",
			"base-stamina": 195,
			"base-attack": 166,
			"base-defense": 154,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_STE_STEELWING"
			],
			"special-charged-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_FLY_GUST"
			],
			"charged-moves": [
				"CHRG_FLY_HURRICANE",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FLY_FEATHERDANCE"
			],
			"special-charged-moves": [
				"CHRG_FLY_AIRCUTTER"
			],
			"height-avg": 1.5,
			"weight-avg": 39.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 4.9375,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"18-M": {
			"dex-index": "18-M",
			"name": "Mega Pidgeot",
			"form-data": {
				"base": "18",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2020-09-18",
				"shiny": "2020-09-18",
				"shadow": false
			},
			"base-stamina": 195,
			"base-attack": 280,
			"base-defense": 175,
			"height-avg": 2.2,
			"weight-avg": 50.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 4.9375,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.41 ]
			}
		},
		"19": {
			"dex-index": "19",
			"name": "Rattata",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-02-27",
				"shadow": "2019-07-22"
			},
			"category": "Mouse",
			"type": [ "Normal" ],
			"evolves-into": [ "20" ],
			"base-stamina": 102,
			"base-attack": 103,
			"base-defense": 70,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_NOR_HYPERFANG",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.3,
			"weight-avg": 3.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.4375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"19-A": {
			"dex-index": "19-A",
			"name": "Alolan Rattata",
			"form-data": {
				"base": "19",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28",
				"shadow": "2022-04-03"
			},
			"type": [ "Dark", "Normal" ],
			"evolves-into": [ "20-A" ],
			"base-stamina": 102,
			"base-attack": 103,
			"base-defense": 70,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_NOR_HYPERFANG",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 0.3,
			"weight-avg": 3.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.475,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"20": {
			"dex-index": "20",
			"name": "Raticate",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-02-27",
				"shadow": "2019-07-22"
			},
			"category": "Mouse",
			"type": [ "Normal" ],
			"evolves-from": "19",
			"base-stamina": 146,
			"base-attack": 161,
			"base-defense": 139,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_NOR_HYPERFANG",
				"CHRG_NOR_HYPERBEAM"
			],
			"height-avg": 0.7,
			"weight-avg": 18.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.3125,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"20-A": {
			"dex-index": "20-A",
			"name": "Alolan Raticate",
			"form-data": {
				"base": "20",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28",
				"shadow": "2022-04-03"
			},
			"type": [ "Dark", "Normal" ],
			"evolves-from": "19-A",
			"base-stamina": 181,
			"base-attack": 135,
			"base-defense": 154,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_NOR_HYPERFANG",
				"CHRG_NOR_HYPERBEAM"
			],
			"height-avg": 0.7,
			"weight-avg": 25.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 3.1875,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"21": {
			"dex-index": "21",
			"name": "Spearow",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2021-02-20"
			},
			"category": "Tiny Bird",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "22" ],
			"base-stamina": 120,
			"base-attack": 112,
			"base-defense": 60,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_DRILLPECK",
				"CHRG_FLY_SKYATTACK"
			],
			"special-charged-moves": [
				"CHRG_DRA_TWISTER"
			],
			"height-avg": 0.3,
			"weight-avg": 2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.25,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"22": {
			"dex-index": "22",
			"name": "Fearow",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2021-02-20"
			},
			"category": "Beak",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "21",
			"base-stamina": 163,
			"base-attack": 182,
			"base-defense": 133,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_GRO_DRILLRUN",
				"CHRG_FLY_SKYATTACK",
				"CHRG_FLY_FLY"
			],
			"special-charged-moves": [
				"CHRG_DRA_TWISTER"
			],
			"height-avg": 1.2,
			"weight-avg": 38,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 4.75,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"23": {
			"dex-index": "23",
			"name": "Ekans",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-07-25",
				"shadow": "2020-06-10",
				"shiny-shadow": "2020-07-10"
			},
			"category": "Snake",
			"type": [ "Poison" ],
			"evolves-into": [ "24" ],
			"base-stamina": 111,
			"base-attack": 110,
			"base-defense": 97,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_NOR_WRAP",
				"CHRG_POI_POISONFANG",
				"CHRG_POI_SLUDGEBOMB"
			],
			"special-charged-moves": [
				"CHRG_POI_GUNKSHOT"
			],
			"height-avg": 2,
			"weight-avg": 6.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.25,
				"wt-std-dev": 0.8625,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.5 ]
			}
		},
		"24": {
			"dex-index": "24",
			"name": "Arbok",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-07-25",
				"shadow": "2020-06-10",
				"shiny-shadow": "2020-07-10"
			},
			"category": "Cobra",
			"type": [ "Poison" ],
			"evolves-from": "23",
			"base-stamina": 155,
			"base-attack": 167,
			"base-defense": 153,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_POI_ACID",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_POI_GUNKSHOT",
				"CHRG_POI_ACIDSPRAY"
			],
			"height-avg": 3.5,
			"weight-avg": 65,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.4375,
				"wt-std-dev": 8.125,
				"xxs": [ 1.715, 1.75 ],
				"xs": [ 1.75, 2.625 ],
				"m": [ 2.625, 4.375 ],
				"xl": [ 4.375, 5.25 ],
				"xxl": [ 5.25, 6.125 ]
			}
		},
		"25": {
			"dex-index": "25",
			"name": "Pikachu",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2017-08-09"
			},
			"category": "Mouse",
			"type": [ "Electric" ],
			"evolves-from": "172",
			"evolves-into": [ "26" ],
			"base-stamina": 111,
			"base-attack": 112,
			"base-defense": 96,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_NOR_QUICKATTACK"
			],
			"special-fast-moves": [
				"FAST_NOR_PRESENT"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_WILDCHARGE"
			],
			"special-charged-moves": [
				"CHRG_ELE_THUNDER",
				"CHRG_WAT_SURF"
			],
			"height-avg": 0.4,
			"weight-avg": 6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.75,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"25-G": {
			"dex-index": "25-G",
			"form-data": {
				"base": "25",
				"type": "Giga"
			},
			"available": {
				"in-game": false
			}
		},
		"26": {
			"dex-index": "26",
			"name": "Raichu",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2017-08-09"
			},
			"category": "Mouse",
			"type": [ "Electric" ],
			"evolves-from": "25",
			"base-stamina": 155,
			"base-attack": 193,
			"base-defense": 151,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_VOLTSWITCH",
				"FAST_ELE_SPARK",
				"FAST_FAI_CHARM",
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_NOR_SKULLBASH",
				"CHRG_GRA_TRAILBLAZE"
			],
			"special-charged-moves": [
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 0.8,
			"weight-avg": 30,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.75,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"26-A": {
			"dex-index": "26-A",
			"name": "Alolan Raichu",
			"form-data": {
				"base": "26",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-07-19",
				"shiny": "2018-11-23"
			},
			"type": [ "Electric", "Psychic" ],
			"base-stamina": 155,
			"base-attack": 201,
			"base-defense": 154,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_VOLTSWITCH",
				"FAST_ELE_SPARK",
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.7,
			"weight-avg": 21,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.625,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"27": {
			"dex-index": "27",
			"name": "Sandshrew",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-12-06",
				"shadow": "2019-11-07"
			},
			"category": "Mouse",
			"type": [ "Ground" ],
			"evolves-into": [ "28" ],
			"base-stamina": 137,
			"base-attack": 126,
			"base-defense": 120,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_GRO_MUDSHOT",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_GRO_SANDTOMB"
			],
			"special-charged-moves": [
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.6,
			"weight-avg": 12,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.5,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"27-A": {
			"dex-index": "27-A",
			"name": "Alolan Sandshrew",
			"form-data": {
				"base": "27",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28",
				"shadow": "2022-04-03"
			},
			"type": [ "Ice", "Steel" ],
			"evolves-into": [ "28-A" ],
			"base-stamina": 137,
			"base-attack": 125,
			"base-defense": 129,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_ICE_BLIZZARD",
				"CHRG_STE_GYROBALL",
				"CHRG_DAR_NIGHTSLASH"
			],
			"height-avg": 0.7,
			"weight-avg": 40,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 5,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"28": {
			"dex-index": "28",
			"name": "Sandslash",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-12-06",
				"shadow": "2019-11-07"
			},
			"category": "Mouse",
			"type": [ "Ground" ],
			"evolves-from": "27",
			"base-stamina": 181,
			"base-attack": 182,
			"base-defense": 175,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_GRO_MUDSHOT",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_GRO_BULLDOZE",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"special-charged-moves": [
				"CHRG_DAR_NIGHTSLASH"
			],
			"height-avg": 1,
			"weight-avg": 29.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.6875,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"28-A": {
			"dex-index": "28-A",
			"name": "Alolan Sandslash",
			"form-data": {
				"base": "28",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28",
				"shadow": "2022-04-03"
			},
			"type": [ "Ice", "Steel" ],
			"evolves-from": "27-A",
			"base-stamina": 181,
			"base-attack": 177,
			"base-defense": 195,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_ICE_POWDERSNOW"
			],
			"special-fast-moves": [
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_ICE_BLIZZARD",
				"CHRG_STE_GYROBALL",
				"CHRG_GRO_BULLDOZE",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_GRO_DRILLRUN",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 1.2,
			"weight-avg": 55,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 6.875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"29": {
			"dex-index": "29",
			"name": "Nidoran F",
			"name-display": "Nidoran &female;",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-10-11",
				"shadow": "2020-02-03",
				"shiny-shadow": "2021-11-09"
			},
			"category": "Poison Pin",
			"type": [ "Poison" ],
			"evolves-into": [ "30" ],
			"base-stamina": 146,
			"base-attack": 86,
			"base-defense": 89,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_POI_POISONSTING"
			],
			"charged-moves": [
				"CHRG_POI_POISONFANG",
				"CHRG_NOR_BODYSLAM",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.4,
			"weight-avg": 7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"30": {
			"dex-index": "30",
			"name": "Nidorina",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-10-11",
				"shadow": "2020-06-10",
				"shiny-shadow": "2021-11-09"
			},
			"category": "Poison Pin",
			"type": [ "Poison" ],
			"evolves-from": "29",
			"evolves-into": [ "31" ],
			"base-stamina": 172,
			"base-attack": 117,
			"base-defense": 120,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_POI_POISONSTING"
			],
			"charged-moves": [
				"CHRG_POI_POISONFANG",
				"CHRG_GRO_DIG",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.8,
			"weight-avg": 20,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.5,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"31": {
			"dex-index": "31",
			"name": "Nidoqueen",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-10-11",
				"shadow": "2020-06-10",
				"shiny-shadow": "2021-11-09"
			},
			"category": "Drill",
			"type": [ "Poison", "Ground" ],
			"evolves-from": "30",
			"base-stamina": 207,
			"base-attack": 180,
			"base-defense": 173,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_POI_POISONFANG"
			],
			"height-avg": 1.3,
			"weight-avg": 60,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 7.5,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"32": {
			"dex-index": "32",
			"name": "Nidoran M",
			"name-display": "Nidoran &male;",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-07-04",
				"shadow": "2020-06-10",
				"shiny-shadow": "2023-02-01"
			},
			"category": "Poison Pin",
			"type": [ "Poison" ],
			"evolves-into": [ "33" ],
			"base-stamina": 130,
			"base-attack": 105,
			"base-defense": 76,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_POI_POISONSTING"
			],
			"charged-moves": [
				"CHRG_NOR_HORNATTACK",
				"CHRG_NOR_BODYSLAM",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.5,
			"weight-avg": 9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"33": {
			"dex-index": "33",
			"name": "Nidorino",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-07-04",
				"shadow": "2020-06-10",
				"shiny-shadow": "2023-02-01"
			},
			"category": "Poison Pin",
			"type": [ "Poison" ],
			"evolves-from": "32",
			"evolves-into": [ "34" ],
			"base-stamina": 156,
			"base-attack": 137,
			"base-defense": 111,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_POI_POISONSTING"
			],
			"charged-moves": [
				"CHRG_NOR_HORNATTACK",
				"CHRG_GRO_DIG",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_ICE_ICEBEAM"
			],
			"height-avg": 0.9,
			"weight-avg": 19.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 2.4375,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"34": {
			"dex-index": "34",
			"name": "Nidoking",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-07-04",
				"shadow": "2020-06-10",
				"shiny-shadow": "2023-02-01"
			},
			"category": "Drill",
			"type": [ "Poison", "Ground" ],
			"evolves-from": "33",
			"base-stamina": 191,
			"base-attack": 204,
			"base-defense": 156,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_STE_IRONTAIL",
				"FAST_FIG_DOUBLEKICK"
			],
			"special-fast-moves": [
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_BUG_MEGAHORN",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_GRO_SANDTOMB"
			],
			"height-avg": 1.4,
			"weight-avg": 62,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.175,
				"wt-std-dev": 7.75,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.8 ]
			}
		},
		"35": {
			"dex-index": "35",
			"name": "Clefairy",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-02-13"
			},
			"category": "Fairy",
			"type": [ "Fairy" ],
			"evolves-from": "173",
			"evolves-into": [ "36" ],
			"base-stamina": 172,
			"base-attack": 107,
			"base-defense": 108,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_NOR_BODYSLAM",
				"CHRG_FAI_MOONBLAST",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 0.6,
			"weight-avg": 7.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.9375,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"36": {
			"dex-index": "36",
			"name": "Clefable",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-02-13"
			},
			"category": "Fairy",
			"type": [ "Fairy" ],
			"evolves-from": "35",
			"base-stamina": 216,
			"base-attack": 178,
			"base-defense": 162,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_CHARGEBEAM",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FAI_CHARM",
				"FAST_FAI_FAIRYWIND"
			],
			"special-fast-moves": [
				"FAST_NOR_POUND"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_FAI_MOONBLAST",
				"CHRG_STE_METEORMASH",
				"CHRG_NOR_SWIFT",
				"CHRG_FAI_DRAININGKISS"
			],
			"height-avg": 1.3,
			"weight-avg": 40,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 5,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"37": {
			"dex-index": "37",
			"name": "Vulpix",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-10-09",
				"shadow": "2020-02-03"
			},
			"category": "Fox",
			"type": [ "Fire" ],
			"evolves-into": [ "38" ],
			"base-stamina": 116,
			"base-attack": 96,
			"base-defense": 109,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_WEATHERBALL"
			],
			"height-avg": 0.6,
			"weight-avg": 9.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.2375,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"37-A": {
			"dex-index": "37-A",
			"name": "Alolan Vulpix",
			"form-data": {
				"base": "37",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28",
				"shadow": "2023-02-01"
			},
			"type": [ "Ice" ],
			"evolves-into": [ "38-A" ],
			"base-stamina": 116,
			"base-attack": 96,
			"base-defense": 109,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_ICE_ICEBEAM",
				"CHRG_ICE_BLIZZARD",
				"CHRG_ICE_WEATHERBALL"
			],
			"height-avg": 0.6,
			"weight-avg": 9.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.2375,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"38": {
			"dex-index": "38",
			"name": "Ninetales",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-10-09",
				"shadow": "2020-02-03"
			},
			"category": "Fox",
			"type": [ "Fire" ],
			"evolves-from": "37",
			"base-stamina": 177,
			"base-attack": 169,
			"base-defense": 190,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_FIR_FIRESPIN"
			],
			"special-fast-moves": [
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIR_OVERHEAT",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_FIR_WEATHERBALL",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"special-charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 1.1,
			"weight-avg": 19.9,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 2.4875,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 2.2 ]
			}
		},
		"38-A": {
			"dex-index": "38-A",
			"name": "Alolan Ninetales",
			"form-data": {
				"base": "38",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28",
				"shadow": "2023-02-01"
			},
			"type": [ "Ice", "Fairy" ],
			"evolves-from": "37-A",
			"base-stamina": 177,
			"base-attack": 170,
			"base-defense": 193,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_ICE_POWDERSNOW",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_ICE_ICEBEAM",
				"CHRG_ICE_BLIZZARD",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_ICE_WEATHERBALL"
			],
			"height-avg": 1.1,
			"weight-avg": 19.9,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 2.4875,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 2.2 ]
			}
		},
		"39": {
			"dex-index": "39",
			"name": "Jigglypuff",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-04-16"
			},
			"category": "Balloon",
			"type": [ "Normal", "Fairy" ],
			"evolves-from": "174",
			"evolves-into": [ "40" ],
			"base-stamina": 251,
			"base-attack": 80,
			"base-defense": 41,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_STE_GYROBALL",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_NOR_SWIFT"
			],
			"special-charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.5,
			"weight-avg": 5.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.6875,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"40": {
			"dex-index": "40",
			"name": "Wigglytuff",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-04-16"
			},
			"category": "Balloon",
			"type": [ "Normal", "Fairy" ],
			"evolves-from": "39",
			"base-stamina": 295,
			"base-attack": 156,
			"base-defense": 90,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_DAR_FEINTATTACK",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_ICE_ICEBEAM",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_ICE_ICYWIND",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 1,
			"weight-avg": 12,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 1.5,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"41": {
			"dex-index": "41",
			"name": "Zubat",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-07-25",
				"shadow": "2019-07-22",
				"shiny-shadow": "2024-01-27"
			},
			"category": "Bat",
			"type": [ "Poison", "Flying" ],
			"evolves-into": [ "42" ],
			"base-stamina": 120,
			"base-attack": 83,
			"base-defense": 73,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_POI_POISONFANG",
				"CHRG_FLY_AIRCUTTER",
				"CHRG_NOR_SWIFT"
			],
			"special-charged-moves": [
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.8,
			"weight-avg": 7.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 0.9375,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"42": {
			"dex-index": "42",
			"name": "Golbat",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-07-25",
				"shadow": "2019-07-22",
				"shiny-shadow": "2024-01-27"
			},
			"category": "Bat",
			"type": [ "Poison", "Flying" ],
			"evolves-from": "41",
			"evolves-into": [ "169" ],
			"base-stamina": 181,
			"base-attack": 161,
			"base-defense": 150,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FLY_AIRCUTTER",
				"CHRG_POI_POISONFANG"
			],
			"special-charged-moves": [
				"CHRG_GHO_OMINOUSWIND"
			],
			"height-avg": 1.6,
			"weight-avg": 55,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 6.875,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"43": {
			"dex-index": "43",
			"name": "Oddish",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-10-03",
				"shadow": "2019-09-05"
			},
			"category": "Weed",
			"type": [ "Grass", "Poison" ],
			"evolves-into": [ "44" ],
			"base-stamina": 128,
			"base-attack": 131,
			"base-defense": 112,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_FAI_MOONBLAST"
			],
			"height-avg": 0.5,
			"weight-avg": 5.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.675,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"44": {
			"dex-index": "44",
			"name": "Gloom",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-10-03",
				"shadow": "2019-09-05"
			},
			"category": "Weed",
			"type": [ "Grass", "Poison" ],
			"evolves-from": "43",
			"evolves-into": [ "45", "182" ],
			"base-stamina": 155,
			"base-attack": 153,
			"base-defense": 136,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_FAI_MOONBLAST"
			],
			"height-avg": 0.8,
			"weight-avg": 8.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1,
				"wt-std-dev": 1.075,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.24 ]
			}
		},
		"45": {
			"dex-index": "45",
			"name": "Vileplume",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-10-03",
				"shadow": "2019-09-05"
			},
			"category": "Flower",
			"type": [ "Grass", "Poison" ],
			"evolves-from": "44",
			"base-stamina": 181,
			"base-attack": 202,
			"base-defense": 167,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_FAI_MOONBLAST",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 1.2,
			"weight-avg": 18.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.325,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"46": {
			"dex-index": "46",
			"name": "Paras",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2021-02-20"
			},
			"category": "Mushroom",
			"type": [ "Bug", "Grass" ],
			"evolves-into": [ "47" ],
			"base-stamina": 111,
			"base-attack": 121,
			"base-defense": 99,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_POI_CROSSPOISON",
				"CHRG_BUG_XSCISSOR",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.3,
			"weight-avg": 5.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.675,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"47": {
			"dex-index": "47",
			"name": "Parasect",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2021-02-20"
			},
			"category": "Mushroom",
			"type": [ "Bug", "Grass" ],
			"evolves-from": "46",
			"base-stamina": 155,
			"base-attack": 165,
			"base-defense": 146,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_BUG_FURYCUTTER"
			],
			"special-fast-moves": [
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_POI_CROSSPOISON",
				"CHRG_BUG_XSCISSOR",
				"CHRG_GRA_SOLARBEAM"
			],
			"height-avg": 1,
			"weight-avg": 29.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.6875,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"48": {
			"dex-index": "48",
			"name": "Venonat",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-05-01",
				"shadow": "2019-09-05",
				"shiny-shadow": "2021-05-18"
			},
			"category": "Insect",
			"type": [ "Bug", "Poison" ],
			"evolves-into": [ "49" ],
			"base-stamina": 155,
			"base-attack": 100,
			"base-defense": 100,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_POI_POISONFANG",
				"CHRG_PSY_PSYBEAM",
				"CHRG_BUG_SIGNALBEAM"
			],
			"height-avg": 1,
			"weight-avg": 30,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.75,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"49": {
			"dex-index": "49",
			"name": "Venomoth",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-05-01",
				"shadow": "2019-09-05",
				"shiny-shadow": "2021-05-18"
			},
			"category": "Poison Moth",
			"type": [ "Bug", "Poison" ],
			"evolves-from": "48",
			"base-stamina": 172,
			"base-attack": 179,
			"base-defense": 143,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_INFESTATION",
				"FAST_PSY_CONFUSION"
			],
			"special-fast-moves": [
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_BUG_SILVERWIND",
				"CHRG_PSY_PSYCHIC",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_POI_POISONFANG"
			],
			"height-avg": 1.5,
			"weight-avg": 12.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 1.5625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"50": {
			"dex-index": "50",
			"name": "Diglett",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-04-29",
				"shadow": "2020-10-12"
			},
			"category": "Mole",
			"type": [ "Ground" ],
			"evolves-into": [ "51" ],
			"base-stamina": 67,
			"base-attack": 109,
			"base-defense": 78,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_NOR_SCRATCH",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_GRO_MUDBOMB",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.2,
			"weight-avg": 0.8,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.1,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.4 ]
			}
		},
		"50-A": {
			"dex-index": "50-A",
			"name": "Alolan Diglett",
			"form-data": {
				"base": "50",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-07-14",
				"shiny": "2019-06-28",
				"shadow": "2022-11-14"
			},
			"type": [ "Ground", "Steel" ],
			"evolves-into": [ "51-A" ],
			"base-stamina": 67,
			"base-attack": 108,
			"base-defense": 81,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_STE_METALCLAW",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_GRO_MUDBOMB",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.2,
			"weight-avg": 1,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.125,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.4 ]
			}
		},
		"51": {
			"dex-index": "51",
			"name": "Dugtrio",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-04-29",
				"shadow": "2020-10-12"
			},
			"category": "Mole",
			"type": [ "Ground" ],
			"evolves-from": "50",
			"base-stamina": 111,
			"base-attack": 167,
			"base-defense": 134,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_GRO_MUDSLAP",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_GRO_MUDBOMB",
				"CHRG_ROC_STONEEDGE"
			],
			"height-avg": 0.7,
			"weight-avg": 33.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 4.1625,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"51-A": {
			"dex-index": "51-A",
			"name": "Alolan Dugtrio",
			"form-data": {
				"base": "51",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-07-14",
				"shiny": "2019-06-28",
				"shadow": "2022-11-14"
			},
			"type": [ "Ground", "Steel" ],
			"evolves-from": "50-A",
			"base-stamina": 111,
			"base-attack": 201,
			"base-defense": 142,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_GRO_MUDSLAP",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_GRO_MUDBOMB",
				"CHRG_STE_IRONHEAD"
			],
			"height-avg": 0.7,
			"weight-avg": 66.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 8.325,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"52": {
			"dex-index": "52",
			"name": "Meowth",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-11-07",
				"shadow": "2019-11-05",
				"shiny-shadow": "2019-11-07"
			},
			"category": "Scratch Cat",
			"type": [ "Normal" ],
			"evolves-into": [ "53" ],
			"base-stamina": 120,
			"base-attack": 92,
			"base-defense": 78,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_DAR_FOULPLAY",
				"CHRG_DAR_NIGHTSLASH"
			],
			"special-charged-moves": [
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.4,
			"weight-avg": 4.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.525,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"52-A": {
			"dex-index": "52-A",
			"name": "Alolan Meowth",
			"form-data": {
				"base": "52",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28"
			},
			"type": [ "Dark" ],
			"evolves-into": [ "53-A" ],
			"base-stamina": 120,
			"base-attack": 99,
			"base-defense": 78,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_DAR_DARKPULSE",
				"CHRG_DAR_FOULPLAY",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.7,
			"weight-avg": 66.6,
		},
		"52-Ga": {
			"dex-index": "52-Ga",
			"name": "Galarian Meowth",
			"form-data": {
				"base": "52",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-06-03",
				"shiny": "2021-08-20"
			},
			"type": [ "Steel" ],
			"evolves-into": [ "863" ],
			"base-stamina": 137,
			"base-attack": 115,
			"base-defense": 92,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_STE_GYROBALL",
				"CHRG_GRO_DIG",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.4,
			"weight-avg": 7.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.9375,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"52-Gi": {
			"dex-index": "52-Gi",
			"form-data": {
				"base": "52",
				"type": "Giga"
			},
			"availability": {
			}
		},
		"53": {
			"dex-index": "53",
			"name": "Persian",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-11-07",
				"shadow": "2019-11-05",
				"shiny-shadow": "2019-11-07"
			},
			"category": "Classy Cat",
			"type": [ "Normal" ],
			"evolves-from": "52",
			"base-stamina": 163,
			"base-attack": 150,
			"base-defense": 136,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_DAR_FOULPLAY",
				"CHRG_ROC_POWERGEM",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_PAYBACK"
			],
			"special-charged-moves": [
				"CHRG_DAR_NIGHTSLASH"
			],
			"height-avg": 1,
			"weight-avg": 32,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"53-A": {
			"dex-index": "53-A",
			"name": "Alolan Persian",
			"form-data": {
				"base": "53",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28"
			},
			"type": [ "Dark" ],
			"evolves-from": "52-A",
			"base-stamina": 163,
			"base-attack": 158,
			"base-defense": 136,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_DAR_FOULPLAY",
				"CHRG_DAR_DARKPULSE",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_PAYBACK",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.1,
			"weight-avg": 33,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 4.125,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"54": {
			"dex-index": "54",
			"name": "Psyduck",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-01-26",
				"shadow": "2019-09-05"
			},
			"category": "Duck",
			"type": [ "Water" ],
			"evolves-into": [ "55" ],
			"base-stamina": 137,
			"base-attack": 122,
			"base-defense": 95,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_WAT_AQUATAIL",
				"CHRG_FIG_CROSSCHOP"
			],
			"height-avg": 0.8,
			"weight-avg": 19.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.45,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"55": {
			"dex-index": "55",
			"name": "Golduck",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-01-26",
				"shadow": "2019-09-05"
			},
			"category": "Duck",
			"type": [ "Water" ],
			"evolves-from": "54",
			"base-stamina": 190,
			"base-attack": 191,
			"base-defense": 162,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_PSY_SYNCHRONOISE",
				"CHRG_FIG_CROSSCHOP",
				"CHRG_WAT_LIQUIDATION"
			],
			"height-avg": 1.7,
			"weight-avg": 76.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 9.575,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"56": {
			"dex-index": "56",
			"name": "Mankey",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-03-05",
				"shadow": "2024-10-08"
			},
			"category": "Pig Monkey",
			"type": [ "Fighting" ],
			"evolves-into": [ "57" ],
			"base-stamina": 120,
			"base-attack": 148,
			"base-defense": 82,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_KARATECHOP",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_FIG_CROSSCHOP",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 0.5,
			"weight-avg": 28,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 3.5,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"57": {
			"dex-index": "57",
			"name": "Primeape",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-03-05",
				"shadow": "2024-10-08"
			},
			"category": "Pig Monkey",
			"type": [ "Fighting" ],
			"evolves-from": "56",
			"evolves-into": [ "979" ],
			"base-stamina": 163,
			"base-attack": 207,
			"base-defense": 138,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_FIG_COUNTER"
			],
			"special-fast-moves": [
				"FAST_FIG_KARATECHOP"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_ICE_ICEPUNCH"
			],
			"special-charged-moves": [
				"CHRG_FIG_CROSSCHOP",
				"CHRG_GHO_RAGEFIST"
			],
			"height-avg": 1,
			"weight-avg": 32,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"58": {
			"dex-index": "58",
			"name": "Growlithe",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-09-01",
				"shadow": "2019-09-05",
				"shiny-shadow": "2020-10-12"
			},
			"category": "Puppy",
			"type": [ "Fire" ],
			"evolves-into": [ "59" ],
			"base-stamina": 146,
			"base-attack": 136,
			"base-defense": 93,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMEWHEEL",
				"CHRG_NOR_BODYSLAM",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.7,
			"weight-avg": 19,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.375,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"58-H": {
			"dex-index": "58-H",
			"form-data": {
				"base": "58",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2022-07-27",
				"shiny": "2023-09-27"
			},
			"category": "Scout",
			"type": [ "Fire", "Rock" ],
			"evolves-into": [ "59-H" ],
			"base-stamina": 155,
			"base-attack": 142,
			"base-defense": 92,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.8,
			"weight-avg": 22.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.8375,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"59": {
			"dex-index": "59",
			"name": "Arcanine",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-09-01",
				"shadow": "2019-09-05",
				"shiny-shadow": "2020-10-12"
			},
			"category": "Legendary",
			"type": [ "Fire" ],
			"evolves-from": "58",
			"base-stamina": 207,
			"base-attack": 227,
			"base-defense": 166,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_FIREFANG",
				"FAST_DAR_SNARL",
				"FAST_ELE_THUNDERFANG"
			],
			"special-fast-moves": [
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_PSY_PSYCHICFANGS",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"special-charged-moves": [
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 1.9,
			"weight-avg": 155,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 19.375,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 3.325 ]
			}
		},
		"59-H": {
			"dex-index": "59-H",
			"form-data": {
				"base": "59",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2022-07-27",
				"shiny": "2023-09-27"
			},
			"type": [ "Fire", "Rock" ],
			"evolves-from": "58-H",
			"base-stamina": 216,
			"base-attack": 232,
			"base-defense": 165,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_FIREFANG",
				"FAST_DAR_SNARL",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 2,
			"weight-avg": 168,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.25,
				"wt-std-dev": 21,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.5 ]
			}
		},
		"60": {
			"dex-index": "60",
			"name": "Poliwag",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-08-06",
				"shadow": "2019-08-01",
				"shiny-shadow": "2022-01-24"
			},
			"category": "Tadpole",
			"type": [ "Water" ],
			"evolves-into": [ "61" ],
			"base-stamina": 120,
			"base-attack": 101,
			"base-defense": 82,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_GRO_MUDBOMB",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.6,
			"weight-avg": 12.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.55,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"61": {
			"dex-index": "61",
			"name": "Poliwhirl",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-08-06",
				"shadow": "2019-08-01",
				"shiny-shadow": "2022-01-24"
			},
			"category": "Tadpole",
			"type": [ "Water" ],
			"evolves-from": "60",
			"evolves-into": [ "62", "186" ],
			"base-stamina": 163,
			"base-attack": 130,
			"base-defense": 123,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_GRO_MUDBOMB",
				"CHRG_WAT_BUBBLEBEAM"
			],
			"special-charged-moves": [
				"CHRG_WAT_SCALD"
			],
			"height-avg": 1,
			"weight-avg": 20,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 2.5,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"62": {
			"dex-index": "62",
			"name": "Poliwrath",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-08-06",
				"shadow": "2019-08-01",
				"shiny-shadow": "2022-01-24"
			},
			"category": "Tadpole",
			"type": [ "Water", "Fighting" ],
			"evolves-from": "61",
			"base-stamina": 207,
			"base-attack": 182,
			"base-defense": 184,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_FIG_ROCKSMASH",
				"FAST_GRO_MUDSHOT"
			],
			"special-fast-moves": [
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_FIG_POWERUPPUNCH",
				"CHRG_WAT_SCALD",
				"CHRG_ICE_ICYWIND"
			],
			"special-charged-moves": [
				"CHRG_FIG_SUBMISSION"
			],
			"height-avg": 1.3,
			"weight-avg": 54,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 6.75,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"63": {
			"dex-index": "63",
			"name": "Abra",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-04-25",
				"shadow": "2019-09-05"
			},
			"category": "Psi",
			"type": [ "Psychic" ],
			"evolves-into": [ "64" ],
			"base-stamina": 93,
			"base-attack": 195,
			"base-defense": 82,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 0.9,
			"weight-avg": 19.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 2.4375,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"64": {
			"dex-index": "64",
			"name": "Kadabra",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-04-25",
				"shadow": "2019-09-05"
			},
			"category": "Psi",
			"type": [ "Psychic" ],
			"evolves-from": "63",
			"evolves-into": [ "65" ],
			"base-stamina": 120,
			"base-attack": 232,
			"base-defense": 117,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_PSYCHOCUT",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 1.3,
			"weight-avg": 56.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 7.0625,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"65": {
			"dex-index": "65",
			"name": "Alakazam",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-04-25",
				"shadow": "2019-09-05"
			},
			"category": "Psi",
			"type": [ "Psychic" ],
			"evolves-from": "64",
			"base-stamina": 146,
			"base-attack": 271,
			"base-defense": 167,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_PSYCHOCUT",
				"FAST_PSY_CONFUSION"
			],
			"special-charged-moves": [
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FIR_FIREPUNCH"
			],
			"special-charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.5,
			"weight-avg": 48,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 6,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"65-M": {
			"dex-index": "65-M",
			"name": "Mega Alakazam",
			"form-data": {
				"base": "65",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-09-06",
				"shiny": "2022-09-06"
			},
			"height-avg": 1.2,
			"weight-avg": 48,
			"base-stamina": 146,
			"base-attack": 367,
			"base-defense": 207,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 6,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"66": {
			"dex-index": "66",
			"name": "Machop",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-03-05",
				"shadow": "2020-06-10",
				"shiny-shadow": "2022-11-14",
				"dynamax": "2024-12-03"
			},
			"category": "Superpower",
			"type": [ "Fighting" ],
			"evolves-into": [ "67" ],
			"base-stamina": 172,
			"base-attack": 137,
			"base-defense": 82,
			"dynamax-class": 2,
			"max-battle-tier": 2,
			"fast-moves": [
				"FAST_FIG_KARATECHOP",
				"FAST_FIG_ROCKSMASH"
			],
			"special-fast-moves": [
				"FAST_FIG_LOWKICK",
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_CROSSCHOP",
				"CHRG_FIG_LOWSWEEP"
			],
			"height-avg": 0.8,
			"weight-avg": 19.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.4375,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"67": {
			"dex-index": "67",
			"name": "Machoke",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-03-05",
				"shadow": "2020-06-10",
				"shiny-shadow": "2022-11-14",
				"dynamax": "2024-12-03"
			},
			"category": "Superpower",
			"type": [ "Fighting" ],
			"evolves-from": "66",
			"evolves-into": [ "68" ],
			"base-stamina": 190,
			"base-attack": 177,
			"base-defense": 125,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_KARATECHOP",
				"FAST_FIG_LOWKICK",
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_FIG_SUBMISSION"
			],
			"special-charged-moves": [
				"CHRG_FIG_CROSSCHOP"
			],
			"height-avg": 1.5,
			"weight-avg": 70.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 8.8125,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"68": {
			"dex-index": "68",
			"name": "Machamp",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-03-05",
				"shadow": "2020-06-10",
				"shiny-shadow": "2022-11-14",
				"dynamax": "2024-12-03"
			},
			"category": "Superpower",
			"type": [ "Fighting" ],
			"evolves-from": "67",
			"base-stamina": 207,
			"base-attack": 234,
			"base-defense": 159,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_STE_BULLETPUNCH"
			],
			"special-fast-moves": [
				"FAST_FIG_KARATECHOP"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_CROSSCHOP",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_STE_HEAVYSLAM"
			],
			"special-charged-moves": [
				"CHRG_FIG_SUBMISSION",
				"CHRG_ROC_STONEEDGE",
				"CHRG_DAR_PAYBACK"
			],
			"height-avg": 1.6,
			"weight-avg": 130,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 16.25,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"68-G": {
			"dex-index": "68-G",
			"form-data": {
				"base": "68",
				"type": "Giga"
			},
			"availability": {
			}
		},
		"69": {
			"dex-index": "69",
			"name": "Bellsprout",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-07-17",
				"shadow": "2019-11-07",
				"shiny-shadow": "2023-10-26"
			},
			"category": "Flower",
			"type": [ "Grass", "Poison" ],
			"evolves-into": [ "70" ],
			"base-stamina": 137,
			"base-attack": 139,
			"base-defense": 61,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_GRA_POWERWHIP",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_NOR_WRAP"
			],
			"height-avg": 0.7,
			"weight-avg": 4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 0.5,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"70": {
			"dex-index": "70",
			"name": "Weepinbell",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-07-17",
				"shadow": "2019-11-07",
				"shiny-shadow": "2023-10-26"
			},
			"category": "Flycatcher",
			"type": [ "Grass", "Poison" ],
			"evolves-from": "69",
			"evolves-into": [ "71" ],
			"base-stamina": 163,
			"base-attack": 172,
			"base-defense": 92,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_BULLETSEED",
				"FAST_POI_ACID"
			],
			"special-fast-moves": [
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_POWERWHIP",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 1,
			"weight-avg": 6.4,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 0.8,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"71": {
			"dex-index": "71",
			"name": "Victreebel",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-07-17",
				"shadow": "2019-11-07",
				"shiny-shadow": "2023-10-26"
			},
			"category": "Flycatcher",
			"type": [ "Grass", "Poison" ],
			"evolves-from": "70",
			"base-stamina": 190,
			"base-attack": 207,
			"base-defense": 135,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_POI_ACID"
			],
			"special-fast-moves": [
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRA_LEAFTORNADO",
				"CHRG_POI_ACIDSPRAY"
			],
			"height-avg": 1.7,
			"weight-avg": 15.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 1.9375,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 3.4 ]
			}
		},
		"72": {
			"dex-index": "72",
			"name": "Tentacool",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-11-19",
				"shadow": "2024-01-27",
				"shiny-shadow": "2024-01-27"
			},
			"category": "Jellyfish",
			"type": [ "Water", "Poison" ],
			"evolves-into": [ "73" ],
			"base-stamina": 120,
			"base-attack": 97,
			"base-defense": 149,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_POI_POISONSTING"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_WAT_WATERPULSE",
				"CHRG_NOR_WRAP"
			],
			"height-avg": 0.9,
			"weight-avg": 45.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 5.6875,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"73": {
			"dex-index": "73",
			"name": "Tentacruel",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-11-19",
				"shadow": "2024-01-27",
				"shiny-shadow": "2024-01-27"
			},
			"category": "Jellyfish",
			"type": [ "Water", "Poison" ],
			"evolves-from": "72",
			"base-stamina": 190,
			"base-attack": 166,
			"base-defense": 209,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_ACID",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_ICE_BLIZZARD",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 1.6,
			"weight-avg": 55,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2,
				"wt-std-dev": 6.875,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 3.2 ]
			}
		},
		"74": {
			"dex-index": "74",
			"name": "Geodude",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-09-13",
				"shadow": "2022-07-09",
				"shiny-shadow": "2023-06-21"
			},
			"category": "Rock",
			"type": [ "Rock", "Ground" ],
			"evolves-into": [ "75" ],
			"base-stamina": 120,
			"base-attack": 132,
			"base-defense": 132,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_GRO_DIG"
			],
			"height-avg": 0.4,
			"weight-avg": 20,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 2.5,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"74-A": {
			"dex-index": "74-A",
			"name": "Alolan Geodude",
			"form-data": {
				"base": "74",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-07-14",
				"shiny": "2019-06-28",
				"shadow": "2023-06-21"
			},
			"type": [ "Rock", "Electric" ],
			"evolves-into": [ "75-A" ],
			"base-stamina": 120,
			"base-attack": 132,
			"base-defense": 132,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.4,
			"weight-avg": 20.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 2.5375,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"75": {
			"dex-index": "75",
			"name": "Graveler",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-09-13",
				"shadow": "2022-07-09",
				"shiny-shadow": "2023-06-21"
			},
			"category": "Rock",
			"type": [ "Rock", "Ground" ],
			"evolves-from": "74",
			"evolves-into": [ "76" ],
			"base-stamina": 146,
			"base-attack": 164,
			"base-defense": 164,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_GRO_MUDSLAP",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_ROC_STONEEDGE",
				"CHRG_ROC_ROCKBLAST"
			],
			"special-charged-moves": [
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 1,
			"weight-avg": 105,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 13.125,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"75-A": {
			"dex-index": "75-A",
			"name": "Alolan Graveler",
			"form-data": {
				"base": "75",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-07-14",
				"shiny": "2019-06-28",
				"shadow": "2023-06-21"
			},
			"type": [ "Rock", "Electric" ],
			"evolves-from": "74-A",
			"evolves-into": [ "76-A" ],
			"base-stamina": 146,
			"base-attack": 164,
			"base-defense": 164,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ROC_STONEEDGE",
				"CHRG_ROC_ROCKBLAST"
			],
			"height-avg": 1,
			"weight-avg": 110,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 13.75,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"76": {
			"dex-index": "76",
			"name": "Golem",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-09-13",
				"shadow": "2022-07-09",
				"shiny-shadow": "2023-06-21"
			},
			"category": "Megaton",
			"type": [ "Rock", "Ground" ],
			"evolves-from": "75",
			"base-stamina": 190,
			"base-attack": 211,
			"base-defense": 198,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_GRO_MUDSLAP",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_ROC_ROCKBLAST",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 1.4,
			"weight-avg": 300,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 37.5,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"76-A": {
			"dex-index": "76-A",
			"name": "Alolan Golem",
			"form-data": {
				"base": "76",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-07-14",
				"shiny": "2019-06-28",
				"shadow": "2023-06-21"
			},
			"type": [ "Rock", "Electric" ],
			"evolves-from": "75-A",
			"base-stamina": 190,
			"base-attack": 211,
			"base-defense": 198,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_ELE_VOLTSWITCH"
			],
			"special-charged-moves": [
				"FAST_ROC_ROLLOUT"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ELE_WILDCHARGE"
			],
			"height-avg": 1.7,
			"weight-avg": 316,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 39.5,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"77": {
			"dex-index": "77",
			"name": "Ponyta",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-05"
			},
			"category": "Fire Horse",
			"type": [ "Fire" ],
			"evolves-into": [ "78" ],
			"base-stamina": 137,
			"base-attack": 170,
			"base-defense": 127,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMEWHEEL",
				"CHRG_NOR_STOMP"
			],
			"special-charged-moves": [
				"CHRG_FIR_FIREBLAST"
			],
			"height-avg": 1,
			"weight-avg": 30,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.75,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"77-G": {
			"dex-index": "77-G",
			"name": "Galarian Ponyta",
			"form-data": {
				"base": "77",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-10-23",
				"shiny": "2021-05-11"
			},
			"category": "Unique Horn",
			"type": [ "Psychic" ],
			"evolves-into": [ "78-G" ],
			"base-stamina": 137,
			"base-attack": 170,
			"base-defense": 127,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_PSY_PSYCHOCUT"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_PSY_PSYBEAM",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 0.8,
			"weight-avg": 24,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"78": {
			"dex-index": "78",
			"name": "Rapidash",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-05"
			},
			"category": "Fire Horse",
			"type": [ "Fire" ],
			"evolves-from": "77",
			"base-stamina": 163,
			"base-attack": 207,
			"base-defense": 162,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_FIR_FIRESPIN",
				"FAST_FIR_INCINERATE"
			],
			"special-fast-moves": [
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_GRO_DRILLRUN",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"special-charged-moves": [
				"CHRG_ELE_WILDCHARGE"
			],
			"height-avg": 1.7,
			"weight-avg": 95,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 11.875,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"78-G": {
			"dex-index": "78-G",
			"name": "Galarian Rapidash",
			"form-data": {
				"base": "78",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-10-23",
				"shiny": "2021-05-11"
			},
			"category": "Unique Horn",
			"type": [ "Psychic", "Fairy" ],
			"evolves-from": "77-G",
			"base-stamina": 163,
			"base-attack": 207,
			"base-defense": 162,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_PSY_PSYCHOCUT",
				"FAST_FAI_FAIRYWIND"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_PSY_PSYCHIC",
				"CHRG_NOR_BODYSLAM",
				"CHRG_BUG_MEGAHORN",
				"CHRG_GRO_HIGHHORSEPOWER"
			],
			"special-charged-moves": [
				"CHRG_ELE_WILDCHARGE"
			],
			"height-avg": 1.7,
			"weight-avg": 80,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 10,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"79": {
			"dex-index": "79",
			"name": "Slowpoke",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-11-17",
				"shadow": "2020-10-12"
			},
			"category": "Dopey",
			"type": [ "Water", "Psychic" ],
			"evolves-into": [ "80", "199" ],
			"base-stamina": 207,
			"base-attack": 109,
			"base-defense": 98,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.2,
			"weight-avg": 36,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 4.5,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"79-G": {
			"dex-index": "79-G",
			"name": "Galarian Slowpoke",
			"form-data": {
				"base": "79",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2021-06-08",
				"shiny": "2023-03-18"
			},
			"type": [ "Psychic" ],
			"evolves-into": [ "80-G", "199-G" ],
			"base-stamina": 207,
			"base-attack": 109,
			"base-defense": 98,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.2,
			"weight-avg": 36,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 4.5,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"80": {
			"dex-index": "80",
			"name": "Slowbro",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-11-17",
				"shadow": "2020-10-12"
			},
			"category": "Hermit Crab",
			"type": [ "Water", "Psychic" ],
			"evolves-from": "79",
			"base-stamina": 216,
			"base-attack": 177,
			"base-defense": 180,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_PSY_PSYCHIC",
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_SCALD"
			],
			"special-charged-moves": [
				"CHRG_WAT_SURF"
			],
			"height-avg": 1.6,
			"weight-avg": 78.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 9.8125,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"80-M": {
			"dex-index": "80-M",
			"name": "Mega Slowbro",
			"form-data": {
				"base": "65",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2021-06-08",
				"shiny": "2021-06-08"
			},
			"height-avg": 2,
			"weight-avg": 120,
			"base-stamina": 216,
			"base-attack": 224,
			"base-defense": 259,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 9.8125,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"80-G": {
			"dex-index": "80-G",
			"name": "Galarian Slowbro",
			"form-data": {
				"base": "80",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2021-06-08",
				"shiny": "2023-03-18"
			},
			"type": [ "Poison", "Psychic" ],
			"evolves-from": "79-G",
			"base-stamina": 216,
			"base-attack": 182,
			"base-defense": 156,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_PSY_PSYCHIC",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_WAT_SCALD",
				"CHRG_DAR_BRUTALSWING"
			],
			"special-charged-moves": [
				"CHRG_WAT_SURF"
			],
			"height-avg": 1.6,
			"weight-avg": 70.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 8.8125,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"81": {
			"dex-index": "81",
			"name": "Magnemite",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-16",
				"shadow": "2019-11-07",
				"shiny-shadow": "2023-02-01"
			},
			"category": "Magnet",
			"type": [ "Electric", "Steel" ],
			"evolves-into": [ "82" ],
			"base-stamina": 93,
			"base-attack": 165,
			"base-defense": 121,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_ELE_THUNDERSHOCK",
				"FAST_ELE_VOLTSWITCH",
				"FAST_STE_METALSOUND"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_STE_MAGNETBOMB",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.3,
			"weight-avg": 6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.75,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.6 ]
			}
		},
		"82": {
			"dex-index": "82",
			"name": "Magneton",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-16",
				"shadow": "2019-11-07",
				"shiny-shadow": "2023-02-01"
			},
			"category": "Magnet",
			"type": [ "Electric", "Steel" ],
			"evolves-from": "81",
			"evolves-into": [ "462" ],
			"base-stamina": 137,
			"base-attack": 223,
			"base-defense": 169,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_ELE_CHARGEBEAM",
				"FAST_ELE_THUNDERSHOCK",
				"FAST_ELE_VOLTSWITCH",
				"FAST_STE_METALSOUND"
			],
			"charged-moves": [
				"CHRG_ELE_ZAPCANNON",
				"CHRG_STE_MAGNETBOMB",
				"CHRG_STE_FLASHCANNON",
				"CHRG_ELE_DISCHARGE"
			],
			"height-avg": 1,
			"weight-avg": 60,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 7.5,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"83": {
			"dex-index": "83",
			"name": "Farfetch'd",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-09-09"
			},
			"category": "Wild Duck",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "865" ],
			"base-stamina": 141,
			"base-attack": 124,
			"base-defense": 115,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_BUG_FURYCUTTER"
			],
			"special-fast-moves": [
				"FAST_NOR_CUT"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_AIRCUTTER",
				"CHRG_GRA_LEAFBLADE"
			],
			"height-avg": 0.8,
			"weight-avg": 15,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 1.875,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"83-G": {
			"dex-index": "83-G",
			"name": "Galarian Farfetch'd",
			"availability": {
				"in-game": "2020-06-17",
				"shiny": "2021-08-20"
			},
			"form-data": {
				"base": "83",
				"type": "Regional",
				"region": "Galarian"
			},
			"type": [ "Fighting" ],
			"base-stamina": 141,
			"base-attack": 174,
			"base-defense": 114,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_GRA_LEAFBLADE"
			],
			"height-avg": 0.8,
			"weight-avg": 42,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 5.25,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"84": {
			"dex-index": "84",
			"name": "Doduo",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-09-22"
			},
			"category": "Twin Bird",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "85" ],
			"base-stamina": 111,
			"base-attack": 158,
			"base-defense": 83,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_FLY_DRILLPECK",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_BRAVEBIRD"
			],
			"special-charged-moves": [
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 1.4,
			"weight-avg": 39.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 4.9,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"85": {
			"dex-index": "85",
			"name": "Dodrio",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-09-22"
			},
			"category": "Triple Bird",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "84",
			"base-stamina": 155,
			"base-attack": 218,
			"base-defense": 140,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_FLY_DRILLPECK",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_BRAVEBIRD"
			],
			"special-charged-moves": [
				"CHRG_FLY_AIRCUTTER"
			],
			"height-avg": 1.8,
			"weight-avg": 85.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 10.65,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"86": {
			"dex-index": "86",
			"name": "Seel",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-05-01"
			},
			"category": "Sea Lion",
			"type": [ "Water" ],
			"evolves-into": [ "87" ],
			"base-stamina": 163,
			"base-attack": 85,
			"base-defense": 121,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_ICESHARD",
				"FAST_GHO_LICK"
			],
			"special-fast-moves": [
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_ICE_AURORABEAM",
				"CHRG_ICE_ICYWIND",
				"CHRG_WAT_AQUATAIL"
			],
			"special-charged-moves": [
				"CHRG_WAT_AQUAJET"
			],
			"height-avg": 1.1,
			"weight-avg": 90,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 11.25,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"87": {
			"dex-index": "87",
			"name": "Dewgong",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-05-01"
			},
			"category": "Sea Lion",
			"type": [ "Water", "Ice" ],
			"evolves-from": "86",
			"base-stamina": 207,
			"base-attack": 139,
			"base-defense": 177,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_FROSTBREATH",
				"FAST_STE_IRONTAIL"
			],
			"special-fast-moves": [
				"FAST_ICE_ICESHARD"
			],
			"charged-moves": [
				"CHRG_ICE_AURORABEAM",
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_BLIZZARD",
				"CHRG_GRO_DRILLRUN",
				"CHRG_WAT_LIQUIDATION"
			],
			"special-charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 1.7,
			"weight-avg": 120,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 15,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"88": {
			"dex-index": "88",
			"name": "Grimer",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-09-13",
				"shadow": "2019-08-01",
				"shiny-shadow": "2020-07-10"
			},
			"category": "Sludge",
			"type": [ "Poison" ],
			"evolves-into": [ "89" ],
			"base-stamina": 190,
			"base-attack": 135,
			"base-defense": 90,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_GRO_MUDSLAP"
			],
			"unobtainable-fast-moves": [
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGE",
				"CHRG_GRO_MUDBOMB",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.9,
			"weight-avg": 30,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 3.75,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"88-A": {
			"dex-index": "88-A",
			"name": "Alolan Grimer",
			"form-data": {
				"base": "88",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28",
				"shadow": "2023-03-25"
			},
			"type": [ "Poison", "Dark" ],
			"evolves-into": [ "89-A" ],
			"base-stamina": 190,
			"base-attack": 135,
			"base-defense": 90,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_POI_GUNKSHOT",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.7,
			"weight-avg": 42,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 5.25,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.4 ]
			}
		},
		"89": {
			"dex-index": "89",
			"name": "Muk",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-09-13",
				"shadow": "2019-08-01",
				"shiny-shadow": "2020-07-10"
			},
			"category": "Sludge",
			"type": [ "Poison" ],
			"evolves-from": "88",
			"base-stamina": 233,
			"base-attack": 190,
			"base-defense": 172,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_INFESTATION",
				"FAST_POI_POISONJAB"
			],
			"special-fast-moves": [
				"FAST_GHO_LICK"
			],
			"unobtainable-fast-moves": [
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_POI_GUNKSHOT",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_POI_ACIDSPRAY"
			],
			"height-avg": 1.2,
			"weight-avg": 30,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 3.75,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"89-A": {
			"dex-index": "89-A",
			"name": "Alolan Muk",
			"form-data": {
				"base": "89",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-06-28",
				"shadow": "2023-03-25"
			},
			"type": [ "Poison", "Dark" ],
			"evolves-from": "88-A",
			"base-stamina": 233,
			"base-attack": 190,
			"base-defense": 172,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_POI_POISONJAB",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_POI_GUNKSHOT",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_POI_ACIDSPRAY"
			],
			"height-avg": 1,
			"weight-avg": 52,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 6.5,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"90": {
			"dex-index": "90",
			"name": "Shellder",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-06-07",
				"shadow": "2020-10-12"
			},
			"category": "Bivalve",
			"type": [ "Water" ],
			"evolves-into": [ "91" ],
			"base-stamina": 102,
			"base-attack": 116,
			"base-defense": 134,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_ICESHARD",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_ICYWIND",
				"CHRG_WAT_RAZORSHELL"
			],
			"height-avg": 0.3,
			"weight-avg": 4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.5,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"91": {
			"dex-index": "91",
			"name": "Cloyster",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-06-07",
				"shadow": "2020-10-12"
			},
			"category": "Bivalve",
			"type": [ "Water", "Ice" ],
			"evolves-from": "90",
			"base-stamina": 137,
			"base-attack": 186,
			"base-defense": 256,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_FROSTBREATH",
				"FAST_ICE_ICESHARD"
			],
			"charged-moves": [
				"CHRG_ICE_AURORABEAM",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_AVALANCHE",
				"CHRG_ICE_ICYWIND",
				"CHRG_WAT_LIQUIDATION",
				"CHRG_WAT_RAZORSHELL"
			],
			"special-charged-moves": [
				"CHRG_ICE_BLIZZARD"
			],
			"height-avg": 1.5,
			"weight-avg": 132.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 16.5625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"92": {
			"dex-index": "92",
			"name": "Gastly",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-03",
				"shadow": "2023-10-26",
				"dynamax": "2024-10-22"
			},
			"category": "Gas",
			"type": [ "Ghost", "Poison" ],
			"evolves-into": [ "93" ],
			"base-stamina": 102,
			"base-attack": 186,
			"base-defense": 67,
			"dynamax-class": 2,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_GHO_ASTONISH"
			],
			"special-fast-moves": [
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_DAR_DARKPULSE",
				"CHRG_GHO_NIGHTSHADE"
			],
			"special-charged-moves": [
				"CHRG_GHO_OMINOUSWIND"
			],
			"height-avg": 1.3,
			"weight-avg": 0.1,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 0.0125,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"93": {
			"dex-index": "93",
			"name": "Haunter",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-03",
				"shadow": "2023-10-26",
				"dynamax": "2024-10-22"
			},
			"category": "Gas",
			"type": [ "Ghost", "Poison" ],
			"evolves-from": "92",
			"evolves-into": [ "94" ],
			"base-stamina": 128,
			"base-attack": 223,
			"base-defense": 107,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_SHADOWCLAW",
				"FAST_GHO_ASTONISH"
			],
			"special-fast-moves": [
				"FAST_GHO_LICK"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GHO_SHADOWPUNCH",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_DAR_DARKPULSE"
			],
			"height-avg": 1.6,
			"weight-avg": 0.1,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2,
				"wt-std-dev": 0.0125,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 3.2 ]
			}
		},
		"94": {
			"dex-index": "94",
			"name": "Gengar",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-03",
				"shadow": "2023-10-26",
				"dynamax": "2024-10-22"
			},
			"category": "Shadow",
			"type": [ "Ghost", "Poison" ],
			"evolves-from": "93",
			"base-stamina": 155,
			"base-attack": 261,
			"base-defense": 149,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_GHO_SHADOWCLAW",
				"FAST_DAR_SUCKERPUNCH"
			],
			"special-fast-moves": [
				"FAST_GHO_LICK"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_FIG_FOCUSBLAST"
			],
			"special-charged-moves": [
				"CHRG_GHO_SHADOWPUNCH",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_DAR_DARKPULSE",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.5,
			"weight-avg": 40.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.0625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 3 ]
			}
		},
		"94-M": {
			"dex-index": "94-M",
			"name": "Mega Gengar",
			"form-data": {
				"base": "94",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2020-10-24",
				"shiny": "2020-10-24",
				"shadow": false
			},
			"height-avg": 1.4,
			"weight-avg": 40.5,
			"base-stamina": 155,
			"base-attack": 349,
			"base-defense": 199,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.0625,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"94-G": {
			"dex-index": "94-G",
			"form-data": {
				"base": "94",
				"type": "Giga"
			},
			"availability": {
				"in-game": "2024-10-31",
				"shiny": "2024-10-31",
				"shadow": false
			},
			"height-avg": 20
		},
		"95": {
			"dex-index": "95",
			"name": "Onix",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-06-04",
				"shadow": "2022-11-14"
			},
			"category": "Rock Snake",
			"type": [ "Rock", "Ground" ],
			"evolves-into": [ "208" ],
			"base-stamina": 111,
			"base-attack": 85,
			"base-defense": 232,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_GRO_SANDTOMB",
				"CHRG_ROC_STONEEDGE",
				"CHRG_STE_HEAVYSLAM",
				"CHRG_DRA_BREAKINGSWIPE"
			],
			"special-charged-moves": [
				"CHRG_STE_IRONHEAD",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 8.8,
			"weight-avg": 210,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 1.1,
				"wt-std-dev": 26.25,
				"xxs": [ 4.312, 4.4 ],
				"xs": [ 4.4, 6.6 ],
				"m": [ 6.6, 11 ],
				"xl": [ 11, 13.2 ],
				"xxl": [ 13.2, 15.4 ]
			}
		},
		"96": {
			"dex-index": "96",
			"name": "Drowzee",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-10-05",
				"shadow": "2019-08-01",
				"shiny-shadow": "2020-10-12"
			},
			"category": "Hypnosis",
			"type": [ "Psychic" ],
			"evolves-into": [ "97" ],
			"base-stamina": 155,
			"base-attack": 89,
			"base-defense": 136,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1,
			"weight-avg": 32.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.05,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"97": {
			"dex-index": "97",
			"name": "Hypno",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-10-05",
				"shadow": "2019-08-01",
				"shiny-shadow": "2020-10-12"
			},
			"category": "Hypnosis",
			"type": [ "Psychic" ],
			"evolves-from": "96",
			"base-stamina": 198,
			"base-attack": 144,
			"base-defense": 193,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_PSY_PSYCHIC",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_FIR_FIREPUNCH",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_GHO_SHADOWBALL"
			],
			"special-charged-moves": [
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 1.6,
			"weight-avg": 75.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 9.45,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"98": {
			"dex-index": "98",
			"name": "Krabby",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-10-01",
				"dynamax": "2024-12-09"
			},
			"category": "River Crab",
			"type": [ "Water" ],
			"evolves-into": [ "99" ],
			"base-stamina": 102,
			"base-attack": 181,
			"base-defense": 124,
			"dynamax-class": 2,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_WAT_RAZORSHELL",
				"CHRG_WAT_WATERPULSE",
				"CHRG_NOR_VISEGRIP"
			],
			"height-avg": 0.4,
			"weight-avg": 6.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.8125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"99": {
			"dex-index": "99",
			"name": "Kingler",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-10-01",
				"dynamax": "2024-12-09"
			},
			"category": "Pincer",
			"type": [ "Water" ],
			"evolves-from": "98",
			"base-stamina": 146,
			"base-attack": 240,
			"base-defense": 181,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_STE_METALCLAW"
			],
			"special-fast-moves": [
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_WAT_CRABHAMMER",
				"CHRG_WAT_RAZORSHELL",
				"CHRG_WAT_WATERPULSE",
				"CHRG_NOR_VISEGRIP",
				"CHRG_BUG_XSCISSOR"
			],
			"height-avg": 1.3,
			"weight-avg": 60,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 7.5,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"99-G": {
			"dex-index": "99-G",
			"form-data": {
				"base": "99",
				"type": "Giga"
			},
			"availability": {
				"in-game": "2025-02-01",
				"shiny": "2025-02-01"
			}
		},
		"100": {
			"dex-index": "100",
			"name": "Voltorb",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-05-08",
				"shadow": "2022-01-24"
			},
			"category": "Ball",
			"type": [ "Electric" ],
			"evolves-into": [ "101" ],
			"base-stamina": 120,
			"base-attack": 109,
			"base-defense": 111,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_STE_GYROBALL"
			],
			"special-charged-moves": [
				"CHRG_BUG_SIGNALBEAM"
			],
			"height-avg": 0.5,
			"weight-avg": 10.4,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.3,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"100-H": {
			"dex-index": "100-H",
			"form-data": {
				"base": "100",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2022-01-30",
				"shiny": "2024-02-16"
			},
			"category": "Sphere",
			"type": [ "Electric", "Grass" ],
			"evolves-into": [ "101-H" ],
			"base-stamina": 120,
			"base-attack": 109,
			"base-defense": 111,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_CHARGEBEAM",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_NOR_SWIFT",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 0.5,
			"weight-avg": 13,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.625,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"101": {
			"dex-index": "101",
			"name": "Electrode",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-05-08",
				"shadow": "2022-01-24"
			},
			"category": "Ball",
			"type": [ "Electric" ],
			"evolves-from": "100",
			"base-stamina": 155,
			"base-attack": 173,
			"base-defense": 173,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_ELE_VOLTSWITCH"
			],
			"special-fast-moves": [
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_DAR_FOULPLAY"
			],
			"height-avg": 1.2,
			"weight-avg": 66.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 8.325,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"101-H": {
			"dex-index": "101-H",
			"form-data": {
				"base": "101",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2022-02-18",
				"shiny": "2024-02-16"
			},
			"category": "Sphere",
			"type": [ "Electric", "Grass" ],
			"evolves-from": "100-H",
			"base-stamina": 155,
			"base-attack": 176,
			"base-defense": 176,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_NOR_SWIFT",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 1.2,
			"weight-avg": 71,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 8.875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"102": {
			"dex-index": "102",
			"name": "Exeggcute",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-04-09",
				"shadow": "2020-02-03",
				"shiny-shadow": "2022-04-03"
			},
			"category": "Egg",
			"type": [ "Grass", "Psychic" ],
			"evolves-into": [ "103" ],
			"base-stamina": 155,
			"base-attack": 107,
			"base-defense": 125,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_PSY_PSYCHIC",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 0.4,
			"weight-avg": 2.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.3125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"103": {
			"dex-index": "103",
			"name": "Exeggutor",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-04-09",
				"shadow": "2020-02-03",
				"shiny-shadow": "2022-04-03"
			},
			"category": "Coconut",
			"type": [ "Grass", "Psychic" ],
			"evolves-from": "102",
			"base-stamina": 216,
			"base-attack": 233,
			"base-defense": 149,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_BULLETSEED",
				"FAST_PSY_EXTRASENSORY",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRA_SOLARBEAM"
			],
			"special-fast-moves": [
				"FAST_PSY_ZENHEADBUTT"
			],
			"height-avg": 2,
			"weight-avg": 120,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.25,
				"wt-std-dev": 15,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 4 ]
			}
		},
		"103-A": {
			"dex-index": "103-A",
			"name": "Alolan Exeggutor",
			"form-data": {
				"base": "103",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-03-30",
				"shiny": "2019-06-28",
				"shadow": "2022-04-03"
			},
			"type": [ "Grass", "Dragon" ],
			"base-stamina": 216,
			"base-attack": 230,
			"base-defense": 153,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_BULLETSEED",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_GRA_SOLARBEAM"
			],
			"special-charged-moves": [
				"CHRG_DRA_DRACOMETEOR"
			],
			"height-avg": 10.9,
			"weight-avg": 415.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 1.3625,
				"wt-std-dev": 51.95,
				"xxs": [ 5.341, 5.45 ],
				"xs": [ 5.45, 8.175 ],
				"m": [ 8.175, 13.625 ],
				"xl": [ 13.625, 16.35 ],
				"xxl": [ 16.35, 21.8 ]
			}
		},
		"104": {
			"dex-index": "104",
			"name": "Cubone",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-05",
				"shadow": "2019-08-01",
				"shiny-shadow": "2022-04-03"
			},
			"category": "Lonely",
			"type": [ "Ground" ],
			"evolves-into": [ "105" ],
			"base-stamina": 137,
			"base-attack": 90,
			"base-defense": 144,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_GRO_BONECLUB",
				"CHRG_GRO_DIG",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 0.4,
			"weight-avg": 6.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.8125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"105": {
			"dex-index": "105",
			"name": "Marowak",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-05",
				"shadow": "2019-08-01",
				"shiny-shadow": "2022-04-03"
			},
			"category": "Bone Keeper",
			"type": [ "Ground" ],
			"evolves-from": "104",
			"base-stamina": 155,
			"base-attack": 144,
			"base-defense": 186,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_GRO_BONECLUB",
				"CHRG_GRO_DIG",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 1,
			"weight-avg": 45,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 5.625,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"105-A": {
			"dex-index": "105-A",
			"name": "Alolan Marowak",
			"form-data": {
				"base": "105",
				"type": "Regional",
				"region": "Alolan"
			},
			"availability": {
				"in-game": "2018-07-19",
				"shadow": "2022-05-25"
			},
			"type": [ "Fire", "Ghost" ],
			"base-stamina": 155,
			"base-attack": 144,
			"base-defense": 186,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_FIG_ROCKSMASH",
				"FAST_FIR_FIRESPIN"
			],
			"charged-moves": [
				"CHRG_GRO_BONECLUB",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_FLAMEWHEEL"
			],
			"special-charged-moves": [
				"CHRG_GHO_SHADOWBONE"
			],
			"height-avg": 1,
			"weight-avg": 34,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.25,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"106": {
			"dex-index": "106",
			"name": "Hitmonlee",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2021-02-20",
				"shadow": "2019-11-07"
			},
			"category": "Kicking",
			"type": [ "Fighting" ],
			"evolves-from": "236",
			"base-stamina": 137,
			"base-attack": 224,
			"base-defense": 181,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_FIG_ROCKSMASH",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_ROC_STONEEDGE",
				"CHRG_FIR_BLAZEKICK"
			],
			"special-charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 1.5,
			"weight-avg": 49.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 6.225,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"107": {
			"dex-index": "107",
			"name": "Hitmonchan",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2021-02-20",
				"shadow": "2019-09-05"
			},
			"category": "Punching",
			"type": [ "Fighting" ],
			"evolves-from": "236",
			"base-stamina": 137,
			"base-attack": 193,
			"base-defense": 197,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_BULLETPUNCH",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_FIR_FIREPUNCH",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_POWERUPPUNCH"
			],
			"special-charged-moves": [
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 1.4,
			"weight-avg": 50.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 6.275,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"108": {
			"dex-index": "108",
			"name": "Lickitung",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-02-15"
			},
			"category": "Licking",
			"type": [ "Normal" ],
			"evolves-into": [ "463" ],
			"base-stamina": 207,
			"base-attack": 108,
			"base-defense": 137,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_NOR_STOMP",
				"CHRG_GRA_POWERWHIP"
			],
			"special-charged-moves": [
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 1.2,
			"weight-avg": 65.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 8.1875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"109": {
			"dex-index": "109",
			"name": "Koffing",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-07-25",
				"shadow": "2020-06-10",
				"shiny-shadow": "2020-07-10"
			},
			"category": "Poison Gas",
			"type": [ "Poison" ],
			"evolves-into": [ "110", "110-G" ],
			"base-stamina": 120,
			"base-attack": 119,
			"base-defense": 141,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_BUG_INFESTATION"
			],
			"unobtainable-fast-moves": [
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGE",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_DAR_DARKPULSE"
			],
			"height-avg": 0.6,
			"weight-avg": 1,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.2 ]
			}
		},
		"110": {
			"dex-index": "110",
			"name": "Weezing",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2021-08-20",
				"shadow": "2020-06-10",
				"shiny-shadow": "2020-07-10"
			},
			"category": "Poison Gas",
			"type": [ "Poison" ],
			"evolves-from": "109",
			"base-stamina": 163,
			"base-attack": 174,
			"base-defense": 197,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_BUG_INFESTATION"
			],
			"unobtainable-fast-moves": [
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DAR_DARKPULSE",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 1.2,
			"weight-avg": 9.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 1.1875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"110-G": {
			"dex-index": "110-G",
			"name": "Galarian Weezing",
			"form-data": {
				"base": "110",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2019-11-16",
				"shadow": "2024-09-26"
			},
			"type": [ "Poison", "Fairy" ],
			"evolves-from": "109",
			"base-stamina": 163,
			"base-attack": 174,
			"base-defense": 197,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FAI_FAIRYWIND"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGE",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FIR_OVERHEAT",
				"CHRG_DAR_BRUTALSWING"
			],
			"height-avg": 3,
			"weight-avg": 16,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.375,
				"wt-std-dev": 2,
				"xxs": [ 1.47, 1.5 ],
				"xs": [ 1.5, 2.25 ],
				"m": [ 2.25, 3.75 ],
				"xl": [ 3.75, 4.5 ],
				"xxl": [ 4.5, 5.25 ]
			}
		},
		"111": {
			"dex-index": "111",
			"name": "Rhyhorn",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-02-22",
				"shadow": "2023-10-26"
			},
			"category": "Spikes",
			"type": [ "Ground", "Rock" ],
			"evolves-into": [ "112" ],
			"base-stamina": 190,
			"base-attack": 140,
			"base-defense": 127,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_GRO_BULLDOZE",
				"CHRG_NOR_HORNATTACK",
				"CHRG_NOR_STOMP"
			],
			"height-avg": 1,
			"weight-avg": 115,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 14.375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"112": {
			"dex-index": "112",
			"name": "Rhydon",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-02-22",
				"shadow": "2023-10-26"
			},
			"category": "Drill",
			"type": [ "Ground", "Rock" ],
			"evolves-from": "111",
			"evolves-into": [ "464" ],
			"base-stamina": 233,
			"base-attack": 222,
			"base-defense": 171,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_DRA_BREAKINGSWIPE"
			],
			"special-charged-moves": [
				"CHRG_BUG_MEGAHORN"
			],
			"height-avg": 1.9,
			"weight-avg": 120,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 15,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 3.325 ]
			}
		},
		"113": {
			"dex-index": "113",
			"name": "Chansey",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-02-14"
			},
			"category": "Egg",
			"type": [ "Normal" ],
			"evolves-from": "440",
			"evolves-into": [ "242" ],
			"base-stamina": 487,
			"base-attack": 60,
			"base-defense": 128,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FAI_DAZZLINGGLEAM"
			],
			"unobtainable-charged-moves": [
				"CHRG_PSY_PSYBEAM"
			],
			"height-avg": 1.1,
			"weight-avg": 34.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 4.325,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"114": {
			"dex-index": "114",
			"name": "Tangela",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-07-25",
				"shadow": "2021-05-18"
			},
			"category": "Vine",
			"type": [ "Grass" ],
			"evolves-into": [ "465" ],
			"base-stamina": 163,
			"base-attack": 183,
			"base-defense": 169,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_BUG_INFESTATION"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRA_SOLARBEAM"
			],
			"special-charged-moves": [
				"CHRG_GRA_POWERWHIP"
			],
			"height-avg": 1,
			"weight-avg": 35,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"115": {
			"dex-index": "115",
			"name": "Kangaskhan",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-09-09"
			},
			"category": "Parent",
			"type": [ "Normal" ],
			"base-stamina": 233,
			"base-attack": 181,
			"base-defense": 165,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_FIG_LOWKICK"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_DRA_OUTRAGE",
				"CHRG_FIG_POWERUPPUNCH"
			],
			"special-charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_NOR_STOMP"
			],
			"height-avg": 2.2,
			"weight-avg": 80,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.275,
				"wt-std-dev": 10,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.85 ]
			}
		},
		"115-M": {
			"dex-index": "115-M",
			"name": "Mega Kangaskhan",
			"form-data": {
				"base": "115",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-04-29",
				"shiny": "2019-09-09",
				"shadow": false
			},
			"height-avg": 2.2,
			"weight-avg": 100,
			"base-stamina": 233,
			"base-attack": 246,
			"base-defense": 210,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.275,
				"wt-std-dev": 10,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.41 ]
			}
		},
		"116": {
			"dex-index": "116",
			"name": "Horsea",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-06-13",
				"shadow": "2021-05-18"
			},
			"category": "Dragon",
			"type": [ "Water" ],
			"evolves-into": [ "117" ],
			"base-stamina": 102,
			"base-attack": 129,
			"base-defense": 103,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_STE_FLASHCANNON"
			],
			"height-avg": 0.4,
			"weight-avg": 8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"117": {
			"dex-index": "117",
			"name": "Seadra",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-06-13",
				"shadow": "2021-05-18"
			},
			"category": "Dragon",
			"type": [ "Water" ],
			"evolves-from": "116",
			"evolves-into": [ "230" ],
			"base-stamina": 146,
			"base-attack": 187,
			"base-defense": 156,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_DRA_DRAGONBREATH"
			],
			"charged-moves": [
				"CHRG_ICE_AURORABEAM",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_WAT_HYDROPUMP"
			],
			"special-charged-moves": [
				"CHRG_ICE_BLIZZARD"
			],
			"height-avg": 1.2,
			"weight-avg": 25,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 3.125,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"118": {
			"dex-index": "118",
			"name": "Goldeen",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-11-24"
			},
			"category": "Goldfish",
			"type": [ "Water" ],
			"evolves-into": [ "119" ],
			"base-stamina": 128,
			"base-attack": 123,
			"base-defense": 110,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_NOR_HORNATTACK",
				"CHRG_WAT_AQUATAIL"
			],
			"height-avg": 0.6,
			"weight-avg": 15,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.875,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.2 ]
			}
		},
		"119": {
			"dex-index": "119",
			"name": "Seaking",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-11-24"
			},
			"category": "Goldfish",
			"type": [ "Water" ],
			"evolves-from": "118",
			"base-stamina": 190,
			"base-attack": 175,
			"base-defense": 147,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_WAT_WATERFALL"
			],
			"special-fast-moves": [
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_WATERPULSE",
				"CHRG_BUG_MEGAHORN"
			],
			"special-charged-moves": [
				"CHRG_ICE_ICYWIND",
				"CHRG_GRO_DRILLRUN"
			],
			"height-avg": 1.3,
			"weight-avg": 39,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 4.875,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"120": {
			"dex-index": "120",
			"name": "Staryu",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-08-07"
			},
			"category": "Star Shape",
			"type": [ "Water" ],
			"evolves-into": [ "121" ],
			"base-stamina": 102,
			"base-attack": 137,
			"base-defense": 112,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_WAT_WATERGUN"
			],
			"unobtainable-fast-moves": [
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_NOR_SWIFT",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_ROC_POWERGEM"
			],
			"height-avg": 0.8,
			"weight-avg": 34.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 4.3125,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"121": {
			"dex-index": "121",
			"name": "Starmie",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-08-07"
			},
			"category": "Mysterious",
			"type": [ "Water", "Psychic" ],
			"evolves-from": "120",
			"base-stamina": 155,
			"base-attack": 210,
			"base-defense": 184,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER",
				"FAST_WAT_WATERGUN"
			],
			"special-fast-moves": [
				"FAST_NOR_TACKLE"
			],
			"unobtainable-fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ROC_POWERGEM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_ELE_THUNDER",
				"CHRG_ICE_ICEBEAM"
			],
			"unobtainable-charged-moves": [
				"CHRG_PSY_PSYBEAM"
			],
			"height-avg": 1.1,
			"weight-avg": 80,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 10,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"122": {
			"dex-index": "122",
			"name": "Mr. Mime",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2022-12-01"
			},
			"category": "Barrier",
			"type": [ "Psychic", "Fairy" ],
			"evolves-from": "439",
			"base-stamina": 120,
			"base-attack": 192,
			"base-defense": 205,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_GRA_MAGICALLEAF",
				"FAST_PSY_PSYWAVE"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 1.3,
			"weight-avg": 54.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 6.8125,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"122-G": {
			"dex-index": "122-G",
			"name": "Galarian Mr. Mime",
			"form-data": {
				"base": "122",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-12-19"
			},
			"category": "Dancing",
			"type": [ "Ice", "Psychic" ],
			"evolves-into": [ "866" ],
			"base-stamina": 137,
			"base-attack": 183,
			"base-defense": 169,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"height-avg": 1.4,
			"weight-avg": 56.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 7.1,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"123": {
			"dex-index": "123",
			"name": "Scyther",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-04-02",
				"shadow": "2019-08-01",
				"shiny-shadow": "2019-11-07"
			},
			"category": "Mantis",
			"type": [ "Bug", "Flying" ],
			"evolves-into": [ "212", "900" ],
			"base-stamina": 172,
			"base-attack": 218,
			"base-defense": 170,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_FLY_AIRSLASH"
			],
			"special-fast-moves": [
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_BUG_XSCISSOR",
				"CHRG_FLY_AERIALACE",
				"CHRG_GRA_TRAILBLAZE"
			],
			"special-charged-moves": [
				"CHRG_BUG_BUGBUZZ"
			],
			"height-avg": 1.5,
			"weight-avg": 56,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 7,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"124": {
			"dex-index": "124",
			"name": "Jynx",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-02-13"
			},
			"category": "Human Shape",
			"type": [ "Ice", "Psychic" ],
			"evolves-from": "238",
			"base-stamina": 163,
			"base-attack": 223,
			"base-defense": 151,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_FROSTBREATH",
				"FAST_PSY_CONFUSION"
			],
			"special-fast-moves": [
				"FAST_NOR_POUND"
			],
			"charged-moves": [
				"CHRG_FAI_DRAININGKISS",
				"CHRG_ICE_AVALANCHE",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_FIG_FOCUSBLAST"
			],
			"special-charged-moves": [
				"CHRG_ICE_ICEPUNCH"
			],
			"height-avg": 1.4,
			"weight-avg": 40.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 5.075,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"125": {
			"dex-index": "125",
			"name": "Electabuzz",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-14",
				"shadow": "2019-10-17"
			},
			"category": "Electric",
			"type": [ "Electric" ],
			"evolves-from": "239",
			"evolves-into": [ "466" ],
			"base-stamina": 163,
			"base-attack": 198,
			"base-defense": 158,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_FIG_LOWKICK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 1.1,
			"weight-avg": 30,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 3.75,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"126": {
			"dex-index": "126",
			"name": "Magmar",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-03-22",
				"shadow": "2019-10-17"
			},
			"category": "Spitfire",
			"type": [ "Fire" ],
			"evolves-from": "240",
			"evolves-into": [ "467" ],
			"base-stamina": 163,
			"base-attack": 206,
			"base-defense": 154,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIG_KARATECHOP"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_FIREPUNCH",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 1.3,
			"weight-avg": 44.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 5.5625,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"127": {
			"dex-index": "127",
			"name": "Pinsir",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-11-03",
				"shadow": "2020-02-03",
				"shiny-shadow": "2020-02-03"
			},
			"category": "Stag Beetle",
			"type": [ "Bug" ],
			"base-stamina": 163,
			"base-attack": 238,
			"base-defense": 182,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_BUG_BUGBITE",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_NOR_VISEGRIP",
				"CHRG_BUG_XSCISSOR",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_SUPERPOWER"
			],
			"special-charged-moves": [
				"CHRG_FIG_SUBMISSION"
			],
			"height-avg": 1.5,
			"weight-avg": 55,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 6.875,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"127-M": {
			"dex-index": "127-M",
			"name": "Mega Pinsir",
			"form-data": {
				"base": "127",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-05-11",
				"shiny": "2023-05-11",
				"shadow": false
			},
			"height-avg": 1.7,
			"weight-avg": 59,
			"base-stamina": 163,
			"base-attack": 305,
			"base-defense": 231,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 6.875,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"128": {
			"dex-index": "128",
			"name": "Tauros",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2019-09-09"
			},
			"forms": [ "128", "128-P", "128-B", "128-C", "128-A" ],
			"category": "Wild Bull",
			"type": [ "Normal" ],
			"base-stamina": 181,
			"base-attack": 198,
			"base-defense": 183,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_NOR_HORNATTACK",
				"CHRG_STE_IRONHEAD",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.4,
			"weight-avg": 88.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 11.05,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"128-P": {
			"dex-index": "128-P",
			"form-data": {
				"base": "128",
				"type": "Regional",
				"region": "Paldean"
			},
			"availability": {
			}
		},
		"128-C": {
			"dex-index": "128-C",
			"form-data": {
				"base": "128-P",
				"type": "idk",
				"form": "Combat Breed",
				"form-ital": "Varieta Combattiva",
				"form-ital-display": "Variet\`a Combattiva" // TODO a accent
			},
			"type": [ "Fighting" ]
		},
		"128-B": {
			"dex-index": "128-B",
			"form-data": {
				"base": "128-P",
				"type": "idk",
				"form": "Blaze Breed",
				"form-ital": "Varieta Infuocata",
				"form-ital-display": "Variet\`a Infuocata" // TODO a accent
			},
			"type": [ "Fighting", "Fire" ]
		},
		"128-A": {
			"dex-index": "128-A",
			"form-data": {
				"base": "128-P",
				"type": "idk",
				"form": "Aqua Breed",
				"form-ital": "Varieta Acquatica",
				"form-ital-display": "Variet\`a Acquatica" // TODO a accent
			},
			"type": [ "Fighting", "Water" ]
		},
		"129": {
			"dex-index": "129",
			"name": "Magikarp",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2017-03-22",
				"shadow": "2019-08-01"
			},
			"category": "Fish",
			"type": [ "Water" ],
			"evolves-into": [ "130" ],
			"base-stamina": 85,
			"base-attack": 29,
			"base-defense": 85,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.9,
			"weight-avg": 10,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 1.25,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"130": {
			"dex-index": "130",
			"name": "Gyarados",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2017-03-22",
				"shadow": "2019-08-01"
			},
			"category": "Atrocious",
			"type": [ "Water", "Flying" ],
			"evolves-from": "129",
			"base-stamina": 216,
			"base-attack": 237,
			"base-defense": 186,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_WAT_WATERFALL",
				"FAST_DRA_DRAGONBREATH"
			],
			"special-fast-moves": [
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_DAR_CRUNCH",
				"CHRG_DRA_OUTRAGE",
				"CHRG_DRA_TWISTER"
			],
			"special-charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_WAT_AQUATAIL"
			],
			"height-avg": 6.5,
			"weight-avg": 235,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.8125,
				"wt-std-dev": 29.375,
				"xxs": [ 3.185, 3.25 ],
				"xs": [ 3.25, 4.875 ],
				"m": [ 4.875, 8.125 ],
				"xl": [ 8.125, 9.75 ],
				"xxl": [ 9.75, 13 ]
			}
		},
		"130-M": {
			"dex-index": "130-M",
			"name": "Mega Gyarados",
			"form-data": {
				"base": "130",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2021-02-09",
				"shiny": "2021-02-09",
				"shadow": false
			},
			"type": [ "Water", "Dark" ],
			"base-stamina": 216,
			"base-attack": 292,
			"base-defense": 247,
			"height-avg": 6.5,
			"weight-avg": 305,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.8125,
				"wt-std-dev": 29.375,
				"xxs": [ 3.185, 3.25 ],
				"xs": [ 3.25, 4.875 ],
				"m": [ 4.875, 8.125 ],
				"xl": [ 8.125, 9.75 ],
				"xxl": [ 9.75, 10.075 ]
			}
		},
		"131": {
			"dex-index": "131",
			"name": "Lapras",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "20xx-xx-xx",
				"shadow": "20xx-xx-xx"
			},
			"category": "Transport",
			"type": [ "Water", "Ice" ],
			"base-stamina": 277,
			"base-attack": 165,
			"base-defense": 174,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_FROSTBREATH",
				"FAST_WAT_WATERGUN",
			],
			"special-fast-moves": [
				"FAST_ICE_ICESHARD"
			],
			"charged-moves": [
				"CHRG_ICE_BLIZZARD",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_WAT_SURF",
				"CHRG_NOR_SKULLBASH"
			],
			"special-charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_ICE_ICEBEAM"
			],
			"height-avg": 2.5,
			"weight-avg": 220,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 27.5,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 4.375 ]
			}
		},
		"131-G": {
			"dex-index": "131-G",
			"form-data": {
				"base": "131",
				"type": "Giga"
			},
			"availability": {
				"in-game": "2024-12-08",
				"shiny": "2024-12-08",
				"shadow": false
			},
			"height-avg": 24,
			"size-data": {
				"xxs": [ 23.833, 23.85 ],
				"xs": [ 23.85, 24.275 ],
				"m": [ 24.275, 25.125 ],
				"xl": [ 25.125, 25.55 ],
				"xxl": [ 25.55, 25.975 ]
			}
		},
		"132": {
			"dex-index": "132",
			"name": "Ditto",
			"availability": {
				"in-game": "2016-11-23",
				"shiny": "2021-02-20"
			},
			"category": "Transform",
			"type": [ "Normal" ],
			"base-stamina": 134,
			"base-attack": 91,
			"base-defense": 91,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TRANSFORM"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.3,
			"weight-avg": 4,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.5,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.6 ]
			}
		},
		"133": {
			"dex-index": "133",
			"name": "Eevee",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-08-11"
			},
			"category": "Evolution",
			"type": [ "Normal" ],
			"evolves-into": [ "134", "135", "136", "196", "197", "470", "471", "700" ],
			"base-stamina": 146,
			"base-attack": 104,
			"base-defense": 114,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_NOR_SWIFT"
			],
			"special-charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_NOR_LASTRESORT"
			],
			"height-avg": 0.3,
			"weight-avg": 6.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.8125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"133-G": {
			"dex-index": "133-G",
			"form-data": {
				"base": "133",
				"type": "Giga"
			}
		},
		"134": {
			"dex-index": "134",
			"name": "Vaporeon",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-08-11"
			},
			"category": "Bubble Jet",
			"type": [ "Water" ],
			"evolves-from": "133",
			"base-stamina": 277,
			"base-attack": 205,
			"base-defense": 161,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_WAT_AQUATAIL",
				"CHRG_WAT_LIQUIDATION"
			],
			"special-charged-moves": [
				"CHRG_NOR_LASTRESORT",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 1,
			"weight-avg": 29,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.625,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"135": {
			"dex-index": "135",
			"name": "Jolteon",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-08-11"
			},
			"category": "Lightning",
			"type": [ "Electric" ],
			"evolves-from": "133",
			"base-stamina": 163,
			"base-attack": 232,
			"base-defense": 182,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER"
			],
			"special-charged-moves": [
				"CHRG_NOR_LASTRESORT",
				"CHRG_ELE_ZAPCANNON"
			],
			"height-avg": 0.8,
			"weight-avg": 24.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.0625,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.24 ]
			}
		},
		"136": {
			"dex-index": "136",
			"name": "Flareon",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-08-11"
			},
			"category": "Flame",
			"type": [ "Fire" ],
			"evolves-from": "133",
			"base-stamina": 163,
			"base-attack": 246,
			"base-defense": 179,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIR_FIRESPIN"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_OVERHEAT"
			],
			"special-charged-moves": [
				"CHRG_NOR_LASTRESORT",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIG_SUPERPOWER"
			],
			"height-avg": 0.9,
			"weight-avg": 25,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 3.125,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.395 ]
			}
		},
		"137": {
			"dex-index": "137",
			"name": "Porygon",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2020-09-20",
				"shadow": "2019-11-07"
			},
			"category": "Virtual",
			"type": [ "Normal" ],
			"evolves-into": [ "233" ],
			"base-stamina": 163,
			"base-attack": 153,
			"base-defense": 136,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_CHARGEBEAM",
				"FAST_WAT_HIDDENPOWER"
			],
			"special-fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_PSY_ZENHEADBUTT"
			],
			"unobtainable-fast-moves": [
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_GRA_SOLARBEAM",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_ELE_ZAPCANNON"
			],
			"special-charged-moves": [
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_PSY_PSYBEAM",
				"CHRG_ELE_DISCHARGE"
			],
			"height-avg": 0.8,
			"weight-avg": 36.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1,
				"wt-std-dev": 4.5625,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.6 ]
			}
		},
		"138": {
			"dex-index": "138",
			"name": "Omanyte",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-05-24",
				"shadow": "2020-02-03",
				"shiny-shadow": "2020-10-12"
			},
			"category": "Spiral",
			"type": [ "Rock", "Water" ],
			"evolves-into": [ "139" ],
			"base-stamina": 111,
			"base-attack": 155,
			"base-defense": 153,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_ROC_ROCKBLAST"
			],
			"special-charged-moves": [
				"CHRG_ROC_ROCKTOMB",
				"CHRG_WAT_BRINE"
			],
			"height-avg": 0.4,
			"weight-avg": 7.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.9375,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"139": {
			"dex-index": "139",
			"name": "Omastar",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-05-24",
				"shadow": "2020-02-03",
				"shiny-shadow": "2020-10-12"
			},
			"category": "Spiral",
			"type": [ "Rock", "Water" ],
			"evolves-from": "138",
			"base-stamina": 172,
			"base-attack": 207,
			"base-defense": 201,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_WAT_WATERGUN"
			],
			"special-fast-moves": [
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ROC_ROCKBLAST"
			],
			"special-charged-moves": [
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 1,
			"weight-avg": 35,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"140": {
			"dex-index": "140",
			"name": "Kabuto",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-05-24"
			},
			"category": "Shellfish",
			"type": [ "Rock", "Water" ],
			"evolves-into": [ "141" ],
			"base-stamina": 102,
			"base-attack": 148,
			"base-defense": 140,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_WAT_AQUAJET",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.5,
			"weight-avg": 11.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.4375,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"141": {
			"dex-index": "141",
			"name": "Kabutops",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-05-24"
			},
			"category": "Shellfish",
			"type": [ "Rock", "Water" ],
			"evolves-from": "140",
			"base-stamina": 155,
			"base-attack": 220,
			"base-defense": 186,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_FIG_ROCKSMASH",
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_WAT_WATERPULSE",
				"CHRG_ROC_STONEEDGE"
			],
			"height-avg": 1.3,
			"weight-avg": 40.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 5.0625,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"142": {
			"dex-index": "142",
			"name": "Aerodactyl",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-05-24",
				"shadow": "2020-10-12",
				"shiny-shadow": "2021-02-02"
			},
			"category": "Fossil",
			"type": [ "Rock", "Flying" ],
			"base-stamina": 190,
			"base-attack": 221,
			"base-defense": 159,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_STEELWING",
				"FAST_DAR_BITE",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_STE_IRONHEAD",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_GRO_EARTHPOWER"
			],
			"height-avg": 1.8,
			"weight-avg": 59,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.225,
				"wt-std-dev": 7.375,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.6 ]
			}
		},
		"142-M": {
			"dex-index": "142-M",
			"name": "Mega Aerodactyl",
			"form-data": {
				"base": "142",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-01-07",
				"shiny": "2022-01-07",
				"shadow": false
			},
			"height-avg": 2.1,
			"weight-avg": 79,
			"base-stamina": 190,
			"base-attack": 292,
			"base-defense": 210,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 7.375,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.255 ]
			}
		},
		"143": {
			"dex-index": "143",
			"name": "Snorlax",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2021-02-20",
				"shadow": "2019-07-22"
			},
			"category": "Sleeping",
			"type": [ "Normal" ],
			"evolves-from": "446",
			"base-stamina": 330,
			"base-attack": 190,
			"base-defense": 169,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_PSY_ZENHEADBUTT"
			],
			"special-fast-moves": [
				"FAST_NOR_YAWN"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_NOR_BODYSLAM",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_NOR_SKULLBASH",
				"CHRG_STE_HEAVYSLAM"
			],
			"height-avg": 2.1,
			"weight-avg": 460,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2625,
				"wt-std-dev": 57.5,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.675 ]
			}
		},
		"143-G": {
			"dex-index": "143-G",
			"form-data": {
				"base": "143",
				"type": "Giga"
			}
		},
		"144": {
			"dex-index": "144",
			"name": "Articuno",
			"availability": {
				"in-game": "2017-07-22",
				"shiny": "2018-07-07",
				"shadow": "2019-11-05",
				"shiny-shadow": "2023-06-10",
				"dynamax": "2025-01-20"
			},
			"category": "Freeze",
			"type": [ "Ice", "Flying" ],
			"base-stamina": 207,
			"base-attack": 192,
			"base-defense": 236,
			"dynamax-class": 4,
			"max-battle-tier": 5,
			"fast-moves": [
				"FAST_ICE_FROSTBREATH",
				"FAST_ICE_ICESHARD"
			],
			"charged-moves": [
				"CHRG_ICE_ICEBEAM",
				"CHRG_ICE_ICYWIND",
				"CHRG_ICE_BLIZZARD",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"special-charged-moves": [
				"CHRG_FLY_HURRICANE"
			],
			"height-avg": 1.7,
			"weight-avg": 55.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 6.925,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"144-G": {
			"dex-index": "144-G",
			"name": "Galarian Articuno",
			"form-data": {
				"base": "144",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2022-07-25",
				"shiny": "2024-10-04"
			},
			"category": "Cruel",
			"type": [ "Psychic", "Flying" ],
			"base-stamina": 207,
			"base-attack": 250,
			"base-defense": 197,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_PSYCHOCUT"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FLY_BRAVEBIRD"
			],
			"special-charged-moves": [ ],
			"height-avg": 1.7,
			"weight-avg": 50.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 6.3625,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"145": {
			"dex-index": "145",
			"name": "Zapdos",
			"availability": {
				"in-game": "2017-08-07",
				"shiny": "2018-07-21",
				"shadow": "2019-12-01",
				"shiny-shadow": "2023-09-02",
				"dynamax": "2025-01-27"
			},
			"category": "Electric",
			"type": [ "Electric", "Flying" ],
			"base-stamina": 207,
			"base-attack": 253,
			"base-defense": 185,
			"dynamax-class": 4,
			"max-battle-tier": 5,
			"fast-moves": [
				"FAST_ELE_CHARGEBEAM"
			],
			"special-fast-moves": [
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_ELE_ZAPCANNON",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FLY_DRILLPECK"
			],
			"height-avg": 1.6,
			"weight-avg": 52.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 6.575,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"145-G": {
			"dex-index": "145-G",
			"name": "Galarian Zapdos",
			"form-data": {
				"base": "145",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2022-07-25",
				"shiny": "2024-10-04"
			},
			"category": "Strong Legs",
			"type": [ "Fighting", "Flying" ],
			"base-stamina": 207,
			"base-attack": 252,
			"base-defense": 189,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FIG_COUNTER"
			],
			"special-fast-moves": [ ],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FLY_BRAVEBIRD"
			],
			"height-avg": 1.6,
			"weight-avg": 58.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 7.275,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"146": {
			"dex-index": "146",
			"name": "Moltres",
			"availability": {
				"in-game": "2017-07-31",
				"shiny": "2018-09-08",
				"shadow": "2020-01-01",
				"shiny-shadow": "2023-10-01",
				"dynamax": "2025-02-03"
			},
			"category": "Flame",
			"type": [ "Fire", "Flying" ],
			"base-stamina": 207,
			"base-attack": 251,
			"base-defense": 181,
			"dynamax-class": 4,
			"max-battle-tier": 5,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIR_OVERHEAT",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"special-charged-moves": [
				"CHRG_FLY_SKYATTACK"
			],
			"height-avg": 2,
			"weight-avg": 60,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.25,
				"wt-std-dev": 7.5,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.5 ]
			}
		},
		"146-G": {
			"dex-index": "146-G",
			"name": "Galarian Moltres",
			"form-data": {
				"base": "146",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2022-07-25",
				"shiny": "2024-10-04"
			},
			"category": "Malevolent",
			"type": [ "Dark", "Flying" ],
			"base-stamina": 207,
			"base-attack": 202,
			"base-defense": 231,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_DAR_PAYBACK",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FLY_BRAVEBIRD"
			],
			"special-charged-moves": [ ],
			"height-avg": 2,
			"weight-avg": 66,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.25,
				"wt-std-dev": 8.25,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.5 ]
			}
		},
		"147": {
			"dex-index": "147",
			"name": "Dratini",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-02-24",
				"shadow": "2019-07-22",
				"shiny-shadow": "2023-10-26"
			},
			"category": "Dragon",
			"type": [ "Dragon" ],
			"evolves-into": [ "148" ],
			"base-stamina": 121,
			"base-attack": 119,
			"base-defense": 91,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_NOR_WRAP",
				"CHRG_DRA_TWISTER",
				"CHRG_WAT_AQUATAIL"
			],
			"height-avg": 1.8,
			"weight-avg": 3.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 0.4125,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"148": {
			"dex-index": "148",
			"name": "Dragonair",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-02-24",
				"shadow": "2019-07-22",
				"shiny-shadow": "2023-10-26"
			},
			"category": "Dragon",
			"type": [ "Dragon" ],
			"evolves-from": "147",
			"evolves-into": [ "149" ],
			"base-stamina": 156,
			"base-attack": 163,
			"base-defense": 135,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_NOR_WRAP",
				"CHRG_WAT_AQUATAIL",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 4,
			"weight-avg": 16.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.5,
				"wt-std-dev": 2.0625,
				"xxs": [ 1.96, 2 ],
				"xs": [ 2, 3 ],
				"m": [ 3, 5 ],
				"xl": [ 5, 6 ],
				"xxl": [ 6, 7 ]
			}
		},
		"149": {
			"dex-index": "149",
			"name": "Dragonite",
			"availability": {
				"in-game": "2016-07-06",
				"shiny": "2018-02-24",
				"shadow": "2019-07-22",
				"shiny-shadow": "2023-10-26"
			},
			"category": "Dragon",
			"type": [ "Dragon", "Flying" ],
			"evolves-from": "148",
			"base-stamina": 209,
			"base-attack": 263,
			"base-defense": 198,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_STE_STEELWING",
				"FAST_DRA_DRAGONBREATH"
			],
			"charged-moves": [
				"CHRG_FLY_HURRICANE",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_DRA_OUTRAGE",
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_FIG_SUPERPOWER"
			],
			"special-charged-moves": [
				"CHRG_DRA_DRACOMETEOR",
				"CHRG_DRA_DRAGONPULSE"
			],
			"height-avg": 2.2,
			"weight-avg": 210,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.275,
				"wt-std-dev": 26.25,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.85 ]
			}
		},
		"150": {
			"dex-index": "150",
			"name": "Mewtwo",
			"availability": {
				"in-game": "2017-08-14",
				"shiny": "2019-09-16",
				"shadow": "2020-06-26",
				"shiny-shadow": "2023-05-27"
			},
			"category": "Genetic",
			"type": [ "Psychic" ],
			"base-stamina": 214,
			"base-attack": 300,
			"base-defense": 182,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_PSYCHOCUT",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ICE_ICEBEAM",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_FIR_FLAMETHROWER"
			],
			"special-charged-moves": [
				"CHRG_PSY_PSYSTRIKE",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_NOR_HYPERBEAM"
			],
			"height-avg": 2,
			"weight-avg": 122,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.25,
				"wt-std-dev": 15.25,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.5 ]
			}
		},
		"150-A": { // TODO check stats
			"dex-index": "150-A",
			"name": "Armored Mewtwo",
			"form-data": {
				"base": "150"
			},
			"availability": {
				"in-game": "2019-07-10"
			},
			"base-stamina": 214,
			"base-attack": 182,
			"base-defense": 278,
			"fast-moves": [
				"FAST_PSY_PSYCHOCUT",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_ROC_ROCKSLIDE"
			],
			"special-charged-moves": [
				"CHRG_PSY_PSYSTRIKE"
			]
		},
		"150-X": {
			"dex-index": "150-X",
			"name": "Mega Mewtwo X",
			"form-data": {
				"base": "150",
				"type": "Mega"
			},
			"availability": {
				"in-game": false
			},
			"type": [ "Psychic", "Fighting" ],
			"height-avg": 2.3,
			"weight-avg": 127.0
		},
		"150-Y": {
			"dex-index": "150-Y",
			"name": "Mega Mewtwo Y",
			"form-data": {
				"base": "150",
				"type": "Mega"
			},
			"availability": {
				"in-game": false
			},
			"height-avg": 1.5,
			"weight-avg": 33.0
		},
		"151": {
			"dex-index": "151",
			"name": "Mew",
			"availability": {
				"in-game": "2018-03-27",
				"shiny": "2021-02-20",
				"shadow": false
			},
			"category": "New Species",
			"type": [ "Psychic" ],
			"base-stamina": 225,
			"base-attack": 210,
			"base-defense": 210,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_STE_STEELWING",
				"FAST_ELE_CHARGEBEAM",
				"FAST_GHO_SHADOWCLAW",
				"FAST_ELE_VOLTSWITCH",
				"FAST_BUG_STRUGGLEBUG",
				"FAST_ICE_FROSTBREATH",
				"FAST_DRA_DRAGONTAIL",
				"FAST_BUG_INFESTATION",
				"FAST_POI_POISONJAB",
				"FAST_FIG_ROCKSMASH",
				"FAST_DAR_SNARL",
				"FAST_NOR_CUT",
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_ICE_ICEBEAM",
				"CHRG_ICE_BLIZZARD",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_FIR_OVERHEAT",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_ROC_STONEEDGE",
				"CHRG_STE_GYROBALL",
				"CHRG_GRO_BULLDOZE",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_STE_FLASHCANNON",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_DAR_DARKPULSE",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_WAT_SURF"
			],
			"height-avg": 0.4,
			"weight-avg": 4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.5,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"152": {
			"dex-index": "152",
			"name": "Chikorita",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-09-22",
				"shadow": "2022-01-24"
			},
			"category": "Leaf",
			"type": [ "Grass" ],
			"evolves-into": [ "153" ],
			"base-stamina": 128,
			"base-attack": 92,
			"base-defense": 122,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_NOR_TACKLE",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.89,
			"weight-avg": 6.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 0.8,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.3795 ]
			}
		},
		"153": {
			"dex-index": "153",
			"name": "Bayleef",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-09-22",
				"shadow": "2022-01-24"
			},
			"category": "Leaf",
			"type": [ "Grass" ],
			"evolves-from": "152",
			"evolves-into": [ "154" ],
			"base-stamina": 155,
			"base-attack": 122,
			"base-defense": 155,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_NOR_TACKLE",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 1.19,
			"weight-avg": 15.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 1.975,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 1.8445 ]
			}
		},
		"154": {
			"dex-index": "154",
			"name": "Meganium",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-09-22",
				"shadow": "2022-01-24"
			},
			"category": "Herb",
			"type": [ "Grass" ],
			"evolves-from": "153",
			"base-stamina": 190,
			"base-attack": 168,
			"base-defense": 202,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_VINEWHIP",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRO_EARTHQUAKE"
			],
			"special-charged-moves": [
				"CHRG_GRA_FRENZYPLANT"
			],
			"height-avg": 1.8,
			"weight-avg": 100.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 12.5625,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"155": {
			"dex-index": "155",
			"name": "Cyndaquil",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-11-10",
				"shadow": "2022-01-24"
			},
			"category": "Fire Mouse",
			"type": [ "Fire" ],
			"evolves-into": [ "156" ],
			"base-stamina": 118,
			"base-attack": 116,
			"base-defense": 93,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_NOR_SWIFT",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.51,
			"weight-avg": 7.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.9875,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"156": {
			"dex-index": "156",
			"name": "Quilava",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-11-10",
				"shadow": "2022-01-24"
			},
			"category": "Volcano",
			"type": [ "Fire" ],
			"evolves-from": "155",
			"evolves-into": [ "157" ],
			"base-stamina": 151,
			"base-attack": 158,
			"base-defense": 126,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_GRO_DIG",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.89,
			"weight-avg": 19,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 2.375,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.5575 ]
			}
		},
		"157": {
			"dex-index": "157",
			"name": "Typhlosion",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-11-10",
				"shadow": "2022-01-24"
			},
			"category": "Volcano",
			"type": [ "Fire" ],
			"evolves-from": "156",
			"base-stamina": 186,
			"base-attack": 223,
			"base-defense": 173,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_GHO_SHADOWCLAW",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_OVERHEAT",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"special-charged-moves": [
				"CHRG_FIR_BLASTBURN"
			],
			"height-avg": 1.7,
			"weight-avg": 79.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 9.9375,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"157-H": {
			"dex-index": "157-H",
			"form-data": {
				"base": "157",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2024-01-14",
				"shiny": "2024-01-14"
			},
			"category": "Ghost Flame",
			"type": [ "Fire", "Ghost" ],
			"base-stamina": 177,
			"base-attack": 238,
			"base-defense": 172,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FIREPUNCH",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FIR_OVERHEAT",
				"CHRG_GHO_NIGHTSHADE"
			],
			"special-charged-moves": [ ],
			"height-avg": 1.6,
			"weight-avg": 69.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 8.725,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"158": {
			"dex-index": "158",
			"name": "Totodile",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-01-12",
				"shadow": "2022-01-24"
			},
			"category": "Big Jaw",
			"type": [ "Water" ],
			"evolves-into": [ "159" ],
			"base-stamina": 137,
			"base-attack": 117,
			"base-defense": 109,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 0.61,
			"weight-avg": 9.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.1875,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 0.9455 ]
			}
		},
		"159": {
			"dex-index": "159",
			"name": "Croconaw",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-01-12",
				"shadow": "2022-01-24"
			},
			"category": "Big Jaw",
			"type": [ "Water" ],
			"evolves-from": "158",
			"evolves-into": [ "160" ],
			"base-stamina": 163,
			"base-attack": 150,
			"base-defense": 142,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 1.09,
			"weight-avg": 25,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 3.125,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.6895 ]
			}
		},
		"160": {
			"dex-index": "160",
			"name": "Feraligatr",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-01-12",
				"shadow": "2022-01-24"
			},
			"category": "Big Jaw",
			"type": [ "Water" ],
			"evolves-from": "159",
			"base-stamina": 198,
			"base-attack": 205,
			"base-defense": 188,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_DAR_BITE",
				"FAST_ICE_ICEFANG",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_ICEBEAM"
			],
			"special-charged-moves": [
				"CHRG_WAT_HYDROCANNON",
				"CHRG_WAT_WATERGUN"
			],
			"height-avg": 2.31,
			"weight-avg": 88.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.28875,
				"wt-std-dev": 11.1,
				"xxs": [ 1.1319, 1.155 ],
				"xs": [ 1.155, 1.7325 ],
				"m": [ 1.7325, 2.8875 ],
				"xl": [ 2.8875, 3.465 ],
				"xxl": [ 3.465, 3.5805 ]
			}
		},
		"161": {
			"dex-index": "161",
			"name": "Sentret",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-09-02"
			},
			"category": "Scout",
			"type": [ "Normal" ],
			"evolves-into": [ "162" ],
			"base-stamina": 111,
			"base-attack": 79,
			"base-defense": 73,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.79,
			"weight-avg": 6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 0.75,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"162": {
			"dex-index": "162",
			"name": "Furret",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-09-02"
			},
			"category": "Long Body",
			"type": [ "Normal" ],
			"evolves-from": "161",
			"base-stamina": 198,
			"base-attack": 148,
			"base-defense": 125,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_NOR_HYPERBEAM"
			],
			"height-avg": 1.8,
			"weight-avg": 32.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 4.0625,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"163": {
			"dex-index": "163",
			"name": "Hoothoot",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-01-04"
			},
			"category": "Owl",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "164" ],
			"base-stamina": 155,
			"base-attack": 67,
			"base-defense": 88,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_FLY_PECK"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_SKYATTACK",
				"CHRG_GHO_NIGHTSHADE"
			],
			"height-avg": 0.71,
			"weight-avg": 21.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 2.65,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"164": {
			"dex-index": "164",
			"name": "Noctowl",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-01-04"
			},
			"category": "Owl",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "163",
			"base-stamina": 225,
			"base-attack": 145,
			"base-defense": 156,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_PSY_EXTRASENSORY"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_FLY_SKYATTACK",
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 1.6,
			"weight-avg": 40.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 5.1,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"165": {
			"dex-index": "165",
			"name": "Ledyba",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-09-11",
				"shadow": "2023-06-21"
			},
			"category": "Five Star",
			"type": [ "Bug", "Flying" ],
			"evolves-into": [ "166" ],
			"base-stamina": 120,
			"base-attack": 72,
			"base-defense": 118,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_BUG_SILVERWIND",
				"CHRG_NOR_SWIFT",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 0.99,
			"weight-avg": 10.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 1.35,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.7325 ]
			}
		},
		"166": {
			"dex-index": "166",
			"name": "Ledian",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-09-11",
				"shadow": "2023-06-21"
			},
			"category": "Five Star",
			"type": [ "Bug", "Flying" ],
			"evolves-from": "165",
			"base-stamina": 146,
			"base-attack": 107,
			"base-defense": 179,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_BUG_BUGBITE",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_BUG_SILVERWIND",
				"CHRG_FLY_AERIALACE",
				"CHRG_FIG_DYNAMICPUNCH"
			],
			"height-avg": 1.4,
			"weight-avg": 35.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 4.45,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"167": {
			"dex-index": "167",
			"name": "Spinarak",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2021-10-15"
			},
			"category": "String Spit",
			"type": [ "Bug", "Poison" ],
			"evolves-into": [ "168" ],
			"base-stamina": 120,
			"base-attack": 105,
			"base-defense": 73,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_POI_CROSSPOISON"
			],
			"height-avg": 0.51,
			"weight-avg": 8.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 1.0625,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"168": {
			"dex-index": "168",
			"name": "Ariados",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2021-10-15"
			},
			"category": "Long Leg",
			"type": [ "Bug", "Poison" ],
			"evolves-from": "167",
			"base-stamina": 172,
			"base-attack": 161,
			"base-defense": 124,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_BUG_INFESTATION"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_BUG_MEGAHORN",
				"CHRG_POI_CROSSPOISON",
				"CHRG_BUG_LUNGE",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.09,
			"weight-avg": 33.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 4.1875,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"169": {
			"dex-index": "169",
			"name": "Crobat",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-07-25",
				"shadow": "2019-07-22",
				"shiny-shadow": "2024-01-27"
			},
			"category": "Bat",
			"type": [ "Poison", "Flying" ],
			"evolves-from": "42",
			"base-stamina": 198,
			"base-attack": 194,
			"base-defense": 178,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FLY_AIRCUTTER",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_POI_POISONFANG",
				"CHRG_POI_CROSSPOISON"
			],
			"height-avg": 1.8,
			"weight-avg": 75,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 9.375,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"170": {
			"dex-index": "170",
			"name": "Chinchou",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-04-17"
			},
			"category": "Angler",
			"type": [ "Water", "Electric" ],
			"evolves-into": [ "171" ],
			"base-stamina": 181,
			"base-attack": 106,
			"base-defense": 97,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_WAT_BUBBLEBEAM"
			],
			"height-avg": 0.51,
			"weight-avg": 12,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 1.5,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 1.02 ]
			}
		},
		"171": {
			"dex-index": "171",
			"name": "Lanturn",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-04-17"
			},
			"category": "Light",
			"type": [ "Water", "Electric" ],
			"evolves-from": "170",
			"base-stamina": 268,
			"base-attack": 146,
			"base-defense": 137,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_ELE_CHARGEBEAM",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER",
				"CHRG_WAT_SURF"
			],
			"height-avg": 1.19,
			"weight-avg": 22.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 2.8125,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.38 ]
			}
		},
		"172": {
			"dex-index": "172",
			"name": "Pichu",
			"availability": {
				"in-game": "2016-12-12",
				"shiny": "2017-08-09"
			},
			"category": "Tiny Mouse",
			"type": [ "Electric" ],
			"evolves-into": [ "25" ],
			"base-stamina": 85,
			"base-attack": 77,
			"base-defense": 53,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK"
			],
			"unobtainable-fast-moves": [
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 0.3,
			"weight-avg": 2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.25,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"173": {
			"dex-index": "173",
			"name": "Cleffa",
			"availability": {
				"in-game": "2016-12-12",
				"shiny": "2019-02-13"
			},
			"category": "Star Shape",
			"type": [ "Fairy" ],
			"evolves-into": [ "35" ],
			"base-stamina": 137,
			"base-attack": 75,
			"base-defense": 79,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_NOR_SWIFT"
			],
			"special-charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.3,
			"weight-avg": 3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"174": {
			"dex-index": "174",
			"name": "Igglybuff",
			"availability": {
				"in-game": "2016-12-12",
				"shiny": "2019-04-16"
			},
			"category": "Balloon",
			"type": [ "Normal", "Fairy" ],
			"evolves-into": [ "39" ],
			"base-stamina": 207,
			"base-attack": 69,
			"base-defense": 32,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_ELE_WILDCHARGE",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_PSYCHIC",
				"CHRG_NOR_SWIFT"
			],
			"special-charged-moves": [
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.3,
			"weight-avg": 1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"175": {
			"dex-index": "175",
			"name": "Togepi",
			"availability": {
				"in-game": "2016-12-12",
				"shiny": "2018-03-22"
			},
			"category": "Spike Ball",
			"type": [ "Fairy" ],
			"evolves-into": [ "176" ],
			"base-stamina": 111,
			"base-attack": 67,
			"base-defense": 116,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER",
				"FAST_FLY_PECK"
			],
			"special-fast-moves": [
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_FAI_DAZZLINGGLEAM"
			],
			"height-avg": 0.3,
			"weight-avg": 1.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.1875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"176": {
			"dex-index": "176",
			"name": "Togetic",
			"availability": {
				"in-game": "2016-12-12",
				"shiny": "2018-03-22"
			},
			"category": "Happiness",
			"type": [ "Fairy", "Flying" ],
			"evolves-from": "175",
			"evolves-into": [ "468" ],
			"base-stamina": 146,
			"base-attack": 139,
			"base-defense": 181,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_EXTRASENSORY",
				"FAST_WAT_HIDDENPOWER",
				"FAST_FAI_FAIRYWIND"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_FLY_AERIALACE",
				"CHRG_FAI_DRAININGKISS"
			],
			"height-avg": 0.61,
			"weight-avg": 3.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.4,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"177": {
			"dex-index": "177",
			"name": "Natu",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-20",
				"shadow": "2022-11-14"
			},
			"category": "Tiny Bird",
			"type": [ "Psychic", "Flying" ],
			"evolves-into": [ "178" ],
			"base-stamina": 120,
			"base-attack": 134,
			"base-defense": 89,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_FLY_DRILLPECK"
			],
			"height-avg": 0.2,
			"weight-avg": 2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.25,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"178": {
			"dex-index": "178",
			"name": "Xatu",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-20",
				"shadow": "2022-11-14"
			},
			"category": "Mystic",
			"type": [ "Psychic", "Flying" ],
			"evolves-from": "177",
			"base-stamina": 163,
			"base-attack": 192,
			"base-defense": 146,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 1.5,
			"weight-avg": 15,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 1.875,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"179": {
			"dex-index": "179",
			"name": "Mareep",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-04-15",
				"shadow": "2019-10-17"
			},
			"category": "Wool",
			"type": [ "Electric" ],
			"evolves-into": [ "180" ],
			"base-stamina": 146,
			"base-attack": 114,
			"base-defense": 79,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_DISCHARGE",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.61,
			"weight-avg": 7.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.975,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"180": {
			"dex-index": "180",
			"name": "Flaaffy",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-04-15",
				"shadow": "2019-10-17"
			},
			"category": "Wool",
			"type": [ "Electric" ],
			"evolves-from": "179",
			"evolves-into": [ "181" ],
			"base-stamina": 172,
			"base-attack": 145,
			"base-defense": 109,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_ROC_POWERGEM",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_DISCHARGE",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.79,
			"weight-avg": 13.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 1.6625,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"181": {
			"dex-index": "181",
			"name": "Ampharos",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-04-15",
				"shadow": "2019-10-17"
			},
			"category": "Light",
			"type": [ "Electric" ],
			"evolves-from": "180",
			"base-stamina": 207,
			"base-attack": 211,
			"base-defense": 169,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_CHARGEBEAM",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_ELE_ZAPCANNON",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_ELE_THUNDER",
				"CHRG_ROC_POWERGEM",
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_DAR_BRUTALSWING",
				"CHRG_GRA_TRAILBLAZE"
			],
			"special-charged-moves": [
				"CHRG_DRA_DRAGONPULSE"
			],
			"height-avg": 1.4,
			"weight-avg": 61.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 7.6875,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"181-M": {
			"dex-index": "181-M",
			"name": "Mega Ampharos",
			"form-data": {
				"base": "181",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2021-01-18",
				"shiny": "2021-01-18",
				"shadow": false
			},
			"base-stamina": 207,
			"base-attack": 294,
			"base-defense": 203,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 7.6875,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"182": {
			"dex-index": "182",
			"name": "Bellossom",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-10-03",
				"shadow": "2019-09-05"
			},
			"category": "Flower",
			"type": [ "Grass" ],
			"evolves-from": "44",
			"base-stamina": 181,
			"base-attack": 169,
			"base-defense": 186,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_POI_ACID",
				"FAST_GRA_BULLETSEED",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_FAI_DAZZLINGGLEAM"
			],
			"height-avg": 0.41,
			"weight-avg": 5.8,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.725,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.82 ]
			}
		},
		"183": {
			"dex-index": "183",
			"name": "Marill",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-12-18"
			},
			"category": "Aqua Mouse",
			"type": [ "Water", "Fairy" ],
			"evolves-from": "298",
			"evolves-into": [ "184" ],
			"base-stamina": 172,
			"base-attack": 37,
			"base-defense": 93,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_WAT_AQUATAIL",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.41,
			"weight-avg": 8.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 1.0625,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"184": {
			"dex-index": "184",
			"name": "Azumarill",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-12-18"
			},
			"category": "Aqua Rabbit",
			"type": [ "Water", "Fairy" ],
			"evolves-from": "183",
			"base-stamina": 225,
			"base-attack": 112,
			"base-defense": 152,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_ICEBEAM"
			],
			"height-avg": 0.79,
			"weight-avg": 28.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 3.5625,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"185": {
			"dex-index": "185",
			"name": "Sudowoodo",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-08-05",
				"shadow": "2022-04-03"
			},
			"category": "Imitation",
			"type": [ "Rock" ],
			"evolves-from": "438",
			"base-stamina": 172,
			"base-attack": 167,
			"base-defense": 176,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_ROC_METEORBEAM",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.19,
			"weight-avg": 38,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 4.75,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.38 ]
			}
		},
		"186": {
			"dex-index": "186",
			"name": "Politoed",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-08-06",
				"shadow": "2019-08-01",
				"shiny-shadow": "2022-01-24"
			},
			"category": "Frog",
			"type": [ "Water" ],
			"evolves-from": "61",
			"base-stamina": 207,
			"base-attack": 174,
			"base-defense": 179,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_BLIZZARD",
				"CHRG_WAT_SURF",
				"CHRG_WAT_WEATHERBALL",
				"CHRG_WAT_SCALD"
			],
			"special-charged-moves": [
				"CHRG_ICE_ICEBREAM",
				"CHRG_GRO_EARTHQUAKE"
			],
			"height-avg": 1.09,
			"weight-avg": 33.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 4.2375,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"187": {
			"dex-index": "187",
			"name": "Hoppip",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-12",
				"shadow": "2020-10-12"
			},
			"category": "Cottonweed",
			"type": [ "Grass", "Flying" ],
			"evolves-into": [ "188" ],
			"base-stamina": 111,
			"base-attack": 67,
			"base-defense": 94,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.41,
			"weight-avg": 0.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.0625,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"188": {
			"dex-index": "188",
			"name": "Skiploom",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-12",
				"shadow": "2020-10-12"
			},
			"category": "Cottonweed",
			"type": [ "Grass", "Flying" ],
			"evolves-from": "187",
			"evolves-into": [ "189" ],
			"base-stamina": 146,
			"base-attack": 91,
			"base-defense": 120,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 0.61,
			"weight-avg": 1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.125,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"189": {
			"dex-index": "189",
			"name": "Jumpluff",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-12",
				"shadow": "2020-10-12"
			},
			"category": "Cottonweed",
			"type": [ "Grass", "Flying" ],
			"evolves-from": "188",
			"base-stamina": 181,
			"base-attack": 118,
			"base-defense": 183,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_INFESTATION",
				"FAST_GRA_BULLETSEED",
				"FAST_FAI_FAIRYWIND"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_FLY_AERIALACE"
			],
			"special-charged-moves": [
				"CHRG_FLY_ACROBATICS"
			],
			"height-avg": 0.79,
			"weight-avg": 3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 0.375,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"190": {
			"dex-index": "190",
			"name": "Aipom",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-05-07",
				"shadow": "2021-04-01",
				"shiny-shadow": "2023-06-21"
			},
			"category": "Long Tail",
			"type": [ "Normal" ],
			"evolves-into": [ "424" ],
			"base-stamina": 146,
			"base-attack": 136,
			"base-defense": 112,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_FIG_LOWSWEEP",
				"CHRG_NOR_SWIFT",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 0.79,
			"weight-avg": 11.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 1.4375,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"191": {
			"dex-index": "191",
			"name": "Sunkern",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-20"
			},
			"category": "Seed",
			"type": [ "Grass" ],
			"evolves-into": [ "192" ],
			"base-stamina": 102,
			"base-attack": 55,
			"base-defense": 55,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_NOR_CUT"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.3,
			"weight-avg": 1.8,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.225,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.6 ]
			}
		},
		"192": {
			"dex-index": "192",
			"name": "Sunflora",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-20"
			},
			"category": "Sun",
			"type": [ "Grass" ],
			"evolves-from": "191",
			"base-stamina": 181,
			"base-attack": 185,
			"base-defense": 135,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRA_LEAFSTORM"
			],
			"height-avg": 0.79,
			"weight-avg": 8.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 1.0625,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.58 ]
			}
		},
		"193": {
			"dex-index": "193",
			"name": "Yanma",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-09-20"
			},
			"category": "Clear Wing",
			"type": [ "Bug", "Flying" ],
			"evolves-into": [ "469" ],
			"base-stamina": 163,
			"base-attack": 154,
			"base-defense": 94,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FLY_AERIALACE",
				"CHRG_BUG_SILVERWIND"
			],
			"height-avg": 1.19,
			"weight-avg": 38,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 4.75,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.0825 ]
			}
		},
		"194": {
			"dex-index": "194",
			"name": "Wooper",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-12-11",
				"shadow": "2020-12-10"
			},
			"category": "Water Fish",
			"type": [ "Water", "Ground" ],
			"base-stamina": 146,
			"base-attack": 75,
			"base-defense": 66,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_GRO_MUDBOMB",
				"CHRG_GRO_DIG",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.41,
			"weight-avg": 8.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 1.0625,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"194-P": {
			"dex-index": "194-P",
			"name": "Paldean Wooper",
			"form-data": {
				"base": "194",
				"type": "Regional",
				"region": "Paldean"
			},
			"availability": {
				"in-game": "2023-11-05"
			},
			"category": "Poison Fish",
			"type": [ "Poison", "Ground" ],
			"base-stamina": 146,
			"base-attack": 75,
			"base-defense": 66,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_GRO_DIG",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.41,
			"weight-avg": 11,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 1.375,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"195": {
			"dex-index": "195",
			"name": "Quagsire",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-12-11",
				"shadow": "2020-12-10"
			},
			"category": "Water Fish",
			"type": [ "Water", "Ground" ],
			"base-stamina": 216,
			"base-attack": 152,
			"base-defense": 143,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_GRO_MUDBOMB"
			],
			"special-charged-moves": [
				"CHRG_WAT_AQUATAIL"
			],
			"height-avg": 1.4,
			"weight-avg": 75,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 9.375,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"196": {
			"dex-index": "196",
			"name": "Espeon",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-11"
			},
			"category": "Sun",
			"type": [ "Psychic" ],
			"evolves-from": "133",
			"base-stamina": 163,
			"base-attack": 261,
			"base-defense": 175,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_PSY_PSYCHICFANGS"
			],
			"special-charged-moves": [
				"CHRG_NOR_LASTRESORT",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 0.89,
			"weight-avg": 26.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 3.3125,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.3795 ]
			}
		},
		"197": {
			"dex-index": "197",
			"name": "Umbreon",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-11"
			},
			"category": "Moonlight",
			"type": [ "Dark" ],
			"evolves-from": "133",
			"base-stamina": 216,
			"base-attack": 126,
			"base-defense": 240,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_DAR_FOULPLAY"
			],
			"special-charged-moves": [
				"CHRG_NOR_LASTRESORT",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.99,
			"weight-avg": 27,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 3.375,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.5345 ]
			}
		},
		"198": {
			"dex-index": "198",
			"name": "Murkrow",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-03-31",
				"shadow": "2021-05-18",
				"shiny-shadow": "2023-03-25"
			},
			"category": "Darkness",
			"type": [ "Dark", "Flying" ],
			"evolves-into": [ "430" ],
			"base-stamina": 155,
			"base-attack": 175,
			"base-defense": 87,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_FLY_DRILLPECK",
				"CHRG_DAR_FOULPLAY",
				"CHRG_DAR_DARKPULSE"
			],
			"height-avg": 0.51,
			"weight-avg": 2.1,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.2625,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 1.02 ]
			}
		},
		"199": {
			"dex-index": "199",
			"name": "Slowking",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-11-17",
				"shadow": "2020-10-12"
			},
			"category": "Royal",
			"type": [ "Water", "Psychic" ],
			"evolves-from": "79",
			"base-stamina": 216,
			"base-attack": 177,
			"base-defense": 180,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_ICE_BLIZZARD",
				"CHRG_PSY_PSYCHIC",
				"CHRG_FIR_FIREBLAST",
				"CHRG_WAT_SCALD"
			],
			"special-charged-moves": [
				"CHRG_WAT_SURF"
			],
			"height-avg": 2.01,
			"weight-avg": 79.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 9.9375,
				"xxs": [ 0.9849, 1.005 ],
				"xs": [ 1.005, 1.5075 ],
				"m": [ 1.5075, 2.5125 ],
				"xl": [ 2.5125, 3.015 ],
				"xxl": [ 3.015, 3.1155 ]
			}
		},
		"199-G": {
			"dex-index": "199-G",
			"name": "Galarian Slowking",
			"form-data": {
				"base": "199",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2021-10-15",
				"shiny": "2023-03-18"
			},
			"category": "Hexpert",
			"type": [ "Poison", "Psychic" ],
			"evolves-from": "79-G",
			"base-stamina": 216,
			"base-attack": 190,
			"base-defense": 180,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_PSY_CONFUSION",
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_WAT_SCALD"
			],
			"special-charged-moves": [
				"CHRG_WAT_SURF"
			],
			"height-avg": 1.8,
			"weight-avg": 79.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 9.9375,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"200": {
			"dex-index": "200",
			"name": "Misdreavus",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-12-01",
				"shadow": "2019-11-07"
			},
			"category": "Screech",
			"type": [ "Ghost" ],
			"evolves-into": [ "429" ],
			"base-stamina": 155,
			"base-attack": 167,
			"base-defense": 154,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GHO_HEX",
				"FAST_PSY_PSYWAVE"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_DAR_DARKPULSE",
				"CHRG_GHO_OMINOUSWIND"
			],
			"height-avg": 0.71,
			"weight-avg": 1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 0.125,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"201": {
			"dex-index": "201",
			"name": "Unown",
			"availability": {
				"in-game": "2017-02-16"
			},
			"variants": [
				"A", "B", "C", "D", "E",
				"F", "G", "H", "I", "J",
				"K", "L", "M", "N", "O",
				"P", "Q", "R", "S", "T",
				"U", "V", "W", "X", "Y",
				"Z", "!", "?"
			],
			"category": "Symbol",
			"type": [ "Psychic" ],
			"base-stamina": 134,
			"base-attack": 136,
			"base-defense": 91,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.51,
			"weight-avg": 5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.625,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"202": {
			"dex-index": "202",
			"name": "Wobbuffet",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-03-22",
				"shadow": "2019-11-07"
			},
			"category": "Patient",
			"type": [ "Psychic" ],
			"evolves-from": "360",
			"base-stamina": 382,
			"base-attack": 60,
			"base-defense": 106,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_WAT_SPLASH",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_PSY_MIRRORCOAT"
			],
			"height-avg": 1.3,
			"weight-avg": 28.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 3.5625,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"203": {
			"dex-index": "203",
			"name": "Girafarig",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-26",
				"shadow": "2022-04-03"
			},
			"category": "Long Neck",
			"type": [ "Normal", "Psychic" ],
			"evolves-into": [ "981" ],
			"base-stamina": 172,
			"base-attack": 182,
			"base-defense": 133,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_PSY_CONFUSION",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_PSY_MIRRORCOAT",
				"CHRG_PSY_PSYCHICFANGS",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.5,
			"weight-avg": 41.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.1875,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"204": {
			"dex-index": "204",
			"name": "Pineco",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-20",
				"shadow": "2020-06-10",
				"shiny-shadow": "2020-07-10"
			},
			"category": "Bagworm",
			"type": [ "Bug" ],
			"evolves-into": [ "205" ],
			"base-stamina": 137,
			"base-attack": 108,
			"base-defense": 122,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_STE_GYROBALL",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_GRO_SANDTOMB"
			],
			"height-avg": 0.61,
			"weight-avg": 7.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.9,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"205": {
			"dex-index": "205",
			"name": "Forretress",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-20",
				"shadow": "2020-06-10",
				"shiny-shadow": "2020-07-10"
			},
			"category": "Bagworm",
			"type": [ "Bug", "Steel" ],
			"evolves-from": "204",
			"base-stamina": 181,
			"base-attack": 161,
			"base-defense": 205,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_BUG_STRUGGLEBUG",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_STE_HEAVYSLAM",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_GRO_SANDTOMB",
				"CHRG_STE_MIRRORSHOT"
			],
			"height-avg": 1.19,
			"weight-avg": 125.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 15.725,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.0825 ]
			}
		},
		"206": {
			"dex-index": "206",
			"name": "Dunsparce",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-05-08"
			},
			"category": "Land Snake",
			"type": [ "Normal" ],
			"evolves-into": [ "982-D", "982-T" ],
			"base-stamina": 225,
			"base-attack": 131,
			"base-defense": 128,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GHO_ASTONISH",
				"FAST_ROC_ROLLOUT"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_GRO_DRILLRUN"
			],
			"height-avg": 1.5,
			"weight-avg": 14,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 1.75,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"207": {
			"dex-index": "207",
			"name": "Gligar",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-09-02",
				"shadow": "2020-06-10",
				"shiny-shadow": "2021-11-09"
			},
			"category": "Fly Scorpion",
			"type": [ "Ground", "Flying" ],
			"evolves-into": [ "472" ],
			"base-stamina": 163,
			"base-attack": 143,
			"base-defense": 184,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_FLY_AERIALACE",
				"CHRG_DAR_NIGHTSLASH"
			],
			"height-avg": 1.09,
			"weight-avg": 64.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 8.1,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"208": {
			"dex-index": "208",
			"name": "Steelix",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-06-04",
				"shadow": "2022-11-14"
			},
			"category": "Iron Snake",
			"type": [ "Steel", "Ground" ],
			"evolves-from": "95",
			"base-stamina": 181,
			"base-attack": 148,
			"base-defense": 272,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_IRONTAIL",
				"FAST_DRA_DRAGONTAIL",
				"FAST_ELE_THUNDERFANG"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_STE_HEAVYSLAM",
				"CHRG_DAR_CRUNCH",
				"CHRG_PSY_PSYCHICFANGS",
				"CHRG_DRA_BREAKINGSWIPE"
			],
			"height-avg": 9.19,
			"weight-avg": 400,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 1.14875,
				"wt-std-dev": 50,
				"xxs": [ 4.5031, 4.595 ],
				"xs": [ 4.595, 6.8925 ],
				"m": [ 6.8925, 11.4875 ],
				"xl": [ 11.4875, 13.785 ],
				"xxl": [ 13.785, 16.0825 ]
			}
		},
		"208-M": {
			"dex-index": "208-M",
			"name": "Mega Steelix",
			"form-data": {
				"base": "208",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2021-12-01",
				"shiny": "2019-06-04",
				"shadow": false
			},
			"height-avg": 10.5,
			"weight-avg": 740,
			"base-stamina": 181,
			"base-attack": 212,
			"base-defense": 327,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 1.14875,
				"wt-std-dev": 50,
				"xxs": [ 5.145, 5.25 ],
				"xs": [ 5.25, 7.875 ],
				"m": [ 7.875, 13.125 ],
				"xl": [ 13.125, 15.75 ],
				"xxl": [ 15.75, 16.275 ]
			}
		},
		"209": {
			"dex-index": "209",
			"name": "Snubbull",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-01",
				"shadow": "2021-05-18"
			},
			"category": "Fairy",
			"type": [ "Fairy" ],
			"evolves-into": [ "210" ],
			"base-stamina": 155,
			"base-attack": 137,
			"base-defense": 85,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 0.61,
			"weight-avg": 7.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.975,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"210": {
			"dex-index": "210",
			"name": "Granbull",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-01",
				"shadow": "2021-05-18"
			},
			"category": "Fairy",
			"type": [ "Fairy" ],
			"evolves-from": "209",
			"base-stamina": 207,
			"base-attack": 212,
			"base-defense": 131,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_DAR_SNARL",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"height-avg": 1.4,
			"weight-avg": 48.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 6.0875,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"211": {
			"dex-index": "211",
			"name": "Qwilfish",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2024-02-16"
			},
			"category": "Balloon",
			"type": [ "Water", "Poison" ],
			"base-stamina": 163,
			"base-attack": 184,
			"base-defense": 138,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_AQUATAIL",
				"CHRG_ICE_ICEBEAM",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_BUG_FELLSTINGER",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 0.51,
			"weight-avg": 3.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.4875,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"211-H": {
			"dex-index": "211-H",
			"form-data": {
				"base": "211",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2022-07-27"
			},
			"type": [ "Dark", "Poison" ],
			"evolves-into": [ "904" ],
			"base-stamina": 163,
			"base-attack": 184,
			"base-defense": 151,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_WAT_AQUATAIL",
				"CHRG_ICE_ICEBEAM",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_DAR_DARKPULSE",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 0.51,
			"weight-avg": 3.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.4875,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"212": {
			"dex-index": "212",
			"name": "Scizor",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-04-02",
				"shadow": "2019-08-01",
				"shiny-shadow": "2019-11-07"
			},
			"category": "Pincer",
			"type": [ "Bug", "Steel" ],
			"evolves-from": "123",
			"base-stamina": 172,
			"base-attack": 236,
			"base-defense": 181,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_BULLETPUNCH",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_STE_IRONHEAD",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 2.01,
			"weight-avg": 125,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 15.625,
				"xxs": [ 0.9849, 1.005 ],
				"xs": [ 1.005, 1.5075 ],
				"m": [ 1.5075, 2.5125 ],
				"xl": [ 2.5125, 3.015 ],
				"xxl": [ 3.015, 3.1155 ]
			}
		},
		"212-M": {
			"dex-index": "212-M",
			"name": "Mega Scizor",
			"form-data": {
				"base": "212",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-08-10",
				"shiny": "2022-08-10",
				"shadow": false
			},
			"height-avg": 2,
			"weight-avg": 125,
			"base-stamina": 172,
			"base-attack": 279,
			"base-defense": 250,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 15.625,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"213": {
			"dex-index": "213",
			"name": "Shuckle",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-04-20",
				"shadow": "2020-06-10"
			},
			"category": "Mold",
			"type": [ "Bug", "Rock" ],
			"base-stamina": 85,
			"base-attack": 17,
			"base-defense": 396,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_STONEEDGE",
				"CHRG_STE_GYROBALL"
			],
			"height-avg": 0.61,
			"weight-avg": 20.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 2.5625,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"214": {
			"dex-index": "214",
			"name": "Heracross",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2021-08-06"
			},
			"category": "Single Horn",
			"type": [ "Bug", "Fighting" ],
			"base-stamina": 190,
			"base-attack": 234,
			"base-defense": 179,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_BUG_MEGAHORN",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_ROCKBLAST"
			],
			"height-avg": 1.5,
			"weight-avg": 54,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 6.75,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"214-M": {
			"dex-index": "214-M",
			"name": "Mega Heracross",
			"form-data": {
				"base": "214",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2024-04-13",
				"shiny": "2024-04-13",
				"shadow": false
			},
			"height-avg": 1.7,
			"weight-avg": 62.5,
			"base-stamina": 190,
			"base-attack": 334,
			"base-defense": 223,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 6.75,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"215": {
			"dex-index": "215",
			"name": "Sneasel",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2023-12-05",
				"shadow": "2019-11-05",
				"shiny-shadow": "2019-11-07"
			},
			"category": "Sharp Claw",
			"type": [ "Dark", "Ice" ],
			"evolves-into": [ "461" ],
			"base-stamina": 146,
			"base-attack": 189,
			"base-defense": 146,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_ICESHARD",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_ICE_AVALANCHE",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_DAR_FOULPLAY",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"height-avg": 0.89,
			"weight-avg": 28,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 3.5,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.5575 ]
			}
		},
		"215-H": {
			"dex-index": "215-H",
			"form-data": {
				"base": "215",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2022-07-27",
				"shadow": "2023-10-26"
			},
			"type": [ "Fighting", "Poison" ],
			"evolves-into": [ "903" ],
			"base-stamina": 146,
			"base-attack": 189,
			"base-defense": 146,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_BUG_XSCISSOR"
			],
			"height-avg": 0.9,
			"weight-avg": 27,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 3.375,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"216": {
			"dex-index": "216",
			"name": "Teddiursa",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-03-29",
				"shadow": "2020-10-12",
				"shiny-shadow": "2022-01-24"
			},
			"category": "Little Bear",
			"type": [ "Normal" ],
			"evolves-into": [ "217" ],
			"base-stamina": 155,
			"base-attack": 142,
			"base-defense": 93,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_GHO_LICK"
			],
			"charged-moves": [
				"CHRG_FIG_CROSSCHOP",
				"CHRG_DAR_CRUNCH",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRA_TRAILBLAZE",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 0.61,
			"weight-avg": 8.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.1,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"217": {
			"dex-index": "217",
			"name": "Ursaring",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-03-29",
				"shadow": "2020-10-12",
				"shiny-shadow": "2022-01-24"
			},
			"category": "Hibernator",
			"type": [ "Normal" ],
			"evolves-from": "216",
			"evolves-into": [ "901" ],
			"base-stamina": 207,
			"base-attack": 236,
			"base-defense": 144,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_FIG_COUNTER",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRA_TRAILBLAZE",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 1.8,
			"weight-avg": 125.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 15.725,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"218": {
			"dex-index": "218",
			"name": "Slugma",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-01-07"
			},
			"category": "Lava",
			"type": [ "Fire" ],
			"evolves-into": [ "219" ],
			"base-stamina": 120,
			"base-attack": 118,
			"base-defense": 71,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMEBURST",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 0.71,
			"weight-avg": 35,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 4.375,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"219": {
			"dex-index": "219",
			"name": "Magcargo",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-01-07"
			},
			"category": "Lava",
			"type": [ "Fire", "Rock" ],
			"evolves-from": "218",
			"base-stamina": 137,
			"base-attack": 139,
			"base-defense": 191,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_ROC_ROCKTHROW",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIR_OVERHEAT",
				"CHRG_ROC_STONEEDGE",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.79,
			"weight-avg": 55,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 6.875,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"220": {
			"dex-index": "220",
			"name": "Swinub",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-02-16",
				"shadow": "2021-02-02"
			},
			"category": "Pig",
			"type": [ "Ice", "Ground" ],
			"evolves-into": [ "221" ],
			"base-stamina": 137,
			"base-attack": 90,
			"base-defense": 69,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_ICE_ICYWIND",
				"CHRG_NOR_BODYSLAM",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 0.41,
			"weight-avg": 6.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.8125,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"221": {
			"dex-index": "221",
			"name": "Piloswine",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-02-16",
				"shadow": "2021-02-02"
			},
			"category": "Swine",
			"type": [ "Ice", "Ground" ],
			"evolves-from": "220",
			"evolves-into": [ "473" ],
			"base-stamina": 225,
			"base-attack": 181,
			"base-defense": 138,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_ICESHARD",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_ICE_AVALANCHE",
				"CHRG_GRO_BULLDOZE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_GRO_HIGHHORSEPOWER"
			],
			"height-avg": 1.09,
			"weight-avg": 55.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 6.975,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"222": {
			"dex-index": "222",
			"name": "Corsola",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-26"
			},
			"category": "Coral",
			"type": [ "Water", "Rock" ],
			"evolves-into": [ "864" ],
			"base-stamina": 146,
			"base-attack": 118,
			"base-defense": 156,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_POWERGEM",
				"CHRG_WAT_BUBBLEBEAM"
			],
			"height-avg": 0.61,
			"weight-avg": 5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.625,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.22 ]
			}
		},
		"222-G": {
			"dex-index": "222-G",
			"name": "Galarian Corsola",
			"form-data": {
				"base": "222",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2024-11-27",
				"shiny": "2024-11-27"
			},
			"type": [ "Ghost" ],
			"base-stamina": 155,
			"base-attack": 116,
			"base-defense": 182,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_POWERGEM",
				"CHRG_GHO_NIGHTSHADE"
			],
			"height-avg": 0.61,
			"weight-avg": 0.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.0625,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.22 ]
			}
		},
		"223": {
			"dex-index": "223",
			"name": "Remoraid",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-26"
			},
			"category": "Jet",
			"type": [ "Water" ],
			"evolves-into": [ "224" ],
			"base-stamina": 111,
			"base-attack": 127,
			"base-defense": 69,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_ICE_AURORABEAM",
				"CHRG_WAT_WATERPULSE",
				"CHRG_ROC_ROCKBLAST"
			],
			"height-avg": 0.61,
			"weight-avg": 12,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.5,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"224": {
			"dex-index": "224",
			"name": "Octillery",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-26"
			},
			"category": "Jet",
			"type": [ "Water" ],
			"evolves-from": "223",
			"base-stamina": 181,
			"base-attack": 197,
			"base-defense": 141,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSHOT",
				"FAST_NOR_LOCKON"
			],
			"charged-moves": [
				"CHRG_POI_GUNKSHOT",
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_AURORABEAM",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_WAT_OCTAZOOKA"
			],
			"height-avg": 0.89,
			"weight-avg": 28.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 3.5625,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.78 ]
			}
		},
		"225": {
			"dex-index": "225",
			"name": "Delibird",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-12-18",
				"shadow": "2019-12-24"
			},
			"category": "Delivery",
			"type": [ "Ice", "Flying" ],
			"base-stamina": 128,
			"base-attack": 128,
			"base-defense": 90,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_PRESENT"
			],
			"unobtainable-fast-moves": [
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_ICE_ICEPUNCH",
				"CHRG_ICE_ICYWIND",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_FLY",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"height-avg": 0.89,
			"weight-avg": 16,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 2,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.5575 ]
			}
		},
		"226": {
			"dex-index": "226",
			"name": "Mantine",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-26"
			},
			"category": "Kite",
			"type": [ "Water", "Flying" ],
			"evolves-from": "458",
			"base-stamina": 163,
			"base-attack": 148,
			"base-defense": 226,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_FLY_WINGATTACK",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_ICEBEAM",
				"CHRG_FLY_AERIALACE",
				"CHRG_WAT_BUBBLEBEAM"
			],
			"height-avg": 2.11,
			"weight-avg": 220,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.26375,
				"wt-std-dev": 27.5,
				"xxs": [ 1.0339, 1.055 ],
				"xs": [ 1.055, 1.5825 ],
				"m": [ 1.5825, 2.6375 ],
				"xl": [ 2.6375, 3.165 ],
				"xxl": [ 3.165, 4.22 ]
			}
		},
		"227": {
			"dex-index": "227",
			"name": "Skarmory",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-11-01",
				"shadow": "2020-10-12"
			},
			"category": "Armor Bird",
			"type": [ "Steel", "Flying" ],
			"base-stamina": 163,
			"base-attack": 148,
			"base-defense": 226,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_STEELWING",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FLY_SKYATTACK",
				"CHRG_STE_FLASHCANNON"
			],
			"height-avg": 1.7,
			"weight-avg": 50.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 6.3125,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 3.4 ]
			}
		},
		"228": {
			"dex-index": "228",
			"name": "Houndour",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-01",
				"shadow": "2019-08-01"
			},
			"category": "Dark",
			"type": [ "Dark", "Fire" ],
			"evolves-into": [ "229" ],
			"base-stamina": 128,
			"base-attack": 152,
			"base-defense": 83,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_DAR_DARKPULSE"
			],
			"height-avg": 0.61,
			"weight-avg": 10.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.35,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"229": {
			"dex-index": "229",
			"name": "Houndoom",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-08-01",
				"shadow": "2019-08-01"
			},
			"category": "Dark",
			"type": [ "Dark", "Fire" ],
			"evolves-from": "228",
			"base-stamina": 181,
			"base-attack": 224,
			"base-defense": 144,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_FIR_FIREFANG"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_FIREBLAST",
				"CHRG_DAR_FOULPLAY",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 1.4,
			"weight-avg": 35,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 4.375,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"229-M": {
			"dex-index": "229-M",
			"name": "Mega Houndoom",
			"form-data": {
				"base": "229",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2020-09-29",
				"shiny": "2020-09-29",
				"shadow": false
			},
			"height-avg": 1.9,
			"weight-avg": 49.5,
			"base-stamina": 181,
			"base-attack": 289,
			"base-defense": 194,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 4.375,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"230": {
			"dex-index": "230",
			"name": "Kingdra",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-06-13",
				"shadow": "2021-05-18"
			},
			"category": "Dragon",
			"type": [ "Water", "Dragon" ],
			"evolves-from": "117",
			"base-stamina": 181,
			"base-attack": 194,
			"base-defense": 194,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_DRA_DRAGONBREATH"
			],
			"special-fast-moves": [
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_BLIZZARD",
				"CHRG_DRA_OUTRAGE",
				"CHRG_WAT_OCTAZOOKA"
			],
			"height-avg": 1.8,
			"weight-avg": 152,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 19,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"231": {
			"dex-index": "231",
			"name": "Phanpy",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-26",
				"shadow": "2023-03-25"
			},
			"category": "Long Nose",
			"type": [ "Ground" ],
			"evolves-into": [ "232" ],
			"base-stamina": 207,
			"base-attack": 107,
			"base-defense": 98,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_GRO_BULLDOZE",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_NOR_BODYSLAM",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.51,
			"weight-avg": 33.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 4.1875,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 1.02 ]
			}
		},
		"232": {
			"dex-index": "232",
			"name": "Donphan",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-26",
				"shadow": "2023-03-25"
			},
			"category": "Armor",
			"type": [ "Ground" ],
			"evolves-from": "231",
			"base-stamina": 207,
			"base-attack": 214,
			"base-defense": 185,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIG_COUNTER",
				"FAST_GRO_MUDSLAP",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_STE_HEAVYSLAM",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_NOR_BODYSLAM",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.09,
			"weight-avg": 120,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 15,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 2.18 ]
			}
		},
		"233": {
			"dex-index": "233",
			"name": "Porygon2",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-09-20",
				"shadow": "2019-11-07"
			},
			"category": "Virtual",
			"type": [ "Normal" ],
			"evolves-from": "137",
			"evolves-into": [ "474" ],
			"base-stamina": 198,
			"base-attack": 198,
			"base-defense": 180,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER",
				"FAST_ELE_CHARGEBEAM",
				"FAST_NOR_LOCKON"
			],
			"charged-moves": [
				"CHRG_GRA_SOLARBEAM",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_ELE_ZAPCANNON",
				"CHRG_NOR_TRIATTACK"
			],
			"height-avg": 0.61,
			"weight-avg": 32.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 4.0625,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.22 ]
			}
		},
		"234": {
			"dex-index": "234",
			"name": "Stantler",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2019-12-24",
				"shadow": "2019-12-24",
				"shiny-shadow": "2020-01-02"
			},
			"category": "Big Horn",
			"type": [ "Normal" ],
			"evolves-into": [ "899" ],
			"base-stamina": 177,
			"base-attack": 192,
			"base-defense": 131,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_BUG_MEGAHORN"
			],
			"height-avg": 1.4,
			"weight-avg": 71.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 8.9,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"235": {
			"dex-index": "235",
			"name": "Smeargle",
			"availability": {
				"in-game": "2019-02-25",
				"shiny": "2021-04-29"
			},
			"category": "Painter",
			"type": [ "Normal" ],
			"base-stamina": 146,
			"base-attack": 40,
			"base-defense": 83,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 7.25,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.0825 ]
			}
		},
		"236": {
			"dex-index": "236",
			"name": "Tyrogue",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-26"
			},
			"category": "Scuffle",
			"type": [ "Fighting" ],
			"evolves-into": [ "106", "107", "237" ],
			"base-stamina": 111,
			"base-attack": 64,
			"base-defense": 64,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_FIG_LOWSWEEP"
			],
			"height-avg": 0.71,
			"weight-avg": 21,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 2.625,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"237": {
			"dex-index": "237",
			"name": "Hitmontop",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2022-02-26",
				"shadow": "2023-06-21"
			},
			"category": "Handstand",
			"type": [ "Fighting" ],
			"evolves-from": "236",
			"base-stamina": 137,
			"base-attack": 173,
			"base-defense": 207,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_STE_GYROBALL",
				"CHRG_ROC_STONEEDGE",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"height-avg": 1.4,
			"weight-avg": 48,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 6,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"238": {
			"dex-index": "238",
			"name": "Smoochum",
			"availability": {
				"in-game": "2016-12-12",
				"shiny": "2019-02-13"
			},
			"category": "Kiss",
			"type": [ "Ice", "Psychic" ],
			"evolves-into": [ "124" ],
			"base-stamina": 128,
			"base-attack": 153,
			"base-defense": 91,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_NOR_POUND"
			],
			"special-fast-moves": [
				"FAST_ICE_FROSTBREATH"
			],
			"charged-moves": [
				"CHRG_ICE_ICEBEAM",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 0.41,
			"weight-avg": 6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.75,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"239": {
			"dex-index": "239",
			"name": "Elekid",
			"availability": {
				"in-game": "2016-12-12",
				"shiny": "2018-11-14"
			},
			"category": "Electric",
			"type": [ "Electric" ],
			"evolves-into": [ "125" ],
			"base-stamina": 128,
			"base-attack": 135,
			"base-defense": 101,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_FIG_LOWKICK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_ELE_DISCHARGE"
			],
			"special-charged-moves": [
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.61,
			"weight-avg": 23.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 2.9375,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"240": {
			"dex-index": "240",
			"name": "Magby",
			"availability": {
				"in-game": "2016-12-12",
				"shiny": "2018-03-22"
			},
			"category": "Live Coal",
			"type": [ "Fire" ],
			"evolves-into": [ "126" ],
			"base-stamina": 128,
			"base-attack": 151,
			"base-defense": 99,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIG_KARATECHOP"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIR_FIREPUNCH",
				"CHRG_FIR_FLAMEBURST"
			],
			"special-charged-moves": [
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.71,
			"weight-avg": 21.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 2.675,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"241": {
			"dex-index": "241",
			"name": "Miltank",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2021-01-26"
			},
			"category": "Milk Cow",
			"type": [ "Normal" ],
			"base-stamina": 216,
			"base-attack": 157,
			"base-defense": 193,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ROC_ROLLOUT"
			],
			"charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_NOR_BODYSLAM",
				"CHRG_STE_GYROBALL",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ICE_ICEBEAM"
			],
			"height-avg": 1.19,
			"weight-avg": 75.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 9.4375,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.0825 ]
			}
		},
		"242": {
			"dex-index": "242",
			"name": "Blissey",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2020-02-14"
			},
			"category": "Happiness",
			"type": [ "Normal" ],
			"evolves-from": "113",
			"base-stamina": 496,
			"base-attack": 129,
			"base-defense": 169,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FAI_DAZZLINGGLEAM"
			],
			"special-charged-moves": [
				"CHRG_ELE_WILDCHARGE"
			],
			"height-avg": 1.5,
			"weight-avg": 46.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.85,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"243": {
			"dex-index": "243",
			"name": "Raikou",
			"availability": {
				"in-game": "2017-08-31",
				"shiny": "2019-06-29",
				"shadow": "2020-02-01",
				"shiny-shadow": "2024-03-02"
			},
			"category": "Thunder",
			"type": [ "Electric" ],
			"base-stamina": 207,
			"base-attack": 241,
			"base-defense": 195,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDER",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 1.91,
			"weight-avg": 178,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.23875,
				"wt-std-dev": 22.25,
				"xxs": [ 0.9359, 0.955 ],
				"xs": [ 0.955, 1.4325 ],
				"m": [ 1.4325, 2.3875 ],
				"xl": [ 2.3875, 2.865 ],
				"xxl": [ 2.865, 3.3425 ]
			}
		},
		"244": {
			"dex-index": "244",
			"name": "Entei",
			"availability": {
				"in-game": "2017-08-31",
				"shiny": "2019-07-14",
				"shadow": "2020-03-01",
				"shiny-shadow": "2024-04-06"
			},
			"category": "Volcano",
			"type": [ "Fire" ],
			"base-stamina": 251,
			"base-attack": 235,
			"base-defense": 171,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_FIR_FIREFANG"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_OVERHEAT",
				"CHRG_STE_IRONHEAD",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 2.11,
			"weight-avg": 198,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.26375,
				"wt-std-dev": 24.75,
				"xxs": [ 1.0339, 1.055 ],
				"xs": [ 1.055, 1.5825 ],
				"m": [ 1.5825, 2.6375 ],
				"xl": [ 2.6375, 3.165 ],
				"xxl": [ 3.165, 3.6925 ]
			}
		},
		"245": {
			"dex-index": "245",
			"name": "Suicune",
			"availability": {
				"in-game": "2017-08-31",
				"shiny": "2019-08-17",
				"shadow": "2020-06-10",
				"shiny-shadow": "2024-05-04"
			},
			"category": "Aurora",
			"type": [ "Water" ],
			"base-stamina": 225,
			"base-attack": 180,
			"base-defense": 235,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_EXTRASENSORY",
				"FAST_DAR_SNARL",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 2.01,
			"weight-avg": 187,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 23.375,
				"xxs": [ 0.9849, 1.005 ],
				"xs": [ 1.005, 1.5075 ],
				"m": [ 1.5075, 2.5125 ],
				"xl": [ 2.5125, 3.015 ],
				"xxl": [ 3.015, 3.5175 ]
			}
		},
		"246": {
			"dex-index": "246",
			"name": "Larvitar",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-06-16",
				"shadow": "2019-09-05",
				"shiny-shadow": "2023-03-25"
			},
			"category": "Rock Skin",
			"type": [ "Rock", "Ground" ],
			"evolves-into": [ "247" ],
			"base-stamina": 137,
			"base-attack": 115,
			"base-defense": 93,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_DAR_CRUNCH",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 0.61,
			"weight-avg": 72,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 9,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"247": {
			"dex-index": "247",
			"name": "Pupitar",
			"availability": {
				"in-game": "2017-02-16",
				"shiny": "2018-06-16",
				"shadow": "2019-09-05",
				"shiny-shadow": "2023-03-25"
			},
			"category": "Hard Shell",
			"type": [ "Rock", "Ground" ],
			"evolves-from": "246",
			"evolves-into": [ "248" ],
			"base-stamina": 172,
			"base-attack": 155,
			"base-defense": 133,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_DAR_CRUNCH",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 1.19,
			"weight-avg": 152,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 19,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.0825 ]
			}
		},
		"248": {
			"dex-index": "248",
			"name": "Tyranitar",
			"availability": {
				"in-game": "2017-02-1166",
				"shiny": "2018-06-16",
				"shadow": "2019-09-05",
				"shiny-shadow": "2023-03-25"
			},
			"category": "Armor",
			"type": [ "Rock", "Dark" ],
			"evolves-from": "247",
			"base-stamina": 225,
			"base-attack": 251,
			"base-defense": 207,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_STE_IRONTAIL"
			],
			"special-fast-moves": [
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_DAR_CRUNCH",
				"CHRG_ROC_STONEEDGE",
				"CHRG_DAR_BRUTALSWING"
			],
			"height-avg": 2.01,
			"weight-avg": 202,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 25.25,
				"xxs": [ 0.9849, 1.005 ],
				"xs": [ 1.005, 1.5075 ],
				"m": [ 1.5075, 2.5125 ],
				"xl": [ 2.5125, 3.015 ],
				"xxl": [ 3.015, 4.02 ]
			}
		},
		"248-M": {
			"dex-index": "248-M",
			"name": "Mega Tyranitar",
			"form-data": {
				"base": "248",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-07-25",
				"shiny": "2023-07-25",
				"shadow": false
			},
			"height-avg": 2.5,
			"weight-avg": 255,
			"base-stamina": 225,
			"base-attack": 309,
			"base-defense": 276,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 25.25,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 5 ]
			}
		},
		"249": {
			"dex-index": "249",
			"name": "Lugia",
			"availability": {
				"in-game": "2017-07-22",
				"shiny": "2018-03-16",
				"shadow": "2021-11-09",
				"shiny-shadow": "2023-10-28"
			},
			"category": "Diving",
			"type": [ "Psychic", "Flying" ],
			"base-stamina": 235,
			"base-attack": 193,
			"base-defense": 310,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_EXTRASENSORY",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_FLY_SKYATTACK",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_PSY_FUTURESIGHT"
			],
			"special-charged-moves": [
				"CHRG_FLY_AEROBLAST"
			],
			"height-avg": 5.21,
			"weight-avg": 216,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.65125,
				"wt-std-dev": 27,
				"xxs": [ 2.5529, 2.605 ],
				"xs": [ 2.605, 3.9075 ],
				"m": [ 3.9075, 6.5125 ],
				"xl": [ 6.5125, 7.815 ],
				"xxl": [ 7.815, 9.1175 ]
			}
		},
		"249-A": {
			"dex-index": "249-A",
			"name": "Apex Lugia",
			"form-details": {
				"base": "249",
				"type": "Apex"
			},
			"availability": {
				"in-game": "2022-02-26",
				"shadow": "2022-03-26"
			},
			"special-charged-moves": [
				"CHRG_FLY_AEROBLASTPLUS"
			],
			"unobtainable-charged-moves": [
				"CHRG_FLY_AEROBLASTPLUSPLUS"
			]
		},
		"250": {
			"dex-index": "250",
			"name": "Ho-oh",
			"availability": {
				"in-game": "2017-11-28",
				"shiny": "2018-05-19",
				"shadow": "2021-06-17",
				"shiny-shadow": "2024-01-27"
			},
			"category": "Rainbow",
			"type": [ "Fire", "Flying" ],
			"base-stamina": 214,
			"base-attack": 239,
			"base-defense": 244,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_EXTRASENSORY",
				"FAST_STE_STEELWING",
				"FAST_WAT_HIDDENPOWER",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FIR_FIREBLAST",
				"CHRG_GRA_SOLARBEAM"
			],
			"special-charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_FIR_SACREDFIRE"
			],
			"unobtainable-charged-moves": [
				"CHRG_FIR_SACREDFIREPLUSPLUS"
			],
			"height-avg": 3.81,
			"weight-avg": 199,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.47625,
				"wt-std-dev": 24.875,
				"xxs": [ 1.8669, 1.905 ],
				"xs": [ 1.905, 2.8575 ],
				"m": [ 2.8575, 4.7625 ],
				"xl": [ 4.7625, 5.715 ],
				"xxl": [ 5.715, 6.6675 ]
			}
		},
		"250-A": {
			"dex-index": "250-A",
			"name": "Apex Ho-oh",
			"form-details": {
				"base": "250",
				"type": "Apex"
			},
			"availability": {
				"in-game": "2022-02-26",
				"shadow": "2022-02-26"
			},
			"special-charged-moves": [
				"CHRG_FIR_SACREDFIREPLUS"
			],
			"unobtainable-charged-moves": [
				"CHRG_FIR_SACREDFIREPLUSPLUS"
			]
		},
		"251": {
			"dex-index": "251",
			"name": "Celebi",
			"availability": {
				"in-game": "2018-07-14",
				"shiny": "2020-12-14"
			},
			"category": "Time Travel",
			"type": [ "Psychic", "Grass" ],
			"base-stamina": 225,
			"base-attack": 210,
			"base-defense": 210,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_ELE_CHARGEBEAM"
			],
			"special-fast-moves": [
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GRA_LEAFSTORM"
			],
			"height-avg": 0.61,
			"weight-avg": 5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.625,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"252": {
			"dex-index": "252",
			"name": "Treecko",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-03-23",
				"shadow": "2023-03-25"
			},
			"category": "Wood Gecko",
			"type": [ "Grass" ],
			"evolves-into": [ "253" ],
			"base-stamina": 120,
			"base-attack": 124,
			"base-defense": 94,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FLY_AERIALACE",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.51,
			"weight-avg": 5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.625,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.7905 ]
			}
		},
		"253": {
			"dex-index": "253",
			"name": "Grovyle",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-03-23",
				"shadow": "2023-03-25"
			},
			"category": "Wood Gecko",
			"type": [ "Grass" ],
			"evolves-from": "252",
			"evolves-into": [ "254" ],
			"base-stamina": 137,
			"base-attack": 172,
			"base-defense": 120,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_FLY_AERIALACE",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.89,
			"weight-avg": 21.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 2.7,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.3795 ]
			}
		},
		"254": {
			"dex-index": "254",
			"name": "Sceptile",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-03-23",
				"shadow": "2023-03-25"
			},
			"category": "Forest",
			"type": [ "Grass" ],
			"evolves-from": "253",
			"base-stamina": 172,
			"base-attack": 223,
			"base-defense": 169,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_FLY_AERIALACE",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_DRA_BREAKINGSWIPE"
			],
			"special-charged-moves": [
				"CHRG_GRA_FRENZYPLANT"
			],
			"height-avg": 1.7,
			"weight-avg": 52.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 6.525,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"254-M": {
			"dex-index": "254-M",
			"name": "Mega Sceptile",
			"form-data": {
				"base": "254",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-12-03",
				"shiny": "2022-12-03",
				"shadow": false
			},
			"type": [ "Grass", "Dragon" ],
			"height-avg": 1.9,
			"weight-avg": 55.2,
			"base-stamina": 172,
			"base-attack": 320,
			"base-defense": 186,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 6.525,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"255": {
			"dex-index": "255",
			"name": "Torchic",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-05-19",
				"shadow": "2023-03-25"
			},
			"category": "Chick",
			"type": [ "Fire" ],
			"evolves-into": [ "256" ],
			"base-stamina": 128,
			"base-attack": 130,
			"base-defense": 87,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.41,
			"weight-avg": 2.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.3125,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.6355 ]
			}
		},
		"256": {
			"dex-index": "256",
			"name": "Combusken",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-05-19",
				"shadow": "2023-03-25"
			},
			"category": "Young Fowl",
			"type": [ "Fire", "Fighting" ],
			"evolves-from": "255",
			"evolves-into": [ "257" ],
			"base-stamina": 155,
			"base-attack": 163,
			"base-defense": 115,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 0.89,
			"weight-avg": 19.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 2.4375,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.3795 ]
			}
		},
		"257": {
			"dex-index": "257",
			"name": "Blaziken",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-05-19",
				"shadow": "2023-03-25"
			},
			"category": "Blaze",
			"type": [ "Fire", "Fighting" ],
			"evolves-from": "256",
			"base-stamina": 190,
			"base-attack": 240,
			"base-defense": 141,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_FIR_FIRESPIN"
			],
			"charged-moves": [
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_FIR_OVERHEAT",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FIR_BLAZEKICK"
			],
			"special-charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_FIR_BLASTBURN"
			],
			"height-avg": 1.91,
			"weight-avg": 52,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.23875,
				"wt-std-dev": 6.5,
				"xxs": [ 0.9359, 0.955 ],
				"xs": [ 0.955, 1.4325 ],
				"m": [ 1.4325, 2.3875 ],
				"xl": [ 2.3875, 2.865 ],
				"xxl": [ 2.865, 2.9605 ]
			}
		},
		"257-M": {
			"dex-index": "257-M",
			"name": "Mega Blaziken",
			"form-data": {
				"base": "254",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-12-03",
				"shiny": "2022-12-03",
				"shadow": false
			},
			"height-avg": 1.9,
			"weight-avg": 52,
			"base-stamina": 190,
			"base-attack": 329,
			"base-defense": 168,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.23875,
				"wt-std-dev": 6.5,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"258": {
			"dex-index": "258",
			"name": "Mudkip",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-07-21",
				"shadow": "2019-07-22"
			},
			"category": "Mud Fish",
			"type": [ "Water" ],
			"evolves-into": [ "259" ],
			"base-stamina": 137,
			"base-attack": 126,
			"base-defense": 93,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_POI_SLUDGE",
				"CHRG_NOR_STOMP"
			],
			"height-avg": 0.41,
			"weight-avg": 7.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.95,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.6355 ]
			}
		},
		"259": {
			"dex-index": "259",
			"name": "Marshtomp",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-07-21",
				"shadow": "2019-07-22"
			},
			"category": "Mud Fish",
			"type": [ "Water", "Ground" ],
			"evolves-from": "258",
			"evolves-into": [ "260" ],
			"base-stamina": 172,
			"base-attack": 156,
			"base-defense": 133,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_GRO_MUDBOMB",
				"CHRG_POI_SLUDGE",
				"CHRG_WAT_SURF"
			],
			"height-avg": 0.71,
			"weight-avg": 28,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 3.5,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.1005 ]
			}
		},
		"260": {
			"dex-index": "260",
			"name": "Swampert",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-07-21",
				"shadow": "2019-07-22"
			},
			"category": "Mud Fish",
			"type": [ "Water", "Ground" ],
			"evolves-from": "259",
			"base-stamina": 225,
			"base-attack": 208,
			"base-defense": 175,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_WAT_SURF",
				"CHRG_WAT_MUDDYWATER"
			],
			"special-charged-moves": [
				"CHRG_WAT_HYDROCANNON"
			],
			"height-avg": 1.5,
			"weight-avg": 81.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 10.2375,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"260-M": {
			"dex-index": "260-M",
			"name": "Mega Swampert",
			"form-data": {
				"base": "254",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-12-03",
				"shiny": "2022-12-03",
				"shadow": false
			},
			"height-avg": 1.9,
			"weight-avg": 102,
			"base-stamina": 225,
			"base-attack": 283,
			"base-defense": 218,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 10.2375,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"261": {
			"dex-index": "261",
			"name": "Poochyena",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-02-15",
				"shadow": "2021-05-18"
			},
			"category": "Bite",
			"type": [ "Dark" ],
			"evolves-into": [ "262" ],
			"base-stamina": 111,
			"base-attack": 96,
			"base-defense": 61,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_GRO_DIG",
				"CHRG_POI_POISONFANG"
			],
			"height-avg": 0.51,
			"weight-avg": 13.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 1.7,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"262": {
			"dex-index": "262",
			"name": "Mightyena",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-02-15",
				"shadow": "2021-05-18"
			},
			"category": "Bite",
			"type": [ "Dark" ],
			"evolves-from": "261",
			"base-stamina": 172,
			"base-attack": 171,
			"base-defense": 132,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_FIR_FIREFANG",
				"FAST_ELE_THUNDERFANG",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_POI_POISONFANG"
			],
			"height-avg": 0.99,
			"weight-avg": 37,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 4.625,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.7325 ]
			}
		},
		"263": {
			"dex-index": "263",
			"name": "Zigzagoon",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-01-15"
			},
			"category": "Tiny Raccoon",
			"type": [ "Normal" ],
			"evolves-into": [ "264" ],
			"base-stamina": 116,
			"base-attack": 58,
			"base-defense": 80,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIG_ROCKSMASH",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.4,
			"weight-avg": 17.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 2.1875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"263-G": {
			"dex-index": "263-G",
			"name": "Galarian Zigzagoon",
			"form-data": {
				"base": "263",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-06-03",
				"shiny": "2021-05-25",
				"shadow": "2024-10-08",
				"shiny-shadow": "2024-10-08"
			},
			"type": [ "Dark", "Normal" ],
			"evolves-into": [ "264-G" ],
			"base-stamina": 116,
			"base-attack": 58,
			"base-defense": 80,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_NOR_BODYSLAM",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 0.4,
			"weight-avg": 17.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 2.1875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"264": {
			"dex-index": "264",
			"name": "Linoone",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-01-15"
			},
			"category": "Rushing",
			"type": [ "Normal" ],
			"evolves-from": "263",
			"base-stamina": 186,
			"base-attack": 142,
			"base-defense": 128,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GHO_SHADOWCLAW",
				"FAST_NOR_TACKLE",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 0.5,
			"weight-avg": 32.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 4.0625,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"264-G": {
			"dex-index": "264-G",
			"name": "Galarian Linoone",
			"form-data": {
				"base": "264",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-06-03",
				"shiny": "2021-05-25",
				"shadow": "2024-10-08",
				"shiny-shadow": "2024-10-08"
			},
			"type": [ "Dark", "Normal" ],
			"evolves-from": "263-G",
			"evolves-into": [ "862" ],
			"base-stamina": 186,
			"base-attack": 142,
			"base-defense": 128,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_GHO_LICK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_NOR_BODYSLAM",
				"CHRG_POI_GUNKSHOT"
			],
			"height-avg": 0.5,
			"weight-avg": 32.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 4.0625,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"265": {
			"dex-index": "265",
			"name": "Wurmple",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-01-16"
			},
			"category": "Worm",
			"type": [ "Bug" ],
			"evolves-into": [ "266", "268" ],
			"base-stamina": 128,
			"base-attack": 75,
			"base-defense": 59,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.3,
			"weight-avg": 3.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.45,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"266": {
			"dex-index": "266",
			"name": "Silcoon",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-01-16"
			},
			"category": "Cocoon",
			"type": [ "Bug" ],
			"evolves-from": "265",
			"evolves-into": [ "267" ],
			"base-stamina": 137,
			"base-attack": 60,
			"base-defense": 77,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.61,
			"weight-avg": 10,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.25,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"267": {
			"dex-index": "267",
			"name": "Beautifly",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-01-16"
			},
			"category": "Butterfly",
			"type": [ "Bug", "Flying" ],
			"evolves-from": "266",
			"base-stamina": 155,
			"base-attack": 189,
			"base-defense": 98,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_BUG_INFESTATION"
			],
			"charged-moves": [
				"CHRG_BUG_SILVERWIND",
				"CHRG_FLY_AIRCUTTER",
				"CHRG_BUG_BUGBUZZ"
			],
			"height-avg": 0.99,
			"weight-avg": 28.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 3.55,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.7325 ]
			}
		},
		"268": {
			"dex-index": "268",
			"name": "Cascoon",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-01-16"
			},
			"category": "Cocoon",
			"type": [ "Bug" ],
			"evolves-from": "265",
			"evolves-into": [ "269" ],
			"base-stamina": 137,
			"base-attack": 60,
			"base-defense": 77,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.71,
			"weight-avg": 11.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 1.4375,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"269": {
			"dex-index": "269",
			"name": "Dustox",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-01-16"
			},
			"category": "Poison Moth",
			"type": [ "Bug", "Poison" ],
			"evolves-from": "268",
			"base-stamina": 155,
			"base-attack": 98,
			"base-defense": 162,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_BUG_SILVERWIND",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_BUG_BUGBUZZ"
			],
			"height-avg": 1.19,
			"weight-avg": 31.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 3.95,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.0825 ]
			}
		},
		"270": {
			"dex-index": "270",
			"name": "Lotad",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-03-30"
			},
			"category": "Water Weed",
			"type": [ "Water", "Grass" ],
			"evolves-into": [ "271" ],
			"base-stamina": 120,
			"base-attack": 71,
			"base-defense": 77,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 0.51,
			"weight-avg": 2.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.325,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 1.02 ]
			}
		},
		"271": {
			"dex-index": "271",
			"name": "Lombre",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-03-30"
			},
			"category": "Jolly",
			"type": [ "Water", "Grass" ],
			"evolves-from": "270",
			"evolves-into": [ "272" ],
			"base-stamina": 155,
			"base-attack": 112,
			"base-defense": 119,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_ICE_ICEBEAM",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 1.19,
			"weight-avg": 32.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 4.0625,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.0825 ]
			}
		},
		"272": {
			"dex-index": "272",
			"name": "Ludicolo",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-03-30"
			},
			"category": "Carefree",
			"type": [ "Water", "Grass" ],
			"evolves-from": "271",
			"base-stamina": 190,
			"base-attack": 173,
			"base-defense": 176,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_BLIZZARD",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_ICE_ICEBEAM",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_LEAFSTORM",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 1.5,
			"weight-avg": 55,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 6.875,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"273": {
			"dex-index": "273",
			"name": "Seedot",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-05-24",
				"shadow": "2019-10-17",
				"shiny-shadow": "2021-05-18"
			},
			"category": "Acorn",
			"type": [ "Grass" ],
			"evolves-into": [ "274" ],
			"base-stamina": 120,
			"base-attack": 71,
			"base-defense": 77,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_BULLETSEED",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_DAR_FOULPLAY"
			],
			"height-avg": 0.51,
			"weight-avg": 4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.5,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"274": {
			"dex-index": "274",
			"name": "Nuzleaf",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-05-24",
				"shadow": "2019-10-17",
				"shiny-shadow": "2021-05-18"
			},
			"category": "Wily",
			"type": [ "Grass", "Dark" ],
			"evolves-from": "273",
			"evolves-into": [ "275" ],
			"base-stamina": 172,
			"base-attack": 134,
			"base-defense": 78,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_DAR_FOULPLAY"
			],
			"height-avg": 0.99,
			"weight-avg": 28,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 3.5,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.7325 ]
			}
		},
		"275": {
			"dex-index": "275",
			"name": "Shiftry",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-05-24",
				"shadow": "2019-10-17",
				"shiny-shadow": "2021-05-18"
			},
			"category": "Wicked",
			"type": [ "Grass", "Dark" ],
			"evolves-from": "274",
			"base-stamina": 207,
			"base-attack": 200,
			"base-defense": 121,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_DAR_FEINTATTACK",
				"FAST_DAR_SNARL"
			],
			"special-fast-moves": [
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_FLY_HURRICANE",
				"CHRG_DAR_FOULPLAY",
				"CHRG_GRA_LEAFTORNADO"
			],
			"height-avg": 1.3,
			"weight-avg": 59.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 7.45,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"276": {
			"dex-index": "276",
			"name": "Taillow",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2019-01-15",
				"shadow": "2025-01-15"
			},
			"category": "Tiny Swallow",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "277" ],
			"base-stamina": 120,
			"base-attack": 106,
			"base-defense": 61,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 0.3,
			"weight-avg": 2.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.2875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.6 ]
			}
		},
		"277": {
			"dex-index": "277",
			"name": "Swellow",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2019-01-15",
				"shadow": "2025-01-15"
			},
			"category": "Swallow",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "276",
			"base-stamina": 155,
			"base-attack": 185,
			"base-defense": 124,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FLY_SKYATTACK"
			],
			"height-avg": 0.71,
			"weight-avg": 19.8,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 2.475,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.42 ]
			}
		},
		"278": {
			"dex-index": "278",
			"name": "Wingull",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2018-08-29"
			},
			"category": "Seagull",
			"type": [ "Water", "Flying" ],
			"evolves-into": [ "279" ],
			"base-stamina": 120,
			"base-attack": 106,
			"base-defense": 61,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_FLY_AIRCUTTER",
				"CHRG_ICE_ICEBEAM"
			],
			"height-avg": 0.61,
			"weight-avg": 9.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.1875,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"279": {
			"dex-index": "279",
			"name": "Pelipper",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2018-08-29"
			},
			"category": "Water Bird",
			"type": [ "Water", "Flying" ],
			"evolves-from": "278",
			"base-stamina": 155,
			"base-attack": 175,
			"base-defense": 174,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_FLY_HURRICANE",
				"CHRG_ICE_BLIZZARD",
				"CHRG_WAT_WEATHERBALL"
			],
			"height-avg": 1.19,
			"weight-avg": 28,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 3.5,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.0825 ]
			}
		},
		"280": {
			"dex-index": "280",
			"name": "Ralts",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-08-03",
				"shadow": "2019-08-08",
				"shiny-shadow": "2024-10-08"
			},
			"category": "Feeling",
			"type": [ "Psychic", "Fairy" ],
			"evolves-into": [ "281" ],
			"base-stamina": 99,
			"base-attack": 79,
			"base-defense": 59,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_GHO_SHADOWSNEAK"
			],
			"height-avg": 0.41,
			"weight-avg": 6.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.825,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"281": {
			"dex-index": "281",
			"name": "Kirlia",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-08-03",
				"shadow": "2019-08-08",
				"shiny-shadow": "2024-10-08"
			},
			"category": "Emotion",
			"type": [ "Psychic", "Fairy" ],
			"evolves-from": "280",
			"evolves-into": [ "282", "475" ],
			"base-stamina": 116,
			"base-attack": 117,
			"base-defense": 90,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_ELE_CHARGEBEAM",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"unobtainable-charged-moves": [
				"CHRG_FAI_DRAININGKISS"
			],
			"height-avg": 0.79,
			"weight-avg": 20.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 2.525,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"282": {
			"dex-index": "282",
			"name": "Gardevoir",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-08-03",
				"shadow": "2019-08-08",
				"shiny-shadow": "2024-10-08"
			},
			"category": "Embrace",
			"type": [ "Psychic", "Fairy" ],
			"evolves-from": "281",
			"base-stamina": 169,
			"base-attack": 237,
			"base-defense": 195,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_ELE_CHARGEBEAM",
				"FAST_FAI_CHARM",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"special-charged-moves": [
				"CHRG_PSY_SYNCHRONOISE"
			],
			"height-avg": 1.6,
			"weight-avg": 48.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 6.05,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"282-M": {
			"dex-index": "282-M",
			"name": "Mega Gardevoir",
			"form-data": {
				"base": "282",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-02-08",
				"shiny": "2023-02-08",
				"shadow": false
			},
			"base-stamina": 169,
			"base-attack": 326,
			"base-defense": 229
		},
		"283": {
			"dex-index": "283",
			"name": "Surskit",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2023-02-18"
			},
			"category": "Pond Skater",
			"type": [ "Bug", "Water" ],
			"evolves-into": [ "284" ],
			"base-stamina": 120,
			"base-attack": 93,
			"base-defense": 87,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_BUG_SIGNALBEAM"
			],
			"height-avg": 0.51,
			"weight-avg": 1.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.2125,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"284": {
			"dex-index": "284",
			"name": "Masquerain",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2023-02-18"
			},
			"category": "Eyeball",
			"type": [ "Bug", "Flying" ],
			"evolves-from": "283",
			"base-stamina": 172,
			"base-attack": 192,
			"base-defense": 150,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_INFESTATION",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_FLY_AIRCUTTER",
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_BUG_SILVERWIND",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_BUG_LUNGE"
			],
			"height-avg": 0.79,
			"weight-avg": 3.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 0.45,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"285": {
			"dex-index": "285",
			"name": "Shroomish",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2022-06-04"
			},
			"category": "Mushroom",
			"type": [ "Grass" ],
			"evolves-into": [ "286" ],
			"base-stamina": 155,
			"base-attack": 74,
			"base-defense": 110,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 0.41,
			"weight-avg": 4.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.5625,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"286": {
			"dex-index": "286",
			"name": "Breloom",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2022-06-04"
			},
			"category": "Mushroom",
			"type": [ "Grass", "Fighting" ],
			"evolves-from": "285",
			"base-stamina": 155,
			"base-attack": 241,
			"base-defense": 144,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_GRA_BULLETSEED",
				"FAST_FIG_FORCEPALM"
			],
			"charged-moves": [
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_POI_SLUDGEBOMB"
			],
			"special-charged-moves": [
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 1.19,
			"weight-avg": 39.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 4.9,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.0825 ]
			}
		},
		"287": {
			"dex-index": "287",
			"name": "Slakoth",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-06-08"
			},
			"category": "Slacker",
			"type": [ "Normal" ],
			"evolves-into": [ "288" ],
			"base-stamina": 155,
			"base-attack": 104,
			"base-defense": 92,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_YAWN"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 0.79,
			"weight-avg": 24,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 3,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"288": {
			"dex-index": "288",
			"name": "Vigoroth",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-06-08"
			},
			"category": "Wild Monkey",
			"type": [ "Normal" ],
			"evolves-from": "287",
			"evolves-into": [ "289" ],
			"base-stamina": 190,
			"base-attack": 159,
			"base-defense": 145,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_GRO_BULLDOZE",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 1.4,
			"weight-avg": 46.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 5.8125,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"289": {
			"dex-index": "289",
			"name": "Slaking",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-06-08"
			},
			"category": "Lazy",
			"type": [ "Normal" ],
			"evolves-from": "288",
			"base-stamina": 284,
			"base-attack": 290,
			"base-defense": 166,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_YAWN"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRO_EARTHQUAKE"
			],
			"special-charged-moves": [
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 2.01,
			"weight-avg": 130.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 16.3125,
				"xxs": [ 0.9849, 1.005 ],
				"xs": [ 1.005, 1.5075 ],
				"m": [ 1.5075, 2.5125 ],
				"xl": [ 2.5125, 3.015 ],
				"xxl": [ 3.015, 3.1155 ]
			}
		},
		"290": {
			"dex-index": "290",
			"name": "Nincada",
			"availability": {
				"in-game": "2018-11-01",
				"shiny": "2020-03-20"
			},
			"category": "Trainee",
			"type": [ "Bug", "Ground" ],
			"evolves-into": [ "291", "292" ],
			"base-stamina": 104,
			"base-attack": 80,
			"base-defense": 126,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 0.51,
			"weight-avg": 5.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 0.6875,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"291": {
			"dex-index": "291",
			"name": "Ninjask",
			"availability": {
				"in-game": "2018-11-01",
				"shiny": "2020-03-20"
			},
			"category": "Ninja",
			"type": [ "Bug", "Flying" ],
			"evolves-from": "290",
			"base-stamina": 156,
			"base-attack": 199,
			"base-defense": 112,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 0.79,
			"weight-avg": 12,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 1.5,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"292": {
			"dex-index": "292",
			"name": "Shedinja",
			"availability": {
				"in-game": "2018-11-01",
				"shiny": "2022-10-01"
			},
			"category": "Shed",
			"type": [ "Bug", "Ghost" ],
			"evolves-from": "290",
			"base-stamina": 1,
			"base-attack": 153,
			"base-defense": 73,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_GHO_SHADOWCLAW"
			],
			"special-fast-moves": [
				"FAST_BUG_STRUGGLEBUG"
			],
			"unobtainable-fast-moves": [
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_FLY_AERIALACE",
				"CHRG_GRO_DIG"
			],
			"height-avg": 0.79,
			"weight-avg": 1.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 0.15,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"293": {
			"dex-index": "293",
			"name": "Whismur",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2021-07-17",
				"shadow": "2022-01-24"
			},
			"category": "Whisper",
			"type": [ "Normal" ],
			"evolves-into": [ "294" ],
			"base-stamina": 162,
			"base-attack": 92,
			"base-defense": 42,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.61,
			"weight-avg": 16.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 2.0375,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"294": {
			"dex-index": "294",
			"name": "Loudred",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2021-07-17",
				"shadow": "2022-01-24"
			},
			"category": "Big Voice",
			"type": [ "Normal" ],
			"evolves-from": "293",
			"evolves-into": [ "295" ],
			"base-stamina": 197,
			"base-attack": 134,
			"base-defense": 81,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.99,
			"weight-avg": 40.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 5.0625,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.7325 ]
			}
		},
		"295": {
			"dex-index": "295",
			"name": "Exploud",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2021-07-17",
				"shadow": "2022-01-24"
			},
			"category": "Loud Noise",
			"type": [ "Normal" ],
			"evolves-from": "294",
			"base-stamina": 232,
			"base-attack": 179,
			"base-defense": 137,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_FIR_FIREBLAST",
				"CHRG_NOR_BOOMBURST"
			],
			"height-avg": 1.5,
			"weight-avg": 84,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 10.5,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"296": {
			"dex-index": "296",
			"name": "Makuhita",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-05-01",
				"shadow": "2021-05-18"
			},
			"category": "Guts",
			"type": [ "Fighting" ],
			"evolves-into": [ "297" ],
			"base-stamina": 176,
			"base-attack": 99,
			"base-defense": 54,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_STE_HEAVYSLAM",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_FIG_CROSSCHOP"
			],
			"height-avg": 0.99,
			"weight-avg": 86.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 10.8,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.7325 ]
			}
		},
		"297": {
			"dex-index": "297",
			"name": "Hariyama",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-05-01",
				"shadow": "2021-05-18"
			},
			"category": "Arm Thrust",
			"type": [ "Fighting" ],
			"evolves-from": "296",
			"base-stamina": 302,
			"base-attack": 209,
			"base-defense": 114,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_STE_BULLETPUNCH",
				"FAST_FIG_FORCEPALM"
			],
			"charged-moves": [
				"CHRG_STE_HEAVYSLAM",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_FIG_SUPERPOWER"
			],
			"height-avg": 2.31,
			"weight-avg": 253.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.28875,
				"wt-std-dev": 31.725,
				"xxs": [ 1.1319, 1.155 ],
				"xs": [ 1.155, 1.7325 ],
				"m": [ 1.7325, 2.8875 ],
				"xl": [ 2.8875, 3.465 ],
				"xxl": [ 3.465, 3.5805 ]
			}
		},
		"298": {
			"dex-index": "298",
			"name": "Azurill",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-12-18"
			},
			"category": "Polka Dot",
			"type": [ "Normal", "Fairy" ],
			"evolves-into": [ "183" ],
			"base-stamina": 137,
			"base-attack": 36,
			"base-defense": 71,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_SPLASH",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_ICE_ICEBEAM",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.2,
			"weight-avg": 2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.25,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"299": {
			"dex-index": "299",
			"name": "Nosepass",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2021-03-09",
				"shadow": "2021-02-02"
			},
			"category": "Compass",
			"type": [ "Rock" ],
			"evolves-into": [ "476" ],
			"base-stamina": 102,
			"base-attack": 82,
			"base-defense": 215,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.99,
			"weight-avg": 97,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 12.125,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.98 ]
			}
		},
		"300": {
			"dex-index": "300",
			"name": "Skitty",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-05-15"
			},
			"category": "Kitten",
			"type": [ "Normal" ],
			"evolves-into": [ "301" ],
			"base-stamina": 137,
			"base-attack": 84,
			"base-defense": 79,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_ELE_WILDCHARGE"
			],
			"height-avg": 0.61,
			"weight-avg": 11,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.375,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 0.9455 ]
			}
		},
		"301": {
			"dex-index": "301",
			"name": "Delcatty",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2020-05-15"
			},
			"category": "Prim",
			"type": [ "Normal" ],
			"evolves-from": "300",
			"base-stamina": 172,
			"base-attack": 132,
			"base-defense": 127,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_ELE_WILDCHARGE"
			],
			"height-avg": 1.09,
			"weight-avg": 32.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 4.075,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.6895 ]
			}
		},
		"302": {
			"dex-index": "302",
			"name": "Sableye",
			"availability": {
				"in-game": "2017-10-20",
				"shiny": "2017-10-20",
				"shadow": "2019-10-17",
				"shiny-shadow": "2022-11-14"
			},
			"category": "Darkness",
			"type": [ "Dark", "Ghost" ],
			"base-stamina": 137,
			"base-attack": 141,
			"base-defense": 136,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_SHADOWCLAW",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_ROC_POWERGEM",
				"CHRG_DAR_FOULPLAY",
				"CHRG_GHO_SHADOWSNEAK"
			],
			"height-avg": 0.51,
			"weight-avg": 11,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 1.375,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"302-M": {
			"dex-index": "302-M",
			"name": "Mega Sableye",
			"form-data": {
				"base": "302",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-06-23",
				"shiny": "2023-06-29",
				"shadow": false
			},
			"base-stamina": 137,
			"base-attack": 151,
			"base-defense": 216,
			"height-avg": 0.5,
			"weight-avg": 161,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 1.375,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"303": {
			"dex-index": "303",
			"name": "Mawile",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2017-12-08",
				"shadow": "2020-02-03",
				"shiny-shadow": "2020-02-03"
			},
			"category": "Deceiver",
			"type": [ "Steel", "Fairy" ],
			"base-stamina": 137,
			"base-attack": 155,
			"base-defense": 141,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GHO_ASTONISH",
				"FAST_ICE_ICEFANG",
				"FAST_FIR_FIREFANG",
				"FAST_FAI_FAIRYWIND"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_NOR_VISEGRIP",
				"CHRG_STE_IRONHEAD",
				"CHRG_FIG_POWERUPPUNCH"
			],
			"height-avg": 0.61,
			"weight-avg": 11.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.4375,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"303-M": {
			"dex-index": "303-M",
			"name": "Mega Mawile",
			"form-data": {
				"base": "303",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2024-10-12",
				"shiny": "2024-10-12",
				"shadow": false
			},
			"base-stamina": 137,
			"base-attack": 188,
			"base-defense": 217,
			"height-avg": 1.0,
			"weight-avg": 23.5,
			"size-data": {
				"class": 1.75,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"304": {
			"dex-index": "304",
			"name": "Aron",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2018-01-23",
				"shadow": "2021-02-02"
			},
			"category": "Iron Armor",
			"type": [ "Steel", "Rock" ],
			"evolves-into": [ "305" ],
			"base-stamina": 137,
			"base-attack": 121,
			"base-defense": 141,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_STE_IRONHEAD",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.41,
			"weight-avg": 60,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 7.5,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.82 ]
			}
		},
		"305": {
			"dex-index": "305",
			"name": "Lairon",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2018-01-23",
				"shadow": "2021-02-02"
			},
			"category": "Iron Armor",
			"type": [ "Steel", "Rock" ],
			"evolves-from": "304",
			"evolves-into": [ "306" ],
			"base-stamina": 155,
			"base-attack": 158,
			"base-defense": 198,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_STE_HEAVYSLAM",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.89,
			"weight-avg": 120,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 15,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.78 ]
			}
		},
		"306": {
			"dex-index": "306",
			"name": "Aggron",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2018-01-23",
				"shadow": "2021-02-02"
			},
			"category": "Iron Armor",
			"type": [ "Steel", "Rock" ],
			"evolves-from": "305",
			"base-stamina": 172,
			"base-attack": 198,
			"base-defense": 257,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_STE_IRONTAIL",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDER",
				"CHRG_ROC_STONEEDGE",
				"CHRG_STE_HEAVYSLAM",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_ROC_METEORBEAM"
			],
			"height-avg": 2.11,
			"weight-avg": 360,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.26375,
				"wt-std-dev": 45,
				"xxs": [ 1.0339, 1.055 ],
				"xs": [ 1.055, 1.5825 ],
				"m": [ 1.5825, 2.6375 ],
				"xl": [ 2.6375, 3.165 ],
				"xxl": [ 3.165, 4.22 ]
			}
		},
		"306-M": {
			"dex-index": "306-M",
			"name": "Mega Aggron",
			"category": "Iron Armor",
			"form-data": {
				"base": "306",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-09-16",
				"shiny": "2022-09-16",
				"shadow": false
			},
			"type": [ "Steel" ],
			"base-stamina": 172,
			"base-attack": 247,
			"base-defense": 331,
			"height-avg": 2.2,
			"weight-avg": 395,
			"size-data": {
				"class": 1.75,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.85 ]
			}
		},
		"307": {
			"dex-index": "307",
			"name": "Meditite",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-05-01"
			},
			"category": "Meditate",
			"type": [ "Fighting", "Psychic" ],
			"evolves-into": [ "308" ],
			"base-stamina": 102,
			"base-attack": 78,
			"base-defense": 107,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_ICE_ICEPUNCH",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_FIG_LOWSWEEP"
			],
			"height-avg": 0.61,
			"weight-avg": 11.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.4,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 0.9455 ]
			}
		},
		"308": {
			"dex-index": "308",
			"name": "Medicham",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-05-01"
			},
			"category": "Meditate",
			"type": [ "Fighting", "Psychic" ],
			"evolves-from": "307",
			"base-stamina": 155,
			"base-attack": 121,
			"base-defense": 152,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_PSYCHOCUT",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_ICE_ICEPUNCH",
				"CHRG_PSY_PSYCHIC",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_FIG_POWERUPPUNCH"
			],
			"height-avg": 1.3,
			"weight-avg": 31.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 3.9375,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"308-M": {
			"dex-index": "308-M",
			"name": "Mega Medicham",
			"form-data": {
				"base": "308",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-03-08",
				"shiny": "2023-03-08",
				"shadow": false
			},
			"base-stamina": 155,
			"base-attack": 205,
			"base-defense": 179
		},
		"309": {
			"dex-index": "309",
			"name": "Electrike",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-09-01",
				"shadow": "2021-05-18"
			},
			"category": "Lightning",
			"type": [ "Electric" ],
			"evolves-into": [ "310" ],
			"base-stamina": 120,
			"base-attack": 123,
			"base-defense": 78,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_DISCHARGE",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 0.61,
			"weight-avg": 15.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.9,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"310": {
			"dex-index": "310",
			"name": "Manectric",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-09-01",
				"shadow": "2021-05-18"
			},
			"category": "Discharge",
			"type": [ "Electric" ],
			"evolves-from": "309",
			"base-stamina": 172,
			"base-attack": 215,
			"base-defense": 127,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_ELE_CHARGEBEAM",
				"FAST_ELE_THUNDERFANG"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDER",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_FIR_FLAMEBURST",
				"CHRG_FIR_OVERHEAT",
				"CHRG_PSY_PSYCHICFANGS"
			],
			"height-avg": 1.5,
			"weight-avg": 40.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.025,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"310-M": {
			"dex-index": "310-M",
			"name": "Mega Manectric",
			"form-data": {
				"base": "310",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2021-03-16",
				"shiny": "2021-03-16",
				"shadow": false
			},
			"base-stamina": 172,
			"base-attack": 286,
			"base-defense": 179,
			"height-avg": 1.8,
			"weight-avg": 44,
			"size-data": {
				"class": 1.55,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"311": {
			"dex-index": "311",
			"name": "Plusle",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-07-13"
			},
			"category": "Cheering",
			"type": [ "Electric" ],
			"base-stamina": 155,
			"base-attack": 167,
			"base-defense": 129,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_DISCHARGE",
				"CHRG_NOR_SWIFT",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.41,
			"weight-avg": 4.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.525,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"312": {
			"dex-index": "312",
			"name": "Minun",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-07-13"
			},
			"category": "Cheering",
			"type": [ "Electric" ],
			"base-stamina": 155,
			"base-attack": 147,
			"base-defense": 150,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_DISCHARGE",
				"CHRG_NOR_SWIFT",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.41,
			"weight-avg": 4.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.525,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"313": {
			"dex-index": "313",
			"name": "Volbeat",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2020-04-21"
			},
			"category": "Firefly",
			"type": [ "Bug" ],
			"base-stamina": 163,
			"base-attack": 143,
			"base-defense": 166,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.71,
			"weight-avg": 17.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 2.2125,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"314": {
			"dex-index": "314",
			"name": "Illumise",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2020-04-21"
			},
			"category": "Firefly",
			"type": [ "Bug" ],
			"base-stamina": 163,
			"base-attack": 143,
			"base-defense": 166,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_BUG_SILVERWIND",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_FAI_DAZZLINGGLEAM"
			],
			"height-avg": 0.61,
			"weight-avg": 17.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 2.2125,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"315": {
			"dex-index": "315",
			"name": "Roselia",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-06-30"
			},
			"category": "Thorn",
			"type": [ "Grass", "Poison" ],
			"evolves-from": "406",
			"evolves-into": [ "407" ],
			"base-stamina": 137,
			"base-attack": 186,
			"base-defense": 131,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_FAI_DAZZLINGGLEAM"
			],
			"height-avg": 0.3,
			"weight-avg": 2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.25,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"316": {
			"dex-index": "316",
			"name": "Gulpin",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2023-02-18"
			},
			"category": "Stomach",
			"type": [ "Poison" ],
			"evolves-into": [ "317" ],
			"base-stamina": 172,
			"base-attack": 80,
			"base-defense": 99,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGE",
				"CHRG_POI_GUNKSHOT",
				"CHRG_ICE_ICEBEAM"
			],
			"height-avg": 0.41,
			"weight-avg": 10.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 1.2875,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.82 ]
			}
		},
		"317": {
			"dex-index": "317",
			"name": "Swalot",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2023-02-18"
			},
			"category": "Poison Bag",
			"type": [ "Poison" ],
			"evolves-from": "316",
			"base-stamina": 225,
			"base-attack": 140,
			"base-defense": 159,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_BUG_INFESTATION",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_POI_GUNKSHOT",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_ICE_ICEBEAM",
				"CHRG_POI_ACIDSPRAY"
			],
			"height-avg": 1.7,
			"weight-avg": 80,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 10,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 3.4 ]
			}
		},
		"318": {
			"dex-index": "318",
			"name": "Carvanha",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-08-23",
				"shadow": "2020-02-03",
				"shiny-shadow": "2021-02-02"
			},
			"category": "Savage",
			"type": [ "Water", "Dark" ],
			"evolves-into": [ "319" ],
			"base-stamina": 128,
			"base-attack": 171,
			"base-defense": 39,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_DAR_CRUNCH",
				"CHRG_POI_POISONFANG"
			],
			"height-avg": 0.79,
			"weight-avg": 20.8,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 2.6,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.58 ]
			}
		},
		"319": {
			"dex-index": "319",
			"name": "Sharpedo",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-08-23",
				"shadow": "2020-02-03",
				"shiny-shadow": "2021-02-02"
			},
			"category": "Brutal",
			"type": [ "Water", "Dark" ],
			"evolves-from": "318",
			"base-stamina": 172,
			"base-attack": 243,
			"base-defense": 83,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_DAR_CRUNCH",
				"CHRG_POI_POISONFANG"
			],
			"height-avg": 1.8,
			"weight-avg": 88.8,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.225,
				"wt-std-dev": 11.1,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.6 ]
			}
		},
		"319-M": {
			"dex-index": "319-M",
			"name": "Mega Sharpedo",
			"form-data": {
				"base": "319",
				"type": "Mega"
			},
			"availability": {
				"in-game": false
			},
			"height-avg": 2.5,
			"weight-avg": 130.3
		},
		"320": {
			"dex-index": "320",
			"name": "Wailmer",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2018-04-24",
				"shadow": "2022-11-14"
			},
			"category": "Ball Whale",
			"type": [ "Water" ],
			"evolves-into": [ "321" ],
			"base-stamina": 277,
			"base-attack": 136,
			"base-defense": 68,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_SPLASH",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_STE_HEAVYSLAM",
				"CHRG_WAT_WATERPULSE",
				"CHRG_NOR_BODYSLAM",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 2.01,
			"weight-avg": 130,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 16.25,
				"xxs": [ 0.9849, 1.005 ],
				"xs": [ 1.005, 1.5075 ],
				"m": [ 1.5075, 2.5125 ],
				"xl": [ 2.5125, 3.015 ],
				"xxl": [ 3.015, 4.02 ]
			}
		},
		"321": {
			"dex-index": "321",
			"name": "Wailord",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2022-06-04",
				"shadow": "2022-11-14"
			},
			"category": "Float Whale",
			"type": [ "Water" ],
			"evolves-from": "320",
			"base-stamina": 347,
			"base-attack": 175,
			"base-defense": 87,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_ICE_BLIZZARD",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 14.5,
			"weight-avg": 398,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 1.8125,
				"wt-std-dev": 49.75,
				"xxs": [ 7.105, 7.25 ],
				"xs": [ 7.25, 10.875 ],
				"m": [ 10.875, 18.125 ],
				"xl": [ 18.125, 21.75 ],
				"xxl": [ 21.75, 29 ]
			}
		},
		"322": {
			"dex-index": "322",
			"name": "Numel",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2022-06-04",
				"shadow": "2022-04-03"
			},
			"category": "Numb",
			"type": [ "Fire", "Ground" ],
			"evolves-into": [ "323" ],
			"base-stamina": 155,
			"base-attack": 119,
			"base-defense": 79,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_GRO_BULLDOZE",
				"CHRG_FIR_HEATWAVE",
				"CHRG_NOR_STOMP"
			],
			"height-avg": 0.71,
			"weight-avg": 24,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 3,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.1005 ]
			}
		},
		"323": {
			"dex-index": "323",
			"name": "Camerupt",
			"availability": {
				"in-game": "2018-01-23",
				"shadow": "2022-04-03"
			},
			"category": "Eruption",
			"type": [ "Fire", "Ground" ],
			"evolves-from": "322",
			"base-stamina": 172,
			"base-attack": 194,
			"base-defense": 136,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIG_ROCKSMASH",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_FIR_OVERHEAT",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRO_EARTHPOWER"
			],
			"height-avg": 1.91,
			"weight-avg": 220,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.23875,
				"wt-std-dev": 27.5,
				"xxs": [ 0.9359, 0.955 ],
				"xs": [ 0.955, 1.4325 ],
				"m": [ 1.4325, 2.3875 ],
				"xl": [ 2.3875, 2.865 ],
				"xxl": [ 2.865, 2.9605 ]
			}
		},
		"323-M": {
			"dex-index": "323-M",
			"name": "Mega Camerupt",
			"form-data": {
				"base": "323",
				"type": "Mega"
			},
			"availability": {
				"in-game": false
			},
			"height-avg": 2.5,
			"weight-avg": 320.5
		},
		"324": {
			"dex-index": "324",
			"name": "Torkoal",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2023-02-18"
			},
			"category": "Coal",
			"type": [ "Fire" ],
			"base-stamina": 172,
			"base-attack": 151,
			"base-defense": 203,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_OVERHEAT",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRO_EARTHQUAKE"
			],
			"height-avg": 0.51,
			"weight-avg": 80.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 10.05,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"325": {
			"dex-index": "325",
			"name": "Spoink",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-02-04",
				"shadow": "2023-02-01"
			},
			"category": "Bounce",
			"type": [ "Psychic" ],
			"evolves-into": [ "326" ],
			"base-stamina": 155,
			"base-attack": 125,
			"base-defense": 122,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_SPLASH",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_MIRRORCOAT"
			],
			"height-avg": 0.71,
			"weight-avg": 30.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 3.825,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.1005 ]
			}
		},
		"326": {
			"dex-index": "326",
			"name": "Grumpig",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-02-04",
				"shadow": "2023-02-01"
			},
			"category": "Manipulate",
			"type": [ "Psychic" ],
			"evolves-from": "325",
			"base-stamina": 190,
			"base-attack": 171,
			"base-defense": 188,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_CHARGEBEAM",
				"FAST_PSY_EXTRASENSORY"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_MIRRORCOAT"
			],
			"height-avg": 0.89,
			"weight-avg": 71.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 8.9375,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.5575 ]
			}
		},
		"327": {
			"dex-index": "327",
			"name": "Spinda",
			"availability": {
				"in-game": "2018-08-01"
			},
			"category": "Spot Panda",
			"type": [ "Normal" ],
			"base-stamina": 155,
			"base-attack": 116,
			"base-defense": 116,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_PSY_PSYCHOCUT"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 1.09,
			"weight-avg": 5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 0.625,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.6895 ]
			}
		},
		"328": {
			"dex-index": "328",
			"name": "Trapinch",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2019-10-12",
				"shadow": "2019-10-17",
				"shiny-shadow": "2024-03-27"
			},
			"category": "Ant Pit",
			"type": [ "Ground" ],
			"evolves-into": [ "329" ],
			"base-stamina": 128,
			"base-attack": 162,
			"base-defense": 78,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_BUG_STRUGGLEBUG",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_SANDTOMB",
				"CHRG_GRO_DIG",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 0.71,
			"weight-avg": 15,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 1.875,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"329": {
			"dex-index": "329",
			"name": "Vibrava",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2019-10-12",
				"shadow": "2019-10-17",
				"shiny-shadow": "2024-03-27"
			},
			"category": "Vibration",
			"type": [ "Ground", "Dragon" ],
			"evolves-from": "328",
			"evolves-into": [ "330" ],
			"base-stamina": 137,
			"base-attack": 134,
			"base-defense": 99,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_DRA_DRAGONBREATH",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_SANDTOMB",
				"CHRG_GRO_BULLDOZE",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 1.09,
			"weight-avg": 15.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 1.9125,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"330": {
			"dex-index": "330",
			"name": "Flygon",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2019-10-12",
				"shadow": "2019-10-17",
				"shiny-shadow": "2024-03-27"
			},
			"category": "Mystic",
			"type": [ "Ground", "Dragon" ],
			"evolves-from": "329",
			"base-stamina": 190,
			"base-attack": 205,
			"base-defense": 168,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_DRA_DRAGONTAIL",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_ROC_STONEEDGE",
				"CHRG_NOR_BOOMBURST",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"special-charged-moves": [
				"CHRG_GRO_EARTHPOWER"
			],
			"height-avg": 2.01,
			"weight-avg": 82,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 10.25,
				"xxs": [ 0.9849, 1.005 ],
				"xs": [ 1.005, 1.5075 ],
				"m": [ 1.5075, 2.5125 ],
				"xl": [ 2.5125, 3.015 ],
				"xxl": [ 3.015, 4.02 ]
			}
		},
		"331": {
			"dex-index": "331",
			"name": "Cacnea",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2023-02-18",
				"shadow": "2019-10-17",
				"shiny-shadow": "2024-03-27"
			},
			"category": "Cactus",
			"type": [ "Grass" ],
			"evolves-into": [ "332" ],
			"base-stamina": 137,
			"base-attack": 156,
			"base-defense": 74,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_DAR_SUCKERPUNCH",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_DAR_PAYBACK",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.41,
			"weight-avg": 51.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 6.4125,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.82 ]
			}
		},
		"332": {
			"dex-index": "332",
			"name": "Cacturne",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2023-02-18",
				"shadow": "2019-10-17",
				"shiny-shadow": "2024-03-27"
			},
			"category": "Scarecrow",
			"type": [ "Grass", "Dark" ],
			"evolves-from": "331",
			"base-stamina": 172,
			"base-attack": 221,
			"base-defense": 115,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_DAR_SUCKERPUNCH",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_DAR_PAYBACK",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.3,
			"weight-avg": 77.4,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 9.675,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"333": {
			"dex-index": "333",
			"name": "Swablu",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2018-02-09"
			},
			"category": "Cotton Bird",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "334" ],
			"base-stamina": 128,
			"base-attack": 76,
			"base-defense": 132,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_FLY_AERIALACE",
				"CHRG_ICE_ICEBEAM"
			],
			"height-avg": 0.41,
			"weight-avg": 1.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.15,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.7175 ]
			}
		},
		"334": {
			"dex-index": "334",
			"name": "Altaria",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2018-02-09"
			},
			"category": "Humming",
			"type": [ "Dragon", "Flying" ],
			"evolves-from": "333",
			"base-stamina": 181,
			"base-attack": 141,
			"base-defense": 201,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_DRA_DRAGONBREATH"
			],
			"charged-moves": [
				"CHRG_FLY_SKYATTACK",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_DRA_DRAGONPULSE"
			],
			"special-charged-moves": [
				"CHRG_FAI_MOONBLAST"
			],
			"height-avg": 1.09,
			"weight-avg": 20.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 2.575,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"334-M": {
			"dex-index": "334-M",
			"name": "Mega Altaria",
			"form-data": {
				"base": "334",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2021-05-15",
				"shiny": "2021-05-15",
				"shadow": false
			},
			"type": [ "Dragon", "Fairy" ],
			"height-avg": 1.5,
			"weight-avg": 20.6,
			"base-stamina": 181,
			"base-attack": 222,
			"base-defense": 218,
			"size-data": {
				"class": 1.55,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"335": {
			"dex-index": "335",
			"name": "Zangoose",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-09-26"
			},
			"category": "Cat Ferret",
			"type": [ "Normal" ],
			"base-stamina": 177,
			"base-attack": 222,
			"base-defense": 124,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_GRO_DIG"
			],
			"height-avg": 1.3,
			"weight-avg": 40.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 5.0375,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"336": {
			"dex-index": "336",
			"name": "Seviper",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2019-09-26"
			},
			"category": "Fang Snake",
			"type": [ "Poison" ],
			"base-stamina": 177,
			"base-attack": 196,
			"base-defense": 118,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_POI_POISONFANG",
				"CHRG_DAR_CRUNCH",
				"CHRG_NOR_WRAP"
			],
			"height-avg": 2.69,
			"weight-avg": 52.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.33625,
				"wt-std-dev": 6.5625,
				"xxs": [ 1.3181, 1.345 ],
				"xs": [ 1.345, 2.0175 ],
				"m": [ 2.0175, 3.3625 ],
				"xl": [ 3.3625, 4.035 ],
				"xxl": [ 4.035, 4.1695 ]
			}
		},
		"337": {
			"dex-index": "337",
			"name": "Lunatone",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2019-03-19"
			},
			"category": "Meteorite",
			"type": [ "Rock", "Psychic" ],
			"base-stamina": 207,
			"base-attack": 178,
			"base-defense": 153,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_PSY_CONFUSION",
				"FAST_PSY_PSYWAVE"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_FAI_MOONBLAST"
			],
			"height-avg": 0.99,
			"weight-avg": 168,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 21,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.98 ]
			}
		},
		"338": {
			"dex-index": "338",
			"name": "Solrock",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2019-03-19"
			},
			"category": "Meteorite",
			"type": [ "Rock", "Psychic" ],
			"base-stamina": 207,
			"base-attack": 178,
			"base-defense": 153,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_PSY_CONFUSION",
				"FAST_PSY_PSYWAVE"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_GRA_SOLARBEAM"
			],
			"height-avg": 1.19,
			"weight-avg": 154,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 19.25,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.38 ]
			}
		},
		"339": {
			"dex-index": "339",
			"name": "Barboach",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-08-23",
				"shadow": "2023-10-26"
			},
			"category": "Whiskers",
			"type": [ "Water", "Ground" ],
			"evolves-into": [ "340" ],
			"base-stamina": 137,
			"base-attack": 93,
			"base-defense": 82,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_WAT_AQUATAIL",
				"CHRG_ICE_ICEBEAM",
				"CHRG_GRO_MUDBOMB",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 0.41,
			"weight-avg": 1.9,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 0.2375,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.82 ]
			}
		},
		"340": {
			"dex-index": "340",
			"name": "Whiscash",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-08-23",
				"shadow": "2023-10-26"
			},
			"category": "Whiskers",
			"type": [ "Water", "Ground" ],
			"evolves-from": "339",
			"base-stamina": 242,
			"base-attack": 151,
			"base-defense": 141,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_BLIZZARD",
				"CHRG_GRO_MUDBOMB",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 0.89,
			"weight-avg": 23.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.11125,
				"wt-std-dev": 2.95,
				"xxs": [ 0.4361, 0.445 ],
				"xs": [ 0.445, 0.6675 ],
				"m": [ 0.6675, 1.1125 ],
				"xl": [ 1.1125, 1.335 ],
				"xxl": [ 1.335, 1.78 ]
			}
		},
		"341": {
			"dex-index": "341",
			"name": "Corphish",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2022-05-13",
				"shadow": "2024-01-27"
			},
			"category": "Ruffian",
			"type": [ "Water" ],
			"evolves-into": [ "342" ],
			"base-stamina": 125,
			"base-attack": 141,
			"base-defense": 99,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_NOR_VISEGRIP",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_RAZORSHELL",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 0.61,
			"weight-avg": 11.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.4375,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"342": {
			"dex-index": "342",
			"name": "Crawdaunt",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2022-05-13",
				"shadow": "2024-01-27"
			},
			"category": "Rogue",
			"type": [ "Water", "Dark" ],
			"evolves-from": "341",
			"base-stamina": 160,
			"base-attack": 224,
			"base-defense": 142,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_NOR_VISEGRIP",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_WAT_CRABHAMMER",
				"CHRG_WAT_RAZORSHELL",
				"CHRG_WAT_SCALD"
			],
			"height-avg": 1.09,
			"weight-avg": 32.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 4.1,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"343": {
			"dex-index": "343",
			"name": "Baltoy",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2020-03-27"
			},
			"category": "Clay Doll",
			"type": [ "Ground", "Psychic" ],
			"evolves-into": [ "344" ],
			"base-stamina": 120,
			"base-attack": 77,
			"base-defense": 124,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_EXTRASENSORY"
			],
			"charged-moves": [
				"CHRG_STE_GYROBALL",
				"CHRG_PSY_PSYBEAM",
				"CHRG_GRO_DIG"
			],
			"height-avg": 0.51,
			"weight-avg": 21.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.06375,
				"wt-std-dev": 2.6875,
				"xxs": [ 0.2499, 0.255 ],
				"xs": [ 0.255, 0.3825 ],
				"m": [ 0.3825, 0.6375 ],
				"xl": [ 0.6375, 0.765 ],
				"xxl": [ 0.765, 0.8925 ]
			}
		},
		"344": {
			"dex-index": "344",
			"name": "Claydol",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2020-03-27"
			},
			"category": "Clay Doll",
			"type": [ "Ground", "Psychic" ],
			"evolves-from": "343",
			"base-stamina": 155,
			"base-attack": 140,
			"base-defense": 229,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_EXTRASENSORY",
				"FAST_PSY_CONFUSION",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_STE_GYROBALL",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_ICE_ICEBEAM",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 1.5,
			"weight-avg": 108,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 13.5,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"345": {
			"dex-index": "345",
			"name": "Lileep",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2019-06-04",
				"shadow": "2021-02-02",
				"shiny-shadow": "2024-08-08"
			},
			"category": "Sea Lily",
			"type": [ "Rock", "Grass" ],
			"evolves-into": [ "346" ],
			"base-stamina": 165,
			"base-attack": 105,
			"base-defense": 150,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_ACID",
				"FAST_BUG_INFESTATION",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_PSY_MIRRORCOAT",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 0.99,
			"weight-avg": 23.8,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 2.975,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.98 ]
			}
		},
		"346": {
			"dex-index": "346",
			"name": "Cradily",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2019-06-04",
				"shadow": "2021-02-02",
				"shiny-shadow": "2024-08-08"
			},
			"category": "Barnacle",
			"type": [ "Rock", "Grass" ],
			"evolves-from": "345",
			"base-stamina": 200,
			"base-attack": 152,
			"base-defense": 194,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_ACID",
				"FAST_BUG_INFESTATION",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRO_BULLDOZE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 1.5,
			"weight-avg": 60.4,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 7.55,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 3 ]
			}
		},
		"347": {
			"dex-index": "347",
			"name": "Anorith",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2019-06-04",
				"shadow": "2021-02-02",
				"shiny-shadow": "2024-08-08"
			},
			"category": "Old Shrimp",
			"type": [ "Rock", "Bug" ],
			"evolves-into": [ "348" ],
			"base-stamina": 128,
			"base-attack": 176,
			"base-defense": 100,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_POI_CROSSPOISON",
				"CHRG_WAT_AQUAJET",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 0.71,
			"weight-avg": 12.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 1.5625,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"348": {
			"dex-index": "348",
			"name": "Armaldo",
			"availability": {
				"in-game": "2018-01-23",
				"shiny": "2019-06-04",
				"shadow": "2021-02-02",
				"shiny-shadow": "2024-08-08"
			},
			"category": "Plate",
			"type": [ "Rock", "Bug" ],
			"evolves-from": "347",
			"base-stamina": 181,
			"base-attack": 222,
			"base-defense": 174,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_POI_CROSSPOISON",
				"CHRG_WAT_WATERPULSE",
				"CHRG_ROC_ROCKBLAST",
				"CHRG_WAT_LIQUIDATION"
			],
			"height-avg": 1.5,
			"weight-avg": 68.2,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 8.525,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 3 ]
			}
		},
		"349": {
			"dex-index": "349",
			"name": "Feebas",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-01-19"
			},
			"category": "Fish",
			"type": [ "Water" ],
			"evolves-into": [ "350" ],
			"base-stamina": 85,
			"base-attack": 29,
			"base-defense": 85,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_SPLASH",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_PSY_MIRRORCOAT"
			],
			"height-avg": 0.61,
			"weight-avg": 7.4,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.925,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.22 ]
			}
		},
		"350": {
			"dex-index": "350",
			"name": "Milotic",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2019-01-19"
			},
			"category": "Tender",
			"type": [ "Water" ],
			"evolves-from": "349",
			"base-stamina": 216,
			"base-attack": 192,
			"base-defense": 219,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_ICE_BLIZZARD",
				"CHRG_NOR_HYPERBEAM"
			],
			"height-avg": 6.2,
			"weight-avg": 162,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.775,
				"wt-std-dev": 20.25,
				"xxs": [ 3.038, 3.1 ],
				"xs": [ 3.1, 4.65 ],
				"m": [ 4.65, 7.75 ],
				"xl": [ 7.75, 9.3 ],
				"xxl": [ 9.3, 12.4 ]
			}
		},
		"351": {
			"dex-index": "351",
			"name": "Castform",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2019-03-30"
			},
			"forms": [ "351", "351-U", "351-R", "351-N" ],
			"category": "Weather",
			"type": [ "Normal" ],
			"base-stamina": 172,
			"base-attack": 139,
			"base-defense": 139,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GHO_HEX"
			],
			"charged-moves": [
				"CHRG_FLY_HURRICANE",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_ROC_WEATHERBALL",
				"CHRG_NOR_WEATHERBALL"
			],
			"height-avg": 0.3,
			"weight-avg": 0.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.1,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"351-U": {
			"dex-index": "351-U",
			"form-data": {
				"base": "351",
				"type": "idk yet",
				"form": "Sunny Form",
				"form-ital": "Forma Sole"
			},
			"type": [ "Fire" ],
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_GRA_SOLARBEAM",
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_WEATHERBALL"
			]
		},
		"351-R": {
			"dex-index": "351-R",
			"form-data": {
				"base": "351",
				"type": "idk yet",
				"form": "Rainy Form",
				"form-ital": "Forma Pioggia"
			},
			"type": [ "Water" ],
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDER",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_WAT_WEATHERBALL"
			]
		},
		"351-N": {
			"dex-index": "351-N",
			"form-data": {
				"base": "351",
				"type": "idk yet",
				"form": "Snowy Form",
				"form-ital": "Forma Nuvola di Neve"
			},
			"type": [ "Ice" ],
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_ICE_ICEBEAM",
				"CHRG_ICE_BLIZZARD",
				"CHRG_ICE_WEATHERBALL"
			]
		},
		"352": {
			"dex-index": "352",
			"name": "Kecleon",
			"availability": {
				"in-game": "2023-01-07",
				"shiny": "2023-02-18"
			},
			"category": "Color Swap",
			"type": [ "Normal" ],
			"base-stamina": 155,
			"base-attack": 161,
			"base-defense": 189,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_DAR_FOULPLAY",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_ELE_THUNDER",
				"CHRG_ICE_ICEBEAM",
				"CHRG_FLY_AERIALACE",
				"CHRG_GHO_SHADOWSNEAK"
			],
			"height-avg": 0.99,
			"weight-avg": 22,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 2.75,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.5345 ]
			}
		},
		"353": {
			"dex-index": "353",
			"name": "Shuppet",
			"availability": {
				"in-game": "2017-10-20",
				"shiny": "2017-10-31",
				"shadow": "2019-10-17"
			},
			"category": "Puppet",
			"type": [ "Ghost" ],
			"evolves-into": [ "354" ],
			"base-stamina": 127,
			"base-attack": 138,
			"base-defense": 65,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_GHO_SHADOWSNEAK"
			],
			"height-avg": 0.61,
			"weight-avg": 2.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.2875,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"354": {
			"dex-index": "354",
			"name": "Banette",
			"availability": {
				"in-game": "2017-10-20",
				"shiny": "2017-10-31",
				"shadow": "2019-10-17"
			},
			"category": "Marionette",
			"type": [ "Ghost" ],
			"evolves-from": "353",
			"base-stamina": 162,
			"base-attack": 218,
			"base-defense": 126,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 1.09,
			"weight-avg": 12.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 1.5625,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"354-M": {
			"dex-index": "354-M",
			"name": "Mega Banette",
			"form-data": {
				"base": "354",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-10-20",
				"shiny": "2022-10-20",
				"shadow": false
			},
			"height-avg": 1.2,
			"weight-avg": 13,
			"base-stamina": 162,
			"base-attack": 312,
			"base-defense": 160,
			"size-data": {
				"class": 1.75,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"355": {
			"dex-index": "355",
			"name": "Duskull",
			"availability": {
				"in-game": "2017-10-20",
				"shiny": "2017-10-26",
				"shadow": "2019-10-17"
			},
			"category": "Requiem",
			"type": [ "Ghost" ],
			"evolves-into": [ "356" ],
			"base-stamina": 85,
			"base-attack": 70,
			"base-defense": 162,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_GHO_SHADOWSNEAK"
			],
			"height-avg": 0.79,
			"weight-avg": 15,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 1.875,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"356": {
			"dex-index": "356",
			"name": "Dusclops",
			"availability": {
				"in-game": "2017-10-20",
				"shiny": "2017-10-26",
				"shadow": "2019-10-17"
			},
			"category": "Beckon",
			"type": [ "Ghost" ],
			"evolves-from": "355",
			"evolves-into": [ "477" ],
			"base-stamina": 120,
			"base-attack": 124,
			"base-defense": 234,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWPUNCH",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_FIR_FIREPUNCH",
				"CHRG_GHO_POLTERGEIST"
			],
			"height-avg": 1.6,
			"weight-avg": 30.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 3.825,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"357": {
			"dex-index": "357",
			"name": "Tropius",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2023-02-18"
			},
			"category": "Fruit",
			"type": [ "Grass", "Flying" ],
			"base-stamina": 223,
			"base-attack": 136,
			"base-defense": 163,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_FLY_AERIALACE",
				"CHRG_GRA_LEAFBLADE",
				"CHRG_DAR_BRUTALSWING"
			],
			"height-avg": 2.01,
			"weight-avg": 100,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 12.5,
				"xxs": [ 0.9849, 1.005 ],
				"xs": [ 1.005, 1.5075 ],
				"m": [ 1.5075, 2.5125 ],
				"xl": [ 2.5125, 3.015 ],
				"xxl": [ 3.015, 4.02 ]
			}
		},
		"358": {
			"dex-index": "358",
			"name": "Chimecho",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2021-07-17"
			},
			"category": "Wind Chime",
			"type": [ "Psychic" ],
			"evolves-from": "433",
			"base-stamina": 181,
			"base-attack": 175,
			"base-defense": 170,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_EXTRASENSORY",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 0.61,
			"weight-avg": 1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 0.125,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 0.9455 ]
			}
		},
		"359": {
			"dex-index": "359",
			"name": "Absol",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2017-12-08",
				"shadow": "2019-12-24",
				"shiny-shadow": "2019-12-24"
			},
			"category": "Disaster",
			"type": [ "Dark" ],
			"base-stamina": 163,
			"base-attack": 246,
			"base-defense": 120,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_PSYCHOCUT",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_ELE_THUNDER",
				"CHRG_BUG_MEGAHORN",
				"CHRG_DAR_PAYBACK"
			],
			"height-avg": 1.2,
			"weight-avg": 47,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 5.875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"359-M": {
			"dex-index": "359-M",
			"name": "Mega Absol",
			"form-data": {
				"base": "359",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2021-10-22",
				"shiny": "2021-10-22",
				"shadow": false
			},
			"height-avg": 1.2,
			"weight-avg": 49,
			"base-stamina": 163,
			"base-attack": 314,
			"base-defense": 130,
			"size-data": {
				"class": 1.55,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"360": {
			"dex-index": "360",
			"name": "Wynaut",
			"availability": {
				"in-game": "2017-12-08",
				"shiny": "2018-03-22"
			},
			"category": "Bright",
			"type": [ "Psychic" ],
			"evolves-into": [ "202" ],
			"base-stamina": 216,
			"base-attack": 41,
			"base-defense": 86,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_SPLASH",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_PSY_MIRRORCOAT"
			],
			"height-avg": 0.61,
			"weight-avg": 14,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.75,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"361": {
			"dex-index": "361",
			"name": "Snorunt",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2017-12-22",
				"shadow": "2024-01-27"
			},
			"category": "Snow Hat",
			"type": [ "Ice" ],
			"evolves-into": [ "362", "478" ],
			"base-stamina": 137,
			"base-attack": 95,
			"base-defense": 95,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_GHO_HEX"
			],
			"charged-moves": [
				"CHRG_ICE_AVALANCHE",
				"CHRG_ICE_ICYWIND",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 0.71,
			"weight-avg": 16.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.08875,
				"wt-std-dev": 2.1,
				"xxs": [ 0.3479, 0.355 ],
				"xs": [ 0.355, 0.5325 ],
				"m": [ 0.5325, 0.8875 ],
				"xl": [ 0.8875, 1.065 ],
				"xxl": [ 1.065, 1.2425 ]
			}
		},
		"362": {
			"dex-index": "362",
			"name": "Glalie",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2017-12-22",
				"shadow": "2024-01-27"
			},
			"category": "Face",
			"type": [ "Ice" ],
			"evolves-from": "361",
			"base-stamina": 190,
			"base-attack": 162,
			"base-defense": 162,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_ICESHARD",
				"FAST_ICE_FROSTBREATH"
			],
			"charged-moves": [
				"CHRG_ICE_AVALANCHE",
				"CHRG_STE_GYROBALL",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 1.5,
			"weight-avg": 256.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 32.0625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"362-M": {
			"dex-index": "362-M",
			"name": "Mega Glalie",
			"form-data": {
				"base": "362",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-12-15",
				"shiny": "2022-12-15",
				"shadow": false
			},
			"height-avg": 2.1,
			"weight-avg": 350.2,
			"base-stamina": 190,
			"base-attack": 252,
			"base-defense": 168,
			"size-data": {
				"class": 1.75,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.675 ]
			}
		},
		"363": {
			"dex-index": "363",
			"name": "Spheal",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2021-12-31",
				"shadow": "2021-02-02"
			},
			"category": "Clap",
			"type": [ "Ice", "Water" ],
			"evolves-into": [ "364" ],
			"base-stamina": 172,
			"base-attack": 95,
			"base-defense": 90,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_ICE_AURORABEAM",
				"CHRG_NOR_BODYSLAM",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 0.79,
			"weight-avg": 39.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.09875,
				"wt-std-dev": 4.9375,
				"xxs": [ 0.3871, 0.395 ],
				"xs": [ 0.395, 0.5925 ],
				"m": [ 0.5925, 0.9875 ],
				"xl": [ 0.9875, 1.185 ],
				"xxl": [ 1.185, 1.3825 ]
			}
		},
		"364": {
			"dex-index": "364",
			"name": "Sealeo",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2021-12-31",
				"shadow": "2021-02-02"
			},
			"category": "Ball Roll",
			"type": [ "Ice", "Water" ],
			"evolves-from": "363",
			"evolves-into": [ "365" ],
			"base-stamina": 207,
			"base-attack": 137,
			"base-defense": 132,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_ICE_AURORABEAM",
				"CHRG_NOR_BODYSLAM",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 1.09,
			"weight-avg": 87.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 10.95,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"365": {
			"dex-index": "365",
			"name": "Walrein",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2021-12-31",
				"shadow": "2021-02-02"
			},
			"category": "Ice Break",
			"type": [ "Ice", "Water" ],
			"evolves-from": "364",
			"base-stamina": 242,
			"base-attack": 182,
			"base-defense": 176,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_ICE_FROSTBREATH"
			],
			"special-fast-moves": [
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_ICE_BLIZZARD",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_WAT_WATERPULSE"
			],
			"special-charged-moves": [
				"CHRG_ICE_ICICLESPEAR"
			],
			"height-avg": 1.4,
			"weight-avg": 150.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 18.825,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"366": {
			"dex-index": "366",
			"name": "Clamperl",
			"availability": {
				"in-game": "2019-02-23",
				"shiny": "2019-02-23"
			},
			"category": "Bivalve",
			"type": [ "Water" ],
			"evolves-into": [ "367", "368" ],
			"base-stamina": 111,
			"base-attack": 133,
			"base-defense": 135,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 0.41,
			"weight-avg": 52.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05125,
				"wt-std-dev": 6.5625,
				"xxs": [ 0.2009, 0.205 ],
				"xs": [ 0.205, 0.3075 ],
				"m": [ 0.3075, 0.5125 ],
				"xl": [ 0.5125, 0.615 ],
				"xxl": [ 0.615, 0.82 ]
			}
		},
		"367": {
			"dex-index": "367",
			"name": "Huntail",
			"availability": {
				"in-game": "2019-02-23",
				"shiny": "2019-02-23"
			},
			"category": "Deep Sea",
			"type": [ "Water" ],
			"evolves-from": "366",
			"base-stamina": 146,
			"base-attack": 197,
			"base-defense": 179,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_AQUATAIL"
			],
			"height-avg": 1.7,
			"weight-avg": 27,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 3.375,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 3.4 ]
			}
		},
		"368": {
			"dex-index": "368",
			"name": "Gorebyss",
			"availability": {
				"in-game": "2019-02-23",
				"shiny": "2019-02-23"
			},
			"category": "South Sea",
			"type": [ "Water" ],
			"evolves-from": "366",
			"base-stamina": 146,
			"base-attack": 211,
			"base-defense": 179,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_FAI_DRAININGKISS",
				"CHRG_PSY_PSYCHIC",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 1.8,
			"weight-avg": 22.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.225,
				"wt-std-dev": 2.825,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.6 ]
			}
		},
		"369": {
			"dex-index": "369",
			"name": "Relicanth",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2023-02-18"
			},
			"category": "Longevity",
			"type": [ "Water", "Rock" ],
			"base-stamina": 225,
			"base-attack": 162,
			"base-defense": 203,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_WAT_AQUATAIL",
				"CHRG_WAT_HYDROPUMP"
			],
			"height-avg": 0.99,
			"weight-avg": 23.4,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.12375,
				"wt-std-dev": 2.925,
				"xxs": [ 0.4851, 0.495 ],
				"xs": [ 0.495, 0.7425 ],
				"m": [ 0.7425, 1.2375 ],
				"xl": [ 1.2375, 1.485 ],
				"xxl": [ 1.485, 1.98 ]
			}
		},
		"370": {
			"dex-index": "370",
			"name": "Luvdisc",
			"availability": {
				"in-game": "2017-12-21",
				"shiny": "2018-02-13"
			},
			"category": "Rendezvous",
			"type": [ "Water" ],
			"base-stamina": 125,
			"base-attack": 81,
			"base-defense": 128,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_FAI_DRAININGKISS",
				"CHRG_WAT_WATERPULSE",
				"CHRG_WAT_AQUAJET"
			],
			"height-avg": 0.61,
			"weight-avg": 8.7,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 1.0875,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.22 ]
			}
		},
		"371": {
			"dex-index": "371",
			"name": "Bagon",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2019-04-13",
				"shadow": "2019-12-24",
				"shiny-shadow": "2019-12-24"
			},
			"category": "Rock Head",
			"type": [ "Dragon" ],
			"evolves-into": [ "372" ],
			"base-stamina": 128,
			"base-attack": 134,
			"base-defense": 93,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_DRA_TWISTER",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.61,
			"weight-avg": 42.1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 5.2625,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.0675 ]
			}
		},
		"372": {
			"dex-index": "372",
			"name": "Shelgon",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2019-04-13",
				"shadow": "2019-12-24",
				"shiny-shadow": "2019-12-24"
			},
			"category": "Endurance",
			"type": [ "Dragon" ],
			"evolves-from": "371",
			"evolves-into": [ "373" ],
			"base-stamina": 163,
			"base-attack": 172,
			"base-defense": 155,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_DRA_DRAGONBREATH"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_DRA_TWISTER"
			],
			"height-avg": 1.09,
			"weight-avg": 110.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.13625,
				"wt-std-dev": 13.8125,
				"xxs": [ 0.5341, 0.545 ],
				"xs": [ 0.545, 0.8175 ],
				"m": [ 0.8175, 1.3625 ],
				"xl": [ 1.3625, 1.635 ],
				"xxl": [ 1.635, 1.9075 ]
			}
		},
		"373": {
			"dex-index": "373",
			"name": "Salamence",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2019-04-13",
				"shadow": "2019-12-24",
				"shiny-shadow": "2019-12-24"
			},
			"category": "Dragon",
			"type": [ "Dragon", "Flying" ],
			"evolves-from": "372",
			"base-stamina": 216,
			"base-attack": 277,
			"base-defense": 168,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_FIR_FIREFANG",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_DRA_DRACOMETEOR",
				"CHRG_FLY_FLY"
			],
			"special-charged-moves": [
				"CHRG_DRA_OUTRAGE"
			],
			"height-avg": 1.5,
			"weight-avg": 102.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 12.825,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 3 ]
			}
		},
		"373-M": {
			"dex-index": "373-M",
			"name": "Mega Salamence",
			"form-data": {
				"base": "373",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-01-10",
				"shiny": "2023-01-10",
				"shadow": false
			},
			"height-avg": 1.8,
			"weight-avg": 112.6,
			"base-stamina": 216,
			"base-attack": 310,
			"base-defense": 251,
			"size-data": {
				"class": 2.00,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.6 ]
			}
		},
		"374": {
			"dex-index": "374",
			"name": "Beldum",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2020-10-21",
				"shadow": "2020-02-03",
				"shiny-shadow": "2020-02-03",
				"dynamax": "2024-09-18"
			},
			"category": "Iron Ball",
			"type": [ "Steel", "Psychic" ],
			"evolves-into": [ "375" ],
			"base-stamina": 120,
			"base-attack": 96,
			"base-defense": 132,
			"dynamax-class": 3,
			"max-battle-tier": 3,
			"fast-moves": [
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_STE_IRONHEAD"
			],
			"height-avg": 0.61,
			"weight-avg": 95.2,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.07625,
				"wt-std-dev": 11.9,
				"xxs": [ 0.2989, 0.305 ],
				"xs": [ 0.305, 0.4575 ],
				"m": [ 0.4575, 0.7625 ],
				"xl": [ 0.7625, 0.915 ],
				"xxl": [ 0.915, 1.22 ]
			}
		},
		"375": {
			"dex-index": "375",
			"name": "Metang",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2020-10-21",
				"shadow": "2020-02-03",
				"shiny-shadow": "2020-02-03",
				"dynamax": "2024-09-18"
			},
			"category": "Iron Claw",
			"type": [ "Steel", "Psychic" ],
			"evolves-from": "374",
			"evolves-into": [ "376" ],
			"base-stamina": 155,
			"base-attack": 138,
			"base-defense": 176,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC",
				"CHRG_STE_GYROBALL"
			],
			"height-avg": 1.19,
			"weight-avg": 202.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.14875,
				"wt-std-dev": 25.3125,
				"xxs": [ 0.5831, 0.595 ],
				"xs": [ 0.595, 0.8925 ],
				"m": [ 0.8925, 1.4875 ],
				"xl": [ 1.4875, 1.785 ],
				"xxl": [ 1.785, 2.38 ]
			}
		},
		"376": {
			"dex-index": "376",
			"name": "Metagross",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2020-10-21",
				"shadow": "2020-02-03",
				"shiny-shadow": "2020-02-03",
				"dynamax": "2024-09-18"
			},
			"category": "Iron Leg",
			"type": [ "Steel", "Psychic" ],
			"evolves-from": "375",
			"base-stamina": 190,
			"base-attack": 257,
			"base-defense": 228,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_BULLETPUNCH",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_STE_FLASHCANNON",
				"CHRG_PSY_PSYCHIC"
			],
			"special-charged-moves": [
				"CHRG_STE_METEORMASH"
			],
			"height-avg": 1.6,
			"weight-avg": 550,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2,
				"wt-std-dev": 68.75,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 3.2 ]
			}
		},
		"376-M": {
			"dex-index": "376-M",
			"name": "Mega Metagross",
			"form-data": {
				"base": "376",
				"type": "Mega"
			},
			"availability": {
				"in-game": false
			},
			"height-avg": 2.5,
			"weight-avg": 942.9
		},
		"377": {
			"dex-index": "377",
			"name": "Regirock",
			"availability": {
				"in-game": "2018-08-16",
				"shiny": "2019-11-01",
				"shadow": "2023-06-21",
				"shiny-shadow": "2024-12-03"
			},
			"category": "Rock Peak",
			"type": [ "Rock" ],
			"base-stamina": 190,
			"base-attack": 179,
			"base-defense": 309,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_FIG_ROCKSMASH",
				"FAST_NOR_LOCKON"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_ELE_ZAPCANNON",
				"CHRG_FIG_FOCUSBLAST"
			],
			"special-charged-moves": [
				"CHRG_GRO_EARTHQUAKE"
			],
			"height-avg": 1.7,
			"weight-avg": 230,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 28.75,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"378": {
			"dex-index": "378",
			"name": "Regice",
			"availability": {
				"in-game": "2018-06-21",
				"shiny": "2019-12-01",
				"shadow": "2023-03-25",
				"shiny-shadow": "2024-12-03"
			},
			"category": "Iceberg",
			"type": [ "Ice" ],
			"base-stamina": 190,
			"base-attack": 179,
			"base-defense": 309,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ICE_FROSTBREATH",
				"FAST_FIG_ROCKSMASH",
				"FAST_NOR_LOCKON"
			],
			"charged-moves": [
				"CHRG_ICE_BLIZZARD",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_FIG_FOCUSBLAST"
			],
			"special-charged-moves": [
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 1.8,
			"weight-avg": 175,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 21.875,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"379": {
			"dex-index": "379",
			"name": "Registeel",
			"availability": {
				"in-game": "2018-07-19",
				"shiny": "2019-11-01",
				"shadow": "2023-02-01",
				"shiny-shadow": "2024-12-03"
			},
			"category": "Iron",
			"type": [ "Steel" ],
			"base-stamina": 190,
			"base-attack": 143,
			"base-defense": 285,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_FIG_ROCKSMASH",
				"FAST_NOR_LOCKON"
			],
			"charged-moves": [
				"CHRG_STE_FLASHCANNON",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FIG_FOCUSBLAST"
			],
			"special-charged-moves": [
				"CHRG_ELE_ZAPCANNON"
			],
			"height-avg": 1.91,
			"weight-avg": 205,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.23875,
				"wt-std-dev": 25.625,
				"xxs": [ 0.9359, 0.955 ],
				"xs": [ 0.955, 1.4325 ],
				"m": [ 1.4325, 2.3875 ],
				"xl": [ 2.3875, 2.865 ],
				"xxl": [ 2.865, 2.9605 ]
			}
		},
		"380": {
			"dex-index": "380",
			"name": "Latias",
			"availability": {
				"in-game": "2018-04-02",
				"shiny": "2019-02-22",
				"shadow": "2022-04-03"
			},
			"category": "Eon",
			"type": [ "Dragon", "Psychic" ],
			"base-stamina": 190,
			"base-attack": 228,
			"base-defense": 246,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_DRA_OUTRAGE",
				"CHRG_ELE_THUNDER"
			],
			"special-charged-moves": [
				"CHRG_PSY_MISTBALL"
			],
			"height-avg": 1.4,
			"weight-avg": 40,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 5,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"380-M": {
			"dex-index": "380-M",
			"name": "Mega Latias",
			"form-data": {
				"base": "380",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-05-03",
				"shadow": false
			},
			"base-stamina": 190,
			"base-attack": 289,
			"base-defense": 297,
			"height-avg": 1.8,
			"weight-avg": 52,
			"size-data": {
				"class": 1.75,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"381": {
			"dex-index": "381",
			"name": "Latios",
			"availability": {
				"in-game": "2018-04-02",
				"shiny": "2019-04-15",
				"shadow": "2022-07-09"
			},
			"category": "Eon",
			"type": [ "Dragon", "Psychic" ],
			"base-stamina": 190,
			"base-attack": 268,
			"base-defense": 212,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_GRA_SOLARBEAM"
			],
			"special-charged-moves": [
				"CHRG_PSY_LUSTERPURGE"
			],
			"height-avg": 2.01,
			"weight-avg": 60,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25125,
				"wt-std-dev": 7.5,
				"xxs": [ 0.9849, 1.005 ],
				"xs": [ 1.005, 1.5075 ],
				"m": [ 1.5075, 2.5125 ],
				"xl": [ 2.5125, 3.015 ],
				"xxl": [ 3.015, 3.1155 ]
			}
		},
		"381-M": {
			"dex-index": "381-M",
			"name": "Mega Latios",
			"form-data": {
				"base": "381",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2022-05-03",
				"shadow": false
			},
			"base-stamina": 190,
			"base-attack": 335,
			"base-defense": 241,
			"height-avg": 2.3,
			"weight-avg": 70,
			"size-data": {
				"class": 1.75,
				"xxs": [ 1.127, 1.15 ],
				"xs": [ 1.15, 1.725 ],
				"m": [ 1.725, 2.875 ],
				"xl": [ 2.875, 3.45 ],
				"xxl": [ 3.45, 4.025 ]
			}
		},
		"382": {
			"dex-index": "382",
			"name": "Kyogre",
			"availability": {
				"in-game": "2018-01-12",
				"shiny": "2018-06-07",
				"shadow": "2024-01-27"
			},
			"category": "Sea Basin",
			"type": [ "Water" ],
			"base-stamina": 205,
			"base-attack": 270,
			"base-defense": 228,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_BLIZZARD",
				"CHRG_ELE_THUNDER",
				"CHRG_WAT_SURF"
			],
			"special-charged-moves": [
				"CHRG_WAT_ORIGINPULSE"
			],
			"height-avg": 4.5,
			"weight-avg": 352,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.5625,
				"wt-std-dev": 44,
				"xxs": [ 2.205, 2.25 ],
				"xs": [ 2.25, 3.375 ],
				"m": [ 3.375, 5.625 ],
				"xl": [ 5.625, 6.75 ],
				"xxl": [ 6.75, 6.975 ]
			}
		},
		"382-P": {
			"dex-index": "382-P",
			"name": "Primal Kyogre",
			"form-data": {
				"base": "382",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-02-18",
				"shiny": "2023-02-18",
				"shadow": false
			},
			"base-stamina": 218,
			"base-attack": 353,
			"base-defense": 268,
			"height-avg": 9.8,
			"weight-avg": 430,
			"size-data": {
				"class": 1.55,
				"xxs": [ 4.802, 4.9 ],
				"xs": [ 4.9, 7.35 ],
				"m": [ 7.35, 12.25 ],
				"xl": [ 12.25, 14.7 ],
				"xxl": [ 14.7, 15.19 ]
			}
		},
		"383": {
			"dex-index": "383",
			"name": "Groudon",
			"availability": {
				"in-game": "2017-12-15",
				"shiny": "2019-01-15",
				"shadow": "2024-03-27"
			},
			"category": "Continent",
			"type": [ "Ground" ],
			"base-stamina": 205,
			"base-attack": 270,
			"base-defense": 228,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_FIR_FIREBLAST",
				"CHRG_GRA_SOLARBEAM"
			],
			"special-charged-moves": [
				"CHRG_FIR_FIREPUNCH",
				"CHRG_GRO_PRECIPICEBLADES"
			],
			"height-avg": 3.51,
			"weight-avg": 950,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.43875,
				"wt-std-dev": 118.75,
				"xxs": [ 1.7199, 1.755 ],
				"xs": [ 1.755, 2.6325 ],
				"m": [ 2.6325, 4.3875 ],
				"xl": [ 4.3875, 5.265 ],
				"xxl": [ 5.265, 5.4405 ]
			}
		},
		"383-P": {
			"dex-index": "383-P",
			"name": "Primal Groudon",
			"form-data": {
				"base": "383",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-02-18",
				"shiny": "2023-02-18",
				"shadow": false
			},
			"type": [ "Ground", "Fire" ],
			"base-stamina": 218,
			"base-attack": 353,
			"base-defense": 268,
			"height-avg": 5,
			"weight-avg": 999.7,
			"size-data": {
				"class": 1.55,
				"xxs": [ 2.45, 2.5 ],
				"xs": [ 2.5, 3.75 ],
				"m": [ 3.75, 6.25 ],
				"xl": [ 6.25, 7.5 ],
				"xxl": [ 7.5, 7.75 ]
			}
		},
		"384": {
			"dex-index": "384",
			"name": "Rayquaza",
			"availability": {
				"in-game": "2018-02-09",
				"shiny": "2019-06-31"
			},
			"category": "Sky High",
			"type": [ "Dragon", "Flying" ],
			"base-stamina": 213,
			"base-attack": 284,
			"base-defense": 170,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_FLY_AERIALACE",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"special-charged-moves": [
				"CHRG_FLY_HURRICANE",
				"CHRG_DRA_BREAKINGSWIPE",
				"CHRG_FLY_DRAGONASCENT"
			],
			"height-avg": 7.01,
			"weight-avg": 206.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.87625,
				"wt-std-dev": 25.8125,
				"xxs": [ 3.4349, 3.505 ],
				"xs": [ 3.505, 5.2575 ],
				"m": [ 5.2575, 8.7625 ],
				"xl": [ 8.7625, 10.515 ],
				"xxl": [ 10.515, 10.8655 ]
			}
		},
		"384-M": {
			"dex-index": "384-M",
			"name": "Mega Rayquaza",
			"form-data": {
				"base": "384",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-08-04",
				"shiny": "2023-08-04",
				"shadow": false
			},
			"base-stamina": 227,
			"base-attack": 377,
			"base-defense": 210,
			"height-avg": 10.8,
			"weight-avg": 392,
			"size-data": {
				"class": 1.55,
				"xxs": [ 5.292, 5.4 ],
				"xs": [ 5.4, 8.1 ],
				"m": [ 8.1, 13.5 ],
				"xl": [ 13.5, 16.2 ],
				"xxl": [ 16.2, 16.74 ]
			}
		},
		"385": {
			"dex-index": "385",
			"name": "Jirachi",
			"availability": {
				"in-game": "2019-06-13",
				"shiny": "2023-02-18",
				"shadow": false
			},
			"category": "Wish",
			"type": [ "Steel", "Psychic" ],
			"base-stamina": 225,
			"base-attack": 210,
			"base-defense": 210,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_PSY_PSYCHIC"
			],
			"special-charged-moves": [
				"CHRG_STE_DOOMDESIRE"
			],
			"height-avg": 0.3,
			"weight-avg": 1.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.1375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"386": {
			"dex-index": "386",
			"name": "Deoxys",
			"availability": {
				"in-game": "2018-09-21",
				"shiny": "2020-08-07"
			},
			"category": "DNA",
			"type": [ "Psychic" ],
			"base-stamina": 137,
			"base-attack": 345,
			"base-defense": 115,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_PSY_PSYCHOBOOST"
			],
			"height-avg": 1.7,
			"weight-avg": 60.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 7.6,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"386-A": {
			"dex-index": "386-A",
			"form-data": {
				"base": "386",
				"type": "fuck if i know",
				"form": "Attack Forme",
				"form-ital": "Forma Attacco"
			},
			"availability": {
				"in-game": "2018-12-20",
				"shiny": "2022-02-19"
			},
			"base-stamina": 137,
			"base-attack": 414,
			"base-defense": 46,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_ELE_ZAPCANNON",
				"CHRG_DAR_DARKPULSE",
				"CHRG_PSY_PSYCHOBOOST"
			]
		},
		"386-D": {
			"dex-index": "386-D",
			"form-data": {
				"base": "386",
				"type": "fuck if i know",
				"form": "Defense Forme",
				"form-ital": "Forma Difesa"
			},
			"availability": {
				"in-game": "2019-03-25",
				"shiny": "2022-02-22"
			},
			"base-stamina": 137,
			"base-attack": 144,
			"base-defense": 330,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_PSY_PSYCHOBOOST"
			]
		},
		"386-S": {
			"dex-index": "386-S",
			"form-data": {
				"base": "386",
				"type": "fuck if i know",
				"form": "Speed Forme",
				"form-ital": "Forma Velocita",
				"form-ital-display": "Forma Velocit\`a" // "todo" Accented a
			},
			"availability": {
				"in-game": "2019-06-28",
				"shiny": "2022-02-25"
			},
			"base-stamina": 137,
			"base-attack": 230,
			"base-defense": 218,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_NOR_SWIFT",
				"CHRG_PSY_PSYCHOBOOST"
			]
		},
		"387": {
			"dex-index": "387",
			"name": "Turtwig",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2019-09-15",
				"shadow": "2019-09-05"
			},
			"category": "Tiny Leaf",
			"type": [ "Grass" ],
			"evolves-into": [ "388" ],
			"base-stamina": 146,
			"base-attack": 119,
			"base-defense": 110,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.4,
			"weight-avg": 10.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1.275,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"388": {
			"dex-index": "388",
			"name": "Grotle",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2019-09-15",
				"shadow": "2019-09-05"
			},
			"category": "Grove",
			"type": [ "Grass" ],
			"evolves-from": "387",
			"evolves-into": [ "389" ],
			"base-stamina": 181,
			"base-attack": 157,
			"base-defense": 143,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 1.1,
			"weight-avg": 97,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 12.125,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"389": {
			"dex-index": "389",
			"name": "Torterra",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2019-09-15",
				"shadow": "2019-09-05"
			},
			"category": "Continent",
			"type": [ "Grass", "Ground" ],
			"evolves-from": "388",
			"base-stamina": 216,
			"base-attack": 202,
			"base-defense": 188,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_GRO_SANDTOMB"
			],
			"special-charged-moves": [
				"CHRG_GRA_FRENZYPLANT"
			],
			"height-avg": 2.2,
			"weight-avg": 310,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.275,
				"wt-std-dev": 38.75,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.41 ]
			}
		},
		"390": {
			"dex-index": "390",
			"name": "Chimchar",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2019-11-16",
				"shadow": "2024-01-27"
			},
			"category": "Chimp",
			"type": [ "Fire" ],
			"evolves-into": [ "391" ],
			"base-stamina": 127,
			"base-attack": 113,
			"base-defense": 86,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMEWHEEL",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_FLAMECHARGE"
			],
			"height-avg": 0.5,
			"weight-avg": 6.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.775,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"391": {
			"dex-index": "391",
			"name": "Monferno",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2019-11-16",
				"shadow": "2024-01-27"
			},
			"category": "Playful",
			"type": [ "Fire", "Fighting" ],
			"evolves-from": "390",
			"evolves-into": [ "392" ],
			"base-stamina": 162,
			"base-attack": 158,
			"base-defense": 105,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMEWHEEL",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIG_LOWSWEEP"
			],
			"height-avg": 0.9,
			"weight-avg": 22,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 2.75,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"392": {
			"dex-index": "392",
			"name": "Infernape",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2019-11-16",
				"shadow": "2024-01-27"
			},
			"category": "Flame",
			"type": [ "Fire", "Fighting" ],
			"evolves-from": "391",
			"base-stamina": 183,
			"base-attack": 222,
			"base-defense": 151,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_GRA_SOLARBEAM",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"special-charged-moves": [
				"CHRG_FIR_BLASTBURN"
			],
			"height-avg": 1.2,
			"weight-avg": 55,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 6.875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"393": {
			"dex-index": "393",
			"name": "Piplup",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2020-01-19",
				"shadow": "2024-01-27"
			},
			"category": "Penguin",
			"type": [ "Water" ],
			"evolves-into": [ "394" ],
			"base-stamina": 142,
			"base-attack": 112,
			"base-defense": 102,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_NOR_POUND"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_FLY_DRILLPECK",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 0.4,
			"weight-avg": 5.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.65,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"394": {
			"dex-index": "394",
			"name": "Prinplup",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2020-01-19",
				"shadow": "2024-01-27"
			},
			"category": "Penguin",
			"type": [ "Water" ],
			"evolves-from": "393",
			"evolves-into": [ "395" ],
			"base-stamina": 162,
			"base-attack": 150,
			"base-defense": 139,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 0.8,
			"weight-avg": 23,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.875,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"395": {
			"dex-index": "395",
			"name": "Empoleon",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2020-01-19",
				"shadow": "2024-01-27"
			},
			"category": "Emperor",
			"type": [ "Water", "Steel" ],
			"evolves-from": "394",
			"base-stamina": 197,
			"base-attack": 210,
			"base-defense": 186,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_STE_METALCLAW",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_BLIZZARD",
				"CHRG_STE_FLASHCANNON",
				"CHRG_FLY_DRILLPECK"
			],
			"special-charged-moves": [
				"CHRG_WAT_HYDROCANNON"
			],
			"height-avg": 1.7,
			"weight-avg": 84.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 10.5625,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"396": {
			"dex-index": "396",
			"name": "Starly",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2022-07-17",
				"shadow": "2021-05-18"
			},
			"category": "Starling",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "397" ],
			"base-stamina": 120,
			"base-attack": 101,
			"base-defense": 58,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_QUICKATTACK",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FLY_FLY"
			],
			"height-avg": 0.3,
			"weight-avg": 2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.25,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"397": {
			"dex-index": "397",
			"name": "Staravia",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2022-07-17",
				"shadow": "2021-05-18"
			},
			"category": "Starling",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "396",
			"evolves-into": [ "398" ],
			"base-stamina": 146,
			"base-attack": 142,
			"base-defense": 94,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_NOR_QUICKATTACK",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FLY_FLY"
			],
			"height-avg": 0.6,
			"weight-avg": 15.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.9375,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"398": {
			"dex-index": "398",
			"name": "Staraptor",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2022-07-17",
				"shadow": "2021-05-18"
			},
			"category": "Predator",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "397",
			"base-stamina": 198,
			"base-attack": 234,
			"base-defense": 140,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_NOR_QUICKATTACK",
				"FAST_GRO_SANDATTACK"
			],
			"special-fast-moves": [
				"FAST_FLY_GUST"
			],
			"charged-moves": [
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FLY_FLY"
			],
			"height-avg": 1.2,
			"weight-avg": 24.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 3.1125,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"399": {
			"dex-index": "399",
			"name": "Bidoof",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2021-06-25",
				"shadow": "2021-06-25"
			},
			"category": "Plump Mouse",
			"type": [ "Normal" ],
			"evolves-into": [ "400" ],
			"base-stamina": 153,
			"base-attack": 80,
			"base-defense": 73,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERFANG",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRA_GRASSKNOT"
			],
			"special-charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ICE_ICEBEAM",
				"CHRG_FIG_SUPERPOWER"
			],
			"height-avg": 0.5,
			"weight-avg": 20,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 2.5,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"400": {
			"dex-index": "400",
			"name": "Bibarel",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2021-06-25",
				"shadow": "2021-06-25"
			},
			"category": "Beaver",
			"type": [ "Normal", "Water" ],
			"evolves-from": "399",
			"base-stamina": 188,
			"base-attack": 162,
			"base-defense": 119,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERFANG",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_WAT_SURF"
			],
			"height-avg": 1,
			"weight-avg": 31.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.9375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"401": {
			"dex-index": "401",
			"name": "Kricketot",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2020-10-02"
			},
			"category": "Cricket",
			"type": [ "Bug" ],
			"evolves-into": [ "402" ],
			"base-stamina": 114,
			"base-attack": 45,
			"base-defense": 74,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.3,
			"weight-avg": 2.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.275,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"402": {
			"dex-index": "402",
			"name": "Kricketune",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2020-10-02"
			},
			"category": "Cricket",
			"type": [ "Bug" ],
			"evolves-from": "401",
			"base-stamina": 184,
			"base-attack": 160,
			"base-defense": 100,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_BUG_XSCISSOR",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 1,
			"weight-avg": 25.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.1875,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"403": {
			"dex-index": "403",
			"name": "Shinx",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2018-10-16",
				"shadow": "2022-07-09"
			},
			"category": "Flash",
			"type": [ "Electric" ],
			"evolves-into": [ "404" ],
			"base-stamina": 128,
			"base-attack": 117,
			"base-defense": 64,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 0.5,
			"weight-avg": 9.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.1875,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"404": {
			"dex-index": "404",
			"name": "Luxio",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2018-10-16",
				"shadow": "2022-07-09"
			},
			"category": "Spark",
			"type": [ "Electric" ],
			"evolves-from": "403",
			"evolves-into": [ "405" ],
			"base-stamina": 155,
			"base-attack": 159,
			"base-defense": 95,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.9,
			"weight-avg": 30.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 3.8125,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"405": {
			"dex-index": "405",
			"name": "Luxray",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2018-10-16",
				"shadow": "2022-07-09"
			},
			"category": "Gleam Eyes",
			"type": [ "Electric" ],
			"evolves-from": "404",
			"base-stamina": 190,
			"base-attack": 232,
			"base-defense": 156,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_DAR_SNARL",
				"FAST_WAT_HIDDENPOWER"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_DAR_CRUNCH"
			],
			"special-charged-moves": [
				"CHRG_PSY_PSYCHICFANGS"
			],
			"height-avg": 1.4,
			"weight-avg": 42,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 5.25,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"406": {
			"dex-index": "406",
			"name": "Budew",
			"availability": {
				"in-game": "2018-11-06",
				"shiny": "2018-11-06"
			},
			"category": "Bud",
			"type": [ "Grass", "Poison" ],
			"evolves-into": [ "315" ],
			"base-stamina": 120,
			"base-attack": 91,
			"base-defense": 109,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.2,
			"weight-avg": 1.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.15,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"407": {
			"dex-index": "407",
			"name": "Roserade",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2018-11-14"
			},
			"category": "Bouquet",
			"type": [ "Grass", "Poison" ],
			"evolves-from": "315",
			"base-stamina": 155,
			"base-attack": 243,
			"base-defense": 185,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_MAGICALLEAF"
			],
			"special-fast-moves": [
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_SOLARBEAM",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_LEAFSTORM"
			],
			"special-charged-moves": [
				"CHRG_FIR_WEATHERBALL"
			],
			"height-avg": 0.9,
			"weight-avg": 14.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 1.8125,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"408": {
			"dex-index": "408",
			"name": "Cranidos",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2021-07-23",
				"shadow": "2023-10-26"
			},
			"category": "Head Butt",
			"type": [ "Rock" ],
			"evolves-into": [ "409" ],
			"base-stamina": 167,
			"base-attack": 218,
			"base-defense": 71,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKTOMB",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 0.9,
			"weight-avg": 31.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 3.9375,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"409": {
			"dex-index": "409",
			"name": "Rampardos",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2021-07-23",
				"shadow": "2023-10-26"
			},
			"category": "Head Butt",
			"type": [ "Rock" ],
			"evolves-from": "408",
			"base-stamina": 219,
			"base-attack": 295,
			"base-defense": 109,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_DRA_OUTRAGE",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 1.6,
			"weight-avg": 102.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2,
				"wt-std-dev": 12.8125,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 3.2 ]
			}
		},
		"410": {
			"dex-index": "410",
			"name": "Shieldon",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2021-07-23",
				"shadow": "2023-10-26"
			},
			"category": "Shield",
			"type": [ "Rock", "Steel" ],
			"evolves-into": [ "411" ],
			"base-stamina": 102,
			"base-attack": 76,
			"base-defense": 195,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKTOMB",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_STE_HEAVYSLAM"
			],
			"height-avg": 0.5,
			"weight-avg": 57,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 7.125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"411": {
			"dex-index": "411",
			"name": "Bastiodon",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2021-07-23",
				"shadow": "2023-10-26"
			},
			"category": "Shield",
			"type": [ "Rock", "Steel" ],
			"evolves-from": "410",
			"base-stamina": 155,
			"base-attack": 94,
			"base-defense": 286,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ROC_SMACKDOWN",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_STE_FLASHCANNON"
			],
			"height-avg": 1.3,
			"weight-avg": 149.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 18.6875,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"412-0": {
			"dex-index": "412-0",
			"name": "Burmy",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2019-12-05"
			},
			"category": "Bagworm",
			"type": [ "Bug" ],
			"evolves-into": [ "413-0", "414" ],
			"base-stamina": 120,
			"base-attack": 53,
			"base-defense": 83,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.2,
			"weight-avg": 3.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.425,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"412-P": {
			"dex-index": "412-P",
			"form-data": {
				"base": "412-0",
				"type": "idk",
				"form": "Plant Cloak",
				"form-ital": "Manto Pianta"
			},
			"evolves-into": [ "413-P", "414" ]
		},
		"412-S": {
			"dex-index": "412-S",
			"form-data": {
				"base": "412-0",
				"type": "idk",
				"form": "Sandy Cloak",
				"form-ital": "Manto Sabbia"
			},
			"evolves-into": [ "413-S", "414" ]
		},
		"412-T": {
			"dex-index": "412-T",
			"form-data": {
				"base": "412-0",
				"type": "idk",
				"form": "Trash Cloak",
				"form-ital": "Manto Scarti"
			},
			"evolves-into": [ "413-T", "414" ]
		},
		"413-0": {
			"dex-index": "413-0",
			"name": "Wormadam",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2019-12-05"
			},
			"category": "Bagworm",
			"evolves-from": "412-0",
			"dynamax-class": 1,
			"height-avg": 0.5,
			"weight-avg": 6.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.8125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"413-P": {
			"dex-index": "413-P",
			"form-data": {
				"base": "413-0",
				"type": "idk",
				"form": "Plant Cloak",
				"form-ital": "Manto Pianta"
			},
			"type": [ "Bug", "Grass" ],
			"evolves-from": "412-P",
			"base-stamina": 155,
			"base-attack": 141,
			"base-defense": 180,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_BUG_BUGBUZZ"
			]
		},
		"413-S": {
			"dex-index": "413-S",
			"form-data": {
				"base": "413-0",
				"type": "idk",
				"form": "Sandy Cloak",
				"form-ital": "Manto Sabbia"
			},
			"type": [ "Bug", "Ground" ],
			"evolves-from": "412-S",
			"base-stamina": 155,
			"base-attack": 141,
			"base-defense": 180,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_GRO_BULLDOZE",
				"CHRG_BUG_BUGBUZZ"
			]
		},
		"413-T": {
			"dex-index": "413-T",
			"form-data": {
				"base": "413-0",
				"type": "idk",
				"form": "Trash Cloak",
				"form-ital": "Manto Scarti"
			},
			"type": [ "Bug", "Steel" ],
			"evolves-from": "412-T",
			"base-stamina": 155,
			"base-attack": 127,
			"base-defense": 175,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_BUG_BUGBITE",
				"FAST_STE_METALSOUND"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_STE_IRONHEAD",
				"CHRG_BUG_BUGBUZZ"
			]
		},
		"414": {
			"dex-index": "414",
			"name": "Mothim",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2019-12-05"
			},
			"category": "Moth",
			"type": [ "Bug", "Flying" ],
			"evolves-from": "412-0",
			"base-stamina": 172,
			"base-attack": 185,
			"base-defense": 98,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_FLY_AERIALACE",
				"CHRG_BUG_BUGBUZZ"
			],
			"height-avg": 0.9,
			"weight-avg": 23.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 2.9125,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"415-0": {
			"dex-index": "415-0",
			"name": "Combee",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2022-07-22"
			},
			"category": "Tiny Bee",
			"type": [ "Bug", "Flying" ],
			"base-stamina": 102,
			"base-attack": 59,
			"base-defense": 83,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.6875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"415-M": {
			"dex-index": "415-M",
			"form-data": {
				"base": "415-0",
				"type": "Gender",
				"form": "Male"
			}
		},
		"415-F": {
			"dex-index": "415-F",
			"form-data": {
				"base": "415-0",
				"type": "Gender",
				"form": "Female"
			},
			"evolves-into": [ "416" ]
		},
		"416": {
			"dex-index": "416",
			"name": "Vespiquen",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2022-07-22"
			},
			"category": "Beehive",
			"type": [ "Bug", "Flying" ],
			"evolves-from": "415-F",
			"base-stamina": 172,
			"base-attack": 149,
			"base-defense": 190,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_POI_POISONSTING",
				"FAST_BUG_FURYCUTTER",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_ROC_POWERGEM",
				"CHRG_BUG_XSCISSOR",
				"CHRG_BUG_FELLSTINGER",
				"CHRG_BUG_SIGNALBEAM"
			],
			"height-avg": 1.2,
			"weight-avg": 38.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 4.8125,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"417": {
			"dex-index": "417",
			"name": "Pachirisu",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2024-02-16"
			},
			"category": "EleSquirrel",
			"type": [ "Electric" ],
			"base-stamina": 155,
			"base-attack": 94,
			"base-defense": 172,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDER",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 0.4,
			"weight-avg": 3.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.4875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"418": {
			"dex-index": "418",
			"name": "Buizel",
			"availability": {
				"in-game": "2018-11-06",
				"shiny": "2021-01-21"
			},
			"category": "Sea Weasel",
			"type": [ "Water" ],
			"evolves-into": [ "419" ],
			"base-stamina": 146,
			"base-attack": 132,
			"base-defense": 67,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_WATERPULSE",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 0.7,
			"weight-avg": 29.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 3.6875,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"419": {
			"dex-index": "419",
			"name": "Floatzel",
			"availability": {
				"in-game": "2018-11-06",
				"shiny": "2021-01-21"
			},
			"category": "Sea Weasel",
			"type": [ "Water" ],
			"evolves-from": "418",
			"base-stamina": 198,
			"base-attack": 221,
			"base-defense": 114,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_NOR_SWIFT",
				"CHRG_WAT_LIQUIDATION"
			],
			"height-avg": 1.1,
			"weight-avg": 33.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 4.1875,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"420": {
			"dex-index": "420",
			"name": "Cherubi",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2022-04-20"
			},
			"category": "Cherry",
			"type": [ "Grass" ],
			"evolves-into": [ "421" ],
			"base-stamina": 128,
			"base-attack": 108,
			"base-defense": 92,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.4,
			"weight-avg": 3.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.4125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"421": {
			"dex-index": "421",
			"name": "Cherrim",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2022-04-20"
			},
			"variants": [ "Overcast", "Sunny" ],
			"variants-ital": [ "Nuvola", "Splendore" ],
			"category": "Blossom",
			"type": [ "Grass" ],
			"evolves-from": "420",
			"base-stamina": 172,
			"base-attack": 170,
			"base-defense": 153,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.1625,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"422-0": {
			"dex-index": "422-0",
			"name": "Shellos",
			"availability": {
				"in-game": "2019-04-29",
				"shiny": "2023-08-26"
			},
			"category": "Sea Slug",
			"type": [ "Water" ],
			"evolves-into": [ "423-0" ],
			"base-stamina": 183,
			"base-attack": 103,
			"base-defense": 105,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_WAT_HIDDENPOWER"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_GRO_MUDBOMB",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.3,
			"weight-avg": 6.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.7875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"422-E": {
			"dex-index": "422-E",
			"form-data": {
				"base": "422-0",
				"type": "idk",
				"form": "Eastern Sea",
				"form-ital": "Mare Est"
			},
			"evolves-into": [ "423-E" ]
		},
		"422-W": {
			"dex-index": "422-W",
			"form-data": {
				"base": "422-0",
				"type": "idk",
				"form": "Western Sea",
				"form-ital": "Mare Ovest"
			},
			"evolves-into": [ "423-W" ]
		},
		"423-0": {
			"dex-index": "423-0",
			"name": "Gastrodon",
			"availability": {
				"in-game": "2019-04-29",
				"shiny": "2023-08-26"
			},
			"category": "Sea Slug",
			"type": [ "Water", "Ground" ],
			"evolves-from": "422-0",
			"base-stamina": 244,
			"base-attack": 169,
			"base-defense": 143,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_WAT_HIDDENPOWER"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_NOR_BODYSLAM"
			],
			"unobtainable-charged-moves": [
				"CHRG_GRO_EARTHQUAKE"
			],
			"height-avg": 0.9,
			"weight-avg": 29.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 3.7375,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"423-E": {
			"dex-index": "423-E",
			"form-data": {
				"base": "423-0",
				"type": "idk",
				"form": "Eastern Sea",
				"form-ital": "Mare Est"
			},
			"evolves-from": "422-E"
		},
		"423-W": {
			"dex-index": "423-W",
			"form-data": {
				"base": "423-0",
				"type": "idk",
				"form": "Western Sea",
				"form-ital": "Mare Ovest"
			},
			"evolves-from": "422-W"
		},
		"424": {
			"dex-index": "424",
			"name": "Ambipom",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2019-05-07",
				"shadow": "2021-04-01",
				"shiny-shadow": "2023-06-21"
			},
			"category": "Long Tail",
			"type": [ "Normal" ],
			"evolves-from": "190",
			"base-stamina": 181,
			"base-attack": 205,
			"base-defense": 143,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_FIG_LOWSWEEP",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 1.2,
			"weight-avg": 20.3,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.5375,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"425": {
			"dex-index": "425",
			"name": "Drifloon",
			"availability": {
				"in-game": "2018-10-23",
				"shiny": "2018-10-23",
				"shadow": "2023-03-25"
			},
			"category": "Balloon",
			"type": [ "Ghost", "Flying" ],
			"evolves-into": [ "426" ],
			"base-stamina": 207,
			"base-attack": 117,
			"base-defense": 80,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_ICE_ICYWIND",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 0.4,
			"weight-avg": 1.2,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.15,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"426": {
			"dex-index": "426",
			"name": "Drifblim",
			"availability": {
				"in-game": "2018-10-23",
				"shiny": "2018-10-23",
				"shadow": "2023-03-25"
			},
			"category": "Blimp",
			"type": [ "Ghost", "Flying" ],
			"evolves-from": "425",
			"base-stamina": 312,
			"base-attack": 180,
			"base-defense": 102,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_ICE_ICYWIND",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FIR_MYSTICALFIRE"
			],
			"height-avg": 1.2,
			"weight-avg": 15,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 1.875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"427": {
			"dex-index": "427",
			"name": "Buneary",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2019-04-16"
			},
			"category": "Rabbit",
			"type": [ "Normal" ],
			"evolves-into": [ "428" ],
			"base-stamina": 146,
			"base-attack": 130,
			"base-defense": 105,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_FIR_FIREPUNCH",
				"CHRG_NOR_SWIFT"
			],
			"height-avg": 0.4,
			"weight-avg": 5.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.6875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"428": {
			"dex-index": "428",
			"name": "Lopunny",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2019-04-16"
			},
			"category": "Rabbit",
			"type": [ "Normal" ],
			"evolves-from": "427",
			"base-stamina": 163,
			"base-attack": 156,
			"base-defense": 194,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_FIG_LOWKICK",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_FIR_FIREPUNCH",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"height-avg": 1.2,
			"weight-avg": 33.3,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 4.1625,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"428-M": {
			"dex-index": "428-M",
			"name": "Mega Lopunny",
			"form-data": {
				"base": "428",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2021-04-04",
				"shiny": "2021-04-04",
				"shadow": false
			},
			"type": [ "Normal", "Fighting" ],
			"height-avg": 1.3,
			"weight-avg": 28.3,
			"base-stamina": 163,
			"base-attack": 282,
			"base-defense": 214,
			"size-data": {
				"class": 1.55,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"429": {
			"dex-index": "429",
			"name": "Mismagius",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2018-12-01",
				"shadow": "2019-11-07"
			},
			"category": "Magical",
			"type": [ "Ghost" ],
			"evolves-from": "200",
			"base-stamina": 155,
			"base-attack": 211,
			"base-defense": 187,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_GHO_HEX",
				"FAST_GRA_MAGICALLEAF",
				"FAST_PSY_PSYWAVE"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DAR_DARKPULSE",
				"CHRG_FAI_DAZZLINGGLEAM"
			],
			"height-avg": 0.9,
			"weight-avg": 4.4,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 0.55,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"430": {
			"dex-index": "430",
			"name": "Honchkrow",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2018-11-14",
				"shadow": "2021-05-18",
				"shiny-shadow": "2023-03-25"
			},
			"category": "Big Boss",
			"type": [ "Dark", "Flying" ],
			"evolves-from": "198",
			"base-stamina": 225,
			"base-attack": 243,
			"base-defense": 103,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_PSY_PSYCHIC",
				"CHRG_DAR_DARKPULSE",
				"CHRG_FLY_SKYATTACK"
			],
			"height-avg": 0.9,
			"weight-avg": 27.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 3.4125,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"431": {
			"dex-index": "431",
			"name": "Glameow",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2020-05-22",
				"shadow": "2023-06-21"
			},
			"category": "Catty",
			"type": [ "Normal" ],
			"evolves-into": [ "432" ],
			"base-stamina": 135,
			"base-attack": 109,
			"base-defense": 82,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 0.5,
			"weight-avg": 3.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.4875,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"432": {
			"dex-index": "432",
			"name": "Purugly",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2020-05-22",
				"shadow": "2023-06-21"
			},
			"category": "Tiger Cat",
			"type": [ "Normal" ],
			"evolves-from": "431",
			"base-stamina": 174,
			"base-attack": 172,
			"base-defense": 133,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_ELE_THUNDER",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 1,
			"weight-avg": 43.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 5.475,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"433": {
			"dex-index": "433",
			"name": "Chingling",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2024-02-17"
			},
			"category": "Bell",
			"type": [ "Psychic" ],
			"evolves-into": [ "358" ],
			"base-stamina": 128,
			"base-attack": 114,
			"base-defense": 94,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_NOR_WRAP",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 0.2,
			"weight-avg": 0.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.075,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"434": {
			"dex-index": "434",
			"name": "Stunky",
			"availability": {
				"in-game": "2018-10-23",
				"shiny": "2024-02-16",
				"shadow": "2020-06-10"
			},
			"category": "Skunk",
			"type": [ "Poison", "Dark" ],
			"evolves-into": [ "435" ],
			"base-stamina": 160,
			"base-attack": 121,
			"base-defense": 90,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.4,
			"weight-avg": 19.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 2.4,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"435": {
			"dex-index": "435",
			"name": "Skuntank",
			"availability": {
				"in-game": "2018-10-23",
				"shiny": "2024-02-16",
				"shadow": "2020-06-10"
			},
			"category": "Skunk",
			"type": [ "Poison", "Dark" ],
			"evolves-from": "434",
			"base-stamina": 230,
			"base-attack": 184,
			"base-defense": 132,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1,
			"weight-avg": 38,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.75,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"436": {
			"dex-index": "436",
			"name": "Bronzor",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2019-05-21"
			},
			"category": "Bronze",
			"type": [ "Steel", "Psychic" ],
			"evolves-into": [ "437" ],
			"base-stamina": 149,
			"base-attack": 43,
			"base-defense": 154,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_STE_GYROBALL",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_STE_HEAVYSLAM",
				"CHRG_DAR_PAYBACK"
			],
			"height-avg": 0.5,
			"weight-avg": 60.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 7.5625,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"437": {
			"dex-index": "437",
			"name": "Bronzong",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2019-05-21"
			},
			"category": "Bronze Bell",
			"type": [ "Steel", "Psychic" ],
			"evolves-from": "436",
			"base-stamina": 167,
			"base-attack": 161,
			"base-defense": 213,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_PSY_CONFUSION",
				"FAST_STE_METALSOUND"
			],
			"charged-moves": [
				"CHRG_STE_FLASHCANNON",
				"CHRG_PSY_PSYCHIC",
				"CHRG_STE_HEAVYSLAM",
				"CHRG_GRO_BULLDOZE",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_DAR_PAYBACK"
			],
			"height-avg": 1.3,
			"weight-avg": 187,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 23.375,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"438": {
			"dex-index": "438",
			"name": "Bonsly",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2019-08-05"
			},
			"category": "Bonsai",
			"type": [ "Rock" ],
			"evolves-into": [ "185" ],
			"base-stamina": 137,
			"base-attack": 124,
			"base-defense": 133,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKTOMB",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 0.5,
			"weight-avg": 15,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.875,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"439": {
			"dex-index": "439",
			"name": "Mime Jr.",
			"availability": {
				"in-game": "2019-09-26",
				"shiny": "2019-09-09"
			},
			"category": "Mime",
			"type": [ "Psychic", "Fairy" ],
			"evolves-into": [ "122" ],
			"base-stamina": 85,
			"base-attack": 125,
			"base-defense": 142,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_NOR_POUND"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 0.6,
			"weight-avg": 13,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.625,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"440": {
			"dex-index": "440",
			"name": "Happiny",
			"availability": {
				"in-game": "2019-02-13"
			},
			"category": "Playhouse",
			"type": [ "Normal" ],
			"evolves-into": [ "113" ],
			"base-stamina": 225,
			"base-attack": 25,
			"base-defense": 77,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.6,
			"weight-avg": 24.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 3.05,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"441": {
			"dex-index": "441",
			"name": "Chatot",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2024-02-16"
			},
			"category": "Music Note",
			"type": [ "Normal", "Flying" ],
			"base-stamina": 183,
			"base-attack": 183,
			"base-defense": 91,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_FLY_SKYATTACK",
				"CHRG_FIR_HEATWAVE"
			],
			"height-avg": 0.5,
			"weight-avg": 1.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.2375,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"442": {
			"dex-index": "442",
			"name": "Spiritomb",
			"availability": {
				"in-game": "2018-10-23",
				"shiny": "2020-10-23"
			},
			"category": "Forbidden",
			"type": [ "Ghost", "Dark" ],
			"base-stamina": 137,
			"base-attack": 169,
			"base-defense": 199,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 1,
			"weight-avg": 108,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 13.5,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"443": {
			"dex-index": "443",
			"name": "Gible",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2019-12-16",
				"shadow": "2023-06-21"
			},
			"category": "Land Shark",
			"type": [ "Dragon", "Ground" ],
			"evolves-into": [ "444" ],
			"base-stamina": 151,
			"base-attack": 124,
			"base-defense": 84,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TAKEDOWN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_DRA_TWISTER",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.7,
			"weight-avg": 20.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.5625,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.4 ]
			}
		},
		"444": {
			"dex-index": "444",
			"name": "Gabite",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2019-12-16",
				"shadow": "2023-06-21"
			},
			"category": "Cave",
			"type": [ "Dragon", "Ground" ],
			"evolves-from": "443",
			"evolves-into": [ "445" ],
			"base-stamina": 169,
			"base-attack": 172,
			"base-defense": 125,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TAKEDOWN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_DRA_TWISTER",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 1.4,
			"weight-avg": 56,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.175,
				"wt-std-dev": 7,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.8 ]
			}
		},
		"445": {
			"dex-index": "445",
			"name": "Garchomp",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2019-12-16",
				"shadow": "2023-06-21"
			},
			"category": "Mach",
			"type": [ "Dragon", "Ground" ],
			"evolves-from": "444",
			"base-stamina": 239,
			"base-attack": 261,
			"base-defense": 193,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_FIR_FIREBLAST",
				"CHRG_GRO_SANDTOMB"
			],
			"special-charged-moves": [
				"CHRG_GRO_EARTHPOWER"
			],
			"height-avg": 1.9,
			"weight-avg": 95,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 11.875,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 3.8 ]
			}
		},
		"445-M": {
			"dex-index": "445-M",
			"name": "Mega Garchomp",
			"form-data": {
				"base": "445",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-11-11",
				"shiny": "2023-11-11",
				"shadow": false
			},
			"base-stamina": 239,
			"base-attack": 339,
			"base-defense": 222
		},
		"446": {
			"dex-index": "446",
			"name": "Munchlax",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2022-11-09"
			},
			"category": "Big Eater",
			"type": [ "Normal" ],
			"evolves-into": [ "143" ],
			"base-stamina": 286,
			"base-attack": 137,
			"base-defense": 117,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GHO_LICK"
			],
			"charged-moves": [
				"CHRG_POI_GUNKSHOT",
				"CHRG_NOR_BODYSLAM",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 0.6,
			"weight-avg": 105,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 13.125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"447": {
			"dex-index": "447",
			"name": "Riolu",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2020-02-07"
			},
			"category": "Emanation",
			"type": [ "Fighting" ],
			"evolves-into": [ "448" ],
			"base-stamina": 120,
			"base-attack": 127,
			"base-defense": 78,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_FIG_CROSSCHOP",
				"CHRG_FIR_BLAZEKICK",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 0.7,
			"weight-avg": 20.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.525,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"448": {
			"dex-index": "448",
			"name": "Lucario",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2020-02-07"
			},
			"category": "Aura",
			"type": [ "Fighting", "Steel" ],
			"evolves-from": "447",
			"base-stamina": 172,
			"base-attack": 236,
			"base-defense": 144,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_STE_BULLETPUNCH"
			],
			"special-fast-moves": [
				"FAST_FIG_FORCEPALM"
			],
			"charged-moves": [
				"CHRG_STE_FLASHCANNON",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_POWERUPPUNCH",
				"CHRG_FIG_AURASPHERE",
				"CHRG_FIR_BLAZEKICK",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 1.2,
			"weight-avg": 54,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 6.75,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"448-M": {
			"dex-index": "448-M",
			"name": "Mega Lucario",
			"form-data": {
				"base": "448",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2024-07-27",
				"shiny": "2024-07-27",
				"shadow": false
			},
			"height-avg": 1.3,
			"weight-avg": 57.5,
			"base-stamina": 172,
			"base-attack": 310,
			"base-defense": 175,
			"size-data": {
				"class": 1.75,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"449": {
			"dex-index": "449",
			"name": "Hippopotas",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2020-02-07",
				"shadow": "2022-01-24"
			},
			"category": "Hippo",
			"type": [ "Ground" ],
			"evolves-into": [ "450" ],
			"base-stamina": 169,
			"base-attack": 124,
			"base-defense": 118,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_DAR_BITE",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.8,
			"weight-avg": 49.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 6.1875,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"450": {
			"dex-index": "450",
			"name": "Hippowdon",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2020-02-07",
				"shadow": "2022-01-24"
			},
			"category": "Heavyweight",
			"type": [ "Ground" ],
			"evolves-from": "449",
			"base-stamina": 239,
			"base-attack": 201,
			"base-defense": 191,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_FIREFANG",
				"FAST_DAR_BITE",
				"FAST_ELE_THUNDERFANG",
				"FAST_ICE_ICEFANG",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_NOR_BODYSLAM",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_ROC_WEATHERBALL",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 2,
			"weight-avg": 300,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 37.5,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"451": {
			"dex-index": "451",
			"name": "Skorupi",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2020-03-06",
				"shadow": "2021-05-18"
			},
			"category": "Scorpion",
			"type": [ "Poison", "Bug" ],
			"evolves-into": [ "452" ],
			"base-stamina": 120,
			"base-attack": 93,
			"base-defense": 151,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_BUG_INFESTATION"
			],
			"charged-moves": [
				"CHRG_POI_CROSSPOISON",
				"CHRG_WAT_AQUATAIL",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.8,
			"weight-avg": 12,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 1.5,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"452": {
			"dex-index": "452",
			"name": "Drapion",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2020-03-06",
				"shadow": "2021-05-18"
			},
			"category": "Ogre Scorpion",
			"type": [ "Poison", "Dark" ],
			"evolves-from": "451",
			"base-stamina": 172,
			"base-attack": 180,
			"base-defense": 202,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_BUG_INFESTATION",
				"FAST_DAR_BITE",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_WAT_AQUATAIL",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_BUG_FELLSTINGER"
			],
			"height-avg": 1.3,
			"weight-avg": 61.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 7.6875,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"453": {
			"dex-index": "453",
			"name": "Croagunk",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2020-04-01",
				"shadow": "2024-01-27"
			},
			"category": "Toxic Mouth",
			"type": [ "Poison", "Fighting" ],
			"evolves-into": [ "454" ],
			"base-stamina": 134,
			"base-attack": 116,
			"base-defense": 76,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_POI_POISONJAB",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.7,
			"weight-avg": 23,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.875,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"454": {
			"dex-index": "454",
			"name": "Toxicroak",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2020-04-01",
				"shadow": "2024-01-27"
			},
			"category": "Toxic Mouth",
			"type": [ "Poison", "Fighting" ],
			"evolves-from": "453",
			"base-stamina": 195,
			"base-attack": 211,
			"base-defense": 133,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_FIG_COUNTER",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_GRO_MUDBOMB",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 1.3,
			"weight-avg": 44.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 5.55,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"455": {
			"dex-index": "455",
			"name": "Carnivine",
			"availability": {
				"in-game": "2018-10-16",
				"shiny": "2024-02-16"
			},
			"category": "Bug Catcher",
			"type": [ "Grass" ],
			"base-stamina": 179,
			"base-attack": 187,
			"base-defense": 136,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GRA_VINEWHIP"
			],
			"charged-moves": [
				"CHRG_GRA_POWERWHIP",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 1.4,
			"weight-avg": 27,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.175,
				"wt-std-dev": 3.375,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.8 ]
			}
		},
		"456": {
			"dex-index": "456",
			"name": "Finneon",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2022-10-21"
			},
			"category": "Wing Fish",
			"type": [ "Water" ],
			"evolves-into": [ "457" ],
			"base-stamina": 135,
			"base-attack": 96,
			"base-defense": 116,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_ICEBEAM",
				"CHRG_BUG_SILVERWIND"
			],
			"height-avg": 0.4,
			"weight-avg": 7,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"457": {
			"dex-index": "457",
			"name": "Lumineon",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2022-10-21"
			},
			"category": "Neon",
			"type": [ "Water" ],
			"evolves-from": "456",
			"base-stamina": 170,
			"base-attack": 142,
			"base-defense": 170,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_BLIZZARD",
				"CHRG_BUG_SILVERWIND"
			],
			"height-avg": 1.2,
			"weight-avg": 24,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 3,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"458": {
			"dex-index": "458",
			"name": "Mantyke",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2023-05-02"
			},
			"category": "Kite",
			"type": [ "Water", "Flying" ],
			"evolves-into": [ "226" ],
			"base-stamina": 128,
			"base-attack": 105,
			"base-defense": 179,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_ICEBEAM",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 1,
			"weight-avg": 65,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 8.125,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"459": {
			"dex-index": "459",
			"name": "Snover",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2019-12-24",
				"shadow": "2019-12-24"
			},
			"category": "Frost Tree",
			"type": [ "Grass", "Ice" ],
			"evolves-into": [ "460" ],
			"base-stamina": 155,
			"base-attack": 115,
			"base-defense": 105,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_ICE_ICESHARD",
				"FAST_GRA_LEAFAGE"
			],
			"charged-moves": [
				"CHRG_ICE_ICEBEAM",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_NOR_STOMP"
			],
			"height-avg": 1,
			"weight-avg": 50.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 6.3125,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"460": {
			"dex-index": "460",
			"name": "Abomasnow",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2019-12-24",
				"shadow": "2019-12-24"
			},
			"category": "Frost Tree",
			"type": [ "Grass", "Ice" ],
			"evolves-from": "459",
			"base-stamina": 207,
			"base-attack": 178,
			"base-defense": 158,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_LEAFAGE"
			],
			"charged-moves": [
				"CHRG_ICE_BLIZZARD",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_DRA_OUTRAGE",
				"CHRG_ICE_WEATHERBALL",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 2.2,
			"weight-avg": 135.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.275,
				"wt-std-dev": 16.9375,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.85 ]
			}
		},
		"460-M": {
			"dex-index": "460-M",
			"name": "Mega Abomasnow",
			"form-data": {
				"base": "460",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2020-12-01",
				"shiny": "2020-12-02",
				"shadow": false
			},
			"height-avg": 2.7,
			"weight-avg": 185,
			"base-stamina": 207,
			"base-attack": 240,
			"base-defense": 191,
			"size-data": {
				"class": 1.55,
				"xxs": [ 1.323, 1.35 ],
				"xs": [ 1.35, 2.025 ],
				"m": [ 2.025, 3.375 ],
				"xl": [ 3.375, 4.05 ],
				"xxl": [ 4.05, 4.185 ]
			}
		},
		"461": {
			"dex-index": "461",
			"name": "Weavile",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2019-07-25",
				"shadow": "2019-11-05",
				"shiny-shadow": "2019-11-07"
			},
			"category": "Sharp Claw",
			"type": [ "Dark", "Ice" ],
			"evolves-from": "215",
			"base-stamina": 172,
			"base-attack": 243,
			"base-defense": 171,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_ICESHARD",
				"FAST_DAR_FEINTATTACK",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_ICE_AVALANCHE",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_DAR_FOULPLAY",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"height-avg": 1.1,
			"weight-avg": 34,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 4.25,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"462": {
			"dex-index": "462",
			"name": "Magnezone",
			"availability": {
				"in-game": "2019-05-18",
				"shiny": "2019-05-18",
				"shadow": "2019-11-07",
				"shiny-shadow": "2023-02-01"
			},
			"category": "Magnet Area",
			"type": [ "Electric", "Steel" ],
			"evolves-from": "82",
			"base-stamina": 172,
			"base-attack": 238,
			"base-defense": 205,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_ELE_CHARGEBEAM",
				"FAST_ELE_VOLTSWITCH",
				"FAST_STE_METALSOUND"
			],
			"charged-moves": [
				"CHRG_ELE_ZAPCANNON",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_STE_FLASHCANNON",
				"CHRG_STE_MIRRORSHOT"
			],
			"height-avg": 1.2,
			"weight-avg": 180,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 22.5,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"463": {
			"dex-index": "463",
			"name": "Lickilicky",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2020-02-15"
			},
			"category": "Licking",
			"type": [ "Normal" ],
			"evolves-from": "108",
			"base-stamina": 242,
			"base-attack": 161,
			"base-defense": 181,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ROC_ROLLOUT"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GHO_SHADOWBALL"
			],
			"special-charged-moves": [
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 1.7,
			"weight-avg": 140,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 17.5,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"464": {
			"dex-index": "464",
			"name": "Rhyperior",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2020-02-22",
				"shadow": "2023-10-26"
			},
			"category": "Drill",
			"type": [ "Ground", "Rock" ],
			"evolves-from": "112",
			"base-stamina": 251,
			"base-attack": 241,
			"base-defense": 190,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_NOR_SKULLBASH",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_DRA_BREAKINGSWIPE"
			],
			"special-charged-moves": [
				"CHRGROC_ROCKWRECKERR"
			],
			"height-avg": 2.4,
			"weight-avg": 282.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3,
				"wt-std-dev": 35.35,
				"xxs": [ 1.176, 1.2 ],
				"xs": [ 1.2, 1.8 ],
				"m": [ 1.8, 3 ],
				"xl": [ 3, 3.6 ],
				"xxl": [ 3.6, 3.72 ]
			}
		},
		"465": {
			"dex-index": "465",
			"name": "Tangrowth",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2020-07-25",
				"shadow": "2021-05-18"
			},
			"category": "Vine",
			"type": [ "Grass" ],
			"evolves-from": "114",
			"base-stamina": 225,
			"base-attack": 207,
			"base-defense": 184,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_BUG_INFESTATION"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRA_POWERWHIP",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 2,
			"weight-avg": 128.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.25,
				"wt-std-dev": 16.075,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.5 ]
			}
		},
		"466": {
			"dex-index": "466",
			"name": "Electivire",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2018-11-14",
				"shadow": "2019-10-17"
			},
			"category": "Thunderbolt",
			"type": [ "Electric" ],
			"evolves-from": "125",
			"base-stamina": 181,
			"base-attack": 249,
			"base-defense": 163,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_FIG_LOWKICK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_ELE_THUNDER",
				"CHRG_ICE_ICEPUNCH"
			],
			"special-charged-moves": [
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 1.8,
			"weight-avg": 138.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 17.325,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"467": {
			"dex-index": "467",
			"name": "Magmortar",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2018-03-22",
				"shadow": "2019-10-17"
			},
			"category": "Blast",
			"type": [ "Fire" ],
			"evolves-from": "126",
			"base-stamina": 181,
			"base-attack": 247,
			"base-defense": 172,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_FIG_KARATECHOP"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIR_FIREPUNCH",
				"CHRG_FIR_FIREBLAST",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"special-charged-moves": [
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 1.6,
			"weight-avg": 68,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 8.5,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"468": {
			"dex-index": "468",
			"name": "Togekiss",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2018-11-14"
			},
			"category": "Jubilee",
			"type": [ "Fairy", "Flying" ],
			"evolves-from": "176",
			"base-stamina": 198,
			"base-attack": 225,
			"base-defense": 217,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_WAT_HIDDENPOWER",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_FLY_AERIALACE",
				"CHRG_FIR_FLAMETHROWER"
			],
			"special-charged-moves": [
				"CHRG_FIG_AURASPHERE"
			],
			"height-avg": 1.5,
			"weight-avg": 38,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 4.75,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"469": {
			"dex-index": "469",
			"name": "Yanmega",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2019-09-20"
			},
			"category": "Ogre Darner",
			"type": [ "Bug", "Flying" ],
			"evolves-from": "193",
			"base-stamina": 200,
			"base-attack": 231,
			"base-defense": 156,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FLY_AERIALACE",
				"CHRG_BUG_BUGBUZZ"
			],
			"height-avg": 1.9,
			"weight-avg": 51.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 6.4375,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"470": {
			"dex-index": "470",
			"name": "Leafeon",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2019-05-18"
			},
			"category": "Verdant",
			"type": [ "Grass" ],
			"evolves-from": "133",
			"base-stamina": 163,
			"base-attack": 216,
			"base-defense": 219,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_NOR_QUICKATTACK"
			],
			"special-fast-moves": [
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRA_LEAFBLADE",
				"CHRG_GRA_ENERGYBALL"
			],
			"special-charged-moves": [
				"CHRG_NOR_LASTRESORT"
			],
			"height-avg": 1,
			"weight-avg": 25.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.1875,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"471": {
			"dex-index": "471",
			"name": "Glaceon",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2019-05-18"
			},
			"category": "Fresh Snow",
			"type": [ "Ice" ],
			"evolves-from": "133",
			"base-stamina": 163,
			"base-attack": 238,
			"base-defense": 205,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_ICESHARD",
				"FAST_ICE_FROSTBREATH"
			],
			"charged-moves": [
				"CHRG_ICE_AVALANCHE",
				"CHRG_ICE_ICYWIND",
				"CHRG_ICE_ICEBEAM"
			],
			"special-charged-moves": [
				"CHRG_NOR_LASTRESORT",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 0.8,
			"weight-avg": 25.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.2375,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.24 ]
			}
		},
		"472": {
			"dex-index": "472",
			"name": "Gliscor",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2019-09-02",
				"shadow": "2020-06-10",
				"shiny-shadow": "2021-11-09"
			},
			"category": "Fang Scorpion",
			"type": [ "Ground", "Flying" ],
			"evolves-from": "207",
			"base-stamina": 181,
			"base-attack": 185,
			"base-defense": 222,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_FLY_AERIALACE",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_GRO_SANDTOMB"
			],
			"height-avg": 2,
			"weight-avg": 42.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 5.3125,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"473": {
			"dex-index": "473",
			"name": "Mamoswine",
			"availability": {
				"in-game": "2019-02-16",
				"shiny": "2019-02-16",
				"shadow": "2021-02-02"
			},
			"category": "Twin Tusk",
			"type": [ "Ice", "Ground" ],
			"evolves-from": "221",
			"base-stamina": 242,
			"base-attack": 247,
			"base-defense": 146,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_ICE_AVALANCHE",
				"CHRG_GRO_BULLDOZE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_GRO_HIGHHORSEPOWER"
			],
			"special-charged-moves": [
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 2.5,
			"weight-avg": 291,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 36.375,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 4.375 ]
			}
		},
		"474": {
			"dex-index": "474",
			"name": "Porygon-Z",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2020-09-20",
				"shadow": "2019-11-07"
			},
			"category": "Virtual",
			"type": [ "Normal" ],
			"evolves-from": "233",
			"base-stamina": 198,
			"base-attack": 264,
			"base-defense": 150,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER",
				"FAST_ELE_CHARGEBEAM",
				"FAST_NOR_LOCKON"
			],
			"charged-moves": [
				"CHRG_GRA_SOLARBEAM",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_ELE_ZAPCANNON",
				"CHRG_ICE_BLIZZARD"
			],
			"special-charged-moves": [
				"CHRG_NOR_TRIATTACK"
			],
			"height-avg": 0.9,
			"weight-avg": 34,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 4.25,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"475": {
			"dex-index": "475",
			"name": "Gallade",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2019-08-03",
				"shadow": "2019-08-08",
				"shiny-shadow": "2024-10-08"
			},
			"category": "Blade",
			"type": [ "Psychic", "Fighting" ],
			"evolves-from": "281",
			"base-stamina": 169,
			"base-attack": 237,
			"base-defense": 195,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_FIG_LOWKICK",
				"FAST_FAI_CHARM",
				"FAST_PSY_PSYCHOCUT"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRA_LEAFBLADE"
			],
			"special-charged-moves": [
				"CHRG_PSY_SYNCHRONOISE"
			],
			"height-avg": 1.6,
			"weight-avg": 52,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 6.5,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"475-M": {
			"dex-index": "475-M",
			"name": "Mega Gallade",
			"form-data": {
				"base": "475",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2024-01-11",
				"shiny": "2024-01-11",
				"shadow": false
			},
			"base-attack": 326,
			"base-defense": 230,
			"base-stamina": 169,
			"height-avg": 1.6,
			"weight-avg": 56.4
		},
		"476": {
			"dex-index": "476",
			"name": "Probopass",
			"availability": {
				"in-game": "2019-05-17",
				"shiny": "2021-03-09",
				"shadow": "2021-02-02"
			},
			"category": "Compass",
			"type": [ "Rock", "Steel" ],
			"evolves-from": "299",
			"base-stamina": 155,
			"base-attack": 135,
			"base-defense": 275,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_STE_MAGNETBOMB",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_ZAPCANNON"
			],
			"height-avg": 1.4,
			"weight-avg": 340,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 42.5,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"477": {
			"dex-index": "477",
			"name": "Dusknoir",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2018-11-14",
				"shadow": "2019-10-17"
			},
			"category": "Gripper",
			"type": [ "Ghost" ],
			"evolves-from": "356",
			"base-stamina": 128,
			"base-attack": 180,
			"base-defense": 254,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_PSY_PSYCHIC",
				"CHRG_DAR_DARKPULSE",
				"CHRG_GHO_POLTERGEIST",
				"CHRG_GHO_SHADOWPUNCH"
			],
			"special-charged-moves": [
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 2.2,
			"weight-avg": 106.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.275,
				"wt-std-dev": 13.325,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.85 ]
			}
		},
		"478": {
			"dex-index": "478",
			"name": "Froslass",
			"availability": {
				"in-game": "2019-02-01",
				"shiny": "2019-01-31",
				"shadow": "2024-01-27"
			},
			"category": "Snow Land",
			"type": [ "Ice", "Ghost" ],
			"evolves-from": "361",
			"base-stamina": 172,
			"base-attack": 171,
			"base-defense": 150,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_GHO_HEX"
			],
			"charged-moves": [
				"CHRG_ICE_AVALANCHE",
				"CHRG_DAR_CRUNCH",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"height-avg": 1.3,
			"weight-avg": 26.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 3.325,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"479": {
			"dex-index": "479",
			"name": "Rotom",
			"availability": {
				"in-game": "2024-02-16",
				"shiny": "2024-02-16",
				"shadow": false
			},
			"category": "Plasma",
			"type": [ "Electric", "Ghost" ],
			"base-stamina": 137,
			"base-attack": 185,
			"base-defense": 159,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 0.3,
			"weight-avg": 0.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.0375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"479-H": {
			"dex-index": "479-H",
			"name": "Heat Rotom",
			"name-ital": "Rotom Calore",
			"form-data": {
				"base": "479",
				"type": "huh",
				"form": "Heat"
			},
			"availability": {
				"in-game": "2024-05-30"
			},
			"type": [ "Electric", "Fire" ],
			"base-stamina": 137,
			"base-attack": 204,
			"base-defense": 219,
			"charged-moves": [
				"CHRG_FIR_OVERHEAT",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER"
			]
		},
		"479-W": {
			"dex-index": "479-W",
			"name": "Wash Rotom",
			"name-ital": "Rotom Lavaggio",
			"form-data": {
				"base": "479",
				"type": "huh",
				"form": "Wash"
			},
			"availability": {
				"in-game": "2020-07-25"
			},
			"type": [ "Electric", "Water" ],
			"base-stamina": 137,
			"base-attack": 204,
			"base-defense": 219,
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER"
			]
		},
		"479-R": {
			"dex-index": "479-R",
			"name": "Frost Rotom",
			"name-ital": "Rotom Gelo",
			"form-data": {
				"base": "479",
				"type": "huh",
				"form": "Frost"
			},
			"availability": {
				"in-game": "2023-08-04",
				"shadow": false
			},
			"type": [ "Electric", "Ice" ],
			"base-stamina": 137,
			"base-attack": 204,
			"base-defense": 219,
			"charged-moves": [
				"CHRG_ICE_BLIZZARD",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER"
			]
		},
		"479-A": {
			"dex-index": "479-A",
			"name": "Fan Rotom",
			"name-ital": "Rotom Vortice",
			"form-data": {
				"base": "479",
				"type": "huh",
				"form": "Fan"
			},
			"availability": {
				"in-game": false
			},
			"type": [ "Electric", "Flying" ],
			"base-stamina": 137,
			"base-attack": 204,
			"base-defense": 219,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER"
			]
		},
		"479-M": {
			"dex-index": "479-M",
			"name": "Mow Rotom",
			"name-ital": "Rotom Taglio",
			"form-data": {
				"base": "479",
				"type": "huh",
				"form": "Mow"
			},
			"availability": {
				"in-game": "2022-07-01",
				"shadow": false
			},
			"type": [ "Electric", "Grass" ],
			"base-stamina": 137,
			"base-attack": 204,
			"base-defense": 219,
			"charged-moves": [
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_THUNDER"
			]
		},
		"480": {
			"dex-index": "480",
			"name": "Uxie",
			"availability": {
				"in-game": "2019-04-29",
				"shiny": "2021-09-14"
			},
			"category": "Knowledge",
			"type": [ "Psychic" ],
			"base-stamina": 181,
			"base-attack": 156,
			"base-defense": 270,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_EXTRASENSORY"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_NOR_SWIFT",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 0.3,
			"weight-avg": 0.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.0375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"481": {
			"dex-index": "481",
			"name": "Mesprit",
			"availability": {
				"in-game": "2019-04-29",
				"shiny": "2021-09-14"
			},
			"category": "Emotion",
			"type": [ "Psychic" ],
			"base-stamina": 190,
			"base-attack": 212,
			"base-defense": 212,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_EXTRASENSORY"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_NOR_SWIFT",
				"CHRG_ICE_BLIZZARD"
			],
			"height-avg": 0.3,
			"weight-avg": 0.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.0375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"482": {
			"dex-index": "482",
			"name": "Azelf",
			"availability": {
				"in-game": "2019-04-29",
				"shiny": "2021-09-14"
			},
			"category": "Willpower",
			"type": [ "Psychic" ],
			"base-stamina": 181,
			"base-attack": 270,
			"base-defense": 151,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_EXTRASENSORY"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_NOR_SWIFT",
				"CHRG_FIR_FIREBLAST"
			],
			"height-avg": 0.3,
			"weight-avg": 0.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.0375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"483": {
			"dex-index": "483",
			"name": "Dialga",
			"availability": {
				"in-game": "2019-03-01",
				"shiny": "2021-07-23"
			},
			"category": "Temporal",
			"type": [ "Steel", "Dragon" ],
			"base-stamina": 205,
			"base-attack": 275,
			"base-defense": 211,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_DRA_DRACOMETEOR",
				"CHRG_STE_IRONHEAD",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 5.4,
			"weight-avg": 683,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.675,
				"wt-std-dev": 85.375,
				"xxs": [ 2.646, 2.7 ],
				"xs": [ 2.7, 4.05 ],
				"m": [ 4.05, 6.75 ],
				"xl": [ 6.75, 8.1 ],
				"xxl": [ 8.1, 8.37 ]
			}
		},
		"483-O": {
			"dex-index": "483-O",
			"form-data": {
				"base": "483",
				"type": "huh",
				"form": "Origin Forme",
				"form-ital": "Forma Originale"
			},
			"availability": {
				"in-game": "2024-02-16",
				"shiny": "2024-02-16"
			},
			"base-stamina": 205,
			"base-attack": 270,
			"base-defense": 225,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_DRA_DRACOMETEOR",
				"CHRG_STE_IRONHEAD",
				"CHRG_ELE_THUNDER"
			],
			"unobtainable-charged-moves": [
				"CHRG_DRA_ROAROFTIME"
			],
			"height-avg": 7,
			"weight-avg": 850,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.875,
				"wt-std-dev": 85.375,
				"xxs": [ 3.43, 3.5 ],
				"xs": [ 3.5, 5.25 ],
				"m": [ 5.25, 8.75 ],
				"xl": [ 8.75, 10.5 ],
				"xxl": [ 10.5, 10.85 ]
			}
		},
		"484": {
			"dex-index": "484",
			"name": "Palkia",
			"availability": {
				"in-game": "2019-01-30",
				"shiny": "2021-08-06",
				"shadow": "2025-01-15"
			},
			"category": "Spatial",
			"type": [ "Water", "Dragon" ],
			"base-stamina": 189,
			"base-attack": 280,
			"base-defense": 215,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_DRACOMETEOR",
				"CHRG_FIR_FIREBLAST",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_WAT_AQUATAIL"
			],
			"height-avg": 4.2,
			"weight-avg": 336,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.525,
				"wt-std-dev": 42,
				"xxs": [ 2.058, 2.1 ],
				"xs": [ 2.1, 3.15 ],
				"m": [ 3.15, 5.25 ],
				"xl": [ 5.25, 6.3 ],
				"xxl": [ 6.3, 6.51 ]
			}
		},
		"484-O": {
			"dex-index": "484-O",
			"form-data": {
				"base": "484",
				"type": "huh",
				"form": "Origin Forme",
				"form-ital": "Forma Originale"
			},
			"availability": {
				"in-game": "2024-02-16",
				"shiny": "2024-02-16"
			},
			"base-stamina": 189,
			"base-attack": 286,
			"base-defense": 223,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_DRACOMETEOR",
				"CHRG_FIR_FIREBLAST",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_WAT_AQUATAIL"
			],
			"unobtainable-charged-moves": [
				"CHRG_DRA_SPACIALREND"
			],
			"height-avg": 4.2,
			"weight-avg": 336,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.7875,
				"wt-std-dev": 42,
				"xxs": [ 3.087, 3.15 ],
				"xs": [ 3.15, 4.725 ],
				"m": [ 4.725, 7.875 ],
				"xl": [ 7.875, 9.45 ],
				"xxl": [ 9.45, 9.765 ]
			}
		},
		"485": {
			"dex-index": "485",
			"name": "Heatran",
			"availability": {
				"in-game": "2018-12-18",
				"shiny": "2020-01-07",
				"shadow": "2024-10-08"
			},
			"category": "Lava Dome",
			"type": [ "Fire", "Steel" ],
			"base-stamina": 209,
			"base-attack": 251,
			"base-defense": 213,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_STE_IRONHEAD",
				"CHRG_ROC_STONEEDGE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_GRO_EARTHPOWER"
			],
			"special-charged-moves": [
				"CHRG_FIR_MAGMASTORM"
			],
			"height-avg": 1.7,
			"weight-avg": 430,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 53.75,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"486": {
			"dex-index": "486",
			"name": "Regigigas",
			"availability": {
				"in-game": "2019-11-02",
				"shiny": "2021-06-17",
				"shadow": "2023-10-26"
			},
			"category": "Colossal",
			"type": [ "Normal" ],
			"base-stamina": 221,
			"base-attack": 287,
			"base-defense": 210,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_WAT_HIDDENPOWER"
			],
			"charged-moves": [
				"CHRG_NOR_GIGAIMPACT",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 3.7,
			"weight-avg": 420,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.4625,
				"wt-std-dev": 52.5,
				"xxs": [ 1.813, 1.85 ],
				"xs": [ 1.85, 2.775 ],
				"m": [ 2.775, 4.625 ],
				"xl": [ 4.625, 5.55 ],
				"xxl": [ 5.55, 5.735 ]
			}
		},
		"487-0": {
			"dex-index": "487-0",
			"name": "Giratina",
			"category": "Renegade",
			"type": [ "Ghost", "Dragon" ],
			"dynamax-class": 4,
			"special-charged-moves": [
				"CHRG_GHO_SHADOWFORCE"
			],
			"showcase-baseline": "" // TODO
		},
		"487-A": {
			"dex-index": "487-A",
			"form-data": {
				"base": "487-0",
				"type": "idk",
				"form": "Altered Form",
				"form-ital": "Forma Alterata"
			},
			"availability": {
				"in-game": "2018-10-23",
				"shiny": "2019-09-23"
			},
			"base-stamina": 284,
			"base-attack": 187,
			"base-defense": 225,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_GHO_SHADOWSNEAK"
			],
			"height-avg": 4.5,
			"weight-avg": 750,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.5625,
				"wt-std-dev": 93.75,
				"xxs": [ 2.205, 2.25 ],
				"xs": [ 2.25, 3.375 ],
				"m": [ 3.375, 5.625 ],
				"xl": [ 5.625, 6.75 ],
				"xxl": [ 6.75, 6.975 ]
			}
		},
		"487-O": {
			"dex-index": "487-O",
			"form-data": {
				"base": "487-0",
				"type": "huh",
				"form": "Origin Forme",
				"form-ital": "Forma Originale"
			},
			"availability": {
				"in-game": "2019-04-02",
				"shiny": "2020-10-09"
			},
			"base-stamina": 284,
			"base-attack": 225,
			"base-defense": 187,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 6.9,
			"weight-avg": 650,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.8625,
				"wt-std-dev": 81.25,
				"xxs": [ 3.381, 3.45 ],
				"xs": [ 3.45, 5.175 ],
				"m": [ 5.175, 8.625 ],
				"xl": [ 8.625, 10.35 ],
				"xxl": [ 10.35, 10.695 ]
			}
		},
		"488": {
			"dex-index": "488",
			"name": "Cresselia",
			"availability": {
				"in-game": "2018-11-20",
				"shiny": "2019-05-27",
				"shadow": "2024-08-08"
			},
			"category": "Lunar",
			"type": [ "Psychic" ],
			"base-stamina": 260,
			"base-attack": 152,
			"base-defense": 258,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_PSYCHOCUT",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_ICE_AURORABEAM",
				"CHRG_FAI_MOONBLAST",
				"CHRG_PSY_FUTURESIGHT"
			],
			"special-charged-moves": [
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 1.5,
			"weight-avg": 85.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 10.7,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"489": {
			"dex-index": "489",
			"name": "Phione",
			"availability": {
				"in-game": false
			},
			"category": "Sea Drifter",
			"type": [ "Water" ],
			"base-stamina": 190,
			"base-attack": 162,
			"base-defense": 162,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_WAT_WATERPULSE",
				"CHRG_WAT_SURF"
			],
			"height-avg": 0.4,
			"weight-avg": 3.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.3875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"490": {
			"dex-index": "490",
			"name": "Manaphy",
			"availability": {
				"in-game": false
			},
			"category": "Seafaring",
			"type": [ "Water" ],
			"base-stamina": 225,
			"base-attack": 210,
			"base-defense": 210,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_WAT_SURF"
			],
			"height-avg": 0.3,
			"weight-avg": 1.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.175,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"491": {
			"dex-index": "491",
			"name": "Darkrai",
			"availability": {
				"in-game": "2019-10-17",
				"shiny": "2020-03-06"
			},
			"category": "Pitch-Black",
			"type": [ "Dark" ],
			"base-stamina": 172,
			"base-attack": 285,
			"base-defense": 198,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DAR_DARKPULSE"
			],
			"special-charged-moves": [
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 1.5,
			"weight-avg": 50.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 6.3125,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"492-0": {
			"dex-index": "492-0",
			"name": "Shaymin",
			"category": "Gratitude",
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRA_SEEDFLARE"
			],
			"showcase-baseline": "" // TODO
		},
		"492-L": {
			"dex-index": "492-L",
			"form-data": {
				"base": "492-0",
				"type": "idk",
				"form": "Land Forme",
				"form-ital": "Forma Terra",
			},
			"availability": {
				"in-game": "2022-06-04",
				"shiny": "2024-02-16",
				"shadow": false
			},
			"type": [ "Grass" ],
			"base-stamina": 225,
			"base-attack": 210,
			"base-defense": 210,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER",
				"FAST_PSY_ZENHEADBUTT"
			],
			"height-avg": 0.2,
			"weight-avg": 2.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.2625,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.31 ]
			}
		},
		"492-S": {
			"dex-index": "492-S",
			"form-data": {
				"base": "492-0",
				"type": "idk",
				"form": "Sky Forme",
				"form-ital": "Forma Cielo"
			},
			"availability": {
				"in-game": "2022-07-01",
				"shiny": "2024-02-16",
				"shadow": false
			},
			"type": [ "Grass", "Flying" ],
			"base-stamina": 225,
			"base-attack": 261,
			"base-defense": 166,
			"fast-moves": [
				"FAST_GRA_MAGICALLEAF",
				"FAST_WAT_HIDDENPOWER",
				"FAST_PSY_ZENHEADBUTT"
			],
			"height-avg": 0.4,
			"weight-avg": 5.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.65,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"493": {
			"dex-index": "493",
			"name": "Arceus",
			"availability": {
				"in-game": false
			},
			"category": "Alpha",
			"type": [ "Normal" ],
			"base-stamina": 237,
			"base-attack": 238,
			"base-defense": 238,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_STE_IRONTAIL",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_DRA_OUTRAGE"
			],
			"height-avg": 3.2,
			"weight-avg": 320,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.4,
				"wt-std-dev": 40,
				"xxs": [ 1.568, 1.6 ],
				"xs": [ 1.6, 2.4 ],
				"m": [ 2.4, 4 ],
				"xl": [ 4, 4.8 ],
				"xxl": [ 4.8, 4.96 ]
			}
		},
		"493-BUG": {
			"dex-index": "493-BUG",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Insect Plate",
				"form-ital": "Lastrabaco"
			},
			"type": [ "Bug" ]
		},
		"493-DAR": {
			"dex-index": "493-DAR",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Dread Plate",
				"form-ital": "Lastratimore"
			},
			"type": [ "Dark" ]
		},
		"493-DRA": {
			"dex-index": "493-DRA",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Draco Plate",
				"form-ital": "Lastradrakon"
			},
			"type": [ "Dragon" ]
		},
		"493-ELE": {
			"dex-index": "493-ELE",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Zap Plate",
				"form-ital": "Lastrasaetta"
			},
			"type": [ "Electric" ]
		},
		"493-FAI": {
			"dex-index": "493-FAI",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Pixie Plate",
				"form-ital": "Lastraspiritello"
			},
			"type": [ "Fairy" ]
		},
		"493-FIG": {
			"dex-index": "493-FIG",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Fist Plate",
				"form-ital": "Lastrapugno"
			},
			"type": [ "Fighting" ]
		},
		"493-FIR": {
			"dex-index": "493-FIR",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Flame Plate",
				"form-ital": "Lastrarogo"
			},
			"type": [ "Fire" ]
		},
		"493-FLY": {
			"dex-index": "493-FLY",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Sky Plate",
				"form-ital": "Lastracielo"
			},
			"type": [ "Flying" ]
		},
		"493-GHO": {
			"dex-index": "493-GHO",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Spooky Plate",
				"form-ital": "Lastratetra"
			},
			"type": [ "Ghost" ]
		},
		"493-GRA": {
			"dex-index": "493-GRA",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Meadow Plate",
				"form-ital": "Lastraprato"
			},
			"type": [ "Grass" ]
		},
		"493-GRO": {
			"dex-index": "493-GRO",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Earth Plate",
				"form-ital": "Lastrageo"
			},
			"type": [ "Ground" ]
		},
		"493-ICE": {
			"dex-index": "493-ICE",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Icicle Plate",
				"form-ital": "Lastragelo"
			},
			"type": [ "Ice" ]
		},
		"493-POI": {
			"dex-index": "493-POI",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Toxic Plate",
				"form-ital": "Lastrafiele"
			},
			"type": [ "Poison" ]
		},
		"493-PSY": {
			"dex-index": "493-PSY",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Mind Plate",
				"form-ital": "Lastramente"
			},
			"type": [ "Psychic" ]
		},
		"493-ROC": {
			"dex-index": "493-ROC",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Stone Plate",
				"form-ital": "Lastrapietra"
			},
			"type": [ "Rock" ]
		},
		"493-STE": {
			"dex-index": "493-STE",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Iron Plate",
				"form-ital": "Lastraferro"
			},
			"type": [ "Steel" ]
		},
		"493-WAT": {
			"dex-index": "493-WAT",
			"form-data": {
				"base": "493",
				"type": "type change",
				"form": "Splash Plate",
				"form-ital": "Lastraidro"
			},
			"type": [ "Water" ]
		},
		"494": {
			"dex-index": "494",
			"name": "Victini",
			"availability": {
				"in-game": "2020-07-26"
			},
			"category": "Victory",
			"type": [ "Psychic", "Fire" ],
			"base-stamina": 225,
			"base-attack": 210,
			"base-defense": 210,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_FIR_OVERHEAT",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_PSY_PSYCHIC"
			],
			"special-charged-moves": [
				"CHRG_FIR_VCREATE"
			],
			"height-avg": 0.4,
			"weight-avg": 4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.5,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"495": {
			"dex-index": "495",
			"name": "Snivy",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-01-05",
				"shadow": "2025-01-15"
			},
			"category": "Grass Snake",
			"type": [ "Grass" ],
			"evolves-into": [ "496" ],
			"base-stamina": 128,
			"base-attack": 88,
			"base-defense": 107,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GRA_VINEWHIP"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_NOR_WRAP"
			],
			"height-avg": 0.6,
			"weight-avg": 8.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.0125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"496": {
			"dex-index": "496",
			"name": "Servine",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-01-05",
				"shadow": "2025-01-15"
			},
			"category": "Grass Snake",
			"type": [ "Grass" ],
			"evolves-from": "495",
			"evolves-into": [ "497" ],
			"base-stamina": 155,
			"base-attack": 122,
			"base-defense": 152,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_STE_IRONTAIL",
				"FAST_GRA_VINEWHIP"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_LEAFTORNADO",
				"CHRG_NOR_WRAP"
			],
			"height-avg": 0.8,
			"weight-avg": 16,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.24 ]
			}
		},
		"497": {
			"dex-index": "497",
			"name": "Serperior",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-01-05",
				"shadow": "2025-01-15"
			},
			"category": "Regal",
			"type": [ "Grass" ],
			"evolves-from": "496",
			"base-stamina": 181,
			"base-attack": 161,
			"base-defense": 204,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_STE_IRONTAIL",
				"FAST_GRA_VINEWHIP"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_LEAFTORNADO",
				"CHRG_FLY_AERIALACE"
			],
			"special-charged-moves": [
				"CHRG_GRA_FRENZYPLANT"
			],
			"height-avg": 3.3,
			"weight-avg": 63,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.4125,
				"wt-std-dev": 7.875,
				"xxs": [ 1.617, 1.65 ],
				"xs": [ 1.65, 2.475 ],
				"m": [ 2.475, 4.125 ],
				"xl": [ 4.125, 4.95 ],
				"xxl": [ 4.95, 5.115 ]
			}
		},
		"498": {
			"dex-index": "498",
			"name": "Tepig",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-07-03",
				"shadow": "2025-01-15"
			},
			"category": "Fire Pig",
			"type": [ "Fire" ],
			"evolves-into": [ "499" ],
			"base-stamina": 163,
			"base-attack": 115,
			"base-defense": 85,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.5,
			"weight-avg": 9.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.2375,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"499": {
			"dex-index": "499",
			"name": "Pignite",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-07-03",
				"shadow": "2025-01-15"
			},
			"category": "Fire Pig",
			"type": [ "Fire", "Fighting" ],
			"evolves-from": "498",
			"evolves-into": [ "500" ],
			"base-stamina": 207,
			"base-attack": 173,
			"base-defense": 106,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 1,
			"weight-avg": 55.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 6.9375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"500": {
			"dex-index": "500",
			"name": "Emboar",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-07-03",
				"shadow": "2025-01-15"
			},
			"category": "Mega Fire Pig",
			"type": [ "Fire", "Fighting" ],
			"evolves-from": "499",
			"base-stamina": 242,
			"base-attack": 235,
			"base-defense": 127,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_HEATWAVE",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_FIR_FLAMECHARGE"
			],
			"special-charged-moves": [
				"CHRG_FIR_BLASTBURN"
			],
			"height-avg": 1.6,
			"weight-avg": 150,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 18.75,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"501": {
			"dex-index": "501",
			"name": "Oshawott",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-09-19",
				"shadow": "2025-01-15"
			},
			"category": "Sea Otter",
			"type": [ "Water" ],
			"evolves-into": [ "502" ],
			"base-stamina": 146,
			"base-attack": 117,
			"base-defense": 85,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_AQUATAIL",
				"CHRG_WAT_WATERPULSE",
				"CHRG_DAR_NIGHTSLASH"
			],
			"height-avg": 0.5,
			"weight-avg": 5.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.7375,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"502": {
			"dex-index": "502",
			"name": "Dewott",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-09-19",
				"shadow": "2025-01-15"
			},
			"category": "Discipline",
			"type": [ "Water" ],
			"evolves-from": "501",
			"evolves-into": [ "503" ],
			"base-stamina": 181,
			"base-attack": 159,
			"base-defense": 116,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_AQUATAIL",
				"CHRG_WAT_WATERPULSE",
				"CHRG_BUG_XSCISSOR"
			],
			"height-avg": 0.8,
			"weight-avg": 24.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.0625,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.24 ]
			}
		},
		"503": {
			"dex-index": "503",
			"name": "Samurott",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-09-19",
				"shadow": "2025-01-15"
			},
			"category": "Formidable",
			"type": [ "Water" ],
			"evolves-from": "502",
			"base-stamina": 216,
			"base-attack": 212,
			"base-defense": 157,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_BLIZZARD",
				"CHRG_BUG_MEGAHORN",
				"CHRG_WAT_RAZORSHELL",
				"CHRG_WAT_LIQUIDATION"
			],
			"special-charged-moves": [
				"CHRG_WAT_HYDROCANNON"
			],
			"height-avg": 1.5,
			"weight-avg": 94.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 11.825,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"503-H": {
			"dex-index": "503-H",
			"form-data": {
				"base": "503",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2023-12-03",
				"shiny": "2023-12-03"
			},
			"type": [ "Water", "Dark" ],
			"base-stamina": 207,
			"base-attack": 218,
			"base-defense": 152,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_BUG_FURYCUTTER",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_WAT_RAZORSHELL",
				"CHRG_ICE_ICYWIND",
				"CHRG_BUG_XSCISSOR",
				"CHRG_DAR_DARKPULSE"
			],
			"special-charged-moves": [ ],
			"height-avg": 1.5,
			"weight-avg": 58.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 7.275,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"504": {
			"dex-index": "504",
			"name": "Patrat",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2019-09-16",
				"shadow": "2022-07-09"
			},
			"category": "Scout",
			"type": [ "Normal" ],
			"evolves-into": [ "505" ],
			"base-stamina": 128,
			"base-attack": 98,
			"base-defense": 73,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_NOR_HYPERFANG",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.5,
			"weight-avg": 11.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.45,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"505": {
			"dex-index": "505",
			"name": "Watchog",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2019-09-16",
				"shadow": "2022-07-09"
			},
			"category": "Lookout",
			"type": [ "Normal" ],
			"evolves-from": "504",
			"base-stamina": 155,
			"base-attack": 165,
			"base-defense": 139,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_NOR_HYPERFANG",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 1.1,
			"weight-avg": 27,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 3.375,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"506": {
			"dex-index": "506",
			"name": "Lillipup",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2019-09-16"
			},
			"category": "Puppy",
			"type": [ "Normal" ],
			"evolves-into": [ "507" ],
			"base-stamina": 128,
			"base-attack": 107,
			"base-defense": 86,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_GRO_DIG"
			],
			"height-avg": 0.4,
			"weight-avg": 4.1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.5125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"507": {
			"dex-index": "507",
			"name": "Herdier",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2019-09-16"
			},
			"category": "Loyal Dog",
			"type": [ "Normal" ],
			"evolves-from": "506",
			"evolves-into": [ "508" ],
			"base-stamina": 163,
			"base-attack": 145,
			"base-defense": 126,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_NOR_TAKEDOWN",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRO_DIG"
			],
			"height-avg": 0.9,
			"weight-avg": 14.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 1.8375,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"508": {
			"dex-index": "508",
			"name": "Stoutland",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2019-09-16"
			},
			"category": "Big-Hearted",
			"type": [ "Normal" ],
			"evolves-from": "507",
			"base-stamina": 198,
			"base-attack": 206,
			"base-defense": 182,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_NOR_TAKEDOWN",
				"FAST_ICE_ICEFANG",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_ELE_WILDCHARGE",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 1.2,
			"weight-avg": 61,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 7.625,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"509": {
			"dex-index": "509",
			"name": "Purrloin",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-11-18",
				"shadow": "2022-07-09"
			},
			"category": "Devious",
			"type": [ "Dark" ],
			"evolves-into": [ "510" ],
			"base-stamina": 121,
			"base-attack": 98,
			"base-defense": 73,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_DARKPULSE"
			],
			"height-avg": 0.4,
			"weight-avg": 10.1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1.2625,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"510": {
			"dex-index": "510",
			"name": "Liepard",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-11-18",
				"shadow": "2022-07-09"
			},
			"category": "Cruel",
			"type": [ "Dark" ],
			"evolves-from": "509",
			"base-stamina": 162,
			"base-attack": 187,
			"base-defense": 106,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_POI_GUNKSHOT",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_DARKPULSE",
				"CHRG_DAR_PAYBACK"
			],
			"height-avg": 1.1,
			"weight-avg": 37.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 4.6875,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"511": {
			"dex-index": "511",
			"name": "Pansage",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-08-05"
			},
			"category": "Grass Monkey",
			"type": [ "Grass" ],
			"evolves-into": [ "512" ],
			"base-stamina": 137,
			"base-attack": 104,
			"base-defense": 94,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_GRA_VINEWHIP"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.6,
			"weight-avg": 10.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.3125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"512": {
			"dex-index": "512",
			"name": "Simisage",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-08-05"
			},
			"category": "Thorn Monkey",
			"type": [ "Grass" ],
			"evolves-from": "511",
			"base-stamina": 181,
			"base-attack": 206,
			"base-defense": 133,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GRA_VINEWHIP"
			],
			"charged-moves": [
				"CHRG_GRA_SOLARBEAM",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 1.1,
			"weight-avg": 30.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 3.8125,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"513": {
			"dex-index": "513",
			"name": "Pansear",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-07-01"
			},
			"category": "High Temp",
			"type": [ "Fire" ],
			"evolves-into": [ "514" ],
			"base-stamina": 137,
			"base-attack": 104,
			"base-defense": 94,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_FIR_FIRESPIN"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMEBURST",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.6,
			"weight-avg": 11,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.375,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"514": {
			"dex-index": "514",
			"name": "Simisear",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-07-01"
			},
			"category": "Ember",
			"type": [ "Fire" ],
			"evolves-from": "513",
			"base-stamina": 181,
			"base-attack": 206,
			"base-defense": 133,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_FIR_FIRESPIN"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_FIREBLAST",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 1,
			"weight-avg": 28,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.5,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"515": {
			"dex-index": "515",
			"name": "Panpour",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-07-22"
			},
			"category": "Spray",
			"type": [ "Water" ],
			"evolves-into": [ "516" ],
			"base-stamina": 137,
			"base-attack": 104,
			"base-defense": 94,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_WAT_WATERPULSE",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.6,
			"weight-avg": 13.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.6875,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"516": {
			"dex-index": "516",
			"name": "Simipour",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-07-22"
			},
			"category": "Geyser",
			"type": [ "Water" ],
			"evolves-from": "515",
			"base-stamina": 181,
			"base-attack": 206,
			"base-defense": 133,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 1,
			"weight-avg": 29,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.625,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"517": {
			"dex-index": "517",
			"name": "Munna",
			"availability": {
				"in-game": "2020-02-14",
				"shiny": "2022-08-27"
			},
			"category": "Dream Eater",
			"type": [ "Psychic" ],
			"evolves-into": [ "518" ],
			"base-stamina": 183,
			"base-attack": 111,
			"base-defense": 92,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 0.6,
			"weight-avg": 23.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 2.9125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"518": {
			"dex-index": "518",
			"name": "Musharna",
			"availability": {
				"in-game": "2020-02-14",
				"shiny": "2022-08-27"
			},
			"category": "Drowsing",
			"type": [ "Psychic" ],
			"evolves-from": "517",
			"base-stamina": 253,
			"base-attack": 183,
			"base-defense": 166,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 1.1,
			"weight-avg": 60.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 7.5625,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"519": {
			"dex-index": "519",
			"name": "Pidove",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-07-03",
				"shadow": "2023-02-01"
			},
			"category": "Tiny Pigeon",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "520" ],
			"base-stamina": 137,
			"base-attack": 98,
			"base-defense": 80,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_FIR_HEATWAVE",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_AIRCUTTER"
			],
			"height-avg": 0.3,
			"weight-avg": 2.1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.2625,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"520": {
			"dex-index": "520",
			"name": "Tranquill",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-07-03",
				"shadow": "2023-02-01"
			},
			"category": "Wild Pigeon",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "519",
			"evolves-into": [ "521" ],
			"base-stamina": 158,
			"base-attack": 144,
			"base-defense": 107,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_FIR_HEATWAVE",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_SKYATTACK"
			],
			"height-avg": 0.6,
			"weight-avg": 15,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.875,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"521": {
			"dex-index": "521",
			"name": "Unfezant",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-07-03",
				"shadow": "2023-02-01"
			},
			"variants": [ "Male", "Female" ],
			"category": "Proud",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "520",
			"base-stamina": 190,
			"base-attack": 226,
			"base-defense": 146,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_FIR_HEATWAVE",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FLY_SKYATTACK"
			],
			"height-avg": 1.2,
			"weight-avg": 29,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 3.625,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"522": {
			"dex-index": "522",
			"name": "Blitzle",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-09-23",
				"shadow": "2023-02-01"
			},
			"category": "Electrified",
			"type": [ "Electric" ],
			"evolves-into": [ "523" ],
			"base-stamina": 128,
			"base-attack": 118,
			"base-defense": 64,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.8,
			"weight-avg": 29.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.725,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"523": {
			"dex-index": "523",
			"name": "Zebstrika",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2021-09-23",
				"shadow": "2023-02-01"
			},
			"category": "Thunderbolt",
			"type": [ "Electric" ],
			"evolves-from": "522",
			"base-stamina": 181,
			"base-attack": 211,
			"base-defense": 136,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_WILDCHARGE"
			],
			"height-avg": 1.6,
			"weight-avg": 79.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 9.9375,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"524": {
			"dex-index": "524",
			"name": "Roggenrola",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2020-08-14",
				"shadow": "2024-10-08"
			},
			"category": "Mantle",
			"type": [ "Rock" ],
			"evolves-into": [ "525" ],
			"base-stamina": 146,
			"base-attack": 121,
			"base-defense": 110,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_GRO_BULLDOZE",
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_STONEEDGE"
			],
			"height-avg": 0.4,
			"weight-avg": 18,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 2.25,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"525": {
			"dex-index": "525",
			"name": "Boldore",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2020-08-14",
				"shadow": "2024-10-08"
			},
			"category": "Ore",
			"type": [ "Rock" ],
			"evolves-from": "524",
			"evolves-into": [ "526" ],
			"base-stamina": 172,
			"base-attack": 174,
			"base-defense": 143,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_GRO_BULLDOZE",
				"CHRG_ROC_STONEEDGE"
			],
			"height-avg": 0.9,
			"weight-avg": 102,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 12.75,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"526": {
			"dex-index": "526",
			"name": "Gigalith",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2020-08-14",
				"shadow": "2024-10-08"
			},
			"category": "Compressed",
			"type": [ "Rock" ],
			"evolves-from": "525",
			"base-stamina": 198,
			"base-attack": 226,
			"base-defense": 201,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_STE_HEAVYSLAM"
			],
			"special-charged-moves": [
				"CHRG_ROC_METEORBEAM"
			],
			"height-avg": 1.7,
			"weight-avg": 260,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 32.5,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 3.4 ]
			}
		},
		"527": {
			"dex-index": "527",
			"name": "Woobat",
			"availability": {
				"in-game": "2020-02-01",
				"shiny": "2020-07-25"
			},
			"category": "Bat",
			"type": [ "Psychic", "Flying" ],
			"evolves-into": [ "528" ],
			"base-stamina": 163,
			"base-attack": 107,
			"base-defense": 85,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_FLY_AIRCUTTER",
				"CHRG_FLY_AERIALACE",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 0.4,
			"weight-avg": 2.1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.2625,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"528": {
			"dex-index": "528",
			"name": "Swoobat",
			"availability": {
				"in-game": "2020-02-01",
				"shiny": "2020-07-25"
			},
			"category": "Courting",
			"type": [ "Psychic", "Flying" ],
			"evolves-from": "527",
			"base-stamina": 167,
			"base-attack": 161,
			"base-defense": 119,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_FLY_AERIALACE",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_PSY_PSYCHICFANGS",
				"CHRG_FLY_FLY"
			],
			"height-avg": 0.9,
			"weight-avg": 10.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 1.3125,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"529": {
			"dex-index": "529",
			"name": "Drilbur",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2023-04-20",
				"shadow": "2023-10-26",
				"dynamax": "2024-11-15"
			},
			"category": "Mole",
			"type": [ "Ground" ],
			"evolves-into": [ "530" ],
			"base-stamina": 155,
			"base-attack": 154,
			"base-defense": 85,
			"dynamax-class": 2,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_GRO_DRILLRUN",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.3,
			"weight-avg": 8.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 1.0625,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"530": {
			"dex-index": "530",
			"name": "Excadrill",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2023-04-20",
				"shadow": "2023-10-26",
				"dynamax": "2024-11-15"
			},
			"category": "Subterrene",
			"type": [ "Ground", "Steel" ],
			"evolves-from": "529",
			"base-stamina": 242,
			"base-attack": 255,
			"base-defense": 129,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_GRO_MUDSLAP",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_GRO_DRILLRUN",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_STE_IRONHEAD",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 0.7,
			"weight-avg": 40.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 5.05,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"531": {
			"dex-index": "531",
			"name": "Audino",
			"category": "Hearing",
			"type": [ "Normal" ],
			"base-stamina": 230,
			"base-attack": 114,
			"base-defense": 163,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_NOR_HYPERBEAM"
			],
			"height-avg": 1.1,
			"weight-avg": 31,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 3.875,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"531-M": {
			"dex-index": "531-M",
			"name": "Mega Audino",
			"form-data": {
				"base": "531",
				"type": "Mega"
			},
			"availability": {
				"in-game": false
			},
			"type": [ "Normal", "Fairy" ],
			"height-avg": 1.5,
			"weight-avg": 32.0
		},
		"532": {
			"dex-index": "532",
			"name": "Timburr",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2020-03-13",
				"shadow": "2024-08-08"
			},
			"category": "Muscular",
			"type": [ "Fighting" ],
			"evolves-into": [ "533" ],
			"base-stamina": 181,
			"base-attack": 134,
			"base-defense": 87,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_NOR_POUND"
			],
			"charged-moves": [
				"CHRG_FIG_LOWSWEEP",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.6,
			"weight-avg": 12.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.5625,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"533": {
			"dex-index": "533",
			"name": "Gurdurr",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2020-03-13",
				"shadow": "2024-08-08"
			},
			"category": "Muscular",
			"type": [ "Fighting" ],
			"evolves-from": "532",
			"evolves-into": [ "534" ],
			"base-stamina": 198,
			"base-attack": 180,
			"base-defense": 134,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_FIG_LOWSWEEP",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_ROC_STONEEDGE"
			],
			"height-avg": 1.2,
			"weight-avg": 40,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 5,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"534": {
			"dex-index": "534",
			"name": "Conkeldurr",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2020-03-13",
				"shadow": "2024-08-08"
			},
			"category": "Muscular",
			"type": [ "Fighting" ],
			"evolves-from": "533",
			"base-stamina": 233,
			"base-attack": 243,
			"base-defense": 158,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_ROC_STONEEDGE"
			],
			"special-charged-moves": [
				"CHRG_DAR_BRUTALSWING"
			],
			"height-avg": 1.4,
			"weight-avg": 87,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 10.875,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"535": {
			"dex-index": "535",
			"name": "Tympole",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2021-07-17"
			},
			"category": "Tadpole",
			"type": [ "Water" ],
			"evolves-into": [ "536" ],
			"base-stamina": 137,
			"base-attack": 98,
			"base-defense": 78,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_GRO_MUDBOMB",
				"CHRG_POI_SLUDGEWAVE"
			],
			"height-avg": 0.5,
			"weight-avg": 4.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.5625,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"536": {
			"dex-index": "536",
			"name": "Palpitoad",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2021-07-17"
			},
			"category": "Vibration",
			"type": [ "Water", "Ground" ],
			"evolves-from": "535",
			"evolves-into": [ "537" ],
			"base-stamina": 181,
			"base-attack": 128,
			"base-defense": 109,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_POI_SLUDGEWAVE"
			],
			"height-avg": 0.8,
			"weight-avg": 17,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.125,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.24 ]
			}
		},
		"537": {
			"dex-index": "537",
			"name": "Seismitoad",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2021-07-17"
			},
			"category": "Vibration",
			"type": [ "Water", "Ground" ],
			"evolves-from": "536",
			"base-stamina": 233,
			"base-attack": 188,
			"base-defense": 150,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_MUDDYWATER",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 1.5,
			"weight-avg": 62,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 7.75,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"538": {
			"dex-index": "538",
			"name": "Throh",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2021-07-17",
				"shadow": "2023-06-05"
			},
			"category": "Judo",
			"type": [ "Fighting" ],
			"base-stamina": 260,
			"base-attack": 172,
			"base-defense": 160,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_NOR_BODYSLAM",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 1.3,
			"weight-avg": 55.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 6.9375,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"539": {
			"dex-index": "539",
			"name": "Sawk",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2021-07-17",
				"shadow": "2023-06-05"
			},
			"category": "Karate",
			"type": [ "Fighting" ],
			"base-stamina": 181,
			"base-attack": 231,
			"base-defense": 153,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_NOR_BODYSLAM",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 1.4,
			"weight-avg": 51,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 6.375,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"540": {
			"dex-index": "540",
			"name": "Sewaddle",
			"availability": {
				"in-game": "2020-08-14",
				"shiny": "2024-10-05"
			},
			"category": "Sewing",
			"type": [ "Bug", "Grass" ],
			"evolves-into": [ "541" ],
			"base-stamina": 128,
			"base-attack": 96,
			"base-defense": 124,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_BUG_SILVERWIND"
			],
			"height-avg": 0.3,
			"weight-avg": 2.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.3125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"541": {
			"dex-index": "541",
			"name": "Swadloon",
			"availability": {
				"in-game": "2020-08-14",
				"shiny": "2024-10-05"
			},
			"category": "Leaf-Wrapped",
			"type": [ "Bug", "Grass" ],
			"evolves-from": "540",
			"evolves-into": [ "542" ],
			"base-stamina": 146,
			"base-attack": 115,
			"base-defense": 162,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_BUG_SILVERWIND"
			],
			"height-avg": 0.5,
			"weight-avg": 7.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.9125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"542": {
			"dex-index": "542",
			"name": "Leavanny",
			"availability": {
				"in-game": "2020-08-14",
				"shiny": "2024-10-05"
			},
			"category": "Nurturing",
			"type": [ "Bug", "Grass" ],
			"evolves-from": "541",
			"base-stamina": 181,
			"base-attack": 205,
			"base-defense": 165,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_BUG_BUGBITE"
			],
			"special-fast-moves": [
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_BUG_XSCISSOR",
				"CHRG_BUG_SILVERWIND",
				"CHRG_GRA_LEAFSTORM"
			],
			"height-avg": 1.2,
			"weight-avg": 20.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.5625,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"543": {
			"dex-index": "543",
			"name": "Venipede",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-08-10",
				"shadow": "2024-10-08"
			},
			"category": "Centipede",
			"type": [ "Bug", "Poison" ],
			"evolves-into": [ "544" ],
			"base-stamina": 102,
			"base-attack": 83,
			"base-defense": 99,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_POI_POISONSTING"
			],
			"charged-moves": [
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_STE_GYROBALL"
			],
			"height-avg": 0.4,
			"weight-avg": 5.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.6625,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"544": {
			"dex-index": "544",
			"name": "Whirlipede",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-08-10",
				"shadow": "2024-10-08"
			},
			"category": "Curlipede",
			"type": [ "Bug", "Poison" ],
			"evolves-from": "543",
			"evolves-into": [ "545" ],
			"base-stamina": 120,
			"base-attack": 100,
			"base-defense": 173,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_POI_POISONSTING"
			],
			"charged-moves": [
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_STE_GYROBALL"
			],
			"height-avg": 1.2,
			"weight-avg": 58.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 7.3125,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"545": {
			"dex-index": "545",
			"name": "Scolipede",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-08-10",
				"shadow": "2024-10-08"
			},
			"category": "Megapede",
			"type": [ "Bug", "Poison" ],
			"evolves-from": "544",
			"base-stamina": 155,
			"base-attack": 203,
			"base-defense": 175,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_BUG_MEGAHORN",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_STE_GYROBALL",
				"CHRG_BUG_XSCISSOR"
			],
			"height-avg": 2.5,
			"weight-avg": 200.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 25.0625,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 3.875 ]
			}
		},
		"546": {
			"dex-index": "546",
			"name": "Cottonee",
			"availability": {
				"in-game": "2020-08-14",
				"shiny": "2022-03-22"
			},
			"category": "Cotton Puff",
			"type": [ "Grass", "Fairy" ],
			"evolves-into": [ "547" ],
			"base-stamina": 120,
			"base-attack": 71,
			"base-defense": 111,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.3,
			"weight-avg": 0.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.075,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"547": {
			"dex-index": "547",
			"name": "Whimsicott",
			"availability": {
				"in-game": "2020-08-14",
				"shiny": "2022-03-22"
			},
			"category": "Windveiled",
			"type": [ "Grass", "Fairy" ],
			"evolves-from": "546",
			"base-stamina": 155,
			"base-attack": 164,
			"base-defense": 176,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_GRA_RAZORLEAF",
				"FAST_FAI_FAIRYWIND"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_FLY_HURRICANE",
				"CHRG_FAI_MOONBLAST",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.7,
			"weight-avg": 6.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 0.825,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"548": {
			"dex-index": "548",
			"name": "Petilil",
			"availability": {
				"in-game": "2020-07-17",
				"shiny": "2023-08-04"
			},
			"category": "Bulb",
			"type": [ "Grass" ],
			"evolves-into": [ "549" ],
			"base-stamina": 128,
			"base-attack": 119,
			"base-defense": 91,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_WAT_HIDDENPOWER"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.5,
			"weight-avg": 6.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.825,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"549": {
			"dex-index": "549",
			"name": "Lilligant",
			"availability": {
				"in-game": "2020-07-17",
				"shiny": "2023-08-04"
			},
			"category": "Flowering",
			"type": [ "Grass" ],
			"evolves-from": "548",
			"base-stamina": 172,
			"base-attack": 214,
			"base-defense": 155,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_WAT_HIDDENPOWER",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_GRA_SOLARBEAM"
			],
			"height-avg": 1.1,
			"weight-avg": 16.3,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 2.0375,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"549-H": {
			"dex-index": "549-H",
			"form-data": {
				"base": "549",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": false
			},
			"category": "Spinning",
			"type": [ "Grass", "Fighting" ]
		},
		"550": {
			"dex-index": "550",
			"name": "Basculin",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2024-12-03"
			},
			"variants": [ "Blue Striped", "Red Striped" ],
			"variants-ital": [ "Lineablu", "Linearossa" ],
			"category": "Hostile",
			"type": [ "Water" ],
			"base-stamina": 172,
			"base-attack": 189,
			"base-defense": 129,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 2.25,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"550-W": {
			"dex-index": "550-W",
			"form-data": {
				"base": "550",
				"type": "idk",
				"form": "White Striped Form",
				"form-ital": "Forma Lineabianca"
			},
			"availability": {
				"in-game": "2024-02-16",
				"shiny": "2024-02-16"
			},
			"category": "Mellow",
			"evolves-into": [ "902" ]
		},
		"551": {
			"dex-index": "551",
			"name": "Sandile",
			"availability": {
				"in-game": "2020-10-12",
				"shiny": "2024-03-27"
			},
			"category": "Desert Croc",
			"type": [ "Ground", "Dark" ],
			"evolves-into": [ "552" ],
			"base-stamina": 137,
			"base-attack": 132,
			"base-defense": 69,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 0.7,
			"weight-avg": 15.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.9,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"552": {
			"dex-index": "552",
			"name": "Krokorok",
			"availability": {
				"in-game": "2020-10-12",
				"shiny": "2024-03-27"
			},
			"category": "Desert Croc",
			"type": [ "Ground", "Dark" ],
			"evolves-from": "551",
			"evolves-into": [ "553" ],
			"base-stamina": 155,
			"base-attack": 155,
			"base-defense": 90,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 1,
			"weight-avg": 33.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.175,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"553": {
			"dex-index": "553",
			"name": "Krookodile",
			"availability": {
				"in-game": "2020-10-12",
				"shiny": "2024-03-27"
			},
			"category": "Intimidation",
			"type": [ "Ground", "Dark" ],
			"evolves-from": "552",
			"base-stamina": 216,
			"base-attack": 229,
			"base-defense": 158,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_DAR_CRUNCH",
				"CHRG_DRA_OUTRAGE",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 1.5,
			"weight-avg": 96.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 12.0375,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"554": {
			"dex-index": "554",
			"name": "Darumaka",
			"availability": {
				"in-game": "2020-01-24",
				"shiny": "2021-07-06",
				"shadow": "2024-03-27"
			},
			"category": "Zen Charm",
			"type": [ "Fire" ],
			"evolves-into": [ "555" ],
			"base-stamina": 172,
			"base-attack": 153,
			"base-defense": 86,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIR_FIREFANG"
			],
			"charged-moves": [
				"CHRG_FIR_FIREPUNCH",
				"CHRG_FIR_FLAMECHARGE"
			],
			"height-avg": 0.6,
			"weight-avg": 37.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 4.6875,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"554-G": {
			"dex-index": "554-G",
			"name": "Galarian Darumaka",
			"form-data": {
				"base": "554",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-06-03",
				"shiny": "2021-12-16"
			},
			"type": [ "Ice" ],
			"evolves-into": [ "555-G" ],
			"base-stamina": 172,
			"base-attack": 153,
			"base-defense": 86,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_ICE_ICEPUNCH",
				"CHRG_ICE_ICEBEAM"
			],
			"height-avg": 0.7,
			"weight-avg": 40,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 5,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"555": {
			"dex-index": "555",
			"name": "Darmanitan",
			"availability": {
				"in-game": "2020-01-24",
				"shiny": "2021-07-06",
				"shadow": "2024-03-27"
			},
			"category": "Blazing Pokémon",
			"type": [ "Fire" ],
			"evolves-from": "554",
			"base-stamina": 233,
			"base-attack": 263,
			"base-defense": 114,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIR_FIREFANG",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FIR_OVERHEAT",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_PSY_PSYCHIC",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 1.3,
			"weight-avg": 92.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 11.6125,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"555-Z": {
			"dex-index": "555-Z",
			"form-data": {
				"base": "555",
				"type": "battle?",
				"form": "Zen Mode",
				"form-ital": "Stato Zen"
			},
			"availability": {
				"in-game": false
			},
			"type": [ "Fire", "Psychic" ],
			"base-stamina": 233,
			"base-attack": 243,
			"base-defense": 202
		},
		"555-G": {
			"dex-index": "555-G",
			"name": "Galarian Darmanitan",
			"form-data": {
				"base": "555",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-06-03",
				"shiny": "2021-12-16"
			},
			"category": "Zen Charm",
			"type": [ "Ice" ],
			"evolves-from": "554-G",
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_FIG_SUPERPOWER",
				"CHRG_FIR_OVERHEAT",
				"CHRG_ICE_AVALANCHE",
				"CHRG_ICE_ICEPUNCH"
			],
			"height-avg": 1.7,
			"weight-avg": 120,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 15.0,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"555-GZ": {
			"dex-index": "555-GZ",
			"name": "Galarian Darmanitan (Zen Mode)",
			"name-ital": "Galarian Darmanitan (Stato Zen)",
			"form-data": {
				"base": "555",
				"type": "battle?",
				"form": "Zen Mode",
				"form-ital": "Stato Zen"
			},
			"availability": {
				"in-game": false
			},
			"category": "Blazing Pokémon",
			"type": [ "Ice", "Fire" ],
			"base-stamina": 233,
			"base-attack": 323,
			"base-defense": 123
		},
		"556": {
			"dex-index": "556",
			"name": "Maractus",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2025-02-21"
			},
			"category": "Cactus",
			"type": [ "Grass" ],
			"base-stamina": 181,
			"base-attack": 201,
			"base-defense": 130,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_BULLETSEED",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_GRA_SOLARBEAM"
			],
			"height-avg": 1,
			"weight-avg": 28,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.5,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"557": {
			"dex-index": "557",
			"name": "Dwebble",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2020-06-26",
				"shadow": "2024-01-27"
			},
			"category": "Rock Inn",
			"type": [ "Bug", "Rock" ],
			"evolves-into": [ "558" ],
			"base-stamina": 137,
			"base-attack": 118,
			"base-defense": 128,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_CUT",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_BUG_XSCISSOR",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.3,
			"weight-avg": 14.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 1.8125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"558": {
			"dex-index": "558",
			"name": "Crustle",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2020-06-26",
				"shadow": "2024-01-27"
			},
			"category": "Stone Home",
			"type": [ "Bug", "Rock" ],
			"evolves-from": "557",
			"base-stamina": 172,
			"base-attack": 188,
			"base-defense": 200,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_BUG_XSCISSOR",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 1.4,
			"weight-avg": 200,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 25,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"559": {
			"dex-index": "559",
			"name": "Scraggy",
			"availability": {
				"in-game": "2020-01-29",
				"shiny": "2023-08-11"
			},
			"category": "Shedding",
			"type": [ "Dark", "Fighting" ],
			"evolves-into": [ "560" ],
			"base-stamina": 137,
			"base-attack": 132,
			"base-defense": 132,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_POI_ACIDSPRAY",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_DAR_FOULPLAY",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 0.6,
			"weight-avg": 11.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.475,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"560": {
			"dex-index": "560",
			"name": "Scrafty",
			"availability": {
				"in-game": "2020-01-29",
				"shiny": "2023-08-11"
			},
			"category": "Hoodlum",
			"type": [ "Dark", "Fighting" ],
			"evolves-from": "559",
			"base-stamina": 163,
			"base-attack": 163,
			"base-defense": 222,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_POI_ACIDSPRAY",
				"CHRG_FIG_POWERUPPUNCH",
				"CHRG_DAR_FOULPLAY",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 1.1,
			"weight-avg": 30,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 3.75,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"561": {
			"dex-index": "561",
			"name": "Sigilyph",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2025-02-21"
			},
			"category": "Avianoid",
			"type": [ "Psychic", "Flying" ],
			"base-stamina": 176,
			"base-attack": 204,
			"base-defense": 167,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_FLY_AIRCUTTER",
				"CHRG_PSY_PSYBEAM",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_BUG_SIGNALBEAM"
			],
			"height-avg": 1.4,
			"weight-avg": 14,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 1.75,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"562": {
			"dex-index": "562",
			"name": "Yamask",
			"availability": {
				"in-game": "2019-10-17",
				"shiny": "2019-10-17"
			},
			"category": "Spirit",
			"type": [ "Ghost" ],
			"evolves-into": [ "563" ],
			"base-stamina": 116,
			"base-attack": 95,
			"base-defense": 141,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DAR_DARKPULSE",
				"CHRG_GHO_OMINOUSWIND"
			],
			"height-avg": 0.5,
			"weight-avg": 1.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.1875,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"562-G": {
			"dex-index": "562-G",
			"name": "Galarian Yamask",
			"form-data": {
				"base": "562",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-10-24",
				"shiny": "2022-10-20"
			},
			"type": [ "Ground", "Ghost" ],
			"evolves-into": [ "867" ]
		},
		"563": {
			"dex-index": "563",
			"name": "Cofagrigus",
			"availability": {
				"in-game": "2019-10-17",
				"shiny": "2019-10-17"
			},
			"category": "Coffin",
			"type": [ "Ghost" ],
			"evolves-from": "562",
			"base-stamina": 151,
			"base-attack": 163,
			"base-defense": 237,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DAR_DARKPULSE",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.7,
			"weight-avg": 76.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 9.5625,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"564": {
			"dex-index": "564",
			"name": "Tirtouga",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-07",
				"shadow": "2024-08-08"
			},
			"category": "Prototurtle",
			"type": [ "Water", "Rock" ],
			"evolves-into": [ "565" ],
			"base-stamina": 144,
			"base-attack": 134,
			"base-defense": 146,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.7,
			"weight-avg": 16.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.0625,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.4 ]
			}
		},
		"565": {
			"dex-index": "565",
			"name": "Carracosta",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-07",
				"shadow": "2024-08-08"
			},
			"category": "Prototurtle",
			"type": [ "Water", "Rock" ],
			"evolves-from": "564",
			"base-stamina": 179,
			"base-attack": 192,
			"base-defense": 197,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_NOR_BODYSLAM",
				"CHRG_WAT_LIQUIDATION"
			],
			"height-avg": 1.2,
			"weight-avg": 81,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 10.125,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"566": {
			"dex-index": "566",
			"name": "Archen",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-07",
				"shadow": "2024-08-08"
			},
			"category": "First Bird",
			"type": [ "Rock", "Flying" ],
			"evolves-into": [ "567" ],
			"base-stamina": 146,
			"base-attack": 213,
			"base-defense": 89,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.5,
			"weight-avg": 9.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.1875,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"567": {
			"dex-index": "567",
			"name": "Archeops",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-07",
				"shadow": "2024-08-08"
			},
			"category": "First Bird",
			"type": [ "Rock", "Flying" ],
			"evolves-from": "566",
			"base-stamina": 181,
			"base-attack": 292,
			"base-defense": 139,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_STEELWING",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 1.4,
			"weight-avg": 32,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.175,
				"wt-std-dev": 4,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.8 ]
			}
		},
		"568": {
			"dex-index": "568",
			"name": "Trubbish",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2021-04-20",
				"shadow": "2025-01-15"
			},
			"category": "Trash Bag",
			"type": [ "Poison" ],
			"evolves-into": [ "569" ],
			"base-stamina": 137,
			"base-attack": 96,
			"base-defense": 122,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_POI_GUNKSHOT"
			],
			"height-avg": 0.6,
			"weight-avg": 31,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 3.875,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"569": {
			"dex-index": "569",
			"name": "Garbodor",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2021-04-20",
				"shadow": "2025-01-15"
			},
			"category": "Trash Heap",
			"type": [ "Poison" ],
			"evolves-from": "568",
			"base-stamina": 190,
			"base-attack": 181,
			"base-defense": 164,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_INFESTATION",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_NOR_BODYSLAM",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_POI_GUNKSHOT"
			],
			"height-avg": 1.9,
			"weight-avg": 107.3,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 13.4125,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"569-G": {
			"dex-index": "569-G",
			"form-data": {
				"base": "569",
				"type": "Giga"
			}
		},
		"570": {
			"dex-index": "570",
			"name": "Zorua",
			"availability": {
				"in-game": "2022-10-25",
				"shiny": "2023-10-26"
			},
			"category": "Tricky Fox",
			"type": [ "Dark" ],
			"evolves-into": [ "571" ],
			"base-stamina": 120,
			"base-attack": 153,
			"base-defense": 78,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_DAR_FOULPLAY",
				"CHRG_FLY_AERIALACE",
				"CHRG_DAR_DARKPULSE",
				"CHRG_GHO_NIGHTSHADE"
			],
			"height-avg": 0.7,
			"weight-avg": 12.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.5625,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"570-H": {
			"dex-index": "570-H",
			"form-data": {
				"base": "570",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": false
			},
			"category": "Spiteful Fox",
			"type": [ "Normal", "Ghost" ],
			"evolves-into": [ "571-H" ]
		},
		"571": {
			"dex-index": "571",
			"name": "Zoroark",
			"availability": {
				"in-game": "2022-10-25",
				"shiny": "2023-10-26"
			},
			"category": "Illusion Fox",
			"type": [ "Dark" ],
			"evolves-from": "570",
			"base-stamina": 155,
			"base-attack": 250,
			"base-defense": 127,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_SHADOWCLAW",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_FOULPLAY",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_GHO_NIGHTSHADE"
			],
			"height-avg": 1.6,
			"weight-avg": 81.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 10.1375,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"571-H": {
			"dex-index": "571-H",
			"form-data": {
				"base": "571",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": false
			},
			"category": "Baneful Fox",
			"type": [ "Normal", "Ghost" ],
			"evolves-from": "570-H"
		},
		"572": {
			"dex-index": "572",
			"name": "Minccino",
			"availability": {
				"in-game": "2020-02-02",
				"shiny": "2020-02-02"
			},
			"category": "Chinchilla",
			"type": [ "Normal" ],
			"evolves-into": [ "573" ],
			"base-stamina": 146,
			"base-attack": 98,
			"base-defense": 80,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_NOR_SWIFT",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_WAT_AQUATAIL"
			],
			"height-avg": 0.4,
			"weight-avg": 5.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.725,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"573": {
			"dex-index": "573",
			"name": "Cinccino",
			"availability": {
				"in-game": "2020-02-02",
				"shiny": "2020-02-02"
			},
			"category": "Scarf",
			"type": [ "Normal" ],
			"evolves-from": "572",
			"base-stamina": 181,
			"base-attack": 198,
			"base-defense": 130,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_WAT_AQUATAIL"
			],
			"height-avg": 0.5,
			"weight-avg": 7.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.9375,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"574": {
			"dex-index": "574",
			"name": "Gothita",
			"availability": {
				"in-game": "2020-03-27",
				"shiny": "2023-11-15",
				"shadow": "2024-03-27"
			},
			"category": "Fixation",
			"type": [ "Psychic" ],
			"evolves-into": [ "575" ],
			"base-stamina": 128,
			"base-attack": 98,
			"base-defense": 112,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.4,
			"weight-avg": 5.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.725,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"575": {
			"dex-index": "575",
			"name": "Gothorita",
			"availability": {
				"in-game": "2020-03-27",
				"shiny": "2023-11-15",
				"shadow": "2024-03-27"
			},
			"category": "Manipulate",
			"type": [ "Psychic" ],
			"evolves-from": "574",
			"evolves-into": [ "576" ],
			"base-stamina": 155,
			"base-attack": 137,
			"base-defense": 153,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.7,
			"weight-avg": 18,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.25,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"576": {
			"dex-index": "576",
			"name": "Gothitelle",
			"availability": {
				"in-game": "2020-03-27",
				"shiny": "2023-11-15",
				"shadow": "2024-03-27"
			},
			"category": "Astral Body",
			"type": [ "Psychic" ],
			"evolves-from": "575",
			"base-stamina": 172,
			"base-attack": 176,
			"base-defense": 205,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.5,
			"weight-avg": 44,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.5,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"577": {
			"dex-index": "577",
			"name": "Solosis",
			"availability": {
				"in-game": "2020-03-27",
				"shiny": "2023-09-20",
				"shadow": "2024-03-27"
			},
			"category": "Cell",
			"type": [ "Psychic" ],
			"evolves-into": [ "578" ],
			"base-stamina": 128,
			"base-attack": 170,
			"base-defense": 83,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 0.3,
			"weight-avg": 1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"578": {
			"dex-index": "578",
			"name": "Duosion",
			"availability": {
				"in-game": "2020-03-27",
				"shiny": "2023-09-20",
				"shadow": "2024-03-27"
			},
			"category": "Mitosis",
			"type": [ "Psychic" ],
			"evolves-from": "577",
			"evolves-into": [ "579" ],
			"base-stamina": 163,
			"base-attack": 208,
			"base-defense": 103,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 0.6,
			"weight-avg": 8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"579": {
			"dex-index": "579",
			"name": "Reuniclus",
			"availability": {
				"in-game": "2020-03-27",
				"shiny": "2023-09-20",
				"shadow": "2024-03-27"
			},
			"category": "Multiplying",
			"type": [ "Psychic" ],
			"evolves-from": "578",
			"base-stamina": 242,
			"base-attack": 214,
			"base-defense": 148,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_HIDDENPOWER",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 1,
			"weight-avg": 20.1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 2.5125,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"580": {
			"dex-index": "580",
			"name": "Ducklett",
			"availability": {
				"in-game": "2020-07-03",
				"shiny": "2024-07-05",
				"shadow": "2022-07-09"
			},
			"category": "Water Bird",
			"type": [ "Water", "Flying" ],
			"evolves-into": [ "581" ],
			"base-stamina": 158,
			"base-attack": 84,
			"base-defense": 96,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_FLY_BRAVEBIRD"
			],
			"height-avg": 0.5,
			"weight-avg": 5.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.6875,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"581": {
			"dex-index": "581",
			"name": "Swanna",
			"availability": {
				"in-game": "2020-07-03",
				"shiny": "2024-07-05",
				"shadow": "2022-07-09"
			},
			"category": "White Bird",
			"type": [ "Water", "Flying" ],
			"evolves-from": "580",
			"base-stamina": 181,
			"base-attack": 182,
			"base-defense": 132,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_FLY_HURRICANE",
				"CHRG_FLY_FLY"
			],
			"height-avg": 1.3,
			"weight-avg": 24.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 3.025,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"582": {
			"dex-index": "582",
			"name": "Vanillite",
			"availability": {
				"in-game": "2020-12-22",
				"shiny": "2023-12-25"
			},
			"category": "Fresh Snow",
			"type": [ "Ice" ],
			"evolves-into": [ "583" ],
			"base-stamina": 113,
			"base-attack": 118,
			"base-defense": 106,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_ICE_ICYWIND",
				"CHRG_ICE_ICEBEAM",
				"CHRG_BUG_SIGNALBEAM"
			],
			"height-avg": 0.4,
			"weight-avg": 5.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.7125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"583": {
			"dex-index": "583",
			"name": "Vanillish",
			"availability": {
				"in-game": "2020-12-22",
				"shiny": "2023-12-25"
			},
			"category": "Icy Snow",
			"type": [ "Ice" ],
			"evolves-from": "582",
			"evolves-into": [ "584" ],
			"base-stamina": 139,
			"base-attack": 151,
			"base-defense": 138,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_FROSTBREATH",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_ICE_ICYWIND",
				"CHRG_ICE_ICEBEAM",
				"CHRG_BUG_SIGNALBEAM"
			],
			"height-avg": 1.1,
			"weight-avg": 41,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 5.125,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"584": {
			"dex-index": "584",
			"name": "Vanilluxe",
			"availability": {
				"in-game": "2020-12-22",
				"shiny": "2023-12-25"
			},
			"category": "Snowstorm",
			"type": [ "Ice" ],
			"evolves-from": "583",
			"base-stamina": 174,
			"base-attack": 218,
			"base-defense": 184,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_FROSTBREATH",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_ICE_BLIZZARD",
				"CHRG_STE_FLASHCANNON",
				"CHRG_BUG_SIGNALBEAM"
			],
			"height-avg": 1.3,
			"weight-avg": 57.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 7.1875,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"585-0": {
			"dex-index": "585-0",
			"name": "Deerling",
			"category": "Season",
			"type": [ "Normal", "Grass" ],
			"evolves-into": [ "586-0" ],
			"base-stamina": 155,
			"base-attack": 115,
			"base-defense": 100,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.6,
			"weight-avg": 19.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 2.4375,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"585-A": {
			"dex-index": "585-A",
			"form-data": {
				"base": "585-0",
				"type": "idk",
				"form": "Autumn",
				"form-ital": "Autunno"
			},
			"availability": {
				"in-game": "2020-10-09",
				"shiny": "2025-02-21"
			},
			"evolves-into": [ "586-A" ]
		},
		"585-P": {
			"dex-index": "585-P",
			"form-data": {
				"base": "585-0",
				"type": "idk",
				"form": "Spring",
				"form-ital": "Primavera"
			},
			"availability": {
				"in-game": "2021-03-01"
			},
			"evolves-into": [ "586-P" ]
		},
		"585-U": {
			"dex-index": "585-U",
			"form-data": {
				"base": "585-0",
				"type": "idk",
				"form": "Summer",
				"form-ital": "Estate"
			},
			"availability": {
				"in-game": "2020-12-01",
				"shiny": "2025-02-21"
			},
			"evolves-into": [ "586-U" ]
		},
		"585-W": {
			"dex-index": "585-W",
			"form-data": {
				"base": "585-0",
				"type": "idk",
				"form": "Winter",
				"form-ital": "Inverno"
			},
			"availability": {
				"in-game": "2020-12-01",
				"shiny": "2025-02-21"
			},
			"evolves-into": [ "586-W" ]
		},
		"586-0": {
			"dex-index": "586-0",
			"name": "Sawsbuck",
			"category": "Season",
			"type": [ "Normal", "Grass" ],
			"evolves-from": "585-0",
			"base-stamina": 190,
			"base-attack": 198,
			"base-defense": 146,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_BUG_MEGAHORN",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.9,
			"weight-avg": 92.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 11.5625,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"586-A": {
			"dex-index": "586-A",
			"form-data": {
				"base": "586-0",
				"type": "idk",
				"form": "Autumn",
				"form-ital": "Autunno"
			},
			"availability": {
				"in-game": "2020-10-09",
				"shiny": "2025-02-21"
			},
			"evolves-from": "585-A"
		},
		"586-P": {
			"dex-index": "586-P",
			"form-data": {
				"base": "586-0",
				"type": "idk",
				"form": "Spring",
				"form-ital": "Primavera"
			},
			"availability": {
				"in-game": "2021-03-01"
			},
			"evolves-from": "585-P"
		},
		"586-U": {
			"dex-index": "586-U",
			"form-data": {
				"base": "586-0",
				"type": "idk",
				"form": "Summer",
				"form-ital": "Estate"
			},
			"availability": {
				"in-game": "2020-12-01",
				"shiny": "2025-02-21"
			},
			"evolves-from": "585-U"
		},
		"586-W": {
			"dex-index": "586-W",
			"form-data": {
				"base": "586-0",
				"type": "idk",
				"form": "Winter",
				"form-ital": "Inverno"
			},
			"availability": {
				"in-game": "2020-12-01",
				"shiny": "2025-02-21"
			},
			"evolves-from": "585-W"
		},
		"587": {
			"dex-index": "587",
			"name": "Emolga",
			"availability": {
				"in-game": "2020-08-14",
				"shiny": "2024-05-30"
			},
			"category": "Sky Squirrel",
			"type": [ "Electric", "Flying" ],
			"base-stamina": 146,
			"base-attack": 158,
			"base-defense": 127,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_FLY_AERIALACE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_FLY_ACROBATICS"
			],
			"height-avg": 0.4,
			"weight-avg": 5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.625,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"588": {
			"dex-index": "588",
			"name": "Karrablast",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-04",
				"shadow": "2024-10-08"
			},
			"category": "Clamping",
			"type": [ "Bug" ],
			"evolves-into": [ "589" ],
			"base-stamina": 137,
			"base-attack": 137,
			"base-defense": 87,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_BUG_XSCISSOR",
				"CHRG_GRO_DRILLRUN",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 0.5,
			"weight-avg": 5.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.7375,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"589": {
			"dex-index": "589",
			"name": "Escavalier",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-04",
				"shadow": "2024-10-08"
			},
			"category": "Cavalry",
			"type": [ "Bug", "Steel" ],
			"evolves-from": "588",
			"base-stamina": 172,
			"base-attack": 223,
			"base-defense": 187,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_BUG_MEGAHORN",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_GRO_DRILLRUN",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 1,
			"weight-avg": 33,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.125,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"590": {
			"dex-index": "590",
			"name": "Foongus",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-07-01",
				"shadow": "2022-07-09"
			},
			"category": "Mushroom",
			"type": [ "Grass", "Poison" ],
			"evolves-into": [ "591" ],
			"base-stamina": 170,
			"base-attack": 97,
			"base-defense": 91,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_NOR_BODYSLAM",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.2,
			"weight-avg": 1,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.125,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.4 ]
			}
		},
		"591": {
			"dex-index": "591",
			"name": "Amoonguss",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-07-01",
				"shadow": "2022-07-09"
			},
			"category": "Mushroom",
			"type": [ "Grass", "Poison" ],
			"evolves-from": "590",
			"base-stamina": 249,
			"base-attack": 155,
			"base-defense": 139,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_DAR_FEINTATTACK"
			],
			"charged-moves": [
				"CHRG_DAR_FOULPLAY",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.6,
			"weight-avg": 10.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.3125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"592-0": {
			"dex-index": "592-0",
			"name": "Frillish",
			"category": "Floating",
			"type": [ "Water", "Ghost" ],
			"evolves-into": [ "593-0" ],
			"base-stamina": 146,
			"base-attack": 115,
			"base-defense": 134,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_GHO_HEX"
			],
			"charged-moves": [
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_ICE_ICEBEAM",
				"CHRG_GHO_OMINOUSWIND"
			],
			"height-avg": 1.2,
			"weight-avg": 33,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 4.125,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"592-B": {
			"dex-index": "592-B",
			"form-data": {
				"base": "592-0",
				"type": "Gender",
				"form": "Blue",
				"form-ital": "Azzurro"
			},
			"availability": {
				"in-game": "2021-01-11",
				"shiny": "2023-02-08"
			},
			"evolves-into": [ "593-B" ]
		},
		"592-P": {
			"dex-index": "592-P",
			"form-data": {
				"base": "592-0",
				"type": "Gender",
				"form": "Pink",
				"form-ital": "Rosa"
			},
			"evolves-into": [ "593-2" ]
		},
		"593-0": {
			"dex-index": "593-0",
			"name": "Jellicent",
			"category": "Floating",
			"type": [ "Water", "Ghost" ],
			"evolves-from": "592-0",
			"base-stamina": 225,
			"base-attack": 159,
			"base-defense": 178,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_BUBBLE",
				"FAST_GHO_HEX"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_WAT_SURF"
			],
			"height-avg": 2.2,
			"weight-avg": 135,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.275,
				"wt-std-dev": 16.875,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.41 ]
			}
		},
		"593-B": {
			"dex-index": "593-B",
			"form-data": {
				"base": "593-0",
				"type": "Gender",
				"form": "Blue",
				"form-ital": "Azzurro"
			},
			"availability": {
				"in-game": "2021-01-11",
				"shiny": "2023-02-08"
			},
			"evolves-from": "592-B"
		},
		"593-P": {
			"dex-index": "593-P",
			"form-data": {
				"base": "593-0",
				"type": "Gender",
				"form": "Pink",
				"form-ital": "Rosa"
			},
			"availability": {
				"in-game": "2021-03-01",
				"shiny": "2023-02-08"
			},
			"evolves-from": "592-P"
		},
		"594": {
			"dex-index": "594",
			"name": "Alomomola",
			"category": "Caring",
			"type": [ "Water" ],
			"base-stamina": 338,
			"base-attack": 138,
			"base-defense": 131,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_WAT_HIDDENPOWER"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_ICE_BLIZZARD",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.2,
			"weight-avg": 31.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 3.95,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"595": {
			"dex-index": "595",
			"name": "Joltik",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2023-08-26",
				"shadow": "2023-02-01"
			},
			"category": "Attaching",
			"type": [ "Bug", "Electric" ],
			"evolves-into": [ "596" ],
			"base-stamina": 137,
			"base-attack": 110,
			"base-defense": 98,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_CHARGEBEAM",
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_POI_CROSSPOISON",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_ELE_DISCHARGE"
			],
			"height-avg": 0.1,
			"weight-avg": 0.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0125,
				"wt-std-dev": 0.075,
				"xxs": [ 0.049, 0.05 ],
				"xs": [ 0.05, 0.075 ],
				"m": [ 0.075, 0.125 ],
				"xl": [ 0.125, 0.15 ],
				"xxl": [ 0.15, 0.155 ]
			}
		},
		"596": {
			"dex-index": "596",
			"name": "Galvantula",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2023-08-26",
				"shadow": "2023-02-01"
			},
			"category": "EleSpider",
			"type": [ "Bug", "Electric" ],
			"evolves-from": "595",
			"base-stamina": 172,
			"base-attack": 201,
			"base-defense": 128,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_VOLTSWITCH",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_POI_CROSSPOISON",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_ELE_DISCHARGE",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_BUG_LUNGE"
			],
			"height-avg": 0.8,
			"weight-avg": 14.3,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1,
				"wt-std-dev": 1.7875,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.24 ]
			}
		},
		"597": {
			"dex-index": "597",
			"name": "Ferroseed",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-11-07",
				"shadow": "2024-01-27"
			},
			"category": "Thorn Seed",
			"type": [ "Grass", "Steel" ],
			"evolves-into": [ "598" ],
			"base-stamina": 127,
			"base-attack": 82,
			"base-defense": 155,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_STE_GYROBALL",
				"CHRG_STE_FLASHCANNON",
				"CHRG_STE_IRONHEAD"
			],
			"height-avg": 0.6,
			"weight-avg": 18.8,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.075,
				"wt-std-dev": 2.35,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.2 ]
			}
		},
		"598": {
			"dex-index": "598",
			"name": "Ferrothorn",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-11-07",
				"shadow": "2024-01-27"
			},
			"category": "Thorn Pod",
			"type": [ "Grass", "Steel" ],
			"evolves-from": "597",
			"base-stamina": 179,
			"base-attack": 158,
			"base-defense": 223,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GRA_BULLETSEED",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_GRA_POWERWHIP",
				"CHRG_STE_FLASHCANNON",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_ELE_THUNDER",
				"CHRG_STE_MIRRORSHOT"
			],
			"height-avg": 1,
			"weight-avg": 110,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 13.75,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"599": {
			"dex-index": "599",
			"name": "Klink",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2019-09-16"
			},
			"category": "Gear",
			"type": [ "Steel" ],
			"evolves-into": [ "600" ],
			"base-stamina": 120,
			"base-attack": 98,
			"base-defense": 121,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_VOLTSWITCH",
				"FAST_ELE_CHARGEBEAM",
				"FAST_STE_METALSOUND"
			],
			"charged-moves": [
				"CHRG_NOR_VISEGRIP",
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_ZAPCANNON"
			],
			"height-avg": 0.3,
			"weight-avg": 21,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 2.625,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.6 ]
			}
		},
		"600": {
			"dex-index": "600",
			"name": "Klang",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2019-09-16"
			},
			"category": "Gear",
			"type": [ "Steel" ],
			"evolves-from": "599",
			"evolves-into": [ "601" ],
			"base-stamina": 155,
			"base-attack": 150,
			"base-defense": 174,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_ELE_CHARGEBEAM",
				"FAST_STE_METALSOUND"
			],
			"charged-moves": [
				"CHRG_NOR_VISEGRIP",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_ZAPCANNON"
			],
			"height-avg": 0.6,
			"weight-avg": 51,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.075,
				"wt-std-dev": 6.375,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.2 ]
			}
		},
		"601": {
			"dex-index": "601",
			"name": "Klinklang",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2019-09-16"
			},
			"category": "Gear",
			"type": [ "Steel" ],
			"evolves-from": "600",
			"base-stamina": 155,
			"base-attack": 199,
			"base-defense": 214,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_ELE_CHARGEBEAM",
				"FAST_STE_METALSOUND"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_STE_FLASHCANNON",
				"CHRG_ELE_ZAPCANNON",
				"CHRG_STE_MIRRORSHOT"
			],
			"height-avg": 0.6,
			"weight-avg": 81,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.075,
				"wt-std-dev": 10.125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.2 ]
			}
		},
		"602": {
			"dex-index": "602",
			"name": "Tynamo",
			"availability": {
				"in-game": "2021-03-16",
				"shiny": "2024-07-21"
			},
			"category": "EleFish",
			"type": [ "Electric" ],
			"evolves-into": [ "603" ],
			"base-stamina": 111,
			"base-attack": 105,
			"base-defense": 78,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.2,
			"weight-avg": 0.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.0375,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.4 ]
			}
		},
		"603": {
			"dex-index": "603",
			"name": "Eelektrik",
			"availability": {
				"in-game": "2021-03-16",
				"shiny": "2024-07-21"
			},
			"category": "EleFish",
			"type": [ "Electric" ],
			"evolves-from": "602",
			"evolves-into": [ "604" ],
			"base-stamina": 163,
			"base-attack": 156,
			"base-defense": 130,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_POI_ACID",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_DISCHARGE"
			],
			"height-avg": 1.2,
			"weight-avg": 22,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.75,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"604": {
			"dex-index": "604",
			"name": "Eelektross",
			"availability": {
				"in-game": "2021-03-16",
				"shiny": "2024-07-21"
			},
			"category": "EleFish",
			"type": [ "Electric" ],
			"evolves-from": "603",
			"base-stamina": 198,
			"base-attack": 217,
			"base-defense": 152,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_POI_ACID",
				"FAST_ELE_SPARK"
			],
			"special-fast-moves": [
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_WAT_LIQUIDATION"
			],
			"height-avg": 2.1,
			"weight-avg": 80.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2625,
				"wt-std-dev": 10.0625,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 4.2 ]
			}
		},
		"605": {
			"dex-index": "605",
			"name": "Elgyem",
			"availability": {
				"in-game": "2020-08-07",
				"shiny": "2022-09-06"
			},
			"category": "Cerebral",
			"type": [ "Psychic" ],
			"evolves-into": [ "606" ],
			"base-stamina": 146,
			"base-attack": 148,
			"base-defense": 100,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_DAR_DARKPULSE",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.5,
			"weight-avg": 9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"606": {
			"dex-index": "606",
			"name": "Beheeyem",
			"availability": {
				"in-game": "2020-08-07",
				"shiny": "2022-09-06"
			},
			"category": "Cerebral",
			"type": [ "Psychic" ],
			"evolves-from": "605",
			"base-stamina": 181,
			"base-attack": 221,
			"base-defense": 163,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_DAR_DARKPULSE",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1,
			"weight-avg": 34.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.3125,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"607": {
			"dex-index": "607",
			"name": "Litwick",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-10-15",
				"shadow": "2023-10-26"
			},
			"category": "Candle",
			"type": [ "Ghost", "Fire" ],
			"evolves-into": [ "608" ],
			"base-stamina": 137,
			"base-attack": 108,
			"base-defense": 98,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMEBURST",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIR_MYSTICALFIRE"
			],
			"height-avg": 0.3,
			"weight-avg": 3.1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.3875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"608": {
			"dex-index": "608",
			"name": "Lampent",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-10-15",
				"shadow": "2023-10-26"
			},
			"category": "Lamp",
			"type": [ "Ghost", "Fire" ],
			"evolves-from": "607",
			"evolves-into": [ "609" ],
			"base-stamina": 155,
			"base-attack": 169,
			"base-defense": 115,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FIR_FLAMEBURST",
				"CHRG_FIR_HEATWAVE"
			],
			"height-avg": 0.6,
			"weight-avg": 13,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.625,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.2 ]
			}
		},
		"609": {
			"dex-index": "609",
			"name": "Chandelure",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2022-10-15",
				"shadow": "2023-10-26"
			},
			"category": "Luring",
			"type": [ "Ghost", "Fire" ],
			"evolves-from": "608",
			"base-stamina": 155,
			"base-attack": 271,
			"base-defense": 182,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_FIR_FIRESPIN",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FIR_OVERHEAT",
				"CHRG_FIR_FLAMECHARGE"
			],
			"special-charged-moves": [
				"CHRG_GHO_POLTERGEIST"
			],
			"height-avg": 1,
			"weight-avg": 34.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.2875,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"610": {
			"dex-index": "610",
			"name": "Axew",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-04"
			},
			"category": "Tusk",
			"type": [ "Dragon" ],
			"evolves-into": [ "611" ],
			"base-stamina": 130,
			"base-attack": 154,
			"base-defense": 101,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_WAT_AQUATAIL",
				"CHRG_DRA_DRAGONPULSE"
			],
			"height-avg": 0.6,
			"weight-avg": 18,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 2.25,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"611": {
			"dex-index": "611",
			"name": "Fraxure",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-04"
			},
			"category": "Axe Jaw",
			"type": [ "Dragon" ],
			"evolves-from": "610",
			"evolves-into": [ "612" ],
			"base-stamina": 165,
			"base-attack": 212,
			"base-defense": 123,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_WAT_AQUATAIL",
				"CHRG_DAR_NIGHTSLASH"
			],
			"height-avg": 1,
			"weight-avg": 36,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.5,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"612": {
			"dex-index": "612",
			"name": "Haxorus",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-04"
			},
			"category": "Axe Jaw",
			"type": [ "Dragon" ],
			"evolves-from": "611",
			"base-stamina": 183,
			"base-attack": 284,
			"base-defense": 172,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_WAT_SURF",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_GRO_EARTHQUAKE"
			],
			"special-charged-moves": [
				"CHRG_DRA_BREAKINGSWIPE"
			],
			"height-avg": 1.8,
			"weight-avg": 105.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.225,
				"wt-std-dev": 13.1875,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.6 ]
			}
		},
		"613": {
			"dex-index": "613",
			"name": "Cubchoo",
			"availability": {
				"in-game": "2019-12-24",
				"shiny": "2020-12-22"
			},
			"category": "Chill",
			"type": [ "Ice" ],
			"evolves-into": [ "614" ],
			"base-stamina": 146,
			"base-attack": 128,
			"base-defense": 74,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_ICE_ICEPUNCH",
				"CHRG_ICE_ICYWIND",
				"CHRG_FAI_PLAYROUGH"
			],
			"height-avg": 0.5,
			"weight-avg": 8.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.0625,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"614": {
			"dex-index": "614",
			"name": "Beartic",
			"availability": {
				"in-game": "2019-12-24",
				"shiny": "2022-12-23"
			},
			"category": "Freezing",
			"type": [ "Ice" ],
			"evolves-from": "613",
			"base-stamina": 216,
			"base-attack": 233,
			"base-defense": 152,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_ICE_ICEPUNCH",
				"CHRG_WAT_SURF",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_WAT_LIQUIDATION"
			],
			"height-avg": 2.6,
			"weight-avg": 260,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.325,
				"wt-std-dev": 32.5,
				"xxs": [ 1.274, 1.3 ],
				"xs": [ 1.3, 1.95 ],
				"m": [ 1.95, 3.25 ],
				"xl": [ 3.25, 3.9 ],
				"xxl": [ 3.9, 4.03 ]
			}
		},
		"615": {
			"dex-index": "615",
			"name": "Cryogonal",
			"availability": {
				"in-game": "2019-12-24",
				"shiny": "2023-12-09",
				"dynamax": "2024-12-23"
			},
			"category": "Crystallizing",
			"type": [ "Ice" ],
			"base-stamina": 190,
			"base-attack": 190,
			"base-defense": 218,
			"dynamax-class": 3,
			"max-battle-tier": 3,
			"fast-moves": [
				"FAST_ICE_FROSTBREATH",
				"FAST_ICE_ICESHARD"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_ICE_AURORABEAM",
				"CHRG_ICE_TRIPLEAXEL",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 1.1,
			"weight-avg": 148,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 18.5,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 2.2 ]
			}
		},
		"616": {
			"dex-index": "616",
			"name": "Shelmet",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-04",
				"shadow": "2024-10-08"
			},
			"category": "Snail",
			"type": [ "Bug" ],
			"evolves-into": [ "617" ],
			"base-stamina": 137,
			"base-attack": 72,
			"base-defense": 140,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_ACID",
				"FAST_BUG_INFESTATION"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_NOR_BODYSLAM",
				"CHRG_BUG_SIGNALBEAM"
			],
			"height-avg": 0.4,
			"weight-avg": 7.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.9625,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"617": {
			"dex-index": "617",
			"name": "Accelgor",
			"availability": {
				"in-game": "2020-01-10",
				"shiny": "2022-06-04",
				"shadow": "2024-10-08"
			},
			"category": "Shell Out",
			"type": [ "Bug" ],
			"evolves-from": "616",
			"base-stamina": 190,
			"base-attack": 220,
			"base-defense": 120,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_ACID",
				"FAST_BUG_INFESTATION",
				"FAST_WAT_WATERSHURIKEN"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_BUG_SIGNALBEAM",
				"CHRG_FIG_FOCUSBLAST"
			],
			"height-avg": 0.8,
			"weight-avg": 25.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.1625,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"618": {
			"dex-index": "618",
			"name": "Stunfisk",
			"availability": {
				"in-game": "2020-04-01",
				"shiny": "2023-04-23"
			},
			"category": "Trap",
			"type": [ "Ground", "Electric" ],
			"base-stamina": 240,
			"base-attack": 144,
			"base-defense": 171,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_GRO_MUDBOMB",
				"CHRG_ELE_DISCHARGE",
				"CHRG_WAT_MUDDYWATER"
			],
			"height-avg": 0.7,
			"weight-avg": 11,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.375,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"618-G": {
			"dex-index": "618-G",
			"name": "Galarian Stunfisk",
			"form-data": {
				"base": "618",
				"type": "Regional",
				"region": "Galarian"
			},
			"availability": {
				"in-game": "2020-06-03",
				"shiny": "2023-04-23"
			},
			"type": [ "Ground", "Steel" ],
			"base-stamina": 240,
			"base-attack": 144,
			"base-defense": 171,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_STE_FLASHCANNON",
				"CHRG_WAT_MUDDYWATER",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 0.7,
			"weight-avg": 20.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.5625,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"619": {
			"dex-index": "619",
			"name": "Mienfoo",
			"availability": {
				"in-game": "2021-05-31",
				"shiny": "2024-08-16"
			},
			"category": "Martial Arts",
			"type": [ "Fighting" ],
			"evolves-into": [ "620" ],
			"base-stamina": 128,
			"base-attack": 160,
			"base-defense": 98,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_NOR_POUND"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_FIG_FOCUSBLAST"
			],
			"height-avg": 0.9,
			"weight-avg": 20,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 2.5,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"620": {
			"dex-index": "620",
			"name": "Mienshao",
			"availability": {
				"in-game": "2021-05-31",
				"shiny": "2024-08-16"
			},
			"category": "Martial Arts",
			"type": [ "Fighting" ],
			"evolves-from": "619",
			"base-stamina": 163,
			"base-attack": 258,
			"base-defense": 127,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_POI_POISONJAB",
				"FAST_FIG_FORCEPALM"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_ROC_STONEEDGE",
				"CHRG_FIR_BLAZEKICK",
				"CHRG_DAR_BRUTALSWING"
			],
			"height-avg": 1.4,
			"weight-avg": 35.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 4.4375,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"621": {
			"dex-index": "621",
			"name": "Druddigon",
			"availability": {
				"in-game": "2021-12-07",
				"shiny": "2021-12-07"
			},
			"category": "Cave",
			"type": [ "Dragon" ],
			"base-stamina": 184,
			"base-attack": 213,
			"base-defense": 170,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_NOR_HYPERBEAM"
			],
			"height-avg": 1.6,
			"weight-avg": 139,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2,
				"wt-std-dev": 17.375,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 3.2 ]
			}
		},
		"622": {
			"dex-index": "622",
			"name": "Golett",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2023-08-18",
				"shadow": "2022-11-14"
			},
			"category": "Automaton",
			"type": [ "Ground", "Ghost" ],
			"evolves-into": [ "623" ],
			"base-stamina": 153,
			"base-attack": 127,
			"base-defense": 92,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWPUNCH",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_GHO_NIGHTSHADE"
			],
			"height-avg": 1,
			"weight-avg": 92,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 11.5,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"623": {
			"dex-index": "623",
			"name": "Golurk",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2023-08-18",
				"shadow": "2022-11-14"
			},
			"category": "Automaton",
			"type": [ "Ground", "Ghost" ],
			"evolves-from": "622",
			"base-stamina": 205,
			"base-attack": 222,
			"base-defense": 154,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWPUNCH",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_GHO_POLTERGEIST"
			],
			"height-avg": 2.8,
			"weight-avg": 330,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.35,
				"wt-std-dev": 41.25,
				"xxs": [ 1.372, 1.4 ],
				"xs": [ 1.4, 2.1 ],
				"m": [ 2.1, 3.5 ],
				"xl": [ 3.5, 4.2 ],
				"xxl": [ 4.2, 5.6 ]
			}
		},
		"624": {
			"dex-index": "624",
			"name": "Pawniard",
			"availability": {
				"in-game": "2020-10-12",
				"shiny": "2022-11-14"
			},
			"category": "Sharp Blade",
			"type": [ "Dark", "Steel" ],
			"evolves-into": [ "625" ],
			"base-stamina": 128,
			"base-attack": 154,
			"base-defense": 114,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_STE_IRONHEAD",
				"CHRG_BUG_XSCISSOR"
			],
			"height-avg": 0.5,
			"weight-avg": 10.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.275,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"625": {
			"dex-index": "625",
			"name": "Bisharp",
			"availability": {
				"in-game": "2020-10-12",
				"shiny": "2022-11-14"
			},
			"category": "Sword Blade",
			"type": [ "Dark", "Steel" ],
			"evolves-from": "624",
			"evolves-into": [ "983" ],
			"base-stamina": 163,
			"base-attack": 232,
			"base-defense": 176,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_STE_IRONHEAD",
				"CHRG_BUG_XSCISSOR",
				"CHRG_FIG_FOCUSBLAST"
			],
			"height-avg": 1.6,
			"weight-avg": 70,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 8.75,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"626": {
			"dex-index": "626",
			"name": "Bouffalant",
			"availability": {
				"in-game": "2020-08-14",
				"shiny": "2025-02-21"
			},
			"category": "Bash Buffalo",
			"type": [ "Normal" ],
			"base-stamina": 216,
			"base-attack": 195,
			"base-defense": 182,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_BUG_MEGAHORN",
				"CHRG_NOR_STOMP",
				"CHRG_NOR_SKULLBASH",
				"CHRG_GRO_EARTHQUAKE"
			],
			"height-avg": 1.6,
			"weight-avg": 94.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 11.825,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"627": {
			"dex-index": "627",
			"name": "Rufflet",
			"availability": {
				"in-game": "2020-03-13",
				"shiny": "2020-12-14"
			},
			"category": "Eaglet",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "628" ],
			"base-stamina": 172,
			"base-attack": 150,
			"base-defense": 97,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_FLY_FLY"
			],
			"height-avg": 0.5,
			"weight-avg": 10.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.3125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"628": {
			"dex-index": "628",
			"name": "Braviary",
			"availability": {
				"in-game": "2020-03-13",
				"shiny": "2020-12-14"
			},
			"category": "Valiant",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "627",
			"base-stamina": 225,
			"base-attack": 232,
			"base-defense": 152,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_STEELWING",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_FIR_HEATWAVE",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FLY_FLY"
			],
			"height-avg": 1.5,
			"weight-avg": 41,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.125,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"628-H": {
			"dex-index": "628-H",
			"form-data": {
				"base": "628",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2022-07-31",
				"shiny": "2022-07-31"
			},
			"category": "Battle Cry",
			"type": [ "Psychic", "Flying" ],
			"base-stamina": 242,
			"base-attack": 213,
			"base-defense": 137,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GHO_OMINOUSWIND",
				"CHRG_FLY_FLY"
			],
			"height-avg": 1.7,
			"weight-avg": 43.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 5.425,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"629": {
			"dex-index": "629",
			"name": "Vullaby",
			"availability": {
				"in-game": "2020-10-12",
				"shiny": "2021-11-09"
			},
			"category": "Diapered",
			"type": [ "Dark", "Flying" ],
			"evolves-into": [ "630" ],
			"base-stamina": 172,
			"base-attack": 105,
			"base-defense": 139,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_DAR_FOULPLAY"
			],
			"height-avg": 0.5,
			"weight-avg": 9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"630": {
			"dex-index": "630",
			"name": "Mandibuzz",
			"availability": {
				"in-game": "2020-10-12",
				"shiny": "2021-11-09"
			},
			"category": "Bone Vulture",
			"type": [ "Dark", "Flying" ],
			"evolves-from": "629",
			"base-stamina": 242,
			"base-attack": 129,
			"base-defense": 205,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_FLY_AERIALACE",
				"CHRG_DAR_FOULPLAY",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 1.2,
			"weight-avg": 39.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 4.9375,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"631": {
			"dex-index": "631",
			"name": "Heatmor",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-07-25"
			},
			"category": "Anteater",
			"type": [ "Fire" ],
			"base-stamina": 198,
			"base-attack": 204,
			"base-defense": 129,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_FIR_FIRESPIN"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_FIG_POWERUPPUNCH"
			],
			"height-avg": 1.4,
			"weight-avg": 58,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 7.25,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"632": {
			"dex-index": "632",
			"name": "Durant",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-07-25"
			},
			"category": "Iron Ant",
			"type": [ "Bug", "Steel" ],
			"base-stamina": 151,
			"base-attack": 217,
			"base-defense": 188,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_STE_IRONHEAD",
				"CHRG_ROC_STONEEDGE"
			],
			"height-avg": 0.3,
			"weight-avg": 33,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 4.125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"633": {
			"dex-index": "633",
			"name": "Deino",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-07-31"
			},
			"category": "Irate",
			"type": [ "Dark", "Dragon" ],
			"evolves-into": [ "634" ],
			"base-stamina": 141,
			"base-attack": 116,
			"base-defense": 93,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_DRA_DRAGONBREATH"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_DAR_CRUNCH",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.8,
			"weight-avg": 17.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.1625,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"634": {
			"dex-index": "634",
			"name": "Zweilous",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-07-31"
			},
			"category": "Hostile",
			"type": [ "Dark", "Dragon" ],
			"evolves-from": "633",
			"evolves-into": [ "635" ],
			"base-stamina": 176,
			"base-attack": 159,
			"base-defense": 135,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_DRA_DRAGONBREATH"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_DAR_DARKPULSE",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 1.4,
			"weight-avg": 50,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 6.25,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"635": {
			"dex-index": "635",
			"name": "Hydreigon",
			"availability": {
				"in-game": "2019-09-16",
				"shiny": "2020-07-31"
			},
			"category": "Brutal",
			"type": [ "Dark", "Dragon" ],
			"evolves-from": "634",
			"base-stamina": 211,
			"base-attack": 256,
			"base-defense": 188,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_DRA_DRAGONBREATH"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_DAR_DARKPULSE",
				"CHRG_STE_FLASHCANNON"
			],
			"special-charged-moves": [
				"CHRG_DAR_BRUTALSWING"
			],
			"height-avg": 1.8,
			"weight-avg": 160,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 20,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"636": {
			"dex-index": "636",
			"name": "Larvesta",
			"availability": {
				"in-game": "2023-05-02",
				"shiny": "2024-06-21"
			},
			"category": "Torch",
			"type": [ "Bug", "Fire" ],
			"evolves-into": [ "637" ],
			"base-stamina": 146,
			"base-attack": 156,
			"base-defense": 107,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_FIR_FLAMEWHEEL"
			],
			"height-avg": 1.1,
			"weight-avg": 28.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 3.6,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"637": {
			"dex-index": "637",
			"name": "Volcarona",
			"availability": {
				"in-game": "2023-05-02",
				"shiny": "2024-06-21"
			},
			"category": "Sun",
			"type": [ "Bug", "Fire" ],
			"evolves-from": "636",
			"base-stamina": 198,
			"base-attack": 264,
			"base-defense": 189,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_FIR_OVERHEAT",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_FLY_HURRICANE"
			],
			"height-avg": 1.6,
			"weight-avg": 46,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 5.75,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"638": {
			"dex-index": "638",
			"name": "Cobalion",
			"availability": {
				"in-game": "2019-11-04",
				"shiny": "2020-03-20"
			},
			"category": "Iron Will",
			"type": [ "Steel", "Fighting" ],
			"base-stamina": 209,
			"base-attack": 192,
			"base-defense": 229,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_STE_IRONHEAD",
				"CHRG_ROC_STONEEDGE"
			],
			"special-charged-moves": [
				"CHRG_FIG_SACREDSWORD"
			],
			"height-avg": 2.1,
			"weight-avg": 250,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2625,
				"wt-std-dev": 31.25,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.255 ]
			}
		},
		"639": {
			"dex-index": "639",
			"name": "Terrakion",
			"availability": {
				"in-game": "2019-11-26",
				"shiny": "2020-05-19"
			},
			"category": "Cavern",
			"type": [ "Rock", "Fighting" ],
			"base-stamina": 209,
			"base-attack": 260,
			"base-defense": 192,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ROC_SMACKDOWN",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_ROCKSLIDE"
			],
			"special-charged-moves": [
				"CHRG_FIG_SACREDSWORD"
			],
			"height-avg": 1.9,
			"weight-avg": 260,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 32.5,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"640": {
			"dex-index": "640",
			"name": "Virizion",
			"availability": {
				"in-game": "2019-12-17",
				"shiny": "2020-05-12"
			},
			"category": "Grassland",
			"type": [ "Grass", "Fighting" ],
			"base-stamina": 209,
			"base-attack": 192,
			"base-defense": 229,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_GRA_LEAFBLADE",
				"CHRG_ROC_STONEEDGE"
			],
			"special-charged-moves": [
				"CHRG_FIG_SACREDSWORD"
			],
			"height-avg": 2,
			"weight-avg": 200,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 25,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"641-0": {
			"dex-index": "641-0",
			"name": "Tornadus",
			"category": "Cyclone",
			"type": [ "Flying" ],
			"dynamax-class": 4,
			"showcase-baseline": "" // TODO
		},
		"641-I": {
			"dex-index": "641-I",
			"form-data": {
				"base": "641-0",
				"type": "idk",
				"form": "Incarnate Forme",
				"form-ital": "Forma Incarnazione"
			},
			"availability": {
				"in-game": "2020-02-04",
				"shiny": "2021-03-06"
			},
			"base-stamina": 188,
			"base-attack": 266,
			"base-defense": 164,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_DAR_DARKPULSE",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_FLY_HURRICANE"
			],
			"height-avg": 1.5,
			"weight-avg": 63,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 7.875,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"641-T": {
			"dex-index": "641-T",
			"form-data": {
				"base": "641-0",
				"type": "idk",
				"form": "Therian Forme",
				"form-ital": "Forma Totem"
			},
			"availability": {
				"in-game": "2020-03-30",
				"shiny": "2022-03-22"
			},
			"base-stamina": 188,
			"base-attack": 238,
			"base-defense": 189,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_FLY_GUST"
			],
			"charged-moves": [
				"CHRG_FIR_HEATWAVE",
				"CHRG_PSY_PSYCHIC",
				"CHRG_FIG_FOCUSBlAST",
				"CHRG_FLY_HURRICANE"
			],
			"special-charged-moves": [
				"CHRG_FLY_BLEAKWINDSTORM"
			],
			"height-avg": 1.4,
			"weight-avg": 63,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 7.875,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"642-0": {
			"dex-index": "642-0",
			"name": "Thundurus",
			"category": "Bolt Strike",
			"type": [ "Electric", "Flying" ],
			"dynamax-class": 4,
			"showcase-baseline": "" // TODO
		},
		"642-I": {
			"dex-index": "642-I",
			"form-data": {
				"base": "642-0",
				"type": "idk",
				"form": "Incarnate Forme",
				"form-ital": "Forma Incarnazione"
			},
			"base-stamina": 188,
			"base-attack": 266,
			"base-defense": 164,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ELE_THUNDER",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 1.5,
			"weight-avg": 61,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 7.625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"642-T": {
			"dex-index": "642-T",
			"name": "Thundurus (Therian Forme)",
			"availability": {
				"in-game": "2021-03-16",
				"shiny": "2022-04-05"
			},
			"form-data": {
				"base": "642-0",
				"type": "idk",
				"form": "Therian Forme",
				"form-ital": "Forma Totem"
			},
			"base-stamina": 188,
			"base-attack": 295,
			"base-defense": 161,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_ELE_THUNDER",
				"CHRG_ELE_THUNDERBOLT"
			],
			"special-charged-moves": [
				"CHRG_ELE_WILDBOLTSTORM"
			],
			"height-avg": 3,
			"weight-avg": 61,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.375,
				"wt-std-dev": 7.625,
				"xxs": [ 1.47, 1.5 ],
				"xs": [ 1.5, 2.25 ],
				"m": [ 2.25, 3.75 ],
				"xl": [ 3.75, 4.5 ],
				"xxl": [ 4.5, 4.65 ]
			}
		},
		"643": {
			"dex-index": "643",
			"name": "Reshiram",
			"availability": {
				"in-game": "2020-05-26",
				"shiny": "2021-12-01"
			},
			"category": "Vast White",
			"type": [ "Dragon", "Fire" ],
			"base-stamina": 205,
			"base-attack": 275,
			"base-defense": 211,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_FIR_FIREFANG"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_OVERHEAT",
				"CHRG_DRA_DRACOMETEOR",
				"CHRG_ROC_STONEEDGE"
			],
			"special-charged-moves": [
				"CHRG_FIR_FUSIONFLARE"
			],
			"height-avg": 3.2,
			"weight-avg": 330,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.4,
				"wt-std-dev": 41.25,
				"xxs": [ 1.568, 1.6 ],
				"xs": [ 1.6, 2.4 ],
				"m": [ 2.4, 4 ],
				"xl": [ 4, 4.8 ],
				"xxl": [ 4.8, 4.96 ]
			}
		},
		"644": {
			"dex-index": "644",
			"name": "Zekrom",
			"availability": {
				"in-game": "2020-06-16",
				"shiny": "2021-12-01"
			},
			"category": "Deep Black",
			"type": [ "Dragon", "Electric" ],
			"base-stamina": 205,
			"base-attack": 275,
			"base-defense": 211,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_STE_FLASHCANNON",
				"CHRG_DAR_CRUNCH"
			],
			"special-charged-moves": [
				"CHRG_ELE_FUSIONBOLT"
			],
			"height-avg": 2.9,
			"weight-avg": 345,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3625,
				"wt-std-dev": 43.125,
				"xxs": [ 1.421, 1.45 ],
				"xs": [ 1.45, 2.175 ],
				"m": [ 2.175, 3.625 ],
				"xl": [ 3.625, 4.35 ],
				"xxl": [ 4.35, 4.495 ]
			}
		},
		"645-0": {
			"dex-index": "645-0",
			"name": "Landorus",
			"category": "Abundance",
			"type": [ "Ground", "Flying" ],
			"dynamax-class": 4,
			"showcase-baseline": "" // TODO
		},
		"645-I": {
			"dex-index": "645-I",
			"name": "Landorus (Incarnate Forme)",
			"form-data": {
				"base": "645-0",
				"type": "idk",
				"form": "Incarnate Forme",
				"form-ital": "Forma Incarnazione"
			},
			"availability": {
				"in-game": "2020-03-31",
				"shiny": "2021-03-01"
			},
			"base-stamina": 205,
			"base-attack": 261,
			"base-defense": 182,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHPOWER",
				"CHRG_DRA_OUTRAGE",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_FIG_FOCUSBLAST"
			],
			"height-avg": 1.5,
			"weight-avg": 68,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 8.5,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"645-T": {
			"dex-index": "645-T",
			"name": "Landorus (Therian Forme)",
			"form-data": {
				"base": "645-0",
				"type": "idk",
				"form": "Therian Forme",
				"form-ital": "Forma Totem"
			},
			"availability": {
				"in-game": "2021-04-13",
				"shiny": "2022-04-26"
			},
			"base-stamina": 205,
			"base-attack": 289,
			"base-defense": 179,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_PSY_EXTRASENSORY"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_GRO_BULLDOZE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_FIG_SUPERPOWER"
			],
			"special-charged-moves": [
				"CHRG_GRO_SANDSEARSTORM"
			],
			"height-avg": 1.3,
			"weight-avg": 68,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 8.5,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"646": {
			"dex-index": "646",
			"name": "Kyurem",
			"availability": {
				"in-game": "2020-07-07",
				"shiny": "2021-12-16"
			},
			"category": "Boundary",
			"type": [ "Dragon", "Ice" ],
			"base-stamina": 245,
			"base-attack": 246,
			"base-defense": 170,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_ICE_BLIZZARD",
				"CHRG_DRA_DRACOMETEOR"
			],
			"special-charged-moves": [
				"CHRG_ICE_GLACIATE"
			],
			"height-avg": 3,
			"weight-avg": 325,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.375,
				"wt-std-dev": 40.625,
				"xxs": [ 1.47, 1.5 ],
				"xs": [ 1.5, 2.25 ],
				"m": [ 2.25, 3.75 ],
				"xl": [ 3.75, 4.5 ],
				"xxl": [ 4.5, 4.65 ]
			}
		},
		"646-W": {
			"dex-index": "646-W",
			"name": "White Kyurem",
			"name-ital": "Kyurem Bianco",
			"form-data": {
				"base": "646",
				"type": "Fusion"
			},
			"availability": {
				"in-game": false,
				"shiny": "2025-02-21"
			},
			"base-stamina": 245,
			"base-attack": 310,
			"base-defense": 183,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_ICE_BLIZZARD",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FIG_FOCUSBLAST"
			],
			"special-charged-moves": [ ]
		},
		"646-B": {
			"dex-index": "646-B",
			"name": "Black Kyurem",
			"name-ital": "Kyurem Nero",
			"form-data": {
				"base": "646",
				"type": "Fusion"
			},
			"availability": {
				"in-game": false,
				"shiny": "2025-02-21"
			},
			"base-stamina": 245,
			"base-attack": 310,
			"base-defense": 183,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_STE_IRONHEAD",
				"CHRG_ICE_BLIZZARD",
				"CHRG_ROC_STONEEDGE",
				"CHRG_DRA_OUTRAGE"
			],
			"special-charged-moves": [ ]
		},
		"647": {
			"dex-index": "647",
			"name": "Keldeo",
			"availability": {
				"in-game": "2022-12-10"
			},
			"variants": [ "Ordinary", "Resolute" ], // TODO Resolute avail
			"category": "Colt",
			"type": [ "Water", "Fighting" ],
			"base-stamina": 209,
			"base-attack": 260,
			"base-defense": 192,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_SACREDSWORD"
			],
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 6.0625,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"648-0": {
			"dex-index": "648-0",
			"name": "Meloetta",
			"category": "Melody",
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_PSY_CONFUSION"
			],
			"height-avg": 0.6,
			"weight-avg": 6.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.8125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"648-A": {
			"dex-index": "648-A",
			"form-data": {
				"base": "648",
				"type": "idk",
				"form": "Aria Forme",
				"form-ital": "Forma Canto"
			},
			"availability": {
				"in-game": "2021-07-17"
			},
			"type": [ "Normal", "Psychic" ],
			"base-stamina": 225,
			"base-attack": 250,
			"base-defense": 225,
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_NOR_HYPERBEAM"
			]
		},
		"648-P": {
			"dex-index": "648-P",
			"form-data": {
				"base": "648",
				"type": "idk",
				"form": "Pirouette Forme",
				"form-ital": "Forma Danza"
			},
			"availability": {
				"in-game": false
			},
			"type": [ "Normal", "Fighting" ],
			"base-stamina": 225,
			"base-attack": 269,
			"base-defense": 188,
			"charged-moves": [
				"CHRG_ICE_ICEPUNCH",
				"CHRG_FIR_FIREPUNCH",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_NOR_HYPERBEAM"
			]
		},
		"649": {
			"dex-index": "649",
			"name": "Genesect",
			"availability": {
				"in-game": "2020-03-20",
				"shiny": "2020-08-14"
			},
			"category": "Paleozoic",
			"type": [ "Bug", "Steel" ],
			"base-stamina": 174,
			"base-attack": 252,
			"base-defense": 199,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_STE_MAGNETBOMB",
				"CHRG_NOR_HYPERBEAM"
			],
			"special-charged-moves": [
				"CHRG_NOR_TECHNOBLAST"
			],
			"height-avg": 1.5,
			"weight-avg": 82.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 10.3125,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"649-B": {
			"dex-index": "649-B",
			"form-data": {
				"base": "649",
				"type": "move change",
				"form": "Burn Drive",
				"form-ital": "Piromodulo"
			},
			"availability": {
				"in-game": "2021-01-05",
				"shiny": "2023-09-16"
			},
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_STE_MAGNETBOMB",
				"CHRG_FIR_FLAMETHROWER"
			],
			"special-charged-moves": [
				"CHRG_FIR_TECHNOBLAST"
			]
		},
		"649-C": {
			"dex-index": "649-C",
			"form-data": {
				"base": "649",
				"type": "move change",
				"form": "Chill Drive",
				"form-ital": "Gelomodulo"
			},
			"availability": {
				"in-game": "2022-08-10",
				"shiny": "2024-12-03"
			},
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_STE_MAGNETBOMB",
				"CHRG_ICE_ICEBEAM"
			],
			"special-charged-moves": [
				"CHRG_ICE_TECHNOBLAST"
			]
		},
		"649-D": {
			"dex-index": "649-D",
			"form-data": {
				"base": "649",
				"type": "move change",
				"form": "Douse Drive",
				"form-ital": "Idromodulo"
			},
			"availability": {
				"in-game": "2021-10-01",
				"shiny": "2023-11-03"
			},
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_STE_MAGNETBOMB",
				"CHRG_POI_GUNKSHOT"
			],
			"special-charged-moves": [
				"CHRG_WAT_TECHNOBLAST"
			]
		},
		"649-S": {
			"dex-index": "649-S",
			"form-data": {
				"base": "649",
				"type": "move change",
				"form": "Shock Drive",
				"form-ital": "Voltmodulo"
			},
			"availability": {
				"in-game": "2022-01-15",
				"shiny": "2023-05-02"
			},
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_STE_MAGNETBOMB",
				"CHRG_ELE_ZAPCANNON"
			],
			"special-charged-moves": [
				"CHRG_ELE_TECHNOBLAST"
			]
		},
		"650": {
			"dex-index": "650",
			"name": "Chespin",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2023-01-07"
			},
			"category": "Spiny Nut",
			"type": [ "Grass" ],
			"evolves-into": [ "651" ],
			"base-stamina": 148,
			"base-attack": 110,
			"base-defense": 106,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TAKEDOWN",
				"FAST_GRA_VINEWHIP"
			],
			"charged-moves": [
				"CHRG_STE_GYROBALL",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.4,
			"weight-avg": 9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1.125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"651": {
			"dex-index": "651",
			"name": "Quilladin",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2023-01-07"
			},
			"category": "Spiny Armor",
			"type": [ "Grass" ],
			"evolves-from": "650",
			"evolves-into": [ "652" ],
			"base-stamina": 156,
			"base-attack": 146,
			"base-defense": 156,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_GRA_VINEWHIP"
			],
			"charged-moves": [
				"CHRG_STE_GYROBALL",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.7,
			"weight-avg": 29,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 3.625,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"652": {
			"dex-index": "652",
			"name": "Chesnaught",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2023-01-07"
			},
			"category": "Spiny Armor",
			"type": [ "Grass", "Fighting" ],
			"evolves-from": "651",
			"base-stamina": 204,
			"base-attack": 201,
			"base-defense": 204,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_GRA_VINEWHIP",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_STE_GYROBALL",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"special-charged-moves": [
				"CHRG_GRA_FRENZYPLANT"
			],
			"height-avg": 1.6,
			"weight-avg": 90,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 11.25,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"653": {
			"dex-index": "653",
			"name": "Fennekin",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2023-05-21"
			},
			"category": "Fox",
			"type": [ "Fire" ],
			"evolves-into": [ "654" ],
			"base-stamina": 120,
			"base-attack": 116,
			"base-defense": 102,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_FLAMECHARGE"
			],
			"height-avg": 0.4,
			"weight-avg": 9.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1.175,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"654": {
			"dex-index": "654",
			"name": "Braixen",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2023-05-21"
			},
			"category": "Fox",
			"type": [ "Fire" ],
			"evolves-from": "653",
			"evolves-into": [ "655" ],
			"base-stamina": 153,
			"base-attack": 171,
			"base-defense": 130,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_FLAMECHARGE"
			],
			"height-avg": 1,
			"weight-avg": 14.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 1.8125,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"655": {
			"dex-index": "655",
			"name": "Delphox",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2023-05-21"
			},
			"category": "Fox",
			"type": [ "Fire", "Psychic" ],
			"evolves-from": "654",
			"base-stamina": 181,
			"base-attack": 230,
			"base-defense": 189,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_FIR_FIRESPIN",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_MYSTICALFIRE"
			],
			"special-charged-moves": [
				"CHRG_FIR_BLASTBURN"
			],
			"height-avg": 1.5,
			"weight-avg": 39,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 4.875,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"656": {
			"dex-index": "656",
			"name": "Froakie",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2024-10-22"
			},
			"category": "Bubble Frog",
			"type": [ "Water" ],
			"evolves-into": [ "657" ],
			"base-stamina": 121,
			"base-attack": 122,
			"base-defense": 84,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_FLY_AERIALACE",
				"CHRG_WAT_SURF"
			],
			"height-avg": 0.3,
			"weight-avg": 7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"657": {
			"dex-index": "657",
			"name": "Frogadier",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2024-10-22"
			},
			"category": "Bubble Frog",
			"type": [ "Water" ],
			"evolves-from": "656",
			"evolves-into": [ "658" ],
			"base-stamina": 144,
			"base-attack": 168,
			"base-defense": 114,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_FLY_AERIALACE",
				"CHRG_WAT_SURF"
			],
			"height-avg": 0.6,
			"weight-avg": 10.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.3625,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"658": {
			"dex-index": "658",
			"name": "Greninja",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2024-10-22"
			},
			"category": "Ninja",
			"type": [ "Water", "Dark" ],
			"evolves-from": "657",
			"base-stamina": 176,
			"base-attack": 223,
			"base-defense": 152,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_FEINTATTACK",
				"FAST_WAT_BUBBLE",
				"FAST_WAT_WATERSHURIKEN"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_FLY_AERIALACE",
				"CHRG_WAT_SURF",
				"CHRG_WAT_HYDROPUMP"
			],
			"special-charged-moves": [
				"CHRG_WAT_HYDROCANNON"
			],
			"height-avg": 1.5,
			"weight-avg": 40,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"658-A": {
			"dex-index": "658-A",
			"name": "Ash-Greninja",
			"form-data": {
				"base": "658",
				"type": "idk"
			},
			"availability": {
			}
		},
		"659": {
			"dex-index": "659",
			"name": "Bunnelby",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2021-04-04",
				"shadow": "2025-01-15"
			},
			"category": "Digging",
			"type": [ "Normal" ],
			"evolves-into": [ "660" ],
			"base-stamina": 116,
			"base-attack": 68,
			"base-defense": 72,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_GRO_BULLDOZE",
				"CHRG_GRO_EARTHQUAKE"
			],
			"height-avg": 0.4,
			"weight-avg": 5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.625,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"660": {
			"dex-index": "660",
			"name": "Diggersby",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2021-04-04",
				"shadow": "2025-01-15"
			},
			"category": "Digging",
			"type": [ "Normal", "Ground" ],
			"evolves-from": "659",
			"base-stamina": 198,
			"base-attack": 112,
			"base-defense": 155,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_FIR_FIREPUNCH",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 1,
			"weight-avg": 42.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 5.3,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"661": {
			"dex-index": "661",
			"name": "Fletchling",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2021-03-06"
			},
			"category": "Tiny Robin",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "662" ],
			"base-stamina": 128,
			"base-attack": 95,
			"base-defense": 80,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FIR_HEATWAVE",
				"CHRG_NOR_SWIFT",
				"CHRG_FLY_FLY"
			],
			"height-avg": 0.3,
			"weight-avg": 1.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.2125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"662": {
			"dex-index": "662",
			"name": "Fletchinder",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2021-03-06"
			},
			"category": "Ember",
			"type": [ "Fire", "Flying" ],
			"evolves-from": "661",
			"evolves-into": [ "663" ],
			"base-stamina": 158,
			"base-attack": 145,
			"base-defense": 110,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_FIR_EMBER",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FLY_FLY"
			],
			"height-avg": 0.7,
			"weight-avg": 16,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"663": {
			"dex-index": "663",
			"name": "Talonflame",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2021-03-06"
			},
			"category": "Scorching",
			"type": [ "Fire", "Flying" ],
			"evolves-from": "662",
			"base-stamina": 186,
			"base-attack": 176,
			"base-defense": 155,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_FIR_FIRESPIN",
				"FAST_STE_STEELWING"
			],
			"special-fast-moves": [
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FLY_HURRICANE",
				"CHRG_FLY_FLY"
			],
			"height-avg": 1.2,
			"weight-avg": 24.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 3.0625,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"664": {
			"dex-index": "664",
			"name": "Scatterbug",
			"availability": {
				"in-game": "2022-12-15"
			},
			"category": "Scatterdust",
			"type": [ "Bug" ],
			"evolves-into": [ "665" ],
			"base-stamina": 116,
			"base-attack": 63,
			"base-defense": 63,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.3,
			"weight-avg": 2.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.3125,
				"xxs": [ 0.075, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"665": {
			"dex-index": "665",
			"name": "Spewpa",
			"availability": {
				"in-game": "2022-12-15"
			},
			"category": "Scatterdust",
			"type": [ "Bug" ],
			"evolves-from": "664",
			"evolves-into": [ "666" ],
			"base-stamina": 128,
			"base-attack": 48,
			"base-defense": 89,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.3,
			"weight-avg": 8.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 1.05,
				"xxs": [ 0.075, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"666": {
			"dex-index": "666",
			"name": "Vivillon",
			"availability": {
				"in-game": "2022-12-15"
			},
			"variants": [
				"Archipelago", "Continental", "Elegant", "Fancy",
				"Garden", "High Plains", "Icy Snow", "Jungle",
				"Marine", "Meadow", "Modern", "Monsoon",
				"Ocean", "Pokeball", "Polar", "River",
				"Sandstorm", "Savanna", "Sun", "Tundra"
			], // TODO Pokeball and Fancy avail
			"variants-ital": [
				"Arcipelago", "Continentale", "Eleganza", "Sbarazzino",
				"Prato", "Deserto", "Nevi Perenni", "Giungla",
				"Marino", "Giardinfiore", "Trendy", "Pluviale",
				"Oceano", "Pokeball", "Nordico", "Fluviale",
				"Sabbia", "Savana", "Solare", "Manto di Neve"
			],
			"category": "Scale",
			"type": [ "Bug", "Flying" ],
			"evolves-from": "665",
			"base-stamina": 190,
			"base-attack": 176,
			"base-defense": 103,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.125,
				"xxs": [ 0.3, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"667": {
			"dex-index": "667",
			"name": "Litleo",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2022-02-01"
			},
			"category": "Lion Cub",
			"type": [ "Fire", "Normal" ],
			"evolves-into": [ "668" ],
			"base-stamina": 158,
			"base-attack": 139,
			"base-defense": 112,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_FIREFANG",
				"FAST_NOR_TACKLE",
				"FAST_FIR_EMBER",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.6,
			"weight-avg": 13.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.6875,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"668": {
			"dex-index": "668",
			"name": "Pyroar",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2022-02-01"
			},
			"variants": [ "Male", "Female" ],
			"category": "Royal",
			"type": [ "Fire", "Normal" ],
			"base-stamina": 200,
			"base-attack": 221,
			"base-defense": 149,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_FIREFANG",
				"FAST_NOR_TAKEDOWN",
				"FAST_FIR_EMBER",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_DAR_DARKPULSE",
				"CHRG_FIR_OVERHEAT"
			],
			"height-avg": 1.5,
			"weight-avg": 81.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 10.1875,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"669-0": {
			"dex-index": "669-0",
			"name": "Flabebe",
			"availability": {
				"in-game": "2022-02-10",
				"shiny": "2024-03-21"
			},
			"name-display": "Flab&eacute;b&eacute;",
			"category": "Single Bloom",
			"type": [ "Fairy" ],
			"evolves-into": [ "670-0" ],
			"base-stamina": 127,
			"base-attack": 108,
			"base-defense": 120,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.5,
			"weight-avg": 81.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0125,
				"wt-std-dev": 0.0125,
				"xxs": [ 0.049, 0.05 ],
				"xs": [ 0.05, 0.075 ],
				"m": [ 0.075, 0.125 ],
				"xl": [ 0.125, 0.15 ],
				"xxl": [ 0.15, 0.175 ]
			}
		},
		"669-B": {
			"dex-index": "669-B",
			"form-data": {
				"base": "669-0",
				"type": "fuck if I know",
				"form": "Blue Flower",
				"form-ital": "Fiore Blu"
			},
			"evolves-into": [ "670-B" ]
		},
		"669-O": {
			"dex-index": "669-O",
			"form-data": {
				"base": "669-0",
				"type": "fuck if I know",
				"form": "Orange Flower",
				"form-ital": "Fiore Arancione"
			},
			"evolves-into": [ "670-O" ]
		},
		"669-R": {
			"dex-index": "669-R",
			"form-data": {
				"base": "669-0",
				"type": "fuck if I know",
				"form": "Red Flower",
				"form-ital": "Fiore Rosso"
			},
			"evolves-into": [ "670-R" ]
		},
		"669-W": {
			"dex-index": "669-W",
			"form-data": {
				"base": "669-0",
				"type": "fuck if I know",
				"form": "White Flower",
				"form-ital": "Fiore Bianco"
			},
			"evolves-into": [ "670-W" ]
		},
		"669-Y": {
			"dex-index": "669-Y",
			"form-data": {
				"base": "669-0",
				"type": "fuck if I know",
				"form": "Yellow Flower",
				"form-ital": "Fiore Giallo"
			},
			"evolves-into": [ "670-Y" ]
		},
		"670-0": {
			"dex-index": "670-0",
			"name": "Floette",
			"availability": {
				"in-game": "2022-02-10",
				"shiny": "2024-03-21"
			},
			"category": "Single Bloom",
			"type": [ "Fairy" ],
			"evolves-from": "669-0",
			"evolves-into": [ "671-0" ],
			"base-stamina": 144,
			"base-attack": 136,
			"base-defense": 151,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.1,
			"weight-avg": 0.1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.1125,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"670-B": {
			"dex-index": "670-B",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "Blue Flower",
				"form-ital": "Fiore Blu"
			},
			"evolves-from": "669-B",
			"evolves-into": [ "671-B" ]
		},
		"670-O": {
			"dex-index": "670-O",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "Orange Flower",
				"form-ital": "Fiore Arancione"
			},
			"evolves-from": "669-O",
			"evolves-into": [ "671-O" ]
		},
		"670-R": {
			"dex-index": "670-R",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "Red Flower",
				"form-ital": "Fiore Rosso"
			},
			"evolves-from": "669-R",
			"evolves-into": [ "671-R" ]
		},
		"670-W": {
			"dex-index": "670-W",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "White Flower",
				"form-ital": "Fiore Bianco"
			},
			"evolves-from": "669-W",
			"evolves-into": [ "671-W" ]
		},
		"670-Y": {
			"dex-index": "670-Y",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "Yellow Flower",
				"form-ital": "Fiore Giallo"
			},
			"evolves-from": "669-Y",
			"evolves-into": [ "671-Y" ]
		},
		"671-0": {
			"dex-index": "671-0",
			"name": "Florges",
			"availability": {
				"in-game": "2022-02-10",
				"shiny": "2024-03-21"
			},
			"category": "Garden",
			"type": [ "Fairy" ],
			"evolves-from": "670-0",
			"base-stamina": 186,
			"base-attack": 212,
			"base-defense": 244,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_NOR_TACKLE",
				"FAST_GRA_RAZORLEAF",
				"FAST_FAI_FAIRYWIND"
			],
			"charged-moves": [
				"CHRG_FAI_MOONBLAST",
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_PSY_PSYCHIC",
				"CHRG_FAI_DISARMINGVOICE"
			],
			"height-avg": 0.2,
			"weight-avg": 0.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 1.25,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"671-B": {
			"dex-index": "671-B",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "Blue Flower",
				"form-ital": "Fiore Blu"
			},
			"evolves-from": "670-B"
		},
		"671-O": {
			"dex-index": "671-O",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "Orange Flower",
				"form-ital": "Fiore Arancione"
			},
			"evolves-from": "670-O"
		},
		"671-R": {
			"dex-index": "671-R",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "Red Flower",
				"form-ital": "Fiore Rosso"
			},
			"evolves-from": "670-R"
		},
		"671-W": {
			"dex-index": "671-W",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "White Flower",
				"form-ital": "Fiore Bianco"
			},
			"evolves-from": "670-W"
		},
		"671-Y": {
			"dex-index": "671-Y",
			"form-data": {
				"base": "670-0",
				"type": "fuck if I know",
				"form": "Yellow Flower",
				"form-ital": "Fiore Giallo"
			},
			"evolves-from": "670-Y"
		},
		"672": {
			"dex-index": "672",
			"name": "Skiddo",
			"availability": {
				"in-game": "2023-10-07",
				"shiny": "2023-10-07"
			},
			"category": "Mount",
			"type": [ "Grass" ],
			"evolves-into": [ "673" ],
			"base-stamina": 165,
			"base-attack": 123,
			"base-defense": 102,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.9,
			"weight-avg": 31,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 3.875,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"673": {
			"dex-index": "673",
			"name": "Gogoat",
			"availability": {
				"in-game": "2023-10-07",
				"shiny": "2023-10-07"
			},
			"category": "Mount",
			"type": [ "Grass" ],
			"evolves-from": "672",
			"base-stamina": 265,
			"base-attack": 196,
			"base-defense": 146,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FIG_ROCKSMASH",
				"FAST_GRA_VINEWHIP"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_GRA_LEAFBLADE",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 1.7,
			"weight-avg": 91,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 11.375,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"674": {
			"dex-index": "674",
			"name": "Pancham",
			"availability": {
				"in-game": "2021-05-11",
				"shiny": "2023-06-21"
			},
			"category": "Playful",
			"type": [ "Fighting" ],
			"evolves-into": [ "675" ],
			"base-stamina": 167,
			"base-attack": 145,
			"base-defense": 107,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FIG_LOWSWEEP",
				"CHRG_DAR_CRUNCH",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.6,
			"weight-avg": 8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"675": {
			"dex-index": "675",
			"name": "Pangoro",
			"availability": {
				"in-game": "2021-05-11",
				"shiny": "2023-06-21"
			},
			"category": "Daunting",
			"type": [ "Fighting", "Dark" ],
			"evolves-from": "674",
			"base-stamina": 216,
			"base-attack": 226,
			"base-defense": 146,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_DAR_SNARL",
				"FAST_STE_BULLETPUNCH",
				"FAST_FIG_KARATECHOP"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_STE_IRONHEAD",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 2.1,
			"weight-avg": 136,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2625,
				"wt-std-dev": 17,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.255 ]
			}
		},
		"676": {
			"dex-index": "676",
			"name": "Furfrou",
			"availability": {
				"in-game": "2021-09-21",
				"shiny": "2022-09-27"
			},
			"category": "Poodle",
			"variants": [
				"Dandy", "Debutante", "Diamond",
				"Heart", "Kabuki", "La Reine",
				"Matron", "Pharaoh", "Star"
			],
			"variants": [
				"Gentiluomo", "Signorina", "Diamante",
				"Cuore", "Kabuki", "Regina",
				"Gentildonna", "Faraone", "Stella"
			],
			"type": [ "Normal" ],
			"base-stamina": 181,
			"base-attack": 164,
			"base-defense": 167,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TAKEDOWN",
				"FAST_DAR_BITE",
				"FAST_DAR_SUCKERPUNCH",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_DAR_DARKPULSE",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 1.2,
			"weight-avg": 28,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 3.5,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"677": {
			"dex-index": "677",
			"name": "Espurr",
			"availability": {
				"in-game": "2020-11-30",
				"shiny": "2022-02-01"
			},
			"category": "Restraint",
			"type": [ "Psychic" ],
			"evolves-into": [ "678-M", "678-F" ],
			"base-stamina": 158,
			"base-attack": 120,
			"base-defense": 114,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.3,
			"weight-avg": 3.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.4375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"678-0": {
			"dex-index": "678-0",
			"name": "Meowstic",
			"availability": {
				"in-game": "2020-11-30"
			},
			"category": "Constraint",
			"type": [ "Psychic" ],
			"base-stamina": 179,
			"base-attack": 166,
			"base-defense": 167,
			"dynamax-class": 2,
			"height-avg": 0.6,
			"weight-avg": 8.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.0625,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"678-M": {
			"dex-index": "678-M",
			"form-data": {
				"base": "678-0",
				"type": "Gender",
				"form": "Male"
			},
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRA_ENERGYBALL"
			]
		},
		"678-F": {
			"dex-index": "678-F",
			"form-data": {
				"base": "678-0",
				"type": "Gender",
				"form": "Female"
			},
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_GRA_MAGICALLEAF",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRA_ENERGYBALL"
			]
		},
		"679": {
			"dex-index": "679",
			"name": "Honedge",
			"availability": {
				"in-game": false
			},
			"category": "Sword",
			"type": [ "Steel", "Ghost" ],
			"evolves-into": [ "680" ],
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_STE_IRONHEAD",
				"CHRG_STE_GYROBALL"
			],
			"height-avg": 0.8,
			"weight-avg": 2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 0.25,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"680": {
			"dex-index": "680",
			"name": "Doublade",
			"availability": {
				"in-game": false
			},
			"category": "Sword",
			"type": [ "Steel", "Ghost" ],
			"evolves-from": "679",
			"evolves-into": [ "681-0" ],
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_PSYCHOCUT",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_STE_IRONHEAD",
				"CHRG_STE_GYROBALL"
			],
			"height-avg": 0.8,
			"weight-avg": 4.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 0.5625,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"681-0": {
			"dex-index": "681-0",
			"name": "Aegislash",
			"availability": {
				"in-game": false
			},
			"category": "Royal Sword",
			"type": [ "Steel", "Ghost" ],
			"evolves-from": "680",
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_PSYCHOCUT",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_STE_FLASHCANNON",
				"CHRG_STE_GYROBALL"
			],
			"height-avg": 1.7,
			"weight-avg": 53,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 6.625,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.975 ]
			}
		},
		"681-S": {
			"dex-index": "681-S",
			"form-data": {
				"base": "681-0",
				"type": "battle?",
				"form": "Shield Forme",
				"form-ital": "Forma Scudo"
			}
		},
		"681-B": {
			"dex-index": "681-B",
			"form-data": {
				"base": "681-0",
				"type": "battle?",
				"form": "Blade Forme",
				"form-ital": "Forma Spada"
			}
		},
		"682": {
			"dex-index": "682",
			"name": "Spritzee",
			"availability": {
				"in-game": "2021-05-04",
				"shiny": "2022-09-23"
			},
			"category": "Perfume",
			"type": [ "Fairy" ],
			"evolves-into": [ "683" ],
			"base-stamina": 186,
			"base-attack": 110,
			"base-defense": 113,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_FAI_DRAININGKISS",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.2,
			"weight-avg": 0.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.0625,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"683": {
			"dex-index": "683",
			"name": "Aromatisse",
			"availability": {
				"in-game": "2021-05-04",
				"shiny": "2022-09-23"
			},
			"category": "Fragrance",
			"type": [ "Fairy" ],
			"evolves-from": "682",
			"base-stamina": 226,
			"base-attack": 173,
			"base-defense": 150,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_FAI_MOONBLAST",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_PSY_PSYCHIC",
				"CHRG_FAI_DRAININGKISS"
			],
			"height-avg": 0.8,
			"weight-avg": 15.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 1.9375,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"684": {
			"dex-index": "684",
			"name": "Swirlix",
			"availability": {
				"in-game": "2021-05-04",
				"shiny": "2022-08-05"
			},
			"category": "Cotton Candy",
			"type": [ "Fairy" ],
			"evolves-into": [ "685" ],
			"base-stamina": 158,
			"base-attack": 109,
			"base-defense": 119,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FAI_DRAININGKISS",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 0.4,
			"weight-avg": 3.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.4375,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"685": {
			"dex-index": "685",
			"name": "Slurpuff",
			"availability": {
				"in-game": "2021-05-04",
				"shiny": "2022-08-05"
			},
			"category": "Meringue",
			"type": [ "Fairy" ],
			"evolves-from": "684",
			"base-stamina": 193,
			"base-attack": 168,
			"base-defense": 163,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FAI_CHARM",
				"FAST_FAI_FAIRYWIND"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FAI_DRAININGKISS"
			],
			"height-avg": 0.8,
			"weight-avg": 5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 0.625,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"686": {
			"dex-index": "686",
			"name": "Inkay",
			"availability": {
				"in-game": "2020-09-08",
				"shiny": "2022-09-03"
			},
			"category": "Revolving",
			"type": [ "Dark", "Psychic" ],
			"evolves-into": [ "687" ],
			"base-stamina": 142,
			"base-attack": 98,
			"base-defense": 95,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_NOR_TACKLE",
				"FAST_PSY_PSYWAVE"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_DAR_NIGHTSLASH"
			],
			"height-avg": 0.4,
			"weight-avg": 3.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.4375,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"687": {
			"dex-index": "687",
			"name": "Malamar",
			"availability": {
				"in-game": "2020-09-08",
				"shiny": "2022-09-03"
			},
			"category": "Overturning",
			"type": [ "Dark", "Psychic" ],
			"evolves-from": "686",
			"base-stamina": 200,
			"base-attack": 177,
			"base-defense": 165,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_PSY_PSYCHOCUT",
				"FAST_PSY_PSYWAVE"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_DAR_FOULPLAY",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_NOR_HYPERBEAM"
			],
			"height-avg": 1.5,
			"weight-avg": 47,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.875,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 3 ]
			}
		},
		"688": {
			"dex-index": "688",
			"name": "Binacle",
			"availability": {
				"in-game": "2021-04-20",
				"shiny": "2022-05-12"
			},
			"category": "Two-Handed",
			"type": [ "Rock", "Water" ],
			"evolves-into": [ "689" ],
			"base-stamina": 123,
			"base-attack": 96,
			"base-defense": 120,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FIG_CROSSCHOP",
				"CHRG_GRO_DIG"
			],
			"height-avg": 0.5,
			"weight-avg": 31,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 3.875,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"689": {
			"dex-index": "689",
			"name": "Barbaracle",
			"availability": {
				"in-game": "2021-04-20",
				"shiny": "2022-05-12"
			},
			"category": "Collective",
			"type": [ "Rock", "Water" ],
			"evolves-from": "688",
			"base-stamina": 176,
			"base-attack": 194,
			"base-defense": 205,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSLAP",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_NOR_SKULLBASH",
				"CHRG_FIG_CROSSCHOP",
				"CHRG_ROC_STONEEDGE",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_WAT_RAZORSHELL"
			],
			"height-avg": 1.3,
			"weight-avg": 96,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 12,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"690": {
			"dex-index": "690",
			"name": "Skrelp",
			"availability": {
				"in-game": "2021-04-13",
				"shiny": "2023-08-18"
			},
			"category": "Mock Kelp",
			"type": [ "Poison", "Water" ],
			"evolves-into": [ "691" ],
			"base-stamina": 137,
			"base-attack": 109,
			"base-defense": 109,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_WAT_AQUATAIL",
				"CHRG_WAT_WATERPULSE",
				"CHRG_DRA_TWISTER",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.5,
			"weight-avg": 7.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.9125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"691": {
			"dex-index": "691",
			"name": "Dragalge",
			"availability": {
				"in-game": "2021-04-13",
				"shiny": "2023-08-18"
			},
			"category": "Mock Kelp",
			"type": [ "Poison", "Dragon" ],
			"evolves-from": "690",
			"base-stamina": 163,
			"base-attack": 177,
			"base-defense": 207,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_POI_ACID",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_WAT_AQUATAIL",
				"CHRG_DRA_OUTRAGE",
				"CHRG_POI_GUNKSHOT"
			],
			"height-avg": 1.8,
			"weight-avg": 81.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 10.1875,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"692": {
			"dex-index": "692",
			"name": "Clauncher",
			"availability": {
				"in-game": "2021-04-13",
				"shiny": "2023-06-06"
			},
			"category": "Water Gun",
			"type": [ "Water" ],
			"evolves-into": [ "693" ],
			"base-stamina": 137,
			"base-attack": 108,
			"base-defense": 117,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_WAT_CRABHAMMER",
				"CHRG_WAT_AQUAJET"
			],
			"height-avg": 0.5,
			"weight-avg": 8.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.0375,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"693": {
			"dex-index": "693",
			"name": "Clawitzer",
			"availability": {
				"in-game": "2021-04-13",
				"shiny": "2023-06-06"
			},
			"category": "Howitzer",
			"type": [ "Water" ],
			"evolves-from": "692",
			"base-stamina": 174,
			"base-attack": 221,
			"base-defense": 171,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_DAR_DARKPULSE",
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_CRABHAMMER"
			],
			"height-avg": 1.3,
			"weight-avg": 35.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 4.4125,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"694": {
			"dex-index": "694",
			"name": "Helioptile",
			"availability": {
				"in-game": "2022-01-19",
				"shiny": "2023-01-27"
			},
			"category": "Generator",
			"type": [ "Electric", "Normal" ],
			"evolves-into": [ "695" ],
			"base-stamina": 127,
			"base-attack": 115,
			"base-defense": 78,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_ELE_PARABOLICCHARGE",
				"CHRG_GRO_BULLDOZE",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.5,
			"weight-avg": 6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.75,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"695": {
			"dex-index": "695",
			"name": "Heliolisk",
			"availability": {
				"in-game": "2022-01-19",
				"shiny": "2023-01-27"
			},
			"category": "Generator",
			"type": [ "Electric", "Normal" ],
			"evolves-from": "694",
			"base-stamina": 158,
			"base-attack": 219,
			"base-defense": 168,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_ELE_VOLTSWITCH",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_ELE_PARABOLICCHARGE",
				"CHRG_GRO_BULLDOZE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_DRA_BREAKINGSWIPE"
			],
			"height-avg": 1,
			"weight-avg": 21,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 2.625,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"696": {
			"dex-index": "696",
			"name": "Tyrunt",
			"availability": {
				"in-game": "2022-06-07",
				"shiny": "2023-07-27"
			},
			"category": "Royal Heir",
			"type": [ "Rock", "Dragon" ],
			"evolves-into": [ "697" ],
			"base-stamina": 151,
			"base-attack": 158,
			"base-defense": 123,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_DRA_DRAGONCLAW"
			],
			"height-avg": 0.8,
			"weight-avg": 26,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.25,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.6 ]
			}
		},
		"697": {
			"dex-index": "697",
			"name": "Tyrantrum",
			"availability": {
				"in-game": "2022-06-07",
				"shiny": "2023-07-27"
			},
			"category": "Despot",
			"type": [ "Rock", "Dragon" ],
			"evolves-from": "696",
			"base-stamina": 193,
			"base-attack": 227,
			"base-defense": 191,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_FAI_CHARM",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ROC_STONEEDGE",
				"CHRG_DRA_OUTRAGE",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_METEORBEAM"
			],
			"height-avg": 2.5,
			"weight-avg": 270,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 33.75,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 5 ]
			}
		},
		"698": {
			"dex-index": "698",
			"name": "Amaura",
			"availability": {
				"in-game": "2022-06-07",
				"shiny": "2023-07-27"
			},
			"category": "Tundra",
			"type": [ "Rock", "Ice" ],
			"evolves-into": [ "699" ],
			"base-stamina": 184,
			"base-attack": 124,
			"base-defense": 109,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_ICE_FROSTBREATH"
			],
			"charged-moves": [
				"CHRG_ICE_WEATHERBALL",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_ICE_AURORABEAM",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 1.3,
			"weight-avg": 25.2,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 3.15,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"699": {
			"dex-index": "699",
			"name": "Aurorus",
			"availability": {
				"in-game": "2022-06-07",
				"shiny": "2023-07-27"
			},
			"category": "Tundra",
			"type": [ "Rock", "Ice" ],
			"evolves-from": "698",
			"base-stamina": 265,
			"base-attack": 186,
			"base-defense": 163,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_ICE_FROSTBREATH",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ICE_WEATHERBALL",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_ICE_BLIZZARD",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_ROC_METEORBEAM"
			],
			"height-avg": 2.7,
			"weight-avg": 225,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.3375,
				"wt-std-dev": 28.125,
				"xxs": [ 1.323, 1.35 ],
				"xs": [ 1.35, 2.025 ],
				"m": [ 2.025, 3.375 ],
				"xl": [ 3.375, 4.05 ],
				"xxl": [ 4.05, 5.4 ]
			}
		},
		"700": {
			"dex-index": "700",
			"name": "Sylveon",
			"availability": {
				"in-game": "2021-05-25"
			},
			"category": "Intertwining",
			"type": [ "Fairy" ],
			"evolves-from": "133",
			"base-stamina": 216,
			"base-attack": 203,
			"base-defense": 205,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_FAI_MOONBLAST",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_FAI_DRAININGKISS"
			],
			"special-charged-moves": [
				"CHRG_NOR_LASTRESORT",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 1,
			"weight-avg": 23.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 2.9375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"701": {
			"dex-index": "701",
			"name": "Hawlucha",
			"availability": {
				"in-game": "2023-03-01"
			},
			"category": "Wrestling",
			"type": [ "Fighting", "Flying" ],
			"base-stamina": 186,
			"base-attack": 195,
			"base-defense": 153,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_FIG_FLYINGPRESS",
				"CHRG_FLY_AERIALACE",
				"CHRG_BUG_XSCISSOR",
				"CHRG_FIG_POWERUPPUNCH"
			],
			"height-avg": 0.8,
			"weight-avg": 21.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.6875,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"702": {
			"dex-index": "702",
			"name": "Dedenne",
			"availability": {
				"in-game": "2021-11-05",
				"shiny": "2023-01-10"
			},
			"category": "Antenna",
			"type": [ "Electric", "Fairy" ],
			"base-stamina": 167,
			"base-attack": 164,
			"base-defense": 134,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_ELE_PARABOLICCHARGE"
			],
			"height-avg": 0.2,
			"weight-avg": 2.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.275,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"703": {
			"dex-index": "703",
			"name": "Carbink",
			"availability": {
				"in-game": "2023-06-21"
			},
			"category": "Jewel",
			"type": [ "Rock", "Fairy" ],
			"base-stamina": 137,
			"base-attack": 95,
			"base-defense": 285,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_FAI_MOONBLAST",
				"CHRG_ROC_POWERGEM"
			],
			"height-avg": 0.3,
			"weight-avg": 5.7,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.7125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.6 ]
			}
		},
		"704": {
			"dex-index": "704",
			"name": "Goomy",
			"availability": {
				"in-game": "2021-05-04",
				"shiny": "2023-08-26"
			},
			"category": "Soft Tissue",
			"type": [ "Dragon" ],
			"evolves-into": [ "705" ],
			"base-stamina": 128,
			"base-attack": 101,
			"base-defense": 112,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_WAT_MUDDYWATER"
			],
			"height-avg": 0.3,
			"weight-avg": 2.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.35,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"705": {
			"dex-index": "705",
			"name": "Sliggoo",
			"availability": {
				"in-game": "2021-05-04",
				"shiny": "2023-08-26"
			},
			"category": "Soft Tissue",
			"type": [ "Dragon" ],
			"evolves-from": "704",
			"evolves-into": [ "706" ],
			"base-stamina": 169,
			"base-attack": 159,
			"base-defense": 176,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_WAT_MUDDYWATER",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 0.8,
			"weight-avg": 17.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.1875,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"705-H": {
			"dex-index": "705-H",
			"form-data": {
				"base": "705",
				"type": "Regional",
				"region": "Hisuian"
			},
			"category": "Snail",
			"type": [ "Steel", "Dragon" ],
			"evolves-into": [ "706-H" ]
		},
		"706": {
			"dex-index": "706",
			"name": "Goodra",
			"availability": {
				"in-game": "2021-05-04",
				"shiny": "2023-08-26"
			},
			"category": "Dragon",
			"type": [ "Dragon" ],
			"evolves-from": "705",
			"base-stamina": 207,
			"base-attack": 220,
			"base-defense": 242,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_DRA_DRAGONBREATH"
			],
			"charged-moves": [
				"CHRG_DRA_DRACOMETEOR",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_WAT_MUDDYWATER",
				"CHRG_GRA_POWERWHIP",
				"CHRG_WAT_AQUATAIL"
			],
			"special-charged-moves": [
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 2,
			"weight-avg": 150.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 18.8125,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"706-H": {
			"dex-index": "706-H",
			"form-data": {
				"base": "706",
				"type": "Regional",
				"region": "Hisuian"
			},
			"category": "Shell Bunker",
			"type": [ "Steel", "Dragon" ],
			"evolves-from": "705-H"
		},
		"707": {
			"dex-index": "707",
			"name": "Klefki",
			"availability": {
				"in-game": "2020-12-02"
			},
			"category": "Key Ring",
			"type": [ "Steel", "Fairy" ],
			"base-stamina": 149,
			"base-attack": 160,
			"base-defense": 179,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_STE_FLASHCANNON",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_FAI_DRAININGKISS",
				"CHRG_DAR_FOULPLAY"
			],
			"height-avg": 0.2,
			"weight-avg": 3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.375,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"708": {
			"dex-index": "708",
			"name": "Phantump",
			"availability": {
				"in-game": "2021-10-22",
				"shiny": "2023-10-19"
			},
			"category": "Stump",
			"type": [ "Ghost", "Grass" ],
			"evolves-into": [ "709" ],
			"base-stamina": 125,
			"base-attack": 125,
			"base-defense": 103,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DAR_FOULPLAY"
			],
			"height-avg": 0.4,
			"weight-avg": 7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"709": {
			"dex-index": "709",
			"name": "Trevenant",
			"availability": {
				"in-game": "2021-10-22",
				"shiny": "2023-10-19"
			},
			"category": "Elder Tree",
			"type": [ "Ghost", "Grass" ],
			"evolves-from": "708",
			"base-stamina": 198,
			"base-attack": 201,
			"base-defense": 154,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_SHADOWCLAW",
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DAR_FOULPLAY"
			],
			"height-avg": 1.5,
			"weight-avg": 71,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 8.875,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 3 ]
			}
		},
		"710-0": {
			"dex-index": "710-0",
			"name": "Pumpkaboo",
			"availability": {
				"in-game": "2021-10-22",
				"shiny": "2022-11-01"
			},
			"category": "Pumpkin",
			"type": [ "Ghost", "Grass" ],
			"image": "710",
			"evolves-into": [ "711-0" ],
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_DAR_FOULPLAY"
			],
			"showcase-baseline": "710-S"
		},
		"710-S": {
			"dex-index": "710-S",
			"form-data": {
				"base": "710-0",
				"type": "pumpkins",
				"form": "Small Size",
				"form-ital": "Mini"
			},
			"evolves-into": [ "711-S" ],
			"base-stamina": 127,
			"base-attack": 122,
			"base-defense": 124,
			"height-avg": 0.3,
			"weight-avg": 3.5,
			"size-data": {
				"class": 1.33,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.4375,
				"xxs": [ 0.3, 0.3 ],
				"xs": [ 0.3, 0.4 ],
				"m": [ 0.4, 0.4 ],
				"xl": [ 0.4, 0.4 ],
				"xxl": [ 0.4, 0.4 ]
			}
		},
		"710-A": {
			"dex-index": "710-A",
			"form-data": {
				"base": "710-0",
				"type": "pumpkins",
				"form": "Average Size",
				"form-ital": "Normale"
			},
			"evolves-into": [ "711-A" ],
			"base-stamina": 135,
			"base-attack": 121,
			"base-defense": 123,
			"height-avg": 0.4,
			"weight-avg": 5,
			"size-data": {
				"class": 1.25,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.625,
				"xxs": [ 0.4, 0.4 ],
				"xs": [ 0.4, 0.4 ],
				"m": [ 0.4, 0.5 ],
				"xl": [ 0.5, 0.5 ],
				"xxl": [ 0.5, 0.5 ]
			}
		},
		"710-L": {
			"dex-index": "710-L",
			"form-data": {
				"base": "710-0",
				"type": "pumpkins",
				"form": "Large Size",
				"form-ital": "Grande"
			},
			"evolves-into": [ "711-L" ],
			"base-stamina": 144,
			"base-attack": 120,
			"base-defense": 122,
			"height-avg": 0.5,
			"weight-avg": 7.5,
			"size-data": {
				"class": 1.20,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.9375,
				"xxs": [ 0.5, 0.5 ],
				"xs": [ 0.5, 0.5 ],
				"m": [ 0.5, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.6 ]
			}
		},
		"710-X": {
			"dex-index": "710-X",
			"form-data": {
				"base": "710-0",
				"type": "pumpkins",
				"form": "Super Size",
				"form-ital": "Maxi"
			},
			"evolves-into": [ "711-X" ],
			"base-stamina": 153,
			"base-attack": 118,
			"base-defense": 120,
			"height-avg": 0.8,
			"weight-avg": 15,
			"size-data": {
				"class": 1.00,
				"ht-std-dev": 0.1,
				"wt-std-dev": 1.875,
				"xxs": [ 0.6, 0.6 ],
				"xs": [ 0.6, 0.6 ],
				"m": [ 0.6, 0.6 ],
				"xl": [ 0.6, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"711-0": {
			"dex-index": "711-0",
			"name": "Gourgeist",
			"availability": {
				"in-game": "2021-10-22",
				"shiny": "2022-11-01"
			},
			"category": "Pumpkin",
			"type": [ "Ghost", "Grass" ],
			"image": "711",
			"evolves-from": "710-0",
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DAR_FOULPLAY",
				"CHRG_FIR_FIREBLAST",
				"CHRG_GHO_POLTERGEIST"
			],
			"showcase-baseline": "711-S"
		},
		"711-S": {
			"dex-index": "711-S",
			"form-data": {
				"base": "711-0",
				"type": "pumpkins",
				"form": "Small Size",
				"form-ital": "Mini"
			},
			"evolves-from": "710-S",
			"base-stamina": 146,
			"base-attack": 171,
			"base-defense": 219,
			"height-avg": 0.7,
			"weight-avg": 9.5,
			"size-data": {
				"class": 1.29,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.1875,
				"xxs": [ 0.7, 0.7 ],
				"xs": [ 0.7, 0.9 ],
				"m": [ 0.9, 0.9 ],
				"xl": [ 0.9, 0.9 ],
				"xxl": [ 0.9, 0.9 ]
			}
		},
		"711-A": {
			"dex-index": "711-A",
			"form-data": {
				"base": "711-0",
				"type": "pumpkins",
				"form": "Average Size",
				"form-ital": "Normale"
			},
			"evolves-from": "710-A",
			"base-stamina": 163,
			"base-attack": 175,
			"base-defense": 213,
			"height-avg": 0.9,
			"weight-avg": 12.5,
			"size-data": {
				"class": 1.22,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 1.5625,
				"xxs": [ 0.9, 0.9 ],
				"xs": [ 0.9, 0.9 ],
				"m": [ 0.9, 1.1 ],
				"xl": [ 1.1, 1.1 ],
				"xxl": [ 1.1, 1.1 ]
			}
		},
		"711-L": {
			"dex-index": "711-L",
			"form-data": {
				"base": "711-0",
				"type": "pumpkins",
				"form": "Large Size",
				"form-ital": "Grande"
			},
			"evolves-from": "710-L",
			"base-stamina": 181,
			"base-attack": 179,
			"base-defense": 206,
			"height-avg": 1.1,
			"weight-avg": 14,
			"size-data": {
				"class": 1.27,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 1.75,
				"xxs": [ 1.1, 1.1 ],
				"xs": [ 1.1, 1.1 ],
				"m": [ 1.1, 1.1 ],
				"xl": [ 1.1, 1.4 ],
				"xxl": [ 1.4, 1.4 ]
			}
		},
		"711-X": {
			"dex-index": "711-X",
			"form-data": {
				"base": "710-0",
				"type": "pumpkins",
				"form": "Super Size",
				"form-ital": "Maxi"
			},
			"evolves-from": "710-X",
			"base-stamina": 198,
			"base-attack": 182,
			"base-defense": 200,
			"height-avg": 1.7,
			"weight-avg": 39,
			"size-data": {
				"class": 1.00,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 4.875,
				"xxs": [ 1.4, 1.4 ],
				"xs": [ 1.4, 1.4 ],
				"m": [ 1.4, 1.4 ],
				"xl": [ 1.4, 1.4 ],
				"xxl": [ 1.4, 1.7 ]
			}
		},
		"712": {
			"dex-index": "712",
			"name": "Bergmite",
			"availability": {
				"in-game": "2021-12-23",
				"shiny": "2022-12-15"
			},
			"category": "Ice Chunk",
			"type": [ "Ice" ],
			"evolves-into": [ "713" ],
			"base-stamina": 146,
			"base-attack": 117,
			"base-defense": 120,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ICE_ICYWIND",
				"CHRG_PSY_MIRRORCOAT"
			],
			"height-avg": 1,
			"weight-avg": 99.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 12.4375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"713": {
			"dex-index": "713",
			"name": "Avalugg",
			"availability": {
				"in-game": "2021-12-23",
				"shiny": "2022-12-15"
			},
			"category": "Iceberg",
			"type": [ "Ice" ],
			"evolves-from": "712",
			"base-stamina": 216,
			"base-attack": 196,
			"base-defense": 240,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ICE_AVALANCHE",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_NOR_BODYSLAM",
				"CHRG_PSY_MIRRORCOAT",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 2,
			"weight-avg": 505,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 63.125,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"713-H": {
			"dex-index": "713-H",
			"form-data": {
				"base": "713",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2022-12-24",
				"shiny": "2022-12-24"
			},
			"type": [ "Ice", "Rock" ],
			"base-stamina": 216,
			"base-attack": 214,
			"base-defense": 238,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_NOR_TACKLE",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ICE_BLIZZARD",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 1.4,
			"weight-avg": 262.4
		},
		"714": {
			"dex-index": "714",
			"name": "Noibat",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2022-10-20"
			},
			"category": "Sound Wave",
			"type": [ "Flying", "Dragon" ],
			"evolves-into": [ "715" ],
			"base-stamina": 120,
			"base-attack": 83,
			"base-defense": 73,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_FLY_AIRCUTTER",
				"CHRG_FIR_HEATWAVE"
			],
			"height-avg": 0.5,
			"weight-avg": 8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"715": {
			"dex-index": "715",
			"name": "Noivern",
			"availability": {
				"in-game": "2020-12-02",
				"shiny": "2022-10-20"
			},
			"category": "Sound Wave",
			"type": [ "Flying", "Dragon" ],
			"evolves-from": "714",
			"base-stamina": 198,
			"base-attack": 205,
			"base-defense": 175,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DRA_DRACOMETEOR",
				"CHRG_FLY_HURRICANE",
				"CHRG_FIR_HEATWAVE",
				"CHRG_PSY_PSYCHIC"
			],
			"special-charged-moves": [
				"CHRG_NOR_BOOMBURST"
			],
			"height-avg": 1.5,
			"weight-avg": 85,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 10.625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"716": {
			"dex-index": "716",
			"name": "Xerneas",
			"availability": {
				"in-game": "2021-05-04",
				"shiny": "2022-10-08"
			},
			"category": "Life",
			"type": [ "Fairy" ],
			"base-stamina": 246,
			"base-attack": 250,
			"base-defense": 185,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_PSY_ZENHEADBUTT"
			],
			"special-fast-moves": [
				"FAST_FAI_GEOMANCY"
			],
			"charged-moves": [
				"CHRG_FAI_MOONBLAST",
				"CHRG_BUG_MEGAHORN",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_NOR_GIGAIMPACT",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 3,
			"weight-avg": 215,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.375,
				"wt-std-dev": 26.875,
				"xxs": [ 1.47, 1.5 ],
				"xs": [ 1.5, 2.25 ],
				"m": [ 2.25, 3.75 ],
				"xl": [ 3.75, 4.5 ],
				"xxl": [ 4.5, 4.65 ]
			}
		},
		"717": {
			"dex-index": "717",
			"name": "Yveltal",
			"availability": {
				"in-game": "2021-05-18",
				"shiny": "2022-09-27"
			},
			"category": "Destruction",
			"type": [ "Dark", "Flying" ],
			"base-stamina": 246,
			"base-attack": 250,
			"base-defense": 185,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_DAR_SNARL",
				"FAST_FLY_GUST"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_FLY_HURRICANE",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_PSY_PSYCHIC"
			],
			"special-charged-moves": [
				"CHRG_FLY_OBLIVIONWING"
			],
			"height-avg": 5.8,
			"weight-avg": 203,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.725,
				"wt-std-dev": 25.375,
				"xxs": [ 2.842, 2.9 ],
				"xs": [ 2.9, 4.35 ],
				"m": [ 4.35, 7.25 ],
				"xl": [ 7.25, 8.7 ],
				"xxl": [ 8.7, 8.99 ]
			}
		},
		"718-0": {
			"dex-index": "718-0",
			"name": "Zygarde (50% Forme)",
			"availability": {
				"in-game": "2023-07-20"
			},
			"category": "Order",
			"type": [ "Dragon", "Ground" ],
			"evolves-into": [ "718-2" ],
			"evolve-from": "718-1",
			"base-stamina": 239,
			"base-attack": 203,
			"base-defense": 232,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_DAR_BITE",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_DAR_CRUNCH",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 5,
			"weight-avg": 305,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.625,
				"wt-std-dev": 38.125,
				"xxs": [ 2.45, 2.5 ],
				"xs": [ 2.5, 3.75 ],
				"m": [ 3.75, 6.25 ],
				"xl": [ 6.25, 7.5 ],
				"xxl": [ 7.5, 7.75 ]
			}
		},
		"718-1": {
			"dex-index": "718-1",
			"name": "Zygarde (10% Forme)",
			"availability": {
				"in-game": "2023-07-20"
			},
			"category": "Order",
			"type": [ "Dragon", "Ground" ],
			"evolves-into": [ "718-0" ],
			"base-stamina": 144,
			"base-attack": 205,
			"base-defense": 173,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_DAR_BITE",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_DAR_CRUNCH",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 1.2,
			"weight-avg": 33.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 4.1875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"718-2": {
			"dex-index": "718-2",
			"name": "Zygarde (Complete Forme)",
			"availability": {
				"in-game": "2023-07-20"
			},
			"category": "Order",
			"type": [ "Dragon", "Ground" ],
			"evolves-from": "718-1",
			"base-stamina": 389,
			"base-attack": 184,
			"base-defense": 207,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_DAR_BITE",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_DAR_CRUNCH",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 4.5,
			"weight-avg": 610,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.562,
				"wt-std-dev": 76.25,
				"xxs": [ 2.205, 2.25 ],
				"xs": [ 2.25, 3.375 ],
				"m": [ 3.375, 5.625 ],
				"xl": [ 5.625, 6.75 ],
				"xxl": [ 6.75, 6.975 ]
			}
		},
		"719": {
			"dex-index": "719",
			"name": "Diancie",
			"availability": {
				"in-game": "2023-08-04",
				"shadow": false
			},
			"category": "Jewel",
			"type": [ "Rock", "Fairy" ],
			"base-stamina": 137,
			"base-attack": 190,
			"base-defense": 285,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_FAI_MOONBLAST",
				"CHRG_ROC_POWERGEM"
			],
			"height-avg": 0.7,
			"weight-avg": 8.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.1,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"719-M": {
			"dex-index": "719-M",
			"name": "Mega Diancie",
			"form-data": {
				"base": "719",
				"type": "Mega"
			},
			"availability": {
				"in-game": "2023-08-04",
				"shadow": false
			},
			"height-avg": 1.1,
			"weight-avg": 27.8,
			"base-stamina": 137,
			"base-attack": 342,
			"base-defense": 235,
			"size-data": {
				"class": 1.55,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"720-0": {
			"dex-index": "720-0",
			"name": "Hoopa",
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_GHO_ASTONISH"
			],
			"showcase-baseline": "" // TODO
		},
		"720-C": {
			"dex-index": "720-C",
			"name": "Hoopa Confined",
			"name": "Hoopa Vincolato",
			"form-data": {
				"base": "720-0",
				"type": "idk"
			},
			"availability": {
				"in-game": "2021-09-05"
			},
			"category": "Mischief",
			"type": [ "Psychic", "Ghost" ],
			"base-stamina": 173,
			"base-attack": 261,
			"base-defense": 187,
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.5,
			"weight-avg": 9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"720-U": {
			"dex-index": "720-U",
			"name": "Hoopa Unbound",
			"name-ital": "Hoopa Libero",
			"form-data": {
				"base": "720-0",
				"type": "idk"
			},
			"availability": {
				"in-game": "2021-11-26"
			},
			"category": "Djinn",
			"type": [ "Psychic", "Dark" ],
			"base-stamina": 173,
			"base-attack": 311,
			"base-defense": 191,
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 6.5,
			"weight-avg": 490,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.8125,
				"wt-std-dev": 61.25,
				"xxs": [ 3.185, 3.25 ],
				"xs": [ 3.25, 4.875 ],
				"m": [ 4.875, 8.125 ],
				"xl": [ 8.125, 9.75 ],
				"xxl": [ 9.75, 10.075 ]
			}
		},
		"721": {
			"dex-index": "721",
			"name": "Volcanion",
			"availability": {
				"in-game": false
			},
			"category": "Steam",
			"type": [ "Fire", "Water" ],
			"base-stamina": 190,
			"base-attack": 252,
			"base-defense": 216,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FIR_INCINERATE",
				"FAST_WAT_WATERGUN",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_WAT_HYDROPUMP",
				"CHRG_FIR_OVERHEAT",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 1.7,
			"weight-avg": 195,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 24.375,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"722": {
			"dex-index": "722",
			"name": "Rowlet",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-01-06"
			},
			"category": "Grass Quill",
			"type": [ "Grass", "Flying" ],
			"evolves-into": [ "723" ],
			"base-stamina": 169,
			"base-attack": 102,
			"base-defense": 99,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_LEAFAGE",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 0.3,
			"weight-avg": 1.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.1875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"723": {
			"dex-index": "723",
			"name": "Dartrix",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-01-06"
			},
			"category": "Blade Quill",
			"type": [ "Grass", "Flying" ],
			"evolves-from": "722",
			"evolves-into": [ "724" ],
			"base-stamina": 186,
			"base-attack": 142,
			"base-defense": 139,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_LEAFAGE",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FLY_BRAVEBIRD"
			],
			"height-avg": 0.7,
			"weight-avg": 16,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"724": {
			"dex-index": "724",
			"name": "Decidueye",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-01-06"
			},
			"category": "Arrow Quill",
			"type": [ "Grass", "Ghost" ],
			"evolves-from": "723",
			"base-stamina": 186,
			"base-attack": 210,
			"base-defense": 179,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_LEAFAGE",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_GHO_SPIRITSHACKLE"
			],
			"special-charged-moves": [
				"CHRG_GRA_FRENZYPLANT"
			],
			"height-avg": 1.6,
			"weight-avg": 36.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 4.575,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"724-H": {
			"dex-index": "724-H",
			"name": "Hisuian Decidueye",
			"form-data": {
				"base": "724",
				"type": "Regional",
				"region": "Hisuian"
			},
			"availability": {
				"in-game": "2024-02-11",
				"shiny": "2024-02-11"
			},
			"type": [ "Grass", "Fighting" ],
			"base-stamina": 204,
			"base-attack": 213,
			"base-defense": 174,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_MAGICALLEAF",
				"FAST_PSY_PSYCHOCUT"
			],
			"charged-moves": [
				"CHRG_GRA_TRAILBLAZE",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FIG_AURASPHERE",
				"CHRG_FLY_AERIALACE",
				"CHRG_GHO_NIGHTSHADE"
			],
			"special-charged-moves": [ ],
			"height-avg": 1.6,
			"weight-avg": 37,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 4.575,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"725": {
			"dex-index": "725",
			"name": "Litten",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-03-16"
			},
			"category": "Fire Cat",
			"type": [ "Fire" ],
			"evolves-into": [ "726" ],
			"base-stamina": 128,
			"base-attack": 128,
			"base-defense": 79,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_SCRATCH",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.4,
			"weight-avg": 4.3,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.5375,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"726": {
			"dex-index": "726",
			"name": "Torracat",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-03-16"
			},
			"category": "Fire Cat",
			"type": [ "Fire" ],
			"evolves-from": "725",
			"evolves-into": [ "727" ],
			"base-stamina": 163,
			"base-attack": 174,
			"base-defense": 103,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.7,
			"weight-avg": 25,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 3.125,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"727": {
			"dex-index": "727",
			"name": "Incineroar",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-03-16"
			},
			"category": "Heel",
			"type": [ "Fire", "Dark" ],
			"evolves-from": "726",
			"base-stamina": 216,
			"base-attack": 214,
			"base-defense": 175,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_FIR_FIREFANG",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_FIR_FIREBLAST",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_DAR_DARKPULSE",
				"CHRG_FIR_BLAZEKICK",
				"CHRG_DAR_DARKESTLARIAT"
			],
			"special-charged-moves": [
				"CHRG_FIR_BLASTBURN"
			],
			"height-avg": 1.8,
			"weight-avg": 83,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 10.375,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"728": {
			"dex-index": "728",
			"name": "Popplio",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-08-31"
			},
			"category": "Sea Lion",
			"type": [ "Water" ],
			"evolves-into": [ "729" ],
			"base-stamina": 137,
			"base-attack": 120,
			"base-defense": 103,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_WATERPULSE",
				"CHRG_WAT_AQUATAIL"
			],
			"height-avg": 0.4,
			"weight-avg": 7.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.9375,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"729": {
			"dex-index": "729",
			"name": "Brionne",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-08-31"
			},
			"category": "Pop Star",
			"type": [ "Water" ],
			"evolves-from": "728",
			"evolves-into": [ "730" ],
			"base-stamina": 155,
			"base-attack": 168,
			"base-defense": 145,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_WATERPULSE",
				"CHRG_FAI_DISARMINGVOICE"
			],
			"height-avg": 0.6,
			"weight-avg": 17.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 2.1875,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"730": {
			"dex-index": "730",
			"name": "Primarina",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-08-31"
			},
			"category": "Soloist",
			"type": [ "Water", "Fairy" ],
			"evolves-from": "729",
			"base-stamina": 190,
			"base-attack": 232,
			"base-defense": 195,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_FAI_MOONBLAST",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_WAT_SPARKLINGARIA"
			],
			"special-charged-moves": [
				"CHRG_WAT_HYDROCANNON"
			],
			"height-avg": 1.8,
			"weight-avg": 44,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 5.5,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"731": {
			"dex-index": "731",
			"name": "Pikipek",
			"availability": {
				"in-game": "2022-03-01"
			},
			"category": "Woodpecker",
			"type": [ "Normal", "Flying" ],
			"evolves-into": [ "732" ],
			"base-stamina": 111,
			"base-attack": 136,
			"base-defense": 59,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_FLY_DRILLPECK",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_SKYATTACK"
			],
			"height-avg": 0.3,
			"weight-avg": 1.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.15,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"732": {
			"dex-index": "732",
			"name": "Trumbeak",
			"availability": {
				"in-game": "2022-03-01"
			},
			"category": "Bugle Beak",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "731",
			"evolves-into": [ "733" ],
			"base-stamina": 146,
			"base-attack": 159,
			"base-defense": 100,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_FLY_DRILLPECK",
				"CHRG_ROC_ROCKBLAST",
				"CHRG_FLY_SKYATTACK"
			],
			"height-avg": 0.6,
			"weight-avg": 14.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.85,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"733": {
			"dex-index": "733",
			"name": "Toucannon",
			"availability": {
				"in-game": "2022-03-01"
			},
			"category": "Cannon",
			"type": [ "Normal", "Flying" ],
			"evolves-from": "732",
			"base-stamina": 190,
			"base-attack": 222,
			"base-defense": 146,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_FIG_ROCKSMASH",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_FLY_DRILLPECK",
				"CHRG_ROC_ROCKBLAST",
				"CHRG_STE_FLASHCANNON"
			],
			"height-avg": 1.1,
			"weight-avg": 26,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 3.25,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"734": {
			"dex-index": "734",
			"name": "Yungoos",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2022-03-01"
			},
			"category": "Loitering",
			"type": [ "Normal" ],
			"evolves-into": [ "735" ],
			"base-stamina": 134,
			"base-attack": 122,
			"base-defense": 56,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERFANG",
				"CHRG_DAR_CRUNCH",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.4,
			"weight-avg": 6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.75,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"735": {
			"dex-index": "735",
			"name": "Gumshoos",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2022-03-01"
			},
			"category": "Stakeout",
			"type": [ "Normal" ],
			"evolves-from": "734",
			"base-stamina": 204,
			"base-attack": 194,
			"base-defense": 113,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TAKEDOWN",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERFANG",
				"CHRG_DAR_CRUNCH",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 0.7,
			"weight-avg": 14.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.775,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"736": {
			"dex-index": "736",
			"name": "Grubbin",
			"availability": {
				"in-game": "2022-08-10",
				"shiny": "2023-09-23"
			},
			"category": "Larva",
			"type": [ "Bug" ],
			"evolves-into": [ "737" ],
			"base-stamina": 132,
			"base-attack": 115,
			"base-defense": 85,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_NOR_VISEGRIP",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.4,
			"weight-avg": 4.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.55,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"737": {
			"dex-index": "737",
			"name": "Charjabug",
			"availability": {
				"in-game": "2022-08-10",
				"shiny": "2023-09-23"
			},
			"category": "Battery",
			"type": [ "Bug", "Electric" ],
			"evolves-from": "736",
			"evolves-into": [ "738" ],
			"base-stamina": 149,
			"base-attack": 145,
			"base-defense": 161,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_ELE_SPARK"
			],
			"special-fast-moves": [
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_ELE_DISCHARGE",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.5,
			"weight-avg": 10.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.3125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"738": {
			"dex-index": "738",
			"name": "Vikavolt",
			"availability": {
				"in-game": "2022-08-10",
				"shiny": "2023-09-23"
			},
			"category": "Stag Beetle",
			"type": [ "Bug", "Electric" ],
			"evolves-from": "737",
			"base-stamina": 184,
			"base-attack": 254,
			"base-defense": 158,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_ELE_SPARK",
				"FAST_GRO_MUDSLAP"
			],
			"special-fast-moves": [
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_ELE_DISCHARGE",
				"CHRG_DAR_CRUNCH",
				"CHRG_FLY_FLY"
			],
			"height-avg": 1.5,
			"weight-avg": 45,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"739": {
			"dex-index": "739",
			"name": "Crabrawler",
			"availability": {
				"in-game": "2022-12-06",
				"shiny": "2024-06-14"
			},
			"category": "Boxing",
			"type": [ "Fighting" ],
			"evolves-into": [ "740" ],
			"base-stamina": 132,
			"base-attack": 150,
			"base-defense": 104,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_FIG_POWERUPPUNCH",
				"CHRG_WAT_CRABHAMMER",
				"CHRG_DAR_PAYBACK",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 0.6,
			"weight-avg": 7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.875,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"740": {
			"dex-index": "740",
			"name": "Crabominable",
			"availability": {
				"in-game": "2022-12-06",
				"shiny": "2024-06-14"
			},
			"category": "Woolly Crab",
			"type": [ "Fighting", "Ice" ],
			"evolves-from": "739",
			"base-stamina": 219,
			"base-attack": 231,
			"base-defense": 138,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_WAT_BUBBLE"
			],
			"charged-moves": [
				"CHRG_FIG_POWERUPPUNCH",
				"CHRG_WAT_CRABHAMMER",
				"CHRG_DAR_PAYBACK",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 1.7,
			"weight-avg": 180,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2125,
				"wt-std-dev": 22.5,
				"xxs": [ 0.833, 0.85 ],
				"xs": [ 0.85, 1.275 ],
				"m": [ 1.275, 2.125 ],
				"xl": [ 2.125, 2.55 ],
				"xxl": [ 2.55, 2.635 ]
			}
		},
		"741-0": {
			"dex-index": "741-0",
			"name": "Oricorio",
			"availability": {
				"in-game": "2022-03-15",
				"shiny": "2024-02-13"
			},
			"category": "Dancing",
			"base-stamina": 181,
			"base-attack": 196,
			"base-defense": 145,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_AIRCUTTER",
				"CHRG_FLY_HURRICANE"
			],
			"height-avg": 0.6,
			"weight-avg": 3.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.425,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"741-F": {
			"dex-index": "741-F",
			"form-data": {
				"base": "741-0",
				"type": "type change",
				"form": "Baile Style",
				"form-ital": "Stile Flamenco"
			},
			"type": [ "Fire", "Flying" ]
		},
		"741-E": {
			"dex-index": "741-E",
			"form-data": {
				"base": "741-0",
				"type": "type change",
				"form": "Pom-Pom Style",
				"form-ital": "Stile Cheerdance"
			},
			"type": [ "Electric", "Flying" ]
		},
		"741-P": {
			"dex-index": "741-P",
			"form-data": {
				"base": "741-0",
				"type": "type change",
				"form": "Pa'u Style",
				"form-ital": "Stile Hula"
			},
			"type": [ "Psychic", "Flying" ]
		},
		"741-G": {
			"dex-index": "741-G",
			"form-data": {
				"base": "741-0",
				"type": "type change",
				"form": "Sensu Style",
				"form-ital": "Stile Buyo",
				"form-ital-display": "Stile Buyo" // TODO
			},
			"type": [ "Ghost", "Flying" ]
		},
		"742": {
			"dex-index": "742",
			"name": "Cutiefly",
			"availability": {
				"in-game": "2023-04-04",
				"shiny": "2024-01-13"
			},
			"category": "Bee Fly",
			"type": [ "Bug", "Fairy" ],
			"evolves-into": [ "743" ],
			"base-stamina": 120,
			"base-attack": 110,
			"base-defense": 81,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FAI_FAIRYWIND",
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_BUG_BUGBUZZ"
			],
			"height-avg": 0.1,
			"weight-avg": 0.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0125,
				"wt-std-dev": 0.025,
				"xxs": [ 0.049, 0.05 ],
				"xs": [ 0.05, 0.075 ],
				"m": [ 0.075, 0.125 ],
				"xl": [ 0.125, 0.15 ],
				"xxl": [ 0.15, 0.175 ]
			}
		},
		"743": {
			"dex-index": "743",
			"name": "Ribombee",
			"availability": {
				"in-game": "2023-04-04",
				"shiny": "2024-01-13"
			},
			"category": "Bee Fly",
			"type": [ "Bug", "Fairy" ],
			"evolves-from": "742",
			"base-stamina": 155,
			"base-attack": 198,
			"base-defense": 146,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FAI_FAIRYWIND",
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_FAI_DRAININGKISS"
			],
			"height-avg": 0.2,
			"weight-avg": 0.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.0625,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"744": {
			"dex-index": "744",
			"name": "Rockruff",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2022-03-01"
			},
			"category": "Puppy",
			"type": [ "Rock" ],
			"forms": [ "744-S" ],
			"evolves-into": [ "745-D", "745-N" ],
			"base-stamina": 128,
			"base-attack": 117,
			"base-defense": 78,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.5,
			"weight-avg": 9.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.15,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"744-S": {
			"dex-index": "744-S",
			"name": "Own Tempo Rockruff",
			"form-data": {
				"base": "744",
				"type": "evolution difference"
			},
			"availability": {
				"in-game": "2024-01-06",
				"shiny": "2024-01-06"
			},
			"image": "744",
			"evolves-into": [ "745-S" ]
		},
		"745-0": {
			"dex-index": "745-0",
			"name": "Lycanroc",
			"category": "Wolf",
			"type": [ "Rock" ],
			"evolves-from": "744",
			"dynamax-class": 2,
			"showcase-baseline": "" // TODO
		},
		"745-D": {
			"dex-index": "745-D",
			"form-data": {
				"base": "745-0",
				"type": "evolution difference",
				"form": "Midday Form",
				"form-ital": "Forma Giorno"
			},
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2022-03-01"
			},
			"base-stamina": 181,
			"base-attack": 231,
			"base-defense": 140,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_GRO_DRILLRUN",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.8,
			"weight-avg": 25,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.125,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"745-N": {
			"dex-index": "745-N",
			"form-data": {
				"base": "745-0",
				"type": "evolution difference",
				"form": "Midnight Form",
				"form-ital": "Forma Notte"
			},
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2022-03-01"
			},
			"evolves-from": "744",
			"base-stamina": 198,
			"base-attack": 218,
			"base-defense": 152,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_PSY_PSYCHICFANGS",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.1,
			"weight-avg": 25,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 3.125,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"745-S": {
			"dex-index": "745-S",
			"form-data": {
				"base": "745-0",
				"type": "evolution difference",
				"form": "Dusk Form",
				"form-ital": "Forma Crepuscolo"
			},
			"availability": {
				"in-game": "2024-01-06",
				"shiny": "2024-01-06"
			},
			"evolves-from": "744-S",
			"base-stamina": 181,
			"base-attack": 234,
			"base-defense": 139,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_FIG_COUNTER",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_STE_IRONHEAD",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.8,
			"weight-avg": 25,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.125,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"746-0": {
			"dex-index": "746-0",
			"name": "Wishiwashi",
			"availability": {
				"in-game": false
			},
			"category": "Small Fry",
			"type": [ "Water" ],
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_WAT_WATERFALL",
				"FAST_STE_IRONTAIL"
			],
			"charged-moves": [
				"CHRG_WAT_BRINE",
				"CHRG_WAT_SURF",
				"CHRG_WAT_AQUATAIL"
			],
			"showcase-baseline": "" // TODO
		},
		"746-O": {
			"dex-index": "746-O",
			"form-data": {
				"base": "746-0",
				"type": "battle",
				"form": "Solo Form",
				"form-ital": "Forma Individuale"
			},
			"base-stamina": 128,
			"base-attack": 46,
			"base-defense": 43,
			"height-avg": 0.2,
			"weight-avg": 0.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.0375,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.4 ]
			}
		},
		"746-S": {
			"dex-index": "746-S",
			"form-data": {
				"base": "746-0",
				"type": "battle",
				"form": "School Form",
				"form-ital": "Forma Banca"
			},
			"base-stamina": 128,
			"base-attack": 255,
			"base-defense": 242,
			"height-avg": 8.2,
			"weight-avg": 78.6,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 1.025,
				"wt-std-dev": 9.825,
				"xxs": [ 4.018, 4.1 ],
				"xs": [ 4.1, 6.15 ],
				"m": [ 6.15, 10.25 ],
				"xl": [ 10.25, 12.3 ],
				"xxl": [ 12.3, 16.4 ]
			}
		},
		"747": {
			"dex-index": "747",
			"name": "Mareanie",
			"availability": {
				"in-game": "2022-09-27",
				"shiny": "2024-05-23"
			},
			"category": "Brutal Star",
			"type": [ "Poison", "Water" ],
			"evolves-into": [ "748" ],
			"base-stamina": 137,
			"base-attack": 98,
			"base-defense": 110,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_WAT_BRINE",
				"CHRG_POI_GUNKSHOT",
				"CHRG_POI_SLUDGEWAVE"
			],
			"height-avg": 0.4,
			"weight-avg": 8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"748": {
			"dex-index": "748",
			"name": "Toxapex",
			"availability": {
				"in-game": "2022-09-27",
				"shiny": "2024-05-23"
			},
			"category": "Brutal Star",
			"type": [ "Poison", "Water" ],
			"evolves-from": "747",
			"base-stamina": 137,
			"base-attack": 114,
			"base-defense": 273,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_WAT_BRINE",
				"CHRG_POI_GUNKSHOT",
				"CHRG_POI_SLUDGEWAVE"
			],
			"height-avg": 0.7,
			"weight-avg": 14.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.8125,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"749": {
			"dex-index": "749",
			"name": "Mudbray",
			"availability": {
				"in-game": "2025-03-29",
				"shiny": "2025-03-29"
			},
			"category": "Donkey",
			"type": [ "Ground" ],
			"evolves-into": [ "750" ],
			"base-stamina": 172,
			"base-attack": 175,
			"base-defense": 121,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_GRO_BULLDOZE",
				"CHRG_NOR_BODYSLAM",
				"CHRG_GRO_EARTHQUAKE"
			],
			"height-avg": 1,
			"weight-avg": 110,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 13.75,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"750": {
			"dex-index": "750",
			"name": "Mudsdale",
			"availability": {
				"in-game": "2025-03-29",
				"shiny": "2025-03-29"
			},
			"category": "Draft Horse",
			"type": [ "Ground" ],
			"evolves-from": "749",
			"base-stamina": 225,
			"base-attack": 214,
			"base-defense": 174,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_GRO_BULLDOZE",
				"CHRG_NOR_BODYSLAM",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_STE_HEAVYSLAM"
			],
			"height-avg": 2.5,
			"weight-avg": 920,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 115,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 3.875 ]
			}
		},
		"751": {
			"dex-index": "751",
			"name": "Dewpider",
			"availability": {
				"in-game": "2022-05-12",
				"shiny": "2023-08-04"
			},
			"category": "Water Bubble",
			"type": [ "Water", "Bug" ],
			"evolves-into": [ "752" ],
			"base-stamina": 116,
			"base-attack": 72,
			"base-defense": 117,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_INFESTATION",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_PSY_MIRRORCOAT"
			],
			"height-avg": 0.3,
			"weight-avg": 4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.5,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"752": {
			"dex-index": "752",
			"name": "Araquanid",
			"availability": {
				"in-game": "2022-05-12",
				"shiny": "2023-08-04"
			},
			"category": "Water Bubble",
			"type": [ "Water", "Bug" ],
			"evolves-from": "751",
			"base-stamina": 169,
			"base-attack": 126,
			"base-defense": 219,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_INFESTATION",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_WAT_BUBBLEBEAM",
				"CHRG_PSY_MIRRORCOAT",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 1.8,
			"weight-avg": 82,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 10.25,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"753": {
			"dex-index": "753",
			"name": "Fomantis",
			"availability": {
				"in-game": "2022-03-22",
				"shiny": "2023-06-16"
			},
			"category": "Sickle Grass",
			"type": [ "Grass" ],
			"evolves-into": [ "754" ],
			"base-stamina": 120,
			"base-attack": 100,
			"base-defense": 64,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_BUG_FURYCUTTER",
				"FAST_GRA_LEAFAGE"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.3,
			"weight-avg": 1.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.1875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.6 ]
			}
		},
		"754": {
			"dex-index": "754",
			"name": "Lurantis",
			"availability": {
				"in-game": "2022-03-22",
				"shiny": "2023-06-16"
			},
			"category": "Bloom Sickle",
			"type": [ "Grass" ],
			"evolves-from": "753",
			"base-stamina": 172,
			"base-attack": 192,
			"base-defense": 169,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_BUG_FURYCUTTER",
				"FAST_GRA_LEAFAGE"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_GRA_LEAFSTORM",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_BUG_XSCISSOR",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.9,
			"weight-avg": 18.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 2.3125,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"755": {
			"dex-index": "755",
			"name": "Morelull",
			"availability": {
				"in-game": "2022-10-14",
				"shiny": "2023-11-07"
			},
			"category": "Illuminating",
			"type": [ "Grass", "Fairy" ],
			"evolves-into": [ "756" ],
			"base-stamina": 120,
			"base-attack": 108,
			"base-defense": 119,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.2,
			"weight-avg": 1.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.1875,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.4 ]
			}
		},
		"756": {
			"dex-index": "756",
			"name": "Shiinotic",
			"availability": {
				"in-game": "2022-10-14",
				"shiny": "2023-11-07"
			},
			"category": "Illuminating",
			"type": [ "Grass", "Fairy" ],
			"evolves-from": "755",
			"base-stamina": 155,
			"base-attack": 154,
			"base-defense": 168,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_FAI_MOONBLAST",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 1,
			"weight-avg": 11.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.125,
				"wt-std-dev": 1.4375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 2 ]
			}
		},
		"757-0": {
			"dex-index": "757-0",
			"name": "Salandit",
			"availability": {
				"in-game": "2022-04-03"
			},
			"category": "Toxic Lizard",
			"type": [ "Poison", "Fire" ],
			"base-stamina": 134,
			"base-attack": 136,
			"base-defense": 80,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.6,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"757-M": {
			"dex-index": "757-M",
			"form-data": {
				"base": "757-0",
				"type": "Gender",
				"form": "Male"
			}
		},
		"757-F": {
			"dex-index": "757-F",
			"form-data": {
				"base": "757-0",
				"type": "Gender",
				"form": "Female"
			},
			"evolves-into": [ "758" ]
		},
		"758": {
			"dex-index": "758",
			"name": "Salazzle",
			"availability": {
				"in-game": "2022-04-03"
			},
			"category": "Toxic Lizard",
			"type": [ "Poison", "Fire" ],
			"evolves-from": "757-F",
			"base-stamina": 169,
			"base-attack": 228,
			"base-defense": 130,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_INCINERATE",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_POI_POISONFANG",
				"CHRG_FIR_FIREBLAST",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_POI_SLUDGEWAVE"
			],
			"height-avg": 1.2,
			"weight-avg": 22.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.775,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"759": {
			"dex-index": "759",
			"name": "Stufful",
			"availability": {
				"in-game": "2022-04-23",
				"shiny": "2022-04-23"
			},
			"category": "Flailing",
			"type": [ "Normal", "Fighting" ],
			"evolves-into": [ "760" ],
			"base-stamina": 172,
			"base-attack": 136,
			"base-defense": 95,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_FIG_SUPERPOWER",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_NOR_STOMP"
			],
			"height-avg": 0.5,
			"weight-avg": 6.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.85,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"760": {
			"dex-index": "760",
			"name": "Bewear",
			"availability": {
				"in-game": "2022-04-23",
				"shiny": "2022-04-23"
			},
			"category": "Strong Arm",
			"type": [ "Normal", "Fighting" ],
			"evolves-from": "759",
			"base-stamina": 260,
			"base-attack": 226,
			"base-defense": 141,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIG_LOWKICK",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_FIG_SUPERPOWER",
				"CHRG_DAR_PAYBACK",
				"CHRG_NOR_STOMP"
			],
			"special-charged-moves": [
				"CHRG_FIG_DRAINPUNCH"
			],
			"height-avg": 2.1,
			"weight-avg": 135,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2625,
				"wt-std-dev": 16.875,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.255 ]
			}
		},
		"761": {
			"dex-index": "761",
			"name": "Bounsweet",
			"availability": {
				"in-game": "2023-04-20",
				"shiny": "2024-05-19"
			},
			"category": "Fruit",
			"type": [ "Grass" ],
			"evolves-into": [ "762" ],
			"base-stamina": 123,
			"base-attack": 55,
			"base-defense": 69,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FAI_DRAININGKISS"
			],
			"height-avg": 0.3,
			"weight-avg": 3.2,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.4,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.6 ]
			}
		},
		"762": {
			"dex-index": "762",
			"name": "Steenee",
			"availability": {
				"in-game": "2023-04-20",
				"shiny": "2024-05-19"
			},
			"category": "Fruit",
			"type": [ "Grass" ],
			"evolves-from": "761",
			"evolves-into": [ "763" ],
			"base-stamina": 141,
			"base-attack": 78,
			"base-defense": 94,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FAI_DRAININGKISS",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"height-avg": 0.7,
			"weight-avg": 8.2,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.025,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.4 ]
			}
		},
		"763": {
			"dex-index": "763",
			"name": "Tsareena",
			"availability": {
				"in-game": "2023-04-20",
				"shiny": "2024-05-19"
			},
			"category": "Fruit",
			"type": [ "Grass" ],
			"evolves-from": "762",
			"base-stamina": 176,
			"base-attack": 222,
			"base-defense": 195,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_FAI_CHARM",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_FAI_DRAININGKISS",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_NOR_STOMP",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"special-charged-moves": [
				"CHRG_FIG_HIGHJUMPKICK"
			],
			"height-avg": 1.2,
			"weight-avg": 21.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.675,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"764": {
			"dex-index": "764",
			"name": "Comfey",
			"availability": {
				"in-game": "2022-03-01"
			},
			"category": "Posy Picker",
			"type": [ "Fairy" ],
			"base-stamina": 139,
			"base-attack": 165,
			"base-defense": 215,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_WAT_HIDDENPOWER"
			],
			"charged-moves": [
				"CHRG_GRA_PETALBLIZZARD",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_FAI_DRAININGKISS"
			],
			"height-avg": 0.1,
			"weight-avg": 0.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0125,
				"wt-std-dev": 0.0375,
				"xxs": [ 0.049, 0.05 ],
				"xs": [ 0.05, 0.075 ],
				"m": [ 0.075, 0.125 ],
				"xl": [ 0.125, 0.15 ],
				"xxl": [ 0.15, 0.2 ]
			}
		},
		"765": {
			"dex-index": "765",
			"name": "Oranguru",
			"availability": {
				"in-game": "2022-04-20",
				"shiny": "2023-08-26"
			},
			"category": "Sage",
			"type": [ "Normal", "Psychic" ],
			"base-stamina": 207,
			"base-attack": 168,
			"base-defense": 192,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_NOR_YAWN"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_DAR_FOULPLAY",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_GRA_TRAILBLAZE",
				"CHRG_DAR_BRUTALSWING"
			],
			"height-avg": 1.5,
			"weight-avg": 76,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 9.5,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"766": {
			"dex-index": "766",
			"name": "Passimian",
			"availability": {
				"in-game": "2023-08-11",
				"shiny": "2024-09-22"
			},
			"category": "Teamwork",
			"type": [ "Fighting" ],
			"base-stamina": 225,
			"base-attack": 222,
			"base-defense": 160,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_FIG_ROCKSMASH",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_DAR_BRUTALSWING"
			],
			"height-avg": 2,
			"weight-avg": 82.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 10.35,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"767": {
			"dex-index": "767",
			"name": "Wimpod",
			"availability": {
				"in-game": "2022-06-16",
				"shiny": "2024-04-04"
			},
			"category": "Turn Tail",
			"type": [ "Bug", "Water" ],
			"evolves-into": [ "768" ],
			"base-stamina": 93,
			"base-attack": 67,
			"base-defense": 74,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ"
			],
			"height-avg": 0.5,
			"weight-avg": 12,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.5,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"768": {
			"dex-index": "768",
			"name": "Golisopod",
			"availability": {
				"in-game": "2022-06-16",
				"shiny": "2024-04-04"
			},
			"category": "Hard Scale",
			"type": [ "Bug", "Water" ],
			"evolves-from": "767",
			"base-stamina": 181,
			"base-attack": 218,
			"base-defense": 226,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_FURYCUTTER",
				"FAST_STE_METALCLAW",
				"FAST_WAT_WATERFALL",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_WAT_AQUAJET",
				"CHRG_FLY_AERIALACE",
				"CHRG_WAT_LIQUIDATION",
				"CHRG_WAT_RAZORSHELL"
			],
			"height-avg": 2,
			"weight-avg": 108,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 13.5,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"769": {
			"dex-index": "769",
			"name": "Sandygast",
			"category": "Sand Heap",
			"type": [ "Ghost", "Ground" ],
			"evolves-into": [ "770" ],
			"base-stamina": 146,
			"base-attack": 120,
			"base-defense": 118,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GRO_MUDSHOT",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_SANDTOMB",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 0.5,
			"weight-avg": 70,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 8.75,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"770": {
			"dex-index": "770",
			"name": "Palossand",
			"category": "Sand Castle",
			"type": [ "Ghost", "Ground" ],
			"evolves-from": "769",
			"base-stamina": 198,
			"base-attack": 178,
			"base-defense": 178,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GRO_MUDSHOT",
				"FAST_GRO_SANDATTACK"
			],
			"charged-moves": [
				"CHRG_GRO_SANDTOMB",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_GRO_SCORCHINGSANDS"
			],
			"height-avg": 1.3,
			"weight-avg": 250,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 31.25,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"771": {
			"dex-index": "771",
			"name": "Pyukumuku",
			"availability": {
				"in-game": false
			},
			"category": "Sea Cucumber",
			"type": [ "Water" ],
			"base-stamina": 146,
			"base-attack": 97,
			"base-defense": 224,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_PSY_MIRRORCOAT"
			],
			"height-avg": 0.3,
			"weight-avg": 1.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.15,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"772": {
			"dex-index": "772",
			"name": "Type: Null",
			"availability": {
				"in-game": false
			},
			"category": "Synthetic",
			"type": [ "Normal" ],
			"evolves-into": [ "773" ],
			"base-stamina": 216,
			"base-attack": 184,
			"base-defense": 184,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_NOR_TRIATTACK",
				"CHRG_STE_IRONHEAD",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 1.9,
			"weight-avg": 120.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 15.0625,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"773": {
			"dex-index": "773",
			"name": "Silvally",
			"availability": {
				"in-game": false
			},
			"category": "Synthetic",
			"type": [ "Normal" ],
			"evolves-from": "772",
			"base-stamina": 216,
			"base-attack": 198,
			"base-defense": 198,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_NOR_TRIATTACK",
				"CHRG_STE_IRONHEAD",
				"CHRG_FLY_AERIALACE",
				"CHRG_BUG_XSCISSOR"
			],
			"height-avg": 2.3,
			"weight-avg": 100.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2875,
				"wt-std-dev": 12.5625,
				"xxs": [ 1.127, 1.15 ],
				"xs": [ 1.15, 1.725 ],
				"m": [ 1.725, 2.875 ],
				"xl": [ 2.875, 3.45 ],
				"xxl": [ 3.45, 3.565 ]
			}
		},
		"773-BUG": {
			"dex-index": "773-BUG",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Bug Memory",
				"form-ital": "ROM Coleottero"
			},
			"type": [ "Bug" ]
		},
		"773-DAR": {
			"dex-index": "773-DAR",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Dark Memory",
				"form-ital": "ROM Buio"
			},
			"type": [ "Dark" ]
		},
		"773-DRA": {
			"dex-index": "773-DRA",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Dragon Memory",
				"form-ital": "ROM Drago"
			},
			"type": [ "Dragon" ]
		},
		"773-ELE": {
			"dex-index": "773-ELE",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Electric Memory",
				"form-ital": "ROM Elettro"
			},
			"type": [ "Electric" ]
		},
		"773-FAI": {
			"dex-index": "773-FAI",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Fairy Memory",
				"form-ital": "ROM Folletto"
			},
			"type": [ "Fairy" ]
		},
		"773-FIG": {
			"dex-index": "773-FIG",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Fighting Memory",
				"form-ital": "ROM Lotta"
			},
			"type": [ "Fighting" ]
		},
		"773-FIR": {
			"dex-index": "773-FIR",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Fire Memory",
				"form-ital": "ROM Fuoco"
			},
			"type": [ "Fire" ]
		},
		"773-FLY": {
			"dex-index": "773-FLY",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Flying Memory",
				"form-ital": "ROM Volante"
			},
			"type": [ "Flying" ]
		},
		"773-GHO": {
			"dex-index": "773-GHO",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Ghost Memory",
				"form-ital": "ROM Spettro"
			},
			"type": [ "Ghost" ]
		},
		"773-GRA": {
			"dex-index": "773-GRA",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Grass Memory",
				"form-ital": "ROM Erba"
			},
			"type": [ "Grass" ]
		},
		"773-GRO": {
			"dex-index": "773-GRO",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Ground Memory",
				"form-ital": "ROM Terra"
			},
			"type": [ "Ground" ]
		},
		"773-ICE": {
			"dex-index": "773-ICE",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Ice Memory",
				"form-ital": "ROM Ghiaccio"
			},
			"type": [ "Ice" ]
		},
		"773-POI": {
			"dex-index": "773-POI",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Poison Memory",
				"form-ital": "ROM Veleno"
			},
			"type": [ "Poison" ]
		},
		"773-PSY": {
			"dex-index": "773-PSY",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Psychic Memory",
				"form-ital": "ROM Psico"
			},
			"type": [ "Psychic" ]
		},
		"773-ROC": {
			"dex-index": "773-ROC",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Rock Memory",
				"form-ital": "ROM Roccia"
			},
			"type": [ "Rock" ]
		},
		"773-STE": {
			"dex-index": "773-STE",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Steel Memory",
				"form-ital": "ROM Acciaio"
			},
			"type": [ "Steel" ]
		},
		"773-WAT": {
			"dex-index": "773-WAT",
			"form-data": {
				"base": "773",
				"type": "type change",
				"form": "Water Memory",
				"form-ital": "ROM Acqua"
			},
			"type": [ "Water" ]
		},
		"774-0": {
			"dex-index": "774-0",
			"name": "Minior",
			"availability": {
				"in-game": false
			},
			"category": "Meteor",
			"type": [ "Rock", "Flying" ],
			"image": "774-M",
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_ROLLOUT",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_ROC_POWERGEM",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FLY_ACROBATICS"
			],
			"showcase-baseline": "" // TODO
		},
		"774-M": {
			"dex-index": "774-M",
			"form-data": {
				"base": "774-0",
				"type": "idk",
				"form": "Meteor Form",
				"form-ital": "Forma Meteora"
			},
			"base-stamina": 155,
			"base-attack": 116,
			"base-defense": 194,
			"height-avg": 2.3,
			"weight-avg": 100.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 5,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"774-C": {
			"dex-index": "774-C",
			"form-data": {
				"base": "774-0",
				"type": "idk",
				"form": "Core Form",
				"form-ital": "Forma Nucleo"
			},
			"variants": [
				"Red", "Orange", "Yellow", "Green",
				"Blue", "Indigo", "Violet"
			],
			"variants-ital": [
				"Rosso", "Arancione", "Giallo", "Verde",
				"Azzurro", "Indaco", "Violetto"
			],
			"image": "744-C-Red",
			"base-stamina": 155,
			"base-attack": 218,
			"base-defense": 131,
			"charged-moves": [
				"CHRG_ROC_POWERGEM",
				"CHRG_ROC_ANCIENTPOWER",
				"CHRG_FLY_ACROBATICS"
			],
			"height-avg": 0.3,
			"weight-avg": 40,
			"size-data": {
				"class":  1.75,
                "ht-std-dev": 0.0375,
                "wt-std-dev": 0.0375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"775": {
			"dex-index": "775",
			"name": "Komala",
			"availability": {
				"in-game": "2023-07-15",
				"shiny": "2024-06-07"
			},
			"category": "Drowsing",
			"type": [ "Normal" ],
			"base-stamina": 163,
			"base-attack": 216,
			"base-defense": 165,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_ROLLOUT",
				"FAST_NOR_YAWN"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRO_BULLDOZE",
				"CHRG_DAR_PAYBACK"
			],
			"height-avg": 0.4,
			"weight-avg": 19.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 2.4875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"776": {
			"dex-index": "776",
			"name": "Turtonator",
			"availability": {
				"in-game": "2023-06-29",
				"shiny": "2023-06-29"
			},
			"category": "Blast Turtle",
			"type": [ "Fire", "Dragon" ],
			"base-stamina": 155,
			"base-attack": 165,
			"base-defense": 215,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIR_FIRESPIN",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FIR_OVERHEAT",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_STE_FLASHCANNON"
			],
			"height-avg": 2,
			"weight-avg": 212,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 26.5,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"777": {
			"dex-index": "777",
			"name": "Togedemaru",
			"availability": {
				"in-game": "2022-09-16",
				"shiny": "2024-07-25"
			},
			"category": "Roly-Poly",
			"type": [ "Electric", "Steel" ],
			"base-stamina": 163,
			"base-attack": 190,
			"base-defense": 145,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_BUG_FELLSTINGER",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_STE_GYROBALL"
			],
			"height-avg": 0.3,
			"weight-avg": 3.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.4125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"778": {
			"dex-index": "778",
			"name": "Mimikyu",
			"availability": {
				"in-game": false
			},
			"category": "Disguise",
			"type": [ "Ghost", "Fairy" ],
			"base-stamina": 146,
			"base-attack": 177,
			"base-defense": 199,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_SHADOWCLAW",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 0.3,
			"weight-avg": 3.3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.0875,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"778-B": {
			"dex-index": "778-B",
			"name": "Mimikyu (Busted Form)",
			"form-data": {
				"base": "778",
				"type": "idk"
			},
			"availability": {
			}
		},
		"779": {
			"dex-index": "779",
			"name": "Bruxish",
			"availability": {
				"in-game": "2023-03-08"
			},
			"category": "Gnash Teeth",
			"type": [ "Water", "Psychic" ],
			"base-stamina": 169,
			"base-attack": 208,
			"base-defense": 145,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_PSY_CONFUSION",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHICFANGS",
				"CHRG_WAT_AQUATAIL",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.9,
			"weight-avg": 19,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 2.375,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"780": {
			"dex-index": "780",
			"name": "Drampa",
			"availability": {
				"in-game": "2024-02-05",
				"shiny": "2024-02-05"
			},
			"category": "Placid",
			"type": [ "Normal", "Dragon" ],
			"base-stamina": 186,
			"base-attack": 231,
			"base-defense": 164,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_PSY_EXTRASENSORY"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_FLY_FLY"
			],
			"height-avg": 3,
			"weight-avg": 185,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.375,
				"wt-std-dev": 23.125,
				"xxs": [ 1.47, 1.5 ],
				"xs": [ 1.5, 2.25 ],
				"m": [ 2.25, 3.75 ],
				"xl": [ 3.75, 4.5 ],
				"xxl": [ 4.5, 4.65 ]
			}
		},
		"781": {
			"dex-index": "781",
			"name": "Dhelmise",
			"availability": {
				"in-game": false
			},
			"category": "Sea Creeper",
			"type": [ "Ghost", "Grass" ],
			"base-stamina": 172,
			"base-attack": 233,
			"base-defense": 179,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_GRA_POWERWHIP",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_STE_HEAVYSLAM"
			],
			"height-avg": 3.9,
			"weight-avg": 210,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.4875,
				"wt-std-dev": 26.25,
				"xxs": [ 1.911, 1.95 ],
				"xs": [ 1.95, 2.925 ],
				"m": [ 2.925, 4.875 ],
				"xl": [ 4.875, 5.85 ],
				"xxl": [ 5.85, 7.8 ]
			}
		},
		"782": {
			"dex-index": "782",
			"name": "Jangmo-o",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-07-13"
			},
			"category": "Scaly",
			"type": [ "Dragon" ],
			"evolves-into": [ "783" ],
			"base-stamina": 128,
			"base-attack": 102,
			"base-defense": 108,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_DRA_DRAGONPULSE"
			],
			"height-avg": 0.6,
			"weight-avg": 29.7,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 3.7125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"783": {
			"dex-index": "783",
			"name": "Hakamo-o",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-07-13"
			},
			"category": "Scaly",
			"type": [ "Dragon", "Fighting" ],
			"evolves-from": "782",
			"evolves-into": [ "784" ],
			"base-stamina": 146,
			"base-attack": 145,
			"base-defense": 162,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_DRA_DRAGONPULSE"
			],
			"height-avg": 1.2,
			"weight-avg": 47,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 5.875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"784": {
			"dex-index": "784",
			"name": "Kommo-o",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2024-07-13"
			},
			"category": "Scaly",
			"type": [ "Dragon", "Fighting" ],
			"evolves-from": "783",
			"base-stamina": 181,
			"base-attack": 222,
			"base-defense": 240,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_NOR_BOOMBURST",
				"CHRG_FIG_BRICKBREAK"
			],
			"height-avg": 1.6,
			"weight-avg": 78.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 9.775,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"785": {
			"dex-index": "785",
			"name": "Tapu Koko",
			"availability": {
				"in-game": "2022-03-01",
				"shiny": "2023-01-25"
			},
			"category": "Land Spirit",
			"type": [ "Electric", "Fairy" ],
			"base-stamina": 172,
			"base-attack": 250,
			"base-defense": 181,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ELE_VOLTSWITCH",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_ELE_THUNDER"
			],
			"special-charged-move": [
				"CHRG_FAI_NATURESMADNESS"
			],
			"height-avg": 1.8,
			"weight-avg": 20.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 2.5625,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"786": {
			"dex-index": "786",
			"name": "Tapu Lele",
			"availability": {
				"in-game": "2022-03-22",
				"shiny": "2023-02-08"
			},
			"category": "Land Spirit",
			"type": [ "Psychic", "Fairy" ],
			"base-stamina": 172,
			"base-attack": 259,
			"base-defense": 208,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_FAI_MOONBLAST",
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_FAI_DRAININGKISS"
			],
			"special-charged-move": [
				"CHRG_FAI_NATURESMADNESS"
			],
			"height-avg": 1.2,
			"weight-avg": 18.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.325,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"787": {
			"dex-index": "787",
			"name": "Tapu Bulu",
			"availability": {
				"in-game": "2022-04-12",
				"shiny": "2023-04-17"
			},
			"category": "Land Spirit",
			"type": [ "Grass", "Fairy" ],
			"base-stamina": 172,
			"base-attack": 249,
			"base-defense": 215,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_GRA_BULLETSEED",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_BUG_MEGAHORN",
				"CHRG_GRA_SOLARBEAM"
			],
			"special-charged-move": [
				"CHRG_FAI_NATURESMADNESS"
			],
			"height-avg": 1.9,
			"weight-avg": 45.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 5.6875,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"788": {
			"dex-index": "788",
			"name": "Tapu Fini",
			"availability": {
				"in-game": "2022-05-10",
				"shiny": "2023-05-09"
			},
			"category": "Land Spirit",
			"type": [ "Water", "Fairy" ],
			"base-stamina": 172,
			"base-attack": 189,
			"base-defense": 254,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_WAT_HIDDENPOWER"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_FAI_MOONBLAST",
				"CHRG_ICE_ICEBEAM",
				"CHRG_WAT_HYDROPUMP"
			],
			"special-charged-move": [
				"CHRG_FAI_NATURESMADNESS"
			],
			"height-avg": 1.3,
			"weight-avg": 21.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 2.65,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"789": {
			"dex-index": "789",
			"name": "Cosmog",
			"availability": {
				"in-game": "2022-09-01"
			},
			"category": "Nebula",
			"type": [ "Psychic" ],
			"evolves-into": [ "790" ],
			"base-stamina": 125,
			"base-attack": 54,
			"base-defense": 57,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.2,
			"weight-avg": 0.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.0125,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.31 ]
			}
		},
		"790": {
			"dex-index": "790",
			"name": "Cosmoem",
			"availability": {
				"in-game": "2022-10-05"
			},
			"category": "Protostar",
			"type": [ "Psychic" ],
			"evolves-from": "789",
			"evolves-into": [ "791", "792" ],
			"base-stamina": 125,
			"base-attack": 54,
			"base-defense": 242,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.1,
			"weight-avg": 999.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0125,
				"wt-std-dev": 124.9875,
				"xxs": [ 0.049, 0.05 ],
				"xs": [ 0.05, 0.075 ],
				"m": [ 0.075, 0.125 ],
				"xl": [ 0.125, 0.15 ],
				"xxl": [ 0.15, 0.155 ]
			}
		},
		"791": {
			"dex-index": "791",
			"name": "Solgaleo",
			"availability": {
				"in-game": "2022-11-23"
			},
			"category": "Sunne",
			"type": [ "Psychic", "Steel" ],
			"evolves-from": "790",
			"base-stamina": 264,
			"base-attack": 255,
			"base-defense": 191,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FIR_FIRESPIN"
			],
			"charged-moves": [
				"CHRG_STE_IRONHEAD",
				"CHRG_PSY_PSYCHICFANGS",
				"CHRG_GRA_SOLARBEAM",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 3.4,
			"weight-avg": 230,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.425,
				"wt-std-dev": 28.75,
				"xxs": [ 1.666, 1.7 ],
				"xs": [ 1.7, 2.55 ],
				"m": [ 2.55, 4.25 ],
				"xl": [ 4.25, 5.1 ],
				"xxl": [ 5.1, 5.27 ]
			}
		},
		"792": {
			"dex-index": "792",
			"name": "Lunala",
			"availability": {
				"in-game": "2022-11-23"
			},
			"category": "Moone",
			"type": [ "Psychic", "Ghost" ],
			"evolves-from": "790",
			"base-stamina": 264,
			"base-attack": 255,
			"base-defense": 191,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_PSYCHIC",
				"CHRG_FAI_MOONBLAST",
				"CHRG_PSY_FUTURESIGHT"
			],
			"height-avg": 4,
			"weight-avg": 120,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.5,
				"wt-std-dev": 15,
				"xxs": [ 1.96, 2 ],
				"xs": [ 2, 3 ],
				"m": [ 3, 5 ],
				"xl": [ 5, 6 ],
				"xxl": [ 6, 6.2 ]
			}
		},
		"793": {
			"dex-index": "793",
			"name": "Nihilego",
			"availability": {
				"in-game": "2022-06-05",
				"shiny": "2023-06-15"
			},
			"category": "Parasite",
			"type": [ "Rock", "Poison" ],
			"base-stamina": 240,
			"base-attack": 249,
			"base-defense": 210,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_POI_ACID",
				"FAST_NOR_POUND",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_ROC_POWERGEM",
				"CHRG_POI_GUNKSHOT",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 1.2,
			"weight-avg": 55.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 6.9375,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"794": {
			"dex-index": "794",
			"name": "Buzzwole",
			"availability": {
				"in-game": "2022-07-22",
				"shiny": "2024-07-12"
			},
			"category": "Swollen",
			"type": [ "Bug", "Fighting" ],
			"base-stamina": 216,
			"base-attack": 236,
			"base-defense": 196,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_FIG_POWERUPPUNCH",
				"CHRG_BUG_FELLSTINGER",
				"CHRG_BUG_LUNGE",
				"CHRG_FIG_SUPERPOWER"
			],
			"height-avg": 2.4,
			"weight-avg": 333.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3,
				"wt-std-dev": 41.7,
				"xxs": [ 1.176, 1.2 ],
				"xs": [ 1.2, 1.8 ],
				"m": [ 1.8, 3 ],
				"xl": [ 3, 3.6 ],
				"xxl": [ 3.6, 3.72 ]
			}
		},
		"795": {
			"dex-index": "795",
			"name": "Pheromosa",
			"availability": {
				"in-game": "2022-07-01",
				"shiny": "2024-07-12"
			},
			"category": "Lissome",
			"type": [ "Bug", "Fighting" ],
			"base-stamina": 174,
			"base-attack": 316,
			"base-defense": 85,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_FIG_LOWKICK"
			],
			"charged-moves": [
				"CHRG_FIG_FOCUSBLAST",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_BUG_LUNGE",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"height-avg": 1.8,
			"weight-avg": 25,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 3.125,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"796": {
			"dex-index": "796",
			"name": "Xurkitree",
			"availability": {
				"in-game": "2022-08-05",
				"shiny": "2024-07-12"
			},
			"category": "Glowing",
			"type": [ "Electric" ],
			"base-stamina": 195,
			"base-attack": 330,
			"base-defense": 144,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_ELE_SPARK"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_THUNDER",
				"CHRG_GRA_POWERWHIP",
				"CHRG_FAI_DAZZLINGGLEAM"
			],
			"height-avg": 3.8,
			"weight-avg": 100,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.475,
				"wt-std-dev": 12.5,
				"xxs": [ 1.862, 1.9 ],
				"xs": [ 1.9, 2.85 ],
				"m": [ 2.85, 4.75 ],
				"xl": [ 4.75, 5.7 ],
				"xxl": [ 5.7, 5.89 ]
			}
		},
		"797": {
			"dex-index": "797",
			"name": "Celesteela",
			"availability": {
				"in-game": "2022-09-13",
				"shiny": "2024-04-04"
			},
			"category": "Launch",
			"type": [ "Steel", "Flying" ],
			"base-stamina": 219,
			"base-attack": 207,
			"base-defense": 199,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_STE_IRONHEAD",
				"CHRG_NOR_BODYSLAM",
				"CHRG_STE_HEAVYSLAM",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 9.2,
			"weight-avg": 999.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 1.15,
				"wt-std-dev": 124.9875,
				"xxs": [ 4.508, 4.6 ],
				"xs": [ 4.6, 6.9 ],
				"m": [ 6.9, 11.5 ],
				"xl": [ 11.5, 13.8 ],
				"xxl": [ 13.8, 14.26 ]
			}
		},
		"798": {
			"dex-index": "798",
			"name": "Kartana",
			"availability": {
				"in-game": "2022-09-13",
				"shiny": "2024-04-04"
			},
			"category": "Drawn Sword",
			"type": [ "Grass", "Steel" ],
			"base-stamina": 139,
			"base-attack": 323,
			"base-defense": 182,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFBLADE",
				"CHRG_BUG_XSCISSOR",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_FLY_AERIALACE"
			],
			"height-avg": 0.3,
			"weight-avg": 0.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.0125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"799": {
			"dex-index": "799",
			"name": "Guzzlord",
			"availability": {
				"in-game": "2022-11-08",
				"shiny": "2023-10-06"
			},
			"category": "Junkivore",
			"type": [ "Dark", "Dragon" ],
			"base-stamina": 440,
			"base-attack": 188,
			"base-defense": 99,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DAR_BRUTALSWING",
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_DAR_CRUNCH",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 5.5,
			"weight-avg": 888,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.6875,
				"wt-std-dev": 111,
				"xxs": [ 2.695, 2.75 ],
				"xs": [ 2.75, 4.125 ],
				"m": [ 4.125, 6.875 ],
				"xl": [ 6.875, 8.25 ],
				"xxl": [ 8.25, 8.525 ]
			}
		},
		"800": {
			"dex-index": "800",
			"name": "Necrozma",
			"availability": {
				"in-game": "2024-05-30",
				"shiny": "2024-05-30"
			},
			"category": "Prism",
			"type": [ "Psychic" ],
			"evolves-into": [ "800-3" ],
			"base-stamina": 219,
			"base-attack": 251,
			"base-defense": 195,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_PSY_PSYCHOCUT",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_STE_IRONHEAD",
				"CHRG_DRA_OUTRAGE"
			],
			"height-avg": 2.4,
			"weight-avg": 230,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3,
				"wt-std-dev": 28.75,
				"xxs": [ 1.176, 1.2 ],
				"xs": [ 1.2, 1.8 ],
				"m": [ 1.8, 3 ],
				"xl": [ 3, 3.6 ],
				"xxl": [ 3.6, 3.72 ]
			}
		},
		"800-S": {
			"dex-index": "800-S",
			"name": "Dusk Mane Necrozma",
			"name-ital": "Necrozma Criniera del Vespro",
			"form-data": {
				"base": "800",
				"type": "fusion"
			},
			"availability": {
				"in-game": "2024-05-30",
				"shiny": "2024-05-30"
			},
			"type": [ "Psychic", "Steel" ],
			"base-stamina": 200,
			"base-attack": 277,
			"base-defense": 220,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_PSY_PSYCHOCUT",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_STE_IRONHEAD",
				"CHRG_DRA_OUTRAGE"
			],
			"special-charged-moves": [
				"CHRG_STE_SUNSTEELSTRIKE"
			],
			"height-avg": 3.8,
			"weight-avg": 460,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.475,
				"wt-std-dev": 57.5,
				"xxs": [ 1.862, 1.9 ],
				"xs": [ 1.9, 2.85 ],
				"m": [ 2.85, 4.75 ],
				"xl": [ 4.75, 5.7 ],
				"xxl": [ 5.7, 5.89 ]
			}
		},
		"800-L": {
			"dex-index": "800-L",
			"name": "Dawn Wings Necrozma",
			"name-ital": "Necrozma Ali dell'Aurora",
			"form-data": {
				"base": "800",
				"type": "fusion"
			},
			"availability": {
				"in-game": "2024-05-30",
				"shiny": "2024-05-30"
			},
			"type": [ "Psychic", "Ghost" ],
			"base-stamina": 200,
			"base-attack": 277,
			"base-defense": 220,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_PSY_PSYCHOCUT",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_PSY_FUTURESIGHT",
				"CHRG_STE_IRONHEAD",
				"CHRG_DRA_OUTRAGE"
			],
			"special-charged-moves": [
				"CHRG_GHO_MOONGEISTBEAM"
			],
			"height-avg": 4.2,
			"weight-avg": 350,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.525,
				"wt-std-dev": 43.75,
				"xxs": [ 2.058, 2.1 ],
				"xs": [ 2.1, 3.15 ],
				"m": [ 3.15, 5.25 ],
				"xl": [ 5.25, 6.3 ],
				"xxl": [ 6.3, 6.51 ]
			}
		},
		"800-U": {
			"dex-index": "800-U",
			"name": "Ultra Necrozma",
			"form-data": {
				"base": "800",
				"type": "not sure on this one"
			},
			"availability": {
				"in-game": false
			},
			"category": "Prism",
			"type": [ "Psychic", "Dragon" ],
			"evolves-from": "800",
			"base-stamina": 200,
			"base-attack": 337,
			"base-defense": 196,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 7.5,
			"weight-avg": 230,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.9375,
				"wt-std-dev": 28.75,
				"xxs": [ 3.675, 3.75 ],
				"xs": [ 3.75, 5.625 ],
				"m": [ 5.625, 9.375 ],
				"xl": [ 9.375, 11.25 ],
				"xxl": [ 11.25, 11.625 ]
			}
		},
		"801": {
			"dex-index": "801",
			"name": "Magearna",
			"availability": {
				"in-game": false
			},
			"variants": [ "", "Original Color" ],
			"variants-ital": [ "", "Colore Antico" ],
			"category": "Artificial",
			"type": [ "Steel", "Fairy" ],
			"base-stamina": 190,
			"base-attack": 246,
			"base-defense": 225,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 1,
			"weight-avg": 80.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 10.0625,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"802": {
			"dex-index": "802",
			"name": "Marshadow",
			"availability": {
				"in-game": "2024-05-30",
				"shadow": false
			},
			"category": "Gloomdweller",
			"type": [ "Fighting", "Ghost" ],
			"base-stamina": 207,
			"base-attack": 265,
			"base-defense": 190,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_FIG_COUNTER",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIR_FIREPUNCH",
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 0.7,
			"weight-avg": 22.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 2.775,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"803": {
			"dex-index": "803",
			"name": "Poipole",
			"availability": {
				"in-game": "2024-03-01"
			},
			"category": "Poison Pin",
			"type": [ "Poison" ],
			"evolves-into": [ "804" ],
			"base-stamina": 167,
			"base-attack": 145,
			"base-defense": 133,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_FLY_PECK"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_POI_SLUDGEWAVE",
				"CHRG_BUG_FELLSTINGER"
			],
			"height-avg": 0.6,
			"weight-avg": 1.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.225,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"804": {
			"dex-index": "804",
			"name": "Naganadel",
			"availability": {
				"in-game": "2024-05-23"
			},
			"category": "Poison Pin",
			"type": [ "Poison", "Dragon" ],
			"evolves-from": "803",
			"base-stamina": 177,
			"base-attack": 263,
			"base-defense": 159,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_POI_POISONJAB",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_FLY_ACROBATICS",
				"CHRG_BUG_FELLSTINGER",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_DRA_DRAGONCLAW"
			],
			"height-avg": 3.6,
			"weight-avg": 150,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.45,
				"wt-std-dev": 18.75,
				"xxs": [ 1.764, 1.8 ],
				"xs": [ 1.8, 2.7 ],
				"m": [ 2.7, 4.5 ],
				"xl": [ 4.5, 5.4 ],
				"xxl": [ 5.4, 5.58 ]
			}
		},
		"805": {
			"dex-index": "805",
			"name": "Stakataka",
			"availability": {
				"in-game": "2024-05-23"
			},
			"category": "Rampart",
			"type": [ "Rock", "Steel" ],
			"base-stamina": 156,
			"base-attack": 213,
			"base-defense": 298,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_STE_FLASHCANNON",
				"CHRG_ROC_STONEEDGE",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 5.5,
			"weight-avg": 820,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.6875,
				"wt-std-dev": 102.5,
				"xxs": [ 2.695, 2.75 ],
				"xs": [ 2.75, 4.125 ],
				"m": [ 4.125, 6.875 ],
				"xl": [ 6.875, 8.25 ],
				"xxl": [ 8.25, 8.525 ]
			}
		},
		"806": {
			"dex-index": "806",
			"name": "Blacephalon",
			"availability": {
				"in-game": "2024-05-23"
			},
			"category": "Fireworks",
			"type": [ "Fire", "Ghost" ],
			"base-stamina": 142,
			"base-attack": 315,
			"base-defense": 148,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FIR_INCINERATE",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_FIR_MYSTICALFIRE",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FIR_OVERHEAT"
			],
			"height-avg": 1.8,
			"weight-avg": 13,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 1.625,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"807": {
			"dex-index": "807",
			"name": "Zeraora",
			"availability": {
				"in-game": false
			},
			"category": "Thunderclap",
			"type": [ "Electric" ],
			"base-stamina": 204,
			"base-attack": 252,
			"base-defense": 177,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_WILDCHARGE"
			],
			"height-avg": 1.5,
			"weight-avg": 44.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.5625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"808": {
			"dex-index": "808",
			"name": "Meltan",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2019-02-05"
			},
			"category": "Hex Nut",
			"type": [ "Steel" ],
			"evolves-into": [ "809" ],
			"base-stamina": 130,
			"base-attack": 118,
			"base-defense": 99,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_STE_FLASHCANNON"
			],
			"height-avg": 0.2,
			"weight-avg": 8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 1,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"809": {
			"dex-index": "809",
			"name": "Melmetal",
			"availability": {
				"in-game": "2018-11-14",
				"shiny": "2019-02-05"
			},
			"category": "Hex Nut",
			"type": [ "Steel" ],
			"evolves-from": "808",
			"base-stamina": 264,
			"base-attack": 226,
			"base-defense": 190,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_STE_FLASHCANNON"
			],
			"special-charged-moves": [
				"CHRG_STE_DOUBLEIRONBASH"
			],
			"height-avg": 2.5,
			"weight-avg": 800,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 100,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 3.875 ]
			}
		},
		"809-G": {
			"dex-index": "809-G",
			"form-data": {
				"base": "809",
				"type": "Giga"
			}
		},
		"810": {
			"dex-index": "810",
			"name": "Grookey",
			"availability": {
				"in-game": "2024-09-03",
				"dynamax": "2024-10-01"
			},
			"category": "Chimp",
			"type": [ "Grass" ],
			"evolves-into": [ "811" ],
			"base-attack": 122,
			"base-defense": 91,
			"base-stamina": 137,
			"dynamax-class": 1,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 0.3,
			"weight-avg": 5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.625,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"811": {
			"dex-index": "811",
			"name": "Thwackey",
			"availability": {
				"in-game": "2024-09-03",
				"dynamax": "2024-10-01"
			},
			"category": "Beat",
			"type": [ "Grass" ],
			"evolves-from": "810",
			"evolves-into": [ "812" ],
			"base-stamina": 172,
			"base-attack": 165,
			"base-defense": 134,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 0.7,
			"weight-avg": 14,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.75,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"812": {
			"dex-index": "812",
			"name": "Rillaboom",
			"availability": {
				"in-game": "2024-09-03",
				"dynamax": "2024-10-01"
			},
			"category": "Drummer",
			"type": [ "Grass" ],
			"evolves-from": "811",
			"base-stamina": 225,
			"base-attack": 239,
			"base-defense": 168,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_NOR_SCRATCH"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRO_EARTHPOWER"
			],
			"height-avg": 2.1,
			"weight-avg": 90,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2625,
				"wt-std-dev": 11.25,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.255 ]
			}
		},
		"812-G": {
			"dex-index": "812-G",
			"form-data": {
				"base": "812",
				"type": "Giga"
			},
			"availability": {
			}
		},
		"813": {
			"dex-index": "813",
			"name": "Scorbunny",
			"availability": {
				"in-game": "2024-09-03",
				"dynamax": "2024-10-01"
			},
			"category": "Rabbit",
			"type": [ "Fire" ],
			"evolves-into": [ "814" ],
			"base-stamina": 137,
			"base-attack": 132,
			"base-defense": 79,
			"dynamax-class": 1,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.3,
			"weight-avg": 4.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.5625,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"814": {
			"dex-index": "814",
			"name": "Raboot",
			"availability": {
				"in-game": "2024-09-03",
				"dynamax": "2024-10-01"
			},
			"category": "Rabbit",
			"type": [ "Fire" ],
			"evolves-from": "813",
			"evolves-into": [ "815" ],
			"base-stamina": 163,
			"base-attack": 170,
			"base-defense": 125,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.6,
			"weight-avg": 9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"815": {
			"dex-index": "815",
			"name": "Cinderace",
			"availability": {
				"in-game": "2024-09-03",
				"dynamax": "2024-10-01"
			},
			"category": "Striker",
			"type": [ "Fire" ],
			"evolves-from": "814",
			"base-stamina": 190,
			"base-attack": 238,
			"base-defense": 163,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_FIRESPIN",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FIG_FOCUSBLAST"
			],
			"height-avg": 1.4,
			"weight-avg": 33,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 4.125,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"815-G": {
			"dex-index": "815-G",
			"form-data": {
				"base": "815",
				"type": "Giga"
			},
			"availability": {
			}
		},
		"816": {
			"dex-index": "816",
			"name": "Sobble",
			"availability": {
				"in-game": "2024-09-03",
				"dynamax": "2024-10-01"
			},
			"category": "Water Lizard",
			"type": [ "Water" ],
			"evolves-into": [ "817" ],
			"base-stamina": 137,
			"base-attack": 132,
			"base-defense": 79,
			"dynamax-class": 1,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 0.3,
			"weight-avg": 4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.5,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"817": {
			"dex-index": "817",
			"name": "Drizzile",
			"availability": {
				"in-game": "2024-09-03",
				"dynamax": "2024-10-01"
			},
			"category": "Water Lizard",
			"type": [ "Water" ],
			"evolves-from": "816",
			"evolves-into": [ "818" ],
			"base-stamina": 163,
			"base-attack": 186,
			"base-defense": 113,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 0.7,
			"weight-avg": 11.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1.4375,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"818": {
			"dex-index": "818",
			"name": "Inteleon",
			"availability": {
				"in-game": "2024-09-03",
				"dynamax": "2024-10-01"
			},
			"category": "Secret Agent",
			"type": [ "Water" ],
			"evolves-from": "817",
			"base-stamina": 172,
			"base-attack": 262,
			"base-defense": 142,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_SURF",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_WAT_WATERPULSE"
			],
			"height-avg": 1.9,
			"weight-avg": 45.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 5.65,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"818-G": {
			"dex-index": "818-G",
			"form-data": {
				"base": "818",
				"type": "Giga"
			},
			"availability": {
			}
		},
		"819": {
			"dex-index": "819",
			"name": "Skwovet",
			"availability": {
				"in-game": "2021-08-20",
				"shiny": "2024-09-03",
				"dynamax": "2024-09-04"
			},
			"category": "Cheeky",
			"type": [ "Normal" ],
			"evolves-into": [ "820" ],
			"base-stamina": 172,
			"base-attack": 95,
			"base-defense": 86,
			"dynamax-class": 1,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GRA_BULLETSEED",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.3,
			"weight-avg": 2.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.3125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"820": {
			"dex-index": "820",
			"name": "Greedent",
			"availability": {
				"in-game": "2021-08-20",
				"shiny": "2024-09-03",
				"dynamax": "2024-09-04"
			},
			"category": "Greedy",
			"type": [ "Normal" ],
			"evolves-from": "819",
			"base-stamina": 260,
			"base-attack": 160,
			"base-defense": 156,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GRA_BULLETSEED",
				"FAST_GRO_MUDSHOT",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_DAR_CRUNCH",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.6,
			"weight-avg": 6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.75,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"821": {
			"dex-index": "821",
			"name": "Rookidee",
			"availability": {
				"in-game": "2025-01-21"
			},
			"category": "Tiny Bird",
			"type": [ "Flying" ],
			"evolves-into": [ "822" ],
			"base-stamina": 116,
			"base-attack": 88,
			"base-defense": 67,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_FLY_PECK"
			],
			"charged-moves": [
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FLY_DRILLPECK"
			],
			"height-avg": 0.2,
			"weight-avg": 1.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.225,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"822": {
			"dex-index": "822",
			"name": "Corvisquire",
			"availability": {
				"in-game": "2025-01-21"
			},
			"category": "Raven",
			"type": [ "Flying" ],
			"evolves-from": "821",
			"evolves-into": [ "823" ],
			"base-stamina": 169,
			"base-attack": 129,
			"base-defense": 110,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_FLY_PECK"
			],
			"charged-moves": [
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FLY_DRILLPECK"
			],
			"height-avg": 0.8,
			"weight-avg": 16,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"823": {
			"dex-index": "823",
			"name": "Corviknight",
			"availability": {
				"in-game": "2025-01-21"
			},
			"category": "Raven",
			"type": [ "Flying", "Steel" ],
			"evolves-from": "822",
			"base-stamina": 221,
			"base-attack": 163,
			"base-defense": 192,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FLY_AIRSLASH",
				"FAST_STE_STEELWING"
			],
			"charged-moves": [
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FLY_DRILLPECK"
			],
			"special-charged-moves": [
				"CHRG_STE_IRONHEAD"
			],
			"height-avg": 2.2,
			"weight-avg": 75,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.275,
				"wt-std-dev": 9.375,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.41 ]
			}
		},
		"823-G": {
			"dex-index": "823-G",
			"form-data": {
				"base": "823",
				"type": "Giga"
			},
			"availability": {
			}
		},
		"824": {
			"dex-index": "824",
			"name": "Blipbug",
			"availability": {
				"in-game": false
			},
			"category": "Larva",
			"type": [ "Bug" ],
			"evolves-into": [ "825" ],
			"base-stamina": 93,
			"base-attack": 46,
			"base-defense": 67,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.4,
			"weight-avg": 8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"825": {
			"dex-index": "825",
			"name": "Dottler",
			"availability": {
				"in-game": false
			},
			"category": "Radome",
			"type": [ "Bug", "Psychic" ],
			"evolves-from": "824",
			"evolves-into": [ "826" ],
			"base-stamina": 137,
			"base-attack": 87,
			"base-defense": 157,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.4,
			"weight-avg": 19.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 2.4375,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"826": {
			"dex-index": "826",
			"name": "Orbeetle",
			"availability": {
				"in-game": false
			},
			"category": "Seven Spot",
			"type": [ "Bug", "Psychic" ],
			"evolves-from": "825",
			"base-stamina": 155,
			"base-attack": 156,
			"base-defense": 240,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_BUG_STRUGGLEBUG",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.4,
			"weight-avg": 40.8,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05,
				"wt-std-dev": 5.1,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"826-G": {
			"dex-index": "826-G",
			"form-data": {
				"base": "826",
				"type": "Giga"
			}
		},
		"827": {
			"dex-index": "827",
			"name": "Nickit",
			"availability": {
				"in-game": false
			},
			"category": "Fox",
			"type": [ "Dark" ],
			"evolves-into": [ "828" ],
			"base-stamina": 120,
			"base-attack": 85,
			"base-defense": 82,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_FAI_PLAYROUGH"
			],
			"height-avg": 0.6,
			"weight-avg": 8.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.1125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"828": {
			"dex-index": "828",
			"name": "Thievul",
			"availability": {
				"in-game": false
			},
			"category": "Fox",
			"type": [ "Dark" ],
			"evolves-from": "827",
			"base-stamina": 172,
			"base-attack": 172,
			"base-defense": 164,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_FAI_PLAYROUGH"
			],
			"height-avg": 1.2,
			"weight-avg": 19.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.4875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"829": {
			"dex-index": "829",
			"name": "Gossifleur",
			"availability": {
				"in-game": false
			},
			"category": "Flowering",
			"type": [ "Grass" ],
			"evolves-into": [ "830" ],
			"base-stamina": 120,
			"base-attack": 70,
			"base-defense": 104,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.4,
			"weight-avg": 2.2,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.275,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"830": {
			"dex-index": "830",
			"name": "Eldegoss",
			"availability": {
				"in-game": false
			},
			"category": "Cotton Bloom",
			"type": [ "Grass" ],
			"evolves-from": "829",
			"base-stamina": 155,
			"base-attack": 148,
			"base-defense": 211,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 0.5,
			"weight-avg": 2.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.3125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"831": {
			"dex-index": "831",
			"name": "Wooloo",
			"availability": {
				"in-game": "2021-08-20",
				"shiny": "2024-09-03",
				"dynamax": "2024-09-04"
			},
			"category": "Sheep",
			"type": [ "Normal" ],
			"evolves-into": [ "832" ],
			"base-stamina": 123,
			"base-attack": 76,
			"base-defense": 97,
			"dynamax-class": 1,
			"max-battle-tier": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_DAR_PAYBACK"
			],
			"height-avg": 0.6,
			"weight-avg": 6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.75,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"832": {
			"dex-index": "832",
			"name": "Dubwool",
			"availability": {
				"in-game": "2021-08-20",
				"shiny": "2024-09-03",
				"dynamax": "2024-09-04"
			},
			"category": "Sheep",
			"type": [ "Normal" ],
			"evolves-from": "831",
			"base-stamina": 176,
			"base-attack": 159,
			"base-defense": 198,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_DAR_PAYBACK"
			],
			"height-avg": 1.3,
			"weight-avg": 43,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 5.375,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"833": {
			"dex-index": "833",
			"name": "Chewtle",
			"availability": {
				"in-game": false
			},
			"category": "Snapping",
			"type": [ "Water" ],
			"evolves-into": [ "834" ],
			"base-stamina": 137,
			"base-attack": 114,
			"base-defense": 85,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_WAT_SURF"
			],
			"height-avg": 0.3,
			"weight-avg": 8.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 1.0625,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"834": {
			"dex-index": "834",
			"name": "Drednaw",
			"availability": {
				"in-game": false
			},
			"category": "Bite",
			"type": [ "Water", "Rock" ],
			"evolves-from": "833",
			"base-stamina": 207,
			"base-attack": 213,
			"base-defense": 164,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_ROC_ROCKBLAST",
				"CHRG_WAT_SURF"
			],
			"height-avg": 1,
			"weight-avg": 115.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 14.4375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"834-G": {
			"dex-index": "834-G",
			"form-data": {
				"base": "834",
				"type": "Giga"
			}
		},
		"835": {
			"dex-index": "835",
			"name": "Yamper",
			"availability": {
				"in-game": false
			},
			"category": "Puppy",
			"type": [ "Electric" ],
			"evolves-into": [ "836" ],
			"base-stamina": 153,
			"base-attack": 80,
			"base-defense": 90,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 0.3,
			"weight-avg": 13.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 1.6875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"836": {
			"dex-index": "836",
			"name": "Boltund",
			"availability": {
				"in-game": false
			},
			"category": "Dog",
			"type": [ "Electric" ],
			"evolves-from": "835",
			"base-stamina": 170,
			"base-attack": 197,
			"base-defense": 131,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_ELE_THUNDER"
			],
			"height-avg": 1,
			"weight-avg": 34,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.25,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"837": {
			"dex-index": "837",
			"name": "Rolycoly",
			"availability": {
				"in-game": false
			},
			"category": "Coal",
			"type": [ "Rock" ],
			"evolves-into": [ "838" ],
			"base-stamina": 102,
			"base-attack": 73,
			"base-defense": 91,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 0.3,
			"weight-avg": 12,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 1.5,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"838": {
			"dex-index": "838",
			"name": "Carkol",
			"availability": {
				"in-game": false
			},
			"category": "Coal",
			"type": [ "Rock", "Fire" ],
			"evolves-from": "837",
			"evolves-into": [ "839" ],
			"base-stamina": 190,
			"base-attack": 114,
			"base-defense": 157,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_INCINERATE",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 1.1,
			"weight-avg": 78,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 9.75,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.925 ]
			}
		},
		"839": {
			"dex-index": "839",
			"name": "Coalossal",
			"availability": {
				"in-game": false
			},
			"category": "Coal",
			"type": [ "Rock", "Fire" ],
			"evolves-from": "838",
			"base-stamina": 242,
			"base-attack": 146,
			"base-defense": 198,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_INCINERATE",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_ROCKSLIDE"
			],
			"height-avg": 2.8,
			"weight-avg": 310.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.35,
				"wt-std-dev": 38.8125,
				"xxs": [ 1.372, 1.4 ],
				"xs": [ 1.4, 2.1 ],
				"m": [ 2.1, 3.5 ],
				"xl": [ 3.5, 4.2 ],
				"xxl": [ 4.2, 4.34 ]
			}
		},
		"839-G": {
			"dex-index": "839-G",
			"form-data": {
				"base": "839",
				"type": "Giga"
			}
		},
		"840": {
			"dex-index": "840",
			"name": "Applin",
			"availability": {
				"in-game": false
			},
			"category": "Apple Core",
			"type": [ "Grass", "Dragon" ],
			"evolves-into": [ "841", "842", "1011" ],
			"base-stamina": 120,
			"base-attack": 71,
			"base-defense": 116,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.2,
			"weight-avg": 0.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.0625,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"841": {
			"dex-index": "841",
			"name": "Flapple",
			"availability": {
				"in-game": false
			},
			"category": "Apple Wing",
			"type": [ "Grass", "Dragon" ],
			"evolves-from": "840",
			"base-stamina": 172,
			"base-attack": 214,
			"base-defense": 144,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_DRA_OUTRAGE",
				"CHRG_FLY_FLY",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.3,
			"weight-avg": 1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"841-G": {
			"dex-index": "841-G",
			"form-data": {
				"base": "841",
				"type": "Giga"
			}
		},
		"842": {
			"dex-index": "842",
			"name": "Appletun",
			"availability": {
				"in-game": false
			},
			"category": "Apple Nectar",
			"type": [ "Grass", "Dragon" ],
			"evolves-from": "840",
			"base-stamina": 242,
			"base-attack": 178,
			"base-defense": 146,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_DRA_OUTRAGE",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.4,
			"weight-avg": 13,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1.625,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"842-G": {
			"dex-index": "842-G",
			"form-data": {
				"base": "842",
				"type": "Giga"
			}
		},
		"843": {
			"dex-index": "843",
			"name": "Silicobra",
			"availability": {
				"in-game": false
			},
			"category": "Sand Snake",
			"type": [ "Ground" ],
			"evolves-into": [ "844" ],
			"base-stamina": 141,
			"base-attack": 103,
			"base-defense": 123,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_GRO_BULLDOZE",
				"CHRG_GRO_DIG",
				"CHRG_GRO_EARTHPOWER"
			],
			"height-avg": 2.2,
			"weight-avg": 7.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.275,
				"wt-std-dev": 0.95,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.41 ]
			}
		},
		"844": {
			"dex-index": "844",
			"name": "Sandaconda",
			"availability": {
				"in-game": false
			},
			"category": "Sand Snake",
			"type": [ "Ground" ],
			"evolves-from": "843",
			"base-stamina": 176,
			"base-attack": 202,
			"base-defense": 207,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_GRO_BULLDOZE",
				"CHRG_GRO_DIG",
				"CHRG_GRO_EARTHPOWER"
			],
			"height-avg": 3.8,
			"weight-avg": 65.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.475,
				"wt-std-dev": 8.1875,
				"xxs": [ 1.862, 1.9 ],
				"xs": [ 1.9, 2.85 ],
				"m": [ 2.85, 4.75 ],
				"xl": [ 4.75, 5.7 ],
				"xxl": [ 5.7, 5.89 ]
			}
		},
		"844-G": {
			"dex-index": "844-G",
			"form-data": {
				"base": "844",
				"type": "Giga"
			}
		},
		"845": {
			"dex-index": "845",
			"name": "Cramorant",
			"availability": {
				"in-game": false
			},
			"category": "Gulp",
			"type": [ "Flying", "Water" ],
			"base-stamina": 172,
			"base-attack": 173,
			"base-defense": 163,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_FLY_DRILLPECK",
				"CHRG_FLY_FLY",
				"CHRG_WAT_HYDROPUMP"
			],
			"height-avg": 0.8,
			"weight-avg": 18,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 2.25,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"846": {
			"dex-index": "846",
			"name": "Arrokuda",
			"availability": {
				"in-game": false
			},
			"category": "Rush",
			"type": [ "Water" ],
			"evolves-into": [ "847" ],
			"base-stamina": 121,
			"base-attack": 118,
			"base-defense": 72,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_DAR_BITE",
				"FAST_FLY_PECK"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_WAT_AQUAJET",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"height-avg": 0.5,
			"weight-avg": 1,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 1 ]
			}
		},
		"847": {
			"dex-index": "847",
			"name": "Barraskewda",
			"availability": {
				"in-game": false
			},
			"category": "Skewer",
			"type": [ "Water" ],
			"evolves-from": "846",
			"base-stamina": 156,
			"base-attack": 258,
			"base-defense": 127,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_DAR_BITE",
				"FAST_FLY_PECK"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_WAT_AQUAJET",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"height-avg": 1.3,
			"weight-avg": 30,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 3.75,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"848": {
			"dex-index": "848",
			"name": "Toxel",
			"availability": {
				"in-game": "2024-11-16",
				"shiny": "2024-11-16"
			},
			"category": "Baby",
			"type": [ "Electric", "Poison" ],
			"evolves-into": [ "849" ],
			"base-stamina": 120,
			"base-attack": 97,
			"base-defense": 65,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_FIG_POWERUPPUNCH"
			],
			"height-avg": 0.4,
			"weight-avg": 11,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1.375,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"849": {
			"dex-index": "849",
			"name": "Toxtricity",
			"availability": {
				"in-game": "2024-11-16",
				"shiny": "2024-11-16",
				"dynamax": "2024-11-16"
			},
			"variants": [ "Low-key", "Amped" ],
			"variants-ital": [ "Basso", "Melodia" ],
			"category": "Punk",
			"type": [ "Electric", "Poison" ],
			"evolves-from": "848",
			"base-stamina": 181,
			"base-attack": 224,
			"base-defense": 140,
			"dynamax-class": 3,
			"max-battle-tier": 4,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_POI_POISONJAB",
				"FAST_POI_ACID"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_FIG_POWERUPPUNCH"
			],
			"height-avg": 1.6,
			"weight-avg": 40,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 5,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"849-G": {
			"dex-index": "849-G",
			"form-data": {
				"base": "849",
				"type": "Giga"
			},
			"availability": {
				"in-game": "2024-11-16",
				"shiny": "2024-11-16"
			},
			"height-avg": 24,
			"size-data": {
				"xxs": [ 23.833, 23.85 ],
				"xs": [ 23.85, 24.275 ],
				"m": [ 24.275, 25.125 ],
				"xl": [ 25.125, 25.55 ],
				"xxl": [ 25.55, 25.975 ]
			}
		},
		"850": {
			"dex-index": "850",
			"name": "Sizzlipede",
			"availability": {
				"in-game": false
			},
			"category": "Radiator",
			"type": [ "Fire", "Bug" ],
			"evolves-into": [ "851" ],
			"base-stamina": 137,
			"base-attack": 118,
			"base-defense": 90,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_HEATWAVE"
			],
			"height-avg": 0.7,
			"weight-avg": 1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 0.125,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"851": {
			"dex-index": "851",
			"name": "Centiskorch",
			"availability": {
				"in-game": false
			},
			"category": "Radiator",
			"type": [ "Fire", "Bug" ],
			"evolves-from": "850",
			"base-stamina": 225,
			"base-attack": 220,
			"base-defense": 158,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_FIR_EMBER"
			],
			"charged-moves": [
				"CHRG_BUG_BUGBUZZ",
				"CHRG_BUG_LUNGE",
				"CHRG_DAR_CRUNCH",
				"CHRG_FIR_HEATWAVE"
			],
			"height-avg": 3,
			"weight-avg": 120,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.375,
				"wt-std-dev": 15,
				"xxs": [ 1.47, 1.5 ],
				"xs": [ 1.5, 2.25 ],
				"m": [ 2.25, 3.75 ],
				"xl": [ 3.75, 4.5 ],
				"xxl": [ 4.5, 4.65 ]
			}
		},
		"851-G": {
			"dex-index": "851-G",
			"form-data": {
				"base": "851",
				"type": "Giga"
			}
		},
		"852": {
			"dex-index": "852",
			"name": "Clobbopus",
			"availability": {
				"in-game": false
			},
			"category": "Tantrum",
			"type": [ "Fighting" ],
			"evolves-into": [ "853" ],
			"base-stamina": 137,
			"base-attack": 121,
			"base-defense": 103,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_ICE_ICEPUNCH"
			],
			"height-avg": 0.6,
			"weight-avg": 4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.5,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"853": {
			"dex-index": "853",
			"name": "Grapploct",
			"availability": {
				"in-game": false
			},
			"category": "Jujitsu",
			"type": [ "Fighting" ],
			"evolves-from": "852",
			"base-stamina": 190,
			"base-attack": 209,
			"base-defense": 162,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_SUPERPOWER",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_WAT_SURF"
			],
			"height-avg": 1.6,
			"weight-avg": 39,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 4.875,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"854-0": {
			"dex-index": "854-0",
			"name": "Sinistea",
			"availability": {
				"in-game": "2024-12-03"
			},
			"category": "Black Tea",
			"type": [ "Ghost" ],
			"image": "854",
			"evolves-into": [ "855-0" ],
			"base-stamina": 120,
			"base-attack": 134,
			"base-defense": 96,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.1,
			"weight-avg": 0.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0125,
				"wt-std-dev": 0.025,
				"xxs": [ 0.049, 0.05 ],
				"xs": [ 0.05, 0.075 ],
				"m": [ 0.075, 0.125 ],
				"xl": [ 0.125, 0.15 ],
				"xxl": [ 0.15, 0.175 ]
			}
		},
		"854-A": {
			"dex-index": "854-A",
			"from-data": {
				"base": "854-0",
				"type": "evolution difference",
				"form": "Antique Form",
				"form-ital": "Forma Autentica"
			},
			"evolves-into": [ "855-A" ]
		},
		"854-P": {
			"dex-index": "854-P",
			"from-data": {
				"base": "854-0",
				"type": "evolution difference",
				"form": "Phony Form",
				"form-ital": "Forma Contrafatta"
			},
			"evolves-into": [ "855-P" ]
		},
		"855-0": {
			"dex-index": "855-0",
			"name": "Polteageist",
			"availability": {
				"in-game": "2024-12-03"
			},
			"category": "Black Tea",
			"type": [ "Ghost" ],
			"image": "855",
			"evolves-from": "854-0",
			"base-stamina": 155,
			"base-attack": 248,
			"base-defense": 189,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_SUCKERPUNCH",
				"FAST_GHO_ASTONISH",
				"FAST_GHO_HEX"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.2,
			"weight-avg": 0.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.05,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"855-A": {
			"dex-index": "855-A",
			"from-data": {
				"base": "855-0",
				"type": "evolution difference",
				"form": "Antique Form",
				"form-ital": "Forma Autentica"
			},
			"evolves-from": "854-A"
		},
		"855-P": {
			"dex-index": "855-P",
			"from-data": {
				"base": "855-0",
				"type": "evolution difference",
				"form": "Phony Form",
				"form-ital": "Forma Contrafatta"
			},
			"evolves-from": "854-P"
		},
		"856": {
			"dex-index": "856",
			"name": "Hatenna",
			"category": "Calm",
			"type": [ "Psychic" ],
			"evolves-into": [ "857" ],
			"base-stamina": 123,
			"base-attack": 98,
			"base-defense": 93,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 0.4,
			"weight-avg": 3.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.425,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"857": {
			"dex-index": "857",
			"name": "Hattrem",
			"category": "Serene",
			"type": [ "Psychic" ],
			"evolves-from": "856",
			"evolves-into": [ "858" ],
			"base-stamina": 149,
			"base-attack": 153,
			"base-defense": 133,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 0.6,
			"weight-avg": 4.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.6,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"858": {
			"dex-index": "858",
			"name": "Hatterene",
			"category": "Silent",
			"type": [ "Psychic", "Fairy" ],
			"evolves-from": "857",
			"base-stamina": 149,
			"base-attack": 237,
			"base-defense": 182,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_PSY_CONFUSION",
				"FAST_PSY_PSYCHOCUT"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_POWERWHIP",
				"CHRG_PSY_PSYCHIC",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 2.1,
			"weight-avg": 5.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2625,
				"wt-std-dev": 0.6375,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.255 ]
			}
		},
		"858-G": {
			"dex-index": "858-G",
			"form-data": {
				"base": "858",
				"type": "Giga"
			},
			"availability": {
			}
		},
		"859": {
			"dex-index": "859",
			"name": "Impidimp",
			"availability": {
				"in-game": false
			},
			"category": "Wily",
			"evolves-into": [ "860" ],
			"type": [ "Dark", "Fairy" ],
			"base-stamina": 128,
			"base-attack": 103,
			"base-defense": 69,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_DAR_FOULPLAY",
				"CHRG_FAI_PLAYROUGH"
			],
			"height-avg": 0.4,
			"weight-avg": 5.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.6875,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"860": {
			"dex-index": "860",
			"name": "Morgrem",
			"availability": {
				"in-game": false
			},
			"category": "Devious",
			"type": [ "Dark", "Fairy" ],
			"evolves-from": "859",
			"evolves-into": [ "861" ],
			"base-stamina": 163,
			"base-attack": 145,
			"base-defense": 102,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_DAR_FOULPLAY",
				"CHRG_FAI_PLAYROUGH"
			],
			"height-avg": 0.8,
			"weight-avg": 12.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 1.5625,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"861": {
			"dex-index": "861",
			"name": "Grimmsnarl",
			"availability": {
				"in-game": false
			},
			"category": "Bulk Up",
			"type": [ "Dark", "Fairy" ],
			"evolves-from": "860",
			"base-stamina": 216,
			"base-attack": 227,
			"base-defense": 139,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_DAR_SUCKERPUNCH",
				"FAST_FIG_LOWKICK"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_DAR_FOULPLAY",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_FIG_POWERUPPUNCH"
			],
			"height-avg": 1.5,
			"weight-avg": 61,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 7.625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"861-G": {
			"dex-index": "861-G",
			"form-data": {
				"base": "861",
				"type": "Giga"
			}
		},
		"862": {
			"dex-index": "862",
			"name": "Obstagoon",
			"availability": {
				"in-game": "2020-06-03",
				"shiny": "2021-05-25",
				"shadow": "2024-10-08",
				"shiny-shadow": "2024-10-08"
			},
			"category": "Blocking",
			"type": [ "Dark", "Normal" ],
			"evolves-from": "264-1",
			"base-stamina": 212,
			"base-attack": 180,
			"base-defense": 194,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_GHO_LICK"
			],
			"charged-moves": [
				"CHRG_FIG_CROSSCHOP",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_POI_GUNKSHOT"
			],
			"special-charged-moves": [
				"CHRG_DAR_OBSTRUCT"
			],
			"height-avg": 1.6,
			"weight-avg": 46,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 5.75,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"863": {
			"dex-index": "863",
			"name": "Perrserker",
			"availability": {
				"in-game": "2020-06-03",
				"shiny": "2021-08-20"
			},
			"category": "Viking",
			"type": [ "Steel" ],
			"evolves-from": "52-2",
			"base-stamina": 172,
			"base-attack": 195,
			"base-defense": 162,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_STE_IRONHEAD",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_FOULPLAY",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.8,
			"weight-avg": 28,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.5,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"864": {
			"dex-index": "864",
			"name": "Cursola",
			"availability": {
				"in-game": "2024-11-27",
				"shiny": "2024-11-27"
			},
			"category": "Coral",
			"type": [ "Ghost" ],
			"evolves-from": "222",
			"base-stamina": 155,
			"base-attack": 253,
			"base-defense": 182,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_POWERGEM",
				"CHRG_GHO_NIGHTSHADE"
			],
			"height-avg": 1,
			"weight-avg": 0.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 0.05,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"865": {
			"dex-index": "865",
			"name": "Sirfetch'd",
			"availability": {
				"in-game": "2020-10-23",
				"shiny": "2021-08-20"
			},
			"category": "Wild Duck",
			"type": [ "Fighting" ],
			"evolves-from": "83",
			"base-stamina": 158,
			"base-attack": 248,
			"base-defense": 176,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_COUNTER",
				"FAST_BUG_FURYCUTTER"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_GRA_LEAFBLADE",
				"CHRG_DAR_NIGHTSLASH"
			],
			"height-avg": 0.8,
			"weight-avg": 117,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 14.625,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"866": {
			"dex-index": "866",
			"name": "Mr. Rime",
			"availability": {
				"in-game": "2020-12-19",
				"shiny": "2022-12-01"
			},
			"category": "Comedian",
			"type": [ "Ice", "Psychic" ],
			"evolves-from": "122-G",
			"base-stamina": 190,
			"base-attack": 212,
			"base-defense": 179,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_ICE_ICESHARD"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_ICE_ICYWIND",
				"CHRG_ICE_TRIPLEAXEL"
			],
			"height-avg": 1.5,
			"weight-avg": 58.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 7.275,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"867": {
			"dex-index": "867",
			"name": "Runerigus",
			"availability": {
				"in-game": "2020-10-24",
				"shiny": "2022-10-20"
			},
			"category": "Grudge",
			"type": [ "Ground", "Ghost" ],
			"evolves-from": "562-G",
			"base-stamina": 151,
			"base-attack": 163,
			"base-defense": 237,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_GRO_SANDTOMB",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_DAR_BRUTALSWING"
			],
			"height-avg": 1.6,
			"weight-avg": 66.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 8.325,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"868": {
			"dex-index": "868",
			"name": "Milcery",
			"availability": {
				"in-game": false
			},
			"category": "Cream",
			"type": [ "Fairy" ],
			"evolves-into": [ "869" ],
			"base-stamina": 128,
			"base-attack": 90,
			"base-defense": 97,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM"
			],
			"height-avg": 0.2,
			"weight-avg": 0.3,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.0375,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.4 ]
			}
		},
		"869": {
			"dex-index": "869",
			"name": "Alcremie",
			"availability": {
				"in-game": false
			},
			"category": "Cream",
			"type": [ "Fairy" ],
			"evolves-from": "868",
			"base-stamina": 163,
			"base-attack": 203,
			"base-defense": 203,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 0.3,
			"weight-avg": 0.5,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.0625,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.6 ]
			}
		},
		"869-G": {
			"dex-index": "869-G",
			"form-data": {
				"base": "869",
				"type": "Giga"
			}
		},
		"870": {
			"dex-index": "870",
			"name": "Falinks",
			"availability": {
				"in-game": "2021-08-20",
				"shiny": "2024-09-08",
				"dynamax": "2024-10-01"
			},
			"category": "Formation",
			"type": [ "Fighting" ],
			"base-stamina": 163,
			"base-attack": 193,
			"base-defense": 170,
			"dynamax-class": 3,
			"max-battle-tier": 3,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_BUG_MEGAHORN",
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_SUPERPOWER"
			],
			"height-avg": 3,
			"weight-avg": 62,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.375,
				"wt-std-dev": 7.75,
				"xxs": [ 1.47, 1.5 ],
				"xs": [ 1.5, 2.25 ],
				"m": [ 2.25, 3.75 ],
				"xl": [ 3.75, 4.5 ],
				"xxl": [ 4.5, 4.65 ]
			}
		},
		"871": {
			"dex-index": "871",
			"name": "Pincurchin",
			"availability": {
				"in-game": false
			},
			"category": "Sea Urchin",
			"type": [ "Electric" ],
			"base-stamina": 134,
			"base-attack": 176,
			"base-defense": 161,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_WAT_WATERGUN",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_WAT_BUBBLEBEAM"
			],
			"height-avg": 0.3,
			"weight-avg": 1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"872": {
			"dex-index": "872",
			"name": "Snom",
			"availability": {
				"in-game": false
			},
			"category": "Worm",
			"type": [ "Ice", "Bug" ],
			"evolves-into": [ "873" ],
			"base-stamina": 102,
			"base-attack": 76,
			"base-defense": 59,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_ICE_ICYWIND",
				"CHRG_BUG_BUGBUZZ"
			],
			"height-avg": 0.3,
			"weight-avg": 3.8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.475,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"873": {
			"dex-index": "873",
			"name": "Frosmoth",
			"availability": {
				"in-game": false
			},
			"category": "Frost Moth",
			"type": [ "Ice", "Bug" ],
			"evolves-from": "872",
			"base-stamina": 172,
			"base-attack": 230,
			"base-defense": 155,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_BUG_BUGBITE"
			],
			"charged-moves": [
				"CHRG_ICE_ICYWIND",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_ICE_ICEBEAM",
				"CHRG_FLY_HURRICANE"
			],
			"height-avg": 1.3,
			"weight-avg": 42,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 5.25,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"874": {
			"dex-index": "874",
			"name": "Stonjourner",
			"availability": {
				"in-game": "2024-09-03"
			},
			"category": "Big Rock",
			"type": [ "Rock" ],
			"base-stamina": 225,
			"base-attack": 222,
			"base-defense": 182,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_ROC_STONEEDGE",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_NOR_STOMP"
			],
			"height-avg": 2.5,
			"weight-avg": 520,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 65,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 5 ]
			}
		},
		"875-0": {
			"dex-index": "875-0",
			"name": "Eiscue",
			"availability": {
				"in-game": false
			},
			"category": "Penguin",
			"type": [ "Ice" ],
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_ICE_ICYWIND",
				"CHRG_ICE_WEATHERBALL",
				"CHRG_WAT_SURF"
			],
			"height-avg": 1.4,
			"weight-avg": 89,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 11.125,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"875-I": {
			"dex-index": "875-I",
			"form-data": {
				"base": "875-0",
				"type": "battle",
				"form": "Ice Face",
				"form-ital": "Gelofaccia",
			},
			"base-stamina": 181,
			"base-attack": 148,
			"base-defense": 195
		},
		"875-N": {
			"dex-index": "875-N",
			"form-data": {
				"base": "875-0",
				"type": "battle",
				"form": "Noice Face",
				"form-ital": "Liquefaccia"
			},
			"base-stamina": 181,
			"base-attack": 173,
			"base-defense": 139
		},
		"876-0": {
			"dex-index": "876-0",
			"name": "Indeedee",
			"availability": {
				"in-game": false
			},
			"category": "Emotion",
			"type": [ "Psychic", "Normal" ],
			"base-stamina": 155,
			"base-attack": 208,
			"base-defense": 166,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_PSY_EXTRASENSORY"
			],
			"height-avg": 0.9,
			"weight-avg": 28,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 3.5,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"876-M": {
			"dex-index": "876-M",
			"form-data": {
				"base": "876-0",
				"type": "Gender",
				"form": "Male"
			},
			"base-stamina": 155,
			"base-attack": 208,
			"base-defense": 166,
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GHO_SHADOWBALL"
			]
		},
		"876-F": {
			"dex-index": "876-F",
			"form-data": {
				"base": "876-0",
				"type": "Gender",
				"form": "Female"
			},
			"base-stamina": 172,
			"base-attack": 184,
			"base-defense": 184,
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRA_ENERGYBALL"
			]
		},
		"877-0": {
			"dex-index": "877-0",
			"name": "Morpeko",
			"availability": {
				"in-game": "2024-10-22"
			},
			"category": "Two-Sided",
			"type": [ "Electric", "Dark" ],
			"base-stamina": 151,
			"base-attack": 192,
			"base-defense": 121,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_CHARGEBEAM",
				"FAST_DAR_BITE",
				"FAST_ELE_THUNDERSHOCK"
			],
			"height-avg": 0.3,
			"weight-avg": 3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"877-F": {
			"dex-index": "877-F",
			"form-data": {
				"base": "877-0",
				"type": "battle",
				"form": "Full Belly Mode",
				"form-ital": "Motivo Panciapiena"
			},
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_DRA_OUTRAGE",
				"CHRG_ELE_AURAWHEEL",
				"CHRG_PSY_PSYCHICFANGS"
			]
		},
		"877-H": {
			"dex-index": "877-H",
			"form-data": {
				"base": "877-0",
				"type": "battle",
				"form": "Hangry Mode",
				"form-ital": "Motivo Panciavuota"
			},
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_DRA_OUTRAGE",
				"CHRG_DAR_AURAWHEEL",
				"CHRG_PSY_PSYCHICFANGS"
			]
		},
		"878": {
			"dex-index": "878",
			"name": "Cufant",
			"availability": {
				"in-game": false
			},
			"category": "Copperderm",
			"type": [ "Steel" ],
			"evolves-into": [ "879" ],
			"base-stamina": 176,
			"base-attack": 140,
			"base-defense": 91,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRO_DIG",
				"CHRG_STE_IRONHEAD"
			],
			"height-avg": 1.2,
			"weight-avg": 100,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 12.5,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"879": {
			"dex-index": "879",
			"name": "Copperajah",
			"availability": {
				"in-game": false
			},
			"category": "Copperderm",
			"type": [ "Steel" ],
			"evolves-from": "878",
			"base-stamina": 263,
			"base-attack": 226,
			"base-defense": 126,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRO_DIG",
				"CHRG_STE_HEAVYSLAM",
				"CHRG_STE_IRONHEAD"
			],
			"height-avg": 1.2,
			"weight-avg": 100,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 12.5,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"879-G": {
			"dex-index": "879-G",
			"form-data": {
				"base": "879",
				"type": "Giga"
			}
		},
		"880": {
			"dex-index": "880",
			"name": "Dracozolt",
			"availability": {
				"in-game": false
			},
			"category": "Fossil",
			"type": [ "Electric", "Dragon" ],
			"base-stamina": 207,
			"base-attack": 195,
			"base-defense": 165,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 1.8,
			"weight-avg": 190,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 23.75,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"881": {
			"dex-index": "881",
			"name": "Arctozolt",
			"availability": {
				"in-game": false
			},
			"category": "Fossil",
			"type": [ "Electric", "Ice" ],
			"base-stamina": 207,
			"base-attack": 190,
			"base-defense": 166,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_ELE_THUNDERSHOCK"
			],
			"charged-moves": [
				"CHRG_ELE_DISCHARGE",
				"CHRG_ICE_AVALANCHE",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 2.3,
			"weight-avg": 150,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2875,
				"wt-std-dev": 18.75,
				"xxs": [ 1.127, 1.15 ],
				"xs": [ 1.15, 1.725 ],
				"m": [ 1.725, 2.875 ],
				"xl": [ 2.875, 3.45 ],
				"xxl": [ 3.45, 3.565 ]
			}
		},
		"882": {
			"dex-index": "882",
			"name": "Dracovish",
			"availability": {
				"in-game": false
			},
			"category": "Fossil",
			"type": [ "Water", "Dragon" ],
			"base-stamina": 207,
			"base-attack": 175,
			"base-defense": 185,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_BRINE",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 2.3,
			"weight-avg": 215,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2875,
				"wt-std-dev": 26.875,
				"xxs": [ 1.127, 1.15 ],
				"xs": [ 1.15, 1.725 ],
				"m": [ 1.725, 2.875 ],
				"xl": [ 2.875, 3.45 ],
				"xxl": [ 3.45, 3.565 ]
			}
		},
		"883": {
			"dex-index": "883",
			"name": "Arctovish",
			"availability": {
				"in-game": false
			},
			"category": "Fossil",
			"type": [ "Water", "Ice" ],
			"base-stamina": 207,
			"base-attack": 171,
			"base-defense": 185,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_WAT_BRINE",
				"CHRG_ICE_AVALANCHE",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 2,
			"weight-avg": 175,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 21.875,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"884": {
			"dex-index": "884",
			"name": "Duraludon",
			"availability": {
				"in-game": false
			},
			"category": "Alloy",
			"type": [ "Steel", "Dragon" ],
			"evolves-into": [ "1018" ],
			"base-stamina": 172,
			"base-attack": 239,
			"base-defense": 185,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_NOR_HYPERBEAM",
				"CHRG_STE_FLASHCANNON"
			],
			"height-avg": 1.8,
			"weight-avg": 40,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 5,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"884-G": {
			"dex-index": "884-G",
			"form-data": {
				"base": "884",
				"type": "Giga"
			}
		},
		"885": {
			"dex-index": "885",
			"name": "Dreepy",
			"availability": {
				"in-game": "2024-09-03"
			},
			"category": "Lingering",
			"type": [ "Dragon", "Ghost" ],
			"evolves-into": [ "886" ],
			"base-stamina": 99,
			"base-attack": 117,
			"base-defense": 61,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_NOR_QUICKATTACK"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.5,
			"weight-avg": 2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.25,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"886": {
			"dex-index": "886",
			"name": "Drakloak",
			"availability": {
				"in-game": "2024-09-03"
			},
			"category": "Caretaker",
			"type": [ "Dragon", "Ghost" ],
			"evolves-from": "885",
			"evolves-into": [ "887" ],
			"base-stamina": 169,
			"base-attack": 163,
			"base-defense": 105,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DRA_OUTRAGE"
			],
			"height-avg": 1.4,
			"weight-avg": 11,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 1.375,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"887": {
			"dex-index": "887",
			"name": "Dragapult",
			"availability": {
				"in-game": "2024-09-03"
			},
			"category": "Stealth",
			"type": [ "Dragon", "Ghost" ],
			"evolves-from": "886",
			"base-stamina": 204,
			"base-attack": 266,
			"base-defense": 170,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DRA_OUTRAGE",
				"CHRG_DRA_BREAKINGSWIPE"
			],
			"height-avg": 3,
			"weight-avg": 50,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.375,
				"wt-std-dev": 6.25,
				"xxs": [ 1.47, 1.5 ],
				"xs": [ 1.5, 2.25 ],
				"m": [ 2.25, 3.75 ],
				"xl": [ 3.75, 4.5 ],
				"xxl": [ 4.5, 5.25 ]
			}
		},
		"888-0": {
			"dex-index": "888-0",
			"name": "Zacian",
			"category": "Warrior",
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_DAR_SNARL",
				"FAST_NOR_QUICKATTACK",
				"FAST_FIR_FIREFANG"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_STE_IRONHEAD",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"height-avg": 2.8,
			"weight-avg": 110,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.35,
				"wt-std-dev": 13.75,
				"xxs": [ 1.372, 1.4 ],
				"xs": [ 1.4, 2.1 ],
				"m": [ 2.1, 3.5 ],
				"xl": [ 3.5, 4.2 ],
				"xxl": [ 4.2, 4.34 ]
			}
		},
		"888-H": {
			"dex-index": "888-H",
			"form-data": {
				"base": "888-0",
				"type": "idk",
				"form": "Hero of Many Battles",
				"form-ital": "Eroe di Mille Lotte"
			},
			"availability": {
				"in-game": "2021-08-20",
				"shiny": "2024-09-26"
			},
			"type": [ "Fairy" ],
			"base-stamina": 192,
			"base-attack": 254,
			"base-defense": 236
		},
		"888-C": {
			"dex-index": "888-C",
			"form-data": {
				"base": "888-0",
				"type": "idk",
				"form": "Crowned Sword",
				"form-ital": "Re delle Spade"
			},
			"availability": {
				"in-game": false
			},
			"type": [ "Fairy", "Steel" ],
			"base-stamina": 192,
			"base-attack": 332,
			"base-defense": 240
		},
		"889-0": {
			"dex-index": "889-0",
			"name": "Zamazenta",
			"category": "Warrior",
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_STE_METALCLAW",
				"FAST_DAR_SNARL",
				"FAST_NOR_QUICKATTACK",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_FAI_MOONBLAST",
				"CHRG_STE_IRONHEAD",
				"CHRG_DAR_CRUNCH",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"height-avg": 2.9,
			"weight-avg": 210,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3625,
				"wt-std-dev": 26.25,
				"xxs": [ 1.421, 1.45 ],
				"xs": [ 1.45, 2.175 ],
				"m": [ 2.175, 3.625 ],
				"xl": [ 3.625, 4.35 ],
				"xxl": [ 4.35, 4.495 ]
			}
		},
		"889-H": {
			"dex-index": "889-H",
			"form-data": {
				"base": "889-0",
				"type": "idk",
				"form": "Hero of Many Battles",
				"form-ital": "Eroe di Mille Lotte"
			},
			"availability": {
				"in-game": "2021-08-26",
				"shiny": "2024-10-04"
			},
			"type": [ "Fighting" ],
			"base-stamina": 192,
			"base-attack": 254,
			"base-defense": 236
		},
		"889-C": {
			"dex-index": "889-C",
			"form-data": {
				"base": "889-0",
				"type": "idk",
				"form": "Crowned Shield",
				"form-ital": "Re degli Scudi"
			},
			"availability": {
				"in-game": false
			},
			"type": [ "Fighting", "Steel" ],
			"base-stamina": 192,
			"base-attack": 250,
			"base-defense": 292
		},
		"890": {
			"dex-index": "890",
			"name": "Eternatus",
			"availability": {
				"in-game": false
			},
			"category": "Gigantic",
			"type": [ "Poison", "Dragon" ],
			"base-stamina": 268,
			"base-attack": 278,
			"base-defense": 192,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_POI_CROSSPOISON",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 20,
			"weight-avg": 950,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 2.5,
				"wt-std-dev": 118.75,
				"xxs": [ 9.8, 10 ],
				"xs": [ 10, 15 ],
				"m": [ 15, 25 ],
				"xl": [ 25, 30 ],
				"xxl": [ 30, 31 ]
			}
		},
		"890-G": {
			"dex-index": "890-G",
			"name": "Eternamax Eternatus",
			"form-data": {
				"base": "890",
				"type": "Giga"
			},
			"base-stamina": 452,
			"base-attack": 251,
			"base-defense": 505,
			"charged-moves": [
				"CHRG_POI_CROSSPOISON",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_NOR_HYPERBEAM"
			]
		},
		"891": {
			"dex-index": "891",
			"name": "Kubfu",
			"availability": {
				"in-game": false
			},
			"category": "Wushu",
			"type": [ "Fighting" ],
			"evolves-into": [ "892-S", "892-R" ],
			"base-stamina": 155,
			"base-attack": 170,
			"base-defense": 112,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"height-avg": 0.6,
			"weight-avg": 12,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.5,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"892-0": {
			"dex-index": "892-0",
			"name": "Urshifu",
			"availability": {
				"in-game": false
			},
			"category": "Wushu",
			"type": [ "Fighting", "Dark" ],
			"evolves-from": "891",
			"base-stamina": 225,
			"base-attack": 254,
			"base-defense": 177,
			"dynamax-class": 4,
			"height-avg": 1.9,
			"weight-avg": 105,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 13.125,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"892-S": {
			"dex-index": "892-S",
			"form-data": {
				"base": "892-0",
				"type": "idk",
				"name": "Single Strike Style",
				"name-ital": "Stile Singolcolpo"
			},
			"type": [ "Fighting", "Dark" ],
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_FIG_COUNTER",
				"FAST_DAR_SUCKERPUNCH"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_DAR_PAYBACK"
			]
		},
		"892-SG": {
			"dex-index": "892-SG",
			"form-data": {
				"base": "892",
				"type": "Giga"
			},
			"height-avg": 29
		},
		"892-R": {
			"dex-index": "892-R",
			"form-data": {
				"base": "892-0",
				"type": "idk",
				"name": "Rapid Strike Style",
				"name-ital": "Stile Pluricolpo"
			},
			"type": [ "Fighting", "Water" ],
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_FIG_COUNTER",
				"FAST_WAT_WATERFALL"
			],
			"charged-moves": [
				"CHRG_FIG_BRICKBREAK",
				"CHRG_FIG_DYNAMICPUNCH",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_WAT_AQUAJET"
			]
		},
		"892-RG": {
			"dex-index": "892-G",
			"form-data": {
				"base": "892",
				"type": "Giga"
			},
			"height-avg": 26,
			"size-data": {
				"xxs": [ 25.833, 25.85 ],
				"xs": [ 25.85, 26.275 ],
				"m": [ 26.275, 27.125 ],
				"xl": [ 27.125, 27.55 ],
				"xxl": [ 27.55, 27.975 ]
			}
		},
		"893": {
			"dex-index": "893",
			"name": "Zarude",
			"availability": {
				"in-game": "2021-10-01"
			},
			"category": "Rogue Monkey",
			"type": [ "Dark", "Grass" ],
			"base-stamina": 233,
			"base-attack": 242,
			"base-defense": 215,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_GRA_VINEWHIP",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_GRA_POWERWHIP",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_DAR_DARKPULSE"
			],
			"height-avg": 1.8,
			"weight-avg": 70,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 8.75,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"894": {
			"dex-index": "894",
			"name": "Regieleki",
			"availability": {
				"in-game": "2023-04-09",
				"shiny": "2024-11-27"
			},
			"category": "Electron",
			"type": [ "Electric" ],
			"base-stamina": 190,
			"base-attack": 250,
			"base-defense": 125,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_NOR_LOCKON",
				"FAST_ELE_VOLTSWITCH"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_ELE_THUNDER",
				"CHRG_ELE_ZAPCANNON"
			],
			"height-avg": 1.2,
			"weight-avg": 145,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 18.125,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"895": {
			"dex-index": "895",
			"name": "Regidrago",
			"availability": {
				"in-game": "2023-03-11",
				"shiny": "2024-11-27"
			},
			"category": "Dragon Orb",
			"type": [ "Dragon" ],
			"base-stamina": 400,
			"base-attack": 202,
			"base-defense": 101,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_DRA_OUTRAGE",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_DRA_BREAKINGSWIPE"
			],
			"height-avg": 2.1,
			"weight-avg": 200,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2625,
				"wt-std-dev": 25,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.255 ]
			}
		},
		"896": {
			"dex-index": "896",
			"name": "Glastrier",
			"availability": {
				"in-game": false
			},
			"category": "Wild Horse",
			"type": [ "Ice" ],
			"base-stamina": 225,
			"base-attack": 246,
			"base-defense": 223,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_ICE_AVALANCHE",
				"CHRG_ICE_ICYWIND",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 2.2,
			"weight-avg": 800,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.275,
				"wt-std-dev": 100,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 3.41 ]
			}
		},
		"897": {
			"dex-index": "897",
			"name": "Spectrier",
			"availability": {
				"in-game": false
			},
			"category": "Swift Horse",
			"type": [ "Ghost" ],
			"base-stamina": 205,
			"base-attack": 273,
			"base-defense": 146,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_DAR_FOULPLAY",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 2,
			"weight-avg": 44.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 5.5625,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"898": {
			"dex-index": "898",
			"name": "Calyrex",
			"availability": {
				"in-game": false
			},
			"category": "King",
			"type": [ "Psychic", "Grass" ],
			"base-stamina": 225,
			"base-attack": 162,
			"base-defense": 162,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_NOR_POUND",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 1.1,
			"weight-avg": 7.7,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 0.9625,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"898-I": {
			"dex-index": "898-I",
			"form-data": {
				"base": "898",
				"type": "fusion",
				"name": "Ice Rider",
				"name-ital": "Cavaliere Glaciale"
			},
			"category": "High King",
			"type": [ "Psychic", "Ice" ],
			"base-stamina": 205,
			"base-attack": 268,
			"base-defense": 246,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_ICE_AVALANCHE"
			],
			"height-avg": 2.4,
			"weight-avg": 809.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3,
				"wt-std-dev": 101.1375,
				"xxs": [ 1.176, 1.2 ],
				"xs": [ 1.2, 1.8 ],
				"m": [ 1.8, 3 ],
				"xl": [ 3, 3.6 ],
				"xxl": [ 3.6, 3.72 ]
			}
		},
		"898-S": {
			"dex-index": "898-S",
			"form-data": {
				"base": "898",
				"type": "fusion",
				"name": "Shadow Rider",
				"name-ital": "Cavaliere Spettrale"
			},
			"category": "High King",
			"type": [ "Psychic", "Ghost" ],
			"base-stamina": 205,
			"base-attack": 324,
			"base-defense": 194,
			"fast-moves": [
				"FAST_PSY_CONFUSION",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 2.4,
			"weight-avg": 53.6,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3,
				"wt-std-dev": 6.7,
				"xxs": [ 1.176, 1.2 ],
				"xs": [ 1.2, 1.8 ],
				"m": [ 1.8, 3 ],
				"xl": [ 3, 3.6 ],
				"xxl": [ 3.6, 3.72 ]
			}
		},
		"899": {
			"dex-index": "899",
			"name": "Wyrdeer",
			"availability": {
				"in-game": "2023-12-23",
				"shiny": "2023-12-23"
			},
			"category": "Big Horn",
			"type": [ "Normal", "Psychic" ],
			"evolves-from": "234",
			"base-stamina": 230,
			"base-attack": 206,
			"base-defense": 145,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_NOR_STOMP",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_BUG_MEGAHORN",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.8,
			"weight-avg": 95.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 11.8875,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"900": {
			"dex-index": "900",
			"name": "Kleavor",
			"category": "Axe",
			"type": [ "Bug", "Rock" ],
			"evolves-from": "123",
			"base-stamina": 172,
			"base-attack": 253,
			"base-defense": 174,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_QUICKATTACK",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.8,
			"weight-avg": 89,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 11.125,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"901": {
			"dex-index": "901",
			"name": "Ursaluna",
			"availability": {
				"in-game": "2022-11-12",
				"shiny": "2022-11-12",
				"shadow": "2022-11-12",
				"shiny-shadow": "2022-11-12"
			},
			"category": "Peat",
			"type": [ "Ground", "Normal" ],
			"evolves-from": "217",
			"base-stamina": 277,
			"base-attack": 243,
			"base-defense": 181,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_FIR_FIREPUNCH",
				"CHRG_ELE_THUNDERPUNCH",
				"CHRG_FLY_AERIALACE",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_GRA_TRAILBLAZE",
				"CHRG_NOR_SWIFT"
			],
			"special-charged-moves": [
				"CHRG_GRO_HIGHHORSEPOWER"
			],
			"height-avg": 2.4,
			"weight-avg": 290,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3,
				"wt-std-dev": 36.25,
				"xxs": [ 1.176, 1.2 ],
				"xs": [ 1.2, 1.8 ],
				"m": [ 1.8, 3 ],
				"xl": [ 3, 3.6 ],
				"xxl": [ 3.6, 3.72 ]
			}
		},
		"901-B": {
			"dex-index": "901-B",
			"form-data": {
				"base": "901",
				"type": "idk",
				"name": "Bloodmoon",
				"name-ital": "Luna Cremisi"
			},
			"availability": {
			}
		},
		"902": {
			"dex-index": "902",
			"name": "Basculegion",
			"availability": {
				"in-game": false
			},
			"variants": [ "Male", "Female" ],
			"category": "Big Fish",
			"type": [ "Water", "Ghost" ],
			"evolves-from": "550-W",
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.3,
				"wt-std-dev": 36.25,
				"xxs": [ 1.47, 1.5 ],
				"xs": [ 1.5, 2.25 ],
				"m": [ 2.25, 3.75 ],
				"xl": [ 3.75, 4.5 ],
				"xxl": [ 4.5, 5.25 ]
			}
		},
		"903": {
			"dex-index": "903",
			"name": "Sneasler",
			"availability": {
				"in-game": "2022-07-27",
				"shiny": "2023-12-05",
				"shadow": "2023-10-26"
			},
			"category": "Free Climb",
			"type": [ "Fighting", "Poison" ],
			"evolves-from": "215-1",
			"base-stamina": 190,
			"base-attack": 259,
			"base-defense": 158,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_POI_POISONJAB",
				"FAST_GHO_SHADOWCLAW"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_BUG_XSCISSOR"
			],
			"height-avg": 1.3,
			"weight-avg": 43,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 5.375,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.015 ]
			}
		},
		"904": {
			"dex-index": "904",
			"name": "Overqwil",
			"availability": {
				"in-game": "2022-07-27",
				"shiny": "2024-02-16"
			},
			"category": "Pin Cluster",
			"type": [ "Dark", "Poison" ],
			"evolves-from": "211-H",
			"base-stamina": 198,
			"base-attack": 222,
			"base-defense": 171,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_WAT_AQUATAIL",
				"CHRG_ICE_ICEBEAM",
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_DAR_DARKPULSE",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 2.5,
			"weight-avg": 60.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 7.5625,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 4.375 ]
			}
		},
		"905-0": {
			"dex-index": "905-0",
			"name": "Enamorus",
			"category": "Love-Hate",
			"type": [ "Fairy", "Flying" ],
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_PSY_ZENHEADBUTT",
				"FAST_FAI_FAIRYWIND"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_FLY_FLY",
				"CHRG_GRA_GRASSKNOT"
			],
			"height-avg": 1.6,
			"weight-avg": 48,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 6,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"905-I": {
			"dex-index": "905-I",
			"form-data": {
				"base": "905-0",
				"type": "idk",
				"form": "Incarnate Forme",
				"form-ital": "Forma Incarnazione"
			},
			"availability": {
				"in-game": "2024-02-14"
			},
			"base-stamina": 179,
			"base-attack": 281,
			"base-defense": 162
		},
		"905-T": {
			"dex-index": "905-T",
			"form-data": {
				"base": "905-0",
				"type": "idk",
				"form": "Therian Forme",
				"form-ital": "Forma Totem"
			},
			"availability": {
				"in-game": false
			},
			"base-stamina": 179,
			"base-attack": 250,
			"base-defense": 201
		},
		"906": {
			"dex-index": "906",
			"name": "Sprigatito",
			"availability": {
				"in-game": "2023-09-05",
				"shiny": "2025-01-05"
			},
			"category": "Grass Cat",
			"type": [ "Grass" ],
			"evolves-into": [ "907" ],
			"base-stamina": 120,
			"base-attack": 116,
			"base-defense": 99,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_LEAFAGE",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 0.4,
			"weight-avg": 4.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.5125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"907": {
			"dex-index": "907",
			"name": "Floragato",
			"availability": {
				"in-game": "2023-09-05",
				"shiny": "2025-01-05"
			},
			"category": "Grass Cat",
			"type": [ "Grass" ],
			"evolves-from": "906",
			"evolves-into": [ "908" ],
			"base-stamina": 156,
			"base-attack": 157,
			"base-defense": 128,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_LEAFAGE",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_GRA_GRASSKNOT",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRA_ENERGYBALL"
			],
			"height-avg": 0.9,
			"weight-avg": 12.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 1.525,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.395 ]
			}
		},
		"908": {
			"dex-index": "908",
			"name": "Meowscarada",
			"availability": {
				"in-game": "2023-09-05",
				"shiny": "2025-01-05"
			},
			"category": "Magician",
			"type": [ "Grass", "Dark" ],
			"evolves-from": "907",
			"base-stamina": 183,
			"base-attack": 233,
			"base-defense": 153,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_LEAFAGE",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRA_FLOWERTRICK",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_DAR_NIGHTSLASH"
			],
			"special-charged-moves": [
				"CHRG_GRA_FRENZYPLANT"
			],
			"height-avg": 1.5,
			"weight-avg": 31.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 3.9,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"909": {
			"dex-index": "909",
			"name": "Fuecoco",
			"availability": {
				"in-game": "2023-09-05"
			},
			"category": "Fire Croc",
			"type": [ "Fire" ],
			"evolves-into": [ "910" ],
			"base-stamina": 167,
			"base-attack": 112,
			"base-defense": 96,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_INCINERATE",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.4,
			"weight-avg": 9.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1.225,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"910": {
			"dex-index": "910",
			"name": "Crocalor",
			"availability": {
				"in-game": "2023-09-05"
			},
			"category": "Fire Croc",
			"type": [ "Fire" ],
			"evolves-from": "909",
			"evolves-into": [ "911" ],
			"base-stamina": 191,
			"base-attack": 162,
			"base-defense": 134,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_INCINERATE",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 1,
			"weight-avg": 30.7,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 3.8375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"911": {
			"dex-index": "911",
			"name": "Skeledirge",
			"availability": {
				"in-game": "2023-09-05"
			},
			"category": "Singer",
			"type": [ "Fire", "Ghost" ],
			"evolves-from": "910",
			"base-stamina": 232,
			"base-attack": 207,
			"base-defense": 178,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_FIR_INCINERATE",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_FAI_DISARMINGVOICE",
				"CHRG_DAR_CRUNCH",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 1.6,
			"weight-avg": 326.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 40.8125,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"912": {
			"dex-index": "912",
			"name": "Quaxly",
			"availability": {
				"in-game": "2023-09-05"
			},
			"category": "Duckling",
			"type": [ "Water" ],
			"evolves-into": [ "913" ],
			"base-stamina": 146,
			"base-attack": 120,
			"base-defense": 86,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_FLY_AERIALACE",
				"CHRG_WAT_LIQUIDATION"
			],
			"height-avg": 0.5,
			"weight-avg": 6.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 0.7625,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"913": {
			"dex-index": "913",
			"name": "Quaxwell",
			"availability": {
				"in-game": "2023-09-05"
			},
			"category": "Practicing",
			"type": [ "Water" ],
			"evolves-from": "912",
			"evolves-into": [ "914" ],
			"base-stamina": 172,
			"base-attack": 162,
			"base-defense": 123,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_FLY_AERIALACE",
				"CHRG_WAT_LIQUIDATION"
			],
			"height-avg": 1.2,
			"weight-avg": 21.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.6875,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"914": {
			"dex-index": "914",
			"name": "Quaquaval",
			"availability": {
				"in-game": "2023-09-05"
			},
			"category": "Dancer",
			"type": [ "Water", "Fighting" ],
			"evolves-from": "913",
			"base-stamina": 198,
			"base-attack": 236,
			"base-defense": 159,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_FLY_WINGATTACK"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_FLY_AERIALACE",
				"CHRG_WAT_LIQUIDATION",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"height-avg": 1.8,
			"weight-avg": 61.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 7.7375,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"915": {
			"dex-index": "915",
			"name": "Lechonk",
			"availability": {
				"in-game": "2023-09-05",
				"shiny": "2023-09-05"
			},
			"category": "Hog",
			"type": [ "Normal" ],
			"evolves-into": [ "916-M", "916-F" ],
			"base-stamina": 144,
			"base-attack": 81,
			"base-defense": 79,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_GRA_TRAILBLAZE",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 0.5,
			"weight-avg": 10.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.275,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"916-0": {
			"dex-index": "916-0",
			"name": "Oinkologne",
			"availability": {
				"in-game": "2023-09-05",
				"shiny": "2023-09-05"
			},
			"category": "Hog",
			"type": [ "Normal" ],
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_GRA_TRAILBLAZE",
				"CHRG_NOR_BODYSLAM"
			],
			"height-avg": 1,
			"weight-avg": 120,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.125,
				"wt-std-dev": 15,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.55 ]
			}
		},
		"916-M": {
			"dex-index": "916-M",
			"form-data": {
				"base": "916-0",
				"type": "Gender",
				"form": "Male"
			},
			"base-stamina": 242,
			"base-attack": 186,
			"base-defense": 153
		},
		"916-F": {
			"dex-index": "916-F",
			"form-data": {
				"base": "916-0",
				"type": "Gender",
				"form": "Female"
			},
			"base-stamina": 251,
			"base-attack": 169,
			"base-defense": 162
		},
		"917": {
			"dex-index": "917",
			"name": "Tarountula",
			"availability": {
				"in-game": false
			},
			"category": "String Ball",
			"type": [ "Bug" ],
			"evolves-into": [ "918" ],
			"base-stamina": 111,
			"base-attack": 70,
			"base-defense": 77,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_BUG_LUNGE"
			],
			"height-avg": 0.3,
			"weight-avg": 4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.5,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"918": {
			"dex-index": "918",
			"name": "Spidops",
			"availability": {
				"in-game": false
			},
			"category": "Trap",
			"type": [ "Bug" ],
			"evolves-from": "917",
			"base-stamina": 155,
			"base-attack": 139,
			"base-defense": 166,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_BUG_LUNGE",
				"CHRG_ROC_ROCKTOMB"
			],
			"height-avg": 1,
			"weight-avg": 16.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 2.0625,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"919": {
			"dex-index": "919",
			"name": "Nymble",
			"availability": {
				"in-game": "2023-09-10"
			},
			"category": "Grasshopper",
			"type": [ "Bug" ],
			"evolves-into": [ "920" ],
			"base-stamina": 107,
			"base-attack": 81,
			"base-defense": 65,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_GRA_TRAILBLAZE",
				"CHRG_BUG_BUGBUZZ"
			],
			"height-avg": 0.2,
			"weight-avg": 1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.125,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"920": {
			"dex-index": "920",
			"name": "Lokix",
			"availability": {
				"in-game": "2023-09-10"
			},
			"category": "Grasshopper",
			"type": [ "Bug", "Dark" ],
			"evolves-from": "919",
			"base-stamina": 174,
			"base-attack": 199,
			"base-defense": 144,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_DAR_SUCKERPUNCH",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_BUG_XSCISSOR",
				"CHRG_GRA_TRAILBLAZE",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_DAR_DARKPULSE"
			],
			"height-avg": 1,
			"weight-avg": 17.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 2.1875,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"921": {
			"dex-index": "921",
			"name": "Pawmi",
			"availability": {
				"in-game": "2023-09-10"
			},
			"category": "Mouse",
			"type": [ "Electric" ],
			"evolves-into": [ "922" ],
			"base-stamina": 128,
			"base-attack": 95,
			"base-defense": 45,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_WILDCHARGE"
			],
			"height-avg": 0.3,
			"weight-avg": 2.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.3125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"922": {
			"dex-index": "922",
			"name": "Pawmo",
			"availability": {
				"in-game": "2023-09-10"
			},
			"category": "Mouse",
			"type": [ "Electric", "Fighting" ],
			"evolves-from": "921",
			"evolves-into": [ "923" ],
			"base-stamina": 155,
			"base-attack": 147,
			"base-defense": 82,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_ELE_CHARGEBEAM"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 0.4,
			"weight-avg": 6.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.8125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"923": {
			"dex-index": "923",
			"name": "Pawmot",
			"availability": {
				"in-game": "2023-09-10"
			},
			"category": "Hands-On",
			"type": [ "Electric", "Fighting" ],
			"evolves-from": "922",
			"base-stamina": 172,
			"base-attack": 232,
			"base-defense": 141,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ELE_SPARK",
				"FAST_ELE_CHARGEBEAM",
				"FAST_FIG_LOWKICK"
			],
			"charged-moves": [
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_WILDCHARGE",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_ELE_THUNDERPUNCH"
			],
			"height-avg": 0.9,
			"weight-avg": 41,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 5.125,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.395 ]
			}
		},
		"924": {
			"dex-index": "924",
			"name": "Tandemaus",
			"availability": {
				"in-game": "2024-07-17"
			},
			"category": "Couple",
			"type": [ "Normal" ],
			"evolves-into": [ "925-1", "925-2" ],
			"base-stamina": 137,
			"base-attack": 98,
			"base-defense": 90,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TAKEDOWN",
				"FAST_GRO_MUDSHOT",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_NOR_SWIFT",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 0.3,
			"weight-avg": 1.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.225,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"925-0": {
			"dex-index": "925-0",
			"name": "Maushold",
			"availability": {
				"in-game": "2024-07-17"
			},
			"category": "Family",
			"type": [ "Normal" ],
			"evolves-from": "924",
			"base-stamina": 179,
			"base-attack": 159,
			"base-defense": 157,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_NOR_TAKEDOWN",
				"FAST_GRO_MUDSHOT",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_NOR_SWIFT",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_CRUNCH"
			],
			"showcase-baseline": "" // TODO
		},
		"925-F": {
			"dex-index": "925-F",
			"form-data": {
				"base": "925-0",
				"type": "fuck idk yet",
				"form": "Family of Four",
				"form-ital": "Quadrifamiglia"
			},
			"height-avg": 0.3,
			"weight-avg": 2.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.2875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"925-T": {
			"dex-index": "925-T",
			"form-data": {
				"base": "925-0",
				"type": "fuck idk yet",
				"form": "Family of Three",
				"form-ital": "Trifamiglia"
			},
			"height-avg": 0.3,
			"weight-avg": 2.3,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.2875,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"926": {
			"dex-index": "926",
			"name": "Fidough",
			"availability": {
				"in-game": "2025-01-03"
			},
			"category": "Puppy",
			"type": [ "Fairy" ],
			"evolves-into": [ "927" ],
			"base-stamina": 114,
			"base-attack": 102,
			"base-defense": 126,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_PSY_PSYCHICFANGS"
			],
			"height-avg": 0.3,
			"weight-avg": 10.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 1.3625,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"927": {
			"dex-index": "927",
			"name": "Dachsbun",
			"availability": {
				"in-game": "2025-01-03"
			},
			"category": "Dog",
			"type": [ "Fairy" ],
			"evolves-from": "926",
			"base-stamina": 149,
			"base-attack": 159,
			"base-defense": 212,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FAI_CHARM",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_FAI_PLAYROUGH",
				"CHRG_PSY_PSYCHICFANGS"
			],
			"height-avg": 0.5,
			"weight-avg": 14.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 1.8625,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"928": {
			"dex-index": "928",
			"name": "Smoliv",
			"availability": {
				"in-game": "2023-10-12",
				"shiny": "2024-11-07"
			},
			"category": "Olive",
			"type": [ "Grass", "Normal" ],
			"evolves-into": [ "929" ],
			"base-stamina": 121,
			"base-attack": 100,
			"base-defense": 89,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_NOR_TACKLE"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.3,
			"weight-avg": 6.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.8125,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"929": {
			"dex-index": "929",
			"name": "Dolliv",
			"availability": {
				"in-game": "2023-10-12",
				"shiny": "2024-11-07"
			},
			"category": "Olive",
			"type": [ "Grass", "Normal" ],
			"evolves-from": "928",
			"evolves-into": [ "930" ],
			"base-stamina": 141,
			"base-attack": 137,
			"base-defense": 131,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_NOR_TACKLE",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 0.6,
			"weight-avg": 11.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.4875,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"930": {
			"dex-index": "930",
			"name": "Arboliva",
			"availability": {
				"in-game": "2023-10-12",
				"shiny": "2024-11-07"
			},
			"category": "Olive",
			"type": [ "Grass", "Normal" ],
			"evolves-from": "929",
			"base-stamina": 186,
			"base-attack": 219,
			"base-defense": 189,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRA_RAZORLEAF",
				"FAST_NOR_TACKLE",
				"FAST_GRA_MAGICALLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_SEEDBOMB",
				"CHRG_GRA_ENERGYBALL",
				"CHRG_GRO_EARTHPOWER",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.4,
			"weight-avg": 48.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 6.025,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"931": {
			"dex-index": "931",
			"name": "Squawkabilly",
			"availability": {
				"in-game": false
			},
			"variants": [
				"Blue Plume", "Green Plume",
				"White Plume", "Yellow Plume"
			],
			"variants-ital": [
				"Piume Azzurre", "Piume Verde",
				"Piume Bianche", "Piume Gialle"
			],
			"category": "Parrot",
			"type": [ "Normal", "Flying" ],
			"base-stamina": 193,
			"base-attack": 185,
			"base-defense": 105,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FLY_FLY"
			],
			"height-avg": 0.6,
			"weight-avg": 2.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.3,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"932": {
			"dex-index": "932",
			"name": "Nacli",
			"availability": {
				"in-game": false
			},
			"category": "Rock Salt",
			"type": [ "Rock" ],
			"evolves-into": [ "933" ],
			"base-stamina": 146,
			"base-attack": 95,
			"base-defense": 108,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 0.4,
			"weight-avg": 16,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.05,
				"wt-std-dev": 2,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.8 ]
			}
		},
		"933": {
			"dex-index": "933",
			"name": "Naclstack",
			"availability": {
				"in-game": false
			},
			"category": "Rock Salt",
			"type": [ "Rock" ],
			"evolves-from": "932",
			"evolves-into": [ "934" ],
			"base-stamina": 155,
			"base-attack": 105,
			"base-defense": 160,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_SMACKDOWN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKBLAST",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 0.6,
			"weight-avg": 105,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.075,
				"wt-std-dev": 13.125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.2 ]
			}
		},
		"934": {
			"dex-index": "934",
			"name": "Garganacl",
			"availability": {
				"in-game": false
			},
			"category": "Rock Salt",
			"type": [ "Rock" ],
			"evolves-from": "933",
			"base-stamina": 225,
			"base-attack": 171,
			"base-defense": 212,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_SMACKDOWN",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_ROC_ANCIENTPOWER"
			],
			"height-avg": 2.3,
			"weight-avg": 240,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2875,
				"wt-std-dev": 30,
				"xxs": [ 1.127, 1.15 ],
				"xs": [ 1.15, 1.725 ],
				"m": [ 1.725, 2.875 ],
				"xl": [ 2.875, 3.45 ],
				"xxl": [ 3.45, 4.6 ]
			}
		},
		"935": {
			"dex-index": "935",
			"name": "Charcadet",
			"availability": {
				"in-game": "2024-03-05"
			},
			"category": "Fire Child",
			"type": [ "Fire" ],
			"evolves-into": [ "936", "937" ],
			"base-stamina": 120,
			"base-attack": 92,
			"base-defense": 74,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.6,
			"weight-avg": 10.5,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.3125,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"936": {
			"dex-index": "936",
			"name": "Armarouge",
			"availability": {
				"in-game": "2024-03-05"
			},
			"category": "Fire Warrior",
			"type": [ "Fire", "Psychic" ],
			"evolves-from": "935",
			"base-stamina": 198,
			"base-attack": 234,
			"base-defense": 185,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_PSY_PSYSHOCK"
			],
			"height-avg": 1.5,
			"weight-avg": 85,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 10.625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"937": {
			"dex-index": "937",
			"name": "Ceruledge",
			"availability": {
				"in-game": "2024-03-05"
			},
			"category": "Fire Blades",
			"type": [ "Fire", "Ghost" ],
			"evolves-from": "935",
			"base-stamina": 181,
			"base-attack": 239,
			"base-defense": 189,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIR_EMBER",
				"FAST_FIR_INCINERATE"
			],
			"charged-moves": [
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_HEATWAVE",
				"CHRG_FIR_FLAMETHROWER",
				"CHRG_GHO_SHADOWBALL"
			],
			"height-avg": 1.6,
			"weight-avg": 62,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 7.75,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"938": {
			"dex-index": "938",
			"name": "Tadbulb",
			"availability": {
				"in-game": "2023-11-07"
			},
			"category": "EleTadpole",
			"type": [ "Electric" ],
			"evolves-into": [ "939" ],
			"base-stamina": 156,
			"base-attack": 104,
			"base-defense": 73,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_ELE_PARABOLICCHARGE",
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_ZAPCANNON"
			],
			"height-avg": 0.3,
			"weight-avg": 0.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.05,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.465 ]
			}
		},
		"939": {
			"dex-index": "939",
			"name": "Bellibolt",
			"availability": {
				"in-game": "2023-11-07"
			},
			"category": "EleFrog",
			"type": [ "Electric" ],
			"evolves-from": "938",
			"base-stamina": 240,
			"base-attack": 184,
			"base-defense": 165,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_ELE_PARABOLICCHARGE",
				"CHRG_ELE_DISCHARGE",
				"CHRG_ELE_ZAPCANNON"
			],
			"height-avg": 1.2,
			"weight-avg": 113,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 14.125,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"940": {
			"dex-index": "940",
			"name": "Wattrel",
			"availability": {
				"in-game": false
			},
			"category": "Storm Petrel",
			"type": [ "Electric", "Flying" ],
			"evolves-into": [ "941" ],
			"base-stamina": 120,
			"base-attack": 105,
			"base-defense": 75,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_FLY_PECK"
			],
			"charged-moves": [
				"CHRG_FLY_ACROBATICS",
				"CHRG_FLY_AERIALACE",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 0.4,
			"weight-avg": 3.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.45,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.7 ]
			}
		},
		"941": {
			"dex-index": "941",
			"name": "Kilowattrel",
			"availability": {
				"in-game": false
			},
			"category": "Frigatebird",
			"type": [ "Electric", "Flying" ],
			"evolves-from": "940",
			"base-stamina": 172,
			"base-attack": 221,
			"base-defense": 132,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_FLY_AIRSLASH"
			],
			"charged-moves": [
				"CHRG_FLY_ACROBATICS",
				"CHRG_FLY_AERIALACE",
				"CHRG_ELE_THUNDERBOLT"
			],
			"height-avg": 1.4,
			"weight-avg": 38.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.175,
				"wt-std-dev": 4.825,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.45 ]
			}
		},
		"942": {
			"dex-index": "942",
			"name": "Maschiff",
			"availability": {
				"in-game": false
			},
			"category": "Rascal",
			"type": [ "Dark" ],
			"evolves-into": [ "943" ],
			"base-stamina": 155,
			"base-attack": 140,
			"base-defense": 108,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_DAR_PAYBACK",
				"CHRG_GRO_DIG"
			],
			"height-avg": 0.5,
			"weight-avg": 16,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 2,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.775 ]
			}
		},
		"943": {
			"dex-index": "943",
			"name": "Mabosstiff",
			"availability": {
				"in-game": false
			},
			"category": "Boss",
			"type": [ "Dark" ],
			"evolves-from": "942",
			"base-stamina": 190,
			"base-attack": 230,
			"base-defense": 168,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_DAR_CRUNCH",
				"CHRG_DAR_PAYBACK",
				"CHRG_GRO_DIG"
			],
			"height-avg": 1.1,
			"weight-avg": 61,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1375,
				"wt-std-dev": 7.625,
				"xxs": [ 0.539, 0.55 ],
				"xs": [ 0.55, 0.825 ],
				"m": [ 0.825, 1.375 ],
				"xl": [ 1.375, 1.65 ],
				"xxl": [ 1.65, 1.705 ]
			}
		},
		"944": {
			"dex-index": "944",
			"name": "Shroodle",
			"availability": {
				"in-game": "2025-01-15"
			},
			"category": "Toxic Mouse",
			"type": [ "Poison", "Normal" ],
			"evolves-into": [ "945" ],
			"base-stamina": 120,
			"base-attack": 124,
			"base-defense": 70,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_POI_ACIDSPRAY",
				"CHRG_POI_POISONFANG",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.2,
			"weight-avg": 0.7,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.0875,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.31 ]
			}
		},
		"945": {
			"dex-index": "945",
			"name": "Grafaiai",
			"availability": {
				"in-game": "2025-01-15"
			},
			"category": "Toxic Monkey",
			"type": [ "Poison", "Normal" ],
			"evolves-from": "944",
			"base-stamina": 160,
			"base-attack": 199,
			"base-defense": 149,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_POI_ACIDSPRAY",
				"CHRG_POI_POISONFANG",
				"CHRG_POI_SLUDGEBOMB"
			],
			"height-avg": 0.7,
			"weight-avg": 27.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 3.4,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"946": {
			"dex-index": "946",
			"name": "Bramblin",
			"availability": {
				"in-game": false
			},
			"category": "Tumbleweed",
			"type": [ "Grass", "Ghost" ],
			"evolves-into": [ "947" ],
			"base-stamina": 120,
			"base-attack": 121,
			"base-defense": 64,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_GRA_POWERWHIP"
			],
			"height-avg": 0.6,
			"weight-avg": 0.6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.075,
				"wt-std-dev": 0.075,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 1.05 ]
			}
		},
		"947": {
			"dex-index": "947",
			"name": "Brambleghast",
			"availability": {
				"in-game": false
			},
			"category": "Tumbleweed",
			"type": [ "Grass", "Ghost" ],
			"evolves-from": "946",
			"base-stamina": 146,
			"base-attack": 228,
			"base-defense": 144,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_GHO_HEX",
				"FAST_GRA_BULLETSEED"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWSNEAK",
				"CHRG_GHO_NIGHTSHADE",
				"CHRG_GRA_POWERWHIP"
			],
			"height-avg": 1.2,
			"weight-avg": 6,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.15,
				"wt-std-dev": 0.75,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.1 ]
			}
		},
		"948": {
			"dex-index": "948",
			"name": "Toedscool",
			"availability": {
				"in-game": false
			},
			"category": "Woodear",
			"type": [ "Ground", "Grass" ],
			"evolves-into": [ "949" ],
			"base-stamina": 120,
			"base-attack": 97,
			"base-defense": 149,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHPOWER",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_NOR_WRAP"
			],
			"height-avg": 0.9,
			"weight-avg": 33,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 4.125,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.395 ]
			}
		},
		"949": {
			"dex-index": "949",
			"name": "Toedscruel",
			"availability": {
				"in-game": false
			},
			"category": "Woodear",
			"type": [ "Ground", "Grass" ],
			"evolves-from": "948",
			"base-stamina": 190,
			"base-attack": 166,
			"base-defense": 209,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GRO_MUDSLAP",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_GRO_EARTHPOWER",
				"CHRG_GRA_SEEDBOMB",
				"CHRG_POI_ACIDSPRAY"
			],
			"height-avg": 1.9,
			"weight-avg": 58,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 7.25,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"950": {
			"dex-index": "950",
			"name": "Klawf",
			"availability": {
				"in-game": false
			},
			"category": "Ambush",
			"type": [ "Rock" ],
			"base-stamina": 172,
			"base-attack": 184,
			"base-defense": 185,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_ROC_ROCKTOMB",
				"CHRG_GRO_BULLDOZE"
			],
			"height-avg": 1.3,
			"weight-avg": 79,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 9.875,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"951": {
			"dex-index": "951",
			"name": "Capsakid",
			"availability": {
				"in-game": false
			},
			"category": "Spicy Pepper",
			"type": [ "Grass" ],
			"evolves-into": [ "952" ],
			"base-stamina": 137,
			"base-attack": 118,
			"base-defense": 76,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_LEAFAGE",
				"FAST_GRA_RAZORLEAF"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFSTORM",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_SEEDBOMB"
			],
			"height-avg": 0.3,
			"weight-avg": 3,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"952": {
			"dex-index": "952",
			"name": "Scovillain",
			"availability": {
				"in-game": false
			},
			"category": "Spicy Pepper",
			"type": [ "Grass", "Fire" ],
			"evolves-from": "951",
			"base-stamina": 163,
			"base-attack": 216,
			"base-defense": 130,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GRA_LEAFAGE",
				"FAST_FIR_FIREFANG"
			],
			"charged-moves": [
				"CHRG_GRA_LEAFSTORM",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_FIR_OVERHEAT",
				"CHRG_FIR_FLAMETHROWER"
			],
			"height-avg": 0.9,
			"weight-avg": 15,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 1.875,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.575 ]
			}
		},
		"953": {
			"dex-index": "953",
			"name": "Rellor",
			"availability": {
				"in-game": false
			},
			"category": "Rolling",
			"type": [ "Bug" ],
			"evolves-into": [ "954" ],
			"base-stamina": 121,
			"base-attack": 86,
			"base-defense": 108,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_BUG_STRUGGLEBUG"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_BUG_LUNGE"
			],
			"height-avg": 0.2,
			"weight-avg": 1,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.125,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"954": {
			"dex-index": "954",
			"name": "Rabsca",
			"availability": {
				"in-game": false
			},
			"category": "Rolling",
			"type": [ "Bug", "Psychic" ],
			"evolves-from": "953",
			"base-stamina": 181,
			"base-attack": 201,
			"base-defense": 178,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_BUG_BUGBITE",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_BUG_BUGBUZZ",
				"CHRG_BUG_LUNGE",
				"CHRG_PSY_PSYBEAM"
			],
			"height-avg": 0.3,
			"weight-avg": 3.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 0.4375,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"955": {
			"dex-index": "955",
			"name": "Flittle",
			"availability": {
				"in-game": false
			},
			"category": "Frill",
			"type": [ "Psychic" ],
			"evolves-into": [ "956" ],
			"base-stamina": 102,
			"base-attack": 105,
			"base-defense": 60,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 0.2,
			"weight-avg": 1.5,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.025,
				"wt-std-dev": 0.1875,
				"xxs": [ 0.098, 0.1 ],
				"xs": [ 0.1, 0.15 ],
				"m": [ 0.15, 0.25 ],
				"xl": [ 0.25, 0.3 ],
				"xxl": [ 0.3, 0.35 ]
			}
		},
		"956": {
			"dex-index": "956",
			"name": "Espathra",
			"availability": {
				"in-game": false
			},
			"category": "Ostrich",
			"type": [ "Psychic" ],
			"evolves-from": "955",
			"base-stamina": 216,
			"base-attack": 204,
			"base-defense": 127,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FLY_PECK",
				"FAST_PSY_CONFUSION"
			],
			"charged-moves": [
				"CHRG_PSY_PSYBEAM",
				"CHRG_PSY_PSYSHOCK",
				"CHRG_PSY_PSYCHIC"
			],
			"height-avg": 1.9,
			"weight-avg": 90,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 11.25,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 3.325 ]
			}
		},
		"957": {
			"dex-index": "957",
			"name": "Tinkatink",
			"availability": {
				"in-game": false
			},
			"category": "Metalsmith",
			"type": [ "Fairy", "Steel" ],
			"evolves-into": [ "958" ],
			"base-stamina": 137,
			"base-attack": 85,
			"base-defense": 110,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FAI_FAIRYWIND",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_BRUTALSWING",
				"CHRG_STE_FLASHCANNON"
			],
			"height-avg": 0.4,
			"weight-avg": 8.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 1.1125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"958": {
			"dex-index": "958",
			"name": "Tinkatuff",
			"availability": {
				"in-game": false
			},
			"category": "Hammer",
			"type": [ "Fairy", "Steel" ],
			"evolves-from": "957",
			"evolves-into": [ "959" ],
			"base-stamina": 163,
			"base-attack": 109,
			"base-defense": 145,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FAI_FAIRYWIND",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_BRUTALSWING",
				"CHRG_STE_FLASHCANNON"
			],
			"height-avg": 0.7,
			"weight-avg": 59.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 7.3875,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"959": {
			"dex-index": "959",
			"name": "Tinkaton",
			"availability": {
				"in-game": false
			},
			"category": "Hammer",
			"type": [ "Fairy", "Steel" ],
			"evolves-from": "958",
			"base-stamina": 198,
			"base-attack": 155,
			"base-defense": 196,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FAI_FAIRYWIND",
				"FAST_FIG_ROCKSMASH"
			],
			"charged-moves": [
				"CHRG_FAI_PLAYROUGH",
				"CHRG_DAR_BRUTALSWING",
				"CHRG_STE_FLASHCANNON",
				"CHRG_STE_HEAVYSLAM"
			],
			"height-avg": 0.7,
			"weight-avg": 112.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 14.1,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.085 ]
			}
		},
		"960": {
			"dex-index": "960",
			"name": "Wiglett",
			"availability": {
				"in-game": "2024-04-22"
			},
			"category": "Garden Eel",
			"type": [ "Water" ],
			"evolves-into": [ "961" ],
			"base-stamina": 67,
			"base-attack": 109,
			"base-defense": 52,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_WAT_LIQUIDATION",
				"CHRG_GRO_DIG",
				"CHRG_WAT_SURF"
			],
			"height-avg": 1.2,
			"weight-avg": 1.8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 0.225,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"961": {
			"dex-index": "961",
			"name": "Wugtrio",
			"availability": {
				"in-game": "2024-04-22"
			},
			"category": "Garden Eel",
			"type": [ "Water" ],
			"evolves-from": "960",
			"base-stamina": 111,
			"base-attack": 205,
			"base-defense": 136,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_WAT_WATERGUN",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_WAT_LIQUIDATION",
				"CHRG_GRO_DIG",
				"CHRG_WAT_SURF"
			],
			"height-avg": 1.2,
			"weight-avg": 5.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 0.675,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"962": {
			"dex-index": "962",
			"name": "Bombirdier",
			"availability": {
				"in-game": "2023-09-10",
				"shiny": "2023-09-10"
			},
			"category": "Item Drop",
			"type": [ "Flying", "Dark" ],
			"base-stamina": 172,
			"base-attack": 198,
			"base-defense": 172,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_ROC_ROCKTHROW"
			],
			"charged-moves": [
				"CHRG_DAR_PAYBACK",
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_FLY"
			],
			"height-avg": 1.5,
			"weight-avg": 42.9,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.3625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"963": {
			"dex-index": "963",
			"name": "Finizen",
			"availability": {
				"in-game": false
			},
			"category": "Dolphin",
			"type": [ "Water" ],
			"evolves-into": [ "964-0" ],
			"base-stamina": 172,
			"base-attack": 90,
			"base-defense": 80,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_FAI_CHARM"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 1.3,
			"weight-avg": 60.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 7.525,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"964-0": {
			"dex-index": "964-0",
			"name": "Palafin",
			"availability": {
				"in-game": false
			},
			"type": [ "Water" ],
			"evolves-from": "963",
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_FAI_CHARM",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_WAT_AQUAJET",
				"CHRG_WAT_WATERPULSE",
				"CHRG_ICE_ICYWIND",
				"CHRG_FIG_DRAINPUNCH",
				"CHRG_FLY_ACROBATICS"
			],
			"showcase-baseline": "" // TODO
		},
		"964-Z": {
			"dex-index": "964-Z",
			"form-data": {
				"base": "964-0",
				"type": "battle?",
				"form": "Zero Form",
				"form-ital": "Forma Ingenua"
			},
			"category": "Dolphin",
			"base-stamina": 225,
			"base-attack": 143,
			"base-defense": 144,
			"height-avg": 1.3,
			"weight-avg": 60.2,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 7.525,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.275 ]
			}
		},
		"964-H": {
			"dex-index": "964-H",
			"form-data": {
				"base": "964-0",
				"type": "battle?",
				"form": "Hero Form",
				"form-ital": "Forma Possente"
			},
			"category": "Hero",
			"base-stamina": 225,
			"base-attack": 322,
			"base-defense": 196,
			"height-avg": 1.8,
			"weight-avg": 97.4,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 12.175,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"965": {
			"dex-index": "965",
			"name": "Varoom",
			"availability": {
				"in-game": "2024-01-27"
			},
			"category": "Single-Cyl",
			"type": [ "Steel", "Poison" ],
			"evolves-into": [ "966" ],
			"base-stamina": 128,
			"base-attack": 123,
			"base-defense": 107,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_POI_ACIDSPRAY",
				"CHRG_POI_GUNKSHOT",
				"CHRG_STE_GYROBALL"
			],
			"height-avg": 1,
			"weight-avg": 35,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.125,
				"wt-std-dev": 4.375,
				"xxs": [ 0.49, 0.5 ],
				"xs": [ 0.5, 0.75 ],
				"m": [ 0.75, 1.25 ],
				"xl": [ 1.25, 1.5 ],
				"xxl": [ 1.5, 1.75 ]
			}
		},
		"966": {
			"dex-index": "966",
			"name": "Revavroom",
			"availability": {
				"in-game": "2024-01-27"
			},
			"category": "Multi-Cyl",
			"type": [ "Steel", "Poison" ],
			"evolves-from": "965",
			"base-stamina": 190,
			"base-attack": 229,
			"base-defense": 168,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_POI_POISONJAB"
			],
			"charged-moves": [
				"CHRG_POI_ACIDSPRAY",
				"CHRG_POI_GUNKSHOT",
				"CHRG_STE_GYROBALL",
				"CHRG_FIR_OVERHEAT"
			],
			"height-avg": 1.8,
			"weight-avg": 120,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.225,
				"wt-std-dev": 15,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 3.15 ]
			}
		},
		"967": {
			"dex-index": "967",
			"name": "Cyclizar",
			"availability": {
				"in-game": false
			},
			"category": "Mount",
			"type": [ "Dragon", "Normal" ],
			"base-stamina": 172,
			"base-attack": 205,
			"base-defense": 142,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONTAIL",
				"FAST_NOR_TAKEDOWN"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_NOR_BODYSLAM",
				"CHRG_GRA_TRAILBLAZE"
			],
			"height-avg": 1.6,
			"weight-avg": 63,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2,
				"wt-std-dev": 7.875,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.48 ]
			}
		},
		"968": {
			"dex-index": "968",
			"name": "Orthworm",
			"availability": {
				"in-game": false
			},
			"category": "Earthworm",
			"type": [ "Steel" ],
			"base-stamina": 172,
			"base-attack": 161,
			"base-defense": 219,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_STE_IRONTAIL",
				"FAST_GRO_MUDSLAP"
			],
			"charged-moves": [
				"CHRG_ROC_ROCKTOMB",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_STE_IRONHEAD"
			],
			"height-avg": 2.5,
			"weight-avg": 310,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 38.75,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 5 ]
			}
		},
		"969": {
			"dex-index": "969",
			"name": "Glimmet",
			"availability": {
				"in-game": false
			},
			"category": "Ore",
			"type": [ "Rock", "Poison" ],
			"evolves-into": [ "970" ],
			"base-stamina": 134,
			"base-attack": 187,
			"base-defense": 104,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_POI_SLUDGEWAVE"
			],
			"height-avg": 0.7,
			"weight-avg": 8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0875,
				"wt-std-dev": 1,
				"xxs": [ 0.343, 0.35 ],
				"xs": [ 0.35, 0.525 ],
				"m": [ 0.525, 0.875 ],
				"xl": [ 0.875, 1.05 ],
				"xxl": [ 1.05, 1.225 ]
			}
		},
		"970": {
			"dex-index": "970",
			"name": "Glimmora",
			"availability": {
				"in-game": false
			},
			"category": "Ore",
			"type": [ "Rock", "Poison" ],
			"evolves-from": "969",
			"base-stamina": 195,
			"base-attack": 246,
			"base-defense": 177,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ROC_ROCKTHROW",
				"FAST_ROC_SMACKDOWN"
			],
			"charged-moves": [
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_POI_SLUDGEWAVE"
			],
			"height-avg": 1.5,
			"weight-avg": 45,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 5.625,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.625 ]
			}
		},
		"971": {
			"dex-index": "971",
			"name": "Greavard",
			"availability": {
				"in-game": "2023-10-19"
			},
			"category": "Ghost Dog",
			"type": [ "Ghost" ],
			"evolves-into": [ "972" ],
			"base-stamina": 137,
			"base-attack": 105,
			"base-defense": 106,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_GRO_DIG",
				"CHRG_PSY_PSYCHICFANGS"
			],
			"height-avg": 0.6,
			"weight-avg": 35,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 4.375,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"972": {
			"dex-index": "972",
			"name": "Houndstone",
			"availability": {
				"in-game": "2023-10-19"
			},
			"category": "Ghost Dog",
			"type": [ "Ghost" ],
			"evolves-from": "971",
			"base-stamina": 176,
			"base-attack": 186,
			"base-defense": 195,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_GHO_LICK",
				"FAST_DAR_BITE"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_GRO_DIG",
				"CHRG_PSY_PSYCHICFANGS"
			],
			"height-avg": 2,
			"weight-avg": 15,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 1.875,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"973": {
			"dex-index": "973",
			"name": "Flamigo",
			"availability": {
				"in-game": false
			},
			"category": "Synchronize",
			"type": [ "Flying", "Fighting" ],
			"base-stamina": 193,
			"base-attack": 227,
			"base-defense": 145,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_FLY_WINGATTACK",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_FLY_AERIALACE",
				"CHRG_FLY_BRAVEBIRD",
				"CHRG_FIG_CLOSECOMBAT"
			],
			"height-avg": 1.6,
			"weight-avg": 37,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2,
				"wt-std-dev": 4.625,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 2.8 ]
			}
		},
		"974": {
			"dex-index": "974",
			"name": "Cetoddle",
			"availability": {
				"in-game": "2023-12-18",
				"shiny": "2024-12-22"
			},
			"category": "Terra Whale",
			"type": [ "Ice" ],
			"evolves-into": [ "975" ],
			"base-stamina": 239,
			"base-attack": 119,
			"base-defense": 80,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_ICESHARD",
				"FAST_NOR_TACKLE",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_ICE_AVALANCHE",
				"CHRG_STE_HEAVYSLAM"
			],
			"height-avg": 1.2,
			"weight-avg": 45,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 5.625,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"975": {
			"dex-index": "975",
			"name": "Cetitan",
			"availability": {
				"in-game": "2023-12-18",
				"shiny": "2024-12-22"
			},
			"category": "Terra Whale",
			"type": [ "Ice" ],
			"evolves-from": "974",
			"base-stamina": 347,
			"base-attack": 208,
			"base-defense": 123,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_ICE_ICESHARD",
				"FAST_NOR_TACKLE",
				"FAST_ICE_POWDERSNOW"
			],
			"charged-moves": [
				"CHRG_NOR_BODYSLAM",
				"CHRG_ICE_AVALANCHE",
				"CHRG_STE_HEAVYSLAM"
			],
			"height-avg": 4.5,
			"weight-avg": 700,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.5625,
				"wt-std-dev": 87.5,
				"xxs": [ 2.205, 2.25 ],
				"xs": [ 2.25, 3.375 ],
				"m": [ 3.375, 5.625 ],
				"xl": [ 5.625, 6.75 ],
				"xxl": [ 6.75, 6.975 ]
			}
		},
		"976": {
			"dex-index": "976",
			"name": "Veluza",
			"availability": {
				"in-game": false
			},
			"category": "Jettison",
			"type": [ "Water", "Psychic" ],
			"base-stamina": 207,
			"base-attack": 196,
			"base-defense": 139,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_ICE_ICEFANG",
				"FAST_PSY_ZENHEADBUTT"
			],
			"charged-moves": [
				"CHRG_WAT_WATERPULSE",
				"CHRG_PSY_PSYCHICFANGS",
				"CHRG_GRO_DRILLRUN",
				"CHRG_DAR_CRUNCH"
			],
			"height-avg": 2.5,
			"weight-avg": 90,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 11.25,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 4.375 ]
			}
		},
		"977": {
			"dex-index": "977",
			"name": "Dondozo",
			"availability": {
				"in-game": false
			},
			"category": "Big Catfish",
			"type": [ "Water" ],
			"base-stamina": 312,
			"base-attack": 176,
			"base-defense": 178,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_WAT_WATERFALL",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_WAT_SURF",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_WAT_LIQUIDATION"
			],
			"height-avg": 12,
			"weight-avg": 220,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 1.5,
				"wt-std-dev": 27.5,
				"xxs": [ 5.88, 6 ],
				"xs": [ 6, 9 ],
				"m": [ 9, 15 ],
				"xl": [ 15, 18 ],
				"xxl": [ 18, 21 ]
			}
		},
		"978": {
			"dex-index": "978",
			"name": "Tatsugiri",
			"availability": {
				"in-game": false
			},
			"variants": [ "Curly", "Droopy", "Stretchy" ],
			"variants-ital": [ "Arcuata", "Adagiata", "Tesa" ],
			"category": "Mimicry",
			"type": [ "Dragon", "Water" ],
			"base-stamina": 169,
			"base-attack": 226,
			"base-defense": 166,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_NOR_TAKEDOWN",
				"FAST_WAT_WATERGUN"
			],
			"charged-moves": [
				"CHRG_DRA_OUTRAGE",
				"CHRG_WAT_SURF",
				"CHRG_WAT_HYDROPUMP",
				"CHRG_WAT_MUDDYWATER"
			],
			"height-avg": 0.3,
			"weight-avg": 8,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0375,
				"wt-std-dev": 1,
				"xxs": [ 0.147, 0.15 ],
				"xs": [ 0.15, 0.225 ],
				"m": [ 0.225, 0.375 ],
				"xl": [ 0.375, 0.45 ],
				"xxl": [ 0.45, 0.525 ]
			}
		},
		"979": {
			"dex-index": "979",
			"name": "Annihilape",
			"availability": {
				"in-game": "2024-01-19",
				"shiny": "2024-01-19",
				"shadow": "2024-10-08"
			},
			"category": "Rage Monkey",
			"type": [ "Fighting", "Ghost" ],
			"evolves-from": "57",
			"base-stamina": 242,
			"base-attack": 220,
			"base-defense": 178,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_FIG_LOWKICK",
				"FAST_FIG_COUNTER"
			],
			"charged-moves": [
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_FIG_LOWSWEEP",
				"CHRG_DAR_NIGHTSLASH",
				"CHRG_ICE_ICEPUNCH",
				"CHRG_GHO_SHADOWBALL"
			],
			"special-charged-moves": [
				"CHRG_GHO_RAGEFIST"
			],
			"height-avg": 1.2,
			"weight-avg": 56,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 7,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"980": {
			"dex-index": "980",
			"name": "Clodsire",
			"availability": {
				"in-game": "2023-11-05",
				"shiny": "2023-11-05"
			},
			"category": "Spiny Fish",
			"type": [ "Poison", "Ground" ],
			"base-stamina": 277,
			"base-attack": 127,
			"base-defense": 151,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_POI_POISONSTING",
				"FAST_GRO_MUDSHOT"
			],
			"charged-moves": [
				"CHRG_POI_SLUDGEBOMB",
				"CHRG_GRO_EARTHQUAKE",
				"CHRG_ROC_STONEEDGE",
				"CHRG_POI_ACIDSPRAY",
				"CHRG_WAT_WATERPULSE"
			],
			"special-charged-moves": [
				"CHRG_BUG_MEGAHORN"
			],
			"height-avg": 1.8,
			"weight-avg": 223,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 27.875,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"981": {
			"dex-index": "981",
			"name": "Farigiraf",
			"availability": {
				"in-game": false
			},
			"category": "Long Neck",
			"type": [ "Normal", "Psychic" ],
			"evolves-from": "203",
			"base-stamina": 260,
			"base-attack": 209,
			"base-defense": 136,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_NOR_TACKLE",
				"FAST_PSY_CONFUSION",
				"FAST_FIG_DOUBLEKICK"
			],
			"charged-moves": [
				"CHRG_PSY_PSYCHIC",
				"CHRG_ELE_THUNDERBOLT",
				"CHRG_PSY_MIRRORCOAT",
				"CHRG_PSY_PSYCHICFANGS"
			],
			"height-avg": 3.2,
			"weight-avg": 160,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.4,
				"wt-std-dev": 20,
				"xxs": [ 1.568, 1.6 ],
				"xs": [ 1.6, 2.4 ],
				"m": [ 2.4, 4 ],
				"xl": [ 4, 4.8 ],
				"xxl": [ 4.8, 6.4 ]
			}
		},
		"982-0": {
			"dex-index": "982-0",
			"name": "Dudunsparce",
			"availability": {
				"in-game": false
			},
			"category": "Land Snake",
			"type": [ "Normal" ],
			"base-stamina": 268,
			"base-attack": 188,
			"base-defense": 150,
			"dynamax-class": 2,
			"fast-moves": [
				"FAST_DAR_BITE",
				"FAST_GHO_ASTONISH",
				"FAST_ROC_ROLLOUT"
			],
			"charged-moves": [
				"CHRG_GRO_DIG",
				"CHRG_ROC_ROCKSLIDE",
				"CHRG_GRO_DRILLRUN"
			],
			"showcase-baseline": "" // TODO
		},
		"982-D": {
			"dex-index": "982-D",
			"form-data": {
				"base": "982-0",
				"type": "idk",
				"name": "Two-Segment Form",
				"name-ital": "Forma Bimetamero"
			},
			"height-avg": 3.6,
			"weight-avg": 39.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.45,
				"wt-std-dev": 4.9,
				"xxs": [ 1.764, 1.8 ],
				"xs": [ 1.8, 2.7 ],
				"m": [ 2.7, 4.5 ],
				"xl": [ 4.5, 5.4 ],
				"xxl": [ 5.4, 5.58 ]
			}
		},
		"982-T": {
			"dex-index": "982-T",
			"form-data": {
				"base": "982-0",
				"type": "idk",
				"name": "Three-Segment Form",
				"name-ital": "Forma Trimetamero"
			},
			"height-avg": 4.5,
			"weight-avg": 47.4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.5625,
				"wt-std-dev": 5.925,
				"xxs": [ 2.205, 2.25 ],
				"xs": [ 2.25, 3.375 ],
				"m": [ 3.375, 5.625 ],
				"xl": [ 5.625, 6.75 ],
				"xxl": [ 6.75, 6.975 ]
			}
		},
		"983": {
			"dex-index": "983",
			"name": "Kingambit",
			"availability": {
				"in-game": false
			},
			"category": "Big Blade",
			"type": [ "Dark", "Steel" ],
			"evolves-from": "625",
			"base-stamina": 225,
			"base-attack": 238,
			"base-defense": 203,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DAR_SNARL",
				"FAST_STE_METALCLAW"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_STE_IRONHEAD",
				"CHRG_BUG_XSCISSOR",
				"CHRG_FIG_FOCUSBLAST"
			],
			"height-avg": 2,
			"weight-avg": 120,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 15,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"984": {
			"dex-index": "984",
			"name": "Great Tusk",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Ground", "Fighting" ],
			"base-stamina": 251,
			"base-attack": 249,
			"base-defense": 209,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 2.2,
			"weight-avg": 320,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.275,
				"wt-std-dev": 40,
				"xxs": [ 1.078, 1.1 ],
				"xs": [ 1.1, 1.65 ],
				"m": [ 1.65, 2.75 ],
				"xl": [ 2.75, 3.3 ],
				"xxl": [ 3.3, 4.4 ]
			}
		},
		"985": {
			"dex-index": "985",
			"name": "Scream Tail",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Fairy", "Psychic" ],
			"base-stamina": 251,
			"base-attack": 139,
			"base-defense": 234,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 1.2,
			"weight-avg": 8,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 1,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"986": {
			"dex-index": "986",
			"name": "Brute Bonnet",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Grass", "Dark" ],
			"base-stamina": 244,
			"base-attack": 232,
			"base-defense": 190,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 1.2,
			"weight-avg": 21,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 2.625,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"987": {
			"dex-index": "987",
			"name": "Flutter Mane",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Ghost", "Fairy" ],
			"base-stamina": 146,
			"base-attack": 280,
			"base-defense": 235,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 1.4,
			"weight-avg": 4,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 0.5,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"988": {
			"dex-index": "988",
			"name": "Slither Wing",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Bug", "Fighting" ],
			"base-stamina": 198,
			"base-attack": 261,
			"base-defense": 193,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 3.2,
			"weight-avg": 92,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.4,
				"wt-std-dev": 11.5,
				"xxs": [ 1.568, 1.6 ],
				"xs": [ 1.6, 2.4 ],
				"m": [ 2.4, 4 ],
				"xl": [ 4, 4.8 ],
				"xxl": [ 4.8, 4.96 ]
			}
		},
		"989": {
			"dex-index": "989",
			"name": "Sandy Shocks",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Electric", "Ground" ],
			"base-stamina": 198,
			"base-attack": 244,
			"base-defense": 195,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 2.3,
			"weight-avg": 60,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2875,
				"wt-std-dev": 7.5,
				"xxs": [ 1.127, 1.15 ],
				"xs": [ 1.15, 1.725 ],
				"m": [ 1.725, 2.875 ],
				"xl": [ 2.875, 3.45 ],
				"xxl": [ 3.45, 3.565 ]
			}
		},
		"990": {
			"dex-index": "990",
			"name": "Iron Treads",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Ground", "Steel" ],
			"base-stamina": 207,
			"base-attack": 227,
			"base-defense": 216,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.9,
			"weight-avg": 240,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1125,
				"wt-std-dev": 30,
				"xxs": [ 0.441, 0.45 ],
				"xs": [ 0.45, 0.675 ],
				"m": [ 0.675, 1.125 ],
				"xl": [ 1.125, 1.35 ],
				"xxl": [ 1.35, 1.8 ]
			}
		},
		"991": {
			"dex-index": "991",
			"name": "Iron Bundle",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Ice", "Water" ],
			"base-stamina": 148,
			"base-attack": 266,
			"base-defense": 211,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 0.6,
			"weight-avg": 11,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.075,
				"wt-std-dev": 1.375,
				"xxs": [ 0.294, 0.3 ],
				"xs": [ 0.3, 0.45 ],
				"m": [ 0.45, 0.75 ],
				"xl": [ 0.75, 0.9 ],
				"xxl": [ 0.9, 0.93 ]
			}
		},
		"992": {
			"dex-index": "992",
			"name": "Iron Hands",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Fighting", "Electric" ],
			"base-stamina": 319,
			"base-attack": 245,
			"base-defense": 177,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 1.8,
			"weight-avg": 380.7,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.225,
				"wt-std-dev": 47.5875,
				"xxs": [ 0.882, 0.9 ],
				"xs": [ 0.9, 1.35 ],
				"m": [ 1.35, 2.25 ],
				"xl": [ 2.25, 2.7 ],
				"xxl": [ 2.7, 2.79 ]
			}
		},
		"993": {
			"dex-index": "993",
			"name": "Iron Jugulis",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Dark", "Flying" ],
			"base-stamina": 214,
			"base-attack": 249,
			"base-defense": 179,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 1.3,
			"weight-avg": 111,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.1625,
				"wt-std-dev": 13.875,
				"xxs": [ 0.637, 0.65 ],
				"xs": [ 0.65, 0.975 ],
				"m": [ 0.975, 1.625 ],
				"xl": [ 1.625, 1.95 ],
				"xxl": [ 1.95, 2.6 ]
			}
		},
		"994": {
			"dex-index": "994",
			"name": "Iron Moth",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Fire", "Poison" ],
			"base-stamina": 190,
			"base-attack": 281,
			"base-defense": 196,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 1.2,
			"weight-avg": 36,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.15,
				"wt-std-dev": 4.5,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 2.4 ]
			}
		},
		"995": {
			"dex-index": "995",
			"name": "Iron Thorns",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Rock", "Electric" ],
			"base-stamina": 225,
			"base-attack": 250,
			"base-defense": 200,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 1.6,
			"weight-avg": 303,
			"size-data": {
				"class": 2.00,
				"ht-std-dev": 0.2,
				"wt-std-dev": 37.875,
				"xxs": [ 0.784, 0.8 ],
				"xs": [ 0.8, 1.2 ],
				"m": [ 1.2, 2 ],
				"xl": [ 2, 2.4 ],
				"xxl": [ 2.4, 3.2 ]
			}
		},
		"996": {
			"dex-index": "996",
			"name": "Frigibax",
			"availability": {
				"in-game": "2023-09-10"
			},
			"category": "Ice Fin",
			"type": [ "Dragon", "Ice" ],
			"evolves-into": [ "997" ],
			"base-stamina": 163,
			"base-attack": 134,
			"base-defense": 86,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_ICE_AVALANCHE",
				"CHRG_DRA_OUTRAGE",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 0.5,
			"weight-avg": 17,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.0625,
				"wt-std-dev": 2.125,
				"xxs": [ 0.245, 0.25 ],
				"xs": [ 0.25, 0.375 ],
				"m": [ 0.375, 0.625 ],
				"xl": [ 0.625, 0.75 ],
				"xxl": [ 0.75, 0.875 ]
			}
		},
		"997": {
			"dex-index": "997",
			"name": "Arctibax",
			"availability": {
				"in-game": "2023-09-10"
			},
			"category": "Ice Fin",
			"type": [ "Dragon", "Ice" ],
			"evolves-from": "996",
			"evolves-into": [ "998" ],
			"base-stamina": 207,
			"base-attack": 173,
			"base-defense": 128,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_ICE_AVALANCHE",
				"CHRG_DRA_OUTRAGE",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 0.8,
			"weight-avg": 30,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.1,
				"wt-std-dev": 3.75,
				"xxs": [ 0.392, 0.4 ],
				"xs": [ 0.4, 0.6 ],
				"m": [ 0.6, 1 ],
				"xl": [ 1, 1.2 ],
				"xxl": [ 1.2, 1.4 ]
			}
		},
		"998": {
			"dex-index": "998",
			"name": "Baxcalibur",
			"availability": {
				"in-game": "2023-09-10"
			},
			"category": "Ice Dragon",
			"type": [ "Dragon", "Ice" ],
			"evolves-from": "997",
			"base-stamina": 229,
			"base-attack": 254,
			"base-defense": 168,
			"dynamax-class": 3,
			"fast-moves": [
				"FAST_DRA_DRAGONBREATH",
				"FAST_ICE_ICEFANG"
			],
			"charged-moves": [
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_ICE_AVALANCHE",
				"CHRG_DRA_OUTRAGE",
				"CHRG_ICE_BLIZZARD",
				"CHRG_ICE_ICYWIND"
			],
			"height-avg": 2.1,
			"weight-avg": 210,
			"size-data": {
				"class": 1.75,
				"ht-std-dev": 0.2625,
				"wt-std-dev": 26.25,
				"xxs": [ 1.029, 1.05 ],
				"xs": [ 1.05, 1.575 ],
				"m": [ 1.575, 2.625 ],
				"xl": [ 2.625, 3.15 ],
				"xxl": [ 3.15, 3.675 ]
			}
		},
		"999-0": {
			"dex-index": "999-0",
			"name": "Gimmighoul",
			"type": [ "Ghost" ],
			"evolves-into": [ "1000" ],
			"base-stamina": 128,
			"base-attack": 140,
			"base-defense": 76,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GHO_ASTONISH"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL"
			],
			"showcase-baseline": "" // TODO
		},
		"999-R": {
			"dex-index": "999-R",
			"form-data": {
				"base": "999-0",
				"type": "idk",
				"name": "Roaming Form",
				"name-ital": "Forma Ambulante"
			},
			"availability": {
				"in-game": "2023-02-27"
			},
			"category": "Coin Hunter",
			"height-avg": 0.1,
			"weight-avg": 0.1,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.0125,
				"wt-std-dev": 0.0125,
				"xxs": [ 0.049, 0.05 ],
				"xs": [ 0.05, 0.075 ],
				"m": [ 0.075, 0.125 ],
				"xl": [ 0.125, 0.15 ],
				"xxl": [ 0.15, 0.155 ]
			}
		},
		"999-C": {
			"dex-index": "999-C",
			"form-data": {
				"base": "999-0",
				"type": "idk",
				"name": "Chest Form",
				"name-ital": "Forma Scrigno"
			},
			"availability": {
				"in-game": false
			},
			"category": "Coin Chest",
			"height-avg": 0.3,
			"weight-avg": 5
		},
		"1000": {
			"dex-index": "1000",
			"name": "Gholdengo",
			"availability": {
				"in-game": "2023-02-27"
			},
			"category": "Coin Entity",
			"type": [ "Steel", "Ghost" ],
			"evolves-from": "999",
			"base-stamina": 202,
			"base-attack": 252,
			"base-defense": 190,
			"dynamax-class": 1,
			"fast-moves": [
				"FAST_GHO_ASTONISH",
				"FAST_GHO_HEX"
			],
			"charged-moves": [
				"CHRG_GHO_SHADOWBALL",
				"CHRG_FAI_DAZZLINGGLEAM",
				"CHRG_FIG_FOCUSBLAST"
			],
			"height-avg": 1.2,
			"weight-avg": 30,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.15,
				"wt-std-dev": 3.75,
				"xxs": [ 0.588, 0.6 ],
				"xs": [ 0.6, 0.9 ],
				"m": [ 0.9, 1.5 ],
				"xl": [ 1.5, 1.8 ],
				"xxl": [ 1.8, 1.86 ]
			}
		},
		"1001": {
			"dex-index": "1001",
			"name": "Wo-Chien",
			"availability": {
				"in-game": false
			},
			"category": "Ruinous",
			"type": [ "Dark", "Grass" ],
			"base-stamina": 198,
			"base-attack": 186,
			"base-defense": 242,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_GRA_MAGICALLEAF",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_GRA_GRASSKNOT",
				"CHRG_GRA_LEAFSTORM"
			],
			"height-avg": 1.5,
			"weight-avg": 74.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.1875,
				"wt-std-dev": 9.275,
				"xxs": [ 0.735, 0.75 ],
				"xs": [ 0.75, 1.125 ],
				"m": [ 1.125, 1.875 ],
				"xl": [ 1.875, 2.25 ],
				"xxl": [ 2.25, 2.325 ]
			}
		},
		"1002": {
			"dex-index": "1002",
			"name": "Chien-Pao",
			"availability": {
				"in-game": false
			},
			"category": "Ruinous",
			"type": [ "Dark", "Ice" ],
			"base-stamina": 190,
			"base-attack": 261,
			"base-defense": 167,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ICE_POWDERSNOW",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_ICE_AVALANCHE",
				"CHRG_ICE_BLIZZARD"
			],
			"height-avg": 1.9,
			"weight-avg": 152.2,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.2375,
				"wt-std-dev": 19.025,
				"xxs": [ 0.931, 0.95 ],
				"xs": [ 0.95, 1.425 ],
				"m": [ 1.425, 2.375 ],
				"xl": [ 2.375, 2.85 ],
				"xxl": [ 2.85, 2.945 ]
			}
		},
		"1003": {
			"dex-index": "1003",
			"name": "Ting-Lu",
			"availability": {
				"in-game": false
			},
			"category": "Ruinous",
			"type": [ "Dark", "Ground" ],
			"base-stamina": 321,
			"base-attack": 194,
			"base-defense": 203,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_GRO_MUDSHOT",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_GRO_BULLDOZE",
				"CHRG_GRO_EARTHQUAKE"
			],
			"height-avg": 2.7,
			"weight-avg": 669.7,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3375,
				"wt-std-dev": 83.7125,
				"xxs": [ 1.323, 1.35 ],
				"xs": [ 1.35, 2.025 ],
				"m": [ 2.025, 3.375 ],
				"xl": [ 3.375, 4.05 ],
				"xxl": [ 4.05, 4.185 ]
			}
		},
		"1004": {
			"dex-index": "1004",
			"name": "Chi-Yu",
			"availability": {
				"in-game": false
			},
			"category": "Ruinous",
			"type": [ "Dark", "Fire" ],
			"base-stamina": 146,
			"base-attack": 269,
			"base-defense": 221,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FIR_INCINERATE",
				"FAST_DAR_SNARL"
			],
			"charged-moves": [
				"CHRG_DAR_DARKPULSE",
				"CHRG_FIR_FLAMECHARGE",
				"CHRG_FIR_FLAMEWHEEL"
			],
			"height-avg": 0.4,
			"weight-avg": 4.9,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.05,
				"wt-std-dev": 0.6125,
				"xxs": [ 0.196, 0.2 ],
				"xs": [ 0.2, 0.3 ],
				"m": [ 0.3, 0.5 ],
				"xl": [ 0.5, 0.6 ],
				"xxl": [ 0.6, 0.62 ]
			}
		},
		"1005": {
			"dex-index": "1005",
			"name": "Roaring Moon",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Dragon", "Dark" ],
			"base-stamina": 233,
			"base-attack": 280,
			"base-defense": 196,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 2,
			"weight-avg": 380,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.25,
				"wt-std-dev": 47.5,
				"xxs": [ 0.98, 1 ],
				"xs": [ 1, 1.5 ],
				"m": [ 1.5, 2.5 ],
				"xl": [ 2.5, 3 ],
				"xxl": [ 3, 3.1 ]
			}
		},
		"1006": {
			"dex-index": "1006",
			"name": "Iron Valiant",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Fairy", "Fighting" ],
			"base-stamina": 179,
			"base-attack": 279,
			"base-defense": 171,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_WAT_SPLASH"
			],
			"charged-moves": [
				"CHRG_NOR_STRUGGLE"
			],
			"height-avg": 1.4,
			"weight-avg": 35,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.175,
				"wt-std-dev": 4.375,
				"xxs": [ 0.686, 0.7 ],
				"xs": [ 0.7, 1.05 ],
				"m": [ 1.05, 1.75 ],
				"xl": [ 1.75, 2.1 ],
				"xxl": [ 2.1, 2.17 ]
			}
		},
		"1007": {
			"dex-index": "1007",
			"name": "Koraidon",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Fighting", "Dragon" ],
			"base-stamina": 205,
			"base-attack": 263,
			"base-defense": 223,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_FIG_ROCKSMASH",
				"FAST_DRA_DRAGONTAIL"
			],
			"charged-moves": [
				"CHRG_NOR_GIGAIMPACT",
				"CHRG_DRA_DRAGONCLAW",
				"CHRG_FIG_CLOSECOMBAT",
				"CHRG_DRA_OUTRAGE"
			],
			"height-avg": 2.5,
			"weight-avg": 303,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.3125,
				"wt-std-dev": 37.875,
				"xxs": [ 1.225, 1.25 ],
				"xs": [ 1.25, 1.875 ],
				"m": [ 1.875, 3.125 ],
				"xl": [ 3.125, 3.75 ],
				"xxl": [ 3.75, 3.875 ]
			}
		},
		"1008": {
			"dex-index": "1008",
			"name": "Miraidon",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Electric", "Dragon" ],
			"base-stamina": 205,
			"base-attack": 263,
			"base-defense": 223,
			"dynamax-class": 4,
			"fast-moves": [
				"FAST_ELE_THUNDERSHOCK",
				"FAST_DRA_DRAGONBREATH"
			],
			"charged-moves": [
				"CHRG_NOR_HYPERBEAM",
				"CHRG_DRA_DRAGONPULSE",
				"CHRG_ELE_THUNDER",
				"CHRG_DRA_OUTRAGE"
			],
			"height-avg": 3.5,
			"weight-avg": 240,
			"size-data": {
				"class": 1.55,
				"ht-std-dev": 0.4375,
				"wt-std-dev": 30,
				"xxs": [ 1.715, 1.75 ],
				"xs": [ 1.75, 2.625 ],
				"m": [ 2.625, 4.375 ],
				"xl": [ 4.375, 5.25 ],
				"xxl": [ 5.25, 5.425 ]
			}
		},
		"1009": {
			"dex-index": "1009",
			"name": "Walking Wake",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Water", "Dragon" ],
			"height-avg": 3.5,
			"weight-avg": 280.0
		},
		"1010": {
			"dex-index": "1010",
			"name": "Iron Leaves",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Grass", "Psychic" ],
			"height-avg": 1.5,
			"weight-avg": 125.0
		},
		"1011": {
			"dex-index": "1011",
			"name": "Dipplin",
			"availability": {
				"in-game": false
			},
			"category": "Candy Apple",
			"type": [ "Grass", "Dragon" ],
			"evolves-from": "840",
			"evolves-into": [ "1019" ],
			"height-avg": 0.4,
			"weight-avg": 4.4
		},
		"1012": {
			"dex-index": "1012",
			"name": "Poltchageist",
			"availability": {
				"in-game": false
			},
			"category": "Matcha",
			"type": [ "Grass", "Ghost" ],
			"evolves-into": [ "1013" ],
			"height-avg": 0.1,
			"weight-avg": 1.1
		},
		"1013": {
			"dex-index": "1013",
			"name": "Sinistcha",
			"availability": {
				"in-game": false
			},
			"category": "Matcha",
			"type": [ "Grass", "Ghost" ],
			"evolves-from": "1012",
			"height-avg": 0.2,
			"weight-avg": 2.2
		},
		"1014": {
			"dex-index": "1014",
			"name": "Okidogi",
			"availability": {
				"in-game": false
			},
			"category": "Retainer",
			"type": [ "Poison", "Fighting" ],
			"height-avg": 1.8,
			"weight-avg": 92.0
		},
		"1015": {
			"dex-index": "1015",
			"name": "Munkidori",
			"availability": {
				"in-game": false
			},
			"category": "Retainer",
			"type": [ "Poison", "Psychic" ],
			"height-avg": 1.0,
			"weight-avg": 12.2
		},
		"1016": {
			"dex-index": "1016",
			"name": "Fezandipiti",
			"availability": {
				"in-game": false
			},
			"category": "Retainer",
			"type": [ "Poison", "Fairy" ],
			"height-avg": 1.4,
			"weight-avg": 30.1
		},
		"1017-0": {
			"dex-index": "1017-0",
			"name": "Ogerpon",
			"availability": {
				"in-game": false
			},
			"category": "Mask",
			"type": [ "Grass" ],
			"height-avg": 1.2,
			"weight-avg": 39.8
		},
		"1017-T": {
			"dex-index": "1017-T",
			"form-data": {
				"base": "1017-0",
				"type": "type difference",
				"form": "Teal Mask",
				"form-ital": "Maschera Turchese"
			},
			"type": [ "Grass" ]
		},
		"1017-W": {
			"dex-index": "1017-W",
			"form-data": {
				"base": "1017-0",
				"type": "type difference",
				"form": "Wellspring Mask",
				"form-ital": "Maschera Pozzo"
			},
			"type": [ "Grass", "Water" ]
		},
		"1017-H": {
			"dex-index": "1017-H",
			"form-data": {
				"base": "1017-0",
				"type": "type difference",
				"form": "Hearthflame Mask",
				"form-ital": "Maschera Focolare"
			},
			"type": [ "Grass", "Fire" ]
		},
		"1017-C": {
			"dex-index": "1017-C",
			"form-data": {
				"base": "1017-0",
				"type": "type difference",
				"form": "Cornerstone Mask",
				"form-ital": "Maschera Fondamenta"
			},
			"type": [ "Grass", "Rock" ]
		},
		"1018": {
			"dex-index": "1018",
			"name": "Archaludon",
			"availability": {
				"in-game": false
			},
			"category": "Alloy",
			"type": [ "Steel", "Dragon" ],
			"evolves-from": "884",
			"height-avg": 2.0,
			"weight-avg": 60.0
		},
		"1019": {
			"dex-index": "1019",
			"name": "Hydrapple",
			"availability": {
				"in-game": false
			},
			"category": "Apple Hydra",
			"type": [ "Grass", "Dragon" ],
			"evolves-from": "1011",
			"height-avg": 1.8,
			"weight-avg": 93.0
		},
		"1020": {
			"dex-index": "1020",
			"name": "Gouging Fire",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Fire", "Dragon" ],
			"height-avg": 3.5,
			"weight-avg": 590.0
		},
		"1021": {
			"dex-index": "1021",
			"name": "Raging Bolt",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Electric", "Dragon" ],
			"height-avg": 5.2,
			"weight-avg": 480.0
		},
		"1022": {
			"dex-index": "1022",
			"name": "Iron Boulder",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Rock", "Psychic" ],
			"height-avg": 1.5,
			"weight-avg": 162.5
		},
		"1023": {
			"dex-index": "1023",
			"name": "Iron Crown",
			"availability": {
				"in-game": false
			},
			"category": "Paradox",
			"type": [ "Steel", "Psychic" ],
			"height-avg": 1.6,
			"weight-avg": 156.0
		},
		"1024": {
			"dex-index": "1024",
			"name": "Terapagos",
			"availability": {
				"in-game": false
			},
			"category": "Tera",
			"type": [ "Normal" ],
			"height-avg": 0.2,
			"weight-avg": 6.5
		},
		"1024-T": {
			"dex-index": "1024-T",
			"form-data": {
				"base": "1024",
				"type": "TO DO",
				"form": "Terastal Form",
				"form-ital": "Forma Teracristal"
			},
			"height-avg": 0.3,
			"weight-avg": 16.0
		},
		"1024-S": {
			"dex-index": "1024-S",
			"form-data": {
				"base": "1024",
				"type": "TO DO",
				"form": "Stellar Form",
				"form-ital": "Forma Astrale"
			},
			"height-avg": 1.7,
			"weight-avg": 77.0
		},
		"1025": {
			"dex-index": "1025",
			"name": "Pecharunt",
			"availability": {
				"in-game": false
			},
			"category": "Subjugation",
			"type": [ "Poison", "Ghost" ],
			"height-avg": 0.3,
			"weight-avg": 0.3
		}
	}
};
const entrytemplate = {
	"dex-index": {
		"dex-index": "string",
		"name": "string",
		"name-display": "string",
		"name-ital": "string",
		"name-ital-display": "string",
		"forms": [ "array of dex indices" ],
		"form-data": {
			"base": "dex index",
			"type": "string",
			"form": "string",
			"form-ital": "string"
		},
		"variants": [ "array of strings" ],
		"variants-ital": [ "array of strings" ],
		"category": "string",
		"type": [ "array of strings" ],
		"evolves-into": [ "array of dex index" ],
		"evolves-from": "dex index",
		"base-attack": "int",
		"base-defense": "int",
		"base-stamina": "int",
		"dynamax-class": "int [1,4]",
		"max-battle-tier": "int [1,6]",
		"fast-moves": [ "array of strings" ],
		"special-fast-moves": [ "array of strings" ],
		"unobtainable-fast-moves": [ "array of strings" ],
		"charged-moves": [ "array of strings" ],
		"special-charged-moves": [ "array of strings" ],
		"unobtainable-charged-moves": [ "array of strings" ],
		"showcase-baseline": "dex-index",
		"height-avg": "float",
		"weight-avg": "float",
		"size-data": {
			"class": "float",
			"ht-std-dev": "float",
			"wt-std-dev": "float",
			"xxs": [ "float", "float" ],
			"xs": [ "float", "float" ],
			"a": [ "float", "float" ],
			"xl": [ "float", "float" ],
			"xxl": [ "float", "float" ]
		}
	},
	"order": [
		"1", "2", "3", "3-M", "3-G",
		"4", "5", "6", "6-X", "6-Y", "6-G",
		"7", "8", "9", "9-M", "9-G",
		"10", "11", "12", "12-G",
		"13", "14", "15", "15-M",
		"16", "17", "18", "18-M",
		"19", "19-A", "20", "20-A",
		"21", "22",
		"23", "24",
		"25", "25-G", "26", "26-A",
		"27", "27-A", "28", "28-A",
		"29", "30", "31",
		"32", "33", "34",
		"35", "36",
		"37", "37-A", "38", "38-A",
		"39", "40",
		"41", "42",
		"43", "44", "45",
		"46", "47",
		"48", "49",
		"50", "50-A", "51", "51-A",
		"52", "52-A", "52-2", "52-G", "53", "53-A",
		"54", "55",
		"56", "57",
		"58", "58-H", "59", "59-H",
		"60", "61", "62",
		"63", "64", "65", "65-M",
		"66", "67", "68", "68-G",
		"69", "70", "71",
		"72", "73",
		"74", "74-A", "75", "75-A", "76", "76-A",
		"77", "77-G", "78", "78-G",
		"79", "79-G", "80", "80-M", "80-G",
		"81", "82",
		"83", "83-G",
		"84", "85",
		"86", "87",
		"88", "88-A", "89", "89-A",
		"90", "91",
		"92", "93", "94", "94-M", "94-G",
		"95",
		"96", "97",
		"98", "99", "99-G",
		"100", "100-H", "101", "101-H",
		"102", "103", "103-A",
		"104", "105", "105-A",
		"106", "107",
		"108",
		"109", "110", "110-G",
		"111", "112",
		"113", "114",
		"115", "115-M",
		"116", "117",
		"118", "119",
		"120", "121",
		"122", "122-G",
		"123", "124", "125", "126",
		"127", "127-M",
		"128", "128-P", "128-C", "128-B", "128-A",
		"129", "130", "130-M",
		"131", "131-G",
		"132",
		"133", "133-G", "134", "135", "136",
		"137",
		"138", "139",
		"140", "141",
		"142", "142-M",
		"143", "143-G",
		"144", "144-G", "145", "145-G", "146", "146-G",
		"147", "148", "149",
		"150", "150-A", "150-X", "150-Y",
		"151",
		"152", "153", "154",
		"155", "156", "157", "157-H",
		"158", "159", "160",
		"161", "162",
		"163", "164",
		"165", "166",
		"167", "168",
		"169",
		"170", "171",
		"172", "173", "174",
		"175", "176",
		"177", "178",
		"179", "180", "181", "181-M",
		"182",
		"183", "184",
		"185", "186",
		"187", "188", "189",
		"190",
		"191", "192",
		"193",
		"194", "194-P", "195",
		"196", "197",
		"198",
		"199", "199-G",
		"200", "201", "202", "203",
		"204", "205",
		"206", "207",
		"208", "208-M",
		"209", "210",
		"211", "211-H",
		"212", "212-M",
		"213",
		"214", "214-M",
		"215", "215-H",
		"216", "217",
		"218", "219",
		"220", "221",
		"222", "222-G",
		"223", "224",
		"225", "226", "227",
		"228", "229", "229-M",
		"230",
		"231", "232",
		"233", "234", "235",
		"236", "237",
		"238", "239", "240", "241", "242",
		"243", "244", "245",
		"246", "247", "248", "248-M",
		"249", "249-A", "250", "250-A", "251",
		"252", "253", "254", "254-M",
		"255", "256", "257", "257-M",
		"258", "259", "260", "260-M",
		"261", "262",
		"263", "263-G", "264", "264-G",
		"265", "266", "267", "268", "269",
		"270", "271", "272",
		"273", "274", "275",
		"276", "277",
		"278", "279",
		"280", "281", "282", "282-M",
		"283", "284",
		"285", "286",
		"287", "288", "289",
		"290", "291", "292",
		"293", "294", "295",
		"296", "297",
		"298", "299",
		"300", "301",
		"302", "302-M",
		"303", "303-M",
		"304", "305", "306", "306-M",
		"307", "308", "308-M",
		"309", "310", "310-M",
		"311", "312",
		"313", "314",
		"315", "316",
		"317",
		"318", "319", "319-M",
		"320", "321",
		"322", "323", "323-M",
		"324",
		"325", "326",
		"327",
		"328", "329", "330",
		"331", "332",
		"333", "334", "334-M",
		"335", "336", "337", "338",
		"339", "340",
		"341", "342",
		"343", "344",
		"345", "346",
		"347", "348",
		"349", "350",
		"351", "351-U", "351-R", "351-N",
		"352",
		"353", "354", "354-M",
		"355", "356",
		"357", "358",
		"359", "359-M",
		"360",
		"361", "362", "362-M",
		"363", "364", "365",
		"366", "367", "368",
		"369", "370",
		"371", "372", "373", "373-M",
		"374", "375", "376", "376-M",
		"377", "378", "379",
		"380", "380-M", "381", "381-M",
		"382", "382-P", "383", "383-P",
		"384", "384-M",
		"385",
		"386", "386-A", "386-D", "386-S",
		"387", "388", "389",
		"390", "391", "392",
		"393", "394", "395",
		"396", "397", "398",
		"399", "400",
		"401", "402",
		"403", "404", "405",
		"406", "407",
		"408", "409",
		"410", "411",
		"412-0", "412-P", "412-S", "412-T",
		"413-0", "413-P", "413-S", "413-T", "414",
		"415-0", "415-M", "415-F", "416",
		"417",
		"418", "419",
		"420", "421",
		"422-0", "422-E", "422-W",
		"423-0", "423-E", "423-W",
		"424",
		"425", "426",
		"427", "428", "428-M",
		"429", "430",
		"431", "432",
		"433",
		"434", "435",
		"436", "437",
		"438", "439", "440", "441", "442",
		"443", "444", "445", "445-M",
		"446",
		"447", "448", "448-M",
		"449", "450",
		"451", "452",
		"453", "454",
		"455",
		"456", "457",
		"458",
		"459", "460", "460-M",
		"461", "462", "463", "464", "465", "466", "467", "468", "469",
		"470", "471",
		"472", "473", "474",
		"475", "475-M",
		"476", "477", "478",
		"479", "479-H", "479-W", "479-R", "479-A", "479-M",
		"480", "481", "482",
		"483", "483-O", "484", "484-O",
		"485", "486",
		"487-0", "487-A", "487-O",
		"488", "489", "490", "491",
		"492-0", "492-L", "492-S",
		"493", "493-BUG", "493-DAR", "493-DRA", "493-ELE", "493-FAI", "493-FIG", "493-FIR", "493-FLY", "493-GHO", "493-GRA", "493-GRO", "493-ICE", "493-POI", "493-PSY", "493-ROC", "493-STE", "493-WAT",
		"494",
		"495", "496", "497",
		"498", "499", "500",
		"501", "502", "503", "503-H",
		"504", "505",
		"506", "507", "508",
		"509", "510",
		"511", "512", "513", "514", "515", "516",
		"517", "518",
		"519", "520", "521",
		"522", "523",
		"524", "525", "526",
		"527", "528",
		"529", "530",
		"531", "531-M",
		"532", "533", "534",
		"535", "536", "537",
		"538", "539",
		"540", "541", "542",
		"543", "544", "545",
		"546", "547",
		"548", "549", "549-H",
		"550", "550-W",
		"551", "552", "553",
		"554", "554-G", "555", "555-Z", "555-G", "555-GZ",
		"556",
		"557", "558",
		"559", "560",
		"561",
		"562", "562-G", "563",
		"564", "565",
		"566", "567",
		"568", "569", "569-G",
		"570", "570-H", "571", "571-H",
		"572", "573",
		"574", "575", "576",
		"577", "578", "579",
		"580", "581",
		"582", "583", "584",
		"585-0", "585-A", "585-P", "585-U", "585-W",
		"586-0", "586-A", "586-P", "586-U", "586-W",
		"587",
		"588", "589",
		"590", "591",
		"592-0", "592-B", "592-P",
		"593-0", "593-B", "593-P",
		"594",
		"595", "596",
		"597", "598",
		"599", "600", "601",
		"602", "603", "604",
		"605", "606",
		"607", "608", "609",
		"610", "611", "612",
		"613", "614",
		"615",
		"616", "617",
		"618", "618-G",
		"619", "620",
		"621",
		"622", "623",
		"624", "625",
		"626",
		"627", "628", "628-H",
		"629", "630",
		"631", "632",
		"633", "634", "635",
		"636", "637",
		"638", "639", "640",
		"641-0", "641-I", "641-T",
		"642-0", "642-I", "642-T",
		"643", "644",
		"645-0", "645-I", "645-T",
		"646", "646-W", "646-B",
		"647",
		"648-0", "648-A", "648-P",
		"649", "649-B", "649-C", "649-D", "649-S",
		"650", "651", "652",
		"653", "654", "655",
		"656", "657", "658", "658-A",
		"659", "660",
		"661", "662", "663",
		"664", "665", "666",
		"667", "668",
		"669-0", "669-B", "669-O", "669-R", "669-W", "669-Y",
		"670-0", "670-B", "670-O", "670-R", "670-W", "670-Y",
		"671-0", "671-B", "671-O", "671-R", "671-W", "671-Y",
		"672", "673",
		"674", "675",
		"676",
		"677", "678-0", "678-M", "678-F",
		"679", "680", "681-0", "681-S", "681-B",
		"682", "683",
		"684", "685",
		"686", "687",
		"688", "689",
		"690", "691",
		"692", "693",
		"694", "695",
		"696", "697",
		"698", "699",
		"700", "701", "702", "703",
		"704", "705", "705-H", "706", "706-H",
		"707",
		"708", "709",
		"710-0", "710-S", "710-A", "710-L", "710-X",
		"711-0", "711-S", "711-A", "711-L", "711-X",
		"712", "713", "713-H",
		"714", "715",
		"716", "717",
		"718-0", "718-1", "718-2",
		"719", "719-M",
		"720-0", "720-C", "720-U",
		"721",
		"722", "723", "724", "724-H",
		"725", "726", "727",
		"728", "729", "730",
		"731", "732", "733",
		"734", "735",
		"736", "737", "738",
		"739", "740",
		"741-0", "741-F", "741-E", "741-P", "741-G",
		"742", "743",
		"744", "744-S", "745-0", "745-D", "745-N", "745-S",
		"746-0", "746-O", "746-S",
		"747", "748",
		"749", "750",
		"751", "752",
		"753", "754",
		"755", "756",
		"757-0", "757-M", "757-F", "758",
		"759", "760",
		"761", "762", "763",
		"764", "765", "766",
		"767", "768",
		"769", "770",
		"771",
		"772", "773", "773-BUG", "773-DAR", "773-DRA", "773-ELE", "773-FAI", "773-FIG", "773-FIR", "773-FLY", "773-GHO", "773-GRA", "773-GRO", "773-ICE", "773-POI", "773-PSY", "773-ROC", "773-STE", "773-WAT",
		"774-0", "774-M", "774-C",
		"775", "776", "777",
		"778", "778-B",
		"779", "780", "781",
		"782", "783", "784",
		"785", "786", "787", "788",
		"789", "790", "791", "792",
		"793", "794", "795", "796", "797", "798", "799",
		"800", "800-S", "800-L", "800-U",
		"801", "802",
		"803", "804",
		"805", "806",
		"807",
		"808", "809", "809-G",
		"810", "811", "812", "812-G",
		"813", "814", "815", "815-G",
		"816", "817", "818", "818-G",
		"819", "820",
		"821", "822", "823", "823-G",
		"824", "825", "826", "826-G",
		"827", "828",
		"829", "830",
		"831", "832",
		"833", "834", "834-G",
		"835", "836",
		"837", "838", "839", "839-G",
		"840", "841", "841-G", "842", "842-G",
		"843", "844", "844-G",
		"845", "846", "847",
		"848", "849", "849-G",
		"850", "851", "851-G",
		"852", "853",
		"854-0", "854-A", "854-P",
		"855-0", "855-A", "855-P",
		"856", "857", "858", "858-G",
		"859", "860", "861", "861-G",
		"862", "863", "864", "865", "866", "867",
		"868", "869", "869-G",
		"870", "871",
		"872", "873",
		"874",
		"875-0", "875-I", "875-N",
		"876-0", "876-M", "876-F",
		"877-0", "877-F", "877-H",
		"878","879", "879-G",
		"880", "881", "882", "883",
		"884", "884-G",
		"885", "886", "887",
		"888-0", "888-H", "888-C",
		"889-0", "889-H", "889-C",
		"890", "890-G",
		"891",  "892-0", "892-S", "892-SG", "892-R", "892-RG",
		"893",
		"894", "895",
		"896", "897", "898", "898-I", "898-S",
		"899", "900",
		"901", "901-B",
		"902", "903", "904",
		"905-0", "905-I", "905-T",
		"906", "907", "908",
		"909", "910", "911",
		"912", "913", "914",
		"915", "916-0", "916-M", "916-F",
		"917", "918",
		"919", "920",
		"921", "922", "923",
		"924", "925-0", "925-F", "925-T",
		"926", "927",
		"928", "929", "930",
		"931",
		"932", "933", "934",
		"935", "936", "937",
		"938", "939",
		"940", "941",
		"942", "943",
		"944", "945",
		"946", "947",
		"948", "949",
		"950",
		"951", "952",
		"953", "954",
		"955", "956",
		"957", "958", "959",
		"960", "961",
		"962", "963", "964-0", "964-Z", "964-H",
		"965", "966",
		"967", "968",
		"969", "970",
		"971", "972",
		"973",
		"974", "975",
		"976", "977", "978", "979", "980", "981",
		"982-0", "982-D", "982-T",
		"983",
		"984", "985", "986", "987", "988", "989",
		"990", "991", "992", "993", "994", "995",
		"996", "997", "998",
		"999-0", "999-R", "999-C", "1000",
		"1001", "1002", "1003", "1004",
		"1005", "1006",
		"1007", "1008",
		"1009", "1010",
		"1011",
		"1012", "1013",
		"1014", "1015", "1016",
		"1017-0", "1017-T", "1017-W", "1017-H", "1017-C",
		"1018", "1019",
		"1020", "1021", "1022", "1023",
		"1024", "1024-T", "1024-S",
		"1025"
	]
};
