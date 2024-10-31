// src/utils/StoreData.js

export const getProductData = async (productName) => {
  const url = `https://figma-plugin-cors-proxy.azurewebsites.net/microsoft-store?query=${productName}&mediaType=games`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return createResponse(data);
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
};

const createResponse = (data) => {
  const bestGuess = data.Payload.SearchResults[0];
  // Extract and combine images from Images and Previews arrays
  const images = [
    ...bestGuess.Images.map(image => ({
      ImageType: image.ImageType,
      Url: image.Url,
      Height: image.Height,
      Width: image.Width
    })),
    ...bestGuess.Previews.map(preview => ({
      ImageType: preview.ImageType,
      Url: preview.Url,
      Height: preview.Height,
      Width: preview.Width,
      VideoPurpose: preview.VideoPurpose
    }))
  ];

  // Helper function to find image by type
  const findImageByType = (type) => {
    const image = images.find(img => img.ImageType === type);
    return image ? { Url: image.Url, Height: image.Height, Width: image.Width } : null;
  };

  // Helper function to find video by purpose
  const findVideoByPurpose = (purpose) => {
    const video = images.find(img => img.VideoPurpose === purpose);
    return video ? { Url: video.Url, Height: video.Height, Width: video.Width } : null;
  };

  const response = {
    title: bestGuess.Title,
    images: images,
    publisherName: bestGuess.PublisherName,
    productId: bestGuess.ProductId,
    Poster: findImageByType('Poster'),
    BoxArt: findImageByType('BoxArt'),
    SuperHeroArt: findImageByType('SuperHeroArt'),
    Trailer:  findVideoByPurpose('HeroTrailer') || findVideoByPurpose('trailer')
  };


  return response;
};