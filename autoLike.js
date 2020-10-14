const users = {
  demo: { username: "DEMO USER", password: "AliyevEatsDonkeyAss" }, //enter credentials here
};

const hashtags = {
  artStrong: "#ArtsakhStrong",
  artIsArm: "#ArtsakhIsArmenia",
  stopAli: "#StopAliyev",
  sancAzer: "#SanctionAzerbaijan",
  sancTurk: "#SanctionTurkey",
  recArt: "#RecognizeArtsakh",
  arm: "#Armenia",
  believe: "#BelieveArmenia",
  azeriLies: "#AzerbaijanLies",
};

const puppeteer = require("puppeteer");
const username = 'Adam Melks'; //specify user here
const password = '$kake-geradzek!735'; //and here
// const username = users.demo.username; //specify user here
// const password = users.demo.password; //and here

let browser = null;
let page = null;

try {
  (async () => {
    browser = await puppeteer.launch({ headless: false });

    page = await browser.newPage();
    page.setViewport({
      width: 1280,
      height: 800,
      isMobile: false,
    });

    await page.goto("https://facebook.com/login", {
      waitUntil: "networkidle2",
    });

    //LOGIN
    await page.type('input[id="email"]', username, { delay: 25 });
    await page.type('input[id="pass"]', password, { delay: 25 });
    await page.click('button[id="loginbutton"]');

    //NAVIGATE TO POST AND OPEN COMMENTS
    await page.waitFor(2000);
    await page.goto("https://www.facebook.com/watch/?v=401016897697280");
    await page.waitFor(2000);
    await page.keyboard.press("Escape");
    try {
      await page.click('div[class="pfnyh3mw j83agx80 bp9cbjyn"]');
    } catch {
      console.log("View Comments Error");
    }
    await page.waitFor('div[role = "article"]');

    //CLICK 'See More Comments' i TIMES
    var seeMoreComments;
    for (let i = 0; i < 10; i++) {
      //iterates over entire post i times
      seeMoreComments = await page.$$(
        'span[class="j83agx80 fv0vnmcu hpfvmrgz"]'
      ); //grabs the 'see more comments' button

      var idx = seeMoreComments.length - 1;
      try {
        await seeMoreComments[idx].click();
        await page.waitFor(2000);
      } catch {
        console.log("'See More Comments' error");
      }
    }

    //EXPAND ALL COMMENTS
    var j = 0; //comment counter
    const comments = await page.$$('div[role="article"]');
    while (comments.length > j) {
      //makes sure we process all new comments revealed after clicking 'see more comments'
      const buttons = await comments[j].$$('div[role="button"]');
      const buttonsProperties = await Promise.all(
        buttons.map((button) => button.getProperty("innerText"))
      );
      const buttonsJSON = await Promise.all(
        buttonsProperties.map((prop) => prop.jsonValue())
      );

      for (let k = 0; k < buttons.length; k++) {
        //iterates over each comments buttons looking for 'See More'
        if (buttonsJSON[k] === "See More") {
          try {
            await buttons[k].click();
            await page.waitFor(300);
          } catch {
            console.log("Expanding Comments Error");
          }
        }
      }
      j++;
    }

    //LIKE ALL COMMENTS WITH OUR #
    j = 0; //reset comment counter
    var likedCount = 0;
    while (comments.length > j) {
      console.log(j);
      console.log(comments.length);
      const comment = comments[j];
      const elementText = await comment.getProperty("innerText");
      const innerText = await elementText.jsonValue();
      const textArr = innerText.split(" ");
      // console.log(textArr);
      const regex = new RegExp('#recognizeartsakh', 'gi');

      if (
        textArr.some((word) => !!word.match(regex)) 
      ) {
        await page.waitFor(1000);
        console.log("BINGO");
        try {
          var like = await comment.$$('div[aria-label="Like"]');
          if (like.length === 0) like = await comment.$$('a[aria-label="Like"]')
          if (like.length > 0) { //make sure the node exists (aka we haven't already liked)
            console.log("!");
            await like[0].click();
            await page.waitFor(1000);
            likedCount++;
          }
        } catch (e) {
          console.log(e);
        }
      }
      console.log("---");
      j++;
    }
    console.log(`finished liking ${likedCount + (likedCount === 1 ? ' comment' : ' comments')}`);
  })();
} catch (e) {
  console.log(e);
}
