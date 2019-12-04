const base_url = "https://api.football-data.org/v2/";

const api_token = 'b3dad9833b3a4b78af52563c2d2b6895';

let fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': api_token,
    }
  });
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}
// Blok kode untuk melakukan request data json
function getCompetitions() {
  if ('caches' in window) {
    caches.match(base_url + "competitions?plan=TIER_ONE").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          // console.log(data);
          let leagueHTML = "";
          data.competitions.forEach(function (liga) {
            leagueHTML += `
              <div class="col s12 m4" >
              <a href="./standing.html?id=${liga.id}">
                <div class="card">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="img/liga/${liga.code}.png" />
                  </div>
                  <hr>
                  <div class="card-content">
                    <span class="truncate"><b>${liga.name}</b></span>
                    <p>${liga.area.name}</p>
                    <hr>
                    <p>Kode Liga: ${liga.code}</p>
                    <p>Mulai: ${liga.currentSeason.startDate}</p>
                    <p>Berakhir: ${liga.currentSeason.endDate}</p>
                    <p>Pertandingan: ${liga.currentSeason.currentMatchday}</p>
                  </div>
                </div>
              </a>
              </div>
              `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("leagues").innerHTML = leagueHTML;
        })
      }
    })
  }
  fetchApi(base_url + "competitions?plan=TIER_ONE")
    .then(status)
    .then(json)
    .then(function (data) {
      // console.log(data);
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menyusun komponen card artikel secara dinamis
      let leagueHTML = "";
      data.competitions.forEach(function (liga) {
        leagueHTML += `
          <div class="col s12 m4" >
          <a href="./standing.html?id=${liga.id}">
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="img/liga/${liga.code}.png" />
              </div>
              <hr>
              <div class="card-content">
                <span class="truncate"><b>${liga.name}</b></span>
                <p>${liga.area.name}</p>
                <hr>
                <p>Kode Liga: ${liga.code}</p>
                <p>Mulai: ${liga.currentSeason.startDate}</p>
                <p>Berakhir: ${liga.currentSeason.endDate}</p>
                <p>Pertandingan: ${liga.currentSeason.currentMatchday}</p>
              </div>
            </div>
          </a>
          </div>
          `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("leagues").innerHTML = leagueHTML;
    })
    .catch(error);
}

function getStanding() {
  // Ambil nilai query parameter (?id=)
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");

  if ('caches' in window) {
    caches.match(base_url + "competitions/" + idParam + "/standings").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          let standingsHTML = "";
          let leagueHTML = "";
          if (data.competition.id == 2018 || data.competition.id == 2000) {
            leagueHTML += `
              <div class="col m3 l4"></div>
                <div class="col s12 m6 l4">
                  <div class="card grey darken-4">
                    <div class="white card-image waves-effect waves-block waves-light">
                      <img src="img/liga/${data.competition.code}.png" />
                    </div>
                    <hr>
                    <div class="card-content">
                      <span class="truncate"><b>${data.competition.name}</b></span>
                      <p>${data.competition.area.name}</p>
                      <hr>
                      <p>Kode Liga: ${data.competition.code}</p>
                      <p>Mulai: ${data.season.startDate}</p>
                      <p>Berakhir: ${data.season.endDate}</p>
                      <p>Pertandingan: ${data.season.currentMatchday}</p>
                    </div>
                  </div>
                </div>
              <div class="col m3 l4"></div>
              `;

            standingsHTML +=
              `
              <tr class="text-center">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <h4>Data Kosong</h4>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            `;
          } else {
            leagueHTML += `
              <div class="col m3 l4"></div>
                <div class="col s12 m6 l4">
                  <div class="card grey darken-4">
                    <div class="white card-image waves-effect waves-block waves-light">
                      <img src="img/liga/${data.competition.code}.png" />
                    </div>
                    <hr>
                    <div class="card-content">
                      <span class="truncate"><b>${data.competition.name}</b></span>
                      <p>${data.competition.area.name}</p>
                      <hr>
                      <p>Kode Liga: ${data.competition.code}</p>
                      <p>Mulai: ${data.season.startDate}</p>
                      <p>Berakhir: ${data.season.endDate}</p>
                      <p>Pertandingan: ${data.season.currentMatchday}</p>
                    </div>
                  </div>
                </div>
              <div class="col m3 l4"></div>
              `;

            data.standings[0].table.forEach(dataTeam => {
              let urlTeamImage = dataTeam.team.crestUrl;
              if (urlTeamImage == null || urlTeamImage == '') {
                urlTeamImage = 'img/liga/404.png';
              } else {
                urlTeamImage = urlTeamImage.replace(/^http:\/\//i, 'https://');
              }
              standingsHTML +=
                `
              <tr>
              <td>${dataTeam.position}<br />&nbsp;</td>
              <td>
                <a href="./team.html?id=${dataTeam.team.id}">
                <img src="${urlTeamImage}" alt="${dataTeam.team.name}" class="responsive-img" style="height:30px">
                </a>
              </td>
              <td>
                <a href="./team.html?id=${dataTeam.team.id}">
                  ${dataTeam.team.name}
                </a><br />&nbsp;
              </td>
              <td>${dataTeam.playedGames}<br />&nbsp;</td>
              <td>${dataTeam.won}<br />&nbsp;</td>
              <td>${dataTeam.draw}<br />&nbsp;</td>
              <td>${dataTeam.lost}<br />&nbsp;</td>
              <td>${dataTeam.goalsFor}<br />&nbsp;</td>
              <td>${dataTeam.goalsAgainst}<br />&nbsp;</td>
              <td>${dataTeam.goalDifference}<br />&nbsp;</td>
              <td>${dataTeam.points}<br />&nbsp;</td>
              </tr>
            `;
            });
          }
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("standings").innerHTML = standingsHTML;
          document.getElementById("leagues").innerHTML = leagueHTML;
        })
      }
    })
  }
  fetchApi(base_url + "competitions/" + idParam + "/standings")
    .then(status)
    .then(json)
    .then(function (data) {
      let standingsHTML = "";
      let leagueHTML = "";
      if (data.competition.id == 2018 || data.competition.id == 2000) {
        leagueHTML += `
              <div class="col m3 l4"></div>
                <div class="col s12 m6 l4">
                  <div class="card grey darken-4">
                    <div class="white card-image waves-effect waves-block waves-light">
                      <img src="img/liga/${data.competition.code}.png" />
                    </div>
                    <hr>
                    <div class="card-content">
                      <span class="truncate"><b>${data.competition.name}</b></span>
                      <p>${data.competition.area.name}</p>
                      <hr>
                      <p>Kode Liga: ${data.competition.code}</p>
                      <p>Mulai: ${data.season.startDate}</p>
                      <p>Berakhir: ${data.season.endDate}</p>
                      <p>Pertandingan: ${data.season.currentMatchday}</p>
                    </div>
                  </div>
                </div>
              <div class="col m3 l4"></div>
              `;

        standingsHTML +=
          `
              <tr class="text-center">
                <td><br />&nbsp;</td>
                <td><br />&nbsp;</td>
                <td><br />&nbsp;</td>
                <td><br />&nbsp;</td>
                <td>
                  <h6><b>Data Kosong</b></h6>
                </td>
                <td><br />&nbsp;</td>
                <td><br />&nbsp;</td>
                <td><br />&nbsp;</td>
                <td><br />&nbsp;</td>
                <td><br />&nbsp;</td>
                <td><br />&nbsp;</td>
              </tr>
            `;
      } else {
        leagueHTML += `
              <div class="col m3 l4"></div>
                <div class="col s12 m6 l4">
                  <div class="card grey darken-4">
                    <div class="white card-image waves-effect waves-block waves-light">
                      <img src="img/liga/${data.competition.code}.png" />
                    </div>
                    <hr>
                    <div class="card-content">
                      <span class="truncate"><b>${data.competition.name}</b></span>
                      <p>${data.competition.area.name}</p>
                      <hr>
                      <p>Kode Liga: ${data.competition.code}</p>
                      <p>Mulai: ${data.season.startDate}</p>
                      <p>Berakhir: ${data.season.endDate}</p>
                      <p>Pertandingan: ${data.season.currentMatchday}</p>
                    </div>
                  </div>
                </div>
              <div class="col m3 l4"></div>
              `;

        data.standings[0].table.forEach(dataTeam => {
          let urlTeamImage = dataTeam.team.crestUrl;
          if (urlTeamImage == null || urlTeamImage == '') {
            urlTeamImage = 'img/liga/404.png';
          } else {
            urlTeamImage = urlTeamImage.replace(/^http:\/\//i, 'https://');
          }
          standingsHTML +=
            `
              <tr>
              <td>${dataTeam.position}<br />&nbsp;</td>
              <td>
                <a href="./team.html?id=${dataTeam.team.id}">
                <img src="${urlTeamImage}" alt="${dataTeam.team.name}" class="responsive-img" style="height:30px">
                </a>
              </td>
              <td>
                <a href="./team.html?id=${dataTeam.team.id}">
                  ${dataTeam.team.name}
                </a><br />&nbsp;
              </td>
              <td>${dataTeam.playedGames}<br />&nbsp;</td>
              <td>${dataTeam.won}<br />&nbsp;</td>
              <td>${dataTeam.draw}<br />&nbsp;</td>
              <td>${dataTeam.lost}<br />&nbsp;</td>
              <td>${dataTeam.goalsFor}<br />&nbsp;</td>
              <td>${dataTeam.goalsAgainst}<br />&nbsp;</td>
              <td>${dataTeam.goalDifference}<br />&nbsp;</td>
              <td>${dataTeam.points}<br />&nbsp;</td>
              </tr>
            `;
        });
      }
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("standings").innerHTML = standingsHTML;
      document.getElementById("leagues").innerHTML = leagueHTML;
    });
}

