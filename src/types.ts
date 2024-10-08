export type userDataType = {
    id: number,
    wallet_address: string,
    name: string,
    surname: string,
    instagram?: string,
    tiktok?: string,
    twitter?: string,
    linkedin?: string,
    description?: string,
    image: string,
};

export type wishListDataType = {
    id: number,
    user_id: number,
    wallet_address: string,
    isprivate: boolean,
    image: string,
    description: string,
    name: string,
};
