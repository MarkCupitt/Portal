var EventEmitter = require('events').EventEmitter;
var proj4js = require('proj4');
var projections = require('../projections.js');

var KmlConverter = function(xmlParser, srcProj, dstProj) {
  this.readable = true;

  var events = new EventEmitter();

  var
    properties = {},
    geometryType = null,
    coordinates = [];

  var
    styleClasses = {},
    currentStyleClassId;
  
  var stack = [];

  xmlParser.on('tagopen', function(e) {
    stack.push(e.nodeName);

    var parentName = stack[stack.length-2];

    if (e.nodeName === 'Style') {
      currentStyleClassId = e.attributes.id;
      styleClasses[currentStyleClassId] = {};
    }

    if (parentName === 'Style') {
      styleClasses[currentStyleClassId][e.nodeName] = {};
    }
    
/***
    
    
    
    
<Style id="style_nidmark">
  <BalloonStyle>
    <text><![CDATA[<table width="250"><tr><td>
  <b><font size="+2">$[name]</font></b><br/><br/>
  Base topogràfica de Catalunya 1:5.000<br/>
  <b>Institut Cartogràfic de Catalunya</b><br/>
  http://www.icc.cat      <br/>
  </td></tr></table>
  ]]></text>
  </BalloonStyle>
</Style>

    <Style id="style_hidmark">
        <BalloonStyle>
            <text><![CDATA[<table width="250"><tr><td>
<b><font size="+2">$[name]</font></b><br/><br/>
Base topogràfica de Catalunya 1:5.000<br/>
<b>Institut Cartogràfic de Catalunya</b><br/>
http://www.icc.cat      <br/>
</td></tr></table>
]]></text>
        </BalloonStyle>
    </Style>
    
    <StyleMap id="style_mark">
        <Pair>
            <key>normal</key>
            <styleUrl>#style_nidmark</styleUrl>
        </Pair>
        <Pair>
            <key>highlight</key>
            <styleUrl>#style_hidmark</styleUrl>
        </Pair>
    </StyleMap>
    
    <Style id="style_edi01">
        <LineStyle>
            <color>ffC8C8ff</color>
            <width>1.0</width>
        </LineStyle>
        <PolyStyle>
            <color>E0C8C8ff</color>
        </PolyStyle>
    </Style>
    
    <Style id="style_edi02">
        <LineStyle>
            <color>ffC8C8ff</color>
            <width>1.0</width>
        </LineStyle>
        <PolyStyle>
            <color>E0C8C8ff</color>
        </PolyStyle>
    </Style>

    <Style id="style_edi03">
        <LineStyle>
            <color>ffC8C8ff</color>
            <width>1.0</width>
        </LineStyle>
        <PolyStyle>
            <color>E0C8C8ff</color>
        </PolyStyle>
        <ListStyle>
            <ItemIcon>
                <href>icon004.png</href>
            </ItemIcon>
        </ListStyle>
    </Style>

    <Style id="style_cns01">
        <LineStyle>
            <color>ffC8C8ff</color>
            <width>1.0</width>
        </LineStyle>
        <PolyStyle>
            <color>E0C8C8ff</color>
        </PolyStyle>
    </Style>

    <Style id="style_cns03">
        <LineStyle>
            <color>ffC8C8ff</color>
            <width>1.0</width>
        </LineStyle>
        <PolyStyle>
            <color>E0C8C8ff</color>
        </PolyStyle>
    </Style>

    <Style id="style_dip01">
        <LineStyle>
            <color>ffC8C8ff</color>
            <width>1.0</width>
        </LineStyle>
        <PolyStyle>
            <color>E0C8C8ff</color>
        </PolyStyle>
    </Style>

    <Style id="style_tor01">
        <LineStyle>
            <color>ffC8C8ff</color>
            <width>1.0</width>
        </LineStyle>
        <PolyStyle>
            <color>E0C8C8ff</color>
        </PolyStyle>
    </Style>

    <Style id="style_pea01">
        <LineStyle>
            <color>ffC8C8ff</color>
            <width>1.0</width>
        </LineStyle>
        <PolyStyle>
            <color>E0C8C8ff</color>
        </PolyStyle>
    </Style>

    <Style id="style_hiv01">
        <LineStyle>
            <color>ffC8C8ff</color>
            <width>1.0</width>
        </LineStyle>
        <PolyStyle>
            <color>E0C8C8ff</color>
        </PolyStyle>
    </Style>
    
    ***/
    
    
    
    
    
    
    
    if (e.nodeName === 'wfs:member') {
      if (geometryType && coordinates.length) {
        events.emit('feature', { properties:properties, geometryType:geometryType, coordinates:coordinates });
        properties = {};
        geometryType = null;
        coordinates = [];
      }
    }

    if (parentName === 'gml:geometryMember') {
      geometryType = e.nodeName.split(':')[1];
    }
  }.bind(this));

  xmlParser.on('tagclose', function() {
    stack.pop();
  }.bind(this));

  xmlParser.on('text', function(e) {
    if (e.nodeName === 'gml:pos') {
      var
        pair = e.nodeValue.split(' '),
        xy;
      xy = proj4js(projections[srcProj], projections[dstProj], [ parseFloat(pair[0]), parseFloat(pair[1]) ]);
      coordinates.push(xy);
    } else {
      properties[e.nodeName] = e.nodeValue;
    }
  }.bind(this));

  xmlParser.on('end', function(){
    events.emit('end');
  }.bind(this));

  return events;
};

exports.converter = KmlConverter;
