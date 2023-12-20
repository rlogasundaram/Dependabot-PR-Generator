async function fetchData(repoPlugin) {
  return new Promise((resolve, reject) => {

    const headers = {
      'Authorization': `token ${gitOptions.TOKEN}`,
    };
    let apiURL;
    if (repoPlugin.includes("cloudbees")) { //proprietary plugins
      apiURL = `${gitAPI.url}/${repoPlugin}/pulls`;
      fetch(`${apiURL}`, {
        method: 'GET', headers: new Headers({
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Authorization': `token ${gitOptions.TOKEN}`
        })
      }
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json();
            throw new Error(`Error: ${response.status}, ${response.statusText}`)

          }
        })
        .then(data => resolve(data))
        .catch(error => {
          return "Unexpected error: Please check the log: ", error;
        });
    } else { //oss plugins
      apiURL = `${gitAPI.url}/${repoPlugin}/pulls`;
      fetch(`${apiURL}`, { method: 'GET' })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Error: ${response.status}, ${response.statusText}`)
          }
        })
        .then(data => resolve(data))
        .catch(error => {
          return "Unexpected error: Please check the log: ", error;
        });
    }


  })
}
/*
  get the plugins list during onload from json file
*/
let gaiaPluginJson = {};
async function loadJson() {
  fetch('./gaiaplugins.json')
    .then((response) => response.json())
    .then((json) => {
      gaiaPluginJson = json;
    });
}
loadJson();

let cloudbeesListViewResult = [];
let ossListViewResult = [];
let osslist = document.getElementById("oss");
let cloudbeeslist = document.getElementById("cloudbees");
const run = document.getElementById("prGenerator");
let exportPR = document.getElementById("exportPRs");
let loadSpinner = document.getElementById("loader");

// title initialize
document.getElementById("cloudbeesTitle").style.display = 'none';
document.getElementById("ossTitle").style.display = 'none';

//Tab click functionality
let cloudbeesTabClick = document.getElementById("cloudbeesTab");
let ossTabClick = document.getElementById("ossTab");

function tabShowAndHide(event, tabId, tabContentId) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabId).style.display = "block";
  document.getElementById(tabContentId).style.display = "block";
  event.currentTarget.className += " active";
}

cloudbeesTabClick.addEventListener('click', async (event) => {
  let cloudbeesTabId = "cloudbeesTab";
  let cloudbeesTabContentId = "cloudbees";
  tabShowAndHide(event, cloudbeesTabId, cloudbeesTabContentId);
});

ossTabClick.addEventListener('click', async (event) => {
  let ossTabId = "ossTab";
  let ossTabContentId = "oss";
  tabShowAndHide(event, ossTabId, ossTabContentId);
});

/*
  Fetch the dependabot PR when click the prGenerator button
*/
osslist.style.display = "none";
cloudbeeslist.style.display = "none";
loadSpinner.style.display = "none";
exportPR.disabled = true;

//reset localstorage onload
localStorage.setItem("oss", JSON.stringify(ossListViewResult));
localStorage.setItem("proprietary", JSON.stringify(cloudbeesListViewResult));

run.addEventListener('click', async () => {

  let tabactive = document.getElementsByClassName("tablinks active")[0].value;

  // cloudbees plugins
  if (tabactive == 'cloudbees') {
    let dependabotPRs = [];

    document.getElementById("cloudbees").style.display = "block";
    loadSpinner.style.display = "block";
    exportPR.disabled = false;

    console.log("cloudbeesplugin: ", gaiaPluginJson);
    for (let repo = 0; repo < gaiaPluginJson.cloudbees.length; repo++) {

      dependabotPRs = await fetchData(gaiaPluginJson.cloudbees[repo]);
      if (dependabotPRs != null || dependabotPRs != '' || !dependabotPRs.status == 404) {
        // pick only the dependabot PRS from the response
        for (let i = 0; i < dependabotPRs.length; i++) {
          if (dependabotPRs[i].user.login == "dependabot[bot]") {
            cloudbeeslist.innerHTML += '<a href="' + dependabotPRs[i].html_url + '" target="_blank">"' + dependabotPRs[i].html_url + '"</a></br>';
            cloudbeesListViewResult.push(dependabotPRs[i].html_url);
          }
        }
        cloudbeeslist.style.display = "block";
        exportPR.disabled = false;
        //store the proprietary list in local storage
        localStorage.setItem("proprietary", JSON.stringify(cloudbeesListViewResult));
      } else {
        cloudbeeslist.style.display = "none";
        loadSpinner.style.display = "none";
      }
      loadSpinner.style.display = "block";
      exportPR.disabled = true;
    }
    loadSpinner.style.display = "none";
    exportPR.disabled = false;
  }

  // oss plugins
  if (tabactive == 'oss') {
    let dependabotPRs = [];

    document.getElementById("oss").style.display = "block";
    loadSpinner.style.display = "block";
    exportPR.disabled = false;

    console.log("ossPlugins: ", gaiaPluginJson);
    for (let repo = 0; repo < gaiaPluginJson.oss.length; repo++) {

      dependabotPRs = await fetchData(gaiaPluginJson.oss[repo]);
      if (dependabotPRs != null || dependabotPRs != '') {
        // pick only the dependabot PRS from the response
        for (let i = 0; i < dependabotPRs.length; i++) {
          if (dependabotPRs[i].user.login == "dependabot[bot]") {
            osslist.innerHTML += '<a href="' + dependabotPRs[i].html_url + '" target="_blank">"' + dependabotPRs[i].html_url + '"</a></br>';
            ossListViewResult.push(dependabotPRs[i].html_url); // osslist array for view page
          }
        }
        osslist.style.display = "block";
        exportPR.disabled = false;
        //store the oss list in local storage
        localStorage.setItem("oss", JSON.stringify(ossListViewResult));
      } else {
        osslist.style.display = "none";
        loadSpinner.style.display = "none";
      }
      loadSpinner.style.display = "block";
      exportPR.disabled = true;
    }
    loadSpinner.style.display = "none";
    exportPR.disabled = false;
  }

});

/* 
  download the PRs in word
*/
exportPR.addEventListener('click', async () => {

  var cloudbeesHeader = document.getElementById('cloudbeesTitle').innerHTML;
  var ossHeader = document.getElementById('ossTitle').innerHTML;
  var htmlCloudbees = document.getElementById('cloudbees').innerHTML;
  var htmlOSS = document.getElementById('oss').innerHTML;

  var htmlContent = cloudbeesHeader + htmlCloudbees + ossHeader + htmlOSS;

  var blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  var url = mswordURL.link + encodeURIComponent(htmlContent);

  let filename = "DependabotPRs";
  filename = filename ? filename + '.doc' : 'document.doc';

  var downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    downloadLink.href = url;
    downloadLink.download = filename;

    downloadLink.click();
  }
  document.body.removeChild(downloadLink);
});