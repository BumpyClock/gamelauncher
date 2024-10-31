// src/utils/StoreData.ts

interface ImageData {
  ImageType: string;
  Url: string;
  Height: number;
  Width: number;
  VideoPurpose?: string;
  url?: string;
}

interface ProductData {
  Title: string;
  PublisherName: string;
  ProductId: string;
  Images: ImageData[];
  Previews: ImageData[];
  categories: string[];
  description: string;
  developerName: string;
  iconUrl: string;
  iconUrlBackground: string;
  pdpImageUrl: string;
  posterArtUrl: string;
  publisherName: string;
  title: string;


}

interface ApiResponse {
  Payload: {
    SearchResults: ProductData[];
  };
}

interface ApiResponse2 {
  productsList:  ProductData[];
  
}

interface ProductResponse {
  title: string;
  images: ImageData[];
  publisherName: string;
  productId: string;
  Poster: ImageData | null;
  BoxArt: ImageData | null;
  SuperHeroArt: ImageData | null;
  Trailer: ImageData | null;
}

export const getProductData = async (productName: string): Promise<ProductResponse> => {
  const url = `https://figma-plugin-cors-proxy.azurewebsites.net/microsoft-store?query=${productName}&mediaType=games`;
  const url2 = `https://apps.microsoft.com/api/products/search?gl=US&hl=en-us&query=${productName}&mediaType=all&age=all&price=all&category=all&subscription=all&cursor=`

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiResponse = await response.json();

    const response2 = await fetch(url2);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data2: ApiResponse2 = await response2.json();
    console.log(data2.productsList[0].title);

    return createResponse(data);
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
};

const createResponse = (data: ApiResponse): ProductResponse => {
  const bestGuess = data.Payload.SearchResults[0];
  // Extract and combine images from Images and Previews arrays
  const images: ImageData[] = [
    ...bestGuess.Images.map((image) => ({
      ImageType: image.ImageType,
      Url: image.Url,
      Height: image.Height,
      Width: image.Width,
    })),
    ...bestGuess.Previews.map((preview) => ({
      ImageType: preview.ImageType,
      Url: preview.Url,
      Height: preview.Height,
      Width: preview.Width,
      VideoPurpose: preview.VideoPurpose,
    })),
  ];

  // Helper function to find image by type
  const findImageByType = (type: string): ImageData | null => {
    const image = images.find((img) => img.ImageType === type);
    return image ? { ImageType: image.ImageType, Url: image.Url, Height: image.Height, Width: image.Width } : null;
  };

  // Helper function to find video by purpose
  const findVideoByPurpose = (purpose: string): ImageData | null => {
    const video = images.find((img) => img.VideoPurpose === purpose);
    return video ? { ImageType: video.ImageType, Url: video.Url, Height: video.Height, Width: video.Width } : null;
  };

  const response: ProductResponse = {
    title: bestGuess.Title,
    images: images,
    publisherName: bestGuess.PublisherName,
    productId: bestGuess.ProductId,
    Poster: findImageByType('Poster'),
    BoxArt: findImageByType('BoxArt'),
    SuperHeroArt: findImageByType('SuperHeroArt'),
    Trailer: findVideoByPurpose('HeroTrailer') || findVideoByPurpose('trailer'),
  };


  return response;
};
