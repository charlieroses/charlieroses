BEGIN {
	FS="\t"
	SETSIZE=ARGV[2]
	ARGC=2
	
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

	print "<table>"
	print "<tr><th>Set Number</th><th>Rarity</th><th>Dex</th><th>Pokemon</th><th>Type</th><th>Holo</th><th>Other</th><th>Artist</th></tr>"
}

NR > 1{
	num_td  = "<td class=\"setnum\">" $7 "/" SETSIZE "</td>"
	pkmn_td = "<td class=\"name\">" $2 "</td>"
	holo_td = "<td class=\"holofoil\">" $5 "</td>"
	info_td = "<td class=\"extrainfo\">" gensub("/", "<br>", "g", $6) "</td>"
	art_td  = "<td class=\"artist\">" $8 "</td>"

	# Do the rarity
	if( $4 < 7 ) {
		rar_td  = "<td class=\"rarity\"><img src=\"images/general/" rarity[$4] "\"></td>"
	}
	else {
		rar_td  = "<td class=\"rarity\">" $4 "</td>"
	}

	# Get the type image if applicable and deal with the wierd edge cases
	img = "./images/trainer/e" types[$3] ".png"
	type_td = "<td class=\"" types[$3] "\"><img src=\"" img "\" alt=\"" types[$3] "\"></td>"

	if( $3 == "NN" ) {
		img = "./images/trainer/e" types["N"] ".png"
		type_td = "<td class=\"" types["N"] "\"><img src=\"" img "\" alt=\"" types["N"] "\"><img src=\"" img "\" alt=\"" types["N"] "\"></td>"
	}
	if ( $3 == "FaW" ) {
		imgA = "./images/trainer/e" types["Fa"] ".png"
		imgB = "./images/trainer/e" types["W"] ".png"
		type_td = "<td class=\"" types[$3] "\"><img src=\"" imgA "\" alt=\"" types["Fa"] "\"><img src=\"" imgB "\" alt=\"" types["W"] "\"></td>"
	}
	if ( $3 == "DSl" ) {
		imgA = "./images/trainer/e" types["D"] ".png"
		imgB = "./images/trainer/e" types["Sl"] ".png"
		type_td = "<td class=\"" types[$3] "\"><img src=\"" imgA "\" alt=\"" types["D"] "\"><img src=\"" imgB "\" alt=\"" types["Sl"] "\"></td>"
	}
	if ( $3 == "ElG" ) {
		imgA = "./images/trainer/e" types["El"] ".png"
		imgB = "./images/trainer/e" types["G"] ".png"
		type_td = "<td class=\"" types[$3] "\"><img src=\"" imgA "\" alt=\"" types["El"] "\"><img src=\"" imgB "\" alt=\"" types["G"] "\"></td>"
	}
	if ( $3 == "GF" ) {
		imgA = "./images/trainer/e" types["G"] ".png"
		imgB = "./images/trainer/e" types["F"] ".png"
		type_td = "<td class=\"" types[$3] "\"><img src=\"" imgA "\" alt=\"" types["G"] "\"><img src=\"" imgB "\" alt=\"" types["F"] "\"></td>"
	}
	if ( $3 == "GD" ) {
		imgA = "./images/trainer/e" types["G"] ".png"
		imgB = "./images/trainer/e" types["D"] ".png"
		type_td = "<td class=\"" types[$3] "\"><img src=\"" imgA "\" alt=\"" types["G"] "\"><img src=\"" imgB "\" alt=\"" types["D"] "\"></td>"
	}



	# Set the dex number to Trainer if applicable
	if( $1 == "T" ) {
		dex_td = "<td class=\"dex\">Trainer</td>"

		# If its a trainer card thats not an energy, pop in the following
		if( $3 == "E" || $3 == "I" || $3 == "S" || $3 == "Su" || $3 == "Sp" || $3 == "T" ) {
			type_td = "<td class=\"" types[$3] "\">" types[$3] "</td>"
		}
	}
	else {
		dex_td  = "<td class=\"dex\">" $1 "</td>"
	}


	# Changing the Nidoran M and F names
	if( $1 == "29" )
	{
		pkmn_td = "<td class=\"name\">Nidoran &#9792; </td>"
	}
	if( $1 == "32" )
	{
		pkmn_td = "<td class=\"name\">Nidoran &#9794; </td>"
	}


	# Build table
	print "<tr>" num_td rar_td dex_td pkmn_td type_td holo_td info_td art_td "</tr>"
}

END {
	print "</table>"
}
