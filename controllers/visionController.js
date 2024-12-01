// Import the Google Cloud client library
const vision = require('@google-cloud/vision');

// Instantiate a Vision client
const client = new vision.ImageAnnotatorClient({
  keyFilename: './config/project1-433816-82244318ee01.json', // Update with your key file
});

// // Array of image URLs to process
// const imageUrls = [
//   'https://example.com/image1.jpg',
//   'https://example.com/image2.jpg',
//   // Add more URLs
// ];

// Function to annotate images using Vision API
async function processImages(urls) {
  const results = [];

  for (const url of urls) {
    try {
      // Perform label detection (you can change this to other features like text detection)
      const [response] = await client.annotateImage({
        image: { source: { imageUri: url } },
        features: [{ type: 'LABEL_DETECTION' }],
      });

      const labels = response.labelAnnotations.map(label => label.description);
      results.push({ url, labels });
      console.log(`Processed: ${url}`, labels);
    } catch (err) {
      console.error(`Failed to process ${url}:`, err.message);
      results.push({ url, error: err.message });
    }
  }

  return results;
}


// Function to annotate images using Vision API
async function processImage(url) {
    let results ;
  
    // for (const url of urls) {
      try {
        // Perform label detection (you can change this to other features like text detection)
        const [response] = await client.annotateImage({
          image: { source: { imageUri: url } },
          features: [{ type: 'LABEL_DETECTION' }],
        });
  
        const labels = response.labelAnnotations.map(label => label.description);
        // results.push({ url, labels });
        results = { url, labels };
        // console.log(`Processed: ${url}`, labels);
      } catch (err) {
        console.error(`Failed to process ${url}:`, err.message);
        results= { url, error: err.message };
      }
    // }
  
    return results;
  }


// export default {processImages,processImage};
module.exports ={processImages,processImage};
// Run the function and output results
// processImages(imageUrls)
//   .then(results => console.log('Processing complete:', results))
//   .catch(err => console.error('Error during processing:', err));
