//Check if the page is the search page
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
if(sPage == "search.html"){
	
	//Hide the next and previous buttons
	document.getElementById('previous').style.display = "none";
	document.getElementById('next').style.display = "none";
	
	//Start the Async Get Request to the NASA API
	search_call();
	
	//Pull all the params in the url to load these values into the filtering input fields
	var url_string = window.location.href
	var url = new URL(url_string);
	var search = url.searchParams.get("q");
	var start = url.searchParams.get("year_start");
	var end = url.searchParams.get("year_end");
	var location_data = url.searchParams.get("location");
	var photographer = url.searchParams.get("photographer");

	var search_bar = document.getElementById('search');
	var start_bar = document.getElementById('start');
	var end_bar = document.getElementById('end');
	var location_bar = document.getElementById('location');
	var photographer_bar = document.getElementById('photographer');

	search_bar.setAttribute('value', String(search));
	start_bar.setAttribute('value', String(start));
	end_bar.setAttribute('value', String(end));
	if(location_data != null)
	{
		location_bar.setAttribute('value',String(location_data));
	}
	if(photographer != null)
	{
		photographer_bar.setAttribute('value',String(photographer));
	}
}


//Search Function called by the homepage to load up the search page with the proper params
function search() {
	var search_val = document.getElementById('search').value;
	var queryString = "?media_type=image&year_start=1920&year_end=2019&page=1&q=" + search_val;	
	window.location.href = "search.html" + queryString;
}


//Function to reload the page with the proper params after the search filters are changed
function searchme() {
	var search_val = document.getElementById('search').value;
	var start_year = document.getElementById('start').value;
	var end_year = document.getElementById('end').value;
	var location_data = document.getElementById('location').value;
	var photographer = document.getElementById('photographer').value;

	var queryString = "?media_type=image&year_start=" + start_year + "&year_end=" + end_year + "&location=" + location_data + "&photographer=" + photographer + "&page=1&q=" + search_val;	

	window.location.href = "search.html" + queryString;
}


//Global variables to keep the next and previous page urls
var nexturl;
var previousurl;


//Do the ASYNC call to the NASA API
function search_call() {
	var url_string = window.location.href
	var params = url_string.split("?")[1];
	
	var query = "https://images-api.nasa.gov/search?" + params;
	var result = httpGetAsync(query, parse);
}


//If the page is the display single image page load up the proper support functions
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
if(sPage == "display.html"){
	load_image();
	load_metadata();
}


//Call the ASYNC get request for an image's metadata
function load_metadata(){
	var url_string = window.location.href
	var url = new URL(url_string);
	var nasa_id = url.searchParams.get("nasa_id");
	
	var query = "https://images-assets.nasa.gov/image/" + nasa_id + "/metadata.json";
	var result = httpGetAsync(query, load_text);
}

//The callback function to display an image's metadata on the display page
function load_text(result){
	var parsed = JSON.parse(result);
	var title = parsed["AVAIL:Title"];
	var date = parsed["AVAIL:DateCreated"];
	var center = parsed["AVAIL:Center"];
	var description = parsed["AVAIL:Description"];
	var nasa_id = parsed["AVAIL:NASAID"];

	var photographer = parsed["AVAIL:Photographer"];
	var location_data = parsed["AVAIL:Location"];
	var keywords = parsed["AVAIL:Keywords"];
	var owner = parsed["AVAIL:Owner"];
	var secondary_creator = parsed["AVAIL:SecondaryCreator"];
	var album = parsed["AVAIL:Album"];
	
	var meta = document.getElementById('meta_data');

	var title_h = document.getElementById('title');
	var loading = document.getElementById('loading');
	loading.style.display = "none";
	
	title_h.innerHTML = title;
	
	meta.innerHTML += "<b>Date Created:</b> " + date + "<br><br>";
	meta.innerHTML += "<b>Center:</b> " + center + "<br><br>";
	meta.innerHTML += "<b>NASA ID:</b> " + nasa_id + "<br><br>";

	if(photographer != ""){
		meta.innerHTML += "<b>Photographer:</b> " + photographer + "<br><br>";
	}
	if(location_data != ""){
		meta.innerHTML += "<b>Location:</b> " + location_data + "<br><br>";
	}
	if(owner != ""){
		meta.innerHTML += "<b>Owner:</b> " + owner + "<br><br>";
	}
	if(secondary_creator != ""){
		meta.innerHTML += "<b>Secondary Creator:</b> " + secondary_creator + "<br><br>";
	}
	if(album != ""){
		meta.innerHTML += "<b>Album:</b> " + album + "<br><br>";
	}
	
	if(keywords.length > 1)
	{
		meta.innerHTML += "<b>Keywords:</b> ";

		for (index = 0; index < keywords.length; ++index) {
			meta.innerHTML += "<span class='mdl-chip'><span class='mdl-chip__text'>" + keywords[index] + "</span></span>&nbsp;";
		}
		meta.innerHTML += "<br><br>";
	}

	
	meta.innerHTML += "<i>" + description;
	meta.innerHTML += "<br><br><button onclick='back();' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'>Back</button>"
}

