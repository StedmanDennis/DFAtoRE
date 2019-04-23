var $ = go.GraphObject.make;



/*
var myDiagram = $(go.Diagram, "myDiagramDiv");
var myModel = $(go.Model);
myModel.nodeDataArray = [
	{key:'Alpha'},
	{key:'Beta'},
	{key:'Gamma'}
];
myDiagram.model = myModel;    
*/
Vue.component('scrambleText',{
	props: ['targetText'],
	template: 	`
				<span v-on:click='restart'>
					<scrambleChar v-for='charObj in charactersInText' v-bind:key='charObj.index' v-bind:charObj='charObj' v-bind:charObjs='charactersInText'></scrambleChar>
				</span>
				`,
	computed: {
		charactersInText: function(){
			var characters = this.targetText.split('');
			var charObjects = [];
			characters.forEach((char, index)=>{
				charObject = {};
				Vue.set(charObject, 'index', index);
				Vue.set(charObject, 'char', char);
				Vue.set(charObject, 'animating', false);
				Vue.set(charObject, 'scrambleAlphabet', this.scrambleAlphabet);
				Vue.set(charObject, 'animateFor', this.animateFor);
				Vue.set(charObject, 'scrambleDelay', this.scrambleDelay);
				/*
				charObject.index = index;
				charObject.char = char;
				charObject.animating = false;
				charObject.scrambleAlphabet = this.scrambleAlphabet;
				charObject.animateFor = this.animateFor;
				charObject.scrambleDelay = this.scrambleDelay;
				*/
				charObjects.push(charObject);
				
			});
			/*
			var charObjects = characters.map((char, index) => {
				charObject = {};
				charObject.index = index;
				charObject.char = char;
				charObject.animating = false;
				charObject.scrambleAlphabet = this.scrambleAlphabet;
				charObject.animateFor = this.animateFor;
				charObject.scrambleDelay = this.scrambleDelay;
				return charObject;
			})*/
			return charObjects;
		}
	},
	mounted: function(){
		this.setAnimationStop();
	},
	data: function(){
		return{
			animateFor: 10, //time in ms for a char to be set
			scrambleDelay: 100, //time in ms for a char being scrambled to change to another char
			scrambleAlphabet: ['0','1','(',')','+','*'] //a collection of character that will be cycled through when scrambling
		}
	},
	methods: {
		restart: function(){
			this.charactersInText.forEach((obj, index)=>{
				obj.animating = true;
			});
			this.setAnimationStop();
		},
		setAnimationStop: function(){
			setTimeout(()=>{
				this.charactersInText[0].animating = false;
				console.log('stopping animation');
			},3000); //3 seconds before stopping first character
		}
	}
})

Vue.component('scrambleChar',{
	props: ['charObj','charObjs'],
	template: 	`
				<span v-if='charObj.animating' class='scrambledChar' style='font-family: monospace;'>{{scramblerChar}}</span>
				<span v-else class='defaultChar'>{{charObj.char}}</span>
				`,
	data: function(){
		return{
			looper: null,
			scramblerChar: null,
			objData: this.charObj
		}
	},
	computed: {
		triggerChar: function(){
			if(this.charObj.index == 0){
				return null;
			}else{
				return this.charObjs[this.charObj.index-1].animating;
			}
		}
	},
	watch: {	
		objData: function(newVal,oldVal){
			console.log('charObj')
			if(newVal.animating){
				console.log('started animating');
			}else{
				console.log(`Character ${charObj.index} stopped animating`);
				this.looper.clearInterval();
			}
		},
		triggerChar: function(newVal,oldVal){
			console.log('triggered');
			if(!newVal){
				setTimeout(()=>{
					this.charObj.animating = false;
				},this.charObj.animateFor);
			}
		}
	},
	methods: {
		generateRandomBetween: function(min, max){
			return Math.floor(Math.random() * (max - min + 1) ) + min;;
		},
		scrambler: function(){
			var randomNumber = this.generateRandomBetween(0,this.charObj.scrambleAlphabet.length-1);
			this.scramblerChar = this.charObj.scrambleAlphabet[randomNumber];
		},
		startAnimation: function(){
			//console.log('starting');
			//console.log(this.charObj.animating);
			//this.animating = true;
			//console.log('changing animating')
			//this.charObj.animating = this.animating;
			//Vue.set(this.charObj, 'animating', true);
			this.charObj.animating = true;
			if (this.charObj.animating){
				console.log('setting interval')
				this.looper = setInterval(this.scrambler, this.charObj.scrambleDelay);
			}
			//console.log(this.charObj.animating);
		}
	},
	mounted: function(){
		this.startAnimation();
	}
})

