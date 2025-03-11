export interface Platform {
    id: string;
    slug: string;
    name: string;
}

export interface Video {
    id: string;
    userId: string;
    platformId: string;
    platformVideoId: string;
    originalUrl: string;
    title: string;
    description: string;
    thumbnail: string;
    uploadedAt: string;
    createdAt: string;
    updatedAt: string;
    platform: Platform;
    categories: string[];
}