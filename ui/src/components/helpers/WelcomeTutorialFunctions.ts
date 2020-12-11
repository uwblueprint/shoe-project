const tutorialKey = "tutorial_timestamp";

function setTimeStamp() {
  const dateItem = {
    value: "value",
    expiry: new Date().getTime(),
  };
  localStorage.setItem(tutorialKey, JSON.stringify(dateItem));
}

function checkIfValidTimestamp(totalTimeout) {
  const oldTimestampStr = localStorage.getItem(tutorialKey);
  if (!oldTimestampStr) {
    setTimeStamp();
    return true;
  }
  const oldTimestamp = JSON.parse(oldTimestampStr);
  const curTimestamp = new Date();
  if (curTimestamp.getTime() - oldTimestamp.expiry > totalTimeout) {
    localStorage.removeItem(tutorialKey);
    setTimeStamp();
    return true;
  }
  return false;
}

const welcomeTutorialFunctions = {
  tutorialKey,
  setTimeStamp,
  checkIfValidTimestamp,
};

export default welcomeTutorialFunctions;
