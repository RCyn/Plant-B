var sessionProps = null;
var mySession = null;

// ---------------------------------------------------------------------
// connection inputs
//

var MsgCounter = 0 ;

// define callbacks
var sessionEventCb = function(session, event) 
{
   //consoleLog("Session event received");
   consoleLog(event.toString());
}
var messageEventCb = function(session, message) 
{
   MsgCounter += 1;
   document.getElementById("msgCounter").value = MsgCounter ;
   //consoleLog("Message received");
   //s = "Message: " + MsgCounter + '\n' ;
   //s += message.dump();
   //s = "Topic   : " + message.getDestination() + "\n" ;
   //s += "SenderId: " + message.getSenderId() + '\n' ;
   s = message.getBinaryAttachment() ;
   messageLog(s) ;
}

function parseCSV(str) {
    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c + 1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}

var myArr = []
myArr = parseCSV(s);
document.write ("myArr = " + myArr[0,0]) ;

// utility functions
// pad zero if < 10
function padZero(d) 
{
    if (d < 10) { d = "0" + d }
    return d;
}

// get timestamp now
function getTimeStamp() 
{
    var t = new Date()
    var str = padZero(t.getMonth()+1) + "/" + padZero(t.getDate()) + "/" + t.getFullYear() + " " + padZero(t.getHours()) + ":" + padZero(t.getMinutes()) + ":" + padZero(t.getSeconds());
    return str ;
}


function consoleLog(s) 
{
    var s1 = "[" + getTimeStamp() + "] " ;
    s1 += s + "\n";
    document.console_area.outtext.value += s1 ;
}

function ClearConsole() 
{
    var s1 = "[" + getTimeStamp() + "] " ;
    s1 += "console cleared" + "\n";
    document.console_area.outtext.value = s1 ;
}

function ClearMessages()
{
    var s1 = "[" + getTimeStamp() + "] " ;
    s1 += "Messages cleared" + "\n";
    document.message_area.outtext.value = s1 ;
}

function messageLog(s) 
{
    var s1 = "[" + getTimeStamp() + "] " ;
    s1 += s + "\n";
    document.message_area.outtext.value += s1 ;
}

// ------------------------------------------------------------------------
// create solace session and connect
// 
function CreateSession() 
{

    try {
    consoleLog ("Creating Session starting");

    sessionProps = new solace.SessionProperties();
    sessionProps.connectTimeoutInMsecs = 25000;
    sessionProps.transportDowngradeTimeoutInMsecs = 5000;
    sessionProps.readTimeoutInMsecs = 30000;;
    sessionProps.keepAliveIntervalsLimit = 10;

    sessionProps.url = document.getElementById("url").value ;
    consoleLog ("URL " + sessionProps.url);

    sessionProps.vpnName = document.getElementById("vpnname").value ;
        consoleLog ("VPN " + sessionProps.vpnName);

    sessionProps.userName = document.getElementById("username").value ;
        consoleLog ("USER " + sessionProps.userName);

    sessionProps.password = document.getElementById("password").value ;
        consoleLog ("PASS " + sessionProps.password);

    sessionProps.reapplySubscriptions = false ;
    sessionProps.keepAliveIntervalInMsecs = 3000;

    var o = " URL: "+sessionProps.url ;
    o += " User: "+sessionProps.userName ;
    o += " VPN: "+sessionProps.vpnName ;
    consoleLog ("Creating Session to " + o);

    mySession = solace.SolclientFactory.createSession(sessionProps,
	    new solace.MessageRxCBInfo(function(session, message) {
		    messageEventCb(session, message);
	    }, this),
	    new solace.SessionEventCBInfo(function(session, event) {
		sessionEventCb(session, event);
	    }, this)); 

       consoleLog ("Connecting to session") ;
       mySession.connect();
       consoleLog("done") ;

       // UI updates
       document.getElementById("connectBtn").disabled = true;
       document.getElementById("subscribeBtn").disabled = false;
       document.getElementById("closeBtn").disabled = false;
    } 
    catch (error) {
       consoleLog("Session creation/connect failed");
       consoleLog(error.toString());
    }
     
}

// ------------------------------------------------------------------------
// connect to solace session
// unused now
//
function ConnectSession() 
{
        try {
            if (connectedOnce) {
                mySession.connect();
            }
            else {
                mySession.connect();
                connectedOnce = true;
            }
        } catch (error) {
            consoleLog("Failed to connect session");
            consoleLog(error.toString());
        }
}

// ------------------------------------------------------------------------
// subscribe to topic 
//
function SubscribeMsg() 
{
	var topicStr = document.getElementById("topicname").value ;
	var timeoutSec = parseInt(document.getElementById("timeout").value) ;
	consoleLog("Subscribeing to: " + topicStr);
	// UI update
        document.getElementById("subscribeBtn").disabled = true;
        document.getElementById("resetMsgCounter").disabled = false;

	try {
	   mySession.subscribe(solace.SolclientFactory.createTopic(topicStr),
                true, // confirmation on subscription 
                topicStr, // correlation-key
                timeoutSec // timeout in seconds
            );
	} catch (error) {
	   // failed to subsribe,
	   consoleLog("Failed to subscribe to topic: " + topicStr.toString() + "'");
	   consoleLog(error.toString() + error.Message);
	}
}

function ResetMsgCounter () {
        consoleLog("Reset Message Counter");
        MsgCounter = 0;
        document.getElementById("msgCounter").value = MsgCounter ;
    };

// ------------------------------------------------------------------------
// Close session
//
function CloseSession() {
        consoleLog("Closing session");
        if (mySession !== null) {
            try {
                mySession.dispose();
		mySession = null;
		// UI updates
                document.getElementById("connectBtn").disabled = false ;
                document.getElementById("subscribeBtn").disabled = true;
                document.getElementById("closeBtn").disabled = true ;
            } catch (error) {
                consoleLog("Failed to close session");
                consoleLog(error.toString());
            }
        }
    };


   

 
