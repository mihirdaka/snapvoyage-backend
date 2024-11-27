// const axios = require('axios');
// const vision = require('@google-cloud/vision');

// // Initialize the Google Vision client
// const visionClient = new vision.ImageAnnotatorClient();

// async function getPinterestPins(boardId, accessToken) {
//     const url = `https://api.pinterest.com/v1/boards/${boardId}/pins/`;
//     try {
//       const response = await axios.get(url, {
//         params: { access_token: accessToken },
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       return response.data.data; // List of pins
//     } catch (error) {
//       console.error('Error fetching Pinterest pins:', error.message);
//       return [];
//     }
//   }

//   async function analyzeImage(imageUrl) {
//     try {
//       // Fetch the image content
//       const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//       const image = Buffer.from(response.data, 'binary');
  
//       // Send the image for label detection
//       const [result] = await visionClient.labelDetection({ image: { content: image } });
//       const labels = result.labelAnnotations;
  
//       // Extract and return the label descriptions
//       return labels.map(label => label.description);
//     } catch (error) {
//       console.error('Error analyzing image:', error.message);
//       return [];
//     }
//   }

//   async function groupPinsByLabels(pins) {
//     const groupedPins = {};
  
//     for (let pin of pins) {
//       const imageUrl = pin.image.original.url;
//       const labels = await analyzeImage(imageUrl);
  
//       // Group pins by labels
//       for (let label of labels) {
//         if (!groupedPins[label]) {
//           groupedPins[label] = [];
//         }
//         groupedPins[label].push(pin);
//       }
//     }
  
//     return groupedPins;
//   }

//   async function createPinterestBoard(boardName, accessToken) {
//     const url = `https://api.pinterest.com/v1/boards/`;
//     try {
//       const response = await axios.post(
//         url,
//         { name: boardName },
//         { params: { access_token: accessToken } }
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error('Error creating Pinterest board:', error.message);
//     }
//   }

//   (async () => {
//     const accessToken = 'pina_AMA3SAQXACIXQAIAGDAMECKZ3BOWZEYBACGSOMWGTEIWY3ERX4CBU4T5RASJOI3LVULN5JEVJ27URYUVHTPWUD2D5KML5JIA';
//     const boardId = 'realreddiwip/sweet-summer-treats';
  
//     console.log('Fetching pins from Pinterest...');
//     const pins = await getPinterestPins(boardId, accessToken);
  
//     console.log('Analyzing images and grouping by labels...');
//     const groupedPins = await groupPinsByLabels(pins);
  
//     console.log('Grouped Pins:', groupedPins);
  
//     console.log('Creating boards for categories...');
//     for (const [label, pins] of Object.entries(groupedPins)) {
//       const board = await createPinterestBoard(label, accessToken);
//       console.log(`Created board for "${label}":`, board);
//     }
//   })();
  