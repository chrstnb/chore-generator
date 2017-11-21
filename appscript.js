var people = [];
var choreList = [];
var shanti = [];
var kitchen = [];
var d;

function myFunction() {
  d = new Date();

  var ss = SpreadsheetApp.openById("SHEET_KEY");
  var chores = ss.getSheets()[0];
  var peopleList = ss.getSheets()[1];
  var rotation = ss.getSheets()[2];
  var rotate = updateRotation(rotation);
  var data = peopleList.getDataRange().getValues();
  var dataToImport = {};
  for(var i = 1; i < data.length; i++) {
    Logger.log(data[i][0]);
    if (data[i][0] == "Shanti Camper Singh") {
      shanti = data[i];
    } else {
      people[people.length] = data[i];
    }
  }
  var choreData = chores.getDataRange().getValues();
  for (var i = 1; i < choreData.length; i++) {
    var type = choreData[i][0];
    var duties = [];
    var cat = choreData[i][2]
    duties[0] = choreData[i][1];
    while (i != choreData.length - 1 && choreData[i+1][0] == "") {
      i++;
      duties[duties.length] = choreData[i][1];
    }
    if (type == "kitchen"){
      var kitchen = [type, duties, cat];
    }
    choreList[choreList.length] = [type, duties, cat];
  }
  rotateNames(rotate);
  setVals(chores);
}

function rotateNames(num) {
  var rotatedPeople = [];
  Logger.log(people);
  for (var i = num; i < people.length; i++) {
    rotatedPeople[rotatedPeople.length] = people[i];
  }
  for (var i = 0; i < num; i++) {
    rotatedPeople[rotatedPeople.length] = people[i];
  }
  people = rotatedPeople;
  Logger.log(people);
}
       
function updateRotation(sheet) {
  var num = parseInt(sheet.getDataRange().getValues());
  if (num == 6) {
    num = 1;
  } else {
    num = num + 1;
  }
  sheet.getRange('A1').setValue(num);
  return (num);
}

function setVals(sheet) {
  var data = sheet.getDataRange().getValues();
  var choreCounter = 0;
  for (var i = 1; i < data.length; i++) {
    var chore = data[i];
    sheet.getRange('D' + (i+1)).setValue("");
    if (chore[0] != "" && chore[0] != "END") {
      var candidate = people.pop();
      if (chore[2] == "upstairs") {
        while (chore[2] != candidate[1]) {
          var newCandidate = people.pop();
          people.push(candidate);
          candidate = newCandidate;
        }
      }
      sheet.getRange('D' + (i+1)).setValue(candidate);
      sendEmail(candidate, choreList[choreCounter]);
      choreCounter++;
    }
  }
}

function sendEmail(person, job) {
  var name = person[0].split(" ")[0];
  var email = person[2];
  var message = "Hey " + name + ",\n \n Your chore for the week is " + job[0];
  message = message + ". Your duties for this role include: \n";
  for (var i = 0; i < job[1].length; i++) {
    message += "\t" + job[1][i] + "\n";
  }
  
  message += "\nYou can view all responsibilities here: https://docs.google.com/a/uw.edu/spreadsheets/d/1EA_1P_HKDdVAWqHc-V9tf82vPonG8qr6r705QxF-sig/edit?usp=sharing";
  message += "\nLet's hold each other accountable!\n";
  
  message += "\nHave a great week & be sure to let everyone know if you won't be able to ";
  message += "finish a chore!\n \n";
  
  message += "<3,\n";
  message += "Christine";
  var date = d.getDate();
  var year = d.getYear();
  var month = parseInt(d.getMonth()) + 1;
  var subject = "Week of " + month + "/" + date + "/" + year + " chores";
  MailApp.sendEmail(email, subject, message);
}