Vue.component('controlPanel',{
	template: 	`
					<div class='controlPanel'>
						<div class='panelHead'>DFA TO RES</div>
						<div class='panelBounds'>
							<div>Start Process</div>
						</div>
					</div>
				`
})


var dataSetLectureNote = {
	nodeData: [
		{key:'q0', final: false, start: true, category: ""},
		{key:'q1', final: true, start: false, category: ""},
		{key:'q2', final: true, start: false, category: ""}
	],
	linkData: [
		{from: "q0", to: "q1", exp:"a", label:""},
		{from: "q1", to: "q0", exp:"a", label:""},
		{from: "q0", to: "q2", exp:"b", label:""},
		{from: "q2", to: "q0", exp:"b", label:""},
		{from: "q1", to: "q1", exp:"b", label:""},
		{from: "q2", to: "q1", exp:"a", label:""}
	]
}

var dataSetWorkSheet1 = {
	nodeData: [
		{key:'q0', final: true, start: true, category: ""},
		{key:'q1', final: false, start: false, category: ""},
		{key:'q2', final: false, start: false, category: ""},
		{key:'q3', final: false, start: false, category: ""}
	],
	linkData: [
		{from: "q0", to: "q1", exp:"a", label:""},
		{from: "q0", to: "q3", exp:"b", label:""},
		{from: "q1", to: "q0", exp:"a", label:""},
		{from: "q1", to: "q2", exp:"b", label:""},
		{from: "q2", to: "q3", exp:"a", label:""},
		{from: "q2", to: "q1", exp:"b", label:""},
		{from: "q3", to: "q0", exp:"b", label:""},
		{from: "q3", to: "q2", exp:"a", label:""},
	]
}

var dataSetWorkSheet2 = {
	nodeData: [
		{key:'q0', final: false, start: true, category: ""},
		{key:'q1', final: false, start: false, category: ""},
		{key:'q2', final: false, start: false, category: ""},
		{key:'q3', final: false, start: false, category: ""},
		{key:'q4', final: false, start: false, category: ""},
		{key:'q5', final: true, start: false, category: ""},
		{key:'q6', final: true, start: false, category: ""},
	],
	linkData: [
		{from: "q0", to: "q1", exp:"0", label:""},
		{from: "q0", to: "q2", exp:"1", label:""},
		{from: "q1", to: "q3", exp:"0", label:""},
		{from: "q1", to: "q4", exp:"1", label:""},
		{from: "q2", to: "q5", exp:"0", label:""},
		{from: "q2", to: "q6", exp:"1", label:""},
		{from: "q3", to: "q3", exp:"0", label:""},
		{from: "q3", to: "q4", exp:"1", label:""},
		{from: "q4", to: "q5", exp:"0", label:""},
		{from: "q4", to: "q6", exp:"1", label:""},
		{from: "q5", to: "q3", exp:"0", label:""},
		{from: "q5", to: "q4", exp:"1", label:""},
		{from: "q6", to: "q6", exp:"0+1", label:""}
	]
}


