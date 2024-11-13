#!/usr/bin/env node
const username = process.argv[2];
if (!username) {
  console.log("Enter username");
}

async function getEvent() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events`,
      {
        method: "GET",
      }
    );
    if (response.status === 404) {
      console.log("No user found with username: " + username);
      return;
    }
    const json = await response.json();
    let events = new Map();
    json.forEach((event) => {
      const key = JSON.stringify({ type: event.type, repo: event.repo.name });
      if (events.has(key)) {
        events.set(key, events.get(key) + 1);
      } else {
        events.set(key, 1);
      }
    });
    for (let [key, value] of events) {
      const myObject = JSON.parse(key);
      const type = myObject.type;
      const repoName = myObject.repo;
      switch (type) {
        case "WatchEvent":
          console.log(`Starred ${repoName}`);
          break;
        case "PushEvent":
          console.log(`Pushed ${value} commits to ${repoName}`);
          break;
        case "CreateEvent":
          console.log(`${value} new repository, branch, or tag is created`);
          break;
        case "ForkEvent":
          console.log(`${repoName} forked`);
          break;
        case "MemberEvent":
          console.log(`${value} new contributors added to ${repoName}`);
          break;
        case "IssueEvent":
          console.log(`Opened a new issue in ${repoName}`);
          break;
        case "PublicEvent":
          console.log(`${repoName} has been made public`);
          break;
        default:
          console.log(`Unknown event type: ${type}`);
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
}

getEvent();