//Function for the back button on the display page to work
function back(){
	window.history.back();
}

//Function to start the async get request for the large image on the display page
function load_image(){
	var url_string = window.location.href
	var url = new URL(url_string);
	var nasa_id = url.searchParams.get("nasa_id");
	
	var query = "https://images-api.nasa.gov/asset/" + nasa_id;
	var result = httpGetAsync(query, large_image);
}

//Callback function to display the large image on the display page
function large_image(result){
	var parsed = JSON.parse(result);
	var image_url = parsed.collection.items[1].href;
	var image_spot = document.getElementById('side_image');
	
	document.getElementById('loading_photo').style.display = "none";
	
	var img = new Image(); 
	img.src = image_url;
	img.setAttribute('width',"100%");
	image_spot.appendChild(img);
}

//Callback function to display the results on the search page
function parse(result){
	var parsed = JSON.parse(result);
	
	//Handle basically all the errors (sorta)
	if(Object.keys(parsed.collection.items).length == 0)
	{
		document.getElementById('numbers').innerHTML = "No Results Found!";
		var loading = document.getElementById('loading');
		loading.style.display = "none";
		return;
	}
	//alert(parsed);
	var total = parsed.collection.metadata.total_hits;
	//document.getElementById('numbers').innerHTML = result;
	
	var url_string = window.location.href
	var url = new URL(url_string);
	var search_val = url.searchParams.get("q");
	var page_num = url.searchParams.get("page");
	
	//Set the proper number of images heading
	if((page_num*100) < total)
	{
		document.getElementById('numbers').innerHTML = String(1+(page_num-1)*100)+"-"+String(page_num*100) + " of " + String(total) + " for \"" + search_val + "\":";
	}
	else{
		document.getElementById('numbers').innerHTML = String(1+(page_num-1)*100)+"-"+String(total) + " of " + String(total) + " for \"" + search_val + "\":";
	}
	var pictures = parsed.collection.items;
	
	//Call support function to display all the results in the grid
	display_images(pictures);
	
	//Properly setup the next and previous buttons on the page depending on the situation
	var size = Object.keys(parsed.collection.links).length;
	if(size == 2){
		var next_url = parsed.collection.links[1].href;
		var previous_url = parsed.collection.links[0].href;
		
		var params = previous_url.split("?")[1];
		previousurl = "search.html?" + String(params);
		params = next_url.split("?")[1];
		nexturl = "search.html?" + String(params);
		
		document.getElementById('previous').style.display = "block";
		document.getElementById('next').style.display = "block";
	}
	if(size == 1 && parsed.collection.links[0]["prompt"] == "Next"){
		var next_url = parsed.collection.links[0].href;
		var params = next_url.split("?")[1];
		nexturl = "search.html?" + String(params);	
		document.getElementById('next').style.display = "block";
	}
	else if(size == 1)
	{
		var next_url = parsed.collection.links[0].href;
		var params = next_url.split("?")[1];
		previousurl = "search.html?" + String(params);	
		document.getElementById('previous').style.display = "block";		
	}
	
}


//Function for the next button on the search page
function next(){
	window.location.href = nexturl;
}

//Function for the previous button on the search page
function previous(){
	window.location.href = previousurl;
}

//Support function for the display_images function to create image elements with the proper links to their display page
function img_create(src, key, data) {	  
	var alink = document.createElement('a')
	alink.setAttribute('href',"display.html?nasa_id="+data.nasa_id);

	var img = new Image(); 
	img.src = src;
	img.setAttribute('id',key);
	alink.appendChild(img)
	
	//dialog.innerHTML = "<dialog class='backdrop' id='dialog" + key + "'><img src='" + src + "' width='auto' height='80%'><table><tr><td><b>" + data.title + "</b></td></tr><tr><td>" + data.description + "</td></tr><tr><td>Date:" + data.date_created + "</td></tr><tr><td>Center:" + data.center + "</td></tr><tr><td>Photographer:" + data.photographer + "</td></tr><tr><td>Location:" + data.location + "</td></tr><tr><td>NASA ID:" + data.nasa_id + "</td></tr><tr><td><form method='dialog'><input type='submit' value='Close'/></form></td></tr></table></dialog>";
    return alink;
}

/*
function clicked(id){
 var dialog = document.getElementById('dialog'+id);
 dialog.showModal();
 }
*/

//Function to display all the search results in a grid on the search page
function display_images(images)
{
	var image_spot = document.getElementById('photos');
	for (var key in images) {
		var url = images[key].links[0].href;
		var data = images[key].data[0];
		var image = img_create(url, key, data);
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


//Function to display an error message on the search page
function error()
{
	document.getElementById('numbers').innerHTML = "No Results Found!";
	var loading = document.getElementById('loading');
	loading.style.display = "none";
}

//Your favorite async function caller
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
		if(xmlHttp.status == 400)
			error();
		if(xmlHttp.status == 404)
			error();
    }
    xmlHttp.open("GET", "https://cors-anywhere.herokuapp.com/" + theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

/*
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
*/