BEGIN {
	FS="\t"
	SETSIZE=ARGV[2]
	ARGC=2
	
	NIDO[29] = "&#9792;"
	NIDO[32] = "&#9794;"

	while( getline <"src/utils/pokemon/types.tsv" )
		types[$1] = $2
	while( getline <"src/utils/pokemon/rarity.tsv" )
		rarity[i++] = $0

	print "<table>"
	print "<tr><th>Set Number</th><th>Rarity</th><th colspan=\"2\">Pokemon</th><th>Type</th><th>Holo</th><th>Other</th><th>Artist</th></tr>"
}

NR > 1{
	num_td  = "<td class=\"setnum\">" $7 "/" SETSIZE "</td>"
	dex_td  = "<td class=\"dex\">" $1 "</td>"
	pkmn_td = "<td class=\"name\">" $2 "</td>"
	holo_td = "<td class=\"holofoil\">" $5 "</td>"
	info_td = "<td class=\"extrainfo\">" gensub("/", "<br>", "g", $6) "</td>"
	art_td  = "<td class=\"artist\">" $8 "</td>"
	rar_td  = "<td class=\"rarity\"><img src=\"images/general/" rarity[$4] "\"></td>"
	img = "./images/general/" tolower(types[$3]) ".png"
	type_td = "<td class=\"type " types[$3] "\"><img src=\"" img "\" alt=\"" types[$3] "\"></td>"
}

$1 ~ /T/ {
	dex_td = "<td class=\"dex\">Trainer</td>"
	type_td = "<td class=\"" types[$3] "\">" types[$3] "</td>"
}

$3 ~ /[A-Z][a-z]*[A-Z][a-z]*/ {
	A = $3
	B = $3
	sub( /[A-Z][a-z]*$/, "", A)
	sub( /^[A-Z][a-z]*/, "", B)
	imgA = "./images/general/" tolower(types[A]) ".png"
	imgB = "./images/general/" tolower(types[B]) ".png"
	type_td = "<td class=\"type " types[$3] "\"><img src=\"" imgA "\" alt=\"" types[A] "\"><img src=\"" imgB "\" alt=\"" types[B] "\"></td>"
}

$4 == "" || $4 == 0 {
	rar_td  = "<td class=\"rarity\"></td>"
}
$4 ~ /[1235]/ {
	rar_td  = "<td class=\"rarity\">" rarity[$4] "</td>"
}

$1 == 29 || $1 == 32 { # Changing the Nidoran M and F names
	pkmn_td = "<td class=\"name\">Nidoran " NIDO[$1] " </td>"
}


NR > 1 { # Build table
	print "<tr>" num_td rar_td dex_td pkmn_td type_td holo_td info_td art_td "</tr>"
}

END {
	print "</table>"
}
