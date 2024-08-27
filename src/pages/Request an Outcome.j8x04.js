import wixData from 'wix-data';
import wixUsers from 'wix-users';

$w.onReady(function () {
    // Check if the user is logged in
    if (wixUsers.currentUser.loggedIn) {
        // Get the current user's ID
        let user = wixUsers.currentUser;
        let userId = user.id;

        // Query the Members/PrivateMembersData collection to get the user's details
        wixData.query("Members/PrivateMembersData")
            .eq("_id", userId)
            .find()
            .then((results) => {
                if (results.items.length > 0) {
                    let userInfo = results.items[0];
                    // Populate the name and email fields with the user's details
                    $w('#input2').value = userInfo.firstName + " " + userInfo.lastName;
                    $w('#input3').value = userInfo.loginEmail;
                }
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });
    }

    $w('#button1').onClick(() => {
        const name = $w('#input2').value;
        const emailId = $w('#input3').value;
        const desiredOutcome = $w('#textBox1').value;
        const submissionDateAndTime = new Date();
        // Get the selected tags from the selection tag element
        const selectedCategories = $w('#selectionTags1').value;

        const newEntry = {
            name: name,
            emailId: emailId,
            desiredOutcome: desiredOutcome,
            submissionDateAndTime: submissionDateAndTime,
            category: selectedCategories  // Store the selected tags in the 'category' field
        };

        wixData.insert('MemberSubmissions', newEntry)
            .then(() => {
                $w('#text325').text = "Thank you! Your submission has been received.";
                $w('#text325').show();
                $w('#text326').hide();
                
                $w('#input2').value = "";
                $w('#input3').value = "";
                $w('#textBox1').value = "";
                $w('#selectionTags1').value = []; // Reset the selection tag input
            })
            .catch((error) => {
                console.error("Error:", error);
                
                $w('#text326').text = "Oops! Something went wrong. Please try again.";
                $w('#text326').show();
                $w('#text325').hide()
            });
    });
});

