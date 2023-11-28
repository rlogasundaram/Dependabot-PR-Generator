async function fetchData(ossrepo) {
  return new Promise((resolve, reject) => {

    const repo = ossrepo;
    const apiUrl = `${gitAPI.url}/${repo}/pulls`;

    const headers = {
      authorization: `token ${gitOptions.TOKEN}`,
    };
    const params = new URLSearchParams({
      state: 'open',
      head: 'dependabot',
    });
    //?${params.toString()}
    //{headers},
    fetch(`${apiUrl}`, { method: 'GET' })
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
  })
}
/*
  get the plugins list during onload
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

let list = document.getElementById("outputarea");
const run = document.getElementById("prGenerator");
let exportPR = document.getElementById("exportPRs");
let loadSpinner = document.getElementById("loader");


list.style.display = "none";
loadSpinner.style.display = "none";
exportPR.disabled = true;

/*
  Fetch the dependabot PR when click the prGenerator button
*/
run.addEventListener('click', async () => {
  let response = [];
  let dependabotPRs = [];

  loadSpinner.style.display = "block";
  exportPR.disabled = false;

  console.log("ossPlugins: ", gaiaPluginJson);
  for (let repo = 0; repo < gaiaPluginJson.oss.length; repo++) {

    response = await fetchData(gaiaPluginJson.oss[repo]);
    if (response != null || response != '') {
      // pick only the dependabot PRS from the response

      for (let i = 0; i < response.length; i++) {
        if (response[i].user.login == "dependabot[bot]") {
          list.innerHTML += '<a href="' + response[i].html_url + '" target="_blank">"' + response[i].html_url + '"</a></br>';
        }
      }


      list.style.display = "block";
      exportPR.disabled = false;
    } else {
      list.style.display = "none";
      loadSpinner.style.display = "none";
    }
    loadSpinner.style.display = "block";
    exportPR.disabled = true;
  }
  loadSpinner.style.display = "none";
  exportPR.disabled = false;

});


/* 
  download the PRs in word
*/
exportPR.addEventListener('click', async () => {
  var html = document.getElementById('outputarea').innerHTML;

  var blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });

  var url = mswordURL.link + encodeURIComponent(html);

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