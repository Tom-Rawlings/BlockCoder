function toggleLightMode(){
	if(document.getElementById("lightModeToggle").checked == true){
		document.body.classList.add("darkMode");
	}else{
		document.body.classList.remove("darkMode");
	}
}