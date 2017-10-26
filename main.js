const search = require("./search");

const searchReady = function(foundItems) {
	foundItems.forEach((item) => console.log(item.itemName + " " + item.itemLink));
}

search.searchFor("ibm", searchReady);
