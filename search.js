const request = require("request");
const cheerio = require("cheerio");

const displayResults = function(foundItems) {

	console.log("Got " + foundItems.length + " items.");
	foundItems.forEach( (item) => {
		console.log(`${item.itemName} ${item.itemPrice} ${item.itemLocation}`);
	});
}

const dataReady = function(body, callback) {

	let $ = cheerio.load(body);
	let results = $('.result-info');
	

	let foundItems = $(results).map(function(i, element) {
		let itemName = $(element).children("a").text();
		let itemLink = $(element).children("a").attr("href");
		let itemPrice = $(element).find(".result-price").text();
		let itemLocation = $(element).find("result-hood").text();
		
		return {itemName, itemLink, itemPrice, itemLocation};
	}).toArray();

	callback(foundItems);
}

const searchFor = function(searchTerm, callback) {
	let queryAddress = "https://albany.craigslist.org/search/sya?query=";
	let search = queryAddress + searchTerm.replace(" ", "+");
	
	request(search, (error, response, body) => {
		dataReady(body, callback);
	});
}

module.exports = { searchFor };
