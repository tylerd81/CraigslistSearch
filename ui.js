const blessed = require("blessed");
const search = require("./search");

const createResultsBox = function createResultsBox() {
	let box = blessed.box({
		height: '75%',
		top: 0,
		left: 0,
		border: {
			type: 'line'
		}, 
		style: { 
			bg: 'blue', 
			border: {
			fg:'white'
			}
		}
	});

	
	box.setLabel({text: "Results", side: "left"});
	return box;
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

const start = function() {
	
	let screen = blessed.screen();
	
	let resultsBox = createResultsBox();
	let statusBar = createStatusBar();

	defaultStatusBar(statusBar);

	screen.key(['q','s'], (key)=> {
		if(key === 'q') {
			//only quit if the screen has the focus?
			if(screen.focused) {
				return process.exit(0);
			}
		}else if(key ==='s') {
			searchBox.focus();
			statusBar.setText("Search Mode");
			screen.render();
		}
	});

	let searchBox = createSearchBox((searchTerm) => {
		//called when input is ready
		
		//clear the results box
		resultsBox.setText("");

		search.searchFor(searchTerm, (results) => {
			results.map( (result) => {
				resultsBox.setText(resultsBox.getText() + result.itemName + "\n");
			});
			defaultStatusBar(statusBar);
			screen.render();
		});
	});

	screen.append(resultsBox);
	screen.append(searchBox);
	screen.append(statusBar);
	screen.render();
}

start();
