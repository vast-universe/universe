import { z, defineCollection } from "astro:content";

const metadataDefinition = () =>
    z
        .object({
            title: z.string().optional(),
            ignoreTitleTemplate: z.boolean().optional(),

            canonical: z.string().url().optional(),

            robots: z
                .object({
                    index: z.boolean().optional(),
                    follow: z.boolean().optional(),
                })
                .optional(),

            description: z.string().optional(),

            openGraph: z
                .object({
                    url: z.string().optional(),
                    siteName: z.string().optional(),
                    images: z
                        .array(
                            z.object({
                                url: z.string(),
                                width: z.number().optional(),
                                height: z.number().optional(),
                            }),
                        )
                        .optional(),
                    locale: z.string().optional(),
                    type: z.string().optional(),
                })
                .optional(),

            twitter: z
                .object({
                    handle: z.string().optional(),
                    site: z.string().optional(),
                    cardType: z.string().optional(),
                })
                .optional(),
        })
        .optional();

const blogCollection = defineCollection({
    schema: z.object({
        publishDate: z.date().optional(),
        updateDate: z.date().optional(),
        draft: z.boolean().optional(),

        title: z.string(),
        excerpt: z.string().optional(),
        image: z.string().optional(),

        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        author: z.string().optional(),
        authors: z.array(z.string()).optional(),
        description: z.string().optional(),

        metadata: metadataDefinition(),
    }),
});

const authorCollection = defineCollection({
    schema: z.object({
        image: z.string().optional(),
        name: z.string(),
        title: z.string().optional(),
        profession: z.string().optional(),
        twitter: z.string().optional(),
        mastodon: z.string().optional(),
        github: z.string().optional(),
        juejin: z.string().optional(),
    }),
});

export const collections = {
    blogs: blogCollection,
    authors: authorCollection,
};
