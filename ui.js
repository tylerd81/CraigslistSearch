const blessed = require("blessed");

const createResultsBox = function() {
	let box = blessed.box({
		height: '75%',
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

const start = function() {
	
	let screen = blessed.screen();
	screen.key(['q'], function() { return process.exit(0);});

	let resultsBox = createResultsBox();
	screen.append(resultsBox);
	screen.render();
}

start();
