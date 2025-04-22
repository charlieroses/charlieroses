function rankcmp( ranka, rankb ) {
	let		ra, rb;
	let		map = {
		"S": 13, "A": 11, "B": 8,
		"C": 5,  "D": 2,  "F": 0
	};

	ra = map[ranka[0]];
	if( ranka.length > 1 ) {
		if( ranka[1] == '+' )
			ra++;
		if( ranka[1] == '-' )
			ra--;
	}
	rb = map[rankb[0]];
	if( rankb.length > 1 ) {
		if( rankb[1] == '+' )
			rb++;
		if( rankb[1] == '-' )
			rb--;
	}

	if( ra == rb )
		return 0;
	if( ra < rb )
		return -1;
	if( ra > rb )
		return 1;
}
