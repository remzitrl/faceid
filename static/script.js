var lockpage = document.getElementById("lockpage");
var homepage = document.getElementById("homepage");
var passpage = document.getElementById("passpage");
var campage = document.getElementById("campage");
var phoneContainer = document.getElementsByClassName('main')[0];
var scanface = document.getElementById('scanface');
var bodyElement = document.body;

var isPhoneContActive = true;
var password = "";

var timesClicked = 0;
var isLocked = true;
let isStopRequested = true;
var passcodeCount = 0;








if(bodyElement.classList.contains("open"))
	checkFaceDetected();
else
	document.getElementById("inner").style.opacity = "0"; 
	document.getElementById("iphone").style.backgroundImage = "none";   
	document.getElementById("iphone").style.backgroundColor = "#000"; 


function turnOff() {
	password = "";
	passcodeCount = 0;
	removeFilledDot();
	console.log("clicked");
	isLocked = true;
	isStopRequested = true;
	var lock = document.getElementsByClassName("lock")[0];
	lock.src = "static/Images/Icons/lock.png";
	lock.style.width = "12px";


	if(bodyElement.classList.contains("open")){
		bodyElement.classList.remove('open');
		lockpage.style.display = "block";

		if(homepage.style.display == "block")
			homepage.style.display = "none";
		else if(passpage.style.display == "block")
			passpage.style.display = "none";
		else if(campage.style.display == "block")
			campage.style.display = "none";

		document.getElementById("inner").style.opacity = "0"; 
		document.getElementById("iphone").style.backgroundImage = "none";   
		document.getElementById("iphone").style.backgroundColor = "#000"; 
	}else{
		lockpage.style.opacity = "1";
		bodyElement.classList.add('open');
		document.getElementById("inner").style.opacity = "1"; 
		document.getElementById("iphone").style.backgroundColor = "transparent"; 
		document.getElementById("iphone").style.backgroundImage = "url('/static/bck.png')";   
		document.getElementById("inner").style.cursor = "auto";
		isStopRequested = false; 
		checkFaceDetected();
	}
}


function changeColorTorch() {
	timesClicked++;

	if (timesClicked % 2 == 1) {
	document.getElementById("torchBtn").style.backgroundColor = "#ffffff";
	document.getElementById("torchImg").src = "static/Images/Icons/torchDark.png";
	document.getElementById("light").style.display = "block";
	} else {
		document.getElementById("torchBtn").style.backgroundColor = "#1d2145";
		document.getElementById("torchImg").src = "static/Images/Icons/torch.png";
		document.getElementById("light").style.display = "none";
	}
}

function removeFilledDot(){
	var all = document.getElementsByClassName("dot");
	for (var i = 0; i < all.length; i++) {
		all[i].style.backgroundColor = "transparent";
	}	
}

function addFilledDot(num) {
	password += num;
	passcodeCount++;

	document.getElementById("dot" + passcodeCount).style.backgroundColor = "#fff";

	if (passcodeCount == 4) {
		if(password == "6134"){
			isLocked = false;
			setTimeout(function(){
				passpage.style.display = "none";
				homepage.style.display = "block";
			}, 500);
		}else{
			setTimeout(function(){
				password = "";
				passcodeCount = 0;
				var all = document.getElementsByClassName("dot");
				for (var i = 0; i < all.length; i++) {
					all[i].style.backgroundColor = "transparent";
				}				
			}, 500);
		}
	}
}


function openHomePageScreen(){
	if(isLocked){
		lockpage.style.display = "none";
		passpage.style.display = "block";
	}else{
		lockpage.style.display = "none";
		homepage.style.display = "block";
	}
	
}

function turnOffLockScreen(){
	passpage.style.display = "none";
	lockpage.style.display = "block";
}

function openCamera(){
	lockpage.style.display = "none";
	campage.style.display = "block";
}

function openHomeScreen(){
	lockpage.style.display = "block";
	campage.style.display = "none";
}


function checkFaceDetected() {
	if (isStopRequested) {
		console.log("fonksiyon durduruldu.");
        return;
    }else{
		fetch('/get_name')
			.then(response => response.text())
			.then(data => {
				console.log(data);
				if (data == 1) {
					isStopRequested = true;
					isLocked = false;
					if(passpage.style.display == "none"){
						setTimeout(function(){
							var lock = document.getElementsByClassName("lock")[0];
							lock.src = "static/unlocked.png";
							lock.style.width = "25px";
						},1000);
					}else{
						for (var i = 1; i < 5; i++) {
							document.getElementById("dot" + i).style.backgroundColor = "#fff";
							
						}	
						var lock = document.getElementsByClassName("lock")[1];
						lock.src = "static/unlocked.png";
						lock.style.width = "25px";
						setTimeout(function(){
							passpage.style.display = "none";
							homepage.style.display = "block";
						},1000);
					}
				
					
				}
				setTimeout(checkFaceDetected, 100); 
			});
	}
}










/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var timeString = hours + ':' + minutes;
	document.getElementById('clock').innerHTML = timeString;
	if(document.getElementById('clock2')!=null)
	document.getElementById('clock2').innerHTML = timeString;

    var dateString = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', weekday: 'long' });
	document.getElementById('date').innerHTML = dateString;
	
}

updateClock();
setInterval(updateClock, 1000);


document.addEventListener('keydown', function(event) {
    if (event.key == 1) {
        if(isPhoneContActive)
        {
            isPhoneContActive = false;
            phoneContainer.style.opacity = "0";
            scanface.style.display = "block";
        }else{
            isPhoneContActive = true;
            phoneContainer.style.opacity = "1";
            scanface.style.display = "none";
        }
    }
});


