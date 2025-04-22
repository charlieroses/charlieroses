function getAllTypes() {
	return dbtypes.types;
}

function getType( type ) {
	if( ! dbtypes[type] )
		return "";
	return dbtypes[type];
}

function getTypeNameItal( t ) {
	let		type;
	type = getType( t );
	return type["name-ital"];
}

function getTypeImgSrc( type, style="" ) {
	let		img;
	if( style.length )
		style = style + "/";
	return assetsbase + "icons/pokemon/go/types/" + style + getTypeNameItal(type).toLowerCase() + ".png";
}
function getTypeImg( type, style="" ) {
	let		img;

	if( style.length )
		style = style + "/";

	img = document.createElement( "img" );
	img.setAttribute( "src", assetsbase + "icons/pokemon/go/types/" + style + getTypeNameItal(type).toLowerCase() + ".png" );
	img.setAttribute( "alt", type );
	img.classList.add( "type-icon" );

	if( style == "icon/" )
		img.classList.add( getTypeNameItal(type).toLowerCase() + "-icon" );

	return img;
}

function getSTABIcon( type ) {
	let img;

	img = getTypeImg( type, "stab" );
	img.setAttribute( "alt", "Same Type Attack Bonus" );
	img.setAttribute( "title", "Same Type Attack Bonus" );
	img.setAttribute( "class", "stab-icon" );

	return img;
}

function getTypeWeatherBoost( type ) {
	if( ! dbtypes[type] )
		return "";
	if( ! dbtypes[type]["weather-boost"] )
		return "";
	return dbtypes[type]["weather-boost"];
}

function hasTwoWeathers( weather ) {
	return ( weather == "Clear" || weather == "Sunny" || weather == "Partly Cloudy" );
}

function getWeatherIconSrc( weather ) {
	return assetsbase + "icons/pokemon/go/weather/" + weather.toLowerCase().replaceAll(" ","")  + ".png";
}
function getWeatherImg( weather ) {
	let		img;

	img = document.createElement( "img" );
	img.setAttribute( "src", assetsbase + "icons/pokemon/go/weather/" + weather.toLowerCase().replaceAll(" ","")  + ".png" );
	img.setAttribute( "alt", weather + " Weather" );
	img.classList.add( "weather-icon" );

	return img;
}

function getTypeWeakness( type ) {
	if( ! dbtypes[type] )
		return [];
	if( ! dbtypes[type].weakness )
		return [];
	return dbtypes[type].weakness;
}

function getTypeResistance( type ) {
	if( ! dbtypes[type] )
		return [];
	if( ! dbtypes[type].resistant )
		return [];
	return dbtypes[type].resistant;
}

function getTypeImmunity( type ) {
	if( ! dbtypes[type] )
		return [];
	if( ! dbtypes[type].immune )
		return [];
	return dbtypes[type].immune;
}

function getFullTypeAdv( defa, defb="" ) {
	let		r, t;

	if( defb.length == 0 ) {
		if( defa.length == 0 )
			return 0;
		else if( defa.length == 1 )
			defa = defa[0];
		else if( defa.length == 2 ) {
			defb = defa[1];
			defa = defa[0];
		}
	}

	r = {};
	for( t = 0; t < dbtypes.advantage.length; t++ )
		r[dbtypes.advantage[t]] = [];
	for( t = 0; t < dbtypes.types.length; t++ )
		r[getTypeAdvantage( dbtypes.types[t], defa, defb )].push( dbtypes.types[t] );

	return r;

}
function getTypeAdvantage( atk, defa, defb="" ) {
	let		r;

	if( defb.length == 0 ) {
		if( defa.length == 0 )
			return 0;
		else if( defa.length == 1 )
			defa = defa[0];
		else if( defa.length == 2 ) {
			defb = defa[1];
			defa = defa[0];
		}
	}

	r = 3;

	if( getTypeWeakness(defa).includes(atk) )
		r += 1;
	if( getTypeResistance(defa).includes(atk) )
		r -= 1;
	if( getTypeImmunity(defa).includes(atk) )
		r -= 2;

	if( defb.length == 0 )
		return dbtypes.advantage[r];

	if( getTypeWeakness(defb).includes(atk) )
		r += 1;
	if( getTypeResistance(defb).includes(atk) )
		r -= 1;
	if( getTypeImmunity(defb).includes(atk) )
		r -= 2;

	if( r < 0 )
		return dbtypes.advantage[0];
	return dbtypes.advantage[r];
}

function advToPercent( adv ) {
	return Math.trunc( adv * 100 );
}

function applyWeatherBoost( adv ) {
	return Math.trunc( adv * 1.2 );
}

