var type = document.getElementById('type');
var pk = document.getElementById('pk');
type.addEventListener('change', function(e){
    if (type.value=="electricite") {
        pk.style.display = "block";
    }else{
        pk.style.display = "none";
    }
});
