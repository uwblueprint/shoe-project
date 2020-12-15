export const tutorialKey = "tutorial_timestamp";

export function setTimeStamp(): void {
  const dateItem = {
    value: "value",
    expiry: new Date().getTime(),
  };
  localStorage.setItem(tutorialKey, JSON.stringify(dateItem));
}

export function isTimestampExpired(totalTimeout: number): boolean {
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
