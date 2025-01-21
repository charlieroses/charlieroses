function getIcon( name ) {
	let		elem, path;

	path = name.toLowerCase().replaceAll(" ","");

	elem = document.createElement( "img" );
	elem.setAttribute( "class", "icon " + path + "-icon" );
	elem.setAttribute( "alt", name );
	elem.setAttribute( "src", "/assets/icons/pokemon/go/" + path + ".png" );

	return elem;
}
