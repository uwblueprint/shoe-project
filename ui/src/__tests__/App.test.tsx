import {
  isTimestampExpired,
  setTimeStamp,
  tutorialKey,
} from "../components/helpers/welcomeTutorialFunctions";

describe("Welcome Tutorial", () => {
  it("Should store current date in local storage", async () => {
    localStorage.removeItem(tutorialKey);
    const mockFunc = jest.fn();
    mockFunc(setTimeStamp());
    const timestamp = localStorage.getItem(tutorialKey);

    expect(JSON.parse(timestamp).expiry).toBeDefined;
  });

  it("Should change the timestamp after 5 seconds", (done) => {
    const oldTimestamp = localStorage.getItem(tutorialKey);
    expect(JSON.parse(oldTimestamp).expiry).toBeDefined;
    let newTimestamp = "";

    setTimeout(() => {
      const result = isTimestampExpired(2000);
      expect(result).toBe(true);
      done();
      newTimestamp = localStorage.getItem(tutorialKey);
    }, 5000);

    expect(newTimestamp).not.toBe(oldTimestamp);
  });

  it("Should not change the timestamp if the timestamp has not expired", (done) => {
    const oldTimestamp = localStorage.getItem(tutorialKey);
    expect(JSON.parse(oldTimestamp).expiry).toBeDefined;

    setTimeout(() => {
      const result = isTimestampExpired(5000);
      expect(result).toBe(false);
      done();
      const newTimestamp = localStorage.getItem(tutorialKey);
      expect(newTimestamp).toEqual(oldTimestamp);
    }, 2000);
  });
});
