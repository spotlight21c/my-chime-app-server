const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
const cors = require("cors");
app.use(express.json());
app.use(cors());

// You will need AWS credentials configured before calling AWS or Amazon Chime APIs.
// You must use "us-east-1" as the region for Chime API and set the endpoint.
const chime = new AWS.Chime({ region: "us-east-1" });
chime.endpoint = new AWS.Endpoint("https://service.chime.aws.amazon.com/console");

app.post("/meetings", async (req, res) => {
    try {
        const response = await chime
            .createMeeting({
                ClientRequestToken: uuid(),
                MediaRegion: "ap-northeast-1", // Specify the region in which to create the meeting.
            })
            .promise();

        res.send(response);
    } catch (err) {
        res.send(err);
    }
});

app.post("/attendees", async (req, res) => {
    try {
        const response = await chime
            .createAttendee({
                MeetingId: req.body.meetingId,
                ExternalUserId: uuid(), // Link the attendee to an identity managed by your application.
            })
            .promise();

        res.send(response);
    } catch (err) {
        res.send(err);
    }
});

app.listen(5000, () => console.log(`AWS chime server app listening at http://localhost:5000`));
