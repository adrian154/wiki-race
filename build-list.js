const USER_AGENT = "WikiRace (+https://github.com/adrian154/wiki-race)";

// get pages in category
const getInCategory = async category => {
    
    const pages = [];
    let continueKey = null;

    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("list", "categorymembers");
    url.searchParams.set("cmtitle", category);
    url.searchParams.set("cmlimit", 500);
    url.searchParams.set("format", "json");
    do {
        
        if(continueKey) {
            url.searchParams.set("cmcontinue", continueKey);
        }

        try {
            const resp = await fetch(url, {headers: {"User-Agent": USER_AGENT}});
            const data = await resp.json();
            pages.push(...data.query.categorymembers);
            continueKey = data.continue?.cmcontinue;
        } catch(err) {
            console.log("Error while processing " + category);
            throw err;
        }

    } while(continueKey);

    return Promise.all(pages.flatMap(page => {
        if(page.title.match(/^Category:/)) {
            return getInCategory(page.title);
        }
        return {id: page.pageid, title: page.title};
    }));

};

getInCategory("Category:All_Wikipedia_vital_articles").then(data=>require("fs").writeFileSync("vital.json", JSON.stringify(data)));