const axios = require('axios');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = require('../config');
const vision = require('@google-cloud/vision');

const visionController = require('./visionController');
const openaiController = require('./openaiController');
// Initialize the Google Vision client
const visionClient = new vision.ImageAnnotatorClient();
// Redirect user to Pinterest login
exports.getPinterestAuth = (req, res) => {
    const authUrl = `https://www.pinterest.com/oauth/?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=boards:read,pins:read&state=12345`;
    res.json({ url: authUrl });
};

// Handle Pinterest OAuth callback
exports.pinterestCallback = async (req, res) => {
    console.log('Pinterest callback:', req.query);
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code missing' });
    }

    try {
        // Exchange auth code for access token
        console.log(`Exchanging auth code for access token ${code} ${CLIENT_ID} ${CLIENT_SECRET} ${REDIRECT_URI}`);
        const response = await axios.post('https://api.pinterest.com/v5/oauth/token', {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: req.query.code,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',  // Specify content type as JSON
                'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
            },
        });

        console.log('Access token response:', response.data);
        const accessToken = response.data.access_token;
        res.cookie('pinterestToken', accessToken, {
            httpOnly: true,  // Prevent JavaScript access
            // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'Strict', // Prevent cross-site cookie issues
            maxAge: 3600000, // 1 hour expiration
        });

        // Redirect the user to the dashboard
        res.redirect('http://localhost:3000/dashboard');

    } catch (error) {
        // console.log('Error fetching access token:', error);
        console.error('Error fetching access token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
};
// Example usage
exports.fetchUserBoardsAndPins = async (req, res) => {
    const accessToken = req.cookies.pinterestToken;
    let allPins = [];

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized: Missing access token' });
    }
    try {

        allPins = await getAllPins(accessToken);
    const groupedPins = await groupPinsByLabels(allPins);
  
        console.log('Grouped Pins:', groupedPins);
        const summarizeEvents = await openaiController.createTimeline(groupedPins);
        return res.json({ "status": true, "data": (summarizeEvents)});

    } catch (error) {
        console.error('Error in fetching data:', error.message);
    }
}



// Fetch all pins
async function getAllPins(accessToken) {
    // const { accessToken, boardId } = req.query;

    try {
        const response = await axios.get(`https://api.pinterest.com/v5/pins`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                ContentType: 'application/json',
                Accept: 'application/json',
            },
        });
            // filter and get only created_at, description, media.images.1200x, id, title
            const pins = response.data.items.map(pin => {
                return {
                    created_at: pin.created_at,
                    description: pin.description,
                    image: pin.media.images['1200x'].url,
                    id: pin.id,
                    title: pin.title,
                };
            });
        return pins;
    } catch (error) {
        console.error('Error fetching pins:', error.response?.data || error.message);
        return { error: 'Failed to fetch pins' };
    }
};
// Fetch user boards
async function getUserBoards(accessToken) {
    // console.log(req);
    // console.log(req.cookies);


    console.log('accessToken:', accessToken);
    try {
        const response = await axios.get('https://api.pinterest.com/v5/boards', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                ContentType: 'application/json',
                Accept: 'application/json',
            },
        });

        // console.log(response.data);
        return response.data.items;

    } catch (error) {
        console.error('Error fetching boards:', error.response?.data || error.message);
        return { error: 'Failed to fetch boards' };
    }
}

// Fetch pins from a board
async function getBoardPins(boardId, accessToken) {
    // const { accessToken, boardId } = req.query;

    try {
        const response = await axios.get(`https://api.pinterest.com/v5/boards/${boardId}/pins`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                ContentType: 'application/json',
                Accept: 'application/json',
            },
        });

        return response.data.items;
    } catch (error) {
        console.error('Error fetching pins:', error.response?.data || error.message);
        return { error: 'Failed to fetch pins' };
    }
};





  async function analyzeImage(imageUrl) {
    try {
      // Fetch the image content
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const image = Buffer.from(response.data, 'binary');
  
      // Send the image for label detection
      const [result] = await visionClient.labelDetection({ image: { content: image } });
      const labels = result.labelAnnotations;
  
      // Extract and return the label descriptions
      return labels.map(label => label.description);
    } catch (error) {
      console.error('Error analyzing image:', error.message);
      return [];
    }
  }

  async function groupPinsByLabels(pins) {
    const groupedPins = {};
  
    for (let pin of pins) {
      const imageUrl = pin.image;
    //   console.log(imageUrl);
      const labels = await visionController.processImage(imageUrl);
      pin.labels = labels.labels;
        // console.log(labels);
      // Group pins by labels
    //   for (let label of labels.labels) {
    //     if (!groupedPins[label]) {
    //       groupedPins[label] = [];
    //     }
        // groupedPins[label].push(pin);
    //   }
    }
  
    return pins;
  }
