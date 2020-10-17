const users = {
  0: { username: "demo@user.com", password: "123456" }, //input credentials here
  1: { username: "demo@user.com", password: "123456" }, //every account added to this object will be run
};


const targetUrl = 'https://www.facebook.com/watch/?ref=search&v=257467945464976&external_log_id=1deb1a71-6fce-40c2-af62-4d257f1659b4&q=kittens'; //input url of target post here

//after completing above inputs you may now run autoLike.js 

const regexHashes = [
  new RegExp("#recognizeartsa", "gi"),
  new RegExp("#sanctionturk", "gi"),
  new RegExp("#stopazer", "gi"),
  new RegExp("#stopaliyev", "gi"),
  new RegExp("#stoperdo", "gi"),
  new RegExp("#stopturkey", "gi"),
  new RegExp("#artsakhstrong", "gi"),
];

const trickTrapsPro = [
  new RegExp("kh is arm", "gi"),
  new RegExp("stop aliyev", "gi"),
  new RegExp("stop azer", "gi"),
  new RegExp("stop erdog", "gi"),
  new RegExp("stop turkey", "gi"),
  new RegExp("ancestral homeland", "gi"),
  new RegExp("i stand with arm", "gi"),
];

const trickTrapsCon = [
  new RegExp("kh is az", "gi"),
  new RegExp("khojaly", "gi"),
  new RegExp("occupied territories", "gi"),
  new RegExp("not disput", "gi"),
  new RegExp("armenian terror", "gi"),
  new RegExp("internationally rec", "gi"),
  new RegExp("not contest", "gi"),
  new RegExp("must withdraw", "gi"),
];

const flagExp = [
  new RegExp("🇦🇲", "gi"),
  new RegExp("🇦🇿", "gi"),
  new RegExp("🇹🇷", "gi"),
];

const flagCheck = (com) => {
  var armoFlag = false;
  var azeriFlag = false;
  var turkFlag = false;

  if (com.match(flagExp[0])) armoFlag = true;
  if (com.match(flagExp[1])) azeriFlag = true;
  if (com.match(flagExp[2])) turkFlag = true;

  if (armoFlag && (azeriFlag || turkFlag)) return -1;
  if (azeriFlag || turkFlag) return -2;
  if (armoFlag) return 1;
  return 0;
};

const containsHash = (com) => {
  return regexHashes.some((regex) => com.match(regex));
};

const trickerTraper = (com) => {
  if (trickTrapsCon.some((trick) => com.match(trick))) return false;
  if (trickTrapsPro.some((trick) => com.match(trick))) return true;
};

const nameCheck = (name) => {
  if (!name) return false;
  lastThree = name.slice(name.length - 3);
  if (lastThree === "ian" || lastThree === "yan") return true;
};

const isProArmenian = (com) => { 
  //here we run through an obstacle course of judgement
  //we look at 1.flags 2.hashtags 3.phraseology and 4.commentors last name
  //if at any one of these stops we determine the comment is proArmenian we return true and the comment is liked
  var lastName = com.split('\n')[0].split(' ')[1];
  if (flagCheck(com) > 0) return true;
  if (containsHash(com)) return true;
  if (trickerTraper(com)) return true; //here sum magic ;)
  if (nameCheck(lastName)) return true; //good to b armo :) this function puts in WORK
  return false;
};

const puppeteer = require("puppeteer");

try {
  (async () => {
    for (let a = 0; a < Object.values(users).length; a++) {
      console.log(`initiating protocol for user ${users[a].username}`)
      let browser = null;
      let page = null;
      var username = users[a].username; 
      var password = users[a].password; 
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
      await page.type('input[id="email"]', username, { delay: 50 });
      await page.type('input[id="pass"]', password, { delay: 50 });
      await page.waitFor(1000);
      await page.click('button[id="loginbutton"]');
  
      //NAVIGATE TO TARGET POST AND OPEN COMMENTS
      await page.waitFor(6000);
      await page.goto(targetUrl, {waitUntil: 'load', timeout: 0});
      await page.waitFor(2000);
      await page.keyboard.press("Escape");
      try {
        await page.click('div[class="pfnyh3mw j83agx80 bp9cbjyn"]');
      } catch {
        console.log("View Comments Error");
      }
      await page.waitFor('div[class="l9j0dhe7 tkr6xdv7 buofh1pr eg9m0zos"]');
      await page.waitFor(1000);
  
      //CLICK 'See More Comments' i TIMES
      var seeMoreComments;
      
      const commentSpecifierBar = await page.$$('div[class="l6v480f0 pfnyh3mw kvgmc6g5 wkznzc2l oygrvhab dhix69tm j83agx80 bkfpd7mw"]');
      const commentSpecifier = await commentSpecifierBar[0].$$('div[role="button"]');
      const specifierProperty = await commentSpecifier[1].getProperty('innerText')
      const specifierValue = await specifierProperty.jsonValue();
      const oldest = new RegExp('oldest', 'gi')
      var options = false;

      if (specifierValue.match(oldest)) { //if comments are set to "Oldest" we must change them to "All Comments"
        await commentSpecifier[1].click()
        await page.waitFor(1000);
        const dropDown = await page.$$('div[data-testid="Keycommand_wrapper_ModalLayer"]');
        if (dropDown[1]) {
          options = await dropDown[1].$$('div[role="menuitem"]');
        }
        if (options) {
          options[2].click();
          await page.waitFor(1000);
        }
      }

      const posts = await page.$$('div[class="l9j0dhe7 tkr6xdv7 buofh1pr eg9m0zos"]');
      
      for (let i = 0; i < 20; i++) { //iterates over entire post i times
        seeMoreComments = await posts[0].$$('div[role="button"]'); //grabs buttons from first post
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
      while (comments.length > j) { //makes sure we process all new comments revealed after clicking 'see more comments'
        const buttons = await comments[j].$$('div[role="button"]');
        const buttonsProperties = await Promise.all(
          buttons.map((button) => button.getProperty("innerText"))
        );
        const buttonsJSON = await Promise.all(
          buttonsProperties.map((prop) => prop.jsonValue())
        );
  
        for (let k = 0; k < buttons.length; k++) { //iterates over each comments buttons looking for 'See More'
          if (buttonsJSON[k] === "See More") {
            try {
              await buttons[k].click();
              await page.waitFor(600);
            } catch {
              console.log("Expanding Comments Error");
            }
          }
        }
        j++;
      }
  
      //LIKE ALL COMMENTS THAT PASS isProArmenian()
      j = 0; //reset comment counter
      var likedCount = 0;

      while (comments.length > j) {
        console.log(`${j + 1}/${comments.length}`);
        const comment = comments[j];
        const elementText = await comment.getProperty("innerText");
        const innerText = await elementText.jsonValue();
        
        if (isProArmenian(innerText)) {
          await page.waitFor(2000);
          // console.log("BINGO");
          try {
            var like = await comment.$$('div[aria-label="Like"]'); //it can be a div
            if (like.length === 0)
              like = await comment.$$('a[aria-label="Like"]'); //or a link
            if (like.length > 0) { //make sure the node exists (aka we haven't already liked this comment and query selector came up empty)
              // console.log("!");
              await like[0].click();
              await page.waitFor(1000 + Math.floor(Math.random() * 3000));
              likedCount++;
            }
          } catch (e) {
            console.log(e);
          }
        }
        // console.log("---");
        j++;
      }
      console.log(`finished liking ${likedCount + (likedCount === 1 ? ' comment' : ' comments')} for ${username}`);
      browser.close();
    }})();
  } catch (e) {
    console.log(e);
    browser.close();
  }