new Vue({
	el: '#vue-app',
	template: 	`
				<div class='mainContainer'>
					<div id='myDiagramDiv' style='background-color: #DAE4E4;'></div>
					<!--<controlPanel></controlPanel>-->
					<div v-if='this.diagram != null' class='matrixCorner'>
						<div class='adjacencyMatrix'>
							<div class='placeHolder'></div>
							<div class='colLabels' v-bind:style='"grid-template-columns: repeat("+this.diagram.model.nodeDataArray.length+",1fr);"'>
								<div v-for='node in this.diagram.model.nodeDataArray' class='centerGridItem'>{{node.key}}/{{diagram.model.nodeDataArray.indexOf(node)}}</div>
							</div>
							<div class='rowLabels' v-bind:style='"grid-template-rows: repeat("+this.diagram.model.nodeDataArray.length+",1fr);"'>
								<div v-for='node in this.diagram.model.nodeDataArray' class='centerGridItem'>{{node.key}}/{{diagram.model.nodeDataArray.indexOf(node)}}</div>
							</div>
							<div class='matrix' v-bind:style='"grid-template-rows: repeat("+this.diagram.model.nodeDataArray.length+",1fr); grid-template-columns: repeat("+this.diagram.model.nodeDataArray.length+",1fr);;"'>
								<div v-for='n in matrixElements' class='matrixElement centerGridItem basicBorder' v-bind:class='{connected: n.isConnected, disjoint: !n.isConnected}'>from:{{n.from}} to:{{n.to}}</div>
							</div>
						</div>
					</div>
					<div class='controlPanel'>
						<div class='panelHead'>DFA TO RES</div>
						<div class='panelBounds'>
							<div v-if='!started' v-on:click='startConvertion' style='background-color: blue;'>Start Process</div>
							<div v-else-if='started && targetNode != null' v-on:click='nextStep'>Already Started Click to move to the next step</div>
							<div v-if='targetNode != null && started' class='statePanel'>
								<div class='stateHeader centerGridItem'>Target Node: {{targetNode.key}} </div>
								<div class='stateMap'>
									<div class='state'>
										<div class='stateHeader centerGridItem'>Current</div>
										<div>
											<div>Paths</div>
											<div class='list'>
												<div v-for='pathObj in pathObjects'>{{pathObj.path}}</div>
											</div>
										</div>
										<div>
											<div>Expressions</div>
											<div class='list'>
												<div v-for='pathObj in pathObjects'>{{pathObj.exp}}</div>
											</div>
										</div>
									</div>
									<div class='state'>
										<div class='stateHeader centerGridItem'>After</div>
										<div>
											<div>Paths</div>
											<div class='list'>
												<div v-for='pathObj in pathObjects'>{{pathObj.rpath}}</div>
											</div>
										</div>
										<div>
											<div>Expressions</div>
											<div class='list'>
												<div v-for='pathObj in pathObjects'>{{pathObj.rexp}}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div v-else-if='!started'>Please Start</div>
							<div v-else>Completed the final expression is: {{matrixElements[1].link.exp}}<br/>Completed the final expression is: <scrambleText v-bind:targetText='matrixElements[1].link.exp'></scrambleText></div>
						</div>
					</div>
				</div> 
				`,
	data: {
		started: false,
		lambda: '\u03BB',
		epsilon: '\u03B5',
		diagram: null,
		model: null,
		startNonFinalTemplate: null,
		startFinalTemplate: null,
		nonFinalTemplate: null,
		finalTemplate: null,
		/*
		nodeDataArray: [
			{key:'q0', final: false, start: true, category: ""},
			{key:'q1', final: true, start: false, category: ""},
			{key:'q2', final: true, start: false, category: ""}
		],
		linkDataArray: [
			{from: "q0", to: "q1", exp:"a", label:""},
			{from: "q1", to: "q0", exp:"a", label:""},
			{from: "q0", to: "q2", exp:"b", label:""},
			{from: "q2", to: "q0", exp:"b", label:""},
			{from: "q1", to: "q1", exp:"b", label:""},
			{from: "q2", to: "q1", exp:"a", label:""}
		],
		*/
		nodeDataArray: dataSetWorkSheet2.nodeData,
		linkDataArray: dataSetWorkSheet2.linkData,
		targetNode: null,
		pathObjects: [],
		oldLinks: [],
		newLinks: []
	},
	computed: {
		matrixElements: function(){
			var arr = [];
			allLinks = this.diagram.model.linkDataArray;
			allNodes = this.diagram.model.nodeDataArray;
			for(var row=0;row<allNodes.length;row++){
				for(var col=0;col<allNodes.length;col++){
					arr.push({
						index: (row*allNodes.length)+col,
						from: allNodes[row].key,
						to: allNodes[col].key,
						isConnected: false,
						link: null
					});
				}
			}
			for(var link=0;link<allLinks.length;link++){
				to = allLinks[link].to;
				from = allLinks[link].from;
				nodeRow = allNodes.findIndex(findIndexOf,from)*allNodes.length;
				nodeCol = allNodes.findIndex(findIndexOf,to);
				nodeIndex = nodeRow+nodeCol;
				//arr[(allNodes.findIndex(findIndexOf,from)*allNodes.length)+allNodes.findIndex(findIndexOf,to)].isConnected = true;
				arr[nodeIndex].isConnected = true;
				arr[nodeIndex].link = allLinks[link];
				//console.log(allNodes.findIndex(findIndexOf,from));
			}
			return arr;
		}
	},
	created: function(){
		this.initializeCategory(this.nodeDataArray);
		this.initializeLabel(this.linkDataArray);
	},
	mounted: function(){
		var templmap = new go.Map("string", go.Node); //https://gojs.net/latest/intro/templateMaps.html
		this.diagram = $(go.Diagram, "myDiagramDiv");
		this.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
		this.diagram.model = this.model;
		this.diagram.nodeTemplate =
    	$(go.Node, "Auto",
       		$(go.Shape, "Circle", { stroke: "darkgreen", fill: "yellow" }),
        	$(go.TextBlock, { stroke: "black", font: "bold 10pt sans-serif" },
          	new go.Binding("text", "key"))
    	);
    	this.startNonFinalTemplate = 
    	$(go.Node, "Auto",
    		$(go.Shape, "Circle", { stroke: "black", fill: "green" }),
    		$(go.TextBlock, { stroke: "black", font: "bold 10pt sans-serif" },
          	new go.Binding("text", "key"))
    	);
    	this.startFinalTemplate = 
    	$(go.Node, "Auto",
    		$(go.Shape, "Circle", { stroke: "black", fill: "orange" }),
    		$(go.TextBlock, { stroke: "black", font: "bold 10pt sans-serif" },
          	new go.Binding("text", "key"))
    	);
    	this.nonFinalTemplate = 
    	$(go.Node, "Auto",
    		$(go.Shape, "Circle", { stroke: "black", fill: "yellow" }),
    		$(go.TextBlock, { stroke: "black", font: "bold 10pt sans-serif" },
          	new go.Binding("text", "key"))
    	);
    	this.finalTemplate = 
    	$(go.Node, "Auto",
    		$(go.Shape, "Circle", { stroke: "black", fill: "red" }),
    		$(go.TextBlock, { stroke: "black", font: "bold 10pt sans-serif" },
          	new go.Binding("text", "key"))
    	);
    	templmap.add("snf", this.startNonFinalTemplate);
    	templmap.add("sf", this.startFinalTemplate);
    	templmap.add("nf", this.nonFinalTemplate);
    	templmap.add("f", this.finalTemplate);
    	this.diagram.nodeTemplateMap = templmap;
    	this.diagram.linkTemplate =
    	$(go.Link,
      		{ curve: go.Link.Bezier },
      		$(go.Shape),
      		$(go.Shape, { toArrow: "Standard" }),
      		$(go.Panel, "Auto",  // this whole Panel is a link label
        		$(go.Shape, "TenPointedStar", { fill: "yellow", stroke: "gray" }),
        		$(go.TextBlock, { margin: 3 },
         	 		new go.Binding("text", "label"))
      		)
    	);
    	//this.findConnectingNodesForKey("q0");
    	this.matrix();
	},
	methods: {
		initializeCategory: function(nodes){
			for (var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				if (node.start && node.final){
					nodes[i].category = "sf"
				}
				if (node.start && !node.final){
					nodes[i].category = "snf"
				}
				if (!node.start && node.final){
					nodes[i].category = "f"
				}
				if (!node.start && !node.final){
					nodes[i].category = "nf"
				}
				//console.log(nodes[i].category);
			}
		},
		initializeLabel: function(links){
			for (var i = 0; i < links.length; i++){
				var link = links[i];
				if (link.exp == ''){
					link.label = this.lambda;
				}else{
					link.label = link.exp;
				}
			}
		},
		computeCategory: function(node){
			if (node.start && node.final){
				return "sf"
			}
			if (node.start && !node.final){
				return "snf"
			}
			if (!node.start && node.final){
				return "f"
			}
			if (!node.start && !node.final){
				return "nf"
			}
		},
		computeLabel: function(link){
			if (link.exp == ''){
				return this.lambda;
			}else{
				return link.exp;
			}
		},
		findConnectingNodesForKey: function(key){
			var connectedNodes = this.diagram.findNodeForKey(key).findNodesConnected().iterator;
    		if (connectedNodes.count > 0){
    			console.log(key+": "+"is connected to "+connectedNodes.count+" Nodes");
    			connectedNodes.each((value)=>{
    				console.log(key+"==>"+value.key);
    			})
    		}else{
    			console.log("no nodes returned for: "+key);
    		}
		},
		findFinalStateNodes: function(){
			var finalStateNodes = this.diagram.findNodesByExample({final: true});
			if (finalStateNodes.count > 0){
    			console.log("There are: "+finalStateNodes.count+" Final State Nodes");
    			finalStateNodes.each((value)=>{
    				console.log("Final State==>"+value.key);
    			})
    		}else{
    			console.log("no final State Nodes Found");
    		}
		},
		findStartStateNodes: function(){
			var startStateNodes = this.diagram.findNodesByExample({start: true});
			if (startStateNodes.count > 0){
    			console.log("There are: "+startStateNodes.count+" Start State Nodes");
    			startStateNodes.each((value)=>{
    				console.log("Start State==>"+value.key);
    			})
    		}else{
    			console.log("no start State Nodes Found");
    		}
		},
		transformStartNode: function(){
			var startStateNodes = this.diagram.findNodesByExample({start: true});
			if (startStateNodes.count > 0){
    			//console.log("There are: "+startStateNodes.count+" Start State Nodes");
    			startStateNodes.each((value)=>{
    				/*
    				if (value.key === "start"){
    					continue;
    				}*/
    				if (value.key != "start"){
    					this.diagram.model.setDataProperty(value.data, "start", false);
    					this.diagram.model.setDataProperty(value.data, "category", this.computeCategory(value));
    					this.diagram.model.addLinkData({from: "start", to: value.key, exp: '', label: this.lambda});
    					//console.log("Start State==>"+value.key);
    				}
    			})
    		}
		},
		transformFinalNode: function(){
			var finalStateNodes = this.diagram.findNodesByExample({final: true});
			if (finalStateNodes.count > 0){
    			//console.log("There are: "+finalStateNodes.count+" Final State Nodes");
    			finalStateNodes.each((value)=>{
    				/*
    				if (value.key === "start"){
    					continue;
    				}*/
    				if (value.key != "end"){
    					this.diagram.model.setDataProperty(value.data, "final", false);
    					this.diagram.model.setDataProperty(value.data, "category", this.computeCategory(value));
    					this.diagram.model.addLinkData({from: value.key, to: "end", exp: '', label: this.lambda});
    					//console.log("Final State==>"+value.key);
    				}
    			})
    		}
		},
		matrix: function(){
			allLinks = this.diagram.model.linkDataArray;
			console.log(allLinks);
			for (var i = 0; i<allLinks.length; i++){
				console.log(allLinks[i].from+"==>"+allLinks[i].to);
			}
		},
		startConvertion: function(){
			//console.log("starting");
			this.started = true;
			//create new start and end nodes
			this.diagram.model.addNodeData({key: "start", start: true, final: false, category:"snf"});
			this.diagram.model.addNodeData({key: "end", start: false, final: true, category:"f"});
			//
			//change old start node to non start and old final state to non final AND create links to new states
			this.transformStartNode();
			this.transformFinalNode();
			//
			this.setTarget();
			this.listTargetPaths();
			//this.findConnectingNodesForKey("q0");
			//console.log(this.diagram.model.linkDataArray.length);
			//console.log(this.diagram.model.nodeDataArray.length);
		},
		/* 
		//this function is depreciated because with dataSetWoorkSheet2, a problem occurs where after removal of q3, q5 is select as the next target
		//and q4 is removed last, give an incorrect answer. The source of this problem is the removal of a link from start to q4 which readded
		//at the end of the list. 
		setTarget: function(){
			var linkIter = this.diagram.findNodeForKey('start').findLinksConnected();
			linkIter.first() //move to first link connected to start
			if (linkIter.value.data.to == 'end'){ //if the first node is the end node, move to the next
				linkIter.next();
			}
			this.targetNode = this.diagram.findNodeForKey(linkIter.value.data.to);
		},*/
		setTarget: function(){
			indexOfStart = this.model.nodeDataArray.findIndex(findIndexOf, "start");
			if (this.nodeDataArray.length > 2){
				for (var i = 0; i<this.model.nodeDataArray.length; i++){
					var index = (indexOfStart*this.model.nodeDataArray.length)+i;
					if (this.matrixElements[index].isConnected){
						this.targetNode = this.diagram.findNodeForKey(this.matrixElements[index].to);
						break;
					}
				}
			}else{
				this.targetNode = null;
				console.log('done');
			}	
		},
		listTargetPaths: function(){
			this.pathObjects = [];
			//var fromIndex = allNodes.findIndex(findIndexOf, "start"); //starting from inserted start node
			//var targetIndex = allNodes.findIndex(findIndexOf, this.targetNode.key); //column index
			//var toIndex = null;
			var pathObj = {};
			//pathing goes from-target-to
			linksToTarget = this.targetNode.findLinksInto();
			linksFromTarget = this.targetNode.findLinksOutOf();
			var pathString = ``;
			var pathExp = ``;
			this.newLinks = [];
			this.oldLinks = [];
			var newLink = {};
			var loopResponse = this.targetLoop();
			linksToTarget.each((tValue)=>{
				linksFromTarget.each((fValue)=>{
					if (tValue.data.from != this.targetNode.key && fValue.data.to != this.targetNode.key){ //loop check, prevents target-target-target/other-target-target/target-target-other paths
						//
						//https://regex101.com/r/KEaBY9/3 link to regex tester
						var regExp = /^.+[+].+/;
						//var regExp = /[(].+[+].+[)]/;
						var fromExp = tValue.data.exp;
						var toExp = fValue.data.exp;
						//console.log(`The expression :- ${fromExp} is ${regExp.test(fromExp)}`);
						//console.log(`The expression :- ${fromExp} is ${regExp.exec(fromExp)}`);
						//console.log(`The expression :- ${toExp} is ${regExp.test(toExp)}`);
						//console.log(`The expression :- ${toExp} is ${regExp.exec(toExp)}`);
						/*
						if (fromExp.includes('+')){
							fromTerms = fromExp.split('+',2);
							console.log(fromTerms);
							//fromExp = `(${fromExp})`;
						}
						if (toExp.includes('+')){
							toTerms = toExp.split('+',2);
							console.log(toTerms);
							//toExp = `(${toExp})`;
						}
						*/
						//
						pathString = `${tValue.data.from} => ${this.targetNode.key} => ${fValue.data.to}`;
						if (loopResponse.loop){
							//test if the loop is a single character or not
							var singleCharacterLoop = /^.$/;
							if (singleCharacterLoop.test(loopResponse.exp)){
								//console.log('true');
								loopExp = `${loopResponse.exp}*`;
							}else{
								//console.log('not true');
								loopExp = `(${loopResponse.exp})*`;
							}
							//
							//loopExp = `(${loopResponse.exp})*`;
							//pathExp = `${fromExp}${loopExp}${toExp}`;
							pathExp = this.evaluateLoop(toExp,loopExp,fromExp);
						}else{
							//pathExp = `${fromExp}${toExp}`;
							pathExp = this.evaluateExpression(toExp, fromExp);
						}

						//console.log(`${pathString} || ${pathExp}`);
						reducedPathString = `${tValue.data.from} => ${fValue.data.to}`
						link = this.diagram.findLinksByExample({from: tValue.data.from, to: fValue.data.to}); //find already existing links without target node in path
						if(link.count > 0){//if the link already exists
							link.next();
							if (link.value.data.exp == ""){
								reducedExp = `${this.lambda}+${pathExp}`; //changes the representation of empty string to lambda
							}else{
								reducedExp = `${link.value.data.exp}+${pathExp}`;
							} 
							//reducedExp = `${link.value.data.exp}+${pathExp}`;
							pathObj = {
								path: pathString, 
								exp: pathExp,
								rpath: reducedPathString,
								rexp: reducedExp
							};
							newLink = {
								from: tValue.data.from,
								to: fValue.data.to,
								exp: reducedExp,
								label: reducedExp
							}; //data object for new link to be created
							this.oldLinks.push(link.value); //add to links to be removed on next step
							//console.log(`${pathObj.rpath} || ${pathObj.rexp}`);
						}else{
							pathObj = {
								path: pathString, 
								exp: pathExp,
								rpath: reducedPathString,
								rexp: pathExp
							};
							newLink = {
								from: tValue.data.from,
								to: fValue.data.to,
								exp: pathExp,
								label: pathExp
							}; //data object for new link to be created
							//oldLinks.push(this.diagram.findLinksByExample({from: this.targetNode.key, to: fValue.data.to})); //add to links to be removed on next step
							//console.log(`${pathObj.rpath} || ${pathObj.rexp}`);
						}
						this.newLinks.push(newLink);//add to collection of links to be created
						this.pathObjects.push(pathObj);
					}
				});	
			});
			/*
			this.newLinks.forEach((value)=>{
				console.log(value);
			});
			*/
			//this.nextStep(oldLinks, newLinks);
		},
		evaluateExpression: function(toExp,fromExp){
			//var regExp = /[(].+[+].+[)]/;
			var regExp = /^.+[+].+/;
			if (toExp != '' && fromExp != ''){
				if (regExp.test(toExp)){
					toExp = `(${toExp})`;
				}
				if (regExp.test(fromExp)){
					fromExp = `(${fromExp})`;
				}
			}
			return `${fromExp}${toExp}`;
		},
		evaluateLoop: function(toExp,loopExp,fromExp){
			var regExp = /^.+[+].+/;
			if (toExp != '' || fromExp != ''){
				if (regExp.test(toExp)){
					toExp = `(${toExp})`;
				}
				if (regExp.test(fromExp)){
					fromExp = `(${fromExp})`;
				}
			}
			return `${fromExp}${loopExp}${toExp}`;
		},
		/*
		nextStep: function(disconnectedOldLinks, newLinks){
			console.log(`Old Links: ${disconnectedOldLinks.length}`);
			disconnectedOldLinks.forEach((value)=>{
				console.log(`Removing ${value}`);
				this.diagram.model.removeLinkData(value.data);
			});
			newLinks.forEach((value)=>{
				console.log(value);
				this.diagram.model.addLinkData(value);
			});
			this.diagram.remove(this.targetNode);//also removes all links connected to the removed node
		}
		*/
		nextStep: function(){
			this.oldLinks.forEach((value)=>{
				console.log(`Removing ${value.data.from} => ${value.data.to} || ${value.data.exp}`);
				this.diagram.model.removeLinkData(value.data);
			});
			this.newLinks.forEach((value)=>{
				//console.log(value);
				console.log(`Adding ${value.from} => ${value.to} || ${value.exp}`);
				this.diagram.model.addLinkData(value);
			});
			this.diagram.remove(this.targetNode);//also removes all links connected to the removed node
			this.setTarget();
			this.listTargetPaths();
		},
		targetLoop: function(){
			var loops = this.diagram.findLinksByExample({from: this.targetNode.key, to: this.targetNode.key});
			var response = {};
			var link;
			if (loops.count > 0){
				//console.log('loop found');
				loops.first(); //because i'm expecting one link
				link = loops.value;
				response = {
					loop: true,
					exp: link.data.exp
				}
			}else{
				//console.log('no self loop');
				response = {
					loop: false,
					exp: null
				}
			}
			console.log(response);
			return response;
		}
	}
})

function findIndexOf (element){ //used for finding the array index of a node in the nodeDataArray using the findIndex array function
	return element.key == this;
}


//not used yet
function bothEmptyExpression/*?*/(exp1, exp2){ //checks if two expressions are the same
	if (exp1 === '' && exp2 === ''){
		return this.lambda;
	}else{
		return `${exp1}+${exp2}`;
	}
}