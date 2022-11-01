BEGIN {
	FS=","
	
	types["D"]  = "Dark"
	types["Dr"] = "Dragon" 
	types["E"]  = "Energy"
	types["El"] = "Electric" 
	types["F"]  = "Fire"
	types["Fa"] = "Fairy" 
	types["Fg"] = "Fighting" 
	types["G"]  = "Grass"
	types["I"]  = "Item"
	types["N"]  = "Normal"
	types["P"]  = "Poison"
	types["S"]  = "Stadium"
	types["Sl"] = "Steel" 
	types["Su"] = "Supporter"
	types["T"]  = "Trainer"
	types["W"]  = "Water"

	print "<table>"
	print "<tr><th>Series</th><th>Dex</th><th>Pokemon</th><th>Type</th></tr>"
}

NR > 1{
	ser_td  = "<td>" $4 "</td>" 
	dex_td  = "<td class=\"dex\">" $1 "</td>"
	pkmn_td = "<td class=\"name\">" $2 "</td>"

	img = "./images/trainer/e" types[$3] ".png"
	type_td = "<td class=\"" types[$3] "\"><img src=\"" img "\" alt=\"" types[$3] "\"></td>"

	print "<tr>" ser_td dex_td pkmn_td type_td "</tr>"
}

END {
	print "</table>"
}
