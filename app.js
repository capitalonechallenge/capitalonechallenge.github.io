function search() {
	var search_val = document.getElementById('search').value;
	//alert(search_val);
	var query = "https://images-api.nasa.gov/search?media_type=image&q=" + search_val;
	var result = httpGet(query);
	//document.getElementById('text1').innerHTML = result;
	var parsed = JSON.parse(result);
	var pictures = parsed.collection.items;
	display_images(pictures);
}

function img_create(src) {
	var img = new Image(); 
	img.src = src;
    return img;
}

function display_images(images)
{
	for (var key in images) {
		var url = images[key].links[0].href;
		var image = img_create(url);
		document.body.appendChild(image);
	}
}



function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}