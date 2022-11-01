BEGIN { 
	FS="\t"
	error = 0
	prevsetnum = 0
	fields = 11

	types["D"]  = "Dark"
	types["Dr"] = "Dragon" 
	types["DSl"]  = "DarkSteel"
	types["E"]  = "Energy"
	types["El"] = "Electric" 
	types["ElG"] = "ElectricGrass" 
	types["F"]  = "Fire"
	types["Fa"] = "Fairy" 
	types["FaW"] = "FairyWater" 
	types["Fg"] = "Fighting" 
	types["G"]  = "Grass"
	types["GD"]  = "GrassDark"
	types["GF"]  = "GrassFire"
	types["I"]  = "Item"
	types["N"]  = "Normal"
	types["NN"]  = "Double Colorless"
	types["P"]  = "Poison"
	types["S"]  = "Stadium"
	types["Sl"] = "Steel" 
	types["Sp"] = "Special Energy"
	types["Su"] = "Supporter"
	types["T"]  = "Trainer"
	types["W"]  = "Water"

	rarity[0] = "norarity.png"
	rarity[1] = "common.png"
	rarity[2] = "uncommon.png"
	rarity[3] = "rare.png"
	rarity[4] = "promo.png"
	rarity[5] = "superrare.png"
	rarity[6] = "amazing.png"


}

NR>1 {
	if( NF != fields ) {
		if( error < 2 ) error = 2
		print "(" FNR ") " NF " fields" 
	}

	if( $1 == "" ) {
		if( error < 2 ) error = 2
		print "(" FNR ") No Pokedex"
	}

	if( $2 == "" ) {
		if( error < 2 ) error = 2
		print "(" FNR ") No Pokemon Name"
	}

	if( !( $3 in types ) ) {
		if( error < 1 ) error = 1
		print "(" FNR ") \"" $3 "\" not a Type"
	}

	if( !( $4 in rarity ) ) {
		if( error < 1 ) error = 1
		print "(" FNR ") \"" $4 "\" not a Rarity"
	}

	if( $7 == "" ) {
		if( error < 2 ) error = 2
		print "(" FNR ") No Set Number"
	}
	if( $7 < prevsetnum ) {
		if( error < 2 ) error = 2
		print "(" FNR ") Out of order"
	}

	if(( $8 == "" ) &&
	   ( $1 != "T" )) {
		if( error < 1 ) error = 1
		print "(" FNR ") No Artist"
	}

}

END { exit error }
