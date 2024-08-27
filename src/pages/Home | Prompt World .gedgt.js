// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction
import { currentMember } from 'wix-members';

$w.onReady(async function () {
    try {
        const member = await currentMember.getMember();
        if (member) {
            // User is logged in
            $w("#button1").label = "Explore Outcomes";
        } else {
            // User is not logged in
            $w("#button1").label = "Request Early Access";
        }
    } catch (error) {
        console.error("Error checking member status:", error);
    }
});
