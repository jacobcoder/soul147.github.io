var lastTab;

function ge(e) {
	return document.getElementById(e) || document.createElement("div");
}

function gc(e, f) {
	l = document.getElementsByClassName(e);
	for(var i = 0; i < l.length; i++) {
		f(l[i], i); // pass the element and the position of the element in the array to function for each element
	}
}

function transformToDecimal(object) { // It's so much better than hevi's version, because it's recursive and I'm a lazy piece of shit
	for(i in object) {
		if(typeof(object[i]) == "string" && !isNaN(new Decimal("e" + object[i]).mag)) object[i] = new Decimal(object[i]); 
		if(typeof(object[i]) == "object") transformToDecimal(object[i]) // iterates over all objects inside the object
	}
}

saveData = {games: [], currentGame: 0}

function newGame() {
	game = {}
	
	updateSave();
}

function loadGame(n) {
	game = saveData.games[n];
	
	updateSave();
}

function updateSave() {
	transformToDecimal(game);
	
	if(!game.options) game.options = {
		notation: "Scientific",
		mixedCutoff: 1e33
	}
	
	if(!game.totalAntimatter) game.totalAntimatter = new Decimal(0);
	if(!game.dimensions) resetDimensions();
	if(!game.shifts) game.shifts = 0;
	if(!game.boosts) game.boosts = new Decimal(0);
	if(!game.galaxies) game.galaxies = new Decimal(0);
	if(!game.dimMult) game.dimMult = new Decimal(2);
	if(!game.dimCostMultIncrease) game.dimCostMultIncrease = 10;
	if(!game.tickCostMultDecrease) game.tickCostMultIncrease = 10;
	if(!game.infinities) game.infinities = new Decimal(0);
	if(!game.infinityPoints) game.infinityPoints = new Decimal(0);
	if(!game.infinityUpgrades) resetInfinityUpgrades();
	if(!game.infinityDimensions) resetInfinityDimensions(true);
	
	if(!game.autobuyers) {
		game.antimetal = new Decimal(0);
		resetAutobuyers();
	}
	
	if(!game.startTime) game.startTime = Date.now();
	if(!game.boostTime) game.boostTime = Date.now();
	if(!game.galaxyTime) game.galaxyTime = Date.now();
	if(!game.infinityTime) game.infinityTime = Date.now();
	if(!game.eternityTime) game.eternityTime = Date.now();
	
	if(!game.bestInfinityTime) game.bestInfinityTime = Infinity;
}

if(localStorage.ad2) {
	saveData = JSON.parse(atob(localStorage.ad2));
	
	loadGame(saveData.currentGame);
}

else newGame();

function save() {
	saveData.games[saveData.currentGame] = game;
	
	localStorage.ad2 = btoa(JSON.stringify(saveData));
}

function getTimeSince(event) {
	return Date.now() - game[event + "Time"];
}

function showTab(name) {
	gc("tab", function(e) {
		e.style.display = "none";
	})
	ge(name + "Tab").style.display = "";
	game.currentTab = name;
}

function showDimensionTab(name) {
	gc("dimensionTab", function(e) {
		e.style.display = "none";
	})
	ge(name + "DimensionTab").style.display = "";
	game.currentDimensionTab = name;
}

function showAutomationTab(name) {
	gc("automationTab", function(e) {
		e.style.display = "none";
	})
	ge(name + "AutomationTab").style.display = "";
	game.currentAutomationTab = name;
}

function showInfinityTab(name) {
	gc("infinityTab", function(e) {
		e.style.display = "none";
	})
	ge(name + "Tab").style.display = "";
	game.currentInfinityTab = name;
}

function displayIf(e, c) {
	ge(e).style.display = c ? "" : "none";
}

for(var i = 1; i < 10; i++) ge("dimensions").innerHTML += `
<tr id = "dimDisplay` + i + `" style = "text-align: right">
	<td style = "text-align: left; padding-bottom: 8px; width: 250">` + tierNames[i] + ` Dimension</td>
	<td style = "position: absolute; width: 100"><span id = "dimamount`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 400; text-align: left"><span id = "dimgrowth`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 600">x<span id = "dimmult`+i+`"></span></td>
	<td style = "position: absolute; right: 20"><button class = "buy" id = "dimbuy`+i+`" onclick = "buyDimension(`+i+`)"></button></td>
</tr>`

ge("dimensions").innerHTML += `
<tr id = "tickspeedDisplay" style = "text-align: right">
	<td style = "text-align: left; padding-bottom: 8px; width: 250">Tickspeed</td>
	<td style = "position: absolute; width: 100"><span id = "tickspeed"></span></td>
	<td style = "position: absolute; width: 200; left: 600"><span id = "galaxyEffect"></span></td>
	<td style = "position: absolute; right: 20"><button class = "buy" id = "buyTickspeed" onclick = "buyTickspeed()"></button></td>
</tr>`

for(var i = 1; i < 10; i++) ge("infinityDimensions").innerHTML += `
<tr id = "infdimDisplay` + i + `" style = "text-align: right">
	<td style = "text-align: left; padding-bottom: 8px; width: 250">` + tierNames[i] + ` Infinity Dimension</td>
	<td style = "position: absolute; width: 100"><span id = "infdimamount`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 400; text-align: left"><span id = "infdimgrowth`+i+`"></span></td>
	<td style = "position: absolute; width: 200; left: 600">x<span id = "infdimmult`+i+`"></span></td>
	<td style = "position: absolute; right: 20"><button class = "buy" id = "infdimbuy`+i+`" onclick = "buyInfinityDimension(`+i+`)"></button></td>
</tr>`

h = ""

var pattern = " xx  xx x  xx  xx  xx  x xx  xx "

for(var i = 0, j = 0; j < 32; i++, j++) {
	if(j % 8 == 0) h += "<tr>"
	if(pattern[j] == "x") h += `
		<td>
			<button id = "infinityUpgrade` + i + `" onclick = "buyInfinityUpgrade(` + i + `)">
				<span id = "infinityUpgradeDesc` + i + `"></span><br>
				Cost: <span id = "infinityUpgradeCost` + i + `"></span>
			</button>
		</td>
	`;
	else {
		h += "<td></td>"
		--i;
	}
	if(j % 8 == 7) h += "</tr>"
}

ge("infinityUpgrades").innerHTML = h;

h = ""

for(var i = 17; i < 29; i++) {
	if(i % 3 == 2) h += "<tr>"
	h += `
		<td>
			<button id = "infinityUpgrade` + i + `" onclick = "buyInfinityUpgrade(` + i + `)">
				<span id = "infinityUpgradeDesc` + i + `"></span><br>
				Cost: <span id = "infinityUpgradeCost` + i + `"></span>
			</button>
		</td>
	`
	if(i % 3 == 1) h += "</tr>"
}

ge("postInfinityUpgrades").innerHTML = h + `
<tr>
	<td><button id = "repeatInf0" onclick = "buyRepeatInf(0)"></button></td>
	<td><button id = "repeatInf1" onclick = "buyRepeatInf(1)"></button></td>
	<td><button id = "repeatInf2" onclick = "buyRepeatInf(2)"></button></td>
</tr>
`

function f() {
	gc("challenge", function(e, i) {
		var angle = Math.PI / 6 * i;
		
		var x = innerWidth / 2 - 40;
		var y = 450;
		var r = 250;
		
		x += r * Math.sin(angle);
		y -= r * Math.cos(angle);
		
		e.style.left = x;
		e.style.top = y;
	})
}

f()

window.onresize = f;