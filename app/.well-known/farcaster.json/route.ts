function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;
  
  // Parse screenshot URLs from comma-separated string
  const screenshotUrls = process.env.NEXT_PUBLIC_SCREENSHOT_URLS
    ? process.env.NEXT_PUBLIC_SCREENSHOT_URLS.split(',')
    : [];
  
  // Parse tags from comma-separated string
  const tags = process.env.NEXT_PUBLIC_TAGS
    ? process.env.NEXT_PUBLIC_TAGS.split(',')
    : [];

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    baseBuilder: {
      allowedAddresses: [process.env.BASE_BUILDER_ALLOWED_ADDRESS],
    },
    miniapp: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      homeUrl: URL,
      iconUrl: process.env.NEXT_PUBLIC_ICON_URL,
      splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      screenshotUrls: screenshotUrls,
      primaryCategory: process.env.NEXT_PUBLIC_PRIMARY_CATEGORY,
      tags: tags,
      heroImageUrl: process.env.NEXT_PUBLIC_HERO_IMAGE,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_OG_IMAGE,
      buttonTitle: process.env.NEXT_PUBLIC_BUTTON_TITLE,
      noindex: process.env.NEXT_PUBLIC_NOINDEX === 'true',
    }),
  });
}