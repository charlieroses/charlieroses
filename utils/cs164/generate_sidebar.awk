BEGIN {
	FS = "\t"
	print "<div id=\"sidebar\">"
	print "\t<div class=\"content\">"
}

NR > 1 {
	if( $1 ~ "0.*" ) {
		print "\t</div>"
		print "\t<hr>"
		print "\t<div class=\"content\">"

		if( $3 = "LINK" ) {
			printf("\t\t<a href=\"%s\"><b>%s</b></a>\n", $4, $2 )
		}
		else {
			printf("\t\t<a href=\"%s/%s.html\"><b>%s</b></a>\n", $3, $4, $2 )
		}
	}
	else {
		section = $1
		link = $3 "/" $4 ".html"
		title = $2

		if( $1 !~ /.*\..*/  ) {
			print "\t</div>"
			print "\t<hr>"
			print "\t<div class=\"content\">"
			section = "Chapter " $1
			link = $3 "/"
		}
		printf("\t\t<a href=\"%s\"><b>%s :</b> %s</a>\n", link, section, title )
	}
}

END {
	print "\t</div>"
	print "</div>"
}
