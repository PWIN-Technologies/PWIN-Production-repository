import wixData from 'wix-data';
import wixUsers from 'wix-users';

$w.onReady(function () {
  $w('#button15').onClick(() => {
        // Scroll to the section with ID 'section9'
        $w('#section9').scrollTo();
    });
    
  // Section 1: Handling Repeater Item Setup
  $w("#repeater1").onItemReady(($item, itemData) => {
    $item("#text214").text = itemData.title;
    $item("#text215").text = itemData.shortDescription;
    $item("#text216").text = itemData.category;
    $item("#text217").text = itemData.subCategory;
    $item("#text330").text = itemData.jobRoles;
  });

  // Section 2: Search Functionality
  async function search() {
    const query = $w("#input2").value;

    // Insert the user search input into the UserSearchData collection
    if (query) {
      await wixData.insert("UserSearchData", {
        searchInput: query,
        createdAt: new Date() // Optional: Store the date and time of the search
      });
    }

    const titleQuery = wixData.query("Import139").contains("title", query);
    const shortDescriptionQuery = wixData.query("Import139").contains("shortDescription", query);
    const categoryQuery = wixData.query("Import139").contains("category", query);
    const subCategoryQuery = wixData.query("Import139").contains("subCategory", query);
    const howToUseThePromptQuery = wixData.query("Import139").contains("howToUseThePrompt", query);
    const altTextQuery = wixData.query("Import139").contains("altText", query);
    const tagsQuery = wixData.query("Import139").contains("tags", query);
    const aiModelSQuery = wixData.query("Import139").contains("aiModelS", query);
    const step1 = wixData.query("Import139").contains("step1", query);
    const step2 = wixData.query("Import139").contains("step2", query);
    const step3 = wixData.query("Import139").contains("step3", query);
    const step4 = wixData.query("Import139").contains("step4", query);
    const step5 = wixData.query("Import139").contains("step5", query);
    const topAiTools = wixData.query("Import139").contains("topAiTools", query);
    const proTips = wixData.query("Import139").contains("proTips", query);


    const QueryResult = await titleQuery
      .or(shortDescriptionQuery)
      .or(categoryQuery)
      .or(subCategoryQuery)
      .or(howToUseThePromptQuery)
      .or(altTextQuery)
      .or(tagsQuery)
      .or(aiModelSQuery)
      .find();

    const Import139 = QueryResult.items;

    console.log("Import139", Import139);

    $w("#repeater1").data = Import139;
    $w("#repeater1").expand();
  }

  $w('#button11').onClick(search);

  let throttle;
  $w('#input2').onInput(() => {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      search();
    }, 500);
  });

  // Section 3: Handling Member Submissions
  if (wixUsers.currentUser.loggedIn) {
    let user = wixUsers.currentUser;
    user.getEmail().then((email) => {
      let userId = user.id; // user ID
      // Fetch the user's profile data if needed
      wixData.query("Members/PrivateMembersData")
        .eq("_id", userId)
        .find()
        .then((results) => {
          if (results.items.length > 0) {
            let userName = results.items[0].firstName + ' ' + results.items[0].lastName;
            $w("#button13").onClick(() => {
              let desiredOutcome = $w("#textBox1").value;
              let submissionDateTime = new Date();

              wixData.insert("memberSubmissions", {
                "Name": userName,
                "Email ID": email,
                "Desired Outcome": desiredOutcome,
                "Submission Date and Time": submissionDateTime
              })
              .then(() => {
                // Handle successful submission, e.g., show a thank you message
                $w("#text335").show();
              })
              .catch((error) => {
                console.log(error);
              });
            });
          }
        });
    });
  }
});
