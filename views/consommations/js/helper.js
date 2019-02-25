let periode = document.getElementById("periode");

periode.addEventListener('change', function(e){
   let p = document.getElementById(periode.value);
   p.style.display = 'block';
});