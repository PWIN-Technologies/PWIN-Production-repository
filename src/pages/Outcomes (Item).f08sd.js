import wixWindow from 'wix-window';
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixStorage from 'wix-storage';

$w.onReady(function () {
    // Initialize button click counts from storage
    initializeClickCounts();
    // Handle Copy to Clipboard for each button
    $w("#button1").onClick(() => {
        incrementClickCount("button1");
        copyTextToClipboard("#collapsibleText2", "#text379", "The text has been copied");
    });

    $w("#button2").onClick(() => {
        incrementClickCount("button2");
        copyTextToClipboard("#collapsibleText7", "#text381", "The text has been copied");
    });

    $w("#button3").onClick(() => {
        incrementClickCount("button3");
        copyTextToClipboard("#collapsibleText8", "#text378", "The text has been copied");
    });

    $w("#button4").onClick(() => {
        incrementClickCount("button4");
        copyTextToClipboard("#collapsibleText9", "#text377", "The text has been copied");
    });

    $w("#button5").onClick(() => {
        incrementClickCount("button5");
        copyTextToClipboard("#collapsibleText10", "#text380", "The text has been copied");
    });
    // Function to increment the click count for a button
    function incrementClickCount(buttonId) {
        let clickCounts = wixStorage.session.getItem("clickCounts");
        clickCounts = clickCounts ? JSON.parse(clickCounts) : {};

        if (!clickCounts[buttonId]) {
            clickCounts[buttonId] = 0;
        }
        clickCounts[buttonId] += 1;

        wixStorage.session.setItem("clickCounts", JSON.stringify(clickCounts));
        updateClickCountDisplay(buttonId, clickCounts[buttonId]);
    }
    // Function to update the click count display on the homepage
    function updateClickCountDisplay(buttonId, count) {
        const displayElementId = `#clickCountDisplay${buttonId}`;
        $w(displayElementId).text = `Button ${buttonId} clicked ${count} times`;
        $w(displayElementId).show();
    }

    // Initialize button click counts from storage
    function initializeClickCounts() {
        let clickCounts = wixStorage.session.getItem("clickCounts");
        clickCounts = clickCounts ? JSON.parse(clickCounts) : {};

        // Update display for each button
        ["button1", "button2", "button3", "button4", "button5"].forEach(buttonId => {
            const count = clickCounts[buttonId] || 0;
            updateClickCountDisplay(buttonId, count);
        });
    }

    // Function to copy text from a specific collapsible element to clipboard
    function copyTextToClipboard(collapsibleTextId, successMessageId, successMessage) {
        // Get the text from the specified collapsible element
        const textToCopy = $w(collapsibleTextId).text;

        if (textToCopy.trim()) {  // Check if there is any non-empty text to copy
            wixWindow.copyToClipboard(textToCopy)
                .then(() => {
                    $w(successMessageId).text = successMessage;
                    $w(successMessageId).show();
                })
                .catch((error) => {
                    console.error("Failed to copy text: ", error);
                });
        } else {
            console.error("No text found to copy.");
        }
    }

    // Handle Rating Submission (remains the same as before)
    $w("#ratingsInput1").onChange(async (event) => {
        const ratingValue = event.target.value;  // Get the rating value
        const user = wixUsers.currentUser;      // Get the current user

        if (user.loggedIn) {
            const userId = user.id;             // Get the user's ID
            const pageId = $w("#dynamicDataset").getCurrentItem()._id; // Get the page ID dynamically

            try {
                // Check if the user has already rated this page
                let existingRating = await wixData.query("UserOutcomeRating")
                    .eq("userId", userId)
                    .eq("pageId", pageId)
                    .find();

                if (existingRating.items.length > 0) {
                    // Update the existing rating
                    let ratingToUpdate = existingRating.items[0];
                    ratingToUpdate.ratingValue = ratingValue;

                    await wixData.update("UserOutcomeRating", ratingToUpdate);
                    console.log("Rating updated successfully");
                } else {
                    // Create a new rating entry
                    let newRating = {
                        "ratingId": `${userId}-${pageId}`,  // Construct a unique rating ID
                        "userId": userId,
                        "pageId": pageId,
                        "ratingValue": ratingValue
                    };

                    await wixData.insert("UserOutcomeRating", newRating);
                    console.log("Rating saved successfully");
                }
            } catch (error) {
                console.error("Error handling rating submission: ", error);
            }
        } else {
            console.error("User is not logged in.");
        }
    });
});
