BEGIN {
	FS="\t"
	SETABRV=ARGV[1]
	ARGC=1
	if ( SETABRV == "W" ) SETABRV = ""

	while( getline <"src/utils/pokemon/types.tsv" )
		types[$1] = $2

	print "<table>"
	print "<tr><th>Set Number</th><th colspan=\"2\">Pokemon</th><th>Type</th><th>Holo</th><th>Source</th><th>Other</th><th>Artist</th></tr>"
}

{
	num_td  = "<td class=\"setnum\">" SETABRV $7 "</td>"
	pkmn_td = "<td class=\"name\">" $2 "</td>"
	holo_td = "<td class=\"holofoil\">" $4 "</td>"
	src_td  = "<td class=\"source\">" $5 "</td>"
	info_td = "<td class=\"extrainfo\">" gensub("/", "<br>", "g", $6) "</td>"
	art_td  = "<td class=\"artist\">" $9 "</td>"
	dex_td  = "<td class=\"dex\">" $1 "</td>"
	img = "./images/general/" tolower(types[$3]) ".png"
	type_td = "<td class=\"" types[$3] "\"><img src=\"" img "\" alt=\"" types[$3] "\"></td>"
}

$1 == "T" {
	dex_td = "<td class=\"dex\">Trainer</td>"
	type_td = "<td class=\"" types[$3] "\">" types[$3] "</td>"
}

{
	print "<tr>" num_td dex_td pkmn_td type_td holo_td src_td info_td art_td "</tr>"
}

END {
	print "</table>"
}