function getTeam() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    if ('caches' in window) {
      caches.match(base_url + "teams/" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            // console.log(data);
            let squadHTML = "";
            let teamHTML = "";

            let logoTeam = data.crestUrl;
            if (logoTeam == null || logoTeam == '') {
              logoTeam = 'img/liga/404.png';
            } else {
              logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
            }

            teamHTML += `
            <div class="col m3"></div>
              <div class="col s12 m6">
                <div class="card grey darken-4">
                  <div class="row">
                    <div class="col s2"></div>
                    <div class="col s8 card-image waves-effect waves-block waves-light">
                      <img src="${logoTeam}" />
                    </div>
                    <div class="col s2"></div>
                  </div>
                  <hr>
                  <div class="card-content">
                    <span class="truncate"><b>${data.name} (${data.tla})</b></span>
                    <a href="${data.website}" target="_blank">  
                      <p>${data.website}</p>
                    </a>
                    <hr>
                    <p>Berdiri: ${data.founded}</p>
                    <p>Stadion: ${data.venue}</p>
                    <p>Warna: ${data.clubColors}</p>
                    <p>E-mail: ${data.email}</p>
                    <p>Telepon: ${data.phone}</p>
                    <p>Alamat: ${data.address}</p>
                  </div>
                </div>
              </div>
            <div class="col m3"></div>
          `;

            data.squad.forEach(dataSquad => {
              squadHTML +=
                `
                <li class="collection-item avatar">
                  <div class="grey darken-4 collapsible-header">
                    <i class="material-icons">person</i>
                    ${dataSquad.name}
                  </div>
                  <div class="grey darken-4 collapsible-body">
                    <h5>${dataSquad.name}</h5>
                    <p>Posisi       : ${dataSquad.position}</p>
                    <p>TTL          : ${dataSquad.countryOfBirth}, ${dataSquad.dateOfBirth}</p>
                    <p>Kebangsaan   : ${dataSquad.nationality}</p>
                    <p>No. Punggung : ${dataSquad.shirtNumber}</p>
                    <p>Peran        : ${dataSquad.role}</p>
                  </div>
                </li>
              `;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("squad").innerHTML = squadHTML;
            document.getElementById("team").innerHTML = teamHTML;

            resolve(data);
          });
        }
      })
    }
    fetchApi(base_url + "teams/" + idParam)
      .then(status)
      .then(json)
      .then(function (data) {
        let squadHTML = "";
        let teamHTML = "";

        let logoTeam = data.crestUrl;
        if (logoTeam == null || logoTeam == '') {
          logoTeam = 'img/liga/404.png';
        } else {
          logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
        }

        teamHTML += `
        <div class="col m3"></div>
          <div class="col s12 m6">
            <div class="card grey darken-4">
              <div class="row">
                <div class="col s2"></div>
                <div class="col s8 card-image waves-effect waves-block waves-light">
                  <img src="${logoTeam}" />
                </div>
                <div class="col s2"></div>
              </div>
              <hr>
              <div class="card-content">
                <span class="truncate"><b>${data.name} (${data.tla})</b></span>
                <a href="${data.website}" target="_blank">  
                  <p>${data.website}</p>
                </a>
                <hr>
                <p>Berdiri: ${data.founded}</p>
                <p>Stadion: ${data.venue}</p>
                <p>Warna: ${data.clubColors}</p>
                <p>E-mail: ${data.email}</p>
                <p>Telepon: ${data.phone}</p>
                <p>Alamat: ${data.address}</p>
              </div>
            </div>
          </div>
        <div class="col m3"></div>
        `;

        data.squad.forEach(dataSquad => {
          squadHTML +=
            `
          <li class="collection-item avatar">
            <div class="grey darken-4 collapsible-header">
              <i class="material-icons">person</i>
              ${dataSquad.name}
            </div>
            <div class="grey darken-4 collapsible-body">
              <h5>${dataSquad.name}</h5>
              <p>Posisi       : ${dataSquad.position}</p>
              <p>TTL          : ${dataSquad.countryOfBirth}, ${dataSquad.dateOfBirth}</p>
              <p>Kebangsaan   : ${dataSquad.nationality}</p>
              <p>No. Punggung : ${dataSquad.shirtNumber}</p>
              <p>Peran        : ${dataSquad.role}</p>
            </div>
        </li>
          `;
        });
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("squad").innerHTML = squadHTML;
        document.getElementById("team").innerHTML = teamHTML;

        resolve(data);
      });
  });
}

