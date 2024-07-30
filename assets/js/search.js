var results = [];
var ndisplay;
var resultsLimit = 5;

function initselect() {
	var current;
	var counter = 1;
	var highlightCounter = 0;
	var announce;
	const keys = {
		ESC: 27,
		TAB: 9,
		RETURN: 13,
		UP: 38,
		DOWN: 40
	};
	const combobox = document.getElementById("pick-pokemon-combobox");
	const search = document.getElementById("pick-pokemon");

	combobox.setAttribute("role", "combobox");
	combobox.setAttribute("aria-owns", "pick-pokemon");
	combobox.setAttribute("aria-haspopup", "listbox");
	combobox.setAttribute("aria-expanded", "false");
 
	search.setAttribute("aria-controls", "res");
	search.setAttribute("aria-autocomplete", "list");
	document.getElementById("pick-pokemon").addEventListener('input', function (event) { doSearch(event ) });
	document.getElementById("pick-pokemon").addEventListener("keydown", function(event) { doKeyPress(keys, event)});
}

function removeAnnouncement (announcement = document.getElementById("announce")) {
	while (announcement.hasChildNodes()) {
		announcement.removeChild(announcement.lastChild);
	}
}

function doSearch( event ) {
	var errfd;
	var query = event.target.value && event.target.value[0].toUpperCase() + event.target.value.slice(1);
	event.target.removeAttribute("aria-activedescendant");

	if( document.getElementById( "pick-pokemon" ).getAttribute( "aria-invalid" ) == "true" )
		document.getElementById( "pick-pokemon" ).setAttribute( "aria-invalid", "false" );
	if( document.getElementById( "pick-pokemon-error" ).getAttribute( "role" ) == "alert" ) {
		errfd = document.getElementById( "pick-pokemon-error" );
		while( errfd.childNodes.length > 0 ) {
			errfd.removeChild( errfd.childNodes[0] );
		}
	}

	if( query.length >= 1 ) {
		results = Object.keys(dex).filter(pkmn => dex[pkmn]["name"].startsWith(query) && dex[pkmn]["size-calc-ignore"] == false );
		if( results.length >= 1 ) {
			document.getElementById("res") && document.getElementById("res").remove();
			removeAnnouncement();
			document.getElementById("pick-pokemon-autocomplete").style.display = "block";
			var res = document.createElement('ul');
			res.setAttribute("role", "listbox");
			res.setAttribute("aria-labelledby", "pick-pokemon-label");
			res.setAttribute("id", "res");
			document.getElementById("pick-pokemon-autocomplete").append(res);
			document.getElementById("pick-pokemon-combobox").setAttribute("aria-expanded", true);
			counter = 1;
			document.getElementById("res").addEventListener("click", function (event) {
				document.getElementById("pick-pokemon").value = event.target.innerText;
				document.getElementById("res").remove();
				removeAnnouncement();
				document.getElementById("pick-pokemon-autocomplete").style.display = "none";
				document.getElementById("pick-pokemon-combobox").setAttribute("aria-expanded", "false");
				document.getElementById("pick-pokemon").removeAttribute("aria-activedescendant");
				document.getElementById("pick-pokemon").focus();
				counter = 1;
			});
			for( term in results ) {
				var item = createOption( results[term] );
				document.getElementById("res").appendChild(item);
				counter = counter + 1;
			}
			if( counter > resultsLimit )
				ndisplay = resultsLimit;
			else
				ndisplay = counter - 1;
			if( ndisplay >= 1 ) {
				var announcement = document.createTextNode( results.length + " suggestions displayed.  To navigate use up and down arrow keys.");
				document.getElementById("announce").appendChild(announcement);
			}
		}
	}
	else {
		document.getElementById("res") && document.getElementById("res").remove();
		removeAnnouncement();
		document.getElementById("pick-pokemon-autocomplete").style.display = "none";
		document.getElementById("pick-pokemon-combobox").setAttribute("aria-expanded", "false");
	}
}

function doKeyPress (keys, event) {
	if (!document.getElementById("res")) return;
		var highlighted = document.getElementById("res") && [...document.getElementById("res").children].find(node => /highlight/.test(node.className));

	switch (event.which) {
		case keys.ESC:
		case keys.TAB:
			event.target.removeAttribute("aria-activedescendant");
			document.getElementById("res") && document.getElementById("res").remove();
			removeAnnouncement();
			document.getElementById("pick-pokemon-autocomplete").style.display = "none";
			document.getElementById("pick-pokemon-combobox").setAttribute("aria-expanded", "false");
			break;
		case keys.RETURN:
			if (highlighted) {
				event.preventDefault();
				event.stopPropagation();
				return selectOptions(highlighted);
			}
			break;
		case keys.UP:
			event.preventDefault();
			event.stopPropagation();
			return moveUp(highlighted);
		case keys.DOWN:
			event.preventDefault();
			event.stopPropagation();
			return moveDown(highlighted);
		default:
			return;
	}
}

function moveUp (highlighted) {
	document.getElementById("pick-pokemon").removeAttribute("aria-activedescendant");
	current = highlighted;
	if (current && current.previousElementSibling) {
		current.setAttribute('aria-selected', false);
		current.classList.remove('highlight');
		let prev = current.previousElementSibling;
		prev && prev.setAttribute('aria-selected', true);
		prev && prev.classList.add('highlight');
		prev && document.getElementById("pick-pokemon").setAttribute("aria-activedescendant", prev.id);
		prev && prev.scrollIntoView();
	}
	else {
		document.getElementById("res").firstChild.setAttribute("aria-selected", false);
		document.getElementById("res").firstChild.classList.remove("highlight");
		current = document.getElementById("res").lastChild;
		current.classList.add("highlight");
		current.setAttribute("aria-selected", true);
		document.getElementById("pick-pokemon").setAttribute("aria-activedescendant", current.id);
		current.scrollIntoView();
	}
}


function moveDown (highlighted) {
	document.getElementById("pick-pokemon").removeAttribute("aria-activedescendant");
	current = highlighted;
	if (current && current.nextElementSibling) {
		current.setAttribute('aria-selected', false);
		current.classList.remove("highlight");
		let next = current.nextElementSibling;
		next && next.classList.add('highlight');
		next && next.setAttribute('aria-selected', true);
		next && document.getElementById("pick-pokemon").setAttribute("aria-activedescendant", next.id);
		next && next.scrollIntoView();
	}
	else {
		document.getElementById("res").lastChild.setAttribute("aria-selected", false);
		document.getElementById("res").lastChild.classList.remove("highlight");
		current = document.getElementById("res").firstChild;
		current.classList.add("highlight");
		current.setAttribute("aria-selected", true);
		document.getElementById("pick-pokemon").setAttribute("aria-activedescendant", current.id)
		current.scrollIntoView();
	}
}

function createOption( dexind ) {
	var		item, id, itemText;
	
	item = document.createElement("li");
	item.setAttribute("role", "option");
	item.classList.add("autocomplete-suggestion");
	id = "suggestion-" + dexind;
	item.setAttribute("id", id);
	item.innerHTML = dex[dexind]["name"];

	return item;
}

function selectOptions (highlighted) {
	if (highlighted) {
		let search = document.getElementById("pick-pokemon");
		search.removeAttribute("aria-activedescendant");
		search.value = highlighted.innerText;
		search.focus();
		document.getElementById("res").remove();
		removeAnnouncement();
		document.getElementById("pick-pokemon-autocomplete").style.display = "none";
		document.getElementById("pick-pokemon-combobox").setAttribute("aria-expanded", "false");
	}
	else {
		return;
	}
}

