var index = require("./index.js");

index.load().then(()=>{
	//setInterval(()=>{
		index.run().then((e)=>{
			console.dir(e);
		}).catch((e)=>console.error(e));
	//}, 1000);
}).catch((e)=>console.error(e));