function getLastMatch() {
  // Ambil nilai query parameter (?id=)
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");

  if ('caches' in window) {
    caches.match(base_url + "teams/" + idParam + "/matches?status=FINISHED").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          let lastMatchHTML = "";

          let lastMatch = data.matches[data.matches.length - 1];
          let ts = new Date(lastMatch.utcDate);
          const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
          };

          function getLogoHome(id) {
            caches.match(base_url + "teams/" + id).then(function (response) {
              if (response) {
                response.json().then(function (data) {
                  let cek = '';
                  let logoTeam = data.crestUrl;
                  if (logoTeam == null || logoTeam == '') {
                    logoTeam = 'img/liga/404.png';
                  } else {
                    logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
                  }

                  cek += `
                  <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
                  <br>
                  ${data.name}
                `;

                  document.getElementById("home").innerHTML = cek;
                })
              }
            })
            fetchApi(base_url + "teams/" + id)
              .then(status)
              .then(json)
              .then(function (data) {

                let cek = '';
                let logoTeam = data.crestUrl;
                if (logoTeam == null || logoTeam == '') {
                  logoTeam = 'img/liga/404.png';
                } else {
                  logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
                }

                cek += `
                  <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
                  <br>
                  ${data.name}
                `;

                document.getElementById("home").innerHTML = cek;
              });
          }

          function getLogoAway(id) {
            caches.match(base_url + "teams/" + id).then(function (response) {
              if (response) {
                response.json().then(function (data) {
                  let cek = '';
                  let logoTeam = data.crestUrl;
                  if (logoTeam == null || logoTeam == '') {
                    logoTeam = 'img/liga/404.png';
                  } else {
                    logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
                  }

                  cek += `
                  <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
                  <br>
                  ${data.name}
                `;

                  document.getElementById("away").innerHTML = cek;
                })
              }
            })
            fetchApi(base_url + "teams/" + id)
              .then(status)
              .then(json)
              .then(function (data) {

                let cek = '';
                let logoTeam = data.crestUrl;
                if (logoTeam == null || logoTeam == '') {
                  logoTeam = 'img/liga/404.png';
                } else {
                  logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
                }

                cek += `
                  <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
                  <br>
                  ${data.name}
                `;

                document.getElementById("away").innerHTML = cek;
              });
          }

          getLogoHome(lastMatch.homeTeam.id);
          getLogoAway(lastMatch.awayTeam.id);

          lastMatchHTML += `
            <div class="row grey darken-4 collapsible-header valign-wrapper" style="margin:0px;">
                <div class="col s12 m5 center-align" id="home">
                </div>
                <div class="col s12 m2 center-align">
                    <p>${lastMatch.score.fullTime.homeTeam} - ${lastMatch.score.fullTime.awayTeam}</p>
                </div>
                <div class="col s12 m5 center-align" id="away">
                </div>
            </div>
            <div class="grey darken-4 collapsible-body center-align">
                <h6><b>${lastMatch.competition.name}</b></h6>
                <p>${ts.toLocaleDateString('en-GB', options)}</p>
                <p>wasit - ${lastMatch.referees[0].name}</p>
            </div>
          `;
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("last-match").innerHTML = lastMatchHTML;
        })
      }
    })
  }
  fetchApi(base_url + "teams/" + idParam + "/matches?status=FINISHED")
    .then(status)
    .then(json)
    .then(function (data) {
      let lastMatchHTML = "";

      let lastMatch = data.matches[data.matches.length - 1];
      let ts = new Date(lastMatch.utcDate);
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
      };

      function getLogoHome(id) {
        caches.match(base_url + "teams/" + id).then(function (response) {
          if (response) {
            response.json().then(function (data) {
              let cek = '';
              let logoTeam = data.crestUrl;
              if (logoTeam == null || logoTeam == '') {
                logoTeam = 'img/liga/404.png';
              } else {
                logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
              }

              cek += `
              <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
              <br>
              ${data.name}
            `;

              document.getElementById("home").innerHTML = cek;
            })
          }
        })
        fetchApi(base_url + "teams/" + id)
          .then(status)
          .then(json)
          .then(function (data) {

            let cek = '';
            let logoTeam = data.crestUrl;
            if (logoTeam == null || logoTeam == '') {
              logoTeam = 'img/liga/404.png';
            } else {
              logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
            }

            cek += `
              <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
              <br>
              ${data.name}
            `;

            document.getElementById("home").innerHTML = cek;
          });
      }

      function getLogoAway(id) {
        caches.match(base_url + "teams/" + id).then(function (response) {
          if (response) {
            response.json().then(function (data) {
              let cek = '';
              let logoTeam = data.crestUrl;
              if (logoTeam == null || logoTeam == '') {
                logoTeam = 'img/liga/404.png';
              } else {
                logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
              }

              cek += `
              <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
              <br>
              ${data.name}
            `;

              document.getElementById("away").innerHTML = cek;
            })
          }
        })
        fetchApi(base_url + "teams/" + id)
          .then(status)
          .then(json)
          .then(function (data) {

            let cek = '';
            let logoTeam = data.crestUrl;
            if (logoTeam == null || logoTeam == '') {
              logoTeam = 'img/liga/404.png';
            } else {
              logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
            }

            cek += `
              <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
              <br>
              ${data.name}
            `;

            document.getElementById("away").innerHTML = cek;
          });
      }

      getLogoHome(lastMatch.homeTeam.id);
      getLogoAway(lastMatch.awayTeam.id);

      lastMatchHTML += `
        <div class="row grey darken-4 collapsible-header valign-wrapper" style="margin:0px;">
            <div class="col s12 m5 center-align" id="home">
            </div>
            <div class="col s12 m2 center-align">
                <p>${lastMatch.score.fullTime.homeTeam} - ${lastMatch.score.fullTime.awayTeam}</p>
            </div>
            <div class="col s12 m5 center-align" id="away">
            </div>
        </div>
        <div class="grey darken-4 collapsible-body center-align">
            <h6><b>${lastMatch.competition.name}</b></h6>
            <p>${ts.toLocaleDateString('en-GB', options)}</p>
            <p>wasit - ${lastMatch.referees[0].name}</p>
        </div>
      `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("last-match").innerHTML = lastMatchHTML;
    });
}

