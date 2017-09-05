db=db.getSiblingDB("test");
cursor = db.mytable.aggregate([{$changeStream:{}}]);
while(true){
	if(cursor.hasNext())
		printjson(cursor.next());	
	sleep(100);
}
/**
var res = db.runCommand({aggregate: "test", "pipeline": [{$changeStream:{}}], cursor: {batchSize:4}});
var cursor = res.cursor;
printjson(res);,

for(var i=0;i<10000;i++){
	res2= db.runCommand({
            getMore: cursor.id,
            collection: "test",
            maxTimeMS: 5 * 60 * 1000
        });
	cursor = res2.cursor
  	print(db.test.count());
	  if(cursor.nextBatch && cursor.nextBatch.length>0){
		  print("Got " + cursor.nextBatch.length); 
		  for(var k=0;k<cursor.nextBatch.length;k++){
		  	printjson(cursor.nextBatch[k].fullDocument);
		  }
	  }
	  sleep(1000);	 
}

tailableCursor = db.mytable.aggregate([{$changeStream: {}}]);
for(var i=0;i<10000;i++){
	if(tailableCursor.hasNext()){
		printjson(tailableCursor.next());		
	}
	sleep(100);
	//print(db.tailable1.count());
}




*/
/**
db=db.getSiblingDB("local")
var cur = db.oplog.rs.aggregate([{$changeStream:{}}, {$match:{a:{$gt:1}}}]);

for(var i=0;i<10000;i++){
  print(db.test.count());
  if(cur.hasNext()){
	  print("Got " + cur.next());
  }
  sleep(1000);	 
}
*/