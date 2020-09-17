const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%productName%}/g, product.productName);
	output = output.replace(/{%img%}/g, product.image);
	output = output.replace(/{%price%}/g, product.price);
	output = output.replace(/{%from%}/g, product.from);
	output = output.replace(/{%nutrients%}/g, product.nutrients);
	output = output.replace(/{%quantity%}/g, product.quantity);
	output = output.replace(/{%description%}/g, product.description);
	output = output.replace(/{%id%}/g, product.id);
	if(!product.organic) output = output.replace(/{%notOrganic%}/g, 'not-organic');

	return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


// server
const server = http.createServer((req,res) => {
	const { query, pathname } = url.parse(req.url, true);

	// Home Overview page
	if(pathname === '/') {
		res.writeHead(200, { 'Content-type': 'text/html'});

		const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
		const output = tempOverview.replace('{%productCards%}', cardsHtml);
		res.end(output);

	//Product Page
	} else if(pathname === '/product') {

		console.log(query);
		res.end('This is the product');

	//Api
	} else if(pathname === '/api') {
		res.writeHead(200, { 'Content-type': 'application/json'});
		res.end(data);

	// Not Found
	} else {
		res.writeHead(404, {
			'Content-type': 'text/html',
			'my-own-header': 'you are looking at my header :)'
		});
		res.end('<h1>Page not found!</h1>');
	}

});

server.listen(8000, '127.0.0.1', () => {
	console.log('listening on port 8000');
});