function getNextMatch() {
  // Ambil nilai query parameter (?id=)
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");

  if ('caches' in window) {
    caches.match(base_url + "teams/" + idParam + "/matches?status=SCHEDULED").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          let nextMatchHTML = "";

          let nextMatch = data.matches[0];
          let ts = new Date(nextMatch.utcDate);
          const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
          };
          // console.log(ts.toLocaleDateString('us-US', options));

          function getHome(id) {
            caches.match(base_url + "teams/" + id).then(function (response) {
              if (response) {
                response.json().then(function (data) {
                  let cek = '';
                  let logoTeam = data.crestUrl;
                  if (logoTeam == null || logoTeam == '') {
                    logoTeam = 'img/liga/404.png';
                  } else {
                    logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
                  }

                  cek += `
                  <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
                  <br>
                  ${data.name}
                `;

                  document.getElementById("next-home").innerHTML = cek;
                })
              }
            })
            fetchApi(base_url + "teams/" + id)
              .then(status)
              .then(json)
              .then(function (data) {

                let cek = '';
                let logoTeam = data.crestUrl;
                if (logoTeam == null || logoTeam == '') {
                  logoTeam = 'img/liga/404.png';
                } else {
                  logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
                }

                cek += `
                  <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
                  <br>
                  ${data.name}
                `;

                document.getElementById("next-home").innerHTML = cek;
              });
          }

          function getAway(id) {
            caches.match(base_url + "teams/" + id).then(function (response) {
              if (response) {
                response.json().then(function (data) {
                  let cek = '';
                  let logoTeam = data.crestUrl;
                  if (logoTeam == null || logoTeam == '') {
                    logoTeam = 'img/liga/404.png';
                  } else {
                    logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
                  }

                  cek += `
                  <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
                  <br>
                  ${data.name}
                `;

                  document.getElementById("next-away").innerHTML = cek;
                })
              }
            })
            fetchApi(base_url + "teams/" + id)
              .then(status)
              .then(json)
              .then(function (data) {

                let cek = '';
                let logoTeam = data.crestUrl;
                if (logoTeam == null || logoTeam == '') {
                  logoTeam = 'img/liga/404.png';
                } else {
                  logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
                }

                cek += `
                  <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
                  <br>
                  ${data.name}
                `;

                document.getElementById("next-away").innerHTML = cek;
              });
          }

          getHome(nextMatch.homeTeam.id);
          getAway(nextMatch.awayTeam.id);

          nextMatchHTML += `
            <div class="row grey darken-4 collapsible-header valign-wrapper" style="margin:0px;">
                <div class="col s12 m5 center-align" id="next-home">
                </div>
                <div class="col s12 m2 center-align">
                    <p> vs </p>
                </div>
                <div class="col s12 m5 center-align" id="next-away">
                </div>
            </div>
            <div class="grey darken-4 collapsible-body center-align">
                <h6><b>${nextMatch.competition.name}</b></h6>
                <p>${ts.toLocaleDateString('en-GB', options)}</p>
            </div>
          `;
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("next-match").innerHTML = nextMatchHTML;
        })
      }
    })
  }
  fetchApi(base_url + "teams/" + idParam + "/matches?status=SCHEDULED")
    .then(status)
    .then(json)
    .then(function (data) {
      let nextMatchHTML = "";

      let nextMatch = data.matches[0];
      let ts = new Date(nextMatch.utcDate);
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
      };

      function getHome(id) {
        caches.match(base_url + "teams/" + id).then(function (response) {
          if (response) {
            response.json().then(function (data) {
              let cek = '';
              let logoTeam = data.crestUrl;
              if (logoTeam == null || logoTeam == '') {
                logoTeam = 'img/liga/404.png';
              } else {
                logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
              }

              cek += `
              <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
              <br>
              ${data.name}
            `;

              document.getElementById("next-home").innerHTML = cek;
            })
          }
        })
        fetchApi(base_url + "teams/" + id)
          .then(status)
          .then(json)
          .then(function (data) {

            let cek = '';
            let logoTeam = data.crestUrl;
            if (logoTeam == null || logoTeam == '') {
              logoTeam = 'img/liga/404.png';
            } else {
              logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
            }

            cek += `
              <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
              <br>
              ${data.name}
            `;

            document.getElementById("next-home").innerHTML = cek;
          });
      }

      function getAway(id) {
        caches.match(base_url + "teams/" + id).then(function (response) {
          if (response) {
            response.json().then(function (data) {
              let cek = '';
              let logoTeam = data.crestUrl;
              if (logoTeam == null || logoTeam == '') {
                logoTeam = 'img/liga/404.png';
              } else {
                logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
              }

              cek += `
              <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
              <br>
              ${data.name}
            `;

              document.getElementById("next-away").innerHTML = cek;
            })
          }
        })
        fetchApi(base_url + "teams/" + id)
          .then(status)
          .then(json)
          .then(function (data) {

            let cek = '';
            let logoTeam = data.crestUrl;
            if (logoTeam == null || logoTeam == '') {
              logoTeam = 'img/liga/404.png';
            } else {
              logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
            }

            cek += `
              <img src="${logoTeam}" alt="" class="responsive-img" style="width: 50px;">
              <br>
              ${data.name}
            `;

            document.getElementById("next-away").innerHTML = cek;
          });
      }

      getHome(nextMatch.homeTeam.id);
      getAway(nextMatch.awayTeam.id);

      nextMatchHTML += `
        <div class="row grey darken-4 collapsible-header valign-wrapper" style="margin:0px;">
            <div class="col s12 m5 center-align" id="next-home">
            </div>
            <div class="col s12 m2 center-align">
                <p> vs </p>
            </div>
            <div class="col s12 m5 center-align" id="next-away">
            </div>
        </div>
        <div class="grey darken-4 collapsible-body center-align">
            <h6><b>${nextMatch.competition.name}</b></h6>
            <p>${ts.toLocaleDateString('en-GB', options)}</p>
        </div>
      `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("next-match").innerHTML = nextMatchHTML;
    });
}

