// src/hooks/StoreData.tsx

import type {
  ImageData,
  SystemRequirements,
  Trailer,
  BestMatch,
  ProductResponse,
} from '../types/store.types';


// Get best matching product from search API (simplified for finding productId)
export const getBestMatch = async (productName: string): Promise<BestMatch> => {
  const searchUrl = `https://figma-plugin-cors-proxy.azurewebsites.net/microsoft-store/search?query=${encodeURIComponent(productName)}&mediaType=games`;

  try {
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const results: any[] = await response.json();
    if (!results || results.length === 0) {
      throw new Error("No results found for product name");
    }

    const firstResult = results[0];
    return {
      productId: firstResult.productId || "",
      title: firstResult.title || "",
      publisherName: firstResult.publisherName || "",
    };
  } catch (error) {
    console.error("Error finding best match:", error);
    throw error;
  }
};

// Get comprehensive product data using productId from product-info API
export const getProductData = async (
  productId: string,
): Promise<ProductResponse> => {
  const productInfoUrl = `https://figma-plugin-cors-proxy.azurewebsites.net/microsoft-store/product-info?query=${encodeURIComponent(productId)}`;

  try {
    const response = await fetch(productInfoUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const results: any[] = await response.json();
    if (!results || results.length === 0) {
      throw new Error("No product info found for productId");
    }

    const productData = results[0];
    const productInfo = productData.results;

    // Process images with new structure
    const images: ImageData[] = (productInfo.images || []).map((img: any) => ({
      imageType: img.imageType || "Image",
      url: img.url,
      height: img.height || 0,
      width: img.width || 0,
      backgroundColor: img.backgroundColor,
      foregroundColor: img.foregroundColor,
      caption: img.caption,
      imagePositionInfo: img.imagePositionInfo,
      // Legacy support
      ImageType: img.imageType,
      Url: img.url,
      Height: img.height || 0,
      Width: img.width || 0,
    }));

    // Process screenshots
    const screenshots: ImageData[] = (productInfo.screenshots || []).map(
      (img: any) => ({
        imageType: img.imageType || "screenshot",
        url: img.url,
        height: img.height || 0,
        width: img.width || 0,
        backgroundColor: img.backgroundColor,
        foregroundColor: img.foregroundColor,
        caption: img.caption,
        imagePositionInfo: img.imagePositionInfo,
      }),
    );

    // Process trailers
    const trailers: Trailer[] = (productInfo.trailers || []).map(
      (trailer: any) => ({
        title: trailer.title,
        videoPurpose: trailer.videoPurpose,
        url: trailer.url,
        height: trailer.height || 0,
        width: trailer.width || 0,
        image: {
          imageType: trailer.image?.imageType || "trailer",
          url: trailer.image?.url || "",
          height: trailer.image?.height || 0,
          width: trailer.image?.width || 0,
          caption: trailer.image?.caption,
        },
        sortOrder: trailer.sortOrder,
      }),
    );

    // Find specific image types for backward compatibility
    const findImageByType = (type: string): ImageData | null => {
      const image = images.find(
        (img) => img.imageType?.toLowerCase() === type.toLowerCase(),
      );
      return image || null;
    };

    const findHeroImage = (): ImageData | null => {
      return (
        findImageByType("hero") ||
        images.find((img) => img.width > img.height) ||
        images[0] ||
        null
      );
    };

    // Process system requirements
    const systemRequirements: SystemRequirements | undefined =
      productInfo.systemRequirements
        ? {
            minimum: {
              title: productInfo.systemRequirements.minimum?.title || "Minimum",
              items: productInfo.systemRequirements.minimum?.items || [],
            },
            recommended: {
              title:
                productInfo.systemRequirements.recommended?.title ||
                "Recommended",
              items: productInfo.systemRequirements.recommended?.items || [],
            },
          }
        : undefined;

    const productResponse: ProductResponse = {
      // Core product information
      productId: productInfo.productId || productId,
      title: productInfo.title || "",
      shortTitle: productInfo.shortTitle,
      description: productInfo.description || "",
      shortDescription: productInfo.shortDescription,
      publisherName: productInfo.publisherName || "",
      developerName: productInfo.developerName,

      // Categories and classification
      categoryId: productInfo.categoryId,
      categoryIds: productInfo.categoryIds,
      categories: productInfo.categories,

      // Images and media
      images: images,
      screenshots: screenshots,
      trailers: trailers,
      iconUrl: productInfo.iconUrl,
      posterArtUrl: productInfo.posterArtUrl,
      boxArtUrl: productInfo.boxArtUrl,
      heroImageUrl: productInfo.heroImageUrl,
      iconUrlBackground: productInfo.iconUrlBackground,

      // Specific image types for backward compatibility
      Poster: findImageByType("Poster"),
      BoxArt: findImageByType("BoxArt"),
      SuperHeroArt: findHeroImage(),
      Trailer:
        trailers.length > 0
          ? ({
              imageType: "trailer",
              url: trailers[0].url,
              height: trailers[0].height,
              width: trailers[0].width,
              VideoPurpose: trailers[0].videoPurpose,
            } as ImageData)
          : null,

      // Ratings and reviews
      averageRating: productInfo.averageRating,
      ratingCount: productInfo.ratingCount,
      ratingCountFormatted: productInfo.ratingCountFormatted,
      productRatings: productInfo.productRatings,

      // Pricing
      price: productInfo.price || productInfo.priceInfo?.price,
      displayPrice:
        productInfo.displayPrice || productInfo.priceInfo?.displayPrice,
      priceInfo: productInfo.priceInfo,

      // Technical details
      systemRequirements: systemRequirements,
      capabilities: productInfo.capabilities,
      approximateSizeInBytes: productInfo.approximateSizeInBytes,
      maxInstallSizeInBytes: productInfo.maxInstallSizeInBytes,
      supportedLanguages: productInfo.supportedLanguages,

      // Release information
      releaseDateUtc: productInfo.releaseDateUtc,
      lastUpdateDateUtc: productInfo.lastUpdateDateUtc,

      // Additional metadata
      mediaType: productInfo.mediaType,
      hasAddOns: productInfo.hasAddOns,
      hasThirdPartyIAPs: productInfo.hasThirdPartyIAPs,
      gamingOptionsXboxLive: productInfo.gamingOptionsXboxLive,
      allowedPlatforms: productInfo.allowedPlatforms,
    };

    return productResponse;
  } catch (error) {
    console.error("Error fetching comprehensive product data:", error);
    throw error;
  }
};

// Convenience wrapper: Get product data by name (combines getBestMatch + getProductData)
export const getProductDataByName = async (
  productName: string,
): Promise<ProductResponse> => {
  try {
    const bestMatch = await getBestMatch(productName);
    return await getProductData(bestMatch.productId);
  } catch (error) {
    console.error(`Error getting product data for "${productName}":`, error);
    throw error;
  }
};

// Batch processing: Get multiple products efficiently
export const getBatchProductData = async (
  productNames: string[],
): Promise<ProductResponse[]> => {
  try {
    // Step 1: Get all best matches
    const bestMatches = await Promise.all(
      productNames.map(async (name) => {
        try {
          return await getBestMatch(name);
        } catch (error) {
          console.warn(`Failed to find match for "${name}":`, error);
          return null;
        }
      }),
    );

    // Filter out failed matches
    const validMatches = bestMatches.filter(
      (match): match is BestMatch => match !== null,
    );
    const productIds = validMatches.map((match) => match.productId);

    if (productIds.length === 0) {
      throw new Error("No valid product matches found");
    }

    // Step 2: Batch call to product-info API
    const productInfoUrl =
      "https://figma-plugin-cors-proxy.azurewebsites.net/microsoft-store/product-info";
    const response = await fetch(productInfoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productIds: productIds,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const results: any[] = await response.json();

    // Step 3: Process each product result
    const processedResults = await Promise.all(
      results.map(async (productData) => {
        try {
          const productInfo = productData.results;

          // Use the same processing logic as getProductData
          // Process images with new structure
          const images: ImageData[] = (productInfo.images || []).map(
            (img: any) => ({
              imageType: img.imageType || "Image",
              url: img.url,
              height: img.height || 0,
              width: img.width || 0,
              backgroundColor: img.backgroundColor,
              foregroundColor: img.foregroundColor,
              caption: img.caption,
              imagePositionInfo: img.imagePositionInfo,
              // Legacy support
              ImageType: img.imageType,
              Url: img.url,
              Height: img.height || 0,
              Width: img.width || 0,
            }),
          );

          // Find specific image types for backward compatibility
          const findImageByType = (type: string): ImageData | null => {
            const image = images.find(
              (img) => img.imageType?.toLowerCase() === type.toLowerCase(),
            );
            return image || null;
          };

          const findHeroImage = (): ImageData | null => {
            return (
              findImageByType("hero") ||
              images.find((img) => img.width > img.height) ||
              images[0] ||
              null
            );
          };

          return {
            // Core product information
            productId: productInfo.productId || productData.productId,
            title: productInfo.title || "",
            shortTitle: productInfo.shortTitle,
            description: productInfo.description || "",
            shortDescription: productInfo.shortDescription,
            publisherName: productInfo.publisherName || "",
            developerName: productInfo.developerName,

            // Categories and classification
            categoryId: productInfo.categoryId,
            categoryIds: productInfo.categoryIds,
            categories: productInfo.categories,

            // Images and media
            images: images,
            screenshots: (productInfo.screenshots || []).map((img: any) => ({
              imageType: img.imageType || "screenshot",
              url: img.url,
              height: img.height || 0,
              width: img.width || 0,
              backgroundColor: img.backgroundColor,
              foregroundColor: img.foregroundColor,
              caption: img.caption,
              imagePositionInfo: img.imagePositionInfo,
            })),
            trailers: (productInfo.trailers || []).map((trailer: any) => ({
              title: trailer.title,
              videoPurpose: trailer.videoPurpose,
              url: trailer.url,
              height: trailer.height || 0,
              width: trailer.width || 0,
              image: {
                imageType: trailer.image?.imageType || "trailer",
                url: trailer.image?.url || "",
                height: trailer.image?.height || 0,
                width: trailer.image?.width || 0,
                caption: trailer.image?.caption,
              },
              sortOrder: trailer.sortOrder,
            })),
            iconUrl: productInfo.iconUrl,
            posterArtUrl: productInfo.posterArtUrl,
            boxArtUrl: productInfo.boxArtUrl,
            heroImageUrl: productInfo.heroImageUrl,
            iconUrlBackground: productInfo.iconUrlBackground,

            // Specific image types for backward compatibility
            Poster: findImageByType("Poster"),
            BoxArt: findImageByType("BoxArt"),
            SuperHeroArt: findHeroImage(),
            Trailer: null, // Simplified for batch processing

            // Ratings and reviews
            averageRating: productInfo.averageRating,
            ratingCount: productInfo.ratingCount,
            ratingCountFormatted: productInfo.ratingCountFormatted,
            productRatings: productInfo.productRatings,

            // Pricing
            price: productInfo.price || productInfo.priceInfo?.price,
            displayPrice:
              productInfo.displayPrice || productInfo.priceInfo?.displayPrice,
            priceInfo: productInfo.priceInfo,

            // Technical details
            systemRequirements: productInfo.systemRequirements,
            capabilities: productInfo.capabilities,
            approximateSizeInBytes: productInfo.approximateSizeInBytes,
            maxInstallSizeInBytes: productInfo.maxInstallSizeInBytes,
            supportedLanguages: productInfo.supportedLanguages,

            // Release information
            releaseDateUtc: productInfo.releaseDateUtc,
            lastUpdateDateUtc: productInfo.lastUpdateDateUtc,

            // Additional metadata
            mediaType: productInfo.mediaType,
            hasAddOns: productInfo.hasAddOns,
            hasThirdPartyIAPs: productInfo.hasThirdPartyIAPs,
            gamingOptionsXboxLive: productInfo.gamingOptionsXboxLive,
            allowedPlatforms: productInfo.allowedPlatforms,
          } as ProductResponse;
        } catch (error) {
          console.error(
            `Error processing product data for ID ${productData.productId}:`,
            error,
          );
          throw error;
        }
      }),
    );

    return processedResults;
  } catch (error) {
    console.error("Error in batch product data fetch:", error);
    throw error;
  }
};