function isWeatherBoosted( type, weather ) {
	let		t;

	if( type.length > 2 )
		return getTypeWeatherBoost(type) == weather;

	for( t = 0; t < type.length; t++ )
		if( getTypeWeatherBoost(type[t]) == weather )
			return true;

	return false;
}

const dbtypes = {
	"types": [
		"Grass", "Water", "Fire",
		"Normal", "Ice", "Electric",
		"Ground", "Flying", "Rock",
		"Poison", "Fighting", "Bug",
		"Psychic", "Ghost", "Dark",
		"Dragon", "Steel", "Fairy"
	],
	"advantage": [ 0.244, 0.390625, 0.625, 1.0, 1.6, 2.56 ],
	"Normal": {
		"name": "Normal",
		"name-ital": "Normale",
		"hex": "9099a1",
		"weather-boost": "Partly Cloudy",
		"weakness": [ "Fighting" ],
		"resistant": [ ],
		"immune": [ "Ghost" ],
		"very-not-effective": [ "Ghost" ],
		"not-very-effective": [ "Rock", "Steel" ],
		"super-effective": [ ]
	},
	"Grass": {
		"name": "Grass",
		"name-ital": "Erba",
		"hex": "4ab64e",
		"weather-boost": "Sunny",
		"weakness": [ "Fire", "Ice", "Poison", "Flying", "Bug" ],
		"resistant": [ "Water", "Electric", "Grass", "Ground" ],
		"not-very-effective": [ "Fire", "Grass", "Poison", "Flying", "Dragon", "Steel" ],
		"super-effective": [ "Water", "Ground", "Rock" ]
	},
	"Fire": {
		"name": "Fire",
		"name-ital": "Fuoco",
		"hex": "ff9c54",
		"weather-boost": "Sunny",
		"weakness": [ "Water", "Ground", "Rock" ],
		"resistant": [ "Grass", "Fire", "Ice", "Bug", "Steel", "Fairy" ],
		"not-very-effective": [ "Water", "Fire", "Rock", "Dragon" ],
		"super-effective": [ "Grass", "Ice", "Bug", "Steel" ]
	},
	"Water": {
		"name": "Water",
		"name-ital": "Acqua",
		"hex": "4e90d6",
		"weather-boost": "Rain",
		"weakness": [ "Grass", "Electric" ],
		"resistant": [ "Fire", "Water", "Ice", "Steel" ],
		"not-very-effective": [ "Grass", "Water", "Dragon" ],
		"super-effective": [ "Fire", "Ground", "Rock" ]
	},
	"Electric": {
		"name": "Electric",
		"name-ital": "Elettro",
		"hex": "f4d23d",
		"weather-boost": "Rain",
		"weakness": [ "Ground" ],
		"resistant": [ "Electric", "Flying", "Steel" ],
		"very-not-effective": [ "Ground" ],
		"not-very-effective": [ "Electric", "Grass", "Dragon" ],
		"super-effective": [ "Water", "Flying" ]
	},
	"Ice": {
		"name": "Ice",
		"name-ital": "Ghiaccio",
		"hex": "73cdc1",
		"weather-boost": "Snow",
		"weakness": [ "Fire", "Fighting", "Rock", "Steel" ],
		"resistant": [ "Ice" ],
		"not-very-effective": [ "Fire", "Water", "Ice", "Steel" ],
		"super-effective": [ "Grass", "Ground", "Flying", "Dragon" ]
	},
	"Rock": {
		"name": "Rock",
		"name-ital": "Roccia",
		"hex": "c9bb92",
		"weather-boost": "Partly Cloudy",
		"weakness": [ "Water", "Grass", "Fighting", "Ground", "Steel" ],
		"resistant": [ "Normal", "Fire", "Poison", "Flying" ],
		"not-very-effective": [ "Fighting", "Ground", "Steel" ],
		"super-effective": [ "Fire", "Ice", "Flying", "Bug" ]
	},
	"Ground": {
		"name": "Ground",
		"name-ital": "Terra",
		"hex": "d97745",
		"weather-boost": "Sunny",
		"weakness": [ "Water", "Grass", "Ice" ],
		"resistant": [ "Rock" ],
		"immune": [ "Electric" ],
		"very-not-effective": [ "Flying" ],
		"not-very-effective": [ "Grass", "Bug" ],
		"super-effective": [ "Fire", "Electric", "Poison", "Rock", "Steel" ]
	},
	"Flying": {
		"name": "Flying",
		"name-ital": "Volante",
		"hex": "8fa8dd",
		"weather-boost": "Windy",
		"weakness": [ "Electric", "Ice", "Rock" ],
		"resistant": [ "Grass", "Fighting", "Bug" ],
		"immune": [ "Ground" ],
		"not-very-effective": [ "Electric", "Rock", "Steel" ],
		"super-effective": [ "Grass", "Fighting", "Bug" ]
	},
	"Bug": {
		"name": "Bug",
		"name-ital": "Coleottero",
		"hex": "90c12d",
		"weather-boost": "Rain",
		"weakness": [ "Fire", "Flying", "Rock" ],
		"resistant": [ "Grass", "Fighting", "Ground" ],
		"not-very-effective": [ "Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy" ],
		"super-effective": [ "Grass", "Psychic", "Dark" ]
	},
	"Poison": {
		"name": "Poison",
		"name-ital": "Veleno",
		"hex": "a566c7",
		"weather-boost": "Cloudy",
		"weakness": [ "Psychic", "Ground" ],
		"resistant": [ "Grass", "Fighting", "Poison", "Bug", "Fairy" ],
		"very-not-effective": [ "Steel" ],
		"not-very-effective": [ "Poison", "Ground", "Rock", "Ghost" ],
		"super-effective": [ "Grass", "Fairy" ]
	},
	"Fighting": {
		"name": "Fighting",
		"name-ital": "Lotta",
		"hex": "8fa8dd",
		"weather-boost": "Cloudy",
		"weakness": [ "Psychic", "Flying", "Fairy" ],
		"resistant": [ "Bug", "Rock", "Dark" ],
		"very-not-effective": [ "Ghost" ],
		"not-very-effective": [ "Poison", "Flying", "Psychic", "Bug", "Fairy" ],
		"super-effective": [ "Normal", "Ice", "Rock", "Dark", "Steel" ]
	},
	"Psychic": {
		"name": "Psychic",
		"name-ital": "Psico",
		"hex": "f86d74",
		"weather-boost": "Windy",
		"weakness": [ "Dark", "Ghost", "Bug" ],
		"resistant": [ "Fighting", "Poison" ],
		"very-not-effective": [ "Dark" ],
		"not-very-effective": [ "Psychic", "Steel" ],
		"super-effective": [ "Fighting", "Poison" ]
	},
	"Dark": {
		"name": "Dark",
		"name-ital": "Buio",
		"hex": "5a5366",
		"weather-boost": "Fog",
		"weakness": [ "Fighting", "Bug", "Fairy" ],
		"resistant": [ "Ghost", "Dark" ],
		"immune": [ "Psychic" ],
		"not-very-effective": [ "Fighting", "Dark", "Fairy" ],
		"super-effective": [ "Psychic", "Ghost" ]
	},
	"Ghost": {
		"name": "Ghost",
		"name-ital": "Spettro",
		"hex": "5369ac",
		"weather-boost": "Fog",
		"weakness": [ "Dark", "Ghost" ],
		"resistant": [ "Poison", "Bug" ],
		"immune": [ "Normal", "Fighting" ],
		"very-not-effective": [ "Normal" ],
		"not-very-effective": [ "Dark" ],
		"super-effective": [ "Psychic", "Ghost" ]
	},
	"Dragon": {
		"name": "Dragon",
		"name-ital": "Drago",
		"hex": "0969c1",
		"weather-boost": "Windy",
		"weakness": [ "Ice", "Dragon", "Fairy" ],
		"resistant": [ "Fire", "Grass", "Water", "Electric" ],
		"very-not-effective": [ "Fairy" ],
		"not-very-effective": [ "Steel" ],
		"super-effective": [ "Dragon" ]
	},
	"Fairy": {
		"name": "Fairy",
		"name-ital": "Folletto",
		"hex": "ec8ce4",
		"weather-boost": "Cloudy",
		"weakness": [ "Poison", "Steel" ],
		"resistant": [ "Fighting", "Bug", "Dark" ],
		"immune": [ "Dragon" ],
		"not-very-effective": [ "Fire", "Poison", "Steel" ],
		"super-effective": [ "Fighting", "Dragon", "Dark" ]
	},
	"Steel": {
		"name": "Steel",
		"name-ital": "Acciaio",
		"hex": "53879c",
		"weather-boost": "Snow",
		"weakness": [ "Fire", "Fighting", "Ground" ],
		"resistant": [ "Normal", "Grass", "Ice", "Flying", "Psychic", "Bug", "Rock", "Dragon", "Steel", "Fairy" ],
		"immune": [ "Poison" ],
		"not-very-effective": [ "Water", "Fire", "Electric", "Steel" ],
		"super-effective": [ "Ice", "Rock", "Fairy" ]
	},
	"Dynamax": {
		"name": "Dynamax",
		"name-ital": "Dynamax",
		"hex": "d84888"
	},
	"Gigantamax": {
		"name": "Gigantamax",
		"name-ital": "Gigamax",
		"hex": "a70e68"
	}
};
