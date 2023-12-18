// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
// Link to bootstrap at top of index.html. L:nk to dayjs, jQuesy at bottom.
$(function () {
  // DONE: Added a listener for click events on the save button. 
  // DONE: Added code to apply the past, present, or future class to each row. 
  // DONE: Added code to get any user input that was saved in localStorage 
  // TODO: Added code to display the current date in the header of the page.
  // DONE: Added code to display saved-to-local-storage msg.
  init();  // I feel this style, of not having code inside the single executable jQuery method is more readable. 
});

// This is the sole method that is called when the code begins. It sets up the 
function init() {
  myLog("Starting initialization");
  setDate();                        // Add current date in page header. 
  deleteChildrenById("#hoursDiv");  // remove all pre-built children rows
  // add a row for each hour, plus a saved-success area at the top
  add9to5HoursById("#hoursDiv");    // each row gets a save-btn with the same event-listener.
}


// ----------------------------------------------------------------------------------------------
// Add current date in page header using dayjs. Technically we could create a timer to reload this 
// value every second (so that the time changes right at midnight), but this seems far beyond the scope
// of this assignment. 
function setDate() {
  myLog("Starting setDate");    
  var currentDay = dayjs().format('MMMM DD');  // dayjs linked at bottom of HTML page, removed year per demo
  // var isoWeek = require('dayjs/plugin/isoWeek');
  // dayjs.extend(isoWeek);  // dayjs().isoWeekday() name of day of week, .day returns a number.
  // currentDay = dayjs().isoWeekday() + ", " + currentDay;  // isoWeekday() not a function, even with html script load. 
  // This is total bunk.  I will just write a method to convert number (0-5) to name of day of week (Sunday)
  currentDay = numToDOW(dayjs().day()) + ", " + currentDay;
  myLog("Today is " + currentDay);
  // var CD = document.getElementById("currentDay"); // old way
  // CD.textContent = "Hola";
  var currentDayEl = $("#currentDay");
  currentDayEl.text(currentDay);
  myLog("SetDate To JQuery " + currentDayEl.text());
}  // end setDate

// ----------------------------------------------------------------------
// accepts an input 0-6 (dayjs().day() method) and returns texts "Suncay", "Monday", etc. 
// MJS 12.18.23
function numToDOW(dayNum) {
  if (dayNum === 0 ) {
    return "Sunday";
  } else if (dayNum === 1) {
    return "Monday";
  } else if (dayNum === 2) {
    return "Tuesday";
  } else if (dayNum === 3) {
    return "Wednesday";
  } else if (dayNum === 4) {
    return "Thursday";
  } else if (dayNum === 5) {
    return "Friday";
  } else if (dayNum === 6) {
    return "Saturday";
  } else {
    myLog("Unknown Day in numToDOW (expecting 0-6): " + dayNum);
    return ("Unknown Day " + dayNum);
  }
} // end numToDOW

// ------------------------------------------------------------------------------------
// Delete all children of an id - the id must include the # at beginning of the idStr
function deleteChildrenById(idStr) {
  myLog("Starting deleteChildrenByID for " + idStr);
  var El = $(idStr);
  var kids = El.children();  //  .find gets multiple levels
  var kidLength = kids.length;
  myLog("Found kids " + kidLength);
  for (var i=0; i<kids.length; i++) {
    var kid = kids[i];
    // var grandkids = kid.children(); // this wont work - arghhh!, maybe due to way var created.
    // var gk = $(idStr).children()[i].children()[0];
    myLog("Deleting Hour " + i);  // 
    // myLog("Deleting Hour " + i + grandkids[0].text());  // text such as 9AM
  }
  El.empty();  // simpliest and prevents memory leaks!!
}

