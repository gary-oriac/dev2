//global variables
var request="";
var response="";
var xmlString="";

// remove input parameter
$('form').on('click', '.removeInVar', function(){
    $(this).closest('tr').remove();
	$("#inTr"+ i).closest('tr').remove();
    $('.countInVar').each(function(i){
      $(this).text(i + 1);
    });
});

//add a new input node
$('#addInVar').on('click', function() {addInVar();});

// add input parameter
function addInVar() {
    var varInCount = $('#myTable tr').length - 1;
    $node = ['<tr id="inTr' + varInCount + '"">',
    '<td class="countInVar">'+varInCount + '</td>',
	'<td><select id="varInPrefix' + varInCount + '" class="form-control varInPrefix">',
	'		<option value="&">&</option>',
	'		<option value="?">?</option>',
	'		<option value="">None</option>',
	'</select></td>',
    '<td class="varInLabelTd"><input class="form-control varInLabel" type="text" id="varInLabel'+varInCount+'" /></td>',
	'<td class="varInValueTd"><input class="form-control varInValue" type="text" id="varInValue'+varInCount+'" />',
    '<td><button class="btn btn-danger removeInVar"  type="button">',
	'	<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>',
	'</button></td>',
    '</td></tr>'].join('\n');
    $('#myTable > tbody:last').append($node);
	//$("#varInValue" + varInCount ).val("varInValue" + varInCount);
};

// remove output parameter
$('form').on('click', '.removeOutVar', function(){
    $(this).closest('tr').remove();
    $('.countOutVar').each(function(i){
      $(this).text(i + 1);
    });
});

//add a new output node
$('#addOutVar').on('click', function() {addOutVar();});

// add output parameter
function addOutVar() {
    var varOutCount = $('#myTable2 tr').length - 1;
    $node = ['<tr id="outTr' + varOutCount + '"">',
    '<td class="countOutVar">'+ varOutCount + '</td>',
	'<td class="varOutPathTd"><input class="form-control varOutPath" type="text" id="varOutPath'+varOutCount+'" />',
    '<td class="varOutLabelTd"><input class="form-control varOutLabel" type="text" id="varOutLabel'+varOutCount+'" /></td>',
	'<td class="varOutValueTd"><input class="form-control varOutValue" type="text" id="varOutValue'+varOutCount+'" />',
    '<td><button class="btn btn-danger removeOutVar"  type="button">',
	'	<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>',
	'</button></td>',
    '</td></tr>'].join('\n');
    $('#myTable2 > tbody:last').append($node);
	//$("#varOutValue" + varOutCount).val("varOutValue" + varOutCount);
};	
	
