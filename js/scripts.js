/**
 *
 */

var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];

function getXmlHttpObject() {
    if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
    if (window.ActiveXObject)  { return new ActiveXObject("Microsoft.XMLHTTP"); }
    return null;
}

function askForPlots() {
    // request the marker info with AJAX for the current bounds
    var bounds=map.getBounds();
    var minll=bounds.getSouthWest();
    var maxll=bounds.getNorthEast();
    //var msg='leaflet/findbybbox.cgi?format=leaflet&bbox='+minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat;
    var msg='data/objects.json';
    ajaxRequest.onreadystatechange = stateChanged;
    ajaxRequest.open('GET', msg, true);
    ajaxRequest.send(null);
}

function stateChanged() {
    // if AJAX returned a list of markers, add them to the map
    if (ajaxRequest.readyState==4) {
        //use the info here that was returned
        if (ajaxRequest.status==200) {
            plotlist=eval("(" + ajaxRequest.responseText + ")");
            L.geoJson(plotlist).addTo(map);
        }
    }
}

function removeMarkers() {
    for (i=0;i<plotlayers.length;i++) {
        map.removeLayer(plotlayers[i]);
    }
    plotlayers=[];
}

function onMapMove(e) { askForPlots(); }

function initmap() {

    // set up AJAX request
    ajaxRequest=getXmlHttpObject();
    if (ajaxRequest==null) {
        alert ("This browser does not support HTTP Request");
        return;
    }

    // set up the map
    map = new L.Map('map', {scrollWheelZoom: false});

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 12, attribution: osmAttrib});

    // start the map in South-East England
    map.setView(new L.LatLng(68.0330, 34.5670), 6);
    map.addLayer(osm);

    askForPlots();
    //map.on('moveend', onMapMove)



}

initmap();