var parties = ["R", "D", "I"];
var repCheck = document.getElementById("rep");
var demCheck = document.getElementById("dem");
var indCheck = document.getElementById("ind");
var myValue = document.getElementById("state-selector");
var loading = true;
var url = "";
var headers = [];
var staty = {
    statistics: [
        {
            Number_Of_Democrats: "57",
            Number_Of_Republicans: "46",
            Number_Of_Independients: "2",
            Total_Of_members: "105",
            avg_demArray: "96.97",
            avg_repArray: "87.15",
            avg_indArray: "95.18",
            valuesTotal: "93.10"
        }
    ]
};

bigData();
function bigData() {
    if (window.location.pathname == "/senateAttendance.html" ||
        window.location.pathname == "/senatePartyLoyalty.html" )
     {
        getDataSenate();
    } else if (window.location.pathname == "/houseAttendance.html" ||
        window.location.pathname == "/housePartyLoyalty.html"  )
    {
        return getDataHouse();
    } else {
        return "This is a web default";
    }
}

function getDataSenate() {
    fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
            mode: "cors",
            headers: {
                "X-API-Key": "VDe0d3uby1cworaINiY9841EYSWiLRN80Jxsem8z"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            members = data.results[0].members;
            party = data.results[0].party;
            porcentage = data.results[0].votes_with_party_pct;
            state = data.results[0].state;
            yearsInOffice = data.results[0].seniority;
            titles = data.results[0].title;
            getNumber(data);
            getBottomAvg(data);
            getTopAvg(data);
            displayLoader();
            showpage();
            loading = false;

        })
        .catch(function (error) {
            console.log("Request failed", error);
        });
}


function getDataHouse() {
    fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
            mode: "cors",
            headers: {
                "X-API-Key": "VDe0d3uby1cworaINiY9841EYSWiLRN80Jxsem8z"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            members = data.results[0].members;
            party = data.results[0].party;
            porcentage = data.results[0].votes_with_party_pct;
            state = data.results[0].state;
            yearsInOffice = data.results[0].seniority;
            getNumber(data);
            getBottomAvg(data);
            getTopAvg(data);
            displayLoader();
            showpage();
            loading = false;
        })
        .catch(function (error) {
            console.log("Request failed", error);
        });
}


//Function 1 for Table 1
function getNumber(data) {
    let demArray = [];
    let repArray = [];
    let indArray = [];
    let total_dem = 0;
    let total_rep = 0;
    let total_ind = 0;
    let Total_Of_members = 0;
    let valuesTotal = 0;
    for (var i = 0; i < members.length; i++) {
        if (members[i].party === "D") {
            demArray.push(members[i]);
            console.log(demArray.push(members[i]));
            total_dem += members[i].votes_with_party_pct;
        }
        if (members[i].party === "R") {
            repArray.push(members[i]);
            total_rep += members[i].votes_with_party_pct;
        }
        if (members[i].party === "I") {
            indArray.push(members[i]);
            total_ind += members[i].votes_with_party_pct;
        }
    }

    var avgDem = total_dem / demArray.length;
    avg_demArray = avgDem.toFixed(2);
    var avgRep = total_rep / repArray.length;
    avg_repArray = avgRep.toFixed(2);
    var avgInd = total_ind / indArray.length;
    avg_indArray = avgInd.toFixed(2);
    var sum = demArray.length + repArray.length + indArray.length;
    if (total_ind === 0) {
        avgInd = 0;
    }
    Total_Of_members = sum.toFixed(0);
    var ttlAvg = (avgDem + avgRep + avgInd) / 3;
    valuesTotal = ttlAvg.toFixed(2);

    document.getElementById("rep-ttl").innerHTML = demArray.length;
    document.getElementById("rep-avg").innerHTML = avgDem.toFixed(2) + `%`;
    document.getElementById("dem-ttl").innerHTML = repArray.length;
    document.getElementById("dem-avg").innerHTML = avgRep.toFixed(2) + `%`;
    document.getElementById("ind-ttl").innerHTML = indArray.length;
    document.getElementById("ind-avg").innerHTML = avgInd.toFixed(2) + `%`;
    document.getElementById("total").innerHTML = sum.toFixed(0);
    document.getElementById("totalAveg").innerHTML = ttlAvg.toFixed(2) + `%`;
}

