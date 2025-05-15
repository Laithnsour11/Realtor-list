"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import fetch from "node-fetch";

interface GeocodingResponse {
  features: Array<{
    center: [number, number];
  }>;
}

export const geocodeAddress = action({
  args: { address: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.MAPBOX_API_KEY;
    if (!apiKey) {
      throw new Error("MAPBOX_API_KEY environment variable not set");
    }

    const encodedAddress = encodeURIComponent(args.address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = (await response.json()) as GeocodingResponse;
    if (!data.features?.length) {
      return null;
    }

    const [lng, lat] = data.features[0].center;
    return { lat, lng };
  },
});
