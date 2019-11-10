/*
	Console and Scripting stuff
*/

//Takes input from console and stores it as the last command, then runs it
function runConsoleCommand(){
	var code = $("#consoleInput").val();
	lastConsoleCommand = code;
	runScript(code);
	clearConsoleInput();
}

//Takes code as a string and adds it to the page with script tags causing it to run
function runScript(code){
	console.log("running code");
	code = ""+
		`<script>
			try{
				${code}
			}catch(exception){
				console.error(exception.message);
			}
		<\/script>;`;
	$("#consoleScript").html(code);

}

function overrideConsoleMethods(){
	//Override console.log
	console.stdlog = console.log.bind(console);
	console.logs = [];
	console.log = function(){
    console.logs.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
    $("#consoleText").html($("#consoleText").html() + console.logs[console.logs.length-1] + "<hr/>");
    scrollToBottom("consoleText");
	}


	//Override console.error
	var oldCallBack = console["error"];
	console["error"] = function(){
		var args;
    console.logs.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
    $("#consoleText").html($("#consoleText").html() + '<span class="console-error">' + console.logs[console.logs.length-1] + "</span><hr/>");
    args = Array.prototype.slice.call(arguments, 0);
    Function.prototype.apply.call(oldCallBack, console, arguments);
    scrollToBottom("consoleText");
	}
}

function clearConsoleInput(){
	$("#consoleInput").val("");
}

function clearConsoleLog(){
	$("#consoleText").html("");
}

function retrieveLastCommand(){
	$("#consoleInput").val(lastConsoleCommand);
}