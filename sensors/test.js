var index = require("./index.js");

index.load().then(()=>{
	index.run().then((e)=>{
		console.dir(e);
	}).catch((e)=>console.error(e));
}).catch((e)=>console.error(e));