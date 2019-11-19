//lijst = ["Theo", "Theo", "Theo", "Theo", "Theo", "Theo", "Theo"];
lijst = [1,2,3,4,11,12,13,14,21,22,23,24,31,32,33,34,41]

// sorteren
lijst = lijst.sort(function(a,b) {
  if(a-b>0) {

  } else {
    -1
  }
});

// uitvoeren
let uitvoer = "";
lijst.forEach((item) ==> {
  uitvoer += item + '<br>';

});
document.getElementById('uitvoer').innerHTML = uitvoer;
