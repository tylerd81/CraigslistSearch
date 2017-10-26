const request = require("request");
const cheerio = require("cheerio");

const displayResults = function(foundItems) {

	console.log("Got " + foundItems.length + " items.");
	foundItems.forEach( (item) => {
		console.log(`${item.itemName} ${item.itemPrice} ${item.itemLocation}`);
	});
}

const dataReady = function(error, response, body) {
	let $ = cheerio.load(body);
	console.log("Data Loaded");
	let results = $('.result-info');
	
	console.log(results.length + " results found.");

	let foundItems = $(results).map(function(i, element) {
		let itemName = $(element).children("a").text();
		let itemPrice = $(element).find(".result-price").text();
		let itemLocation = $(element).find("result-hood").text();
		
		return {itemName, itemPrice, itemLocation};
	}).toArray();

	displayResults(foundItems);
}

const searchFor = function(searchTerm, callback) {
	let queryAddress = "https://albany.craigslist.org/search/sya?query=";
	let search = queryAddress + searchTerm.replace(" ", "+");
	
	request(search, callback);
	console.log(`Query ${search} started.`);
}

searchFor("ibm", dataReady);
