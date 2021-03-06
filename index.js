$(document).ready(function(){

  $board = $('#board');


  var center_x = $(window).width() / 2;
  var center_y = $(window).height() / 2;
  // var radius = 400;
  var all_lines = [];
  var stroke_width = 0.1;

  // draw_a_circle(origin_x, origin_y, radius);
  draw_a_circle(center_x - 0, 80, 15, stroke_width);

  draw_a_circle(center_x - 40, 120, 25, stroke_width * 2);
  draw_a_circle(center_x - 80, 180, 35, stroke_width * 4 );
  draw_a_circle(center_x - 120, 260, 45, stroke_width * 8 );
  draw_a_circle(center_x - 160, 360, 55, stroke_width * 16 );
  draw_a_circle(center_x - 200, 480, 65, stroke_width * 32 );
  draw_a_circle(center_x - 210, 610, 95, stroke_width * 64 );

  draw_a_circle(center_x + 40, 120, 25, stroke_width * 2);
  draw_a_circle(center_x + 80, 180, 35, stroke_width * 4 );
  draw_a_circle(center_x + 120, 260, 45, stroke_width * 8 );
  draw_a_circle(center_x + 160, 360, 55, stroke_width * 16 );
  draw_a_circle(center_x + 200, 480, 65, stroke_width * 32 );
  draw_a_circle(center_x + 210, 610, 95, stroke_width * 64 );



function draw_a_circle(origin_x, origin_y, radius, stroke_width) {
  
  for (circle_loop = 0; circle_loop < 360; circle_loop = circle_loop + 5) {

    var pointA_x = origin_x+(radius * Math.cos(circle_loop));
    var pointA_y = origin_y+(radius * Math.sin(circle_loop));
    pointA_x = Math.round(pointA_x * 100) / 100;
    pointA_y = Math.round(pointA_y * 100) / 100;

    // ORIGIN_X,ORIGIN_Y POINTA_X,POINTA_Y
    var single_line = center_x+","+center_y+" "
      +pointA_x+","+pointA_y;

    var one_line = {points: single_line, color:'transparent', stroke_color:'white', stroke_width:stroke_width};
    all_lines.push(one_line);
  }
}

    all_lines.map(function(one_line){
      $line = $(document.createElementNS("http://www.w3.org/2000/svg", "polygon")).attr({
          "points": one_line.points,
          "style": 
            "fill:"+one_line.color
            +";stroke:"+one_line.stroke_color
            +";stroke-width:"+one_line.stroke_width
            +";fill-rule:nonzero;"
          });
      $board.append($line);
    });
  

  // $('#board').on('click', function(){  } );
  exportSVG();
});


var exportSVG = function(svg = $('#board').get(0) ) {
  // first create a clone of our svg node so we don't mess the original one
  var clone = svg.cloneNode(true);
  // parse the styles
  parseStyles(clone);

  // create a doctype
  var svgDocType = document.implementation.createDocumentType('svg', "-//W3C//DTD SVG 1.1//EN", "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd");
  // a fresh svg document
  var svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
  // replace the documentElement with our clone 
  svgDoc.replaceChild(clone, svgDoc.documentElement);
  // get the data
  var svgData = (new XMLSerializer()).serializeToString(svgDoc);

  // now you've got your svg data, the following will depend on how you want to download it
  // e.g yo could make a Blob of it for FileSaver.js
  /*
  var blob = new Blob([svgData.replace(/></g, '>\n\r<')]);
  saveAs(blob, 'myAwesomeSVG.svg');
  */
  // here I'll just make a simple a with download attribute

  var a = document.createElement('a');
  a.href = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData.replace(/></g, '>\n\r<'));
  a.download = 'myAwesomeSVG.svg';
  a.innerHTML = 'download the svg file';
  document.body.appendChild(a);

};

var parseStyles = function(svg) {
  var styleSheets = [];
  var i;
  // get the stylesheets of the document (ownerDocument in case svg is in <iframe> or <object>)
  var docStyles = svg.ownerDocument.styleSheets;

  // transform the live StyleSheetList to an array to avoid endless loop
  for (i = 0; i < docStyles.length; i++) {
    styleSheets.push(docStyles[i]);
  }

  if (!styleSheets.length) {
    return;
  }

  var defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  if (!defs.parentNode) {
    svg.insertBefore(defs, svg.firstElementChild);
  }
  svg.matches = svg.matches || svg.webkitMatchesSelector || svg.mozMatchesSelector || svg.msMatchesSelector || svg.oMatchesSelector;


  // iterate through all document's stylesheets
  for (i = 0; i < styleSheets.length; i++) {
    var currentStyle = styleSheets[i]

    var rules;
    try {
      rules = currentStyle.cssRules;
    } catch (e) {
      continue;
    }
    // create a new style element
    var style = document.createElement('style');
    // some stylesheets can't be accessed and will throw a security error
    var l = rules && rules.length;
    // iterate through each cssRules of this stylesheet
    for (var j = 0; j < l; j++) {
      // get the selector of this cssRules
      var selector = rules[j].selectorText;
      // probably an external stylesheet we can't access
      if (!selector) {
        continue;
      }

      // is it our svg node or one of its children ?
      if ((svg.matches && svg.matches(selector)) || svg.querySelector(selector)) {

        var cssText = rules[j].cssText;
        // append it to our <style> node
        style.innerHTML += cssText + '\n';
      }
    }
    // if we got some rules
    if (style.innerHTML) {
      // append the style node to the clone's defs
      defs.appendChild(style);
    }
  }

};

// exportSVG(document.getElementById('mySVG'));