#!/usr/bin/awk -f

function processtext( str ) {
	str = processlinks( str )
	rstr = ""
	for( i = 1; i <= length(str); i++ ) {
		if( substr( str, i, 3 ) == "***" && ! textpre ) {
			if( substr( text, 0, 2 ) == "bi" ) {
				rstr = rstr "</b></i>"
				text = substr( text, 3 )
			}
			else {
				rstr = rstr "<i><b>"
				text = "bi" text
			}
			i += 2
		}
		else if( substr( str, i, 2 ) in txtmap && ! textpre ) {
			ss = substr( str, i, 2 )
			if( substr( text, 0, length(txtmap[ss]) ) == txtmap[ss] ) {
				rstr = rstr "</" txtmap[ss] ">"
				text = substr( text, length(txtmap[ss])+1 )
			}
			else {
				rstr = rstr "<" txtmap[ss] ">"
				text = txtmap[ss] text
			}
			i++
		}
		else if( substr( str, i, 1 ) == "<"  && ! textpre ) {
			textpre = "<"
			rstr = rstr "<"
		}
		else if( substr( str, i, 1 ) == ">"  && textpre == "<" ) {
			textpre = ""
			rstr = rstr ">"
		}
		else if( substr( str, i, 1 ) == "`" ) {
			if( textpre ) {
				rstr = rstr "</code>"
				textpre = ""
			}
			else {
				rstr = rstr "<code>"
				textpre = "`"
			}
		}
		else if( substr(str, i, 7) ~ /#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]/ && ! textpre ) {
			ss = substr( str, i, 7 )
			if( ss ~ /#[0-8].[0-8].[0-8]./ )
				color = "white"
			else
				color = "black"
			rstr = rstr "<span class=\"hexcode\" style=\"background-color:" ss "; color:" color ";\">" ss "</span>"
			i += 6
		}
		else if( substr( str, i, 1 ) in txtmap && ! textpre ) {
			ss = substr( str, i, 1 )
			if( substr( text, 0, length(txtmap[ss]) ) == txtmap[ss] ) {
				rstr = rstr "</" txtmap[ss] ">"
				text = substr( text, length(txtmap[ss])+1 )
			}
			else {
				rstr = rstr "<" txtmap[ss] ">"
				text = txtmap[ss] text
			}
		}
		else if( substr( str, i, 2 ) ~ /\\[*_~^`>:|]/ ) {
			rstr = rstr substr( str, i+1, 1 )
			i++
		}
		else {
			rstr = rstr substr( str, i, 1 )
		}
	}

	for( a in abbrvs ) {
		gsub( a, "<abbr title=\"" abbrvs[a] "\">" a "</abbr>", rstr )
	}
	return rstr
}

function processlinks( str ) {
	# Images
	while( match( str, /!\[[^]]*\]\([^)]*\)/ ) > 0 ) {
		ss = substr( str, RSTART, RLENGTH )
		gsub( "&", "\\\\&", ss )
		alt = substr( ss, 0, index(ss, "](" )-1 )
		alt = substr( alt, 3 )
		src = substr( ss, index( ss, "](" )+2 )
		src = substr( src, 0, length(src)-1 )
		img = "<img src=\"" src "\""
		if( length(alt) )
			img = img " alt=\"" alt "\" id=\"" makeid(alt) "\""
		img = img ">"
		sub( /!\[[^]]*\]\([^)]*\)/, img, str )
	}
	# Links
	while( match( str, /\[[^]]*\]\]\([^)]*\)/ ) > 0 ) {
		ss = substr( str, RSTART, RLENGTH )
		gsub( "&", "\\\\&", ss )
		alt = substr( ss, 0, index(ss, "](" )-1 )
		alt = substr( alt, 2 )
		src = substr( ss, index( ss, "](" )+2 )
		src = substr( src, 0, length(src)-1 )
		if( length(alt) == 0 )
			alt = src
		sub( /\[[^]]*\]\]\([^)]*\)/, "<a href=\"" src "\">" alt "</a>", str )
	}
	while( match( str, /\[[^]]*\]\([^)]*\)/ ) > 0 ) {
		ss = substr( str, RSTART, RLENGTH )
		gsub( "&", "\\\\&", ss )
		alt = substr( ss, 0, index(ss, "](" )-1 )
		alt = substr( alt, 2 )
		src = substr( ss, index( ss, "](" )+2 )
		src = substr( src, 0, length(src)-1 )
		if( length(alt) == 0 )
			alt = src
		sub( /\[[^]]*\]\([^)]*\)/, "<a href=\"" src "\">" alt "</a>", str )
	}
	# Footnote Details
	while( match( str, /\[\^[0-9]+\]:/ ) > 0 ) {
		ss = substr( str, RSTART, RLENGTH )
		gsub( "&", "\\\\&", ss )
		num = substr( ss, 0, length(ss)-2 )
		num = substr( num, 3 )
		sub( /\[\^[0-9]+\]:/, "<a href=\"#ref-" num "\" id=\"details-" num "\">[" num "]:</a>", str )
	}
	# Footnote Refs
	while( match( str, /\[\^[0-9]+\]/ ) > 0 ) {
		ss = substr( str, RSTART, RLENGTH )
		gsub( "&", "\\\\&", ss )
		num = substr( ss, 0, length(ss)-1 )
		num = substr( num, 3 )
		sub( /\[\^[0-9]+\]/, "<a href=\"#details-" num "\" id=\"ref-" num "\">[" num "]</a>", str )
	}
	return str
}

function psuedopre( n ) {
	split( "if then else fi for rof while elihw to do and or", keywords, " " )
	pdepth = 0
	
	for( i = 1; i < n; i++ ) {
		match( block[i], /^\t*/ )
		leadwp = substr( block[i], 1, RLENGTH )
		d = gsub( /\t/, "", leadwp )
		if( d != pdepth )
			pdepth = d
		sub( /^\t+/, "", block[i] )

		ln = i
		while( length(ln) < length(n) )
			ln = " " ln
		ln = ln " : "
		for( j = 0; j < pdepth; j++ )
			ln = ln "    "

		gsub( /\\"/, "\\&bsol;\\&quot;", block[i] )
		tn = split( block[i], tblocks, "\"" )
		if( tn > 1 ) {
			temp = ""
			for( j = 1; j <= tn; j++ ) {
				if( j % 2 )
					temp = temp tblocks[j]
				else {
					gsub( /\\./, "<span class=\"char\">&</span>", tblocks[j] )
					gsub( /&bsol;&quot;/, "<span class=\"char\">&</span>", tblocks[j] )
					temp = temp "<span class=\"string\">\"" tblocks[j] "\"</span>"
				}
			}
			block[i] = temp
		}

		gsub( /'.'/, "<span class=\"char\">&</span>", block[i] )
		gsub( /'\\.'/, "<span class=\"char\">&</span>", block[i] )

		if( match( block[i], /\/\/.*$/ ) ) {
			prefix = substr( block[i], 1, RSTART-1 )
			suffix = substr( block[i], RSTART )
			block[i] = prefix "<span class=\"comment\">" suffix "</span>"
		}
		if( match( block[i], /^fun/ ) ) {
			prefix = substr( block[i], 1, index( block[i], "(" )-1 )
			prefix = substr( prefix, 5 )
			suffix = substr( block[i], index( block[i], "(" ) )
			block[i] = "<span class=\"fun\">fun</span> <span class=\"funname\">" prefix "</span>" suffix
		}
		if( match( block[i], /^end/ ) ) {
			suffix = substr( block[i], 5 )
			block[i] = "<span class=\"end\">end</span> <span class=\"funname\">" suffix "</span>"
		}
		
		for( kwi in keywords ) {
			kw = keywords[kwi]
			pat = "^" kw "$"
			gsub( pat, "<span class=\"" kw "\">" kw "</span>", block[i] )
			pat = "^" kw "[(]"
			gsub( pat, "<span class=\"" kw "\">" kw "</span>(", block[i] )
			pat = "^" kw "[ \t]"
			gsub( pat, "<span class=\"" kw "\">" kw "</span> ", block[i] )
			pat = "[ \t]" kw "$"
			gsub( pat, " <span class=\"" kw "\">" kw "</span>", block[i] )
			pat = "[ \t]" kw "[(]"
			gsub( pat, "<span class=\"" kw "\">" kw "</span>(", block[i] )
			pat = "[ \t]" kw "[ \t]"
			gsub( pat, " <span class=\"" kw "\">" kw "</span> ", block[i] )
		}
		printout( ln block[i] , 1 )
	}

}

function printout( str, nl ) {
	if( nl )
		print str "\n"
	else
		print str
}

function opentag( t ) {
	printout( "<" tagmap[t] ">", 1 )
	tags = t tags
}

function closetags ( d ) {
	while( d > 0 ) {
		t = substr( tags, 1, 1 )
		printout( "</" tagmap[t] ">", 1 )
		tags = substr( tags, 2 )
		d--
	}
}

function makeid( str ) {
	s = tolower( str )
	gsub( /[^a-z0-9 ]/, "", s )
	gsub( / /, "-", s )
	return s
}

BEGIN {
	FS = "\n"
	ORS = ""

	tags = ""
	pre = 0
	text = ""
	textpre = ""
	table = ""
	center = ""

	tagmap["b"] = "blockquote"
	tagmap["p"] = "p"
	tagmap["u"] = "ul"
	tagmap["o"] = "ol"
	tagmap["l"] = "li"
	txtmap["**"] = "b"
	txtmap["__"] = "u"
	txtmap["~~"] = "del"
	txtmap["``"] = "code"
	txtmap["*"] = "i"
	txtmap["_"] = "i"
	txtmap["^"] = "sup"
	txtmap["~"] = "sub"
}



/^[^|]/ && length(table) != 0 {
	printout( "</table>", 1 )
	table = ""
}

# Abbreviations
/^\[>[^\]]+\]:[ \t]+/ {
	abrv = substr( $0, 1, index( $0, ":" ) )
	abrv = substr( abrv, 3, length(abrv)-4 )
	ttle = substr( $0, index( $0, ":" )+1 )
	sub( /^[ \t]*/, "", ttle )
	sub( /[ \t]*$/, "", ttle )
	abbrvs[abrv] = ttle
	next
}

/```/ {
	if( pre != 0 ) {
		if( match( pre, /psuedo/ ) )
			psuedopre( psuedopreln )
		printout( "</pre>", 1 )
		pre = 0
	}
	else {
		sub( /```/, "", $0 )
		pre = "sourcecode"
		if( length($0) )
			pre = pre " " $0
		printout( "<pre class=\"" pre "\">", 0 )
		if( match( pre, /psuedo/ ) )
			psuedopreln = 1
	}
	next
}

pre != 0 {
	if( match( pre, /psuedo/ ) ) {
		block[psuedopreln] = $0
		psuedopreln++
	}
	else {
		print $0 "\n"
	}
	next
}


# div opens
/^<\/?div/ {
	closetags( length(tags) )

	printout( $0, 1 )
	next
}

# Rule
/^---/ {
	closetags( length(tags) )

	printout( "<hr>", 1 )
	next
}

# br
/^\+\+\+/ {
	printout( "<br>", 1 )
	next
}

# Center
/^></ {
	closetags( length(tags) )

	printout( "<" center "center>", 1 )
	if( center )
		center = ""
	else
		center = "/"
	next
}

# Blank lines
length($0) == 0 {
	if( table ) {

	}
	closetags( length(tags) )
	next
}

# Blockquote
/^>/ {
	match( $0, /^(>[ \t]*)+/ )
	blocks = substr( $0, RSTART, RLENGTH )
	bdepth = gsub( />/, "", blocks )
	i = gsub( /b/, "b", tags )
	sub( /^(>[ \t]*)+/, "", $0 )
	if( i < bdepth ) { # add block quotes
		for( i = i; i < bdepth; i++ )
			opentag( "b" )
	}
	else if ( i > bdepth ) { # remove blockquotes
		for( i = i; i > bdepth; i-- ) {
			closetags( index( tags, "b" ) )
		}
	}
	if( length($0) == 0 ) {
		closetags( index( tags, "b" )-1 )
		next
	}
}

# Header
/^#+[ \t]+/ {
	match( $0, /^#+[ \t]+/ )
	header = substr( $0, RSTART )
	hdepth = gsub( /#/, "", header )
	sub( /^#+[ \t]+/, "", $0 )
	sub( /[ \t]*$/, "", $0 )
	class = ""
	if( match( $0, /[ \t]+{[^}]*}$/ ) ) {
		class = substr( $0, RSTART )
		$0 = substr( $0, 1, RSTART )
		sub( /^[ \t]*{\./, "", class )
		sub( /}$/, "", class )
		class = " class=\"" class "\""
	}
	printout( "<h" hdepth class " id=\"" makeid($0) "\">" processtext( $0 ) "</h" hdepth ">", 1 )
	next
}

# Figure

/^!!\[[^]]*\]\([^)]*\)/ {
	sub( /^!!\[/, "", $0 )
	sub( /)$/, "", $0 )
	alt = substr( $0, 1, index( $0, "]" )-1 )
	src = substr( $0, index( $0, "(" )+1 )
	id = src
	sub( /\.[a-z]*$/, "", id )

	printout( "<div id=\"" id "\" class=\"figure\">", 1 )
	printout( "<center>", 1 )
	printout( "<img src=\"" src "\">", 1 )
	printout( "<br>", 1 )
	printout( "<i>" alt "</i>", 1 )
	printout( "</center>", 1 )
	printout( "</div>", 1 )
	next
}

# Table
/^\|/ {
	gsub( /\\\|/, "&#124;", $0 )
	if( length(table) == 0 ) {
		ss = substr( $0, 1, index( $0, "||" )-1 )
		c = gsub( /\|/, "|", ss )
		printout( "<table>", 1 )
		table = "1"
		cell = "h"
	}
	if( $0 ~ /^\|[\:\-\|]*\|$/ ) {
		cell = "d"
		next
	}
	sub( /^\|[ \t]*/, "", $0 )
	thcol = substr( $0, 0, index( $0, "||" ) )
	tdcol = substr( $0, index( $0, "||" ) )
	sub( /^\|\|/, "", tdcol )
	printout( "<tr>", 1 )
	b = index( thcol, "|" )
	while( b > 0 ) {
		text = substr( thcol, 1, b-1 )
		thcol = substr( thcol, b+1 )
		b = index( thcol, "|" )
		sub( /^[ \t]*/, "", text )
		sub( /[ \t]*$/, "", text )
		printout( "<th>", 0 )
		printout( processtext(text), 0 )
		printout( "</th>", 1 )
	}
	b = index( tdcol, "|" )
	while( b != 0 ) {
		text = substr( tdcol, 1, b-1 )
		tdcol = substr( tdcol, b+1 )
		b = index( tdcol, "|" )
		sub( /^[ \t]*/, "", text )
		sub( /[ \t]*$/, "", text )
		printout( "<t" cell ">", 0 )
		printout( processtext(text), 0 )
		printout( "</t" cell ">", 1 )
	}
	printout( "</tr>", 1 )
	next
}

## Ordered/Unordered List
/^[ \t]*-[ \t]+/ || /^[ \t]*[0-9]+\.[ \t]+/ {
	match( $0, /^[ \t]*[-0-9]/ )
	whitespace = substr( $0, RSTART, RLENGTH )
	ldepth = gsub( /[ \t]/, "", whitespace )
	cdepth = gsub( /u/, "u", tags )
	cdepth += gsub( /o/, "o", tags )
	if( ldepth+1 > cdepth ) { # add lists
		if( $0 ~ /^[ \t]*-/ )
			opentag( "u" )
		else
			opentag( "o" )
	}
	else if ( ldepth < cdepth-1 ) { # remove lists
		i = cdepth - ldepth - 1
		closetags( i * 2 )
	}
	else {
		closetags( 1 )
	}
	opentag( "l" )

	sub( /^[ \t]*((-)|([0-9]+\.))[ \t]+/, "", $0 )
}

# Text that needs to be formatted
{
	if( length(tags) == 0 || tags ~ /^[^pl]/ )
		opentag( "p" )
	sub( /^[ \t]*/, "", $0 )
	printout( processtext( $0 ), 1 )
}

END {
	if( table ) {
		printout( "</table>", 1 )
	}

	closetags( length(tags) )

	if( center ) {
		printout( "</center>", 1 )
	}

}
