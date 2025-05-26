function getMove( move ) {

	if( ! db[move] )
		return "";
	return db[move];
}

function getMoveField( move, field ) {
	let		db;

	if( move.startsWith("FAST_") )
		db = dbmoves["fast-moves"];
	else if( move.startsWith("CHRG_") )
		db = dbmoves["charged-moves"];
	else if( move.startsWith("DYNA_") )
		db = dbmoves["dyna-moves"];
	else if( dbmoves["giga-moves"][move] )
		db = dbmoves["giga-moves"];
	else
		return "";

	if( ! db[move] )
		return "";
	if( ! db[move][field] )
		return "";
	return db[move][field];
}


function getRaidEnergy( move ) {
	let db;
	if( move.startsWith("FAST_") )
		db = dbmoves["fast-moves"];
	else if( move.startsWith("CHRG_") )
		db = dbmoves["charged-moves"];
	else
		return 0.0;
	if( ! db[move] )
		return 0.0;
	if( ! db[move]["raid-energy"] )
		return 0.0;
	return db[move]["raid-energy"];
}

function getRaidCooldown( move ) {
	let db;
	if( move.startsWith("FAST_") )
		db = dbmoves["fast-moves"];
	else if( move.startsWith("CHRG_") )
		db = dbmoves["charged-moves"];
	else
		return 0.0;
	if( ! db[move] )
		return 0.0;
	if( ! db[move]["raid-cooldown"] )
		return 0.0;
	return db[move]["raid-cooldown"];
}

function getFastMoveEPS( move ) {
	let		energy, cooldown;

	if( ! move.startsWith("FAST_") )
		return 0.0;

	energy = getRaidEnergy( move );
	cooldown = getRaidCooldown( move );

	return energy/cooldown;
}