function getSavedTeam() {
  getAllFavTeam().then(function (teams) {
    // console.log(teams);
    // Menyusun komponen card artikel secara dinamis
    let teamHTML = "";
    teams.forEach(function (data) {

      let logoTeam = data.crestUrl;
      if (logoTeam == null || logoTeam == '') {
        logoTeam = 'img/liga/404.png';
      } else {
        logoTeam = logoTeam.replace(/^http:\/\//i, 'https://');
      }

      teamHTML += `
        <div class="row" >
          <div class="col m4"></div>
            <div class="col s12 m4">
            <blockquote class="black-text">Click logo to see details</blockquote>
              <div class="card grey darken-4">
                <div class="row">
                  <a href="./team.html?id=${data.id}">
                    <div class="col s2"></div>
                      <div class="col s8 card-image waves-effect waves-block waves-light">
                        <img src="${logoTeam}" />
                      </div>
                    <div class="col s2"></div>
                  </a>
                </div>
                <hr>
                <div class="card-content">
                  <span class="truncate"><b>${data.name} (${data.tla})</b></span>
                  <a href="${data.website}" target="_blank">  
                    <p>${data.website}</p>
                  </a>
                  <hr>
                  <p>Berdiri: ${data.founded}</p>
                  <p>Stadion: ${data.venue}</p>
                  <p>Warna: ${data.clubColors}</p>
                  <p>E-mail: ${data.email}</p>
                  <p>Telepon: ${data.phone}</p>
                  <p>Alamat: ${data.address}</p>
                </div>
              </div>
            </div>
          <div class="col m4"></div>
        </div>
        `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("team-fav").innerHTML = teamHTML;
  });
}