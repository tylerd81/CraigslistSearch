const search = require("./search");
const readline = require("readline");

const searchReady = function(foundItems) {
	foundItems.forEach((item) => console.log(item.itemName));
}

const rl = readline.createInterface( {
	input: process.stdin,
	output: process.stdout
});

rl.question("Enter a search term: ", (searchTerm) => {
	search.searchFor(searchTerm, searchReady);
	rl.close();
});
