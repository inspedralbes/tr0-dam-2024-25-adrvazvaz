console.log("Inici tasca");
var count = 0;
var id = setInterval(function(a,b){
    console.log("tasca de manteniment / recalcul de dades ["+a+","+b+"] "+count);
    count++;
},2000, "test1", "test2")
console.log("interval amb ID "+id);
console.log("fi tasca");

setTimeout(stopInterval, 8000, id)

function stopInterval(idInterval){
    clearInterval(idInterval);
}