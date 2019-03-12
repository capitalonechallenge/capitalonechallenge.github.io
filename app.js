function search() {
	var search_val = document.getElementById('search').value;
	var queryString = "?media_type=image&page=1&q=" + search_val;	
	window.location.href = "search.html" + queryString;
}


var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
if(sPage == "search.html"){
	search2();
}

var nexturl;
var previousurl;

function search2() {
	var url_string = window.location.href
	var params = url_string.split("?")[1];
	
	var query = "https://images-api.nasa.gov/search?" + params;
	var result = httpGetAsync(query, parse);
}

document.getElementById('previous').style.display = "none";
document.getElementById('next').style.display = "none";


function parse(result){
	var parsed = JSON.parse(result);
	var total = parsed.collection.metadata.total_hits;
	//document.getElementById('numbers').innerHTML = result;
	
	var url_string = window.location.href
	var url = new URL(url_string);
	var search_val = url.searchParams.get("q");
	var page_num = url.searchParams.get("page");
	if((page_num*100) < total)
	{
		document.getElementById('numbers').innerHTML = String(1+(page_num-1)*100)+"-"+String(page_num*100) + " of " + String(total) + " for \"" + search_val + "\":";
	}
	else{
		document.getElementById('numbers').innerHTML = String(1+(page_num-1)*100)+"-"+String(total) + " of " + String(total) + " for \"" + search_val + "\":";
	}
	var pictures = parsed.collection.items;
	display_images(pictures);
	
	var size = Object.keys(parsed.collection.links).length;
	if(size == 2){
		var next_url = parsed.collection.links[1].href;
		var previous_url = parsed.collection.links[0].href;
		
		var params = previous_url.split("?")[1];
		previousurl = "search.html?" + String(params);
		
		document.getElementById('previous').style.display = "block";		
	}
	if(size == 1){
		var next_url = parsed.collection.links[0].href;
	}
	var params = next_url.split("?")[1];
	nexturl = "search.html?" + String(params);
	//alert(String(params));
	
	document.getElementById('next').style.display = "block";		
}

function next(){
	window.location.href = nexturl;
}

function previous(){
	window.location.href = previousurl;
}

function img_create(src, key) {	  
	var span = document.createElement('span')
	var dialog = document.createElement('span')

	var img = new Image(); 
	img.src = src;
	img.setAttribute('id',key);

	img.setAttribute('onclick','clicked(this.id)');
	span.appendChild(img)
	dialog.innerHTML = "<dialog class='backdrop' id='dialog" + key + "'>I'm a dialog!<br><br><form method='dialog'><input type='submit' value='Close'/></form></dialog>";
	span.appendChild(dialog)
    return span;
}

function clicked(id){
 var dialog = document.getElementById('dialog'+id);
 dialog.showModal();
 }

 
function display_images(images)
{
	var image_spot = document.getElementById('photos');
	for (var key in images) {
		var url = images[key].links[0].href;
		var image = img_create(url, key);
		image_spot.appendChild(image);
		//var span = span_create();
		//image_spot.appendChild(span);
	}
	document.getElementById('loading').style.display = "none";
}

/*
var left_hide = document.getElementById("left_hide");
var right_hide = document.getElementById("right_hide");

left_hide.style.visibility = 'hidden';
right_hide.style.visibility = 'hidden';
*/

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}