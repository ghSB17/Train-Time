$(document).ready(function(){
var config = {
    apiKey: "AIzaSyBwqu0D7fYMPZllwrPmKX5T8GLZlQOXSiU",
    authDomain: "train-timetable-79c2d.firebaseapp.com",
    databaseURL: "https://train-timetable-79c2d.firebaseio.com",
    projectId: "train-timetable-79c2d",
    storageBucket: "train-timetable-79c2d.appspot.com",
    messagingSenderId: "534159626930"
};
firebase.initializeApp(config);

var trainDB=firebase.database();
var trainTimeTable=trainDB.ref("TrainTime");

var trainName='';
var trainDestination='';
var trainFirstTime='';
var trainFrequency='';

var x=setInterval( updateTable, 60000);

function updateTable(){
    console.log("UpdateTable");
    $('tbody').empty();
    trainTimeTable.once('value').then( function(snapShot) {
        
        var trainDetails=snapShot.val();
        var trainKeys=Object.keys(trainDetails);
        console.log(trainKeys);

        for(var i=0;i<trainKeys.length;i++){
            console.log(snapShot.val()[trainKeys[i]].TrainName);
            console.log(snapShot.val()[trainKeys[i]].TrainDestination);
            console.log(snapShot.val()[trainKeys[i]].TrainFrequency);
            console.log(snapShot.val()[trainKeys[i]].TrainFirstTime);
            var html= '<tr><td>'+snapShot.val()[trainKeys[i]].TrainName+
                    '</td><td>'+snapShot.val()[trainKeys[i]].TrainDestination+
                    '</td><td>'+snapShot.val()[trainKeys[i]].TrainFrequency+
                    '</td><td>';

            html+=nextArrival(snapShot.val()[trainKeys[i]].TrainFirstTime,snapShot.val()[trainKeys[i]].TrainFrequency);
            html+='</td></tr>';
            console.log(html);
            $('tbody').append(html);
        }
        console.log('done, snapshot');
    }).then( function(error){
        console.log("ERROR");
        console.log(error);
    });
    console.log("done");
}

function nextArrival(firstTime, frequency){
    var trainFT = moment(new Date());
    var timeNow = moment(new Date());
    
    var pos=firstTime.indexOf(':');
    var firstTimeHrs=parseInt(firstTime.slice(0,pos));
    var firstTimeMins=parseInt(firstTime.slice(pos+1,firstTime.length));
    // console.log(pos);
    // console.log(firstTime);
    // console.log(firstTimeHrs);
    // console.log(firstTimeMins);
    trainFT.set('hour',firstTimeHrs);
    trainFT.set('minute',firstTimeMins);
    // console.log("frequency:"+frequency);
    // console.log("timenow:"+timeNow.format('hh:mmA'));
    // console.log("trainFT:"+trainFT.format('hh:mm A'));
    do{
        trainFT.add(parseInt(frequency),'m');
        console.log("trainFT:"+trainFT.format('hh:mm A'));
        console.log("T?F:"+timeNow.isBefore(trainFT));
    }while( timeNow.isAfter(trainFT));
    // console.log("trainFT:"+trainFT.format('hh:mm A'));
    var returnStr=trainFT.format('hh:mm A')+'</td><td>';
    returnStr+=trainFT.diff(timeNow,'minutes');
    return returnStr;
};


$('#idSubmit').on('click', function(){
    event.preventDefault();
    trainName=$('#trainName').val();
    trainDestination=$('#trainDestination').val();
    trainFirstTime=$('#trainFirstTime').val();
    trainFrequency=$('#trainFrequency').val();

    if( trainName && trainDestination && trainFirstTime && trainFrequency ) {

        trainTimeTable.push({
            TrainName:trainName,
            TrainDestination:trainDestination,
            TrainFirstTime:trainFirstTime,
            TrainFrequency:trainFrequency,
        });
        $('#trainName').val('');
        $('#trainDestination').val('');
        $('#trainFirstTime').val('');
        $('#trainFrequency').val('');

    } else {
        console.log("Missing Values");
    }

})


trainTimeTable.on("child_added", function(childSnapshot) {
    var html= '<tr><td>'+childSnapshot.val().TrainName+
                '</td><td>'+childSnapshot.val().TrainDestination+
                '</td><td>'+childSnapshot.val().TrainFrequency+
                '</td><td>';

    html+=nextArrival(childSnapshot.val().TrainFirstTime,childSnapshot.val().TrainFrequency);
    html+='</td></tr>';
    $('tbody').append(html);
 
});

});