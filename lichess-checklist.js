const CHECKLIST_FNAME = "checklist.txt";
const CSS_FNAME = "checklist_styles.css";

const CHECKLIST_PARENT_CLASS = "round__side";

let checkList;
let checkListItems = [];
let mainElement;
let titleObserver;

async function loadAccessibleResource(resourcePath)
{
	let resource = await fetch(browser.runtime.getURL(resourcePath));
	let text = await resource.text();
	return text;
}

const TITLE_NOGAME = -1;
const TITLE_TURN = 0;
const TITLE_ENEMY = 1;
const INGAME_TITLES = 
[
	"Your turn ",
	"Waiting for opponent "
];

function getTitleIndex(title)
{
	title = title || document.title;
	let titleParts = title.split('-');
	return INGAME_TITLES.indexOf(titleParts[0]);
}

(async function()
{
	// Make sure that the script doesn't run twice.
	if(window.hasRun)
		return;
	window.hasRun = true;

	// Inject our CSS onto the site
	let link = document.createElement("LINK");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = browser.runtime.getURL(CSS_FNAME);
	document.head.appendChild(link);

	// Load the checklist from the "checklist.txt"-file
	checkList = (await loadAccessibleResource(CHECKLIST_FNAME)).split('\n');

	// Create the main element
	mainElement = document.createElement("DIV");
	mainElement.id = "checklist";
	mainElement.className = "hidden";
	
	// Create the checklist items and their respective checkboxes
	for(let i = 0; i < checkList.length - 1; ++i)
	{
		// Add breaks in case of empty instructions
		if(checkList[i].length < 2)
		{
			let checkListBreak = document.createElement("HR");
			checkListBreak.className = "checklist-break";
			mainElement.appendChild(checkListBreak);
			continue;
		}

		// class CheckListItem defined in "checklist-item.js"
		let item = new CheckListItem(checkList[i]);
		item.appendTo(mainElement);
		checkListItems.push(item);
	}

	// Observe the title and its changes
	titleObserver = new MutationObserver((mutations) =>
	{
		let titleIndex = getTitleIndex(mutations[0].target.nodeValue);

		if(titleIndex == TITLE_TURN)
		{
			// It's our turn! Show the checklist.
			if(!document.body.contains(mainElement))
			{
				// Add the element in case it's not yet added
				document.getElementsByClassName(CHECKLIST_PARENT_CLASS)[0].appendChild(mainElement);
			}
			mainElement.className = "shown";

			for(let item of checkListItems)
			{
				// Clear the selections of the checkListItems
				item.clear();
			}

		} else if(titleIndex == TITLE_ENEMY)
		{
			// It's enemys turn! Hide the checklist.
			mainElement.className = "hidden";
		}
	});
	titleObserver.observe(document.getElementsByTagName("title")[0], {characterData: true, childList: true});
})();
