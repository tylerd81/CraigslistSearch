const blessed = require("blessed");
const search = require("./search");

const createResultsBox = function createResultsBox() {
	let box = blessed.list({
		height: '50%',
		top: 0,
		left: 0,
		border: {
			type: 'line'
		}, 
		style: { 
			bg: 'blue', 
			border: {
			fg:'white'
			},
			item : {
				fg: 'white', 
				bg: 'blue',
			},
			selected : {
				fg: 'blue',
				bg: 'white',
				border : { fg: 'red'}
			}
		},
		keys : {
			down: 'd',
			up : 'u'
		}
	});

	
	box.setLabel({text: "Results", side: "left"});
	return box;
}

const createDetailsBox = function() {
	let detailsBox = blessed.box( {
		height: '25%',
		top: '50%',
		border: {
			type: 'line'
		},
		style: {
			fg: 'white',
			border: {fg: 'white'}
		}
	});

	return detailsBox;
}

const createSearchBox = function createSearchBox(searchTextReady) {
	//create the search box
	let searchBox = blessed.textbox( {
		height: '10%',
		top: '75%',
		border: {
			type: 'line'
		},
		style: {
			bg: 'red',
			border: {
				fg: 'white'
			},
			focus: {
				border: { fg: 'blue'}
			}
		}
	});
	searchBox.setLabel({text: "Search", side: "left"});

	searchBox.on('focus', function() {
		this.readInput((input) => {
			//input doesn't seem to have the correct value?
			searchTextReady(this.value);
		})	
	});
	
	return searchBox;
}

const createStatusBar = function createStatusBar() {
	let statusBar = blessed.box( {
		height: "5%",
		top: "95%",
		style: {

			bg: 'white',
			fg: 'black'
		}
	});

	return statusBar;
}

const keyHandler = function(key, statusBar) {
	
	if(key === 'q') {		
		process.exit(0);
	}	
}

const defaultStatusBar = function(statusBar) {
	let menu = "[S] Search [Q] Quit";
	statusBar.setText(menu);
}

const addResultsToList = function(results, list) {
	results.map( (result) => list.add(result.itemName));
}

const start = function() {
	
	let screen = blessed.screen();
	
	let resultsBox = createResultsBox();
	let statusBar = createStatusBar();
	let detailsBox = createDetailsBox();
	let currentResults = [];

	defaultStatusBar(statusBar);

	screen.key(['q','s','down','up', 'i'], (key)=> {

		if(key === 'q') {
			//only quit if the screen has the focus?
			if(screen.focused) {
				return process.exit(0);
			}
		}else if(key ==='s') {
			searchBox.focus();
			statusBar.setText("Search Mode");
		}else if(key === 'u') {
			resultsBox.up(1);
		}else if(key === 'd') {
			resultsBox.down(1);
		}
		screen.render();
	});

	let searchBox = createSearchBox((searchTerm) => {
		//called when input is ready
		
		//clear the results 
		resultsBox.clearItems();

		search.searchFor(searchTerm, (results) => {

			currentResults = results;
			addResultsToList(results, resultsBox);	
			resultsBox.focus();	
			defaultStatusBar(statusBar);
			screen.render();
		});
	});

	resultsBox.on('select', (selected) => { 
		//the index starts counting at 2(?)
		let realIndex = selected.index - 2;
		let selectedItem = currentResults[realIndex];
		let detailString = `${selectedItem.itemName}\n` +
			`${selectedItem.itemPrice}\n` + 
			`${selectedItem.itemLink}`;
		
		let itemLocation = selectedItem.itemLocation === "" ?
			selectedItem.itemNearbyLocation : selectedItem.itemLocation;
		itemLocation = itemLocation.trim();
 
		detailsBox.setText(detailString + "\n" + itemLocation);
		screen.render();
	});

	screen.append(resultsBox);
	screen.append(searchBox);
	screen.append(statusBar);
	screen.append(detailsBox);
	screen.render();
}

start();