// clear down any old responses
	function clearAllResponses() {
		var txt;
		var r = confirm("Are you sure you want to clear ALL responses?");
		if (r == true) {
			var numOutVars = $('#myTable2 tr').length-2;
			for (i=1;i<=numOutVars;i++) {
				rowNum = i;
				$("#varOutValue" + rowNum).val("");
			}
			
			$("#showXML").text("<No response found>");
			$("#showXMLButton").hide();
			$("#clearResponse").hide();
			
			var numOutVars = $('#myTable2 tr').length-1;
			for (i=1;i<=numOutVars;i++) {
				$("#varOutValue" + i).val("");
			}
		} 
	}
	
	// clear down any old responses
	function clearAllData() {
		var r = confirm("Are you sure you want to clear ALL data?");
		if (r == true) {
			$("#request").val("");
			
			var numInVars = $('#myTable tr').length-2;
			var rowNum = "";
			for (i=1;i<=numInVars;i++) {
				rowNum = i;
				$("#varInPrefix" + rowNum).val("");
				$("#varInLabel" + rowNum).val("");
				$("#varInValue" + rowNum).val("");
			}

			var numOutVars = $('#myTable2 tr').length-2;
			for (i=1;i<=numOutVars;i++) {
				rowNum = i;
				$("#varOutPath" + rowNum).val("");
				$("#varOutLabel" + rowNum).val("");
				$("#varOutValue" + rowNum).val("");
			}
			
			$("#demoModeOff").hide();
			$("#demoModeOn").show();
			
			$("#clearResponse").hide();
			$("#showXML").text("<No response found>");
			$("#showXMLButton").hide();
		} 	
	}	
					
	
	// provide user with some test data
	$("#demoModeOn").click(function(){
		$("#request").val("https://maps.googleapis.com/maps/api/geocode/xml");
		
	
		// add test intput parameters
		if ($('#myTable tr').length <= 2) {
			addInVar();
		}
		
		$("#varInPrefix1").val("?");
		$("#varInLabel1").val("address");
		$("#varInValue1").val("the gherkin, london");
		
		if ($('#myTable tr').length <= 3) {
			addInVar();
		}
		
		$("#varInPrefix2").val("&");
		$("#varInLabel2").val("key");
		$("#varInValue2").val("AIzaSyCxf753CwTn6J636TJJxEzKfTjN_T9NjqE");
		
		// add test output parameters
		if ($('#myTable2 tr').length <= 2) {
			addOutVar();	
		}	
		
		$("#varOutLabel1").val("Full Address");
		$("#varOutPath1").val("//formatted_address");	
		
		if ($('#myTable2 tr').length <= 3) {
			addOutVar();		
		}	
		
		$("#varOutLabel2").val("Latitude");
		$("#varOutPath2").val("//location/lat");		

		if ($('#myTable2 tr').length <= 4) {
			addOutVar();		
		}
		
		$("#varOutLabel3").val("Longitude");
		$("#varOutPath3").val("//location/lng");			
	
		$("#demoModeOn").hide();
		$("#demoModeOff").show();
		
		$("#demoModeOn").hide();
		$("#demoModeOff").show();
		
	});
	

	// invoke call to API
	$("#submitButton").click(function(){
		// initialise
		$("#showResults").html("");
		$("#showXML").text("<No response found>"); 
		$("#showXMLButton").hide();
		//$("#modalXML").show();	
		$("#showXMLButton").show();	

		var numInVars = $('#myTable tr').length-2;
		request=$("#request").val();
	
		for (var i = 1; i <= numInVars; i++) {
            request = request + $("#varInPrefix"+ i + " option:selected" ).text() + $("#varInLabel"+i).val() + "=" + $("#varInValue"+i).val();
        }
		
		var x=loadXMLDoc(request);
		var xml=x.responseXML;
		var nodes="";
		var result="";
		var numOutVars = $('#myTable2 tr').length-2;
		var nodeNum = "";
		
		xmlString=xmlToString(xml);
		
		$("#showXML").text(xmlString);
		$("#clearResponse").show();				
							
		// code for IE
		if (window.ActiveXObject || xhttp.responseType=="msxml-document") {	
			xml.setProperty("SelectionLanguage","XPath");
	
			for (var i = 1; i <= numOutVars; i++) {
				nodeNum = i;
				nodes=xml.selectNodes($("#varOutPath" + nodeNum).val()); 
				for (j=0;j<nodes.length; j++) {
					$("#varOutValue" + nodeNum).val(nodes[j].childNodes[0].nodeValue);
				}
			}
		}
		
		// code for Chrome, Firefox, Opera, etc.
		else if (document.implementation && document.implementation.createDocument)	{	
			for (var i = 1; i <= numOutVars; i++) {
				nodeNum = i;
				alert($("#varOutPath" + nodeNum).val());
				nodes=xml.evaluate($("#varOutPath" + nodeNum).val(), xml, null, XPathResult.ANY_TYPE, null);
				result=nodes.iterateNext();
				
				while (result) {
					alert($("#varOutValue" + nodeNum).val(result.childNodes[0].nodeValue));
					$("#varOutValue" + nodeNum).val(result.childNodes[0].nodeValue);
					result=nodes.iterateNext();
				}
		  	}		 	
		}                      
	});
	
	$("#previewRequestButton").click(function(){
		var showRequest=$("#request").val();
		var numInVars = $('#myTable tr').length-2;
		if ($("#request").val() == "") {
			$("#previewRequestText").text("<no request found>");
		}
		else {
			for (var i = 1; i <= numInVars; i++) {
				showRequest = showRequest + $("#varInPrefix"+ i + " option:selected" ).text() + $("#varInLabel"+i).val() + "=" + $("#varInValue"+i).val();
			}
			$("#previewRequestText").text(showRequest);
		}
	});

	function loadXMLDoc(dname)
	{
	if (window.XMLHttpRequest) {
	  	xhttp=new XMLHttpRequest();
	  	}
	else {
	  	xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET",dname,false);
	try {xhttp.responseType="msxml-document"} catch(err) {} // Helping IE
	xhttp.send("");
	return xhttp;
	}
	
	function xmlToString(xml_node)
    {
		
        if (xml_node.xml)
            return xml_node.xml;
        else if (XMLSerializer)
        {
            var xml_serializer = new XMLSerializer();
            return xml_serializer.serializeToString(xml_node);
        }
        else
        {
            alert("ERROR: Extremely old browser");
            return "";
        }
    }