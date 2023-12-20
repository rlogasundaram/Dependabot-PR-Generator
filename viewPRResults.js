let showOSSPR = document.getElementById("ossPRList");
let showProprietaryPR = document.getElementById("cloudbeesPRList");

let propCheck = document.getElementById("propValid");
let ossCheck = document.getElementById("ossValid");
propCheck.style.display = "none";
ossCheck.style.display = "none";

let ossRes = [];
let proprietaryRes = [];

proprietaryRes.push(JSON.parse(localStorage.getItem("proprietary")));
ossRes.push(JSON.parse(localStorage.getItem("oss")));



// iterate proprietary list from localstorage
if (proprietaryRes == null || proprietaryRes[0].length == 0) {
    propCheck.style.display = "block";
} else {
    for (let prop = 0; prop < proprietaryRes[0].length; prop++) {
        let li = document.createElement('li');
        li.className = 'propName';
        li.innerHTML = '<a href="' + proprietaryRes[0][prop] + '" target="_blank">"' + proprietaryRes[0][prop] + '"</a>';
        showProprietaryPR.appendChild(li);
        //showProprietaryPR.innerHTML += proprietaryRes[0][prop] + '</br>';
    }
}

// iterate Oss list from localstorage
if (ossRes == null || ossRes[0].length == 0) {
    ossCheck.style.display = "block";
} else {
    for (let oss = 0; oss < ossRes[0].length; oss++) {
        let li = document.createElement('li');
        li.className = 'ossName';
        li.innerHTML = '<a href="' + ossRes[0][oss] + '" target="_blank">"' + ossRes[0][oss] + '"</a>';
        showOSSPR.appendChild(li);
        //showOSSPR.innerHTML += ossRes[0][oss] + '</br>';
    }
}