const dbmoves = {
	"fast-moves": {
		"FAST_BUG_BUGBITE": { // TODO Fix me
			"type": "Bug",
			"name": "Bug Bite",
			"name-ital": "Coleomorso",
			"raid-power": 5,
			"raid-energy": 6,
			"raid-cooldown": 0.5,
			"trainer-power": 3.00,
			"trainer-energy": 3.00,
			"trainer-cooldown": 0.5
		},
		"FAST_BUG_FURYCUTTER": {
			"type": "Bug",
			"name": "Fury Cutter",
			"name-ital": "Tagliofuria",
			"raid-power": 4,
			"raid-energy": 8,
			"raid-cooldown": 0.5,
			"trainer-power": 2,
			"trainer-energy": 4,
			"trainer-cooldown": 1
		},
		"FAST_BUG_HIDDENPOWER": { // TODO Fix me
			"type": "Bug",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_BUG_INFESTATION": {
			"type": "Bug",
			"name": "Infestation",
			"name-ital": "Assillo",
			"raid-power": 9,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 6,
			"trainer-energy": 12,
			"trainer-cooldown": 2
		},
		"FAST_BUG_STRUGGLEBUG": {
			"type": "Bug",
			"name": "Struggle Bug",
			"name-ital": "Entomoblocco",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2
		},
		"FAST_DAR_BITE": {
			"type": "Dark",
			"name": "Bite",
			"name-ital": "Morso",
			"raid-power": 6,
			"raid-energy": 4,
			"raid-cooldown": 0.5,
			"trainer-power": 4,
			"trainer-energy": 2,
			"trainer-cooldown": 1
		},
		"FAST_DAR_FEINTATTACK": {
			"type": "Dark",
			"name": "Feint Attack",
			"name-ital": "Finta",
			"raid-power": 11,
			"raid-energy": 10,
			"raid-cooldown": 1.0,
			"trainer-power": 6,
			"trainer-energy": 6,
			"trainer-cooldown": 1
		},
		"FAST_DAR_HIDDENPOWER": {
			"type": "Dark",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_DAR_SNARL": {
			"type": "Dark",
			"name": "Snarl",
			"name-ital": "Urlorabbia",
			"raid-power": 11,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 5,
			"trainer-energy": 13,
			"trainer-cooldown": 2
		},
		"FAST_DAR_SUCKERPUNCH": {
			"type": "Dark",
			"name": "Sucker Punch",
			"name-ital": "Sbigoattacco",
			"raid-power": 5,
			"raid-energy": 6,
			"raid-cooldown": 0.5,
			"trainer-power": 8,
			"trainer-energy": 7,
			"trainer-cooldown": 1
		},
		"FAST_DRA_DRAGONBREATH": {
			"type": "Dragon",
			"name": "Dragon Breath",
			"name-ital": "Dragospiro",
			"raid-power": 6,
			"raid-energy": 4,
			"raid-cooldown": 0.5,
			"trainer-power": 4.00,
			"trainer-energy": 3.00,
			"trainer-cooldown": 1
		},
		"FAST_DRA_DRAGONTAIL": {
			"type": "Dragon",
			"name": "Dragon Tail",
			"name-ital": "Codadrago",
			"raid-power": 14,
			"raid-energy": 8,
			"raid-cooldown": 1.0,
			"trainer-power": 13,
			"trainer-energy": 9,
			"trainer-cooldown": 2
		},
		"FAST_DRA_HIDDENPOWER": { // TODO Fix me
			"type": "Dragon",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_ELE_CHARGEBEAM": {
			"type": "Electric",
			"name": "Charge Beam",
			"name-ital": "Raggioscossa",
			"raid-power": 7,
			"raid-energy": 14,
			"raid-cooldown": 1.0,
			"trainer-power": 5,
			"trainer-energy": 11,
			"trainer-cooldown": 2
		},
		"FAST_ELE_HIDDENPOWER": { // TODO Fix me
			"type": "Electric",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_ELE_SPARK": {
			"type": "Electric",
			"name": "Spark",
			"name-ital": "Scintilla",
			"raid-power": 4,
			"raid-energy": 6,
			"raid-cooldown": 0.5,
			"trainer-power": 5,
			"trainer-energy": 7,
			"trainer-cooldown": 1
		},
		"FAST_ELE_THUNDERFANG": {
			"type": "Electric",
			"name": "Thunder Fang",
			"name-ital": "Fulmindenti",
			"raid-power": 10,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 8,
			"trainer-energy": 6,
			"trainer-cooldown": 1
		},
		"FAST_ELE_THUNDERSHOCK": {
			"type": "Electric",
			"name": "Thunder Shock",
			"name-ital": "Tuonoshock",
			"raid-power": 4,
			"raid-energy": 7,
			"raid-cooldown": 0.5,
			"trainer-power": 4,
			"trainer-energy": 9,
			"trainer-cooldown": 1
		},
		"FAST_ELE_VOLTSWITCH": {
			"type": "Electric",
			"name": "Volt Switch",
			"name-ital": "Invertivolt",
			"raid-power": 13,
			"raid-energy": 20,
			"raid-cooldown": 1.5,
			"trainer-power": 12,
			"trainer-energy": 16,
			"trainer-cooldown": 2
		},
		"FAST_FAI_CHARM": {
			"type": "Fairy",
			"name": "Charm",
			"name-ital": "Fascino",
			"raid-power": 20,
			"raid-energy": 11,
			"raid-cooldown": 1.5,
			"trainer-power": 15,
			"trainer-energy": 6,
			"trainer-cooldown": 2
		},
		"FAST_FAI_FAIRYWIND": {
			"type": "Fairy",
			"name": "Fairy Wind",
			"name-ital": "Vento di Fata",
			"raid-power": 9,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 15,
			"trainer-energy": 6,
			"trainer-cooldown": 2
		},
		"FAST_FAI_GEOMANCY": {
			"type": "Fairy",
			"name": "Geomancy",
			"name-ital": "Geocontrollo",
			"raid-power": 20,
			"raid-energy": 14,
			"raid-cooldown": 1.5,
			"trainer-power": 4,
			"trainer-energy": 13,
			"trainer-cooldown": 2
		},
		"FAST_FIG_COUNTER": {
			"type": "Fighting",
			"name": "Counter",
			"name-ital": "Contrattaco",
			"raid-power": 13,
			"raid-energy": 9,
			"raid-cooldown": 1.0,
			"trainer-power": 8,
			"trainer-energy": 6,
			"trainer-cooldown": 1
		},
		"FAST_FIG_DOUBLEKICK": {
			"type": "Fighting",
			"name": "Double Kick",
			"name-ital": "Doppiocalcio",
			"raid-power": 10,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 8,
			"trainer-energy": 12,
			"trainer-cooldown": 2
		},
		"FAST_FIG_FORCEPALM": {
			"type": "Fighting",
			"name": "Force Palm",
			"name-ital": "Palmoforza",
			"raid-power": 10,
			"raid-energy": 16,
			"raid-cooldown": 1.0,
			"trainer-power": 13,
			"trainer-energy": 10,
			"trainer-cooldown": 2
		},
		"FAST_FIG_HIDDENPOWER": { // TODO Fix me
			"type": "Fighting",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_FIG_KARATECHOP": {
			"type": "Fighting",
			"name": "Karate Chop",
			"name-ital": "Colpokarate",
			"raid-power": 10,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 5,
			"trainer-energy": 9,
			"trainer-cooldown": 1
		},
		"FAST_FIG_LOWKICK": {
			"type": "Fighting",
			"name": "Low Kick",
			"name-ital": "Colpo Basso",
			"raid-power": 5,
			"raid-energy": 5,
			"raid-cooldown": 0.5,
			"trainer-power": 4,
			"trainer-energy": 5,
			"trainer-cooldown": 1
		},
		"FAST_FIG_ROCKSMASH": {
			"type": "Fighting",
			"name": "Rock Smash",
			"name-ital": "Spaccaroccia",
			"raid-power": 17,
			"raid-energy": 12,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 7,
			"trainer-cooldown": 2
		},
		"FAST_FIR_EMBER": {
			"type": "Fire",
			"name": "Ember",
			"name-ital": "Braciere",
			"raid-power": 10,
			"raid-energy": 10,
			"raid-cooldown": 1.0,
			"trainer-power": 7,
			"trainer-energy": 6,
			"trainer-cooldown": 1
		},
		"FAST_FIR_FIREFANG": {
			"type": "Fire",
			"name": "Fire Fang",
			"name-ital": "Rogodenti",
			"raid-power": 13,
			"raid-energy": 9,
			"raid-cooldown": 1.0,
			"trainer-power": 8,
			"trainer-energy": 6,
			"trainer-cooldown": 1
		},
		"FAST_FIR_FIRESPIN": {
			"type": "Fire",
			"name": "Fire Spin",
			"name-ital": "Turbofuoco",
			"raid-power": 13,
			"raid-energy": 9,
			"raid-cooldown": 1.0,
			"trainer-power": 11,
			"trainer-energy": 10,
			"trainer-cooldown": 2
		},
		"FAST_FIR_HIDDENPOWER": { // TODO Fix me
			"type": "Fire",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_FIR_INCINERATE": {
			"type": "Fire",
			"name": "Incinerate",
			"name-ital": "Bruciatutto",
			"raid-power": 32,
			"raid-energy": 22,
			"raid-cooldown": 2.5,
			"trainer-power": 20,
			"trainer-energy": 20,
			"trainer-cooldown": 3
		},
		"FAST_FLY_AIRSLASH": {
			"type": "Flying",
			"name": "Air Slash",
			"name-ital": "Eterlama",
			"raid-power": 12,
			"raid-energy": 8,
			"raid-cooldown": 1.0,
			"trainer-power": 9,
			"trainer-energy": 9,
			"trainer-cooldown": 2
		},
		"FAST_FLY_GUST": {
			"type": "Flying",
			"name": "Gust",
			"name-ital": "Raffica",
			"raid-power": 25,
			"raid-energy": 20,
			"raid-cooldown": 2.0,
			"trainer-power": 16,
			"trainer-energy": 12,
			"trainer-cooldown": 2
		},
		"FAST_FLY_HIDDENPOWER": { // TODO Fix me
			"type": "Flying",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_FLY_PECK": {
			"type": "Flying",
			"name": "Peck",
			"name-ital": "Beccata",
			"raid-power": 10,
			"raid-energy": 10,
			"raid-cooldown": 1.0,
			"trainer-power": 6,
			"trainer-energy": 5,
			"trainer-cooldown": 1
		},
		"FAST_FLY_WINGATTACK": {
			"type": "Flying",
			"name": "Wing Attack",
			"name-ital": "Attaco d'Ala",
			"raid-power": 10,
			"raid-energy": 11,
			"raid-cooldown": 1.0,
			"trainer-power": 5,
			"trainer-energy": 7,
			"trainer-cooldown": 1
		},
		"FAST_GHO_ASTONISH": {
			"type": "Ghost",
			"name": "Astonish",
			"name-ital": "Sgomento",
			"raid-power": 7,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 12,
			"trainer-energy": 10,
			"trainer-cooldown": 2
		},
		"FAST_GHO_HEX": {
			"type": "Ghost",
			"name": "Hex",
			"name-ital": "Sciagura",
			"raid-power": 8,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 7,
			"trainer-energy": 13,
			"trainer-cooldown": 2.0
		},
		"FAST_GHO_HIDDENPOWER": { // TODO Fix me
			"type": "Ghost",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_GHO_LICK": {
			"type": "Ghost",
			"name": "Lick",
			"name-ital": "Leccata",
			"raid-power": 5,
			"raid-energy": 6,
			"raid-cooldown": 0.5,
			"trainer-power": 3,
			"trainer-energy": 3,
			"trainer-cooldown": 1.0
		},
		"FAST_GHO_SHADOWCLAW": {
			"type": "Ghost",
			"name": "Shadow Claw",
			"name-ital": "Ombratigli",
			"raid-power": 6,
			"raid-energy": 4,
			"raid-cooldown": 0.5,
			"trainer-power": 6,
			"trainer-energy": 8,
			"trainer-cooldown": 1.0
		},
		"FAST_GRA_BULLETSEED": {
			"type": "Grass",
			"name": "Bullet Seed",
			"name-ital": "Semitraglia",
			"raid-power": 7,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 5,
			"trainer-energy": 13,
			"trainer-cooldown": 2
		},
		"FAST_GRA_HIDDENPOWER": { // TODO Fix me
			"type": "Grass",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_GRA_LEAFAGE": {
			"type": "Grass",
			"name": "Leafage",
			"name-ital": "Fogliame",
			"raid-power": 6,
			"raid-energy": 4,
			"raid-cooldown": 0.5,
			"trainer-power": 6,
			"trainer-energy": 7,
			"trainer-cooldown": 1
		},
		"FAST_GRA_MAGICALLEAF": {
			"type": "Grass",
			"name": "Magical Leaf",
			"name-ital": "Fogliamagica",
			"raid-power": 17,
			"raid-energy": 17,
			"raid-cooldown": 1.5,
			"trainer-power": 10,
			"trainer-energy": 10,
			"trainer-cooldown": 2
		},
		"FAST_GRA_RAZORLEAF": {
			"type": "Grass",
			"name": "Razor Leaf",
			"name-ital": "Foglielama",
			"raid-power": 13,
			"raid-energy": 7,
			"raid-cooldown": 1.0,
			"trainer-power": 9,
			"trainer-energy": 4,
			"trainer-cooldown": 1
		},
		"FAST_GRA_VINEWHIP": {
			"type": "Grass",
			"name": "Vine Whip",
			"name-ital": "Frustata",
			"raid-power": 6,
			"raid-energy": 5,
			"raid-cooldown": 0.5,
			"trainer-power": 5,
			"trainer-energy": 8,
			"trainer-cooldown": 1
		},
		"FAST_GRO_HIDDENPOWER": { // TODO Fix me
			"type": "Ground",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_GRO_MUDSHOT": {
			"type": "Ground",
			"name": "Mud Shot",
			"name-ital": "Colpidifango",
			"raid-power": 4,
			"raid-energy": 6,
			"raid-cooldown": 0.5,
			"trainer-power": 4,
			"trainer-energy": 8,
			"trainer-cooldown": 1
		},
		"FAST_GRO_MUDSLAP": {
			"type": "Ground",
			"name": "Mud-Slap",
			"name-ital": "Fangosberla",
			"raid-power": 19,
			"raid-energy": 13,
			"raid-cooldown": 1.5,
			"trainer-power": 12,
			"trainer-energy": 10,
			"trainer-cooldown": 2
		},
		"FAST_GRO_SANDATTACK": {
			"type": "Ground",
			"name": "Sand Attack",
			"raid-power": 4,
			"raid-energy": 7,
			"raid-cooldown": 0.5,
			"trainer-power": 2,
			"trainer-energy": 4,
			"trainer-cooldown": 1
		},
		"FAST_ICE_FROSTBREATH": {
			"type": "Ice",
			"name": "Frost Breath",
			"name-ital": "Alitogelido",
			"raid-power": 11,
			"raid-energy": 9,
			"raid-cooldown": 1.0,
			"trainer-power": 7,
			"trainer-energy": 5,
			"trainer-cooldown": 1
		},
		"FAST_ICE_HIDDENPOWER": { // TODO Fix me
			"type": "Ice",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_ICE_ICEFANG": {
			"type": "Ice",
			"name": "Ice Fang",
			"name-ital": "Gelodenti",
			"raid-power": 12,
			"raid-energy": 20,
			"raid-cooldown": 1.5,
			"trainer-power": 8,
			"trainer-energy": 6,
			"trainer-cooldown": 1
		},
		"FAST_ICE_ICESHARD": {
			"type": "Ice",
			"name": "Ice Shard",
			"name-ital": "Geloscheggia",
			"raid-power": 10,
			"raid-energy": 10,
			"raid-cooldown": 1.0,
			"trainer-power": 9,
			"trainer-energy": 10,
			"trainer-cooldown": 2
		},
		"FAST_ICE_POWDERSNOW": {
			"type": "Ice",
			"name": "Powder Snow",
			"name-ital": "Poleneve",
			"raid-power": 6,
			"raid-energy": 15,
			"raid-cooldown": 1.0,
			"trainer-power": 5,
			"trainer-energy": 8,
			"trainer-cooldown": 1
		},
		"FAST_NOR_CUT": {
			"type": "Normal",
			"name": "Cut",
			"name-ital": "Taglio",
			"raid-power": 5,
			"raid-energy": 5,
			"raid-cooldown": 0.5,
			"trainer-power": 3,
			"trainer-energy": 2,
			"trainer-cooldown": 1
		},
		"FAST_NOR_LOCKON": {
			"type": "Normal",
			"name": "Lock-On",
			"name-ital": "Localizza",
			"raid-power": 2,
			"raid-energy": 10,
			"raid-cooldown": 0.5,
			"trainer-power": 1,
			"trainer-energy": 5,
			"trainer-cooldown": 1
		},
		"FAST_NOR_PRESENT": {
			"type": "Normal",
			"name": "Present",
			"name-ital": "Regalino",
			"raid-power": 6,
			"raid-energy": 23,
			"raid-cooldown": 1.5,
			"trainer-power": 3,
			"trainer-energy": 12,
			"trainer-cooldown": 2
		},
		"FAST_NOR_POUND": {
			"type": "Normal",
			"name": "Pound",
			"name-ital": "Botta",
			"raid-power": 6,
			"raid-energy": 5,
			"raid-cooldown": 0.5,
			"trainer-power": 4,
			"trainer-energy": 4,
			"trainer-cooldown": 1
		},
		"FAST_NOR_QUICKATTACK": {
			"type": "Normal",
			"name": "Quick Attack",
			"name-ital": "Attacco Rapido",
			"raid-power": 10,
			"raid-energy": 13,
			"raid-cooldown": 1.0,
			"trainer-power": 5,
			"trainer-energy": 8,
			"trainer-cooldown": 1
		},
		"FAST_NOR_SCRATCH": {
			"type": "Normal",
			"name": "Scratch",
			"name-ital": "Graffio",
			"raid-power": 6,
			"raid-energy": 4,
			"raid-cooldown": 0.5,
			"trainer-power": 4,
			"trainer-energy": 2,
			"trainer-cooldown": 1
		},
		"FAST_NOR_TACKLE": {
			"type": "Normal",
			"name": "Tackle",
			"name-ital": "Azione",
			"raid-power": 5,
			"raid-energy": 5,
			"raid-cooldown": 0.5,
			"trainer-power": 3,
			"trainer-energy": 3,
			"trainer-cooldown": 1
		},
		"FAST_NOR_TAKEDOWN": {
			"type": "Normal",
			"name": "Take Down",
			"name-ital": "Riduttore",
			"raid-power": 7,
			"raid-energy": 8,
			"raid-cooldown": 1.0,
			"trainer-power": 5,
			"trainer-energy": 8,
			"trainer-cooldown": 2
		},
		"FAST_NOR_TRANSFORM": {
			"type": "Normal",
			"name": "Transform",
			"name-ital": "Trasformazione",
			"raid-power": 0,
			"raid-energy": 0,
			"raid-cooldown": 2.0,
			"trainer-power": 0,
			"trainer-energy": 0,
			"trainer-cooldown": 3
		},
		"FAST_NOR_YAWN": {
			"type": "Normal",
			"name": "Yawn",
			"name-ital": "Sbadiglio",
			"raid-power": 0,
			"raid-energy": 13,
			"raid-cooldown": 1.5,
			"trainer-power": 0,
			"trainer-energy": 12,
			"trainer-cooldown": 2
		},
		"FAST_POI_ACID": {
			"type": "Poison",
			"name": "Acid",
			"name-ital": "Acido",
			"raid-power": 11,
			"raid-energy": 10,
			"raid-cooldown": 1.0,
			"trainer-power": 6,
			"trainer-energy": 5,
			"trainer-cooldown": 1
		},
		"FAST_POI_HIDDENPOWER": { // TODO Fix me
			"type": "Poison",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_POI_POISONJAB": {
			"type": "Poison",
			"name": "Poison Jab",
			"name-ital": "Velenopuntura",
			"raid-power": 13,
			"raid-energy": 9,
			"raid-cooldown": 1.0,
			"trainer-power": 7,
			"trainer-energy": 7,
			"trainer-cooldown": 1
		},
		"FAST_POI_POISONSTING": {
			"type": "Poison",
			"name": "Poison Sting",
			"name-ital": "Velenospina",
			"raid-power": 4,
			"raid-energy": 6,
			"raid-cooldown": 0.5,
			"trainer-power": 4,
			"trainer-energy": 9,
			"trainer-cooldown": 1
		},
		"FAST_PSY_CONFUSION": {
			"type": "Psychic",
			"name": "Confusion",
			"name-ital": "Confusione",
			"raid-power": 19,
			"raid-energy": 14,
			"raid-cooldown": 1.5,
			"trainer-power": 16,
			"trainer-energy": 12,
			"trainer-cooldown": 2
		},
		"FAST_PSY_EXTRASENSORY": {
			"type": "Psychic",
			"name": "Extrasensory",
			"name-ital": "Extrasenso",
			"raid-power": 11,
			"raid-energy": 11,
			"raid-cooldown": 1.0,
			"trainer-power": 8,
			"trainer-energy": 10,
			"trainer-cooldown": 2
		},
		"FAST_PSY_HIDDENPOWER": { // TODO Fix me
			"type": "Psychic",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_PSY_PSYCHOCUT": {
			"type": "Psychic",
			"name": "Psycho Cut",
			"name-ital": "Psicotaglio",
			"raid-power": 4,
			"raid-energy": 7,
			"raid-cooldown": 0.5,
			"trainer-power": 3,
			"trainer-energy": 9,
			"trainer-cooldown": 1
		},
		"FAST_PSY_PSYWAVE": {
			"type": "Psychic",
			"name": "Psywave",
			"name-ital": "Psiconda",
			"raid-power": 4,
			"raid-energy": 7,
			"raid-cooldown": 0.5,
			"trainer-power": 3,
			"trainer-energy": 4,
			"trainer-cooldown": 1
		},
		"FAST_PSY_ZENHEADBUTT": {
			"type": "Psychic",
			"name": "Zen Headbutt",
			"name-ital": "Cozzata Zen",
			"raid-power": 11,
			"raid-energy": 9,
			"raid-cooldown": 1.0,
			"trainer-power": 8,
			"trainer-energy": 6,
			"trainer-cooldown": 2
		},
		"FAST_ROC_HIDDENPOWER": { // TODO Fix me
			"type": "Rock",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_ROC_ROCKTHROW": {
			"type": "Rock",
			"name": "Rock Throw",
			"name-ital": "Sassata",
			"raid-power": 13,
			"raid-energy": 8,
			"raid-cooldown": 1.0,
			"trainer-power": 8,
			"trainer-energy": 5,
			"trainer-cooldown": 1.0
		},
		"FAST_ROC_ROLLOUT": {
			"type": "Rock",
			"name": "Rollout",
			"name-ital": "Rotolamento",
			"raid-power": 15,
			"raid-energy": 18,
			"raid-cooldown": 1.5,
			"trainer-power": 7,
			"trainer-energy": 13,
			"trainer-cooldown": 2.0
		},
		"FAST_ROC_SMACKDOWN": {
			"type": "Rock",
			"name": "Smack Down",
			"name-ital": "Abbattimento",
			"raid-power": 13,
			"raid-energy": 7,
			"raid-cooldown": 1.0,
			"trainer-power": 11,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_STE_BULLETPUNCH": {
			"type": "Steel",
			"name": "Bullet Punch",
			"name-ital": "Pugnoscarica",
			"raid-power": 10,
			"raid-energy": 11,
			"raid-cooldown": 1.0,
			"trainer-power": 6,
			"trainer-energy": 7,
			"trainer-cooldown": 1
		},
		"FAST_STE_HIDDENPOWER": { // TODO Fix me
			"type": "Steel",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_STE_IRONTAIL": {
			"type": "Steel",
			"name": "Iron Tail",
			"name-ital": "Codacciaio",
			"raid-power": 14,
			"raid-energy": 6,
			"raid-cooldown": 1.0,
			"trainer-power": 10,
			"trainer-energy": 7,
			"trainer-cooldown": 2
		},
		"FAST_STE_METALCLAW": {
			"type": "Steel",
			"name": "Metal Claw",
			"name-ital": "Ferrartigli",
			"raid-power": 6,
			"raid-energy": 5,
			"raid-cooldown": 0.5,
			"trainer-power": 5,
			"trainer-energy": 7,
			"trainer-cooldown": 1
		},
		"FAST_STE_METALSOUND": {
			"type": "Steel",
			"name": "Metal Sound",
			"name-ital": "Ferrostrido",
			"raid-power": 4,
			"raid-energy": 6,
			"raid-cooldown": 0.5,
			"trainer-power": 3,
			"trainer-energy": 8,
			"trainer-cooldown": 1
		},
		"FAST_STE_STEELWING": {
			"type": "Steel",
			"name": "Steel Wing",
			"name-ital": "Alacciaio",
			"raid-power": 14,
			"raid-energy": 8,
			"raid-cooldown": 1.0,
			"trainer-power": 7,
			"trainer-energy": 6,
			"trainer-cooldown": 1
		},
		"FAST_WAT_BUBBLE": {
			"type": "Water",
			"name": "Bubble",
			"name-ital": "Bolla",
			"raid-power": 10,
			"raid-energy": 12,
			"raid-cooldown": 1.0,
			"trainer-power": 3,
			"trainer-energy": 3,
			"trainer-cooldown": 1
		},
		"FAST_WAT_HIDDENPOWER": { // TODO Fix me
			"type": "Water",
			"name": "Hidden Power",
			"name-ital": "Introforza",
			"raid-power": 15,
			"raid-energy": 15,
			"raid-cooldown": 1.5,
			"trainer-power": 9,
			"trainer-energy": 8,
			"trainer-cooldown": 2.0
		},
		"FAST_WAT_SPLASH": {
			"type": "Water",
			"name": "Splash",
			"name-ital": "Splash",
			"raid-power": 0,
			"raid-energy": 17,
			"raid-cooldown": 1.5,
			"trainer-power": 0,
			"trainer-energy": 12,
			"trainer-cooldown": 2
		},
		"FAST_WAT_WATERFALL": {
			"type": "Water",
			"name": "Waterfall",
			"name-ital": "Cascata",
			"raid-power": 13,
			"raid-energy": 7,
			"raid-cooldown": 1.0,
			"trainer-power": 12,
			"trainer-energy": 8,
			"trainer-cooldown": 2
		},
		"FAST_WAT_WATERGUN": {
			"type": "Water",
			"name": "Water Gun",
			"name-ital": "Pistolacqua",
			"raid-power": 5,
			"raid-energy": 5,
			"raid-cooldown": 0.5,
			"trainer-power": 3,
			"trainer-energy": 3,
			"trainer-cooldown": 1
		},
		"FAST_WAT_WATERSHURIKEN": {
			"type": "Water",
			"name": "Water Shuriken",
			"name-ital": "Acqualame",
			"raid-power": 9,
			"raid-energy": 14,
			"raid-cooldown": 1.0,
			"trainer-power": 6,
			"trainer-energy": 14,
			"trainer-cooldown": 2
		}
	},
	"charged-moves": {
		"CHRG_BUG_BUGBUZZ": {
			"type": "Bug",
			"name": "Bug Buzz",
			"name-ital": "Ronzio",
			"raid-power": 95,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 100,
			"trainer-energy": 60
		},
		"CHRG_BUG_FELLSTINGER": {
			"type": "Bug",
			"name": "Fell Stinger",
			"name-ital": "Pungiglione",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 20,
			"trainer-energy": 35
		},
		"CHRG_BUG_LEECHLIFE": {
			"type": "Bug",
			"name": "Leech Life",
			"name-ital": "Sanguisuga",
			"available": false,
			"raid-power": 0,
			"raid-energy": 0,
			"raid-duration": 2.5
		},
		"CHRG_BUG_LUNGE": {
			"type": "Bug",
			"name": "Lunge",
			"name-ital": "Assalto",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 60,
			"trainer-energy": 45
		},
		"CHRG_BUG_MEGAHORN": {
			"type": "Bug",
			"name": "Megahorn",
			"name-ital": "Megacorno",
			"raid-power": 105,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 110,
			"trainer-energy": 55
		},
		"CHRG_BUG_SIGNALBEAM": {
			"type": "Bug",
			"name": "Signal Beam",
			"name-ital": "Segnoraggio",
			"raid-power": 75,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 75,
			"trainer-energy": 55
		},
		"CHRG_BUG_SILVERWIND": {
			"type": "Bug",
			"name": "Silver Wind",
			"name-ital": "Ventargenteo",
			"raid-power": 65,
			"raid-energy": 33,
			"raid-duration": 3.5,
			"trainer-power": 60,
			"trainer-energy": 45
		},
		"CHRG_BUG_XSCISSOR": {
			"type": "Bug",
			"name": "X-Scissor",
			"name-ital": "Forbice X",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 65,
			"trainer-energy": 40
		},
		"CHRG_DAR_AURAWHEEL": {
			"type": "Dark",
			"name": "Aura Wheel",
			"name-ital": "Ruota d'Aura",
			"raid-power": 100,
			"raid-energy": 45,
			"raid-duration": 2.7,
			"trainer-power": 100,
			"trainer-energy": 45
		},
		"CHRG_DAR_BRUTALSWING": {
			"type": "Dark",
			"name": "Brutal Swing",
			"name-ital": "Vorticolpo",
			"raid-power": 65,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_DAR_CRUNCH": {
			"type": "Dark",
			"name": "Crunch",
			"name-ital": "Sgranocchio",
			"raid-power": 65,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 70,
			"trainer-energy": 45
		},
		"CHRG_DAR_DARKESTLARIAT": {
			"type": "Dark",
			"name": "Darkest Lariat",
			"name-ital": "Braccioteso",
			"raid-power": 80,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 120,
			"trainer-energy": 60
		},
		"CHRG_DAR_DARKPULSE": {
			"type": "Dark",
			"name": "Dark Pulse",
			"name-ital": "Neropulsar",
			"raid-power": 80,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 80,
			"trainer-energy": 50
		},
		"CHRG_DAR_FOULPLAY": {
			"type": "Dark",
			"name": "Foul Play",
			"name-ital": "Ripicca",
			"raid-power": 70,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 60,
			"trainer-energy": 40
		},
		"CHRG_DAR_NIGHTSLASH": {
			"type": "Dark",
			"name": "Night Slash",
			"name-ital": "Nottesferza",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 50,
			"trainer-energy": 35
		},
		"CHRG_DAR_OBSTRUCT": {
			"type": "Dark",
			"name": "Obstruct",
			"name-ital": "Sbarramento",
			"raid-power": 20,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 15,
			"trainer-energy": 40
		},
		"CHRG_DAR_PAYBACK": {
			"type": "Dark",
			"name": "Payback",
			"name-ital": "Rivincita",
			"raid-power": 95,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 110,
			"trainer-energy": 60
		},
		"CHRG_DRA_BREAKINGSWIPE": {
			"type": "Dragon",
			"name": "Breaking Swipe",
			"name-ital": "Vastoimpatto",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 1.0,
			"trainer-power": 50,
			"trainer-energy": 35
		},
		"CHRG_DRA_DRACOMETEOR": {
			"type": "Dragon",
			"name": "Draco Meteor",
			"name-ital": "Dragobolide",
			"raid-power": 150,
			"raid-energy": 100,
			"raid-duration": 3.5,
			"trainer-power": 150,
			"trainer-energy": 65
		},
		"CHRG_DRA_DRAGONCLAW": {
			"type": "Dragon",
			"name": "Dragon Claw",
			"name-ital": "Dragartigli",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 50,
			"trainer-energy": 35
		},
		"CHRG_DRA_DRAGONENERGY": { // TODO fill me in
			"type": "Dragon",
			"name": "Dragon Energy",
			"name-ital": "Dragoenergia",
			"raid-power": 0,
			"raid-energy": 0,
			"raid-duration": 0.0,
			"trainer-power": 0,
			"trainer-energy": 0
		},
		"CHRG_DRA_DRAGONPULSE": {
			"type": "Dragon",
			"name": "Dragon Pulse",
			"name-ital": "Dragopulsar",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 90,
			"trainer-energy": 60
		},
		"CHRG_DRA_OUTRAGE": {
			"type": "Dragon",
			"name": "Outrage",
			"name-ital": "Oltraraggio",
			"raid-power": 110,
			"raid-energy": 50,
			"raid-duration": 4.0,
			"trainer-power": 110,
			"trainer-energy": 60
		},
		"CHRG_DRA_ROAROFTIME": {
			"type": "Dragon",
			"name": "Roar of Time",
			"name-ital": "Fragortempo",
			"raid-power": 160,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 150,
			"trainer-energy": 65
		},
		"CHRG_DRA_SPACIALREND": {
			"type": "Dragon",
			"name": "Spacial Rend",
			"name-ital": "Fendispazio",
			"raid-power": 160,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 95,
			"trainer-energy": 50
		},
		"CHRG_DRA_TWISTER": {
			"type": "Dragon",
			"name": "Twister",
			"name-ital": "Tornado",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 45,
			"trainer-energy": 45
		},
		"CHRG_ELE_AURAWHEEL": {
			"type": "Electric",
			"name": "Aura Wheel",
			"name-ital": "Ruota d'Aura",
			"raid-power": 100,
			"raid-energy": 45,
			"raid-duration": 2.7,
			"trainer-power": 100,
			"trainer-energy": 45
		},
		"CHRG_ELE_DISCHARGE": {
			"type": "Electric",
			"name": "Discharge",
			"name-ital": "Scarica",
			"raid-power": 65,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 55,
			"trainer-energy": 40
		},
		"CHRG_ELE_FUSIONBOLT": {
			"type": "Electric",
			"name": "Fusion Bolt",
			"name-ital": "Incrotuono",
			"raid-power": 140,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 90,
			"trainer-energy": 45
		},
		"CHRG_ELE_PARABOLICCHARGE": {
			"type": "Electric",
			"name": "Parabolic Charge",
			"name-ital": "Caricaparabola",
			"raid-power": 70,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 70,
			"trainer-energy": 50
		},
		"CHRG_ELE_TECHNOBLAST": {
			"type": "Electric",
			"name": "Techno Blast",
			"name-ital": "Tecnobotta",
			"raid-power": 120,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 120,
			"trainer-energy": 55
		},
		"CHRG_ELE_THUNDER": {
			"type": "Electric",
			"name": "Thunder",
			"name-ital": "Tuono",
			"raid-power": 100,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 100,
			"trainer-energy": 60
		},
		"CHRG_ELE_THUNDERBOLT": {
			"type": "Electric",
			"name": "Thunderbolt",
			"name-ital": "Fulmine",
			"raid-power": 80,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 90,
			"trainer-energy": 55
		},
		"CHRG_ELE_THUNDERCAGE": { // TODO Fill me in
			"type": "Electric",
			"name": "Thunder Cage",
			"name-ital": "Elettrogabbia",
			"raid-power": 0,
			"raid-energy": 0,
			"raid-duration": 0.0,
			"trainer-power": 0,
			"trainer-energy": 0
		},
		"CHRG_ELE_THUNDERPUNCH": {
			"type": "Electric",
			"name": "Thunder Punch",
			"name-ital": "Tuonopugno",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 60,
			"trainer-energy": 40
		},
		"CHRG_ELE_VOLTTACKLE": {
			"type": "Electric",
			"name": "Volt Tackle",
			"name-ital": "Locomovolt",
			"raid-power": 90,
			"raid-energy": 33,
			"raid-duration": 3.5,
			"trainer-power": 90,
			"trainer-energy": 50
		},
		"CHRG_ELE_WILDBOLTSTORM": {
			"type": "Electric",
			"name": "Wildbolt Storm",
			"name-ital": "Tempesta Tonante",
			"raid-power": 150,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 60,
			"trainer-energy": 45
		},
		"CHRG_ELE_WILDCHARGE": {
			"type": "Electric",
			"name": "Wild Charge",
			"name-ital": "Sprizzalampo",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 100,
			"trainer-energy": 45
		},
		"CHRG_ELE_ZAPCANNON": {
			"type": "Electric",
			"name": "Zap Cannon",
			"name-ital": "Falcecannone",
			"raid-power": 140,
			"raid-energy": 100,
			"raid-duration": 3.5,
			"trainer-power": 150,
			"trainer-energy": 80
		},
		"CHRG_FAI_DAZZLINGGLEAM": {
			"type": "Fairy",
			"name": "Dazzling Gleam",
			"name-ital": "Magibrillo",
			"raid-power": 100,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 90,
			"trainer-energy": 55
		},
		"CHRG_FAI_DISARMINGVOICE": {
			"type": "Fairy",
			"name": "Disarming Voice",
			"name-ital": "Incantavoce",
			"raid-power": 70,
			"raid-energy": 33,
			"raid-duration": 4.0,
			"trainer-power": 70,
			"trainer-energy": 45
		},
		"CHRG_FAI_DRAININGKISS": {
			"type": "Fairy",
			"name": "Draining Kiss",
			"name-ital": "Assorbibacio",
			"raid-power": 60,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 60,
			"trainer-energy": 55
		},
		"CHRG_FAI_MOONBLAST": {
			"type": "Fairy",
			"name": "Moonblast",
			"name-ital": "Forza Lunare",
			"raid-power": 130,
			"raid-energy": 100,
			"raid-duration": 4.0,
			"trainer-power": 110,
			"trainer-energy": 60
		},
		"CHRG_FAI_NATURESMADNESS": {
			"type": "Fairy",
			"name": "Natures Madness",
			"name-ital": "Ira della Natura",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 80,
			"trainer-energy": 50
		},
		"CHRG_FAI_PLAYROUGH": {
			"type": "Fairy",
			"name": "Play Rough",
			"name-ital": "Carineria",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 90,
			"trainer-energy": 60
		},
		"CHRG_FIG_AURASPHERE": {
			"type": "Fighting",
			"name": "Aura Sphere",
			"name-ital": "Forzasfera",
			"raid-power": 100,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 100,
			"trainer-energy": 55
		},
		"CHRG_FIG_BRICKBREAK": {
			"type": "Fighting",
			"name": "Brick Break",
			"name-ital": "Breccia",
			"raid-power": 40,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 40,
			"trainer-energy": 40
		},
		"CHRG_FIG_CLOSECOMBAT": {
			"type": "Fighting",
			"name": "Close Combat",
			"name-ital": "Zuffa",
			"raid-power": 105,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 100,
			"trainer-energy": 45
		},
		"CHRG_FIG_CROSSCHOP": {
			"type": "Fighting",
			"name": "Cross Chop",
			"name-ital": "Incrocolpo",
			"raid-power": 50,
			"raid-energy": 50,
			"raid-duration": 1.5,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_FIG_DRAINPUNCH": {
			"type": "Fighting",
			"name": "Drain Punch",
			"name-ital": "Assorbipugno",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 20,
			"trainer-energy": 40
		},
		"CHRG_FIG_DYNAMICPUNCH": {
			"type": "Fighting",
			"name": "Dynamic Punch",
			"name-ital": "Dinamipugno",
			"raid-power": 85,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 90,
			"trainer-energy": 45
		},
		"CHRG_FIG_FLYINGPRESS": {
			"type": "Fighting",
			"name": "Flying Press",
			"name-ital": "Schiacciatuffo",
			"raid-power": 115,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 90,
			"trainer-energy": 40
		},
		"CHRG_FIG_FOCUSBLAST": {
			"type": "Fighting",
			"name": "Focus Blast",
			"name-ital": "Focalcolpo",
			"raid-power": 140,
			"raid-energy": 100,
			"raid-duration": 3.5,
			"trainer-power": 150,
			"trainer-energy": 75
		},
		"CHRG_FIG_HIGHJUMPKICK": {
			"type": "Fighting",
			"name": "High Jump Kick",
			"name-ital": "Calcinvolo",
			"raid-power": 90,
			"raid-energy": 100,
			"raid-duration": 1.5,
			"trainer-power": 110,
			"trainer-energy": 55
		},
		"CHRG_FIG_LOWSWEEP": {
			"type": "Fighting",
			"name": "Low Sweep",
			"name-ital": "Calciobasso",
			"raid-power": 40,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 40,
			"trainer-energy": 40
		},
		"CHRG_FIG_POWERUPPUNCH": {
			"type": "Fighting",
			"name": "Power-Up Punch",
			"name-ital": "Crescipugno",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 20,
			"trainer-energy": 35
		},
		"CHRG_FIG_SACREDSWORD": {
			"type": "Fighting",
			"name": "Sacred Sword",
			"name-ital": "Spadasolenne",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 1.0,
			"trainer-power": 60,
			"trainer-energy": 35
		},
		"CHRG_FIG_SUBMISSION": {
			"type": "Fighting",
			"name": "Submission",
			"name-ital": "Sottomissione",
			"raid-power": 55,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 60,
			"trainer-energy": 50
		},
		"CHRG_FIG_SUPERPOWER": {
			"type": "Fighting",
			"name": "Super Power",
			"name-ital": "Troppoforte",
			"raid-power": 85,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 85,
			"trainer-energy": 40
		},
		"CHRG_FIG_UPPERHAND": {
			"type": "Fighting",
			"name": "Upper Hand",
			"name-ital": "Colpo di Mano",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2,
			"trainer-power": 70,
			"trainer-energy": 40
		},
		"CHRG_FIR_BLASTBURN": {
			"type": "Fire",
			"name": "Blast Burn",
			"name-ital": "Incendio",
			"raid-power": 120,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 110,
			"trainer-energy": 50
		},
		"CHRG_FIR_BLAZEKICK": {
			"type": "Fire",
			"name": "Blaze Kick",
			"name-ital": "Calciardente",
			"raid-power": 40,
			"raid-energy": 33,
			"raid-duration": 1.0,
			"trainer-power": 60,
			"trainer-energy": 40
		},
		"CHRG_FIR_FIREBLAST": {
			"type": "Fire",
			"name": "Fire Blast",
			"name-ital": "Fuocobomba",
			"raid-power": 140,
			"raid-energy": 100,
			"raid-duration": 4.0,
			"trainer-power": 140,
			"trainer-energy": 80
		},
		"CHRG_FIR_FIREPUNCH": {
			"type": "Fire",
			"name": "Fire Punch",
			"name-ital": "Fuocopugno",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 60,
			"trainer-energy": 40
		},
		"CHRG_FIR_FLAMEBURST": {
			"type": "Fire",
			"name": "Flame Burst",
			"name-ital": "Pirolancio",
			"raid-power": 70,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 70,
			"trainer-energy": 55
		},
		"CHRG_FIR_FLAMECHARGE": {
			"type": "Fire",
			"name": "Flame Charge",
			"name-ital": "Nitrocarica",
			"raid-power": 70,
			"raid-energy": 33,
			"raid-duration": 4.0,
			"trainer-power": 65,
			"trainer-energy": 50
		},
		"CHRG_FIR_FLAMETHROWER": {
			"type": "Fire",
			"name": "Flamethrower",
			"name-ital": "Lanciafiamme",
			"raid-power": 65,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 90,
			"trainer-energy": 55
		},
		"CHRG_FIR_FLAMEWHEEL": {
			"type": "Fire",
			"name": "Flame Wheel",
			"name-ital": "Ruotafuoco",
			"raid-power": 55,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 60,
			"trainer-energy": 55
		},
		"CHRG_FIR_FUSIONFLARE": {
			"type": "Fire",
			"name": "Fusion Flare",
			"name-ital": "Incrofiamma",
			"raid-power": 140,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 90,
			"trainer-energy": 45
		},
		"CHRG_FIR_HEATWAVE": {
			"type": "Fire",
			"name": "Heat Wave",
			"name-ital": "Ondacalda",
			"raid-power": 95,
			"raid-energy": 100,
			"raid-duration": 3.0,
			"trainer-power": 95,
			"trainer-energy": 75
		},
		"CHRG_FIR_MAGMASTORM": {
			"type": "Fire",
			"name": "Magma Storm",
			"name-ital": "Magmaclisma",
			"raid-power": 75,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 65,
			"trainer-energy": 40
		},
		"CHRG_FIR_MYSTICALFIRE": {
			"type": "Fire",
			"name": "Mystical Fire",
			"name-ital": "Magifiamma",
			"raid-power": 60,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 60,
			"trainer-energy": 45
		},
		"CHRG_FIR_OVERHEAT": {
			"type": "Fire",
			"name": "Overheat",
			"name-ital": "Vampata",
			"raid-power": 160,
			"raid-energy": 100,
			"raid-duration": 4.0,
			"trainer-power": 130,
			"trainer-energy": 55
		},
		"CHRG_FIR_SACREDFIRE": {
			"type": "Fire",
			"name": "Sacred Fire",
			"name-ital": "Magifuoco",
			"raid-power": 120,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 130,
			"trainer-energy": 65
		},
		"CHRG_FIR_SACREDFIREPLUS": {
			"type": "Fire",
			"name": "Sacred Fire+",
			"name-ital": "Magifuoco+",
			"raid-power": 135,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 130,
			"trainer-energy": 65
		},
		"CHRG_FIR_SACREDFIREPLUSPLUS": {
			"type": "Fire",
			"name": "Sacred Fire++",
			"name-ital": "Magifuoco++",
			"raid-power": 155,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 130,
			"trainer-energy": 65
		},
		"CHRG_FIR_TECHNOBLAST": {
			"type": "Fire",
			"name": "Techno Blast",
			"name-ital": "Tecnobotta",
			"raid-power": 120,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 120,
			"trainer-energy": 55
		},
		"CHRG_FIR_TORCHSONG": {
			"type": "Fire",
			"name": "Torch Song",
			"name-ital": "Canzone Ardente",
			"raid-power": 100,
			"trainer-power": 70
		},
		"CHRG_FIR_WEATHERBALL": {
			"type": "Fire",
			"name": "Weather Ball",
			"name-ital": "Palla Clima",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_FIR_VCREATE": {
			"type": "Fire",
			"name": "V-Create",
			"name-ital": "Generatore V",
			"raid-power": 105,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 95,
			"trainer-energy": 40
		},
		"CHRG_FLY_ACROBATICS": {
			"type": "Flying",
			"name": "Acrobatics",
			"name-ital": "Acrobazia",
			"raid-power": 100,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 110,
			"trainer-energy": 55
		},
		"CHRG_FLY_AERIALACE": {
			"type": "Flying",
			"name": "Aerial Ace",
			"name-ital": "Aeroassalto",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 55,
			"trainer-energy": 40
		},
		"CHRG_FLY_AEROBLAST": {
			"type": "Flying",
			"name": "Aeroblast",
			"name-ital": "Aerocolpo",
			"raid-power": 180,
			"raid-energy": 100,
			"raid-duration": 3.5,
			"trainer-power": 170,
			"trainer-energy": 75
		},
		"CHRG_FLY_AEROBLASTPLUS": {
			"type": "Flying",
			"name": "Aeroblast+",
			"name-ital": "Aerocolpo+",
			"raid-power": 200,
			"raid-energy": 100,
			"raid-duration": 3.5,
			"trainer-power": 170,
			"trainer-energy": 75
		},
		"CHRG_FLY_AEROBLASTPLUSPLUS": {
			"type": "Flying",
			"name": "Aeroblast++",
			"name-ital": "Aerocolpo++",
			"raid-power": 225,
			"raid-energy": 100,
			"raid-duration": 3.5,
			"trainer-power": 170,
			"trainer-energy": 75
		},
		"CHRG_FLY_AIRCUTTER": {
			"type": "Flying",
			"name": "Air Cutter",
			"name-ital": "Aerasoio",
			"raid-power": 55,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 45,
			"trainer-energy": 35
		},
		"CHRG_FLY_BRAVEBIRD": {
			"type": "Flying",
			"name": "Brave Bird",
			"name-ital": "Baldeali",
			"raid-power": 130,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 130,
			"trainer-energy": 55
		},
		"CHRG_FLY_BLEAKWINDSTORM": {
			"type": "Flying",
			"name": "Bleakwind Storm",
			"name-ital": "Tempesta Boreale",
			"raid-power": 150,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 60,
			"trainer-energy": 45
		},
		"CHRG_FLY_DRAGONASCENT": {
			"type": "Flying",
			"name": "Dragon Ascent",
			"name-ital": "Ascesa del Drago",
			"raid-power": 140,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 150,
			"trainer-energy": 70
		},
		"CHRG_FLY_DRILLPECK": {
			"type": "Flying",
			"name": "Drill Peck",
			"name-ital": "Perforbecco",
			"raid-power": 70,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 65,
			"trainer-energy": 40
		},
		"CHRG_FLY_FEATHERDANCE": {
			"type": "Flying",
			"name": "Feather Dance",
			"name-ital": "Danzadipiume",
			"raid-power": 35,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 35,
			"trainer-energy": 50
		},
		"CHRG_FLY_FLY": {
			"type": "Flying",
			"name": "Fly",
			"name-ital": "Volo",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 80,
			"trainer-energy": 45
		},
		"CHRG_FLY_HURRICANE": {
			"type": "Flying",
			"name": "Hurricane",
			"name-ital": "Tifone",
			"raid-power": 105,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 110,
			"trainer-energy": 65
		},
		"CHRG_FLY_OBLIVIONWING": {
			"type": "Flying",
			"name": "Oblivion Wing",
			"name-ital": "Ali del Fato",
			"raid-power": 85,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 85,
			"trainer-energy": 50
		},
		"CHRG_FLY_SKYATTACK": {
			"type": "Flying",
			"name": "Sky Attack",
			"name-ital": "Aeroattacco",
			"raid-power": 80,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 85,
			"trainer-energy": 55
		},
		"CHRG_GHO_MOONGEISTBEAM": {
			"type": "Ghost",
			"name": "Moongeist Beam",
			"name-ital": "Raggio d'Ombra",
			"raid-power": 230,
			"raid-energy": 100,
			"raid-duration": 3.0,
			"trainer-power": 135,
			"trainer-energy": 65
		},
		"CHRG_GHO_NIGHTSHADE": {
			"type": "Ghost",
			"name": "Night Shade",
			"name-ital": "Ombra Nottura",
			"raid-power": 60,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 70,
			"trainer-energy": 40
		},
		"CHRG_GHO_OMINOUSWIND": {
			"type": "Ghost",
			"name": "Ominous Wind",
			"name-ital": "Funestovento",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 45,
			"trainer-energy": 45
		},
		"CHRG_GHO_POLTERGEIST": {
			"type": "Ghost",
			"name": "Poltergeist",
			"name-ital": "Poltergeist",
			"raid-power": 140,
			"raid-energy": 100,
			"raid-duration": 3.5,
			"trainer-power": 150,
			"trainer-energy": 75
		},
		"CHRG_GHO_RAGEFIST": {
			"type": "Ghost",
			"name": "Rage Fist",
			"name-ital": "Pugno Furibondo",
			"raid-power": 100,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 50,
			"trainer-energy": 35
		},
		"CHRG_GHO_SHADOWBALL": {
			"type": "Ghost",
			"name": "Shadow Ball",
			"name-ital": "Palla Ombra",
			"raid-power": 100,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 100,
			"trainer-energy": 55
		},
		"CHRG_GHO_SHADOWBONE": {
			"type": "Ghost",
			"name": "Shadow Bone",
			"name-ital": "Ostrotetro",
			"raid-power": 85,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 80,
			"trainer-energy": 45
		},
		"CHRG_GHO_SHADOWFORCE": {
			"type": "Ghost",
			"name": "Shadow Force",
			"name-ital": "Oscurotuffo",
			"raid-power": 140,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 120,
			"trainer-energy": 90
		},
		"CHRG_GHO_SHADOWPUNCH": {
			"type": "Ghost",
			"name": "Shadow Punch",
			"name-ital": "Pugnodombra",
			"raid-power": 35,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_GHO_SHADOWSNEAK": {
			"type": "Ghost",
			"name": "Shadow Sneak",
			"name-ital": "Furtivombra",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 50,
			"trainer-energy": 45
		},
		"CHRG_GHO_SPIRITSHACKLE": {
			"type": "Ghost",
			"name": "Spirit Shackle",
			"name-ital": "Cucitura d'Ombra",
			"raid-power": 70,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 50,
			"trainer-energy": 40
		},
		"CHRG_GRA_ENERGYBALL": {
			"type": "Grass",
			"name": "Energy Ball",
			"name-ital": "Energiapalla",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 4.0,
			"trainer-power": 90,
			"trainer-energy": 55
		},
		"CHRG_GRA_FLOWERTRICK": {
			"type": "Grass",
			"name": "Flower Trick",
			"name-ital": "Prestigiafiore",
			"raid-power": 75,
			"raid-energy": 33,
			"raid-duration": 2.7,
			"trainer-power": 30,
			"trainer-energy": 35
		},
		"CHRG_GRA_FRENZYPLANT": {
			"type": "Grass",
			"name": "Frenzy Plant",
			"name-ital": "Radicalbero",
			"raid-power": 100,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 100,
			"trainer-energy": 45
		},
		"CHRG_GRA_GIGADRAIN": {
			"type": "Grass",
			"name": "Giga Drain",
			"name-ital": "Gigassorbimento",
			"raid-power": 50,
			"raid-energy": 100,
			"raid-duration": 4.0,
			"trainer-power": 50,
			"trainer-energy": 80
		},
		"CHRG_GRA_GRASSKNOT": {
			"type": "Grass",
			"name": "Grass Knot",
			"name-ital": "Laccioerboso",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 90,
			"trainer-energy": 50
		},
		"CHRG_GRA_LEAFBLADE": {
			"type": "Grass",
			"name": "Leaf Blade",
			"name-ital": "Fendifoglia",
			"raid-power": 70,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 70,
			"trainer-energy": 35
		},
		"CHRG_GRA_LEAFSTORM": {
			"type": "Grass",
			"name": "Leaf Storm",
			"name-ital": "Verdebufera",
			"raid-power": 130,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 130,
			"trainer-energy": 55
		},
		"CHRG_GRA_LEAFTORNADO": {
			"type": "Grass",
			"name": "Leaf Tornado",
			"name-ital": "Vorticerba",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 45,
			"trainer-energy": 40
		},
		"CHRG_GRA_MEGADRAIN": {
			"type": "Grass",
			"name": "Mega Drain",
			"name-ital": "Megassorbimento",
			"raid-power": 25,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 25,
			"trainer-energy": 55
		},
		"CHRG_GRA_PETALBLIZZARD": {
			"type": "Grass",
			"name": "Petal Blizzard",
			"name-ital": "Fiortempesta",
			"raid-power": 110,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 110,
			"trainer-energy": 65
		},
		"CHRG_GRA_POWERWHIP": {
			"type": "Grass",
			"name": "Power Whip",
			"name-ital": "Vigorcolpo",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 90,
			"trainer-energy": 50
		},
		"CHRG_GRA_SEEDBOMB": {
			"type": "Grass",
			"name": "Seed Bomb",
			"name-ital": "Semebomba",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 65,
			"trainer-energy": 45
		},
		"CHRG_GRA_SEEDFLARE": {
			"type": "Grass",
			"name": "Seed Flare",
			"name-ital": "Infuriaseme",
			"raid-power": 115,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 130,
			"trainer-energy": 75
		},
		"CHRG_GRA_SOLARBEAM": {
			"type": "Grass",
			"name": "Solar Beam",
			"name-ital": "Solaraggio",
			"raid-power": 180,
			"raid-energy": 100,
			"raid-duration": 5.0,
			"trainer-power": 150,
			"trainer-energy": 80
		},
		"CHRG_GRA_TRAILBLAZE": {
			"type": "Grass",
			"name": "Trailblaze",
			"name-ital": "Apriprista",
			"raid-power": 65,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 65,
			"trainer-energy": 45
		},
		"CHRG_GRO_BONECLUB": {
			"type": "Ground",
			"name": "Bone Club",
			"name-ital": "Ossoclava",
			"raid-power": 40,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_GRO_BULLDOZE": {
			"type": "Ground",
			"name": "Bulldoze",
			"name-ital": "Battiterra",
			"raid-power": 80,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 45,
			"trainer-energy": 45
		},
		"CHRG_GRO_DIG": {
			"type": "Ground",
			"name": "Dig",
			"name-ital": "Fossa",
			"raid-power": 100,
			"raid-energy": 50,
			"raid-duration": 4.5,
			"trainer-power": 70,
			"trainer-energy": 50
		},
		"CHRG_GRO_DRILLRUN": {
			"type": "Ground",
			"name": "Drill Run",
			"name-ital": "Giravvita",
			"raid-power": 85,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 80,
			"trainer-energy": 45
		},
		"CHRG_GRO_EARTHPOWER": {
			"type": "Ground",
			"name": "Earthpower",
			"name-ital": "Geoforza",
			"raid-power": 100,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 90,
			"trainer-energy": 55
		},
		"CHRG_GRO_EARTHQUAKE": {
			"type": "Ground",
			"name": "Earthquake",
			"name-ital": "Terremoto",
			"raid-power": 140,
			"raid-energy": 100,
			"raid-duration": 3.5,
			"trainer-power": 110,
			"trainer-energy": 65
		},
		"CHRG_GRO_FISSURE": {
			"type": "Ground",
			"name": "Fissure",
			"name-ital": "Abisso",
			"available": false,
			"raid-power": 9001,
			"raid-energy": 25,
			"raid-duration": 3.0
		},
		"CHRG_GRO_HIGHHORSEPOWER": {
			"type": "Ground",
			"name": "High Horsepower",
			"name-ital": "Forza Equina",
			"raid-power": 105,
			"raid-energy": 100,
			"raid-duration": 1.5,
			"trainer-power": 100,
			"trainer-energy": 60
		},
		"CHRG_GRO_MUDBOMB": {
			"type": "Ground",
			"name": "Mud Bomb",
			"name-ital": "Pantanobomba",
			"raid-power": 60,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 60,
			"trainer-energy": 40
		},
		"CHRG_GRO_PRECIPICEBLADES": {
			"type": "Ground",
			"name": "Precipice Blades",
			"name-ital": "Spade Telluriche",
			"raid-power": 120,
			"raid-energy": 100,
			"raid-duration": 1.5,
			"trainer-power": 130,
			"trainer-energy": 60
		},
		"CHRG_GRO_SANDSEARSTORM": {
			"type": "Ground",
			"name": "Sandsear Storm",
			"name-ital": "Tempesta Ardente",
			"raid-power": 150,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 60,
			"trainer-energy": 45
		},
		"CHRG_GRO_SANDTOMB": {
			"type": "Ground",
			"name": "Sand Tomb",
			"name-ital": "Sabbiotomba",
			"raid-power": 60,
			"raid-energy": 33,
			"raid-duration": 4.0,
			"trainer-power": 25,
			"trainer-energy": 40
		},
		"CHRG_GRO_SCORCHINGSANDS": {
			"type": "Ground",
			"name": "Scorching Sands",
			"name-ital": "Sabbiardente",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 80,
			"trainer-energy": 50
		},
		"CHRG_ICE_AURORABEAM": {
			"type": "Ice",
			"name": "Aurora Beam",
			"name-ital": "Raggiaurora",
			"raid-power": 80,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 80,
			"trainer-energy": 60
		},
		"CHRG_ICE_AVALANCHE": {
			"type": "Ice",
			"name": "Avalanche",
			"name-ital": "Slavina",
			"raid-power": 85,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 90,
			"trainer-energy": 45
		},
		"CHRG_ICE_BLIZZARD": {
			"type": "Ice",
			"name": "Blizzard",
			"name-ital": "Bora",
			"raid-power": 130,
			"raid-energy": 100,
			"raid-duration": 3.0,
			"trainer-power": 140,
			"trainer-energy": 75
		},
		"CHRG_ICE_FREEZESHOCK": {
			"type": "Ice",
			"name": "Freeze Shock",
			"name-ital": "Elettrogelo"
		},
		"CHRG_ICE_GLACIATE": {
			"type": "Ice",
			"name": "Glaciate",
			"name-ital": "Gelamondo",
			"raid-power": 160,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 60,
			"trainer-energy": 40
		},
		"CHRG_ICE_ICEBEAM": {
			"type": "Ice",
			"name": "Ice Beam",
			"name-ital": "Geloraggio",
			"raid-power": 95,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 90,
			"trainer-energy": 55
		},
		"CHRG_ICE_ICEBURN": {
			"type": "Ice",
			"name": "Ice Burn",
			"name-ital": "Vampagelida"
		},
		"CHRG_ICE_ICEPUNCH": {
			"type": "Ice",
			"name": "Ice Punch",
			"name-ital": "Gelopugno",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 60,
			"trainer-energy": 40
		},
		"CHRG_ICE_ICICLESPEAR": {
			"type": "Ice",
			"name": "Icicle Spear",
			"name-ital": "Gelolancia",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 65,
			"trainer-energy": 40
		},
		"CHRG_ICE_ICYWIND": {
			"type": "Ice",
			"name": "Icy Wind",
			"name-ital": "Ventogelato",
			"raid-power": 65,
			"raid-energy": 33,
			"raid-duration": 3.5,
			"trainer-power": 60,
			"trainer-energy": 45
		},
		"CHRG_ICE_TECHNOBLAST": {
			"type": "Ice",
			"name": "Techno Blast",
			"name-ital": "Tecnobotta",
			"raid-power": 120,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 120,
			"trainer-energy": 55
		},
		"CHRG_ICE_TRIPLEAXEL": {
			"type": "Ice",
			"name": "Triple Axel",
			"name-ital": "Triplo Axel",
			"raid-power": 60,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 60,
			"trainer-energy": 45
		},
		"CHRG_ICE_WEATHERBALL": {
			"type": "Ice",
			"name": "Weather Ball",
			"name-ital": "Palla Clima",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_NOR_BODYSLAM": {
			"type": "Normal",
			"name": "Body Slam",
			"name-ital": "Corposcontro",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 50,
			"trainer-energy": 35
		},
		"CHRG_NOR_BOOMBURST": {
			"type": "Normal",
			"name": "Boomburst",
			"name-ital": "Ondaboato",
			"raid-power": 150,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 150,
			"trainer-energy": 70
		},
		"CHRG_NOR_CRUSHCLAW": {
			"type": "Normal",
			"name": "Crush Claw",
			"name-ital": "Tritartigli",
			"available": false,
			"raid-power": 0,
			"raid-energy": 0,
			"raid-duration": 2.0
		},
		"CHRG_NOR_CRUSHGRIP": { // TODO fill me in
			"type": "Normal",
			"name": "Crush Grip",
			"name-ital": "Sbriciolmano",
			"raid-power": 0,
			"raid-energy": 0,
			"raid-duration": 0.0,
			"trainer-power": 0,
			"trainer-energy": 0
		},
		"CHRG_NOR_FRUSTRATION": {
			"type": "Normal",
			"name": "Frustration",
			"name-ital": "Frustrazione",
			"raid-power": 10,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 10,
			"trainer-energy": 70
		},
		"CHRG_NOR_GIGAIMPACT": {
			"type": "Normal",
			"name": "Giga Impact",
			"name-ital": "Gigaimpatto",
			"raid-power": 200,
			"raid-energy": 100,
			"raid-duration": 4.5,
			"trainer-power": 150,
			"trainer-energy": 80
		},
		"CHRG_NOR_HORNATTACK": {
			"type": "Normal",
			"name": "Horn Attack",
			"name-ital": "Incornata",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 40,
			"trainer-energy": 35
		},
		"CHRG_NOR_HORNDRILL": {
			"type": "Normal",
			"name": "Horn Drill",
			"name-ital": "Perforcorno",
			"available": false,
			"raid-power": 9000,
			"raid-energy": 25,
			"raid-duration": 2.0
		},
		"CHRG_NOR_HYPERBEAM": {
			"type": "Normal",
			"name": "Hyper Beam",
			"name-ital": "Iper Raggio",
			"raid-power": 150,
			"raid-energy": 100,
			"raid-duration": 4.0,
			"trainer-power": 150,
			"trainer-energy": 80
		},
		"CHRG_NOR_HYPERFANG": {
			"type": "Normal",
			"name": "Hyper Fang",
			"name-ital": "Iperzanna",
			"raid-power": 80,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 80,
			"trainer-energy": 50
		},
		"CHRG_NOR_LASTRESORT": {
			"type": "Normal",
			"name": "Last Resort",
			"name-ital": "Ultimascelta",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 90,
			"trainer-energy": 55
		},
		"CHRG_NOR_REST": {
			"type": "Normal",
			"name": "Rest",
			"name-ital": "Riposo",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 50,
			"trainer-energy": 35
		},
		"CHRG_NOR_RETURN": {
			"type": "Normal",
			"name": "Return",
			"name-ital": "Ritorno",
			"raid-power": 25,
			"raid-energy": 33,
			"raid-duration": 0.5,
			"trainer-power": 130,
			"trainer-energy": 70
		},
		"CHRG_NOR_SKULLBASH": {
			"type": "Normal",
			"name": "Skull Bash",
			"name-ital": "Capocciata",
			"raid-power": 130,
			"raid-energy": 100,
			"raid-duration": 3.0,
			"trainer-power": 130,
			"trainer-energy": 75
		},
		"CHRG_NOR_STOMP": {
			"type": "Normal",
			"name": "Stomp",
			"name-ital": "Pestone",
			"raid-power": 50,
			"raid-energy": 50,
			"raid-duration": 1.5,
			"trainer-power": 55,
			"trainer-energy": 40
		},
		"CHRG_NOR_STRUGGLE": {
			"type": "Normal",
			"name": "Struggle",
			"name-ital": "Scontro",
			"raid-power": 35,
			"raid-energy": 0,
			"raid-duration": 2.0,
			"trainer-power": 35,
			"trainer-energy": 100
		},
		"CHRG_NOR_SWIFT": {
			"type": "Normal",
			"name": "Swift",
			"name-ital": "Comete",
			"raid-power": 65,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_NOR_TECHNOBLAST": {
			"type": "Normal",
			"name": "Techno Blast",
			"name-ital": "Tecnobotta",
			"raid-power": 120,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 120,
			"trainer-energy": 55
		},
		"CHRG_NOR_TRIATTACK": {
			"type": "Normal",
			"name": "Tri Attack",
			"name-ital": "Tripletta",
			"raid-power": 75,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 65,
			"trainer-energy": 50
		},
		"CHRG_NOR_VISEGRIP": {
			"type": "Normal",
			"name": "Vise Grip",
			"name-ital": "Presa",
			"raid-power": 35,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 40,
			"trainer-energy": 40
		},
		"CHRG_NOR_WEATHERBALL": {
			"type": "Normal",
			"name": "Weather Ball",
			"name-ital": "Palla Clima",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_NOR_WRAP": {
			"type": "Normal",
			"name": "Wrap",
			"name-ital": "Avvoglibotta",
			"raid-power": 25,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 25,
			"trainer-energy": 45
		},
		"CHRG_POI_ACIDSPRAY": {
			"type": "Poison",
			"name": "Acid Spray",
			"name-ital": "Acidobomba",
			"raid-power": 20,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 20,
			"trainer-energy": 45
		},
		"CHRG_POI_CROSSPOISON": {
			"type": "Poison",
			"name": "Cross Poison",
			"name-ital": "Velenocroce",
			"raid-power": 40,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 50,
			"trainer-energy": 35
		},
		"CHRG_POI_GUNKSHOT": {
			"type": "Poison",
			"name": "Gunk Shot",
			"name-ital": "Sporcolancio",
			"raid-power": 130,
			"raid-energy": 100,
			"raid-duration": 3.0,
			"trainer-power": 130,
			"trainer-energy": 75
		},
		"CHRG_POI_POISONFANG": {
			"type": "Poison",
			"name": "Poison Fang",
			"name-ital": "Velenodenti",
			"raid-power": 30,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 45,
			"trainer-energy": 40
		},
		"CHRG_POI_SLUDGE": {
			"type": "Poison",
			"name": "Sludge",
			"name-ital": "Fango",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 70,
			"trainer-energy": 40
		},
		"CHRG_POI_SLUDGEBOMB": {
			"type": "Poison",
			"name": "Sludge Bomb",
			"name-ital": "Fangobomba",
			"raid-power": 85,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 80,
			"trainer-energy": 50
		},
		"CHRG_POI_SLUDGEWAVE": {
			"type": "Poison",
			"name": "Sludge Wave",
			"name-ital": "Fangonda",
			"raid-power": 105,
			"raid-energy": 100,
			"raid-duration": 3.0,
			"trainer-power": 110,
			"trainer-energy": 65
		},
		"CHRG_PSY_FUTURESIGHT": {
			"type": "Psychic",
			"name": "Future Sight",
			"name-ital": "Divinazione",
			"raid-power": 115,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 110,
			"trainer-energy": 65
		},
		"CHRG_PSY_HEARTSTAMP": {
			"type": "Psychic",
			"name": "Heart Stamp",
			"name-ital": "Cuorestampo",
			"raid-power": 40,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 40,
			"trainer-energy": 40
		},
		"CHRG_PSY_LUSTERPURGE": {
			"type": "Psychic",
			"name": "Luster Purge",
			"name-ital": "Abbagliante",
			"raid-power": 100,
			"raid-energy": 100,
			"raid-duration": 1.5,
			"trainer-power": 120,
			"trainer-energy": 60
		},
		"CHRG_PSY_MIRRORCOAT": {
			"type": "Psychic",
			"name": "Mirror Coat",
			"name-ital": "Specchiovelo",
			"raid-power": 60,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 60,
			"trainer-energy": 55
		},
		"CHRG_PSY_MISTBALL": {
			"type": "Psychic",
			"name": "Mist Ball",
			"name-ital": "Foschisfera",
			"raid-power": 105,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 120,
			"trainer-energy": 60
		},
		"CHRG_PSY_PSYBEAM": {
			"type": "Psychic",
			"name": "Psybeam",
			"name-ital": "Psicoraggio",
			"raid-power": 65,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 70,
			"trainer-energy": 60
		},
		"CHRG_PSY_PSYCHIC": {
			"type": "Psychic",
			"name": "Psychic",
			"name-ital": "Psichico",
			"raid-power": 95,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 75,
			"trainer-energy": 55
		},
		"CHRG_PSY_PSYCHOBOOST": {
			"type": "Psychic",
			"name": "Psycho Boost",
			"name-ital": "Psicoslancio",
			"raid-power": 70,
			"raid-energy": 50,
			"raid-duration": 4.0,
			"trainer-power": 70,
			"trainer-energy": 35
		},
		"CHRG_PSY_PSYCHICFANGS": {
			"type": "Psychic",
			"name": "Psychic Fangs",
			"name-ital": "Psicozanna",
			"raid-power": 25,
			"raid-energy": 33,
			"raid-duration": 1.0,
			"trainer-power": 40,
			"trainer-energy": 35
		},
		"CHRG_PSY_PSYSHOCK": {
			"type": "Psychic",
			"name": "Psyshock",
			"name-ital": "Psicoshock",
			"raid-power": 60,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 70,
			"trainer-energy": 40
		},
		"CHRG_PSY_PSYSTRIKE": {
			"type": "Psychic",
			"name": "Psystrike",
			"name-ital": "Psicobotta",
			"raid-power": 95,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 90,
			"trainer-energy": 45
		},
		"CHRG_PSY_SYNCHRONOISE": {
			"type": "Psychic",
			"name": "Synchronoise",
			"name-ital": "Sincrumore",
			"raid-power": 80,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 80,
			"trainer-energy": 50
		},
		"CHRG_ROC_ANCIENTPOWER": {
			"type": "Rock",
			"name": "Ancient Power",
			"name-ital": "Forzantica",
			"raid-power": 70,
			"raid-energy": 33,
			"raid-duration": 3.5,
			"trainer-power": 60,
			"trainer-energy": 45
		},
		"CHRG_ROC_METEORBEAM": {
			"type": "Rock",
			"name": "Meteor Beam",
			"name-ital": "Raggiometeora",
			"raid-power": 140,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 120,
			"trainer-energy": 60
		},
		"CHRG_ROC_POWERGEM": {
			"type": "Rock",
			"name": "Power Gem",
			"name-ital": "Gemmoforza",
			"raid-power": 80,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 85,
			"trainer-energy": 50
		},
		"CHRG_ROC_ROCKBLAST": {
			"type": "Rock",
			"name": "Rock Blast",
			"name-ital": "Cadutamassi",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 50,
			"trainer-energy": 40
		},
		"CHRG_ROC_ROCKTOMB": {
			"type": "Rock",
			"name": "Rock Tomb",
			"name-ital": "Rocciotomba",
			"raid-power": 65,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 80,
			"trainer-energy": 50
		},
		"CHRG_ROC_ROCKSLIDE": {
			"type": "Rock",
			"name": "Rock Slide",
			"name-ital": "Frana",
			"raid-power": 75,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 65,
			"trainer-energy": 45
		},
		"CHRG_ROC_ROCKWRECKER": {
			"type": "Rock",
			"name": "Rock Wrecker",
			"name-ital": "Devastomasso",
			"raid-power": 110,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 110,
			"trainer-energy": 50
		},
		"CHRG_ROC_STONEEDGE": {
			"type": "Rock",
			"name": "Stone Edge",
			"name-ital": "Pietrataglio",
			"raid-power": 105,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 100,
			"trainer-energy": 55
		},
		"CHRG_ROC_WEATHERBALL": {
			"type": "Rock",
			"name": "Weather Ball",
			"name-ital": "Palla Clima",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_STE_BEHEMOTHBASH": { // TODO Fill me in
			"type": "Steel",
			"name": "Behemoth Bash",
			"name-ital": "Colpo Maestoso",
			"raid-power": 0,
			"raid-energy": 0,
			"raid-duration": 0.0,
			"trainer-power": 0,
			"trainer-energy": 0
		},
		"CHRG_STE_BEHEMOTHBLADE": { // TODO Fill me in
			"type": "Steel",
			"name": "Behemoth Blade",
			"name-ital": "Taglio Maestoso",
			"raid-power": 0,
			"raid-energy": 0,
			"raid-duration": 0.0,
			"trainer-power": 0,
			"trainer-energy": 0
		},
		"CHRG_STE_DOOMDESIRE": {
			"type": "Steel",
			"name": "Doom Desire",
			"name-ital": "Obblidero",
			"raid-power": 65,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 75,
			"trainer-energy": 40
		},
		"CHRG_STE_DOUBLEIRONBASH": {
			"type": "Steel",
			"name": "Double Iron Bash",
			"name-ital": "Pugni Corazzati",
			"raid-power": 70,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 50,
			"trainer-energy": 35
		},
		"CHRG_STE_FLASHCANNON": {
			"type": "Steel",
			"name": "Flash Cannon",
			"name-ital": "Cannonflash",
			"raid-power": 100,
			"raid-energy": 100,
			"raid-duration": 2.5,
			"trainer-power": 110,
			"trainer-energy": 70
		},
		"CHRG_STE_GYROBALL": {
			"type": "Steel",
			"name": "Gyro Ball",
			"name-ital": "Vortexpalla",
			"raid-power": 85,
			"raid-energy": 50,
			"raid-duration": 3.5,
			"trainer-power": 80,
			"trainer-energy": 60
		},
		"CHRG_STE_HEAVYSLAM": {
			"type": "Steel",
			"name": "Heavy Slam",
			"name-ital": "Pesobomba",
			"raid-power": 70,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 70,
			"trainer-energy": 50
		},
		"CHRG_STE_IRONHEAD": {
			"type": "Steel",
			"name": "Iron Head",
			"name-ital": "Metaltestata",
			"raid-power": 60,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 70,
			"trainer-energy": 50
		},
		"CHRG_STE_MAGNETBOMB": {
			"type": "Steel",
			"name": "Magnet Bomb",
			"name-ital": "Bombagnete",
			"raid-power": 75,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 70,
			"trainer-energy": 45
		},
		"CHRG_STE_METEORMASH": {
			"type": "Steel",
			"name": "Meteor Mash",
			"name-ital": "Meteorpugno",
			"raid-power": 100,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 100,
			"trainer-energy": 50
		},
		"CHRG_STE_MIRRORSHOT": {
			"type": "Steel",
			"name": "Mirror Shot",
			"name-ital": "Cristalcolpo",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 35,
			"trainer-energy": 35
		},
		"CHRG_STE_SUNSTEELSTRIKE": {
			"type": "Steel",
			"name": "Sunsteel Strike",
			"name-ital": "Astrocarica",
			"raid-power": 230,
			"raid-energy": 100,
			"raid-duration": 3.0,
			"trainer-power": 135,
			"trainer-energy": 65
		},
		"CHRG_WAT_AQUAJET": {
			"type": "Water",
			"name": "Aqua Jet",
			"name-ital": "Acquagetto",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 2.5,
			"trainer-power": 70,
			"trainer-energy": 40
		},
		"CHRG_WAT_AQUATAIL": {
			"type": "Water",
			"name": "Aqua Tail",
			"name-ital": "Idrondata",
			"raid-power": 50,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_WAT_BRINE": {
			"type": "Water",
			"name": "Brine",
			"name-ital": "Acquadisale",
			"raid-power": 65,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 60,
			"trainer-energy": 50
		},
		"CHRG_WAT_BUBBLEBEAM": {
			"type": "Water",
			"name": "Bubble Beam",
			"name-ital": "Bollaraggio",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 25,
			"trainer-energy": 40
		},
		"CHRG_WAT_CRABHAMMER": {
			"type": "Water",
			"name": "Crabhammer",
			"name-ital": "Martellata",
			"raid-power": 85,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 85,
			"trainer-energy": 50
		},
		"CHRG_WAT_HYDROCANNON": {
			"type": "Water",
			"name": "Hydro Cannon",
			"name-ital": "Idrocannone",
			"raid-power": 90,
			"raid-energy": 50,
			"raid-duration": 2.0,
			"trainer-power": 80,
			"trainer-energy": 40
		},
		"CHRG_WAT_HYDROPUMP": {
			"type": "Water",
			"name": "Hydro Pump",
			"name-ital": "Idropompa",
			"raid-power": 90,
			"raid-energy": 100,
			"raid-duration": 4.5,
			"trainer-power": 90,
			"trainer-energy": 80
		},
		"CHRG_WAT_LIQUIDATION": {
			"type": "Water",
			"name": "Liquidation",
			"name-ital": "Idrobreccia",
			"raid-power": 70,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 70,
			"trainer-energy": 45
		},
		"CHRG_WAT_MUDDYWATER": {
			"type": "Water",
			"name": "Muddy Water",
			"name-ital": "Fanghiglia",
			"raid-power": 45,
			"raid-energy": 33,
			"raid-duration": 2.0,
			"trainer-power": 35,
			"trainer-energy": 35
		},
		"CHRG_WAT_OCTAZOOKA": {
			"type": "Water",
			"name": "Octazooka",
			"name-ital": "Octazooka",
			"raid-power": 55,
			"raid-energy": 50,
			"raid-duration": 2.5,
			"trainer-power": 50,
			"trainer-energy": 50
		},
		"CHRG_WAT_ORIGINPULSE": {
			"type": "Water",
			"name": "Origin Pulse",
			"name-ital": "Primopulsar",
			"raid-power": 120,
			"raid-energy": 100,
			"raid-duration": 1.5,
			"trainer-power": 130,
			"trainer-energy": 60
		},
		"CHRG_WAT_RAZORSHELL": {
			"type": "Water",
			"name": "Razor Shell",
			"name-ital": "Conchilama",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 35,
			"trainer-energy": 35
		},
		"CHRG_WAT_SCALD": {
			"type": "Water",
			"name": "Scald",
			"name-ital": "Idrovampata",
			"raid-power": 50,
			"raid-energy": 100,
			"raid-duration": 4.5,
			"trainer-power": 50,
			"trainer-energy": 80
		},
		"CHRG_WAT_SPARKLINGARIA": {
			"type": "Water",
			"name": "Sparkling Aria",
			"name-ital": "Canto Effimero",
			"raid-power": 85,
			"raid-energy": 33,
			"raid-duration": 3.0,
			"trainer-power": 80,
			"trainer-energy": 45
		},
		"CHRG_WAT_SURF": {
			"type": "Water",
			"name": "Surf",
			"name-ital": "Surf",
			"raid-power": 60,
			"raid-energy": 50,
			"raid-duration": 1.5,
			"trainer-power": 75,
			"trainer-energy": 45
		},
		"CHRG_WAT_TECHNOBLAST": {
			"type": "Water",
			"name": "Techno Blast",
			"name-ital": "Tecnobotta",
			"raid-power": 120,
			"raid-energy": 100,
			"raid-duration": 2.0,
			"trainer-power": 120,
			"trainer-energy": 55
		},
		"CHRG_WAT_WEATHERBALL": {
			"type": "Water",
			"name": "Weather Ball",
			"name-ital": "Palla Clima",
			"raid-power": 55,
			"raid-energy": 33,
			"raid-duration": 1.5,
			"trainer-power": 55,
			"trainer-energy": 35
		},
		"CHRG_WAT_WATERPULSE": {
			"type": "Water",
			"name": "Water Pulse",
			"name-ital": "Idropulsar",
			"raid-power": 65,
			"raid-energy": 50,
			"raid-duration": 3.0,
			"trainer-power": 80,
			"trainer-energy": 55
		}
	},
	"dyna-moves": {
		"DYNA_BUG": {
			"type": "Bug",
			"name": "Max Flutterby",
			"name-ital": "Dynainsetto"
		},
		"DYNA_DAR": {
			"type": "Dark",
			"name": "Max Darkness",
			"name-ital": "Dynatenedre"
		},
		"DYNA_DRA": {
			"type": "Dragon",
			"name": "Max Wyrmwind",
			"name-ital": "Dynadragone"
		},
		"DYNA_ELE": {
			"type": "Electric",
			"name": "Max Lightning",
			"name-ital": "Dynasaetta"
		},
		"DYNA_FAI": {
			"type": "Fairy",
			"name": "Max Starfall",
			"name-ital": "Dynafata"
		},
		"DYNA_FIG": {
			"type": "Fighting",
			"name": "Max Knuckle",
			"name-ital": "Dynapugno"
		},
		"DYNA_FIR": {
			"type": "Fire",
			"name": "Max Flare",
			"name-ital": "Dynafiammata"
		},
		"DYNA_FLY": {
			"type": "Flying",
			"name": "Max Airstream",
			"name-ital": "Dynajet"
		},
		"DYNA_GHO": {
			"type": "Ghost",
			"name": "Max Phantasm",
			"name-ital": "Dynavuoto"
		},
		"DYNA_GRA": {
			"type": "Grass",
			"name": "Max Overgrowth",
			"name-ital": "Dynaflora"
		},
		"DYNA_GRO": {
			"type": "Ground",
			"name": "Max Quake",
			"name-ital": "Dynasisma"
		},
		"DYNA_ICE": {
			"type": "Ice",
			"name": "Max Hailstorm",
			"name-ital": "Dynagelo"
		},
		"DYNA_NOR": {
			"type": "Normal",
			"name": "Max Strike",
			"name-ital": "Dynattacco"
		},
		"DYNA_POI": {
			"type": "Poison",
			"name": "Max Ooze",
			"name-ital": "Dynacorrosione"
		},
		"DYNA_PSY": {
			"type": "Psychic",
			"name": "Max Mindstorm",
			"name-ital": "Dynapsiche"
		},
		"DYNA_ROC": {
			"type": "Rock",
			"name": "Max Rockfall",
			"name-ital": "Dynamacigno"
		},
		"DYNA_STE": {
			"type": "Steel",
			"name": "Max Steelspike",
			"name-ital": "Dynametallo"
		},
		"DYNA_WAT": {
			"type": "Water",
			"name": "Max Geyser",
			"name-ital": "Dynaflusso"
		}
	},
	"giga-moves": {
		"3-G": {
			"dex-index": "3-G",
			"type": "Grass",
			"name": "G-Max Vine Lash",
			"name-ital": "Gigaferzata"
		},
		"6-G": {
			"dex-index": "6-G",
			"type": "Fire",
			"name": "G-Max Wildfire",
			"name-ital": "Gigavampa"
		},
		"9-G": {
			"dex-index": "9-G",
			"type": "Water",
			"name": "G-Max Cannonade",
			"name-ital": "Gigacannonata"
		},
		"12-G": {
			"dex-index": "12-G",
			"type": "Bug",
			"name": "G-Max Befuddle",
			"name-ital": "Gigastupore"
		},
		"25-G": {
			"dex-index": "25-G",
			"type": "Electric",
			"name": "G-Max Volt Crash",
			"name-ital": "Gigapikafoglori"
		},
		"52-G": {
			"dex-index": "52-G",
			"type": "Normal",
			"name": "G-Max Gold Rush",
			"name-ital": "Gigamonete"
		},
		"68-G": {
			"dex-index": "68-G",
			"type": "Fighting",
			"name": "G-Max Chi Strike",
			"name-ital": "Gigapugnointuito"
		},
		"94-G": {
			"dex-index": "94-G",
			"type": "Ghost",
			"name": "G-Max Terror",
			"name-ital": "Gigaillusione"
		},
		"99-G": {
			"dex-index": "99-G",
			"type": "Water",
			"name": "G-Max Foam Burst",
			"name-ital": "Gigaschiuma"
		},
		"131-G": {
			"dex-index": "131-G",
			"type": "Ice",
			"name": "G-Max Resonance",
			"name-ital": "Gigamelodia"
		},
		"133-G": {
			"dex-index": "133-G",
			"type": "Normal",
			"name": "G-Max Cuddle",
			"name-ital": "Gigabbraccio"
		},
		"143-G": {
			"dex-index": "143-G",
			"type": "Normal",
			"name": "G-Max Replenish",
			"name-ital": "Gigainnovamento"
		},
		"569-G": {
			"dex-index": "569-G",
			"type": "Poison",
			"name": "G-Max Malodor",
			"name-ital": "Gigafetore"
		},
		"809-G": {
			"dex-index": "809-G",
			"type": "Steel",
			"name": "G-Max Meltdown",
			"name-ital": "Gigaliquefazione"
		},
		"812-G": {
			"dex-index": "812-G",
			"type": "Grass",
			"name": "G-Max Drum Solo",
			"name-ital": "Gigarullio"
		},
		"815-G": {
			"dex-index": "815-G",
			"type": "Fire",
			"name": "G-Max Fireball",
			"name-ital": "Gigafiammopalla"
		},
		"818-G": {
			"dex-index": "818-G",
			"type": "Water",
			"name": "G-Max Hydrosnipe",
			"name-ital": "Gigasparomirato"
		},
		"823-G": {
			"dex-index": "823-G",
			"type": "Flying",
			"name": "G-Max Wind Rage",
			"name-ital": "Gigaciclone"
		},
		"826-G": {
			"dex-index": "826-G",
			"type": "Psychic",
			"name": "G-Max Gravitas",
			"name-ital": "Gigagravitoforza"
		},
		"834-G": {
			"dex-index": "834-G",
			"type": "Water",
			"name": "G-Max Stonesurge",
			"name-ital": "Gigarocciagetto"
		},
		"839-G": {
			"dex-index": "839-G",
			"type": "Rock",
			"name": "G-Max Volcalith",
			"name-ital": "Gigalapilli"
		},
		"841-G": {
			"dex-index": "841-G",
			"type": "Grass",
			"name": "G-Max Tartness",
			"name-ital": "Gigattaccoacido"
		},
		"842-G": {
			"dex-index": "842-G",
			"type": "Grass",
			"name": "G-Max Sweetness",
			"name-ital": "Gigambrosia"
		},
		"844-G": {
			"dex-index": "844-G",
			"type": "Ground",
			"name": "G-Max Sandblast",
			"name-ital": "Gigavortisabbia"
		},
		"849-G": {
			"dex-index": "849-G",
			"type": "Electric",
			"name": "G-Max Stun Shock",
			"name-ital": "Gigatoxiscossa"
		},
		"851-G": {
			"dex-index": "851-G",
			"type": "Fire",
			"name": "G-Max Centiferno",
			"name-ital": "Gigamillefiamme"
		},
		"858-G": {
			"dex-index": "858-G",
			"type": "Fairy",
			"name": "G-Max Smite",
			"name-ital": "Gigacastigo"
		},
		"861-G": {
			"dex-index": "861-G",
			"type": "Dark",
			"name": "G-Max Snooze",
			"name-ital": "Gigatorpore"
		},
		"869-G": {
			"dex-index": "869-G",
			"type": "Fairy",
			"name": "G-Max Finale",
			"name-ital": "Gigagranfinale"
		},
		"879-G": {
			"dex-index": "879-G",
			"type": "Steel",
			"name": "G-Max Steelsurge",
			"name-ital": "Gigaferroaculei"
		},
		"884-G": {
			"dex-index": "884-G",
			"type": "Dragon",
			"name": "G-Max Depletion",
			"name-ital": "Gigalogoramento"
		},
		"892-G": {
			"dex-index": "892-G",
			"type": "Dark",
			"name": "G-Max One Blow",
			"name-ital": "Gigasingolcolpo"
		},
		"892-G": {
			"dex-index": "892-G",
			"type": "Water",
			"name": "G-Max Rapid Flow",
			"name-ital": "Gigapluricolpo"
		}
	}
};