function getTable() {
    var table = document.getElementById("porcentage2");
    table.innerHTML = "";
    var tblBody = document.createElement("tbody");
    var header = table.createTHead();
    for (var i = 0; i < members.length; i++) {
        var row = header.insertRow(0);
        var cell = row.insertCell(0);
        tblBody.appendChild(row);
    }
    table.appendChild(tblBody);
}



//function 2 for table 2
function getBottomAvg(data) {
    var porcentage = data.results[0].votes_with_party_pct;
    var values = members.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });
    var tenPctArray = [];
    var minor = 0;
    for (var i = 0; i < values.length; i++) {
        if (i <= values.length * 0.1) {
            tenPctArray.push(values[i]);
            minor += values[i].votes_with_party_pct;
        } else if (
            tenPctArray[tenPctArray.length - 1].votes_with_party_pct ===
            values[i].votes_with_party_pct
        ) {
            tenPctArray.push(values[i]);
            minor += values[i].votes_with_party_pct;
        }
    }
    getTable2(tenPctArray);
}

function getTable2(members) {
    var tblBody = document.getElementById("bottomList");
    tblBody.innerHTML = "";
    for (var i = 0; i < members.length; i++) {
        var row = document.createElement("tr");
        var name = members[i].first_name + " " + (members[i].middle_name || "") + "&nbsp" + members[i].last_name;
        row.insertCell().innerHTML = '<a href = "' + members[i].url + '">' + name + "</a>";
        var total = members[i].total_votes;
        row.insertCell().innerHTML = total;
        var missed = members[i].missed_votes;
        missed1 = (missed / total) * 100;
        if (total === 0) {
            missed1 = 0;
        }
        row.insertCell().innerHTML = missed1.toFixed(2) + `%`;

        tblBody.appendChild(row);
    }
}

//Function 3 for table 3
function getTopAvg(data) {
    var porcentage = data.results[0].votes_with_party_pct;
    var values = members.sort(function (a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct;
    });
    var tenPct = [];
    var most = 0;
    for (var i = 0; i < values.length; i++) {
        if (i <= values.length * 0.1) {
            tenPct.push(values[i]);
            most += values[i].votes_with_party_pct;
        } else if (
            tenPct[tenPct.length - 1].votes_with_party_pct ===
            values[i].votes_with_party_pct
        ) {
            tenPct.push(values[i]);
            most += values[i].votes_with_party_pct;
        }
    }
    getTable3(tenPct);
}

function getTable3(members) {
    var tblBody = document.getElementById("topList");
    tblBody.innerHTML = "";
    for (var i = 0; i < members.length; i++) {
        var row = document.createElement("tr");
        var name =
            members[i].first_name + " " + (members[i].middle_name || "") + "&nbsp" + members[i].last_name;
        row.insertCell().innerHTML = '<a href = "' + members[i].url + '">' + name + "</a>";
        var total = members[i].total_votes;
        row.insertCell().innerHTML = total;
        var missed = members[i].missed_votes;
        missed1 = (missed / total) * 100;
        if (total === 0) {
            missed1 = 0;
        }
        row.insertCell().innerHTML = missed1.toFixed(2) + `%`;
        tblBody.appendChild(row);
    }
}


function displayLoader() {
    start = setTimeout(showpage, 2000);
}

//document.getElementById("hide").style.display = "none";
//document.getElementById("loading").style.display = "block";

function showpage() {
    document.getElementById("hide").style.display = "block";
    document.getElementById("loading").style.display = "none";
}

function loadMore() {
    var text = document.getElementById("more_text");
    var buttonMessage = document.getElementById("readmore");
    if (text.style.display === "block") {
        text.style.display = "none";
        buttonMessage.innerHTML = "Read more";
    } else {
        text.style.display = "block";
        buttonMessage.innerHTML = "Read less";
    }
}
