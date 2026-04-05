(function () {
  const board = document.getElementById("contributors-board");
  if (!board) {
    return;
  }

  const founderLogin = board.dataset.founder || "AHADBAVA";
  const repo = board.dataset.repo || "Wevoa/Wevoa";
  const headers = {
    Accept: "application/vnd.github+json"
  };

  function commitLabel(count) {
    return count === 1 ? "1 commit" : count + " commits";
  }

  function contributorCard(contributor) {
    const article = document.createElement("article");
    article.className = "contributor-card";

    const avatar = document.createElement("img");
    avatar.className = "contributor-avatar";
    avatar.src = contributor.avatar_url;
    avatar.alt = contributor.name + " avatar";
    article.appendChild(avatar);

    const copy = document.createElement("div");
    copy.className = "contributor-copy";

    const meta = document.createElement("div");
    meta.className = "contributor-meta";

    const role = document.createElement("p");
    role.className = "card-label";
    role.textContent = contributor.role;
    meta.appendChild(role);

    const rank = document.createElement("p");
    rank.className = "contributor-rank";
    rank.textContent = contributor.rank;
    meta.appendChild(rank);

    copy.appendChild(meta);

    const name = document.createElement("h3");
    name.textContent = contributor.name;
    copy.appendChild(name);

    const handle = document.createElement("p");
    handle.className = "contributor-handle";
    handle.textContent = "@" + contributor.login;
    copy.appendChild(handle);

    const commits = document.createElement("p");
    commits.className = "contributor-commits";
    commits.textContent = commitLabel(contributor.contributions);
    copy.appendChild(commits);

    const summary = document.createElement("p");
    summary.textContent = contributor.summary;
    copy.appendChild(summary);

    const note = document.createElement("p");
    note.className = "contributor-note";
    note.textContent = contributor.note;
    copy.appendChild(note);

    const link = document.createElement("a");
    link.className = "button-link";
    link.href = contributor.profile_url;
    link.textContent = "View GitHub profile";
    copy.appendChild(link);

    article.appendChild(copy);
    return article;
  }

  function renderError(message) {
    board.innerHTML = "";
    const card = document.createElement("div");
    card.className = "content-card";
    card.innerHTML =
      '<p class="card-label">Live data unavailable</p>' +
      "<h3>Contributor data could not be loaded right now.</h3>" +
      "<p>" + message + "</p>";
    board.appendChild(card);
  }

  Promise.all([
    fetch("https://api.github.com/repos/" + repo + "/contributors", { headers: headers }),
    fetch("https://api.github.com/users/" + founderLogin, { headers: headers })
  ])
    .then(function (responses) {
      return Promise.all(responses.map(function (response) {
        if (!response.ok) {
          throw new Error("GitHub API returned " + response.status + ".");
        }
        return response.json();
      }));
    })
    .then(function (payloads) {
      const contributors = Array.isArray(payloads[0]) ? payloads[0] : [];
      const founderProfile = payloads[1] || {};
      const founderRepo = contributors.find(function (entry) {
        return entry.login === founderLogin;
      });

      const ranked = [];

      if (founderProfile.login || founderRepo) {
        ranked.push({
          rank: "#1",
          role: "Founder",
          login: founderLogin,
          name: founderProfile.name || founderLogin,
          avatar_url: founderProfile.avatar_url || (founderRepo ? founderRepo.avatar_url : ""),
          profile_url: founderProfile.html_url || (founderRepo ? founderRepo.html_url : "https://github.com/" + founderLogin),
          contributions: founderRepo ? founderRepo.contributions : 0,
          summary: "Pinned at the top of the official contributor board. Founder details stay first while the rest are ranked by repo commits.",
          note: "Live GitHub data with founder priority enabled"
        });
      }

      contributors
        .filter(function (entry) {
          return entry.login !== founderLogin;
        })
        .forEach(function (entry, index) {
          ranked.push({
            rank: "#" + (index + 2),
            role: "Contributor",
            login: entry.login,
            name: entry.login,
            avatar_url: entry.avatar_url,
            profile_url: entry.html_url,
            contributions: entry.contributions || 0,
            summary: "Ranked live from the Wevoa repository contributors list by public commit count.",
            note: "Fetched live from github.com/" + repo
          });
        });

      if (ranked.length === 0) {
        throw new Error("GitHub did not return any contributors.");
      }

      board.innerHTML = "";
      ranked.forEach(function (entry) {
        board.appendChild(contributorCard(entry));
      });
    })
    .catch(function (error) {
      renderError(error.message || "GitHub API is temporarily unavailable.");
    });
})();
