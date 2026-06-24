import { Inject, Injectable } from "@nestjs/common";
import { v2 as cloudinaryType } from 'cloudinary';

@Injectable()
export class CloudinaryService {

    constructor(
        @Inject('CLOUDINARY')
        private readonly cloudinary: typeof cloudinaryType,
    ){}

    async uploadFile(filePath: string, folder: string) {
        try{
            const result = await this.cloudinary.uploader.upload(filePath, {folder});

            return{url: result.secure_url,public_id: result.public_id};
        }
        catch(error){
            const err = error as Error;
            throw new Error(`Cloudinary upload failed: ${err.message}`);
        }
    }

    async deleteFile(publicId: string) {
        return this.cloudinary.uploader.destroy(publicId);
    }

}