// -----------------------------------------------------------------------------------------------
/* Add 9 to 5 hours children of an id - the id must include the # at beginning of the idStr */
// Also add space for saved data msg, with welcome msg.
// <div id="hour-9" class="row time-block past">
//       <div class="col-2 col-md-1 hour text-center py-3">9AM</div>
//       <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
//        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
//          <i class="fas fa-save" aria-hidden="true"></i>
//        </button>
//      </div>/
function add9to5HoursById(idStr) {
  myLog("Starting add9to5HoursByID for " + idStr);
  var El = $(idStr);
  var kids = El.children();         //  .find gets multiple levels
  myLog("Found kids " + kids.length);
  var nowMT = dayjs().format('H');  // cap H is military 1 digit, HH is 2 digit always
  
  // create a div for msgs when value saved to local storage.
  var msgDiv = $("<div>");
  El.append(msgDiv);
  msgDiv.attr("class", "pt-3 pb-1");  // flex w-50 moves all to the left, bg-info add blue, but slight l-r margins
  var pEl = $("<p>");
  msgDiv.append(pEl);
  pEl.attr("class", "text-center");
  pEl.attr("id", "pSavedArea");
  pEl.text("Welcome to Mike Sheliga's work day app. Enter text and hit save to store your events.");
  
  // Add rows for each hour with text from localStorage
  for (var hourMT=9; hourMT<=17; hourMT++) {   // 9 to 5, MT = military time
    var hour = hourMT;
    var hourStr = hourMT + "AM";
    if (hourMT > 12) {  
      hour = hourMT - 12;  // convert MT 1400 to 2PM
    }
    if (hourMT >= 12) {
      hourStr = hour + "PM";
    }
    var whenStr = "present";  
    if (hourMT < nowMT) {
      whenStr = "past";
    } else if (hourMT > nowMT) {
      whenStr = "future";
    }
    myLog("Adding Hour " + hour + " Now in Military Time " + nowMT);
    var newDiv = $("<div>");   // could hardwire much of this, but use methods to better learn jQuery.
    newDiv.attr("id", "hour-" + hourMT);  // stick with examples id format of "hour-N"
    newDiv.attr("militaryTime", "" + hourMT);
    newDiv.attr("class", "row time-block " + whenStr);  /// not space after block
    El.append(newDiv);
    var innerDiv = $("<div>");
    innerDiv.attr("class", "col-2 col-md-1 hour text-center py-3");
    innerDiv.text("" + hourStr);
    newDiv.append(innerDiv);
    var innerTextArea = $("<textarea>");
    innerTextArea.attr("class", "col-8 col-md-10 description")
    innerTextArea.attr("rows", "3");
    var innerText = localStorage.getItem("hour-" + hourMT);
    if (innerText !== null) {
      myLog("Inner text localStorage for hour " + hourMT + " Value: " + innerText);
      innerTextArea.val(innerText);
    }
    newDiv.append(innerTextArea);
    var innerBtn = $("<button>");      // <button class="btn saveBtn col-2 col-md-1" aria-label="save">
    innerBtn.attr("class", "btn saveBtn col-2 col-md-1");
    innerBtn.attr("aria-label", "save");
    innerBtn.click(onBtnClick);
    newDiv.append(innerBtn);
    // italic or emphasized or Icon
    innerBtn.append($('<i class="fas fa-save" aria-hidden="true"></i>'));   // the full html way reduces lines of code
  }
} 

// -------------------------- Helper Methods -------------------------
// helper method to easily turn on-off all logs or save to a file. 
function myLog(str) {
  console.log(str);
}

// ---------------------- Event Listener Methods --------------------------------------
// onBtn Click, save value for associated hour to localStorage
// MJS 12.18 - Could only get this to respond exactly once for all buttons for the longest time. 
// I have no idea why it works now, but didn't work before. Arghhhhhhhhhhhhhhhh.
function onBtnClick(ev) {
  ev.preventDefault();
  myLog("Button clicked!");
  // var target = ev.target();  // button -> ev.target is not a function.
  // var parent = ev.EventTarget().parent();  /// DOM object, but likely not jQuery, eventTarget not a function.
  var parent = $(this.parentNode);  // also seen $(event.target).children();
  var myClass = parent.attr("class");
  var myID = parent.attr("id");  // something like hour-9
  var militaryTime = parent.attr("militaryTime");
  myLog("Targets Parents class is " + myClass + " ID is: " + myID + " MT: " + militaryTime);  // very helpful for debugging!
  var kids = parent.children();   // sibling class also likely exists, .contents will also get text nodes
  var AMPMDiv = kids.get(0);
  var myText = kids.get(1);  // dont use array, use get for jQuery object
  // myLog("myText is " + myText.val());  // val() not a function, even if let myText
  myLog("myText is : " + myText.value + " saving to localStorage key " + myID);
  localStorage.setItem(myID, myText.value);
  $("#pSavedArea").text('Saved Event "' + myText.value + '" at ' + AMPMDiv.innerText + ' to Local Storage');
}