const blessed = require("blessed");

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

const createSearchBox = function createSearchBox(screen) {
	//create the search box
	let searchBox = blessed.box( {
		height: '20%',
		top: '75%',
		border: {
			type: 'line'
		},
		style: {
			bg: 'red',
			border: {
				fg: 'white'
			}
		}
	});
	searchBox.setLabel({text: "Search", side: "left"});

	//create the text input for typing in the query
	let input = blessed.textarea( {
		style: {
			fg: 'white',
			bg: 'blue',
			height: '40%',
			focus : {
				fg: 'blue',
				bg: 'white'
			}
		}
	});
	searchBox.append(input);

	searchBox.on("focus", () => input.focus());
	input.on('focus', () => input.readInput((input) => {
			searchBox.setText(input);
			screen.render();	
		})	
	);
	
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

	statusBar.setText("[Q] Quit");
	return statusBar;
}

const keyHandler = function(key, statusBar) {
	
	if(key === 'q') {		
		process.exit(0);
	}	
}

const start = function() {
	
	let screen = blessed.screen();
	
	let resultsBox = createResultsBox();
	let searchBox = createSearchBox(screen);
	let statusBar = createStatusBar();

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

	screen.append(resultsBox);
	screen.append(searchBox);
	screen.append(statusBar);
	screen.render();
}

start();
